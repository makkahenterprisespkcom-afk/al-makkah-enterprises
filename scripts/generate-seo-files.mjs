// Generates public/robots.txt and public/sitemap.xml before every build.
//
// The sitemap needs an absolute site URL. It is taken from (in order):
//   SITE_URL, VITE_SITE_URL, or Vercel's VERCEL_PROJECT_PRODUCTION_URL.
// When none is set (e.g. a local build) robots.txt is still written, and no sitemap is emitted
// rather than publishing a wrong domain.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
mkdirSync(publicDir, { recursive: true });

const env = process.env;
const explicit = env.SITE_URL || env.VITE_SITE_URL;
const siteUrl = (
  explicit || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
).replace(/\/+$/, "");

const paths = ["/", "/products", "/about", "/contact"];

let robots = "User-agent: *\nAllow: /\n";
if (siteUrl) {
  robots += `\nSitemap: ${siteUrl}/sitemap.xml\n`;
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map((p) => `  <url>\n    <loc>${siteUrl}${p === "/" ? "/" : p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
    .join("\n");
  writeFileSync(
    join(publicDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log(`[seo] sitemap.xml written for ${siteUrl}`);
} else {
  rmSync(join(publicDir, "sitemap.xml"), { force: true });
  console.log("[seo] SITE_URL not set — skipping sitemap.xml (robots.txt still written)");
}
writeFileSync(join(publicDir, "robots.txt"), robots);
