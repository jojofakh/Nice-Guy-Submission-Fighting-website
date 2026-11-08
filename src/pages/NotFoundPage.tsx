import { useDocumentTitle } from "@/lib/router";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Container } from "@/components/ui";

// The root not-found sits outside the (site) group, so it brings its own chrome.
export default function NotFound() {
  useDocumentTitle("Page not found — NGSF");
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden className="grid-lines absolute inset-0 -z-10" />
          <Container className="flex min-h-[60vh] flex-col justify-center py-24">
            <p className="kicker">Error 404</p>
            <h1 className="mt-5 text-5xl leading-[0.9] sm:text-7xl">
              Swept.
              <br />
              <span className="text-blood">Page not found.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-ash">
              That page is not on the mats. Try the schedule or head back to the front door.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/">Back to home</ButtonLink>
              <ButtonLink href="/schedule" variant="secondary">
                View the schedule
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
