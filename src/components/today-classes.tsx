import { Link } from "@/lib/router";
import { sessions } from "@/lib/schedule";
import { useToday } from "@/lib/use-today";

/** "What's on today" strip, driven by the visitor's own clock. */
export function TodayClasses() {
  const today = useToday();

  const todaysSessions = today
    ? sessions.filter((s) => s.day === today).sort((a, b) => a.startsAt - b.startsAt)
    : [];

  return (
    <div className="border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <p className="kicker">
          {today ? `On the mats today — ${today}` : "On the mats today"}
        </p>
        <Link
          href="/schedule"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
        >
          Full week &rarr;
        </Link>
      </div>

      {/* Reserve the row height so the card does not jump when the day resolves. */}
      <div className="min-h-[5.5rem] divide-y divide-line">
        {!today ? (
          <p className="px-6 py-6 font-mono text-xs text-ash-dim">Loading today&rsquo;s classes…</p>
        ) : todaysSessions.length === 0 ? (
          <p className="px-6 py-6 text-sm text-ash">
            Nothing scheduled today. Weekends are Kickboxing at 9:00 AM and open mat at 10:00 AM.
          </p>
        ) : (
          todaysSessions.map((s) => (
            <div
              key={`${s.name}-${s.startsAt}-${s.mat ?? ""}`}
              className="flex items-baseline gap-5 px-6 py-4"
            >
              <span className="w-20 shrink-0 font-mono text-xs tracking-wider text-blood">
                {s.time}
              </span>
              <span className="text-sm text-bone">{s.name}</span>
              {s.mat ? (
                <span className="font-mono text-[10px] uppercase tracking-widest text-ash-dim">
                  {s.mat}
                </span>
              ) : null}
              {s.note ? (
                <span className="font-mono text-[10px] uppercase tracking-widest text-ash-dim">
                  {s.note}
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
