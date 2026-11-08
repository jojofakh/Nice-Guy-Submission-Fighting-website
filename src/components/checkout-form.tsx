import { Link } from "@/lib/router";
import { useSearchParams } from "@/lib/router";
import { useState } from "react";
import { formatPrice, planBySlug, plans } from "@/lib/plans";
import type { BillingCycle } from "@/lib/payments";
import { site } from "@/lib/site";
import { FieldGroup, Input, Label } from "@/components/field";
import { Button } from "@/components/ui";

const fallbackPlan = plans.find((p) => p.featured) ?? plans[0];

/**
 * Checkout UI. Deliberately non-functional: payments are not connected yet, so
 * the card section is inert and no data leaves the browser. See
 * src/lib/payments.ts for the go-live checklist.
 *
 * Card inputs are rendered `disabled` rather than hidden so the layout can be
 * reviewed and signed off now — and so nobody can type a real card number into
 * a form that has nowhere safe to send it.
 */
export function CheckoutForm() {
  const searchParams = useSearchParams();

  const requestedPlan = searchParams.get("plan");
  const requestedCycle = searchParams.get("cycle");

  const [planSlug, setPlanSlug] = useState(
    requestedPlan && planBySlug.has(requestedPlan) ? requestedPlan : fallbackPlan.slug,
  );
  const [cycle, setCycle] = useState<BillingCycle>(
    requestedCycle === "annual" ? "annual" : "monthly",
  );

  const plan = planBySlug.get(planSlug) ?? fallbackPlan;
  const annualPrice = plan.priceAnnual;
  const effectiveCycle: BillingCycle =
    cycle === "annual" && annualPrice !== null ? "annual" : "monthly";
  const total = effectiveCycle === "annual" ? annualPrice! : plan.priceMonthly;

  return (
    <div className="grid gap-px bg-line lg:grid-cols-[1.35fr_1fr]">
      {/* ------------------------------------------------ details and payment */}
      <form
        className="bg-surface p-8 sm:p-10"
        // Payments are not wired up, so submission is blocked outright.
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset className="border-0 p-0">
          <legend className="kicker">01 &middot; Your details</legend>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" autoComplete="name" placeholder="Jordan Reyes" />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="phone" hint="optional">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(812) 000-0000"
              />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="start">Preferred start</Label>
              <Input id="start" name="start" type="date" />
            </FieldGroup>
          </div>
        </fieldset>

        <fieldset className="mt-12 border-0 p-0" aria-describedby="payment-status">
          <legend className="kicker">02 &middot; Payment</legend>

          <div
            id="payment-status"
            role="status"
            className="mt-6 flex items-start gap-4 border border-line-bright bg-ink px-5 py-4"
          >
            <span
              aria-hidden
              className="mt-1.5 h-2 w-2 shrink-0 border border-blood"
            />
            <p className="text-sm leading-relaxed text-ash">
              <span className="text-bone">Online payments are not live yet.</span> The fields
              below are a preview of the finished checkout. Nothing is stored or sent. To sign
              up today, call{" "}
              <a
                href={site.phoneHref}
                className="text-bone underline decoration-blood underline-offset-4"
              >
                {site.phone}
              </a>
              .
            </p>
          </div>

          <div className="mt-6 grid gap-5 opacity-70 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldGroup>
                <Label htmlFor="card">Card number</Label>
                <Input
                  id="card"
                  name="card"
                  inputMode="numeric"
                  placeholder="&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;"
                  disabled
                />
              </FieldGroup>
            </div>
            <FieldGroup>
              <Label htmlFor="expiry">Expiry</Label>
              <Input id="expiry" name="expiry" placeholder="MM / YY" disabled />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="cvc">Security code</Label>
              <Input id="cvc" name="cvc" placeholder="&bull;&bull;&bull;" disabled />
            </FieldGroup>
            <div className="sm:col-span-2">
              <FieldGroup>
                <Label htmlFor="zip">Billing ZIP</Label>
                <Input
                  id="zip"
                  name="zip"
                  autoComplete="postal-code"
                  placeholder="47711"
                  disabled
                />
              </FieldGroup>
            </div>
          </div>

          <Button type="submit" disabled className="mt-9 w-full">
            Payments coming soon
          </Button>

          <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-wider text-ash-dim">
            When this goes live, card details will be handled entirely by the payment provider
            and will never pass through this site.
          </p>
        </fieldset>
      </form>

      {/* -------------------------------------------------------- order summary */}
      <aside className="bg-surface-2 p-8 sm:p-10">
        <h2 className="text-xl">Order summary</h2>

        <fieldset className="mt-7 border-0 p-0">
          <legend className="kicker">Membership</legend>
          <div className="mt-4 space-y-px">
            {plans.map((p) => (
              <label
                key={p.slug}
                className={`flex cursor-pointer items-start gap-4 border px-4 py-4 transition-colors ${
                  p.slug === planSlug
                    ? "border-blood bg-ink"
                    : "border-line bg-ink/40 hover:border-line-bright"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.slug}
                  checked={p.slug === planSlug}
                  onChange={() => setPlanSlug(p.slug)}
                  className="mt-1 accent-[var(--color-blood)]"
                />
                <span className="flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-bone">{p.name}</span>
                    <span className="font-mono text-xs text-ash">
                      {formatPrice(p.priceMonthly)}/mo
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-ash-dim">
                    {p.summary}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8 border-0 p-0">
          <legend className="kicker">Billing</legend>
          <div className="mt-4 inline-flex border border-line p-1">
            {(["monthly", "annual"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCycle(option)}
                aria-pressed={effectiveCycle === option}
                disabled={option === "annual" && annualPrice === null}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors disabled:opacity-40 ${
                  effectiveCycle === option ? "bg-blood text-bone" : "text-ash hover:text-bone"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <dl className="mt-9 space-y-3 border-t border-line pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-ash">{plan.name}</dt>
            <dd className="text-bone">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ash">Sign-up fee</dt>
            <dd className="text-bone">{formatPrice(0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ash">First class</dt>
            <dd className="font-mono text-xs uppercase tracking-widest text-blood">Free</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-baseline justify-between border-t border-line pt-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
            Due today
          </span>
          <span className="font-display text-3xl">{formatPrice(total)}</span>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ash-dim">
          {effectiveCycle === "annual"
            ? "Billed once a year"
            : "Billed monthly · cancel anytime"}
        </p>

        <Link
          href="/pricing"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
        >
          <span aria-hidden>&larr;</span> Back to pricing
        </Link>
      </aside>
    </div>
  );
}
