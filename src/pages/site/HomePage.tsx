import { useDocumentTitle } from "@/lib/router";
import { programs } from "@/lib/classes";
import { dropIn, formatPrice, plans } from "@/lib/plans";
import { Hero } from "@/components/hero";
import { ProgramCard } from "@/components/program-card";
import { Testimonials } from "@/components/testimonials";
import { TodayClasses } from "@/components/today-classes";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";

const firstVisit = [
  {
    step: "Say hello",
    body: "Call, text, or send the form. Tell us roughly what you're after and we'll point you at the right class to start with.",
  },
  {
    step: "Show up early",
    body: "Get there ten minutes before class in shorts and a t-shirt. Bring water. No gi, no gear, no membership needed.",
  },
  {
    step: "Train for free",
    body: "You'll drill technique with a partner and get walked through it step by step. First class is on us, every time.",
  },
];

export default function HomePage() {
  useDocumentTitle("Nice Guy Submission Fighting — Punishment with a smile");
  const featured = plans.find((p) => p.featured) ?? plans[0];

  return (
    <>
      <Hero />

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              kicker="What we train"
              title="Six programs, one room"
              intro="From our first-rate coaches to our experienced students and training partners, we can give you the tools and technique to help you reach your goals on the mats."
            />
          </Reveal>

          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <Reveal key={program.slug} delay={i * 60}>
                <ProgramCard program={program} index={i} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <ButtonLink href="/classes" variant="secondary">
              Read the full class breakdown
            </ButtonLink>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                kicker="First visit"
                title="Walking in the door"
                intro="Nobody expects you to know anything on day one. Here is exactly how it goes."
              />
              <ol className="mt-10 space-y-8">
                {firstVisit.map((item, i) => (
                  <li key={item.step} className="flex gap-5">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-blood font-mono text-xs text-blood">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg">{item.step}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ash">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={120} className="lg:pt-14">
              <TodayClasses />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <Testimonials />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid items-center gap-10 border border-line bg-surface p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="kicker">Memberships</p>
              <h2 className="mt-3 text-3xl leading-[0.95] sm:text-4xl">
                Train unlimited from {formatPrice(featured.priceMonthly)} a month
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ash">
                Month to month, cancel whenever. Just training for a day while you&rsquo;re in
                town? Drop-ins are {formatPrice(dropIn.price)}.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/pricing">Compare memberships</ButtonLink>
              </div>
            </div>

            <ul className="space-y-3 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {featured.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-ash">
                  <span aria-hidden className="mt-1 text-blood">
                    &#9656;
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
