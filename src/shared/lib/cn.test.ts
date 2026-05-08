import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn()", () => {
  it("joins simple strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("flattens nested arrays", () => {
    expect(cn(["a", ["b", "c"], false])).toBe("a b c");
  });

  it("supports conditional object syntax", () => {
    expect(
      cn({
        a: true,
        b: false,
        c: null,
        d: 1,
      }),
    ).toBe("a d");
  });

  it("dedupes conflicting tailwind classes (later wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-base")).toBe("text-base");
  });

  it("preserves non-conflicting classes", () => {
    expect(cn("flex items-center", "gap-2", { "text-red-500": true })).toContain("flex");
    expect(cn("flex items-center", "gap-2", { "text-red-500": true })).toContain("text-red-500");
  });
});
