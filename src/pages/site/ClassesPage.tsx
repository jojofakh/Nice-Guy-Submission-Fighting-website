import { useDocumentTitle } from "@/lib/router";
import { programs } from "@/lib/classes";
import { PageHeader } from "@/components/page-header";
import { ProgramCard } from "@/components/program-card";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { Container, Section } from "@/components/ui";

export default function ClassesPage() {
  useDocumentTitle("Classes — NGSF");
  return (
    <>
      <PageHeader
        kicker="Programs"
        title="Classes"
        intro="Whether you're 6 years old or 60 years old, we have something for everyone. Pick a program below, then check the schedule for times."
      />

      <Section flush>
        <Container>
          <div className="grid gap-px bg-line sm:grid-cols-2">
            {programs.map((program, i) => (
              <Reveal key={program.slug} delay={i * 60}>
                <ProgramCard program={program} variant="full" index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
