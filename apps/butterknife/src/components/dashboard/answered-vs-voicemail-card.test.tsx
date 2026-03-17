import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { AnsweredVsVoicemailCard } from "./answered-vs-voicemail-card";

vi.mock("recharts", () => ({
  PieChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Cell: () => <span data-testid="pie-cell" />,
  Legend: () => <div>Legend</div>,
  Tooltip: () => null,
}));

describe("AnsweredVsVoicemailCard", () => {
  it("renders chart labels when calls exist", () => {
    render(<AnsweredVsVoicemailCard answeredCount={8} voicemailCount={2} />);

    expect(screen.getByText("Answered vs Voicemail")).toBeInTheDocument();
    expect(screen.getByText("Answered: 8")).toBeInTheDocument();
    expect(screen.getByText("Voicemail: 2")).toBeInTheDocument();
    expect(screen.queryByText("No calls yet")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no calls", () => {
    render(<AnsweredVsVoicemailCard answeredCount={0} voicemailCount={0} />);

    expect(screen.getByText("No calls yet")).toBeInTheDocument();
  });
});
