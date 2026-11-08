import type { ReactNode } from "react";
import { RequireAdmin } from "@/components/guards";
import { PortalShell } from "@/components/portal/shell";
import { avatarUrl } from "@/lib/auth";

const items = [
  { label: "Overview", href: "/admin" },
  { label: "Manage Classes", href: "/admin/classes" },
  { label: "Manage Announcements", href: "/admin/announcements" },
  { label: "Attendance", href: "/admin/attendance" },
];

/** Sidebar frame for the admin portal. Only admins get past the guard. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAdmin>
      {(profile) => (
        <PortalShell
          profile={profile}
          avatarUrl={avatarUrl(profile.avatarPath)}
          subtitle="Admin portal"
          menuLabel="Administration"
          items={items}
          switchLink={{ label: "Member view", href: "/dashboard" }}
        >
          {children}
        </PortalShell>
      )}
    </RequireAdmin>
  );
}
