import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AverageCallDurationCard } from "./average-call-duration-card";

describe("AverageCallDurationCard", () => {
  it("formats duration as mm:ss", () => {
    render(<AverageCallDurationCard averageDuration={125} />);

    expect(screen.getByText("Average Call Duration")).toBeInTheDocument();
    expect(screen.getByText("2:05")).toBeInTheDocument();
  });
});
