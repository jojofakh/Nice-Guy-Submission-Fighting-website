/**
 * Single source of truth for gym-wide details. Everything user-facing that is
 * likely to change (phone number, address, socials) lives here so it never has
 * to be hunted down across pages.
 */
export const site = {
  name: "Nice Guy Submission Fighting",
  shortName: "NGSF",
  tagline: "Punishment with a smile",
  description:
    "Jiu Jitsu, Kickboxing, and MMA training in Evansville, Indiana. Your first class is always free.",
  url: "https://www.niceguysubmission.com",
  phone: "(812) 549-6921",
  phoneHref: "tel:+18125496921",
  email: "info@niceguysubmission.com",
  address: {
    street: "1415 N Fares Avenue",
    city: "Evansville",
    state: "IN",
    zip: "47711",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1415+N+Fares+Avenue+Evansville+IN+47711",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/niceguysubmissionfighting" },
    { label: "Instagram", href: "https://www.instagram.com/niceguysubmissionfighting" },
  ],
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

export const nav = [
  { label: "Classes", href: "/classes" },
  { label: "Schedule", href: "/schedule" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;
