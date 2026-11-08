import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  initialAccounts,
  initialAnnouncements,
  initialAttendance,
  initialClasses,
  initialProfiles,
  type Account,
  type AttendanceRow,
} from "@/data/mock-data";
import type { Profile } from "@/lib/auth";
import { safeNextPath } from "@/lib/auth";
import { gymToday, isIsoDate } from "@/lib/gym-time";
import {
  isAnnouncementCategory,
  type ActionState,
  type Announcement,
  type AttendanceRecord,
  type GymClass,
  type RosterMember,
} from "@/lib/portal";
import { useRouter } from "@/lib/router";
import { filters } from "@/lib/schedule";

/**
 * The app's data layer. All mock data is held in useState here and shared
 * through context, so a change made on one screen (an admin cancelling a
 * class) shows up everywhere else (the member schedule) straight away.
 *
 * The write functions keep the (previousState, formData) shape of the
 * original Server Actions, so the forms use them with React's useActionState
 * exactly as before. Validation rules are the same as the real site's.
 */

export type AuthFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"fullName" | "email" | "password" | "confirm" | "agree", string>>;
  /** Shown instead of the form once a (pretend) email has been sent. */
  notice?: string;
  /** Echoed back so a failed submit does not wipe what the user typed. */
  email?: string;
  fullName?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const PHONE = /^[0-9+()\-.\s]{7,30}$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;
const validTags = new Set<string>(filters.map((f) => f.key).filter((k) => k !== "all"));
const SESSION_KEY = "ngsf-session";

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
const now = () => new Date().toISOString();

function passwordProblem(password: string): string | undefined {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (new TextEncoder().encode(password).length > PASSWORD_MAX) return `Keep it under ${PASSWORD_MAX} characters.`;
  return undefined;
}

/** Remembers who is signed in for this browser tab, so a refresh keeps you logged in. */
function readSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function useStoreValue() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [classes, setClasses] = useState<GymClass[]>(initialClasses);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [attendance, setAttendance] = useState<AttendanceRow[]>(initialAttendance);
  const [sessionId, setSessionId] = useState<string | null>(readSession);

  useEffect(() => {
    try {
      if (sessionId) sessionStorage.setItem(SESSION_KEY, sessionId);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Private browsing can block storage; the session then lasts until refresh.
    }
  }, [sessionId]);

  const currentProfile = profiles.find((p) => p.id === sessionId) ?? null;

  // ---------------------------------------------------------------------------
  // Reads
  // ---------------------------------------------------------------------------

  /** Weekly timetable, ordered by day then start time. */
  const sortedClasses = [...classes].sort(
    (a, b) => a.day - b.day || a.startsAt.localeCompare(b.startsAt) || a.name.localeCompare(b.name),
  );

  /** Newest first. */
  const sortedAnnouncements = [...announcements].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  /** Every profile, newest account first. */
  const listProfiles = () => [...profiles].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  /** The signed-in member's own attendance between two dates (inclusive). */
  function getMyAttendance(from: string, to: string): AttendanceRecord[] {
    return attendance
      .filter((r) => r.memberId === sessionId && r.classDate >= from && r.classDate <= to)
      .map((r) => {
        const gymClass = classes.find((c) => c.id === r.classId);
        return {
          classId: r.classId,
          classDate: r.classDate,
          className: gymClass?.name ?? "Class",
          startsAt: gymClass?.startsAt ?? "00:00",
        };
      })
      .sort((a, b) =>
        a.classDate === b.classDate ? b.startsAt.localeCompare(a.startsAt) : b.classDate.localeCompare(a.classDate),
      );
  }

  const countMyAttendance = (from: string, to: string) => getMyAttendance(from, to).length;

  /** How many check-ins on a date, and across how many classes. */
  function getAttendanceSummary(date: string) {
    const rows = attendance.filter((r) => r.classDate === date);
    return { present: rows.length, classes: new Set(rows.map((r) => r.classId)).size };
  }

  /** Everyone who could attend, plus who is already marked present. */
  function getRoster(classId: string, date: string) {
    const rows = attendance.filter((r) => r.classId === classId && r.classDate === date);
    const members: RosterMember[] = profiles
      .map((p) => ({ id: p.id, fullName: p.fullName, email: p.email, role: p.role }))
      .sort((a, b) => (a.fullName || a.email).localeCompare(b.fullName || b.email));

    const latest = rows.reduce<AttendanceRow | null>(
      (best, row) => (!best || row.recordedAt > best.recordedAt ? row : best),
      null,
    );
    const savedBy = latest ? profiles.find((p) => p.id === latest.recordedBy) : null;

    return {
      members,
      presentIds: rows.map((r) => r.memberId),
      lastSaved: latest ? { at: latest.recordedAt, by: savedBy?.fullName || "an admin" } : null,
    };
  }

  // ---------------------------------------------------------------------------
  // Accounts
  // ---------------------------------------------------------------------------

  function signUp(_prev: AuthFormState, form: FormData): AuthFormState {
    const fullName = text(form, "fullName").slice(0, 120);
    const email = text(form, "email").toLowerCase();
    const password = String(form.get("password") ?? "");
    const agreed = form.get("agree") === "on";

    const fieldErrors: AuthFormState["fieldErrors"] = {};
    if (!fullName) fieldErrors.fullName = "Tell us your name.";
    if (!EMAIL.test(email)) fieldErrors.email = "Enter a valid email address.";
    const weak = passwordProblem(password);
    if (weak) fieldErrors.password = weak;
    if (!agreed) fieldErrors.agree = "Please agree to the gym policies to continue.";
    if (Object.keys(fieldErrors).length > 0) return { fieldErrors, email, fullName };

    if (accounts.some((a) => a.email === email)) {
      return { fieldErrors: { email: "An account with that email already exists." }, email, fullName };
    }

    // New accounts are always members; admin access is assigned by staff.
    const profile: Profile = {
      id: newId("user"),
      email,
      fullName,
      role: "member",
      createdAt: now(),
      birthDate: null,
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      avatarPath: null,
    };
    setProfiles((prev) => [...prev, profile]);
    setAccounts((prev) => [...prev, { profileId: profile.id, email, password }]);
    setSessionId(profile.id);
    router.push("/dashboard");
    return {};
  }

  function signIn(_prev: AuthFormState, form: FormData): AuthFormState {
    const email = text(form, "email").toLowerCase();
    const password = String(form.get("password") ?? "");
    if (!EMAIL.test(email) || !password) return { error: "Enter your email and password.", email };

    const account = accounts.find((a) => a.email === email && a.password === password);
    if (!account) return { error: "That email and password do not match an account.", email };

    const profile = profiles.find((p) => p.id === account.profileId);
    setSessionId(account.profileId);
    const fallback = profile?.role === "admin" ? "/admin" : "/dashboard";
    router.push(safeNextPath(form.get("next"), fallback));
    return {};
  }

  function requestPasswordReset(_prev: AuthFormState, form: FormData): AuthFormState {
    const email = text(form, "email").toLowerCase();
    if (!EMAIL.test(email)) return { fieldErrors: { email: "Enter a valid email address." }, email };
    return {
      notice: `If ${email} has an account, a reset link would be emailed to it. (Email is not connected in this prototype.)`,
    };
  }

  function updatePassword(_prev: AuthFormState, form: FormData): AuthFormState {
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    const weak = passwordProblem(password);
    if (weak) return { fieldErrors: { password: weak } };
    if (password !== confirm) return { fieldErrors: { confirm: "Passwords do not match." } };

    setAccounts((prev) => prev.map((a) => (a.profileId === sessionId ? { ...a, password } : a)));
    router.push("/dashboard?password=updated");
    return {};
  }

  function signOut() {
    setSessionId(null);
    router.push("/login");
  }

  // ---------------------------------------------------------------------------
  // Classes
  // ---------------------------------------------------------------------------

  function saveClass(_prev: ActionState, form: FormData): ActionState {
    const id = text(form, "id");
    const day = Number(text(form, "day"));
    const time = text(form, "time").slice(0, 5);
    const name = text(form, "name");
    const label = text(form, "label");
    const status = text(form, "status") === "cancelled" ? "cancelled" : "scheduled";
    const tags = form.getAll("tags").filter((t): t is string => typeof t === "string" && validTags.has(t));

    const fieldErrors: Record<string, string> = {};
    if (id && !classes.some((c) => c.id === id)) return { error: "That class no longer exists." };
    if (!Number.isInteger(day) || day < 1 || day > 7) fieldErrors.day = "Pick a day.";
    if (!TIME.test(time)) fieldErrors.time = "Enter a start time.";
    if (!name) fieldErrors.name = "Give the class a name.";
    else if (name.length > 80) fieldErrors.name = "Keep it under 80 characters.";
    if (label.length > 40) fieldErrors.label = "Keep it under 40 characters.";
    if (tags.length === 0) fieldErrors.tags = "Pick at least one program so members can filter for it.";
    if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

    const row = { day, startsAt: `${time}:00`, name, tags: tags as GymClass["tags"], label: label || null, status } as const;
    if (id) setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...row } : c)));
    else setClasses((prev) => [...prev, { id: newId("class"), ...row }]);

    router.push(`/admin/classes?saved=${id ? "updated" : "added"}`);
    return {};
  }

  function setClassStatus(form: FormData) {
    const id = text(form, "id");
    const status = text(form, "status");
    if (status !== "scheduled" && status !== "cancelled") return;
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  // ---------------------------------------------------------------------------
  // Announcements
  // ---------------------------------------------------------------------------

  function saveAnnouncement(_prev: ActionState, form: FormData): ActionState {
    const id = text(form, "id");
    const title = text(form, "title");
    const body = text(form, "body");
    const category = text(form, "category");

    const fieldErrors: Record<string, string> = {};
    if (id && !announcements.some((a) => a.id === id)) return { error: "That announcement no longer exists." };
    if (!title) fieldErrors.title = "Add a title.";
    else if (title.length > 120) fieldErrors.title = "Keep it under 120 characters.";
    if (!body) fieldErrors.body = "Write the message members will see.";
    else if (body.length > 2000) fieldErrors.body = "Keep it under 2,000 characters.";
    if (!isAnnouncementCategory(category)) fieldErrors.category = "Pick a category.";
    if (Object.keys(fieldErrors).length > 0 || !isAnnouncementCategory(category)) return { fieldErrors };

    if (id) {
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, title, body, category, updatedAt: now() } : a)));
    } else {
      setAnnouncements((prev) => [{ id: newId("post"), title, body, category, publishedAt: now(), updatedAt: null }, ...prev]);
    }

    router.push(`/admin/announcements?saved=${id ? "updated" : "published"}`);
    return {};
  }

  function deleteAnnouncement(form: FormData) {
    const id = text(form, "id");
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    router.push("/admin/announcements?saved=deleted");
  }

  // ---------------------------------------------------------------------------
  // Attendance
  // ---------------------------------------------------------------------------

  /** Replaces the roster for one class on one date. */
  function saveAttendance(_prev: ActionState, form: FormData): ActionState {
    const classId = text(form, "classId");
    const date = text(form, "date");
    const memberIds = form.getAll("present").filter((v): v is string => typeof v === "string");

    if (!classes.some((c) => c.id === classId) || !isIsoDate(date)) return { error: "Pick a class and date first." };
    if (date > gymToday()) return { error: "Attendance cannot be recorded for a future date." };

    const recordedAt = now();
    setAttendance((prev) => [
      ...prev.filter((r) => !(r.classId === classId && r.classDate === date)),
      ...memberIds.map((memberId) => ({ memberId, classId, classDate: date, recordedAt, recordedBy: sessionId ?? "" })),
    ]);

    const n = memberIds.length;
    return { ok: true, message: `Saved. ${n} ${n === 1 ? "member" : "members"} marked present.` };
  }

  // ---------------------------------------------------------------------------
  // Own profile
  // ---------------------------------------------------------------------------

  const updateMe = (changes: Partial<Profile>) =>
    setProfiles((prev) => prev.map((p) => (p.id === sessionId ? { ...p, ...changes } : p)));

  function saveProfile(_prev: ActionState, form: FormData): ActionState {
    const fullName = text(form, "fullName");
    const birthDate = text(form, "birthDate");
    const phone = text(form, "phone");
    const emergencyName = text(form, "emergencyName");
    const emergencyPhone = text(form, "emergencyPhone");

    const fieldErrors: Record<string, string> = {};
    if (!fullName) fieldErrors.fullName = "Enter your name.";
    else if (fullName.length > 120) fieldErrors.fullName = "Keep it under 120 characters.";
    if (birthDate) {
      if (!isIsoDate(birthDate) || birthDate < "1900-01-01") fieldErrors.birthDate = "Enter a valid date.";
      else if (birthDate > gymToday()) fieldErrors.birthDate = "Birth date cannot be in the future.";
    }
    if (phone && !PHONE.test(phone)) fieldErrors.phone = "Enter a valid phone number.";
    if (emergencyName.length > 120) fieldErrors.emergencyName = "Keep it under 120 characters.";
    if (emergencyPhone && !PHONE.test(emergencyPhone)) fieldErrors.emergencyPhone = "Enter a valid phone number.";
    if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

    updateMe({
      fullName,
      birthDate: birthDate || null,
      phone,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
    });
    return { ok: true, message: "Profile saved." };
  }

  function savePhoto(_prev: ActionState, form: FormData): ActionState {
    const photo = form.get("photo");
    if (!(photo instanceof File) || photo.size === 0) return { error: "Choose a photo first." };
    if (photo.type !== "image/jpeg") return { error: "That file is not a supported image." };
    // Kept in the browser only: an object URL points at the resized image in memory.
    updateMe({ avatarPath: URL.createObjectURL(photo) });
    return { ok: true, message: "Photo updated." };
  }

  function removePhoto() {
    updateMe({ avatarPath: null });
  }

  return {
    currentProfile,
    classes: sortedClasses,
    announcements: sortedAnnouncements,
    listProfiles,
    getMyAttendance,
    countMyAttendance,
    getAttendanceSummary,
    getRoster,
    actions: {
      signUp,
      signIn,
      requestPasswordReset,
      updatePassword,
      signOut,
      saveClass,
      setClassStatus,
      saveAnnouncement,
      deleteAnnouncement,
      saveAttendance,
      saveProfile,
      savePhoto,
      removePhoto,
    },
  };
}

type Store = ReturnType<typeof useStoreValue>;

const StoreContext = createContext<Store | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const store = useStoreValue();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/** Read the shared data (classes, announcements, attendance, profiles). */
export function useData() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useData must be used inside <DataProvider>.");
  return store;
}

/** The functions that change the data, for forms and buttons. */
export function useActions() {
  return useData().actions;
}

/** The signed-in person, or null. */
export function useCurrentProfile() {
  return useData().currentProfile;
}
