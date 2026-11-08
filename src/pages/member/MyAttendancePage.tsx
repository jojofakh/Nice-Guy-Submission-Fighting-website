import { FieldGroup, Input, Label } from "@/components/field";
import { Button, Card, EmptyRow, PortalHeader, quietLink, thClass } from "@/components/portal/ui";
import { addDays, formatDay, formatTime, gymToday, isIsoDate, startOfMonth, startOfYear } from "@/lib/gym-time";
import { Link, useDocumentTitle, useRouter, useSearchParams } from "@/lib/router";
import { useData } from "@/lib/store";

export default function MyAttendancePage() {
  useDocumentTitle("My attendance — NGSF members");
  const searchParams = useSearchParams();
  const params = { from: searchParams.get("from"), to: searchParams.get("to") };
  const router = useRouter();
  const { getMyAttendance, countMyAttendance } = useData();

  const today = gymToday();
  // Default window: the start of last month through today.
  const defaultFrom = startOfMonth(addDays(startOfMonth(today), -1));
  let from = isIsoDate(params.from) ? params.from : defaultFrom;
  let to = isIsoDate(params.to) ? params.to : today;
  if (from > to) [from, to] = [to, from];

  const records = getMyAttendance(from, to);
  const yearTotal = countMyAttendance(startOfYear(today), today);

  function applyFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    router.push(`/dashboard/attendance?from=${form.get("from")}&to=${form.get("to")}`, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <PortalHeader
        kicker="Member portal"
        title="My attendance"
        intro="Review your personal training history."
        actions={
          <div className="border-l-2 border-blood pl-5">
            <p className="font-display text-5xl font-bold leading-none">{yearTotal}</p>
            <p className="kicker mt-2">Visits in {today.slice(0, 4)}</p>
          </div>
        }
      />

      <Card
        title="Attendance history"
        footer="Only your own attendance records are shown. Contact gym staff if a record needs correcting."
      >
        <form
          key={`${from}-${to}`}
          onSubmit={applyFilter}
          className="grid gap-4 border-b border-line px-5 py-5 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end sm:px-7"
        >
          <FieldGroup>
            <Label htmlFor="from">From</Label>
            <Input id="from" name="from" type="date" defaultValue={from} max={today} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="to">To</Label>
            <Input id="to" name="to" type="date" defaultValue={to} max={today} />
          </FieldGroup>
          <Button type="submit">Apply</Button>
          <Link href="/dashboard/attendance" className={`${quietLink} py-3.5 text-center`}>
            Clear
          </Link>
        </form>

        {records.length === 0 ? (
          <EmptyRow>No visits recorded between these dates.</EmptyRow>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={`${thClass} pl-5 sm:pl-7`}>Date</th>
                  <th scope="col" className={thClass}>Class</th>
                  <th scope="col" className={thClass}>Time</th>
                  <th scope="col" className={`${thClass} pr-5 sm:pr-7`}>Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {records.map((r) => (
                  <tr key={`${r.classDate}-${r.classId}`}>
                    <td className="whitespace-nowrap px-3 py-4 pl-5 text-bone sm:pl-7">
                      {formatDay(r.classDate, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-3 py-4 text-bone">{r.className}</td>
                    <td className="whitespace-nowrap px-3 py-4 font-mono text-xs tracking-wider text-blood">
                      {formatTime(r.startsAt)}
                    </td>
                    <td className="px-3 py-4 pr-5 sm:pr-7">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blood" />
                        Present
                      </span>
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
