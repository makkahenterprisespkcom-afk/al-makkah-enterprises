import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { BUSINESS, telHref, waChatHref } from "@/data/business";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Al Makkah Enterprises — Phone, WhatsApp & Email",
      description:
        "Contact M. Haseeb (0317-1047427) or Hashir Sheikh (0324-3255948) by phone or WhatsApp, or email makkahenterprisespk.com@gmail.com. Request a quotation online.",
      path: "/contact",
    }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="bg-[#511326] text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8bd83]">Contact Us</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
            Talk to us about your requirement
          </h1>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {BUSINESS.contacts.map((c) => (
              <div key={c.wa} className="rounded-lg border border-white/15 bg-white p-6 text-foreground shadow-card">
                <h2 className="text-xl font-bold text-primary">{c.name}</h2>
                <p className="mt-1 text-muted-foreground">{c.phone}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <a href={telHref(c)}>
                      <Phone aria-hidden="true" /> Call
                      <span className="sr-only"> {c.name} on {c.phone}</span>
                    </a>
                  </Button>
                  <Button asChild variant="whatsapp">
                    <a href={waChatHref(c)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle aria-hidden="true" /> WhatsApp
                      <span className="sr-only"> {c.name} (opens in a new tab)</span>
                    </a>
                  </Button>
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-white/15 bg-white p-6 text-foreground md:col-span-2">
              <h2 className="text-xl font-bold text-primary">Email</h2>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="mt-2 inline-flex items-center gap-2 break-all font-medium text-primary hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {BUSINESS.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="quote" className="bg-background" aria-labelledby="quote-heading">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Quotation Form
          </p>
          <h2 id="quote-heading" className="mt-2 text-2xl font-bold md:text-3xl">
            Request a quotation
          </h2>
          <p className="mt-2 text-muted-foreground">
            Choose a product, add the specification and quantity, and send it to us on WhatsApp or
            by email.
          </p>
          <div className="mt-6 rounded-lg border border-border bg-background p-5 shadow-card sm:p-6">
            <QuoteForm showPicker />
          </div>
        </div>
      </section>
    </>
  );
}
