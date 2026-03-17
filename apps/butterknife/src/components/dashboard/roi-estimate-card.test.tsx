import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { RoiEstimateCard } from "./roi-estimate-card";

describe("RoiEstimateCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("calculates estimated revenue and ROI from localStorage values", async () => {
    localStorage.setItem("butter-avgJobValue", "1200");
    localStorage.setItem("butter-monthlyCost", "300");

    render(<RoiEstimateCard qualifiedLeads={2} />);

    expect(await screen.findByText("$2,400")).toBeInTheDocument();
    expect(screen.getByText("Butter AI Cost: $300/mo")).toBeInTheDocument();
    expect(screen.getByText("Estimated ROI: 700%")).toBeInTheDocument();
  });

  it("shows safe fallbacks when localStorage values are missing", async () => {
    render(<RoiEstimateCard qualifiedLeads={5} />);

    expect(await screen.findByText("$0")).toBeInTheDocument();
    expect(screen.getByText("Butter AI Cost: $300/mo")).toBeInTheDocument();
    expect(screen.getByText("Estimated ROI: -100%")).toBeInTheDocument();
  });
});
