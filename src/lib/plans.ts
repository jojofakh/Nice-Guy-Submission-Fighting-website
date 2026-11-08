/**
 * Membership tiers for the pricing + checkout UI.
 *
 * TODO(pricing): these amounts are PLACEHOLDERS. The current NGSF site does not
 * publish rates, so confirm real numbers with the gym before launch and update
 * `priceMonthly` / `priceAnnual` here — no other file hardcodes a price.
 *
 * Amounts are in cents so they can be handed straight to a payment provider
 * without a float-rounding step.
 */
export type Plan = {
  slug: string;
  name: string;
  summary: string;
  priceMonthly: number;
  /** Charged once per year. Null when the plan has no annual option. */
  priceAnnual: number | null;
  features: string[];
  /** Renders the highlighted card and the default checkout selection. */
  featured?: boolean;
  /** Shown instead of a price when the plan is not a recurring charge. */
  badge?: string;
};

export const plans: Plan[] = [
  {
    slug: "kids",
    name: "Kids",
    summary: "Nice Kids Submission Fighting, ages 6 and up.",
    priceMonthly: 8500,
    priceAnnual: 85000,
    features: [
      "All Kids Jiu Jitsu classes",
      "Mon / Wed / Fri evenings",
      "Sibling discount available",
      "No long-term contract",
    ],
  },
  {
    slug: "unlimited",
    name: "Adult Unlimited",
    summary: "Every adult class on the schedule, every week.",
    priceMonthly: 12500,
    priceAnnual: 125000,
    features: [
      "Jiu Jitsu, Kickboxing, Wrestling, MMA",
      "Beginner classes included",
      "Weekend open mats",
      "Cancel anytime",
    ],
    featured: true,
  },
  {
    slug: "fight-team",
    name: "Fight Team",
    summary: "For competitors training toward a fight or a bracket.",
    priceMonthly: 15000,
    priceAnnual: 150000,
    features: [
      "Everything in Adult Unlimited",
      "Fighters-only MMA sessions",
      "Competition prep and corner support",
      "Coach approval required",
    ],
  },
];

export const dropIn = {
  name: "Drop-In",
  price: 2000,
  summary: "Training in town for the day? Pay for the mat time you use.",
};

export const planBySlug = new Map(plans.map((p) => [p.slug, p]));

/** 1250 -> "$12.50", 12500 -> "$125" */
export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
