import { useDocumentTitle } from "@/lib/router";
import { PageHeader } from "@/components/page-header";
import { PricingTable } from "@/components/pricing-table";
import { CtaBand } from "@/components/cta-band";
import { Container, Section } from "@/components/ui";

const faqs = [
  {
    q: "Is the first class really free?",
    a: "Yes, every time. Come try a class before you pay for anything — no card, no membership, no sign-up fee.",
  },
  {
    q: "Am I locked into a contract?",
    a: "No. Memberships run month to month and you can cancel whenever. Annual plans are prepaid at a discount.",
  },
  {
    q: "What do I need to bring?",
    a: "Shorts, a t-shirt, and water. Our Jiu Jitsu program is No-Gi, so you don't need to buy a gi to start.",
  },
  {
    q: "Do you have a sibling or family rate?",
    a: "We do — give us a call and we'll work out the right rate for your household.",
  },
];

export default function PricingPage() {
  useDocumentTitle("Pricing — NGSF");
  return (
    <>
      <PageHeader
        kicker="Memberships"
        title="Pricing"
        intro="Simple month-to-month training. Pick the plan that matches how you want to train — you can always change it later."
      />

      <Section flush>
        <Container>
          <PricingTable />

          {/* TODO(pricing): remove once the gym confirms live rates. */}
          <p className="mt-8 border border-line-bright bg-surface px-5 py-4 font-mono text-[11px] leading-relaxed tracking-wider text-ash-dim">
            Note: rates shown are placeholders pending confirmation from the gym. Call{" "}
            <span className="text-ash">(812) 549-6921</span> for current pricing.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-3xl sm:text-4xl">Common questions</h2>
          <dl className="mt-10 grid gap-px bg-line sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-surface p-7">
                <dt className="font-display text-lg uppercase">{faq.q}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ash">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
