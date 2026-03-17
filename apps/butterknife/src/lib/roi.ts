export interface RoiEstimateInput {
  qualifiedLeads: number | null | undefined;
  averageJobValue: number | null | undefined;
  monthlyCost: number | null | undefined;
}

export interface RoiEstimate {
  estimatedRevenue: number;
  roiPercentage: number | null;
}

function toSafeNonNegativeNumber(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

export function parseStoredNumber(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return toSafeNonNegativeNumber(parsed);
}

export function calculateRoiEstimate({
  qualifiedLeads,
  averageJobValue,
  monthlyCost,
}: RoiEstimateInput): RoiEstimate {
  const safeQualifiedLeads = Math.round(toSafeNonNegativeNumber(qualifiedLeads));
  const safeAverageJobValue = toSafeNonNegativeNumber(averageJobValue);
  const safeMonthlyCost = toSafeNonNegativeNumber(monthlyCost);

  const estimatedRevenue = Math.round(safeAverageJobValue * safeQualifiedLeads);

  if (safeMonthlyCost === 0) {
    return {
      estimatedRevenue,
      roiPercentage: null,
    };
  }

  const roiPercentage = ((estimatedRevenue - safeMonthlyCost) / safeMonthlyCost) * 100;

  if (!Number.isFinite(roiPercentage)) {
    return {
      estimatedRevenue,
      roiPercentage: null,
    };
  }

  return {
    estimatedRevenue,
    roiPercentage,
  };
}
