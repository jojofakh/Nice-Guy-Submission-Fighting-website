import { Link } from "@/lib/router";
import { useState } from "react";
import { useActions } from "@/lib/store";
import { formatTime, weekdayName } from "@/lib/gym-time";
import type { GymClass } from "@/lib/portal";
import { days } from "@/lib/schedule";
import { FieldGroup, Input, Label, Select } from "@/components/field";
import { Badge, EmptyRow, rowAction, rowActionDanger, StatusBadge, thClass } from "@/components/portal/ui";

/** Admin class list. Search and filters are local state; cancel/restore updates the shared data. */
export function ClassTable({ classes }: { classes: GymClass[] }) {
  const { setClassStatus } = useActions();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [day, setDay] = useState("all");

  const q = query.trim().toLowerCase();
  const shown = classes.filter(
    (c) =>
      (!q || c.name.toLowerCase().includes(q) || c.label?.toLowerCase().includes(q)) &&
      (status === "all" || c.status === status) &&
      (day === "all" || c.day === Number(day)),
  );

  return (
    <>
      <div className="grid gap-4 border-b border-line px-5 py-6 sm:px-7 md:grid-cols-[2fr_1fr_1fr]">
        <FieldGroup>
          <Label htmlFor="class-search">Search classes</Label>
          <Input
            id="class-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by class name"
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="class-status">Status</Label>
          <Select id="class-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="class-day">Day</Label>
          <Select id="class-day" value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="all">All days</option>
            {days.map((d, i) => (
              <option key={d} value={i + 1}>
                {d}
              </option>
            ))}
          </Select>
        </FieldGroup>
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} classes shown
      </p>

      {shown.length === 0 ? (
        <EmptyRow>No classes match those filters.</EmptyRow>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className={`${thClass} pl-5 sm:pl-7`}>Day</th>
                <th scope="col" className={thClass}>Time</th>
                <th scope="col" className={thClass}>Class</th>
                <th scope="col" className={thClass}>Label</th>
                <th scope="col" className={thClass}>Status</th>
                <th scope="col" className={`${thClass} pr-5 sm:pr-7`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shown.map((c) => (
                <tr key={c.id} className={c.status === "cancelled" ? "text-ash-dim" : undefined}>
                  <td className="px-3 py-4 pl-5 text-bone sm:pl-7">{weekdayName(c.day)}</td>
                  <td className="whitespace-nowrap px-3 py-4 font-mono text-xs tracking-wider text-blood">
                    {formatTime(c.startsAt)}
                  </td>
                  <td className={`px-3 py-4 ${c.status === "cancelled" ? "text-ash line-through decoration-blood" : "text-bone"}`}>
                    {c.name}
                  </td>
                  <td className="px-3 py-4">{c.label ? <Badge>{c.label}</Badge> : <span className="text-ash-dim">—</span>}</td>
                  <td className="px-3 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-3 py-4 pr-5 sm:pr-7">
                    <div className="flex items-center gap-5">
                      <Link
                        href={`/admin/classes/${c.id}`}
                        className={rowAction}
                        aria-label={`Edit ${weekdayName(c.day)} ${formatTime(c.startsAt)} ${c.name}`}
                      >
                        Edit
                      </Link>
                      <form action={setClassStatus}>
                        <input type="hidden" name="id" value={c.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={c.status === "scheduled" ? "cancelled" : "scheduled"}
                        />
                        <button
                          type="submit"
                          className={c.status === "scheduled" ? rowActionDanger : rowAction}
                        >
                          {c.status === "scheduled" ? "Cancel class" : "Restore"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
