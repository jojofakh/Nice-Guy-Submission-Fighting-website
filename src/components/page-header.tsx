import { Container } from "@/components/ui";

/** Shared masthead for every inner page. */
export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 opacity-70" />
      <Container className="pb-14 pt-14 sm:pb-20 sm:pt-20">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-5 text-5xl leading-[0.9] sm:text-7xl">{title}</h1>
        {intro ? (
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ash sm:text-lg">
            {intro}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
