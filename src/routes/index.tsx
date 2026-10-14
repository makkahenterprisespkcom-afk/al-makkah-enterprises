import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, MessageCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, PRIMARY_CONTACT, waChatHref } from "@/data/business";
import { DEPARTMENTS, PRODUCTS, productsIn } from "@/data/catalog";
import { IMAGES } from "@/data/images";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Al Makkah Enterprises — Instrumentation, Lab & Medical Supplies",
      description:
        "Trading & general supplies: pressure gauges, safety valves, pneumatic fittings, flanges, bio-chemistry lab instruments and medical equipment. Quotes on request.",
      path: "/",
    }),
  component: Index,
});

function Index() {
  const hero = IMAGES.gauges;
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
              {BUSINESS.tagline}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Instrumentation, laboratory & medical equipment — supplied on quotation.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              {PRODUCTS.length} product lines across three departments. Tell us the specification
              and quantity; we reply with price and availability.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/products">
                  <FileText aria-hidden="true" /> Browse products
                </Link>
              </Button>
              <Button size="lg" variant="whatsapp" asChild>
                <a href={waChatHref(PRIMARY_CONTACT)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" /> WhatsApp us
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <img
              src={hero.src}
              srcSet={hero.srcSet}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt="Pressure and temperature gauges with brass fittings"
              width={hero.width}
              height={hero.height}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-secondary" aria-labelledby="departments-heading">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 id="departments-heading" className="text-2xl font-bold md:text-3xl">
            Our departments
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {DEPARTMENTS.map((d) => (
              <Link
                key={d.id}
                to="/products"
                search={{ dept: d.id }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-card"
              >
                <img
                  src={d.image.src}
                  srcSet={d.image.srcSet}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={d.image.width}
                  height={d.image.height}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{d.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.blurb}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {productsIn(d.id).length} products <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card" aria-label="How we work">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-3">
          {[
            {
              icon: FileText,
              t: "Quotation-based",
              d: "Send your specification and quantity; receive a tailored quote.",
            },
            {
              icon: MessageCircle,
              t: "Direct on WhatsApp",
              d: `Reach ${BUSINESS.contacts.map((c) => c.name).join(" or ")} directly.`,
            },
            {
              icon: Truck,
              t: "General supplies",
              d: "Looking for something not listed? Send us your requirement.",
            },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                <I className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background" aria-labelledby="about-teaser-heading">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="about-teaser-heading" className="text-2xl font-bold md:text-3xl">
              About {BUSINESS.name}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {BUSINESS.name} is a trading and general supplies business. We supply instrumentation,
              pressure and pneumatic equipment, bio-chemistry laboratory equipment and medical
              equipment, and we quote for each requirement individually.
            </p>
            <Button className="mt-5" variant="outline" asChild>
              <Link to="/about">
                Read more about us <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="rounded-xl bg-primary p-6 text-primary-foreground shadow-card">
            <h3 className="text-xl font-bold">Need a quotation?</h3>
            <p className="mt-2 text-sm opacity-90">
              Tell us the product, specification and quantity.
            </p>
            <Button className="mt-4" variant="gold" asChild>
              <Link to="/contact" hash="quote">
                Request a quote
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
