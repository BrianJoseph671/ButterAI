import { describe, expect, it } from "vitest";

import { formatCurrency, formatDuration } from "./format";

describe("formatDuration", () => {
  it("formats whole seconds as mm:ss", () => {
    expect(formatDuration(125)).toBe("2:05");
  });

  it("formats longer durations as mm:ss", () => {
    expect(formatDuration(128)).toBe("2:08");
  });

  it("returns 0:00 for invalid values", () => {
    expect(formatDuration(null)).toBe("0:00");
    expect(formatDuration(undefined)).toBe("0:00");
    expect(formatDuration(Number.NaN)).toBe("0:00");
    expect(formatDuration(-5)).toBe("0:00");
  });
});

describe("formatCurrency", () => {
  it("formats whole dollars", () => {
    expect(formatCurrency(1200)).toBe("$1,200");
  });

  it("returns $0 for invalid values", () => {
    expect(formatCurrency(Number.NaN)).toBe("$0");
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe("$0");
  });
});
