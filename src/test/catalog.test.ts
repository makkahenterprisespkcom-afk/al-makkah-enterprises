import { describe, expect, it } from "vitest";
import {
  DEPARTMENTS,
  PRODUCTS,
  productsIn,
  searchProducts,
  specSummary,
  subcategoriesOf,
} from "@/data/catalog";

const names = (q: string) => searchProducts(q).map((p) => p.name);

/** The complete supplied product list — a regression guard so nothing is silently dropped. */
const SUPPLIED: Record<string, string[]> = {
  instrumentation: [
    "Pressure Gauge",
    "Compound Gauge",
    "Temperature Gauge",
    "Temperature Indicator",
    "Glass Thermometer (HVSC Portable)",
    "Pressure Switch (Analog)",
    "Pressure Switch (Digital)",
    "Thermocouple Sensor",
    "Magnehelic Gauge",
    "Pressure Safety Valve",
    "Pressure Relief Valve",
    "Dead Weight Box",
    "Ball Valves",
    "Gate Valves",
    "Spring Valves",
    "Flow Meter",
    "Nitrogen Regulator",
    "Air Regulator",
    "Pneumatic Fittings",
    "Pneumatic Tubes",
    "Flanges",
    "Stainless Steel (S.S.) Flanges",
    "Mild Steel (M.S.) Flanges",
  ],
  laboratory: [
    "Glass Beaker",
    "Fiber Beaker",
    "Glass Pipette",
    "Test Tubes",
    "Thermometer",
    "Desiccator",
    "pH Meter",
    "Conductivity Meter",
    "TDS Meter",
    "Turbidity Meter",
    "Refractometer",
    "Polarimeter",
    "Analytical Balances",
    "Weight Balances",
    "Moisture Analyzer",
    "pH Solutions",
    "Conductivity Solutions",
    "Turbidity Solutions",
    "Friability Tester",
    "Hardness Tester",
    "Melting Point Apparatus",
    "UV Spectrophotometer",
    "Leak Test Apparatus",
    "Hot Air Ovens",
    "Muffle Furnace",
    "Sonicators",
    "Water Bath",
    "Hot Plates",
    "Magnetic Stirrer",
    "Heating Mantle",
  ],
  medical: [
    "ECG Machines",
    "Defibrillators",
    "AED Machines",
    "Vital Sign Monitors",
    "Cardiac Monitors",
    "BP Apparatus",
    "Pulse Oximeters",
    "Glucometers",
    "Hematology Analyzers",
    "Centrifuge Machines",
    "Hot Incubators",
    "Pharmaceutical Refrigerators",
    "Pipettes",
    "Micropipette Ejectors",
    "Water Baths",
    "UV Spectrophotometer",
    "Desiccator",
    "pH Meter",
    "Test Tubes",
  ],
};

describe("catalog content", () => {
  it("has the three supplied departments", () => {
    expect(DEPARTMENTS.map((d) => d.id)).toEqual(["instrumentation", "laboratory", "medical"]);
    expect(DEPARTMENTS.map((d) => d.name)).toEqual([
      "Instrumentation, Pressure & Pneumatic Equipment",
      "Bio-Chemistry Laboratory Equipment",
      "Medical Equipment",
    ]);
  });

  it("contains every supplied product, in order", () => {
    for (const [dept, expected] of Object.entries(SUPPLIED)) {
      expect(productsIn(dept as never).map((p) => p.name)).toEqual(expected);
    }
    expect(PRODUCTS).toHaveLength(72);
    expect(productsIn("instrumentation")).toHaveLength(23);
    expect(productsIn("laboratory")).toHaveLength(30);
    expect(productsIn("medical")).toHaveLength(19);
  });

  it("has unique ids and an image for every product", () => {
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(PRODUCTS.length);
    for (const p of PRODUCTS) {
      expect(p.image.src).toMatch(/^\/images\/.+\.webp$/);
      expect(p.subcategory.length).toBeGreaterThan(0);
    }
  });

  it("preserves the supplied specifications exactly", () => {
    const spec = (name: string) => PRODUCTS.find((p) => p.name === name)?.specs;
    expect(spec("Temperature Gauge")).toEqual([{ label: "Type", options: ["Analog"] }]);
    expect(spec("Glass Thermometer (HVSC Portable)")).toEqual([
      { label: "Range", options: ["60", "80", "120", "160", "200"] },
    ]);
    expect(spec("Pressure Switch (Analog)")).toEqual([
      { label: "Pressure range", options: ["0–10 bar", "0–16 bar", "0–20 bar"] },
    ]);
    expect(spec("Thermocouple Sensor")).toEqual([
      { label: "Sensor type", options: ["K-Type", "T-Type", "E-Type", "Pt100"] },
    ]);
    expect(spec("Pressure Safety Valve")).toEqual([
      { label: "Flanged — Class", options: ["Class 150", "Class 200"] },
      { label: "Threaded — Size", options: ['1/8"', '1/4"', '3/8"', '1"', '2"', '3"'] },
    ]);
    expect(PRODUCTS.find((p) => p.name === "Pressure Safety Valve")?.description).toBe(
      "Available in flanged and threaded connections.",
    );
    expect(spec("TDS Meter")).toEqual([{ label: "Type", options: ["Digital", "Analog"] }]);
    expect(spec("pH Solutions")).toEqual([{ label: "Buffer", options: ["pH 4", "pH 7", "pH 10"] }]);
    expect(spec("Stainless Steel (S.S.) Flanges")).toEqual([
      { label: "Material", options: ["Stainless Steel (S.S.)"] },
    ]);
    expect(spec("Mild Steel (M.S.) Flanges")).toEqual([
      { label: "Material", options: ["Mild Steel (M.S.)"] },
    ]);
    expect(spec("Pneumatic Fittings")).toEqual([{ label: "Sizes", options: ["All sizes"] }]);
    expect(spec("Flanges")).toEqual([{ label: "Sizes", options: ["All sizes"] }]);
  });

  it("never states prices, brands or stock", () => {
    const text = JSON.stringify(PRODUCTS).toLowerCase();
    expect(text).not.toMatch(/\b(rs\.?|pkr|usd|price|in stock|brand)\b/);
  });

  it("lists sub-categories per department", () => {
    expect(subcategoriesOf("medical")).toEqual([
      "Patient Monitoring and Emergency Equipment",
      "Medical and Diagnostic Equipment",
      "Medical Laboratory Equipment and Supplies",
    ]);
    expect(subcategoriesOf()).toHaveLength(13);
  });

  it("summarises specs for messages", () => {
    const p = PRODUCTS.find((x) => x.name === "Thermocouple Sensor")!;
    expect(specSummary(p)).toBe("Sensor type: K-Type, T-Type, E-Type, Pt100");
    expect(specSummary(PRODUCTS.find((x) => x.name === "Pressure Gauge")!)).toBe("");
  });
});

describe("catalog search", () => {
  it("is case-insensitive: PH meter finds pH Meter", () => expect(names("PH meter")).toContain("pH Meter"));
  it("S.S. matches stainless steel", () => expect(names("S.S. flanges")).toContain("Stainless Steel (S.S.) Flanges"));
  it("stainless steel matches", () => expect(names("stainless steel")).toContain("Stainless Steel (S.S.) Flanges"));
  it("M.S. matches mild steel", () => expect(names("M.S.")).toContain("Mild Steel (M.S.) Flanges"));
  it("K-Type finds the thermocouple only", () => expect(names("k type")).toEqual(["Thermocouple Sensor"]));
  it("Pt100 finds thermocouple", () => expect(names("PT 100")).toContain("Thermocouple Sensor"));
  it("matches spec values: 16 bar", () => expect(names("16 bar")).toContain("Pressure Switch (Analog)"));
  it("matches spec values: class 150", () => expect(names("class 150")).toContain("Pressure Safety Valve"));
  it("matches inch sizes typed with a quote mark", () => expect(names('3/8"')).toContain("Pressure Safety Valve"));
  it("digital finds TDS meter", () => expect(names("digital")).toContain("TDS Meter"));
  it("matches sub-category words", () => expect(names("heating mantle")).toEqual(["Heating Mantle"]));
  it("requires every word to match", () => expect(names("pressure banana")).toEqual([]));
  it("empty query returns everything", () => expect(searchProducts("   ")).toHaveLength(72));
  it("filters within a provided list", () => {
    const lab = PRODUCTS.filter((p) => p.department === "laboratory");
    expect(searchProducts("ph", lab).every((p) => p.department === "laboratory")).toBe(true);
  });
});
