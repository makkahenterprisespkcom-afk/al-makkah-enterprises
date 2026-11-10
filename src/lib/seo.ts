import { BUSINESS } from "@/data/business";

/** Absolute site origin ("" when unknown — canonical/OG URLs are then simply omitted). */
export const SITE_URL: string = (typeof __SITE_URL__ === "string" ? __SITE_URL__ : "").replace(
  /\/+$/,
  "",
);

export const absoluteUrl = (path: string): string | undefined =>
  SITE_URL ? `${SITE_URL}${path}` : undefined;

export const OG_IMAGE_PATH = "/images/og-cover.jpg";
const OG_IMAGE_ALT = `${BUSINESS.name} — ${BUSINESS.tagline}`;

interface PageSeo {
  title: string;
  description: string;
  /** Route path, e.g. "/products". */
  path: string;
}

/** Title, description, canonical and social tags for one page. */
export function pageHead({ title, description, path }: PageSeo) {
  const url = absoluteUrl(path);
  const image = absoluteUrl(OG_IMAGE_PATH);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: BUSINESS.name },
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(url ? [{ property: "og:url", content: url }] : []),
      ...(image
        ? [
            { property: "og:image", content: image },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:image:alt", content: OG_IMAGE_ALT },
            { name: "twitter:image", content: image },
          ]
        : []),
    ],
    links: url ? [{ rel: "canonical", href: url }] : [],
  };
}

/** schema.org Organization — only facts supplied by the business (no address, no hours). */
export function organizationJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS.name,
    slogan: BUSINESS.tagline,
    email: BUSINESS.email,
    ...(SITE_URL ? { url: SITE_URL, logo: `${SITE_URL}/icon-512.png` } : {}),
    contactPoint: BUSINESS.contacts.map((c) => ({
      "@type": "ContactPoint",
      name: c.name,
      telephone: `+${c.wa}`,
      email: BUSINESS.email,
    })),
  };
  // `<` is escaped so the JSON can never close the surrounding <script> tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
