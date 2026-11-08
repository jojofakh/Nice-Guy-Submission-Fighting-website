import { Badge, DateTile, StatusBadge } from "@/components/portal/ui";
import { formatDay, formatTime, formatTimestamp } from "@/lib/gym-time";
import { categoryLabel, type Announcement, type Occurrence } from "@/lib/portal";

/** One row of "Upcoming classes" (member dashboard). */
export function OccurrenceRow({ occurrence }: { occurrence: Occurrence }) {
  const { date, gymClass } = occurrence;
  const cancelled = gymClass.status === "cancelled";
  return (
    <li className="flex items-center gap-5 px-5 py-4 sm:px-7">
      <DateTile weekday={formatDay(date, { weekday: "short" })} day={formatDay(date, { day: "numeric" })} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm text-bone ${cancelled ? "line-through decoration-blood" : ""}`}>{gymClass.name}</p>
        <p className="mt-1.5 font-mono text-[11px] tracking-wider text-blood">
          {formatTime(gymClass.startsAt)}
          {gymClass.label ? (
            <span className="text-ash-dim uppercase tracking-[0.14em]"> · {gymClass.label}</span>
          ) : null}
        </p>
      </div>
      <StatusBadge status={gymClass.status} />
    </li>
  );
}

/** Compact announcement for dashboard side panels. */
export function AnnouncementSummary({
  announcement,
  showBody = true,
}: {
  announcement: Announcement;
  showBody?: boolean;
}) {
  return (
    <li className="px-5 py-6 sm:px-7">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={announcement.category === "closure" ? "blood" : "default"}>
          {categoryLabel(announcement.category)}
        </Badge>
        <span className="font-mono text-[10px] tracking-wider text-ash-dim">
          {formatTimestamp(announcement.publishedAt, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
      <p className="mt-3 text-sm text-bone">{announcement.title}</p>
      {showBody ? <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ash">{announcement.body}</p> : null}
    </li>
  );
}
