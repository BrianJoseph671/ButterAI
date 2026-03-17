import { DashboardCard } from "./dashboard-card";

interface TotalCallsCardProps {
  totalCalls: number;
  thisWeekCalls: number;
  todayCalls: number;
}

function toDisplayCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}

export function TotalCallsCard({ totalCalls, thisWeekCalls, todayCalls }: TotalCallsCardProps) {
  return (
    <DashboardCard title="Total Calls">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">All Time</p>
          <p className="mt-1 text-4xl font-semibold text-[#1a1a1a]">{toDisplayCount(totalCalls)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-zinc-100 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">This Week</p>
            <p className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{toDisplayCount(thisWeekCalls)}</p>
          </div>

          <div className="rounded-md bg-zinc-100 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Today</p>
            <p className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{toDisplayCount(todayCalls)}</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
