import { Link } from "@/lib/router";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

/**
 * Split-screen frame for sign-in, registration, and password screens. The
 * brand panel reuses the site's hero treatment (grid lines, Oswald display
 * type, crimson accent); the form side is the plain ink surface. On small
 * screens the panel collapses to a logo bar above the form.
 */
export function AuthShell({
  panel,
  kicker,
  title,
  intro,
  children,
  footer,
}: {
  panel: { kicker: string; title: ReactNode; intro: string; footnote?: string };
  kicker: string;
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <aside className="relative flex overflow-hidden border-b border-line bg-surface px-5 py-5 sm:px-10 lg:w-[45%] lg:max-w-3xl lg:flex-col lg:border-b-0 lg:border-r lg:px-14 lg:py-12">
        <div aria-hidden className="grid-lines absolute inset-0 opacity-70" />
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-blood" />

        <div className="relative">
          <Logo className="h-12 lg:h-20" />
        </div>

        <div className="relative mt-auto hidden pt-16 lg:block">
          <p className="kicker">{panel.kicker}</p>
          <h2 className="mt-5 text-6xl leading-[0.9] xl:text-7xl">{panel.title}</h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-ash">{panel.intro}</p>
          <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim">
            {panel.footnote ?? "Evansville, Indiana · First class is always free"}
          </p>
        </div>
      </aside>

      <main id="main" className="flex flex-1 flex-col px-5 py-8 sm:px-10 lg:px-14 lg:py-12">
        <Link
          href="/"
          className="self-end font-mono text-[11px] uppercase tracking-[0.18em] text-ash-dim transition-colors hover:text-bone"
        >
          &larr; Back to website
        </Link>

        <div className="m-auto w-full max-w-md py-10">
          <p className="kicker">{kicker}</p>
          <h1 className="mt-4 text-5xl leading-[0.9] sm:text-6xl">{title}</h1>
          {intro ? <p className="mt-5 text-base leading-relaxed text-ash">{intro}</p> : null}
          <div className="mt-10">{children}</div>
          {footer ? (
            <div className="mt-8 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ash-dim">
              {footer}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

/** Inline link style used across the site (contact form, footers). */
export const authLink = "text-bone underline decoration-blood underline-offset-4 hover:decoration-blood-bright";
