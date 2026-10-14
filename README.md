# Al Makkah Enterprises — Trading & General Supplies

Responsive, accessible, SEO-friendly website with a searchable product catalog, quotation form,
WhatsApp inquiries and click-to-call. Built with **React 19, TypeScript, Tailwind CSS v4 and
TanStack Start** (server-rendered), ready to deploy on **Vercel**.

Pages: **Home** (`/`) · **Products** (`/products`) · **About Us** (`/about`) · **Contact Us** (`/contact`, includes the quotation form)

## Run locally

```bash
npm install
npm run dev        # opens the URL printed in the terminal
npm run test       # catalog, search, messaging, validation and routing tests
npm run typecheck  # tsc --noEmit
npm run lint
npm run build      # production build
```

Requires Node 22.12+ (see `.nvmrc`).

## Deploy to Vercel

1. Push this folder to a Git repository and import it in Vercel (framework is detected automatically;
   leave the build/output settings on their defaults). The Nitro build step selects the Vercel
   output format on its own.
2. **Set `SITE_URL`** (Project → Settings → Environment Variables), e.g. `https://www.yourdomain.com`.
   It is used for canonical links, social-share (Open Graph) URLs and `sitemap.xml`. On Vercel it falls
   back to the project's production domain, but set it explicitly once the real domain is connected.
3. Redeploy. Check `/robots.txt` and `/sitemap.xml` after the deploy.

## Where to edit things

| What | File |
| --- | --- |
| Phone numbers, WhatsApp numbers, email | `src/data/business.ts` |
| Products, categories, specifications | `src/data/catalog.ts` |
| WhatsApp / email message wording, form validation | `src/lib/quote.ts` |
| Page titles, descriptions, structured data | `src/lib/seo.ts` and each file in `src/routes/` |
| Colors and fonts | `src/styles.css` (`@theme` block) |
| Category photographs | `public/images/` |

Adding a product = adding one entry to `src/data/catalog.ts`. Counts, filters, search, the quotation
picker and the tests' expectations (update the product list in `src/test/catalog.test.ts`) follow from it.

## What the site does

- **Product search** — token-based and forgiving: `PH meter`, `S.S. flange`, `k type`, `PT 100`, `16 bar`,
  `3/8"` all work. Searches names, categories, descriptions and every specification option.
- **Filters** — department and sub-category toggles; state is kept in the URL (`/products?dept=laboratory&q=ph`)
  so filtered views are shareable.
- **Request a Quote** — opens a form pre-filled with the product; specification options are tappable chips.
- **WhatsApp inquiries** — one tap from any product card with the product, category and listed options in the
  message; the quotation form sends the full request to either contact. A search with no results offers a
  pre-written "not listed" message.
- **Click-to-call** (`tel:`) for both contacts, WhatsApp links and `mailto:` throughout.

### Important: how the quotation form delivers

The site has no server or database. "Send on WhatsApp" and "Send by Email" open WhatsApp / the visitor's
email app with the request filled in; the visitor presses send there. A "Copy request text" button covers
devices with no email app. If you later want submissions to arrive without the visitor pressing send, add a
Vercel Function that emails you (e.g. via Resend or SendGrid) — it needs an account and API key, which is why
it isn't included.

## Content policy (nothing invented)

Only supplied information is used: the business name and tagline, the three departments, the 72 products
with their specifications, two contacts and one email. There are no prices, brands, stock claims, years in
business, certifications or addresses anywhere. Add those yourself in `business.ts` / the page files only
when you have them. Product photographs are representative category images and are labelled as such on the
Products page.

## Accessibility & SEO

Skip link, landmarks, one `h1` per page, keyboard-operable mobile menu and filters (`aria-pressed`), labelled
form fields with error text and focus on the first error, visible focus rings, reduced-motion support.
Text and control colors meet WCAG AA (see the note at the top of `src/styles.css`). Per-page titles,
descriptions, canonical and Open Graph/Twitter tags, `Organization` JSON-LD (no address), `robots.txt`,
generated `sitemap.xml`, favicon set and a 1200×630 share image.
