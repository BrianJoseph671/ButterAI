import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className }: DashboardCardProps) {
  return (
    <section
      aria-label={title}
      className={cn("rounded-lg border border-zinc-200 bg-white p-5 shadow-sm", className)}
    >
      <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-600">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
