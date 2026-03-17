import { formatDuration } from "@/lib/format";

import { DashboardCard } from "./dashboard-card";

interface AverageCallDurationCardProps {
  averageDuration: number;
}

export function AverageCallDurationCard({ averageDuration }: AverageCallDurationCardProps) {
  return (
    <DashboardCard title="Average Call Duration">
      <p className="text-4xl font-semibold text-[#1a1a1a]">
        {formatDuration(averageDuration)} <span className="text-2xl text-zinc-700">min</span>
      </p>
      <p className="mt-2 text-sm text-zinc-600">Displayed as minutes:seconds.</p>
    </DashboardCard>
  );
}
