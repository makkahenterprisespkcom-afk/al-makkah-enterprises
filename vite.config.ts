import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

/**
 * Public site URL, used for canonical links, Open Graph URLs and the sitemap.
 * Set SITE_URL (e.g. https://www.example.com) in the Vercel project settings once the
 * final domain is known. On Vercel it falls back to the production domain automatically.
 */
function resolveSiteUrl(): string {
  const explicit = process.env["SITE_URL"] ?? process.env["VITE_SITE_URL"];
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env["VERCEL_PROJECT_PRODUCTION_URL"];
  return vercel ? `https://${vercel}` : "";
}

export default defineConfig({
  define: {
    __SITE_URL__: JSON.stringify(resolveSiteUrl()),
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    // Nitro picks the right deployment preset automatically: on Vercel it emits the
    // Build Output API bundle (SSR function + static assets) with zero extra config.
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
});
