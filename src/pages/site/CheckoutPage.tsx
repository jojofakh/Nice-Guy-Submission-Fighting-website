import { useDocumentTitle } from "@/lib/router";
import { PageHeader } from "@/components/page-header";
import { CheckoutForm } from "@/components/checkout-form";
import { Container, Section } from "@/components/ui";

export default function CheckoutPage() {
  useDocumentTitle("Checkout — NGSF");
  return (
    <>
      <PageHeader
        kicker="Join the gym"
        title="Checkout"
        intro="Review your membership below. Online payment is not switched on yet — we finish sign-up over the phone or at the front desk."
      />

      <Section flush>
        <Container>
          <CheckoutForm />
        </Container>
      </Section>
    </>
  );
}
