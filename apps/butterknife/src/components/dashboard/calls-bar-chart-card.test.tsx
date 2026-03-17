import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CallsBarChartCard } from "./calls-bar-chart-card";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Bar: () => <div data-testid="bar-series" />,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
}));

describe("CallsBarChartCard", () => {
  it("renders the 14-day card heading", () => {
    render(
      <CallsBarChartCard
        data={[
          { date: "2026-03-15", label: "Mar 15", count: 2 },
          { date: "2026-03-16", label: "Mar 16", count: 4 },
        ]}
      />,
    );

    expect(screen.getByText("Calls in the Last 14 Days")).toBeInTheDocument();
    expect(screen.getByLabelText("14 day call counts").children).toHaveLength(2);
  });

  it("renders a placeholder label when all days are zero", () => {
    render(
      <CallsBarChartCard
        data={Array.from({ length: 14 }, (_, index) => ({
          date: `2026-03-${String(index + 1).padStart(2, "0")}`,
          label: `Mar ${index + 1}`,
          count: 0,
        }))}
      />,
    );

    expect(screen.getByText("No recent calls")).toBeInTheDocument();
  });
});
