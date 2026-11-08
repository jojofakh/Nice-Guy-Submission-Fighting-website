import { Badge, ButtonLink, FilterTabs, PortalHeader, Toolbar } from "@/components/portal/ui";
import { addDays, formatDay, formatTime, gymToday, isIsoDate, startOfWeek, weekdayName } from "@/lib/gym-time";
import { Link, useDocumentTitle, useSearchParams } from "@/lib/router";
import { useData } from "@/lib/store";
import { filters, type ScheduleTag } from "@/lib/schedule";

type Filter = ScheduleTag | "all";
const isFilter = (v: unknown): v is Filter => filters.some((f) => f.key === v);

const weekButton =
  "flex h-11 w-11 items-center justify-center border border-line-bright font-mono text-sm text-bone transition-colors hover:border-bone hover:bg-surface-2";

export default function MemberSchedulePage() {
  useDocumentTitle("Class schedule — NGSF members");
  const searchParams = useSearchParams();
  const params = { week: searchParams.get("week"), class: searchParams.get("class") };
  const { classes: allClasses } = useData();

  const today = gymToday();
  const thisWeek = startOfWeek(today);
  const week = isIsoDate(params.week) ? startOfWeek(params.week) : thisWeek;
  const filter: Filter = isFilter(params.class) ? params.class : "all";

  const href = (next: { week?: string; class?: Filter }) => {
    const q = new URLSearchParams();
    const w = next.week ?? week;
    const c = next.class ?? filter;
    if (w !== thisWeek) q.set("week", w);
    if (c !== "all") q.set("class", c);
    const s = q.toString();
    return s ? `/dashboard/schedule?${s}` : "/dashboard/schedule";
  };

  const classes = allClasses.filter((c) => filter === "all" || c.tags.includes(filter));
  const dates = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const rangeLabel = `${formatDay(dates[0], { month: "short", day: "numeric" })} – ${formatDay(dates[6], {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <div className="space-y-8">
      <PortalHeader
        kicker="Member portal"
        title="Class schedule"
        intro="Plan your training week. All times are Evansville (Central) time."
        actions={
          <div className="flex items-center gap-3">
            <Link href={href({ week: addDays(week, -7) })} className={weekButton} aria-label="Previous week" scroll={false}>
              &larr;
            </Link>
            <p className="min-w-44 text-center font-mono text-xs uppercase tracking-[0.14em] text-bone" aria-live="polite">
              {rangeLabel}
            </p>
            <Link href={href({ week: addDays(week, 7) })} className={weekButton} aria-label="Next week" scroll={false}>
              &rarr;
            </Link>
          </div>
        }
      />

      <Toolbar>
        <FilterTabs
          label="Filter classes"
          active={filter}
          tabs={filters.map((f) => ({ key: f.key, label: f.label, href: href({ class: f.key }) }))}
        />
        {week !== thisWeek ? (
          <ButtonLink href={href({ week: thisWeek })} variant="secondary" scroll={false}>
            This week
          </ButtonLink>
        ) : null}
      </Toolbar>

      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-7">
        {dates.map((date, i) => {
          const day = i + 1;
          const dayClasses = classes.filter((c) => c.day === day);
          const isToday = date === today;
          return (
            <section
              key={date}
              aria-labelledby={`day-${day}`}
              className={`p-5 sm:last:col-span-2 xl:last:col-span-1 ${isToday ? "bg-surface-2" : "bg-ink"}`}
            >
              <h2
                id={`day-${day}`}
                className={`flex items-baseline justify-between gap-2 pb-4 text-sm tracking-[0.1em] ${
                  isToday ? "text-blood" : "text-bone"
                }`}
              >
                <span>
                  <span className="xl:hidden">{weekdayName(day)}</span>
                  <span className="hidden xl:inline">{weekdayName(day).slice(0, 3)}</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ash-dim">
                  {isToday ? <span className="text-blood">Today</span> : formatDay(date, { month: "short", day: "numeric" })}
                </span>
              </h2>

              {dayClasses.length === 0 ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-ash-dim">&mdash;</p>
              ) : (
                <ul className="space-y-px">
                  {dayClasses.map((c) => {
                    const cancelled = c.status === "cancelled";
                    return (
                      <li
                        key={c.id}
                        className={`border-l-2 bg-surface px-4 py-3 ${cancelled ? "border-line opacity-60" : "border-blood/70"}`}
                      >
                        <p className="font-mono text-[11px] tracking-wider text-blood">{formatTime(c.startsAt)}</p>
                        <p className={`mt-1 text-sm leading-snug text-bone ${cancelled ? "line-through decoration-blood" : ""}`}>
                          {c.name}
                        </p>
                        {c.label || cancelled ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {cancelled ? <Badge tone="blood">Cancelled</Badge> : null}
                            {c.label ? (
                              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ash-dim">{c.label}</span>
                            ) : null}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <p className="font-mono text-[10px] leading-relaxed tracking-wider text-ash-dim">
        Classes repeat weekly. Cancelled classes are marked; check announcements for one-off changes.
      </p>
    </div>
  );
}
