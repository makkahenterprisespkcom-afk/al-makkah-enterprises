import { Link } from "@tanstack/react-router";
import { Gauge, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BUSINESS, telHref, waChatHref } from "@/data/business";
import { DEPARTMENTS } from "@/data/catalog";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

const navLinkClass =
  "rounded-md px-3 py-2 text-foreground/80 hover:bg-secondary hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-primary";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          className={navLinkClass}
          activeOptions={{ exact: n.to === "/", includeSearch: false }}
          {...(onNavigate ? { onClick: onNavigate } : {})}
        >
          {n.label}
        </Link>
      ))}
    </>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-md hover:bg-secondary"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-border bg-background shadow-card"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-base font-medium">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
          <div className="mx-auto max-w-7xl border-t border-border px-4 py-3">
            <ul className="space-y-2 text-sm">
              {BUSINESS.contacts.map((c) => (
                <li key={c.wa} className="flex flex-wrap items-center gap-2">
                  <span className="w-full font-semibold">{c.name}</span>
                  <a
                    href={telHref(c)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-input bg-card px-3"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" /> {c.phone}
                  </a>
                  <a
                    href={waChatHref(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-whatsapp px-3 text-whatsapp-foreground"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                    <span className="sr-only"> {c.name} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="hidden bg-primary text-primary-foreground sm:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-x-6 gap-y-1 px-4 py-1.5 text-xs">
          {BUSINESS.contacts.map((c) => (
            <a
              key={c.wa}
              href={telHref(c)}
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <Phone className="h-3 w-3" aria-hidden="true" /> {c.name}: {c.phone}
            </a>
          ))}
          <a
            href={`mailto:${BUSINESS.email}`}
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <Mail className="h-3 w-3" aria-hidden="true" /> {BUSINESS.email}
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Gauge className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold">{BUSINESS.name}</span>
            <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
              {BUSINESS.tagline}
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm font-medium md:flex">
          <NavLinks />
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-dark bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">{BUSINESS.name}</p>
          <p className="mt-1 text-sm opacity-75">{BUSINESS.tagline}</p>
          <p className="mt-4 text-sm opacity-75">
            Instrumentation, laboratory and medical equipment supplied on quotation.
          </p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-accent">
            Contacts
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {BUSINESS.contacts.map((c) => (
              <li key={c.wa} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a href={telHref(c)} className="inline-flex items-center gap-1.5 hover:underline">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {c.name}: {c.phone}
                </a>
                <a
                  href={waChatHref(c)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  <span className="sr-only"> {c.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="inline-flex items-center gap-1.5 break-all hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {BUSINESS.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-accent">
            Departments
          </h2>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            {DEPARTMENTS.map((d) => (
              <li key={d.id}>
                <Link to="/products" search={{ dept: d.id }} className="hover:underline">
                  {d.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-footer-foreground/15 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} {BUSINESS.name}
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
