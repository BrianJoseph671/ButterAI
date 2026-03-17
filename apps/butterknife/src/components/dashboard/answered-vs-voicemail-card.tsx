import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

import { DashboardCard } from "./dashboard-card";

interface AnsweredVsVoicemailCardProps {
  answeredCount: number;
  voicemailCount: number;
}

const ANSWERED_COLOR = "#16a34a";
const VOICEMAIL_COLOR = "#9ca3af";

function toDisplayCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}

export function AnsweredVsVoicemailCard({
  answeredCount,
  voicemailCount,
}: AnsweredVsVoicemailCardProps) {
  const safeAnsweredCount = toDisplayCount(answeredCount);
  const safeVoicemailCount = toDisplayCount(voicemailCount);
  const totalCalls = safeAnsweredCount + safeVoicemailCount;

  const chartData = [
    { name: "Answered", value: safeAnsweredCount, color: ANSWERED_COLOR },
    { name: "Voicemail", value: safeVoicemailCount, color: VOICEMAIL_COLOR },
  ];

  return (
    <DashboardCard title="Answered vs Voicemail">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {totalCalls > 0 ? (
          <PieChart width={220} height={170}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <div className="flex h-[170px] w-[220px] items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-sm font-medium text-zinc-500">
            No calls yet
          </div>
        )}

        <ul className="space-y-2 text-sm text-zinc-700">
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ANSWERED_COLOR }} />
            <span>Answered: {safeAnsweredCount}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: VOICEMAIL_COLOR }} />
            <span>Voicemail: {safeVoicemailCount}</span>
          </li>
        </ul>
      </div>
    </DashboardCard>
  );
}
