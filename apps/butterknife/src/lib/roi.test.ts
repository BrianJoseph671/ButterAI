import { describe, expect, it } from "vitest";

import { calculateRoiEstimate, parseStoredNumber } from "./roi";

describe("parseStoredNumber", () => {
  it("parses valid numeric localStorage values", () => {
    expect(parseStoredNumber("2500")).toBe(2500);
    expect(parseStoredNumber(" 300 ")).toBe(300);
  });

  it("returns 0 for missing or invalid values", () => {
    expect(parseStoredNumber(null)).toBe(0);
    expect(parseStoredNumber("abc")).toBe(0);
    expect(parseStoredNumber("-100")).toBe(0);
  });
});

describe("calculateRoiEstimate", () => {
  it("calculates revenue and ROI percentage", () => {
    const result = calculateRoiEstimate({
      qualifiedLeads: 4,
      averageJobValue: 1000,
      monthlyCost: 300,
    });

    expect(result.estimatedRevenue).toBe(4000);
    expect(result.roiPercentage).toBeCloseTo(1233.33, 2);
  });

  it("handles zero job value and zero cost safely", () => {
    const zeroJobValue = calculateRoiEstimate({
      qualifiedLeads: 5,
      averageJobValue: 0,
      monthlyCost: 300,
    });

    expect(zeroJobValue.estimatedRevenue).toBe(0);
    expect(zeroJobValue.roiPercentage).toBe(-100);

    const zeroCost = calculateRoiEstimate({
      qualifiedLeads: 5,
      averageJobValue: 1500,
      monthlyCost: 0,
    });

    expect(zeroCost.estimatedRevenue).toBe(7500);
    expect(zeroCost.roiPercentage).toBeNull();
  });
});
