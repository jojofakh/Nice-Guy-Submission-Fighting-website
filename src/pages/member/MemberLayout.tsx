import type { ReactNode } from "react";
import { RequireUser } from "@/components/guards";
import { PortalShell } from "@/components/portal/shell";
import { avatarUrl } from "@/lib/auth";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Class Schedule", href: "/dashboard/schedule" },
  { label: "Announcements", href: "/dashboard/announcements" },
  { label: "My Attendance", href: "/dashboard/attendance" },
  { label: "My Profile", href: "/dashboard/profile" },
];

/** Sidebar frame for the member portal. Signed-out visitors are sent to /login. */
export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <RequireUser>
      {(profile) => (
        <PortalShell
          profile={profile}
          avatarUrl={avatarUrl(profile.avatarPath)}
          subtitle="Nice Guy Submission Fighting"
          menuLabel="Member menu"
          items={items}
          switchLink={profile.role === "admin" ? { label: "Admin portal", href: "/admin" } : undefined}
        >
          {children}
        </PortalShell>
      )}
    </RequireUser>
  );
}
