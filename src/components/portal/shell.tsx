import { Link } from "@/lib/router";
import type { ReactNode } from "react";
import type { Profile } from "@/lib/auth";
import { useActions } from "@/lib/store";
import { Logo } from "@/components/logo";
import { PortalNav, type PortalNavItem } from "@/components/portal/nav";
import { Button } from "@/components/ui";
import { Avatar } from "@/components/portal/ui";

const smallLink =
  "font-mono text-[11px] uppercase tracking-[0.16em] text-ash-dim transition-colors hover:text-bone";

/**
 * Sidebar + content frame shared by the member and admin portals. Purely
 * presentational: each page still runs its own requireUser / requireAdmin.
 */
export function PortalShell({
  profile,
  avatarUrl,
  subtitle,
  menuLabel,
  items,
  switchLink,
  children,
}: {
  profile: Profile;
  avatarUrl: string | null;
  subtitle: string;
  menuLabel: string;
  items: PortalNavItem[];
  switchLink?: { label: string; href: string };
  children: ReactNode;
}) {
  const { signOut } = useActions();

  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <aside className="relative border-b border-line bg-surface px-5 pt-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-blood" />

        <div className="flex items-center justify-between gap-4">
          <Logo className="h-11 lg:h-14" />
          {/* Compact sign-out for small screens; the full block is at the foot of the sidebar. */}
          <form action={signOut} className="lg:hidden">
            <button type="submit" className={smallLink}>
              Log out
            </button>
          </form>
        </div>

        <p className="kicker mt-3 hidden lg:block">{subtitle}</p>

        <div className="mt-4 lg:mt-12">
          <p className="kicker mb-2 hidden lg:block">{menuLabel}</p>
          <PortalNav items={items} label={menuLabel} />
        </div>

        <div className="mt-auto hidden pt-10 lg:block">
          <div className="flex items-center gap-4">
            <Avatar url={avatarUrl} name={profile.fullName || profile.email} />
            <div className="min-w-0">
              <p className="truncate text-sm text-bone">{profile.fullName || profile.email}</p>
              <p className="kicker mt-1">{profile.role === "admin" ? "Administrator" : "Member"}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-start gap-3">
            {switchLink ? (
              <Link href={switchLink.href} className={smallLink}>
                {switchLink.label} &rarr;
              </Link>
            ) : null}
            <Link href="/dashboard/profile" className={smallLink}>
              My profile
            </Link>
            <Link href="/reset-password" className={smallLink}>
              Change password
            </Link>
            <Link href="/" className={smallLink}>
              Back to website
            </Link>
          </div>
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="secondary" className="w-full">
              Log out
            </Button>
          </form>
        </div>
      </aside>

      <main id="main" className="relative isolate min-w-0 flex-1 px-5 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-50" />
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
