import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Call } from "@/types/call";

import { CallRow, formatCallDateTime } from "./call-row";

const baseCall: Call = {
  date: "2026-03-15T14:30:00Z",
  name: "Jane Doe",
  number: "+15745550123",
  request:
    "Need AC inspection and possible compressor replacement because the unit stopped cooling during the afternoon.",
  equipmentAge: "14 years",
  homeSize: "2,100 sq ft",
  makeModel: "Carrier X200",
  callStatus: "answered",
  financingInterest: "yes",
  creditScore: 7,
  paymentMethod: null,
  urgency: "High",
  availability: "Tomorrow morning",
  callDuration: 125,
};

describe("CallRow", () => {
  it("renders the collapsed row summary fields", () => {
    render(<CallRow call={baseCall} />);

    expect(screen.getByText(formatCallDateTime(baseCall.date))).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("+15745550123")).toBeInTheDocument();
    expect(screen.getByText("Answered")).toBeInTheDocument();
    expect(screen.getByText("2:05")).toBeInTheDocument();
    expect(screen.getByTestId("call-status-dot")).toHaveClass("bg-emerald-500");
    expect(screen.getByTestId("call-request-summary")).toHaveClass("truncate");
  });

  it("uses a gray status dot for voicemail calls", () => {
    const voicemailCall: Call = {
      ...baseCall,
      callStatus: "voicemail",
    };

    render(<CallRow call={voicemailCall} />);

    expect(screen.getByText("Voicemail")).toBeInTheDocument();
    expect(screen.getByTestId("call-status-dot")).toHaveClass("bg-zinc-400");
  });

  it("expands and collapses when the row is clicked and shows full request text", () => {
    render(<CallRow call={baseCall} />);

    const rowButton = screen.getByRole("button", {
      name: "Toggle details for Jane Doe",
    });

    expect(screen.queryByTestId("call-row-details")).not.toBeInTheDocument();

    fireEvent.click(rowButton);

    expect(screen.getByTestId("call-row-details")).toBeInTheDocument();
    expect(screen.getByText("Equipment Age")).toBeInTheDocument();
    expect(screen.getByTestId("call-request-full")).toHaveTextContent(baseCall.request as string);

    fireEvent.click(rowButton);

    expect(screen.queryByTestId("call-row-details")).not.toBeInTheDocument();
  });

  it("shows Credit Score only when financing interest is yes", () => {
    render(<CallRow call={baseCall} initiallyExpanded />);

    expect(screen.getByText("Financing Interest")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("Credit Score")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.queryByText("Payment Method")).not.toBeInTheDocument();
  });

  it("shows Payment Method only when financing interest is no", () => {
    const noFinancingCall: Call = {
      ...baseCall,
      financingInterest: "no",
      creditScore: null,
      paymentMethod: "Card",
    };

    render(<CallRow call={noFinancingCall} initiallyExpanded />);

    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Payment Method")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(screen.queryByText("Credit Score")).not.toBeInTheDocument();
  });

  it("shows N/A for null optional fields in expanded details", () => {
    const nullFieldCall: Call = {
      ...baseCall,
      equipmentAge: null,
      homeSize: null,
      makeModel: null,
      urgency: null,
      availability: null,
      request: null,
      financingInterest: "yes",
      creditScore: null,
    };

    render(<CallRow call={nullFieldCall} initiallyExpanded />);

    expect(screen.getByTestId("call-request-summary")).toHaveTextContent("N/A");
    expect(screen.getByTestId("call-request-full")).toHaveTextContent("N/A");
    expect(screen.getByTestId("detail-equipment-age")).toHaveTextContent("N/A");
    expect(screen.getByTestId("detail-home-size")).toHaveTextContent("N/A");
    expect(screen.getByTestId("detail-make-model")).toHaveTextContent("N/A");
    expect(screen.getByTestId("detail-urgency")).toHaveTextContent("N/A");
    expect(screen.getByTestId("detail-availability")).toHaveTextContent("N/A");
    expect(screen.getByTestId("detail-credit-score")).toHaveTextContent("N/A");
  });
});
