import { Link } from "@/lib/router";
import type { ReactNode } from "react";

/**
 * Building blocks for the member and admin portals, drawn from the same
 * vocabulary as the public site: near-black surfaces, hairline borders, mono
 * caps for labels, Oswald for figures, crimson as the only accent.
 */

export { Button, ButtonLink, buttonClass } from "@/components/ui";

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return letters.toUpperCase();
}

const avatarSizes = {
  sm: "h-11 w-11 text-xs",
  lg: "h-36 w-36 text-3xl",
};

/** Profile photo, or the person's initials when there is none. */
export function Avatar({ url, name, size = "sm" }: { url: string | null; name: string; size?: keyof typeof avatarSizes }) {
  const box = `flex shrink-0 items-center justify-center overflow-hidden border border-line-bright bg-ink font-mono ${avatarSizes[size]}`;
  if (!url) {
    return (
      <span aria-hidden className={box}>
        {initials(name)}
      </span>
    );
  }
  return (
    <span className={box}>
      <img src={url} alt={`${name}'s photo`} className="h-full w-full object-cover" />
    </span>
  );
}

export function PortalHeader({
  kicker,
  title,
  intro,
  actions,
  children,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-4 break-words text-4xl leading-[0.9] sm:text-6xl">{title}</h1>
        {intro ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-ash">{intro}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}

/** Bordered panel with an optional title bar, like the site's schedule cards. */
export function Card({
  title,
  action,
  children,
  footer,
  className = "",
  bodyClassName = "",
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`relative border border-line bg-surface ${className}`}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-blood" />
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-5 sm:px-7">
          <h2 className="text-xl leading-none">{title}</h2>
          {action}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
      {footer ? (
        <div className="border-t border-line px-5 py-4 font-mono text-[10px] leading-relaxed tracking-wider text-ash-dim sm:px-7">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

/** Text link in a card's title bar ("View all →"). */
export function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
    >
      {children}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  note,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  /** Crimson rule on the left, for the one figure that matters most. */
  highlight?: boolean;
}) {
  // Borderless: lay several out in a `grid gap-px border border-line bg-line`
  // container, the hairline-grid pattern the public schedule uses.
  return (
    <div className="relative bg-surface p-6">
      {highlight ? <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-blood" /> : null}
      <p className="kicker">{label}</p>
      <p className="mt-4 font-display text-5xl font-bold leading-none">{value}</p>
      {note ? <p className="mt-3 text-xs text-ash">{note}</p> : null}
    </div>
  );
}

/** The site's outlined metadata chip, with a crimson variant for warnings. */
export function Badge({
  tone = "default",
  children,
}: {
  tone?: "default" | "blood" | "solid";
  children: ReactNode;
}) {
  const tones = {
    default: "border-line text-ash-dim",
    blood: "border-blood/60 text-blood-bright",
    solid: "border-blood bg-blood text-bone",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "scheduled" | "cancelled" }) {
  return status === "scheduled" ? (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-bone" />
      Scheduled
    </span>
  ) : (
    <Badge tone="blood">Cancelled</Badge>
  );
}

/** Link-based filter buttons, styled like the public schedule's filters. */
export function FilterTabs({
  label,
  tabs,
  active,
}: {
  label: string;
  tabs: { key: string; label: string; href: string }[];
  active: string;
}) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
              isActive
                ? "border-blood bg-blood text-bone"
                : "border-line text-ash hover:border-line-bright hover:text-bone"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <p className="px-5 py-12 text-center font-mono text-xs tracking-wider text-ash-dim sm:px-7">{children}</p>
  );
}

/** Calendar tile: "MON / 14". */
export function DateTile({ weekday, day }: { weekday: string; day: string | number }) {
  return (
    <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center border border-line bg-ink">
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-blood">{weekday}</span>
      <span className="font-display text-2xl font-bold leading-none">{day}</span>
    </span>
  );
}

/** Table header cell, matching the site's mono labels. */
export const thClass = "px-3 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-ash-dim";

/** Row actions in tables and lists ("Edit", "Cancel class"). */
export const rowAction =
  "font-mono text-[11px] uppercase tracking-[0.16em] text-ash underline decoration-line-bright underline-offset-4 transition-colors hover:text-bone hover:decoration-bone";
export const rowActionDanger =
  "font-mono text-[11px] uppercase tracking-[0.16em] text-blood-bright underline decoration-blood/50 underline-offset-4 transition-colors hover:decoration-blood-bright";

/** Small mono navigation link ("← All classes"). */
export const quietLink =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim transition-colors hover:text-bone";
