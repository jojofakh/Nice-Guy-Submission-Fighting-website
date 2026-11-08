import { Link } from "@/lib/router";
import { usePathname } from "@/lib/router";

export type PortalNavItem = { label: string; href: string };

/** Sidebar links. Client-side only so the active item follows navigation. */
export function PortalNav({ items, label }: { items: PortalNavItem[]; label: string }) {
  const pathname = usePathname();
  // The first item is the portal root (/dashboard, /admin): exact match only,
  // otherwise it would light up on every sub-page.
  const isActive = (href: string, index: number) =>
    index === 0 ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label={label}>
      <ul className="-mx-5 flex overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {items.map((item, index) => {
          const active = isActive(item.href, index);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors lg:border-b lg:border-line lg:px-0 lg:py-4 ${
                  active ? "text-bone" : "text-ash hover:text-bone"
                }`}
              >
                {item.label}
                {/* Underline on the mobile strip, left bar in the sidebar — the site header's active marker. */}
                <span
                  aria-hidden
                  className={`absolute inset-x-4 -bottom-px h-px bg-blood transition-transform duration-300 lg:inset-x-auto lg:-left-8 lg:bottom-0 lg:top-0 lg:h-auto lg:w-0.5 ${
                    active ? "scale-100" : "scale-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
