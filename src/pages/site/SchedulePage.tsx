import { useDocumentTitle } from "@/lib/router";
import { PageHeader } from "@/components/page-header";
import { ScheduleBoard } from "@/components/schedule-board";
import { CtaBand } from "@/components/cta-band";
import { Container, Section } from "@/components/ui";

export default function SchedulePage() {
  useDocumentTitle("Schedule — NGSF");
  return (
    <>
      <PageHeader
        kicker="Weekly timetable"
        title="Schedule"
        intro="Filter by what you want to train. Everything below runs every week — arrive about ten minutes early for your first one."
      />

      <Section flush>
        <Container>
          <ScheduleBoard />

          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ash">
            Fighters-only MMA sessions are by coach approval. Sparring runs hard on
            Wednesday Kickboxing — if that&rsquo;s not what you&rsquo;re after yet, Thursday
            evening Beginner Kickboxing is the better door in.
          </p>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
