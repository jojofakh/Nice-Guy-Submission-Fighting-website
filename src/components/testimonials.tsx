import { useState } from "react";
import { testimonials } from "@/lib/testimonials";

function Stars() {
  return (
    <p aria-label="Rated 5 out of 5" className="flex gap-1 text-blood">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden>
          &#9733;
        </span>
      ))}
    </p>
  );
}

/**
 * One review at a time with prev/next controls. A carousel is used here rather
 * than a grid because the reviews vary wildly in length — Tyler's is a
 * paragraph, Kyle's is one line — and a grid of those looks broken.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const active = testimonials[index];

  const go = (next: number) => setIndex(((next % total) + total) % total);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <div>
        <p className="kicker">Word of mouth</p>
        <h2 className="mt-3 text-3xl leading-[0.95] sm:text-5xl">
          No egos.
          <br />
          No frills.
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-ash">
          Every review below is from a real training partner or parent at the gym.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous review"
            className="flex h-11 w-11 items-center justify-center border border-line-bright text-ash transition-colors hover:border-bone hover:text-bone"
          >
            <span aria-hidden>&larr;</span>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next review"
            className="flex h-11 w-11 items-center justify-center border border-line-bright text-ash transition-colors hover:border-bone hover:text-bone"
          >
            <span aria-hidden>&rarr;</span>
          </button>
          <span className="ml-2 font-mono text-xs tracking-widest text-ash-dim">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      <figure
        aria-live="polite"
        className="relative border border-line bg-surface p-8 sm:p-10"
      >
        <div aria-hidden className="hatch absolute inset-x-0 top-0 h-1" />
        <Stars />
        <blockquote className="mt-6 text-lg leading-relaxed text-bone/90 sm:text-xl">
          &ldquo;{active.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-ash">
          {active.name}
        </figcaption>
      </figure>
    </div>
  );
}
