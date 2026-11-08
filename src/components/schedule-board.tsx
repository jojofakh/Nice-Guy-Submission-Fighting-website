import { useMemo } from "react";
import { useRouter, useSearchParams } from "@/lib/router";
import { filters, sessionsByDay, type ScheduleTag } from "@/lib/schedule";
import { useToday } from "@/lib/use-today";

const validFilters = new Set(filters.map((f) => f.key));

function isFilter(value: string | null): value is ScheduleTag | "all" {
  return value !== null && validFilters.has(value as ScheduleTag | "all");
}

export function ScheduleBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The `?class=` param lets class cards deep-link into a pre-filtered week.
  const param = searchParams.get("class");
  const filter: ScheduleTag | "all" = isFilter(param) ? param : "all";

  const today = useToday();

  const week = useMemo(() => sessionsByDay(filter), [filter]);
  const matchCount = week.reduce((sum, d) => sum + d.sessions.length, 0);

  const select = (key: ScheduleTag | "all") => {
    // Keep the filter in the URL so a filtered week can be shared or bookmarked.
    router.replace(key === "all" ? "/schedule" : `/schedule?class=${key}`, {
      scroll: false,
    });
  };

  return (
    <div>
      <div
        role="group"
        aria-label="Filter classes"
        className="flex flex-wrap gap-2 border-y border-line py-5"
      >
        {filters.map((f) => {
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => select(f.key)}
              aria-pressed={active}
              className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                active
                  ? "border-blood bg-blood text-bone"
                  : "border-line text-ash hover:border-line-bright hover:text-bone"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-5 font-mono text-xs tracking-wider text-ash-dim">
        {matchCount} {matchCount === 1 ? "class" : "classes"} per week
        {filter === "all" ? "" : ` · ${filters.find((f) => f.key === filter)?.label}`}
      </p>

      <div className="mt-8 grid gap-px bg-line lg:grid-cols-7">
        {week.map(({ day, sessions: daySessions }) => {
          const isToday = day === today;
          return (
            <section
              key={day}
              aria-labelledby={`day-${day}`}
              className={`bg-ink p-5 ${isToday ? "bg-surface-2" : ""}`}
            >
              <h3
                id={`day-${day}`}
                className={`flex items-center gap-2 pb-4 text-sm tracking-[0.1em] ${
                  isToday ? "text-blood" : "text-bone"
                }`}
              >
                <span className="lg:hidden">{day}</span>
                <span className="hidden lg:inline">{day.slice(0, 3)}</span>
                {isToday ? (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-blood">
                    Today
                  </span>
                ) : null}
              </h3>

              {daySessions.length === 0 ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-ash-dim">
                  &mdash;
                </p>
              ) : (
                <ul className="space-y-px">
                  {daySessions.map((s) => (
                    <li
                      key={`${s.name}-${s.startsAt}-${s.mat ?? ""}`}
                      className="group border-l-2 border-line bg-surface px-4 py-3 transition-colors hover:border-blood hover:bg-surface-2"
                    >
                      <p className="font-mono text-[11px] tracking-wider text-blood">
                        {s.time}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-bone">{s.name}</p>
                      {s.mat || s.note ? (
                        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ash-dim">
                          {[s.mat, s.note].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
