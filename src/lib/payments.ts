/**
 * Payments are not part of this prototype. The checkout screen is complete so
 * the flow can be reviewed, but the card fields are disabled and nothing is
 * collected or sent. A real payment provider (e.g. Stripe Checkout) needs a
 * server, which comes with the back end in a later milestone.
 */

export type BillingCycle = "monthly" | "annual";
