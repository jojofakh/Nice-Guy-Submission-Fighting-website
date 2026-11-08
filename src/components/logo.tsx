import { Link } from "@/lib/router";
import logo from "@/assets/ngsf-logo.png";

/**
 * The NGSF logo. The PNG in /public was cut from the gym's artwork with its
 * black field made transparent, so it sits on any of the site's dark surfaces.
 */
export function Logo({
  className = "h-11",
  href = "/",
}: {
  /** Size it by height; width follows the artwork. */
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="Nice Guy Submission Fighting — home">
      {/* Inline width: auto (not just a class) so the artwork keeps its
          proportions even before the stylesheet arrives. */}
      <img src={logo} alt="" className={className} style={{ width: "auto" }} />
    </Link>
  );
}
