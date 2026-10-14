import { BUSINESS } from "@/data/business";
import { specSummary, type Product } from "@/data/catalog";

export interface QuoteFields {
  name: string;
  company: string;
  phone: string;
  email: string;
  product: string;
  spec: string;
  qty: string;
  extra: string;
}

export type QuoteErrors = Partial<Record<keyof QuoteFields, string>>;

export const EMPTY_QUOTE: QuoteFields = {
  name: "",
  company: "",
  phone: "",
  email: "",
  product: "",
  spec: "",
  qty: "",
  extra: "",
};

const TBD = "To be discussed";

/** The standard opening message for every quotation request (WhatsApp and email). */
export function whatsappMessage(product: string, spec?: string, qty?: string): string {
  return `Hello ${BUSINESS.name}, I would like to request a quotation for ${product}. Required specifications: ${spec?.trim() || TBD}. Quantity: ${qty?.trim() || TBD}. Please share the price and availability.`;
}

/** Combine specification options the visitor tapped with anything they typed. */
export function specText(picked: Record<string, string>, typed: string): string {
  return [
    ...Object.entries(picked)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`),
    typed.trim(),
  ]
    .filter(Boolean)
    .join(", ");
}

/** Full message for the quotation form — request line plus the sender's details. */
export function quoteMessage(f: QuoteFields, picked: Record<string, string> = {}): string {
  let t = whatsappMessage(f.product.trim(), specText(picked, f.spec), f.qty);
  t += `\n\nName: ${f.name.trim()}`;
  if (f.company.trim()) t += `\nCompany: ${f.company.trim()}`;
  t += `\nPhone: ${f.phone.trim()}`;
  if (f.email.trim()) t += `\nEmail: ${f.email.trim()}`;
  if (f.extra.trim()) t += `\nAdditional requirements: ${f.extra.trim()}`;
  return t;
}

/** One-tap inquiry from a product card: product, category and the listed options. */
export function inquiryMessage(p: Product): string {
  let t = whatsappMessage(p.name);
  t += `\n\nCategory: ${p.subcategory}`;
  const options = specSummary(p);
  if (options) t += `\nListed options: ${options}`;
  return t;
}

/** Message for a search that returned nothing. */
export function notListedMessage(term: string): string {
  return `Hello ${BUSINESS.name}, I searched for "${term.trim()}" on your website but could not find it. Could you let me know if you can supply it? Please share the price and availability.`;
}

export const mailtoHref = (subject: string, body: string) =>
  `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export function validateQuote(f: QuoteFields): QuoteErrors {
  const e: QuoteErrors = {};
  if (!f.name.trim()) e.name = "Please enter your name.";

  const phone = f.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (!phone) e.phone = "Please enter a phone number so we can reach you.";
  else if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15)
    e.phone = "Please enter a valid phone number, e.g. 0300-1234567.";

  const email = f.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    e.email = "Please enter a valid email address, or leave it blank.";

  if (!f.product.trim()) e.product = "Please enter the product you need.";
  if (!f.qty.trim()) e.qty = "Please enter the quantity you need.";
  return e;
}
