import { Link } from "@/lib/router";
import { useActionState } from "react";
import { useActions } from "@/lib/store";
import type { ActionState, GymClass } from "@/lib/portal";
import { days, filters } from "@/lib/schedule";
import {
  invalidProps,
  Checkbox,
  FieldGroup,
  FieldError,
  FormError,
  Input,
  Label,
  Select,
} from "@/components/field";
import { Button, buttonClass } from "@/components/portal/ui";

const programs = filters.filter((f) => f.key !== "all");

export function ClassForm({ gymClass }: { gymClass?: GymClass }) {
  const { saveClass } = useActions();
  const [state, action, pending] = useActionState(saveClass, {} as ActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6 px-5 py-6 sm:px-7" noValidate>
      {gymClass ? <input type="hidden" name="id" value={gymClass.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="class-day">Day</Label>
          <Select id="class-day" name="day" defaultValue={gymClass?.day ?? 1} {...invalidProps("class-day", errors.day)}>
            {days.map((d, i) => (
              <option key={d} value={i + 1}>
                {d}
              </option>
            ))}
          </Select>
          <FieldError id="class-day-error" message={errors.day} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="class-time" hint="Central time">
            Start time
          </Label>
          <Input
            id="class-time"
            name="time"
            type="time"
            required
            step={300}
            defaultValue={gymClass?.startsAt.slice(0, 5) ?? "17:00"}
            {...invalidProps("class-time", errors.time)}
          />
          <FieldError id="class-time-error" message={errors.time} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="class-name">Class name</Label>
          <Input
            id="class-name"
            name="name"
            required
            maxLength={80}
            defaultValue={gymClass?.name}
            placeholder="Jiu Jitsu"
            {...invalidProps("class-name", errors.name)}
          />
          <FieldError id="class-name-error" message={errors.name} />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="class-label" hint="optional">
            Label
          </Label>
          <Input
            id="class-label"
            name="label"
            maxLength={40}
            defaultValue={gymClass?.label ?? ""}
            placeholder="Mat 2, Fighters only…"
            {...invalidProps("class-label", errors.label)}
          />
          <FieldError id="class-label-error" message={errors.label} />
        </FieldGroup>
      </div>

      <fieldset aria-describedby={errors.tags ? "class-tags-error" : undefined}>
        <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">Programs</legend>
        <p className="mt-2 text-xs text-ash-dim">Used by the schedule filters. Pick every one that applies.</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {programs.map((p) => (
            <label key={p.key} className="flex cursor-pointer items-center gap-3 border border-line px-3 py-2.5 text-sm text-ash transition-colors hover:border-line-bright has-[:checked]:border-blood has-[:checked]:text-bone">
              <Checkbox name="tags" value={p.key} defaultChecked={gymClass?.tags.some((t) => t === p.key)} />
              {p.label}
            </label>
          ))}
        </div>
        <FieldError id="class-tags-error" message={errors.tags} />
      </fieldset>

      {gymClass ? (
        <FieldGroup>
          <Label htmlFor="class-status">Status</Label>
          <Select id="class-status" name="status" defaultValue={gymClass.status} className="sm:max-w-xs">
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </FieldGroup>
      ) : null}

      <FormError message={state.error} />

      <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-6">
        <Link href="/admin/classes" className={buttonClass("secondary")}>
          Cancel
        </Link>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : gymClass ? "Save changes" : "Add class"}
        </Button>
      </div>
    </form>
  );
}
