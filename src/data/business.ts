/**
 * Business details supplied by the client. Nothing here is invented — if a detail (address,
 * opening hours, registration numbers, …) is not listed, it has not been provided and the
 * website intentionally does not show one.
 */
export const BUSINESS = {
  name: "Al Makkah Enterprises",
  tagline: "Trading & General Supplies",
  email: "makkahenterprisespk.com@gmail.com",
  contacts: [
    { name: "M. Haseeb", phone: "0317-1047427", wa: "923171047427" },
    { name: "M. Hashir", phone: "0324-3255948", wa: "923243255948" },
  ],
} as const;

export type Contact = (typeof BUSINESS.contacts)[number];

/** Contact used for one-tap inquiries where the visitor isn't asked to choose. */
export const PRIMARY_CONTACT = BUSINESS.contacts[0];

/** `tel:` link, international format so it works from any network. */
export const telHref = (c: { wa: string }) => `tel:+${c.wa}`;

/** Plain WhatsApp chat link (no pre-filled text). */
export const waChatHref = (c: { wa: string }) => `https://wa.me/${c.wa}`;

/** WhatsApp link with a pre-filled message. */
export const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
