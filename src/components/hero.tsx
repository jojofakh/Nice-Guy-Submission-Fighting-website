import { site } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";

const stats = [
  { value: "6–60", label: "Age range on the mats" },
  { value: "6", label: "Programs, one schedule" },
  { value: "24", label: "Classes every week" },
  { value: "$0", label: "Your first class" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-blood/12 blur-[120px]"
      />

      <Container className="pb-20 pt-16 sm:pb-28 sm:pt-24">
        <p className="kicker">Evansville, Indiana &middot; Est. on Fares Ave</p>

        <h1 className="mt-6 text-[13vw] leading-[0.86] sm:text-7xl lg:text-8xl">
          Punishment
          <br />
          with a <span className="text-blood">smile</span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-ash sm:text-lg">
          Nice Guy Submission Fighting is your one stop shop for all your Jiu Jitsu,
          Kickboxing, and MMA training needs. Whether you&rsquo;re starting a new hobby,
          chasing a pro record, or just looking for a fun way to stay in shape &mdash; come
          give Nice Guy a try.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="/contact">Claim your free class</ButtonLink>
          <ButtonLink href="/schedule" variant="secondary">
            See the schedule
          </ButtonLink>
        </div>

        <p className="mt-6 font-mono text-xs tracking-wider text-ash-dim">
          Or call{" "}
          <a href={site.phoneHref} className="text-bone underline decoration-blood underline-offset-4">
            {site.phone}
          </a>
        </p>

        <dl className="mt-20 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-ink px-5 py-7">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-3xl sm:text-4xl">{stat.value}</span>
                <span className="mt-2 block font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ash-dim">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
