import { describe, expect, it } from "vitest";
import { BUSINESS, PRIMARY_CONTACT, telHref, waChatHref, waLink } from "@/data/business";
import { PRODUCTS } from "@/data/catalog";
import {
  EMPTY_QUOTE,
  inquiryMessage,
  mailtoHref,
  notListedMessage,
  quoteMessage,
  specText,
  validateQuote,
  whatsappMessage,
} from "@/lib/quote";

const valid = { ...EMPTY_QUOTE, name: "Ali", phone: "0300-1234567", product: "Pressure Gauge", qty: "5" };

describe("contact details", () => {
  it("uses exactly the supplied numbers, email and WhatsApp links", () => {
    expect(BUSINESS.contacts.map((c) => [c.name, c.phone, waChatHref(c)])).toEqual([
      ["M. Haseeb", "0317-1047427", "https://wa.me/923171047427"],
      ["M. Hashir", "0324-3255948", "https://wa.me/923243255948"],
    ]);
    expect(BUSINESS.email).toBe("makkahenterprisespk.com@gmail.com");
    expect(PRIMARY_CONTACT.name).toBe("M. Haseeb");
  });

  it("builds click-to-call links in international format", () => {
    expect(BUSINESS.contacts.map(telHref)).toEqual(["tel:+923171047427", "tel:+923243255948"]);
  });
});

describe("WhatsApp & email messages", () => {
  it("whatsappMessage includes product, spec and quantity", () => {
    expect(whatsappMessage("Pressure Gauge", "0-10 bar", "5")).toBe(
      "Hello Al Makkah Enterprises, I would like to request a quotation for Pressure Gauge. Required specifications: 0-10 bar. Quantity: 5. Please share the price and availability.",
    );
  });

  it("falls back to 'To be discussed' when spec or quantity are missing", () => {
    expect(whatsappMessage("Flow Meter")).toContain("Required specifications: To be discussed. Quantity: To be discussed.");
  });

  it("combines tapped options with typed specs", () => {
    expect(specText({ "Flanged — Class": "Class 150", "Threaded — Size": "" }, " ASME ")).toBe(
      "Flanged — Class: Class 150, ASME",
    );
  });

  it("quoteMessage appends the sender details and skips blank optional fields", () => {
    const m = quoteMessage({ ...valid, spec: "0-10 bar" });
    expect(m).toContain("quotation for Pressure Gauge. Required specifications: 0-10 bar. Quantity: 5.");
    expect(m).toContain("Name: Ali");
    expect(m).toContain("Phone: 0300-1234567");
    expect(m).not.toContain("Company:");
    expect(m).not.toContain("Email:");
    const full = quoteMessage({ ...valid, company: "Acme", email: "a@b.co", extra: "Urgent" });
    expect(full).toContain("Company: Acme");
    expect(full).toContain("Email: a@b.co");
    expect(full).toContain("Additional requirements: Urgent");
  });

  it("inquiryMessage carries product, category and listed options", () => {
    const p = PRODUCTS.find((x) => x.name === "Pressure Switch (Analog)")!;
    const m = inquiryMessage(p);
    expect(m).toContain("request a quotation for Pressure Switch (Analog).");
    expect(m).toContain("Category: Pressure and Temperature Instruments");
    expect(m).toContain("Listed options: Pressure range: 0–10 bar, 0–16 bar, 0–20 bar");
    expect(inquiryMessage(PRODUCTS.find((x) => x.name === "Pressure Gauge")!)).not.toContain("Listed options");
  });

  it("notListedMessage quotes the search term", () => {
    expect(notListedMessage("  autoclave ")).toContain('searched for "autoclave"');
  });

  it("URL-encodes WhatsApp and mailto links", () => {
    const url = waLink("923171047427", "Hi & bye\nline 2");
    expect(url).toBe("https://wa.me/923171047427?text=Hi%20%26%20bye%0Aline%202");
    const mail = mailtoHref("Quotation request: pH Meter", "a b");
    expect(mail).toBe("mailto:makkahenterprisespk.com@gmail.com?subject=Quotation%20request%3A%20pH%20Meter&body=a%20b");
  });
});

describe("validateQuote", () => {
  it("accepts a valid request", () => expect(validateQuote(valid)).toEqual({}));

  it("requires name, phone, product and quantity", () => {
    expect(Object.keys(validateQuote(EMPTY_QUOTE)).sort()).toEqual(["name", "phone", "product", "qty"]);
  });

  it("validates phone numbers", () => {
    for (const ok of ["0317-1047427", "+92 317 1047427", "03171047427", "(042) 111-2222"]) {
      expect(validateQuote({ ...valid, phone: ok }).phone, ok).toBeUndefined();
    }
    for (const bad of ["abc", "12345", "0317-ABC-1234", "++923171047427", "1".repeat(20)]) {
      expect(validateQuote({ ...valid, phone: bad }).phone, bad).toBeDefined();
    }
  });

  it("email is optional but must be valid when given", () => {
    expect(validateQuote({ ...valid, email: "" }).email).toBeUndefined();
    expect(validateQuote({ ...valid, email: "me@example.com" }).email).toBeUndefined();
    expect(validateQuote({ ...valid, email: "not-an-email" }).email).toBeDefined();
  });

  it("treats whitespace-only values as empty", () => {
    const e = validateQuote({ ...valid, name: "   ", qty: "  " });
    expect(e.name).toBeDefined();
    expect(e.qty).toBeDefined();
  });
});
