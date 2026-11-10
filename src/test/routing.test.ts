import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without rendering: no DOM or network needed.
describe("App routing", () => {
  const router = createRouter({ routeTree });

  it.each(["/", "/products", "/about", "/contact"])("matches a page for %s", (path) => {
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("falls back to the root (not-found) for unknown paths", () => {
    expect(router.matchRoutes("/nope").at(-1)?.routeId).toBe(rootRouteId);
  });
});
