import { site } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 opacity-60" />
      <Container className="py-20 text-center sm:py-28">
        <p className="kicker">No sign-up fee. No pressure.</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl leading-[0.92] sm:text-6xl">
          Your first class is <span className="text-blood">always free</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ash">
          Show up in shorts and a t-shirt. We&rsquo;ll handle the rest.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/contact">Book your free class</ButtonLink>
          <ButtonLink href={site.phoneHref} variant="secondary">
            Call {site.phone}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
