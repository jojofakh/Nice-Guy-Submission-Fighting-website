import type { ReactNode } from "react";
import type { Profile } from "@/lib/auth";
import { Redirect, usePathname } from "@/lib/router";
import { useCurrentProfile } from "@/lib/store";

/**
 * Access checks for the portals. Signed-out visitors go to the login page
 * (and come back afterwards); members who open an admin page go to their own
 * dashboard. Children receive the signed-in profile.
 */
export function RequireUser({ children }: { children: (profile: Profile) => ReactNode }) {
  const profile = useCurrentProfile();
  const pathname = usePathname();
  if (!profile) return <Redirect to={`/login?next=${encodeURIComponent(pathname)}`} />;
  return <>{children(profile)}</>;
}

export function RequireAdmin({ children }: { children: (profile: Profile) => ReactNode }) {
  return (
    <RequireUser>
      {(profile) => (profile.role === "admin" ? children(profile) : <Redirect to="/dashboard" />)}
    </RequireUser>
  );
}
