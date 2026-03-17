"use client";

import { useEffect, useState } from "react";

import { formatCurrency } from "@/lib/format";
import { calculateRoiEstimate } from "@/lib/roi";
import { SETTINGS_UPDATED_EVENT, readSettings } from "@/lib/settings";

import { DashboardCard } from "./dashboard-card";

interface RoiEstimateCardProps {
  qualifiedLeads: number;
}

function formatRoiPercentage(roiPercentage: number | null): string {
  if (roiPercentage === null || !Number.isFinite(roiPercentage)) {
    return "N/A";
  }

  return `${Math.round(roiPercentage)}%`;
}

export function RoiEstimateCard({ qualifiedLeads }: RoiEstimateCardProps) {
  const [averageJobValue, setAverageJobValue] = useState(0);
  const [monthlyCost, setMonthlyCost] = useState(0);

  useEffect(() => {
    const readStoredSettings = () => {
      const settings = readSettings(window.localStorage);
      setAverageJobValue(settings.averageJobValue);
      setMonthlyCost(settings.monthlyCost);
    };

    readStoredSettings();
    window.addEventListener("storage", readStoredSettings);
    window.addEventListener(SETTINGS_UPDATED_EVENT, readStoredSettings);

    return () => {
      window.removeEventListener("storage", readStoredSettings);
      window.removeEventListener(SETTINGS_UPDATED_EVENT, readStoredSettings);
    };
  }, []);

  const { estimatedRevenue, roiPercentage } = calculateRoiEstimate({
    qualifiedLeads,
    averageJobValue,
    monthlyCost,
  });

  return (
    <DashboardCard title="ROI Estimate" className="md:col-span-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Estimated Revenue from Captured Leads
      </p>
      <p className="mt-1 text-4xl font-semibold text-[#1a1a1a]">{formatCurrency(estimatedRevenue)}</p>

      <div className="mt-4 space-y-1 text-sm text-zinc-700">
        <p>Butter AI Cost: {formatCurrency(monthlyCost)}/mo</p>
        <p>Estimated ROI: {formatRoiPercentage(roiPercentage)}</p>
      </div>
    </DashboardCard>
  );
}
