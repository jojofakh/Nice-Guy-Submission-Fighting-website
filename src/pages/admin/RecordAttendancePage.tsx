import { ClassPicker, RosterForm } from "@/components/portal/attendance-forms";
import { Card, PortalHeader } from "@/components/portal/ui";
import { formatDay, formatTime, formatTimestamp, gymToday, isIsoDate, isoWeekday } from "@/lib/gym-time";
import { useDocumentTitle, useSearchParams } from "@/lib/router";
import { useData } from "@/lib/store";

export default function RecordAttendancePage() {
  useDocumentTitle("Attendance — NGSF admin");
  const searchParams = useSearchParams();
  const params = { date: searchParams.get("date"), class: searchParams.get("class") };
  const { classes: allClasses, getRoster } = useData();

  const today = gymToday();
  const date = isIsoDate(params.date) && params.date <= today ? params.date : today;
  const classes = allClasses.filter((c) => c.status === "scheduled");
  const gymClass = classes.find((c) => c.id === params.class && c.day === isoWeekday(date));
  const roster = gymClass ? getRoster(gymClass.id, date) : null;

  return (
    <div className="space-y-8">
      <PortalHeader
        kicker="Admin portal"
        title="Record attendance"
        intro="Select a class, then mark each member who attended."
      />

      <Card title="Class selection">
        <ClassPicker
          key={`${date}-${gymClass?.id ?? ""}`}
          classes={classes}
          date={date}
          classId={gymClass?.id}
          maxDate={today}
        />
      </Card>

      {gymClass && roster ? (
        <Card title={`${gymClass.name} roster`}>
          <RosterForm
            // A different class or date starts a fresh form.
            key={`${gymClass.id}-${date}`}
            classId={gymClass.id}
            date={date}
            heading={
              <>
                <p className="font-display text-lg uppercase text-bone">
                  {formatDay(date, { weekday: "short", month: "short", day: "numeric" })}
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-wider text-blood">
                  {formatTime(gymClass.startsAt)}
                  {gymClass.label ? ` · ${gymClass.label}` : ""}
                </p>
              </>
            }
            members={roster.members}
            presentIds={roster.presentIds}
            lastSaved={
              roster.lastSaved
                ? `Last saved ${formatTimestamp(roster.lastSaved.at, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })} by ${roster.lastSaved.by}`
                : "Not recorded yet"
            }
          />
        </Card>
      ) : params.class ? (
        <p className="border border-line bg-surface px-5 py-4 text-sm text-ash">
          That class does not run on {formatDay(date, { weekday: "long" })}s. Pick another class above.
        </p>
      ) : null}
    </div>
  );
}
