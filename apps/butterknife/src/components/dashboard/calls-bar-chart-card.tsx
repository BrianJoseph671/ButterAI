"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { CallsBarDatum } from "@/lib/dashboard";

import { DashboardCard } from "./dashboard-card";

interface CallsBarChartCardProps {
  data: CallsBarDatum[];
}

export function CallsBarChartCard({ data }: CallsBarChartCardProps) {
  const hasAnyCalls = data.some((entry) => entry.count > 0);

  return (
    <DashboardCard title="Calls in the Last 14 Days" className="md:col-span-2">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 12, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              interval={1}
              angle={-25}
              textAnchor="end"
              height={50}
              label={{ value: "Date", position: "insideBottom", offset: -8 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              label={{ value: "Calls", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#F5D76E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!hasAnyCalls ? (
        <p className="mt-2 text-sm font-medium text-zinc-500">No recent calls</p>
      ) : null}

      <ul aria-label="14 day call counts" className="sr-only">
        {data.map((entry) => (
          <li key={entry.date}>
            {entry.label}: {entry.count}
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
