import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QualifiedLeadsCard } from "./qualified-leads-card";

describe("QualifiedLeadsCard", () => {
  it("renders the qualified lead count", () => {
    render(<QualifiedLeadsCard qualifiedLeads={7} />);

    expect(screen.getByText("Qualified Leads")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
