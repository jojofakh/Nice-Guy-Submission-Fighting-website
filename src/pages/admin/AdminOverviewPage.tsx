import { AnnouncementSummary } from "@/components/portal/items";
import {
  Badge,
  ButtonLink,
  Card,
  CardLink,
  EmptyRow,
  PortalHeader,
  rowAction,
  StatCard,
  StatusBadge,
  thClass,
} from "@/components/portal/ui";
import { addDays, formatDay, formatTime, formatTimestamp, gymToday, isoWeekday, startOfWeek } from "@/lib/gym-time";
import { Link, useDocumentTitle } from "@/lib/router";
import { useData } from "@/lib/store";

export default function AdminOverviewPage() {
  useDocumentTitle("Overview — NGSF admin");
  const { classes, announcements, getAttendanceSummary, listProfiles } = useData();

  const today = gymToday();
  const attendance = getAttendanceSummary(today);
  const profiles = listProfiles();

  const scheduled = classes.filter((c) => c.status === "scheduled");
  const trainingDays = new Set(scheduled.map((c) => c.day)).size;
  const todaysClasses = classes.filter((c) => c.day === isoWeekday(today));

  // Calendar date each announcement went out, on the gym's clock.
  const publishedOn = announcements.map((a) => gymToday(new Date(a.publishedAt)));
  const recentCount = publishedOn.filter((d) => d >= addDays(today, -30)).length;
  const thisWeekCount = publishedOn.filter((d) => d >= startOfWeek(today)).length;

  const newestAccounts = profiles.slice(0, 6);

  return (
    <div className="space-y-10">
      <PortalHeader
        kicker={`Admin portal · ${formatDay(today, { weekday: "long", month: "short", day: "numeric" })}`}
        title={
          <>
            Gym <span className="text-blood">overview.</span>
          </>
        }
        intro="Today’s classes, attendance, and the latest posts at a glance."
        actions={<ButtonLink href="/admin/classes/new">+ Add class</ButtonLink>}
      />

      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
        <StatCard
          label="Weekly classes"
          value={scheduled.length}
          note={`${trainingDays} ${trainingDays === 1 ? "day" : "days"} per week`}
        />
        <StatCard label="Recent announcements" value={recentCount} note={`${thisWeekCount} posted this week`} />
        <StatCard
          highlight
          label="Today’s attendance"
          value={attendance.present}
          note={`${attendance.classes} ${attendance.classes === 1 ? "class" : "classes"} recorded`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card title="Today’s classes" action={<CardLink href="/admin/classes">Manage &rarr;</CardLink>}>
          {todaysClasses.length === 0 ? (
            <EmptyRow>No classes on the schedule today.</EmptyRow>
          ) : (
            <ul className="divide-y divide-line">
              {todaysClasses.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:px-7">
                  <span className="w-20 font-mono text-xs tracking-wider text-blood">{formatTime(c.startsAt)}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm text-bone ${c.status === "cancelled" ? "line-through decoration-blood" : ""}`}>
                      {c.name}
                    </p>
                    {c.label ? (
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ash-dim">{c.label}</p>
                    ) : null}
                  </div>
                  {c.status === "scheduled" ? (
                    <Link href={`/admin/attendance?date=${today}&class=${c.id}`} className={rowAction}>
                      View roster
                    </Link>
                  ) : (
                    <StatusBadge status="cancelled" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Latest posts" action={<CardLink href="/admin/announcements">Manage &rarr;</CardLink>}>
          {announcements.length === 0 ? (
            <EmptyRow>Nothing published yet.</EmptyRow>
          ) : (
            <ul className="divide-y divide-line">
              {announcements.slice(0, 2).map((a) => (
                <AnnouncementSummary key={a.id} announcement={a} showBody={false} />
              ))}
            </ul>
          )}
          <div className="border-t border-line px-5 py-5 sm:px-7">
            <ButtonLink href="/admin/announcements#announcement-form" variant="secondary" className="w-full">
              Create announcement
            </ButtonLink>
          </div>
        </Card>
      </div>

      <Card
        title="Newest accounts"
        action={<p className="font-mono text-xs tracking-wider text-ash-dim">{profiles.length} total</p>}
        footer="Roles are assigned by staff in the database, not here. New registrations are always members."
      >
        {newestAccounts.length === 0 ? (
          <EmptyRow>No one has registered yet.</EmptyRow>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={`${thClass} pl-5 sm:pl-7`}>Name</th>
                  <th scope="col" className={thClass}>Email</th>
                  <th scope="col" className={thClass}>Role</th>
                  <th scope="col" className={`${thClass} pr-5 sm:pr-7`}>Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {newestAccounts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-3 py-4 pl-5 text-bone sm:pl-7">{p.fullName || "—"}</td>
                    <td className="break-all px-3 py-4 text-ash">{p.email}</td>
                    <td className="px-3 py-4">
                      <Badge tone={p.role === "admin" ? "blood" : "default"}>{p.role}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 pr-5 font-mono text-xs text-ash-dim sm:pr-7">
                      {formatTimestamp(p.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
