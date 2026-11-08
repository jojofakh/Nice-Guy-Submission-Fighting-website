import type { Discipline } from "./classes";

export type ScheduleTag = Discipline | "open-mat";

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const days: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type Session = {
  day: Day;
  /** Minutes past midnight. Used only for sorting, never displayed. */
  startsAt: number;
  time: string;
  name: string;
  /** Every discipline this session should surface under when filtering. */
  tags: ScheduleTag[];
  mat?: string;
  note?: string;
};

const at = (hour: number, minute: number) => hour * 60 + minute;

export const sessions: Session[] = [
  // Monday
  { day: "Monday", startsAt: at(11, 30), time: "11:30 AM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Monday", startsAt: at(17, 0), time: "5:00 PM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Monday", startsAt: at(18, 30), time: "6:30 PM", name: "Kids Jiu Jitsu", tags: ["kids", "jiu-jitsu"] },
  { day: "Monday", startsAt: at(18, 30), time: "6:30 PM", name: "MMA", tags: ["mma"], note: "Fighters only" },

  // Tuesday
  { day: "Tuesday", startsAt: at(11, 30), time: "11:30 AM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Tuesday", startsAt: at(17, 0), time: "5:00 PM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Tuesday", startsAt: at(17, 0), time: "5:00 PM", name: "Kickboxing", tags: ["kickboxing"], mat: "Mat 2" },
  { day: "Tuesday", startsAt: at(18, 30), time: "6:30 PM", name: "Wrestling", tags: ["wrestling"] },

  // Wednesday
  { day: "Wednesday", startsAt: at(6, 0), time: "6:00 AM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Wednesday", startsAt: at(11, 30), time: "11:30 AM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Wednesday", startsAt: at(17, 0), time: "5:00 PM", name: "Kickboxing", tags: ["kickboxing"], note: "Hard sparring" },
  { day: "Wednesday", startsAt: at(17, 0), time: "5:00 PM", name: "Beginner Jiu Jitsu", tags: ["beginner", "jiu-jitsu"], mat: "Mat 2" },
  { day: "Wednesday", startsAt: at(18, 30), time: "6:30 PM", name: "Kids Jiu Jitsu", tags: ["kids", "jiu-jitsu"] },
  { day: "Wednesday", startsAt: at(18, 30), time: "6:30 PM", name: "MMA", tags: ["mma"], note: "Fighters only" },

  // Thursday
  { day: "Thursday", startsAt: at(11, 30), time: "11:30 AM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Thursday", startsAt: at(17, 0), time: "5:00 PM", name: "Jiu Jitsu", tags: ["jiu-jitsu"] },
  { day: "Thursday", startsAt: at(18, 30), time: "6:30 PM", name: "Beginner Kickboxing", tags: ["beginner", "kickboxing"] },

  // Friday
  { day: "Friday", startsAt: at(17, 0), time: "5:00 PM", name: "MMA", tags: ["mma"] },
  { day: "Friday", startsAt: at(18, 30), time: "6:30 PM", name: "Kids Jiu Jitsu", tags: ["kids", "jiu-jitsu"] },
  { day: "Friday", startsAt: at(18, 30), time: "6:30 PM", name: "Beginner Jiu Jitsu", tags: ["beginner", "jiu-jitsu"], mat: "Mat 2" },

  // Saturday
  { day: "Saturday", startsAt: at(9, 0), time: "9:00 AM", name: "Kickboxing", tags: ["kickboxing"] },
  { day: "Saturday", startsAt: at(10, 0), time: "10:00 AM", name: "Open Mat", tags: ["open-mat"] },

  // Sunday
  { day: "Sunday", startsAt: at(9, 0), time: "9:00 AM", name: "Kickboxing", tags: ["kickboxing"] },
  { day: "Sunday", startsAt: at(10, 0), time: "10:00 AM", name: "Open Mat", tags: ["open-mat"] },
];

export const filters: { key: ScheduleTag | "all"; label: string }[] = [
  { key: "all", label: "All classes" },
  { key: "jiu-jitsu", label: "Jiu Jitsu" },
  { key: "kickboxing", label: "Kickboxing" },
  { key: "mma", label: "MMA" },
  { key: "wrestling", label: "Wrestling" },
  { key: "beginner", label: "Beginner" },
  { key: "kids", label: "Kids" },
  { key: "open-mat", label: "Open Mat" },
];

/** Sessions grouped by day and sorted by start time, optionally filtered. */
export function sessionsByDay(filter: ScheduleTag | "all" = "all") {
  return days.map((day) => ({
    day,
    sessions: sessions
      .filter((s) => s.day === day && (filter === "all" || s.tags.includes(filter)))
      .sort((a, b) => a.startsAt - b.startsAt),
  }));
}
