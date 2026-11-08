import { days, type Day } from "@/lib/schedule";

/**
 * Calendar helpers pinned to the gym's clock. Evansville is on Central time;
 * the server may not be, so "today" is always computed for America/Chicago.
 *
 * Dates travel as plain `YYYY-MM-DD` strings (the same shape Postgres `date`
 * columns and <input type="date"> use) and arithmetic is done in UTC, where
 * no day is ever 23 or 25 hours long.
 */

export const GYM_TIME_ZONE = "America/Chicago";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

/** Today's date at the gym. */
export function gymToday(now = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: GYM_TIME_ZONE }).format(now);
}

/** Minutes past midnight right now at the gym. */
export function gymMinutesNow(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: GYM_TIME_ZONE,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

const utc = (date: string) => new Date(`${date}T00:00:00Z`);

export function addDays(date: string, amount: number): string {
  const d = utc(date);
  d.setUTCDate(d.getUTCDate() + amount);
  return d.toISOString().slice(0, 10);
}

/** ISO weekday: 1 = Monday ... 7 = Sunday (matches `classes.day`). */
export function isoWeekday(date: string): number {
  return ((utc(date).getUTCDay() + 6) % 7) + 1;
}

export function weekdayName(isoDay: number): Day {
  return days[isoDay - 1];
}

/** The Monday on or before `date`. */
export function startOfWeek(date: string): string {
  return addDays(date, 1 - isoWeekday(date));
}

export function startOfMonth(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

export function startOfYear(date: string): string {
  return `${date.slice(0, 4)}-01-01`;
}

/** Format a `YYYY-MM-DD` date. Uses UTC so the calendar day never shifts. */
export function formatDay(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(utc(date));
}

/** Format a timestamp (e.g. `published_at`) as the gym's calendar date. */
export function formatTimestamp(
  iso: string,
  options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" },
): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: GYM_TIME_ZONE }).format(
    new Date(iso),
  );
}

/** "17:00:00" or "17:00" -> minutes past midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "17:00:00" -> "5:00 PM" */
export function formatTime(time: string): string {
  const minutes = timeToMinutes(time);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}
