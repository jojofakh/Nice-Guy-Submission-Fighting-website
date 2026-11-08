import { Link } from "@/lib/router";
import { useState } from "react";
import { dropIn, formatPrice, plans } from "@/lib/plans";

type Cycle = "monthly" | "annual";

export function PricingTable() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <div>
      {/* The discount is called out below rather than inside the button, which
          otherwise makes the toggle too wide for a narrow phone. */}
      <div className="flex flex-col items-center gap-3">
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex border border-line p-1"
        >
          {(["monthly", "annual"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCycle(option)}
              aria-pressed={cycle === option}
              className={`px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                cycle === option ? "bg-blood text-bone" : "text-ash hover:text-bone"
              }`}
            >
              {option === "monthly" ? "Monthly" : "Annual"}
            </button>
          ))}
        </div>
        <p className="kicker">Annual plans include two months free</p>
      </div>

      <div className="mt-12 grid gap-px bg-line lg:grid-cols-3">
        {plans.map((plan) => {
          const annualAvailable = plan.priceAnnual !== null;
          const showAnnual = cycle === "annual" && annualAvailable;
          const amount = showAnnual ? plan.priceAnnual! : plan.priceMonthly;

          return (
            <article
              key={plan.slug}
              className={`relative flex flex-col p-8 ${
                plan.featured ? "bg-surface-2" : "bg-surface"
              }`}
            >
              {plan.featured ? (
                <>
                  <div aria-hidden className="hatch absolute inset-x-0 top-0 h-1" />
                  <p className="absolute right-8 top-8 font-mono text-[9px] uppercase tracking-[0.18em] text-blood">
                    Most popular
                  </p>
                </>
              ) : null}

              <h3 className="text-2xl">{plan.name}</h3>
              <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-ash">
                {plan.summary}
              </p>

              <p className="mt-7 flex items-baseline gap-2">
                <span className="font-display text-5xl">{formatPrice(amount)}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash-dim">
                  {showAnnual ? "/ year" : "/ month"}
                </span>
              </p>
              {cycle === "annual" && !annualAvailable ? (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ash-dim">
                  Monthly only
                </p>
              ) : null}

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-ash">
                    <span aria-hidden className="mt-1 text-blood">
                      &#9656;
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?plan=${plan.slug}&cycle=${showAnnual ? "annual" : "monthly"}`}
                className={`mt-9 py-3.5 text-center font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                  plan.featured
                    ? "bg-blood text-bone hover:bg-blood-bright"
                    : "border border-line-bright text-bone hover:border-bone hover:bg-surface-2"
                }`}
              >
                Choose {plan.name}
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-px flex flex-col gap-4 border border-line bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl">{dropIn.name}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ash">{dropIn.summary}</p>
        </div>
        <p className="flex shrink-0 items-baseline gap-2">
          <span className="font-display text-3xl">{formatPrice(dropIn.price)}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash-dim">
            / class
          </span>
        </p>
      </div>
    </div>
  );
}
