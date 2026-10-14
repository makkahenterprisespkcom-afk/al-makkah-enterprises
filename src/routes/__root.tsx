import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/data/business";
import { organizationJsonLd } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-ink">Error 404</p>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you’re looking for doesn’t exist or has moved. You can browse our products or
          contact us directly.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/">Go to home page</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">This page didn’t load</h1>
        <p className="mt-3 text-muted-foreground">
          Something went wrong on our side. Try again, or head back to the home page.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/">Go to home page</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#556B2F" },
      // Fallbacks for pages that don't define their own (e.g. 404).
      { title: `${BUSINESS.name} — ${BUSINESS.tagline}` },
      {
        name: "description",
        content:
          "Trading & general supplies: instrumentation, laboratory and medical equipment on quotation.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd() }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}
