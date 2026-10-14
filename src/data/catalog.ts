import { IMAGES, type CatalogImage } from "./images";

export type DepartmentId = "instrumentation" | "laboratory" | "medical";

export interface SpecGroup {
  label: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  department: DepartmentId;
  subcategory: string;
  description?: string;
  specs?: SpecGroup[];
  image: CatalogImage;
}

export interface Department {
  id: DepartmentId;
  name: string;
  short: string;
  image: CatalogImage;
  blurb: string;
}

export const DEPARTMENTS: Department[] = [
  {
    id: "instrumentation",
    name: "Instrumentation, Pressure & Pneumatic Equipment",
    short: "Instrumentation",
    image: IMAGES.valves,
    blurb: "Gauges, safety valves, regulators, pneumatic fittings and flanges.",
  },
  {
    id: "laboratory",
    name: "Bio-Chemistry Laboratory Equipment",
    short: "Laboratory",
    image: IMAGES.lab,
    blurb: "Glassware, meters, calibration solutions and lab processing equipment.",
  },
  {
    id: "medical",
    name: "Medical Equipment",
    short: "Medical",
    image: IMAGES.medical,
    blurb: "Patient monitoring, diagnostic and medical laboratory equipment.",
  },
];

type Item = string | { name: string; specs?: SpecGroup[]; description?: string };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const sub = (
  department: DepartmentId,
  subcategory: string,
  image: CatalogImage,
  items: Item[],
): Product[] =>
  items.map((it) => {
    const p = typeof it === "string" ? { name: it } : it;
    return { id: `${department}-${slug(p.name)}`, department, subcategory, image, ...p };
  });

/**
 * The complete supplied product list, in the supplied order and wording.
 * Only specifications that were supplied are listed — nothing else (brands, models, prices,
 * stock levels) is stated anywhere on the site.
 */
export const PRODUCTS: Product[] = [
  // ── Instrumentation, Pressure & Pneumatic Equipment ──────────────────────────────────────
  ...sub("instrumentation", "Pressure and Temperature Instruments", IMAGES.gauges, [
    "Pressure Gauge",
    "Compound Gauge",
    { name: "Temperature Gauge", specs: [{ label: "Type", options: ["Analog"] }] },
    "Temperature Indicator",
    {
      name: "Glass Thermometer (HVSC Portable)",
      specs: [{ label: "Range", options: ["60", "80", "120", "160", "200"] }],
    },
    {
      name: "Pressure Switch (Analog)",
      specs: [{ label: "Pressure range", options: ["0–10 bar", "0–16 bar", "0–20 bar"] }],
    },
    { name: "Pressure Switch (Digital)", specs: [{ label: "Type", options: ["Digital"] }] },
    {
      name: "Thermocouple Sensor",
      specs: [{ label: "Sensor type", options: ["K-Type", "T-Type", "E-Type", "Pt100"] }],
    },
    "Magnehelic Gauge",
  ]),
  ...sub("instrumentation", "Pressure Safety and Relief Equipment", IMAGES.valves, [
    {
      name: "Pressure Safety Valve",
      description: "Available in flanged and threaded connections.",
      specs: [
        { label: "Flanged — Class", options: ["Class 150", "Class 200"] },
        { label: "Threaded — Size", options: ['1/8"', '1/4"', '3/8"', '1"', '2"', '3"'] },
      ],
    },
    "Pressure Relief Valve",
    "Dead Weight Box",
  ]),
  ...sub("instrumentation", "Valves and Flow Equipment", IMAGES.valves, [
    "Ball Valves",
    "Gate Valves",
    "Spring Valves",
    "Flow Meter",
  ]),
  ...sub("instrumentation", "Regulators and Pneumatic Equipment", IMAGES.valves, [
    "Nitrogen Regulator",
    "Air Regulator",
    { name: "Pneumatic Fittings", specs: [{ label: "Sizes", options: ["All sizes"] }] },
    "Pneumatic Tubes",
  ]),
  ...sub("instrumentation", "Flanges and Materials", IMAGES.valves, [
    { name: "Flanges", specs: [{ label: "Sizes", options: ["All sizes"] }] },
    {
      name: "Stainless Steel (S.S.) Flanges",
      specs: [{ label: "Material", options: ["Stainless Steel (S.S.)"] }],
    },
    {
      name: "Mild Steel (M.S.) Flanges",
      specs: [{ label: "Material", options: ["Mild Steel (M.S.)"] }],
    },
  ]),

  // ── Bio-Chemistry Laboratory Equipment ───────────────────────────────────────────────────
  ...sub("laboratory", "Laboratory Glassware and Basic Equipment", IMAGES.lab, [
    "Glass Beaker",
    "Fiber Beaker",
    "Glass Pipette",
    "Test Tubes",
    "Thermometer",
    "Desiccator",
  ]),
  ...sub("laboratory", "Water Quality and Measurement Instruments", IMAGES.lab, [
    "pH Meter",
    "Conductivity Meter",
    { name: "TDS Meter", specs: [{ label: "Type", options: ["Digital", "Analog"] }] },
    "Turbidity Meter",
    "Refractometer",
    "Polarimeter",
    "Analytical Balances",
    "Weight Balances",
    "Moisture Analyzer",
  ]),
  ...sub("laboratory", "Calibration and Laboratory Solutions", IMAGES.lab, [
    { name: "pH Solutions", specs: [{ label: "Buffer", options: ["pH 4", "pH 7", "pH 10"] }] },
    "Conductivity Solutions",
    "Turbidity Solutions",
  ]),
  ...sub("laboratory", "Pharmaceutical and Laboratory Testing Equipment", IMAGES.lab, [
    "Friability Tester",
    "Hardness Tester",
    "Melting Point Apparatus",
    "UV Spectrophotometer",
    "Leak Test Apparatus",
  ]),
  ...sub("laboratory", "Heating, Mixing and Laboratory Processing Equipment", IMAGES.lab, [
    "Hot Air Ovens",
    "Muffle Furnace",
    "Sonicators",
    "Water Bath",
    "Hot Plates",
    "Magnetic Stirrer",
    "Heating Mantle",
  ]),

  // ── Medical Equipment ────────────────────────────────────────────────────────────────────
  ...sub("medical", "Patient Monitoring and Emergency Equipment", IMAGES.medical, [
    "ECG Machines",
    "Defibrillators",
    "AED Machines",
    "Vital Sign Monitors",
    "Cardiac Monitors",
    "BP Apparatus",
    "Pulse Oximeters",
  ]),
  ...sub("medical", "Medical and Diagnostic Equipment", IMAGES.medical, [
    "Glucometers",
    "Hematology Analyzers",
    "Centrifuge Machines",
    "Hot Incubators",
    "Pharmaceutical Refrigerators",
  ]),
  ...sub("medical", "Medical Laboratory Equipment and Supplies", IMAGES.medical, [
    "Pipettes",
    "Micropipette Ejectors",
    "Water Baths",
    "UV Spectrophotometer",
    "Desiccator",
    "pH Meter",
    "Test Tubes",
  ]),
];

export const departmentById = (id: DepartmentId): Department => {
  const d = DEPARTMENTS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown department: ${id}`);
  return d;
};

export const departmentName = (id: DepartmentId) => departmentById(id).name;

export const productsIn = (id: DepartmentId) => PRODUCTS.filter((p) => p.department === id);

/** Distinct sub-categories, optionally limited to one department, in catalog order. */
export const subcategoriesOf = (dept?: DepartmentId) => [
  ...new Set(PRODUCTS.filter((p) => !dept || p.department === dept).map((p) => p.subcategory)),
];

export const specSummary = (p: Product): string =>
  p.specs?.map((g) => `${g.label}: ${g.options.join(", ")}`).join("; ") ?? "";

// ── Search ──────────────────────────────────────────────────────────────────────────────────
// Forgiving, token-based search over name, category, department, description and every spec
// label/option. Common shorthand is normalised on both sides (S.S. ⇄ stainless steel,
// M.S. ⇄ mild steel, PT 100 ⇄ Pt100, K type ⇄ K-Type, 1" ⇄ 1 inch, en/em dashes ⇄ hyphen).
const ALIASES: [RegExp, string][] = [
  [/\bs\.?\s?s\.?(?=\s|$)/g, "stainless steel"],
  [/\bm\.?\s?s\.?(?=\s|$)/g, "mild steel"],
  [/\banalogue\b/g, "analog"],
  [/\bpt\s?-?100\b/g, "pt100"],
  [/\b([kte])\s?-?\s?type\b/g, "$1type"],
  [/[–—]/g, "-"],
  [/"/g, " inch"],
  [/\binches\b/g, "inch"],
];

export function normalize(s: string): string {
  let t = ` ${s.toLowerCase()} `;
  for (const [re, rep] of ALIASES) t = t.replace(re, rep);
  return t.replace(/[(),]/g, " ").replace(/\s+/g, " ").trim();
}

export function haystack(p: Product): string {
  const parts = [p.name, p.subcategory, departmentName(p.department), p.description ?? ""];
  p.specs?.forEach((g) => parts.push(g.label, ...g.options));
  return normalize(parts.join(" "));
}

// Pre-computed once per product — the catalog is static.
const HAYSTACKS = new Map<string, string>(PRODUCTS.map((p) => [p.id, haystack(p)]));

export function searchProducts(query: string, list: Product[] = PRODUCTS): Product[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return list;
  return list.filter((p) => {
    const h = HAYSTACKS.get(p.id) ?? haystack(p);
    return tokens.every((t) => h.includes(t));
  });
}
