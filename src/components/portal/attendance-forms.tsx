import { useActionState, useState } from "react";
import { useRouter } from "@/lib/router";
import { useActions } from "@/lib/store";
import { formatTime, isoWeekday } from "@/lib/gym-time";
import type { ActionState, GymClass, RosterMember } from "@/lib/portal";
import { Checkbox, FieldGroup, FormError, FormSuccess, Input, Label, Select } from "@/components/field";
import { Button, rowAction } from "@/components/portal/ui";

/**
 * Date + class picker. Submitting puts the choice in the URL, so the chosen
 * roster can be bookmarked; the class list narrows to classes that run on the
 * picked weekday.
 */
export function ClassPicker({
  classes,
  date,
  classId,
  maxDate,
}: {
  classes: GymClass[];
  date: string;
  classId?: string;
  maxDate: string;
}) {
  const [pickedDate, setPickedDate] = useState(date);
  const options = pickedDate ? classes.filter((c) => c.day === isoWeekday(pickedDate)) : [];
  const [pickedClass, setPickedClass] = useState(classId ?? "");
  const selected = options.some((c) => c.id === pickedClass) ? pickedClass : (options[0]?.id ?? "");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/admin/attendance?date=${pickedDate}&class=${selected}`, { scroll: false });
      }}
      className="grid gap-4 px-5 py-6 sm:px-7 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
      <FieldGroup>
        <Label htmlFor="att-date">Date</Label>
        <Input
          id="att-date"
          name="date"
          type="date"
          required
          max={maxDate}
          value={pickedDate}
          onChange={(e) => setPickedDate(e.target.value)}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="att-class">Class</Label>
        <Select
          id="att-class"
          name="class"
          required
          disabled={options.length === 0}
          value={selected}
          onChange={(e) => setPickedClass(e.target.value)}
        >
          {options.length === 0 ? <option value="">No classes that day</option> : null}
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {formatTime(c.startsAt)}
              {c.label ? ` · ${c.label}` : ""}
            </option>
          ))}
        </Select>
      </FieldGroup>
      <Button type="submit" disabled={!selected}>
        Load roster
      </Button>
    </form>
  );
}

function initials(member: RosterMember) {
  const parts = (member.fullName || member.email).split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)).toUpperCase();
}

/** Checkbox roster. "Discard" returns to what is saved; "Save" replaces it. */
export function RosterForm({
  classId,
  date,
  heading,
  members,
  presentIds,
  lastSaved,
}: {
  classId: string;
  date: string;
  heading: React.ReactNode;
  members: RosterMember[];
  presentIds: string[];
  lastSaved: string | null;
}) {
  const [present, setPresent] = useState(() => new Set(presentIds));
  const { saveAttendance } = useActions();
  const [state, action, pending] = useActionState(saveAttendance, {} as ActionState);

  const toggle = (id: string) =>
    setPresent((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const dirty = present.size !== presentIds.length || presentIds.some((id) => !present.has(id));

  return (
    <form action={action}>
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="date" value={date} />

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
        <div className="text-sm">{heading}</div>
        <div className="flex items-center gap-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash-dim" aria-live="polite">
            <span className="font-display text-3xl font-bold tracking-normal text-blood">{present.size}</span> / {members.length}{" "}
            present
          </p>
          <button
            type="button"
            onClick={() => setPresent(new Set(members.map((m) => m.id)))}
            className={rowAction}
          >
            Mark all present
          </button>
        </div>
      </div>

      {members.length === 0 ? (
        <p className="px-5 py-12 text-center font-mono text-xs tracking-wider text-ash-dim sm:px-7">No one has registered yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {members.map((m) => {
            const checked = present.has(m.id);
            return (
              <li key={m.id}>
                <label className="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2 sm:px-7">
                  <Checkbox name="present" value={m.id} checked={checked} onChange={() => toggle(m.id)} />
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center border border-line-bright font-mono text-[11px] text-bone"
                  >
                    {initials(m)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-bone">{m.fullName || m.email}</span>
                    <span className="kicker mt-1 block">{m.role === "admin" ? "Staff" : "Member"}</span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
                      checked ? "text-bone" : "text-ash-dim"
                    }`}
                  >
                    {checked ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blood" /> : null}
                    {checked ? "Present" : "Not marked"}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-col gap-4 border-t border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="space-y-3">
          <p className={`font-mono text-[10px] tracking-wider ${dirty ? "text-blood-bright" : "text-ash-dim"}`}>
            {dirty ? "Unsaved changes" : lastSaved}
          </p>
          <FormError message={state.error} />
          {state.ok && !dirty ? <FormSuccess message={state.message} /> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={!dirty || pending}
            onClick={() => setPresent(new Set(presentIds))}
          >
            Discard changes
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save attendance"}
          </Button>
        </div>
      </div>
    </form>
  );
}
