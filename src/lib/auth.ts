/**
 * Account types and helpers. In this prototype accounts live in mock data
 * (src/data/mock-data.ts) and are held in React state by DataProvider
 * (src/lib/store.tsx); the access checks are the <RequireUser> and
 * <RequireAdmin> guards in src/components/guards.tsx.
 */

export type Role = "member" | "admin";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
  birthDate: string | null;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  /** A photo URL (an in-browser object URL once a member uploads one), or null. */
  avatarPath: string | null;
};

/** The photo URL to show for a profile. Kept as a function so components read the same as before. */
export function avatarUrl(path: string | null): string | null {
  return path;
}

/**
 * Only allow redirects back into this site. Resolving against a dummy origin
 * catches every trick (`//evil.com`, `/\evil.com`, embedded tabs) that would
 * make a browser leave the site.
 */
export function safeNextPath(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  try {
    const base = "http://ngsf.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
