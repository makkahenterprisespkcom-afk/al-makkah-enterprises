import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { QuoteDialog, type QuoteTarget } from "@/components/QuoteDialog";
import { Button } from "@/components/ui/button";
import { PRIMARY_CONTACT, waLink } from "@/data/business";
import {
  DEPARTMENTS,
  PRODUCTS,
  searchProducts,
  subcategoriesOf,
  type DepartmentId,
  type Product,
} from "@/data/catalog";
import { notListedMessage } from "@/lib/quote";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

type S = { dept?: DepartmentId | undefined; sub?: string | undefined; q?: string | undefined };

const isDept = (v: unknown): v is DepartmentId => DEPARTMENTS.some((d) => d.id === v);

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): S => ({
    dept: isDept(s["dept"]) ? s["dept"] : undefined,
    sub: typeof s["sub"] === "string" ? s["sub"] : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
  }),
  head: () =>
    pageHead({
      title: "Products — Instrumentation, Lab & Medical Equipment | Al Makkah Enterprises",
      description:
        "Browse pressure gauges, safety valves, pneumatic fittings, flanges, laboratory instruments and medical equipment. Request a quote online or on WhatsApp.",
      path: "/products",
    }),
  component: ProductsPage,
});

const chip = (active: boolean) =>
  cn(
    "min-h-9 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card hover:bg-secondary",
  );

function ProductsPage() {
  const { dept, sub, q = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [quote, setQuote] = useState<QuoteTarget | null>(null);

  // The visitor's typing drives results immediately; the URL (?q=) follows shortly after so
  // filtered views stay shareable without re-rendering the page on every keystroke.
  const [text, setText] = useState(q);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const term = text.trim();
  const subs = useMemo(() => subcategoriesOf(dept), [dept]);
  const activeSub = sub && subs.includes(sub) ? sub : undefined;

  const results = useMemo(() => {
    const list = PRODUCTS.filter(
      (p) => (!dept || p.department === dept) && (!activeSub || p.subcategory === activeSub),
    );
    return searchProducts(text, list);
  }, [dept, activeSub, text]);

  const grouped = DEPARTMENTS.map((d) => ({
    d,
    items: results.filter((p) => p.department === d.id),
  })).filter((g) => g.items.length);

  const onSearch = (value: string) => {
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      navigate({
        search: (s: S) => ({ ...s, q: value.trim() ? value : undefined }),
        replace: true,
        resetScroll: false,
      });
    }, 250);
  };

  const clearSearch = () => {
    clearTimeout(timer.current);
    setText("");
    navigate({ search: (s: S) => ({ ...s, q: undefined }), replace: true, resetScroll: false });
  };

  const setDept = (d: DepartmentId | undefined) =>
    navigate({
      search: () => ({ dept: d, q: term ? text : undefined }),
      resetScroll: false,
    });

  const setSub = (s: string) =>
    navigate({
      search: (p: S) => ({ ...p, sub: activeSub === s ? undefined : s }),
      resetScroll: false,
    });

  const openQuote = (p: Product) => setQuote({ key: p.id, product: p });

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Product Catalog
          </p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Find the equipment you need</h1>

          <form role="search" className="relative mt-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="product-search" className="sr-only">
              Search products by name or specification
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="product-search"
              type="search"
              name="q"
              value={text}
              onChange={(e) => onSearch(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Search by name or specification — e.g. PH meter, S.S. flange, K-Type, 16 bar"
              className="h-12 w-full appearance-none rounded-md border border-input bg-card pl-10 pr-12 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:appearance-none"
            />
            {text && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </form>

          <div role="group" aria-label="Filter by department" className="mt-5 flex flex-wrap gap-2">
            <button type="button" aria-pressed={!dept} onClick={() => setDept(undefined)} className={chip(!dept)}>
              All departments
            </button>
            {DEPARTMENTS.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={dept === d.id}
                onClick={() => setDept(d.id)}
                className={chip(dept === d.id)}
              >
                {d.name}
              </button>
            ))}
          </div>

          <div role="group" aria-label="Filter by sub-category" className="mt-3 flex flex-wrap gap-2">
            {subs.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={activeSub === s}
                onClick={() => setSub(s)}
                className={cn(
                  "min-h-8 cursor-pointer rounded-md px-2.5 py-1 text-xs transition-colors",
                  activeSub === s
                    ? "bg-accent font-semibold text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent/40",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p role="status" className="text-sm text-muted-foreground">
            {results.length} product{results.length === 1 ? "" : "s"} found
          </p>

          {!results.length && (
            <div className="mt-8 rounded-lg border border-dashed border-input p-8 text-center sm:p-10">
              <p className="font-medium">
                {term ? <>No products match “{term}”.</> : "No matching products."}
              </p>
              <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
                Try another term or clear the filters. If you need something that isn’t listed, send
                us your requirement and we will get back to you.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {term && (
                  <Button onClick={() => setQuote({ key: `custom-${term}`, productName: term })}>
                    Request “{term}”
                  </Button>
                )}
                <Button variant="whatsapp" asChild>
                  <a
                    href={waLink(PRIMARY_CONTACT.wa, notListedMessage(term || "a product"))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden="true" /> Ask on WhatsApp
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Button>
                {(term || dept || activeSub) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearTimeout(timer.current);
                      setText("");
                      navigate({ search: () => ({}), resetScroll: false });
                    }}
                  >
                    Clear search and filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {grouped.map(({ d, items }) => (
            <div key={d.id} className="mt-8 first:mt-4">
              <h2 className="border-l-4 border-accent pl-3 text-xl font-bold md:text-2xl">{d.name}</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} onQuote={openQuote} />
                ))}
              </div>
            </div>
          ))}

          {results.length > 0 && (
            <p className="mt-10 text-xs text-muted-foreground">
              Photographs show product categories and are representative only — they do not depict a
              specific model, brand or specification. Prices are not listed; every item is supplied
              on quotation.
            </p>
          )}
        </div>
      </section>

      <QuoteDialog target={quote} onOpenChange={(o) => !o && setQuote(null)} />
    </>
  );
}
