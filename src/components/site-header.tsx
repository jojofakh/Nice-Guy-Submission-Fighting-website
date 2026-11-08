import { Link } from "@/lib/router";
import { usePathname } from "@/lib/router";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the full-screen panel is open, freeze the page behind it and let
  // Escape dismiss it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-line bg-ink/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                isActive(item.href) ? "text-bone" : "text-ash hover:text-bone"
              }`}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute inset-x-4 -bottom-px h-px bg-blood transition-transform duration-300 ${
                  isActive(item.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={site.phoneHref}
            className="font-mono text-xs tracking-wider text-ash transition-colors hover:text-bone"
          >
            {site.phone}
          </a>
          {/* Points at the dashboard: signed-out visitors are redirected to
              /login by the proxy. The header itself never reads the session,
              which keeps every marketing page statically rendered. */}
          <Link
            href="/dashboard"
            aria-current={isActive("/dashboard") ? "page" : undefined}
            className="font-mono text-xs uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
          >
            Account
          </Link>
          <Link
            href="/contact"
            className="bg-blood px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-colors hover:bg-blood-bright"
          >
            Free Class
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="relative block h-3.5 w-6">
            <span
              className={`absolute left-0 block h-px w-full bg-bone transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-bone transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-ink md:hidden"
      >
        {/* Any tap inside the panel is either a link or the phone number, so
            closing on click here covers every exit without an extra effect. */}
        <nav
          aria-label="Mobile"
          onClick={() => setOpen(false)}
          className="flex flex-col px-5 py-4"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex items-center justify-between border-b border-line py-4 font-display text-2xl uppercase ${
                isActive(item.href) ? "text-blood" : "text-bone"
              }`}
            >
              {item.label}
              <span aria-hidden className="font-mono text-xs text-ash-dim">
                &rarr;
              </span>
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-6 bg-blood py-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-bone"
          >
            Claim your free class
          </Link>
          <Link
            href="/dashboard"
            className="mt-3 border border-line-bright py-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-bone"
          >
            Member account
          </Link>
          <a
            href={site.phoneHref}
            className="py-4 text-center font-mono text-xs tracking-wider text-ash"
          >
            {site.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
