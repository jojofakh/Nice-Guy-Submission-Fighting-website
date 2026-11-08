import { Link } from "@/lib/router";
import { addressLine, nav, site } from "@/lib/site";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo className="h-16" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ash">
              {site.tagline}. Jiu Jitsu, Kickboxing, Wrestling, and MMA on Fares Avenue in
              Evansville.
            </p>
            <p className="mt-6 kicker">First class is always free</p>
          </div>

          <div>
            <h3 className="font-mono text-[11px] tracking-[0.22em] text-ash-dim">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/" className="text-ash transition-colors hover:text-bone">
                  Home
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ash transition-colors hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] tracking-[0.22em] text-ash-dim">Visit</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="text-ash transition-colors hover:text-bone"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ash transition-colors hover:text-bone"
                >
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </a>
              </li>
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ash transition-colors hover:text-bone"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 font-mono text-[11px] tracking-wider text-ash-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}
          </p>
          <p className="sr-only">{addressLine}</p>
          <p>Evansville, Indiana</p>
        </div>
      </Container>
    </footer>
  );
}
