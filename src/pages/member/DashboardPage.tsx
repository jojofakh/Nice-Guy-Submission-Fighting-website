import { FormSuccess } from "@/components/field";
import { AnnouncementSummary, OccurrenceRow } from "@/components/portal/items";
import { Card, CardLink, EmptyRow, PortalHeader, StatCard } from "@/components/portal/ui";
import { formatDay, formatTime, gymMinutesNow, gymToday, startOfMonth } from "@/lib/gym-time";
import { upcomingOccurrences } from "@/lib/portal";
import { useDocumentTitle, useSearchParams } from "@/lib/router";
import { site } from "@/lib/site";
import { useData } from "@/lib/store";

export default function DashboardPage() {
  useDocumentTitle("Dashboard — NGSF members");
  const { currentProfile, classes, announcements: allAnnouncements, countMyAttendance } = useData();
  const password = useSearchParams().get("password");

  const today = gymToday();
  const minutesNow = gymMinutesNow();
  const announcements = allAnnouncements.slice(0, 3);
  const visitsThisMonth = countMyAttendance(startOfMonth(today), today);

  const upcoming = upcomingOccurrences(classes, today, minutesNow, { limit: 4 });
  const [next] = upcomingOccurrences(classes, today, minutesNow, { limit: 1, scheduledOnly: true });
  const weeklyCount = classes.filter((c) => c.status === "scheduled").length;
  const firstName = currentProfile?.fullName.split(" ")[0] || "fighter";

  return (
    <div className="space-y-10">
      <PortalHeader
        kicker={`Member portal · ${formatDay(today, { weekday: "long", month: "short", day: "numeric" })}`}
        title={
          <>
            Welcome back,
            <br />
            <span className="text-blood">{firstName}.</span>
          </>
        }
        intro={`${site.tagline}. Here’s what’s happening at NGSF this week.`}
      />

      {password === "updated" ? <FormSuccess message="Your password has been updated." /> : null}

      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
        <StatCard
          highlight
          label="Next class"
          value={next ? formatTime(next.gymClass.startsAt) : "—"}
          note={
            next
              ? `${next.gymClass.name}${next.date === today ? " · today" : ` · ${formatDay(next.date, { weekday: "long" })}`}`
              : "No classes scheduled this week"
          }
        />
        <StatCard label="Classes this week" value={weeklyCount} note="All skill levels" />
        <StatCard
          label="Your visits this month"
          value={visitsThisMonth}
          note={visitsThisMonth > 0 ? "Keep up the good work" : "See you on the mats"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card title="Upcoming classes" action={<CardLink href="/dashboard/schedule">Full week &rarr;</CardLink>}>
          {upcoming.length === 0 ? (
            <EmptyRow>No classes coming up this week.</EmptyRow>
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.map((o) => (
                <OccurrenceRow key={`${o.date}-${o.gymClass.id}`} occurrence={o} />
              ))}
            </ul>
          )}
        </Card>

        <Card title="Announcements" action={<CardLink href="/dashboard/announcements">View all &rarr;</CardLink>}>
          {announcements.length === 0 ? (
            <EmptyRow>No announcements yet.</EmptyRow>
          ) : (
            <ul className="divide-y divide-line">
              {announcements.map((a) => (
                <AnnouncementSummary key={a.id} announcement={a} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
