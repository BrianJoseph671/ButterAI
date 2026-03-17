import { DashboardCard } from "./dashboard-card";

interface QualifiedLeadsCardProps {
  qualifiedLeads: number;
}

function toDisplayCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}

export function QualifiedLeadsCard({ qualifiedLeads }: QualifiedLeadsCardProps) {
  return (
    <DashboardCard title="Qualified Leads">
      <p className="text-4xl font-semibold text-[#1a1a1a]">{toDisplayCount(qualifiedLeads)}</p>
      <p className="mt-2 text-sm text-zinc-600">Answered calls with both name and request filled.</p>
    </DashboardCard>
  );
}
