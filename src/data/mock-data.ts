import type { Profile } from "@/lib/auth";
import { addDays, gymToday, isoWeekday } from "@/lib/gym-time";
import type { Announcement, GymClass } from "@/lib/portal";
import { days, sessions } from "@/lib/schedule";

/**
 * Mock data standing in for the database. Each export matches one table from
 * the project's data model: accounts (sign-in), profiles, classes,
 * announcements, and attendance. DataProvider copies these into useState, so
 * everything a visitor changes updates the screens right away; refreshing the
 * page starts over from this data.
 */

/** Shared password for the demo accounts, shown on the login screen. */
export const DEMO_PASSWORD = "ngsf2026";

export type Account = { profileId: string; email: string; password: string };

const today = gymToday();

export const initialProfiles: Profile[] = [
  {
    id: "user-alex",
    email: "alex@ngsf.com",
    fullName: "Alex Kim",
    role: "admin",
    createdAt: "2023-01-09T15:00:00Z",
    birthDate: "1988-04-17",
    phone: "(812) 555-0100",
    emergencyContactName: "Dana Kim",
    emergencyContactPhone: "(812) 555-0101",
    avatarPath: null,
  },
  {
    id: "user-jordan",
    email: "jordan@ngsf.com",
    fullName: "Jordan Davis",
    role: "member",
    createdAt: "2024-03-12T18:30:00Z",
    birthDate: "1999-09-02",
    phone: "(812) 555-0142",
    emergencyContactName: "Casey Davis",
    emergencyContactPhone: "(812) 555-0143",
    avatarPath: null,
  },
  ...[
    ["user-maya", "Maya Thompson", "maya@example.com", "2023-08-02"],
    ["user-chris", "Chris Bennett", "chris@example.com", "2025-01-20"],
    ["user-sam", "Sam Rivera", "sam@example.com", "2025-06-14"],
    ["user-taylor", "Taylor Morgan", "taylor@example.com", "2022-11-05"],
    ["user-ethan", "Ethan Brooks", "ethan@example.com", "2026-02-09"],
    ["user-priya", "Priya Patel", "priya@example.com", "2025-09-30"],
  ].map(([id, fullName, email, joined]) => ({
    id,
    email,
    fullName,
    role: "member" as const,
    createdAt: `${joined}T17:00:00Z`,
    birthDate: null,
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    avatarPath: null,
  })),
];

export const initialAccounts: Account[] = initialProfiles.map((p) => ({
  profileId: p.id,
  email: p.email,
  password: DEMO_PASSWORD,
}));

/**
 * The weekly timetable, built from the public schedule in src/lib/schedule.ts
 * so both views start out identical. Wednesday 5:00 PM Kickboxing starts
 * cancelled to match the announcement below.
 */
export const initialClasses: GymClass[] = sessions.map((s, i) => {
  const hours = String(Math.floor(s.startsAt / 60)).padStart(2, "0");
  const minutes = String(s.startsAt % 60).padStart(2, "0");
  const day = days.indexOf(s.day) + 1;
  return {
    id: `class-${i + 1}`,
    day,
    startsAt: `${hours}:${minutes}:00`,
    name: s.name,
    tags: s.tags,
    label: s.mat ?? s.note ?? null,
    status: day === 3 && s.name === "Kickboxing" ? "cancelled" : "scheduled",
  };
});

const daysAgo = (n: number) => `${addDays(today, -n)}T16:00:00Z`;

export const initialAnnouncements: Announcement[] = [
  {
    id: "post-1",
    title: "Gym closed for Thanksgiving",
    body: "The gym will be closed Thursday, November 26. Regular classes resume Friday evening. Enjoy the holiday with your family!",
    category: "closure",
    publishedAt: daysAgo(2),
    updatedAt: null,
  },
  {
    id: "post-2",
    title: "Wednesday Kickboxing class update",
    body: "Wednesday's 5:00 PM Kickboxing class is cancelled while the mats are replaced. Members are welcome at Open Mat on Saturday.",
    category: "schedule",
    publishedAt: daysAgo(9),
    updatedAt: null,
  },
  {
    id: "post-3",
    title: "Fall Grappling Tournament",
    body: "Registration is open for the regional tournament on November 21. Speak with a coach to join the team and get your weigh-in details.",
    category: "tournament",
    publishedAt: daysAgo(18),
    updatedAt: null,
  },
  {
    id: "post-4",
    title: "New early-morning Jiu Jitsu",
    body: "We added a 6:00 AM Jiu Jitsu class every Wednesday for members who train before work. All levels welcome.",
    category: "general",
    publishedAt: daysAgo(34),
    updatedAt: null,
  },
];

export type AttendanceRow = {
  memberId: string;
  classId: string;
  /** YYYY-MM-DD */
  classDate: string;
  recordedAt: string;
  recordedBy: string;
};

/**
 * About ten weeks of history. Each member has a few regular training days;
 * on those days they attend the first scheduled class.
 */
const regulars: Record<string, number[]> = {
  "user-jordan": [1, 3, 6],
  "user-maya": [1, 2, 4],
  "user-chris": [2, 4, 6],
  "user-sam": [3, 5],
  "user-taylor": [1, 3, 5, 6],
  "user-ethan": [4, 7],
  "user-priya": [2, 6],
};

export const initialAttendance: AttendanceRow[] = Array.from({ length: 70 }, (_, i) => addDays(today, -(i + 1))).flatMap(
  (date) => {
    const weekday = isoWeekday(date);
    const firstClass = initialClasses
      .filter((c) => c.day === weekday && c.status === "scheduled")
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
    if (!firstClass) return [];
    return Object.entries(regulars)
      .filter(([, trainingDays]) => trainingDays.includes(weekday))
      .map(([memberId]) => ({
        memberId,
        classId: firstClass.id,
        classDate: date,
        recordedAt: `${date}T23:00:00Z`,
        recordedBy: "user-alex",
      }));
  },
);
