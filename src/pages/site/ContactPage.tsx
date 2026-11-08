import { useDocumentTitle } from "@/lib/router";
import { addressLine, site } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { Container, Section } from "@/components/ui";

const details = [
  { label: "Call or text", value: site.phone, href: site.phoneHref },
  {
    label: "Find us",
    value: `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`,
    href: site.mapsUrl,
  },
];

export default function ContactPage() {
  useDocumentTitle("Contact — NGSF");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(addressLine)}&output=embed`;

  return (
    <>
      <PageHeader
        kicker="Get in touch"
        title="Contact us"
        intro="Easiest way in is a phone call. If you would rather we reach out to you, fill in the form and we will."
      />

      <Section flush>
        <Container>
          <div className="grid gap-px bg-line lg:grid-cols-[1fr_1.2fr]">
            <div className="bg-surface-2 p-8 sm:p-10">
              <dl className="space-y-8">
                {details.map((item) => (
                  <div key={item.label}>
                    <dt className="kicker">{item.label}</dt>
                    <dd className="mt-2">
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        className="font-display text-xl uppercase leading-tight transition-colors hover:text-blood"
                      >
                        {item.value}
                      </a>
                    </dd>
                  </div>
                ))}

                <div>
                  <dt className="kicker">Follow along</dt>
                  <dd className="mt-3 flex gap-3">
                    {site.socials.map((s) => (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-line-bright px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ash transition-colors hover:border-bone hover:text-bone"
                      >
                        {s.label}
                      </a>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="kicker">Before you come in</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-ash">
                    Shorts, a t-shirt, and water is all you need. Arrive about ten minutes
                    early so a coach can walk you through the room. Your first class is free.
                  </dd>
                </div>
              </dl>
            </div>

            <ContactForm />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="border border-line">
              <iframe
                title={`Map showing ${site.name} at ${addressLine}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[22rem] w-full grayscale-[35%] sm:h-[26rem]"
              />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
