import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TotalCallsCard } from "./total-calls-card";

describe("TotalCallsCard", () => {
  it("renders all-time, this-week, and today counts", () => {
    render(<TotalCallsCard totalCalls={42} thisWeekCalls={12} todayCalls={3} />);

    expect(screen.getByText("Total Calls")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
