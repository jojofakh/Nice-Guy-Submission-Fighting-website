import { addDays, isoWeekday, timeToMinutes } from "@/lib/gym-time";
import type { ScheduleTag } from "@/lib/schedule";

/**
 * Types and constants shared by the portal pages, the admin forms, and the
 * Server Actions. No server-only imports here: client components use it too.
 */

export type ClassStatus = "scheduled" | "cancelled";

export type GymClass = {
  id: string;
  /** ISO weekday, 1 = Monday ... 7 = Sunday */
  day: number;
  /** Postgres `time`, e.g. "17:00:00" */
  startsAt: string;
  name: string;
  tags: ScheduleTag[];
  label: string | null;
  status: ClassStatus;
};

export type AnnouncementCategory = "general" | "closure" | "schedule" | "tournament";

export const announcementCategories: { key: AnnouncementCategory; label: string; plural: string }[] = [
  { key: "closure", label: "Closure", plural: "Closures" },
  { key: "schedule", label: "Schedule", plural: "Schedule" },
  { key: "tournament", label: "Tournament", plural: "Tournaments" },
  { key: "general", label: "General", plural: "General" },
];

export function isAnnouncementCategory(value: unknown): value is AnnouncementCategory {
  return announcementCategories.some((c) => c.key === value);
}

export type Announcement = {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  publishedAt: string;
  updatedAt: string | null;
};

export type AttendanceRecord = {
  classId: string;
  classDate: string;
  className: string;
  startsAt: string;
};

export type RosterMember = {
  id: string;
  fullName: string;
  email: string;
  role: "member" | "admin";
};

export type Occurrence = { date: string; gymClass: GymClass };

/**
 * The next `limit` class meetings from now, walking the weekly timetable
 * forward up to a week. Cancelled classes are included unless
 * `scheduledOnly` is set, so members see what is off.
 */
export function upcomingOccurrences(
  classes: GymClass[],
  today: string,
  minutesNow: number,
  { limit, scheduledOnly = false }: { limit: number; scheduledOnly?: boolean },
): Occurrence[] {
  const result: Occurrence[] = [];
  for (let offset = 0; offset < 7 && result.length < limit; offset++) {
    const date = addDays(today, offset);
    const weekday = isoWeekday(date);
    const todays = classes
      .filter((c) => c.day === weekday)
      .filter((c) => !scheduledOnly || c.status === "scheduled")
      .filter((c) => offset > 0 || timeToMinutes(c.startsAt) >= minutesNow)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    for (const gymClass of todays) {
      if (result.length === limit) break;
      result.push({ date, gymClass });
    }
  }
  return result;
}

export function categoryLabel(category: AnnouncementCategory) {
  return announcementCategories.find((c) => c.key === category)?.label ?? "General";
}

/** Shape every admin Server Action returns to its form. */
export type ActionState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};
