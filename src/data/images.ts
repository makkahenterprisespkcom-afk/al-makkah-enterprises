export interface CatalogImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

const img = (key: string): CatalogImage => ({
  src: `/images/cat-${key}-944.webp`,
  srcSet: `/images/cat-${key}-480.webp 480w, /images/cat-${key}-944.webp 944w`,
  width: 944,
  height: 704,
});

/** Representative category photographs (not model-specific product shots). */
export const IMAGES = {
  gauges: img("gauges"),
  valves: img("valves"),
  lab: img("lab"),
  medical: img("medical"),
} as const;
