import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, telHref, waChatHref } from "@/data/business";
import { DEPARTMENTS, productsIn, subcategoriesOf } from "@/data/catalog";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Us — Al Makkah Enterprises | Trading & General Supplies",
      description:
        "Al Makkah Enterprises is a trading and general supplies business covering instrumentation, pressure & pneumatic equipment, bio-chemistry laboratory equipment and medical equipment.",
      path: "/about",
    }),
  component: About,
});

const STEPS = [
  {
    t: "Find your product",
    d: "Browse the catalog or search by name or specification — for example “pH meter”, “S.S. flange”, “K-Type” or “16 bar”.",
  },
  {
    t: "Send your requirement",
    d: "Use the quotation form, WhatsApp, phone or email. Tell us the specification and the quantity you need.",
  },
  {
    t: "Receive your quotation",
    d: "We reply with price and availability for your requirement. Prices are not listed online because every item is quoted individually.",
  },
];

function About() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">About Us</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
            {BUSINESS.name} — {BUSINESS.tagline}
          </h1>
          <div className="mt-5 max-w-3xl space-y-4 text-lg text-muted-foreground">
            <p>
              {BUSINESS.name} is a trading and general supplies business. We supply
              instrumentation, pressure and pneumatic equipment, bio-chemistry laboratory equipment
              and medical equipment.
            </p>
            <p>
              Every requirement is handled individually: you tell us what you need, and we come
              back with a quotation. Our team is reachable directly by phone and WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary" aria-labelledby="what-we-supply">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 id="what-we-supply" className="text-2xl font-bold md:text-3xl">
            What we supply
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {DEPARTMENTS.map((d) => (
              <div key={d.id} className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-card">
                <h3 className="text-lg font-bold">{d.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {productsIn(d.id).length} products
                </p>
                <ul className="mt-4 space-y-1.5 border-l-2 border-accent pl-3 text-sm">
                  {subcategoriesOf(d.id).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <Link
                  to="/products"
                  search={{ dept: d.id }}
                  className="mt-5 inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary hover:underline"
                >
                  View products <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only"> in {d.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card" aria-labelledby="how-to-order">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 id="how-to-order" className="text-2xl font-bold md:text-3xl">
            How to order
          </h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display font-bold text-primary-foreground"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-background" aria-labelledby="talk-to-us">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 id="talk-to-us" className="text-2xl font-bold md:text-3xl">
            Talk to us
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Looking for something that isn’t in the catalog? Send us your requirement and we will
            get back to you.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {BUSINESS.contacts.map((c) => (
              <div key={c.wa} className="rounded-lg border border-border bg-card p-6 shadow-card">
                <h3 className="text-xl font-bold">{c.name}</h3>
                <p className="mt-1 text-muted-foreground">{c.phone}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <a href={telHref(c)}>
                      <Phone aria-hidden="true" /> Call
                      <span className="sr-only"> {c.name}</span>
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
          </div>
          <p className="mt-5">
            <a
              href={`mailto:${BUSINESS.email}`}
              className="inline-flex items-center gap-2 break-all font-medium text-primary hover:underline"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {BUSINESS.email}
            </a>
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link to="/contact" hash="quote">
              Request a quote
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
