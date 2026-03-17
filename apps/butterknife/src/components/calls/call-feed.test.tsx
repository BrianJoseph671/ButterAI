import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Call } from "@/types/call";

import { CallFeed } from "./call-feed";

function pad(value: number): string {
  return `${value}`.padStart(2, "0");
}

function toLocalDateTimeString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
}

function toDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function createPayload(): Call[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayMorning = new Date(today);
  todayMorning.setHours(10, 0, 0, 0);

  const todayEarly = new Date(today);
  todayEarly.setHours(8, 0, 0, 0);

  const thisWeekDate = new Date(today);
  thisWeekDate.setDate(today.getDate() - 1);
  thisWeekDate.setHours(9, 0, 0, 0);

  const thisMonthDate = new Date(now.getFullYear(), now.getMonth(), 2, 10, 0, 0);
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 20, 10, 0, 0);

  return [
    {
      date: toLocalDateTimeString(previousMonthDate),
      name: "Alex February",
      number: "+15745550999",
      request: "Heater tune-up",
      equipmentAge: "10",
      homeSize: "1800",
      makeModel: "Model A",
      callStatus: "answered",
      financingInterest: "no",
      creditScore: null,
      paymentMethod: "cash",
      urgency: "low",
      availability: "morning",
      callDuration: 75,
    },
    {
      date: toLocalDateTimeString(thisMonthDate),
      name: "Mia Monthly",
      number: "+15745550444",
      request: "Duct cleaning",
      equipmentAge: "7",
      homeSize: "2000",
      makeModel: "Model B",
      callStatus: "voicemail",
      financingInterest: "no",
      creditScore: null,
      paymentMethod: "card",
      urgency: "medium",
      availability: "afternoon",
      callDuration: 80,
    },
    {
      date: toLocalDateTimeString(thisWeekDate),
      name: "Cara Week",
      number: "+15745550333",
      request: "AC check",
      equipmentAge: "5",
      homeSize: "1900",
      makeModel: "Model C",
      callStatus: "answered",
      financingInterest: "yes",
      creditScore: 8,
      paymentMethod: null,
      urgency: "high",
      availability: "evening",
      callDuration: 120,
    },
    {
      date: toLocalDateTimeString(todayEarly),
      name: "Bob Today",
      number: "+15745550222",
      request: "No cooling",
      equipmentAge: "12",
      homeSize: "1600",
      makeModel: "Model D",
      callStatus: "voicemail",
      financingInterest: "no",
      creditScore: null,
      paymentMethod: "card",
      urgency: "high",
      availability: "morning",
      callDuration: 90,
    },
    {
      date: toLocalDateTimeString(todayMorning),
      name: "Alice Today",
      number: "+15745550111",
      request: "Compressor replacement",
      equipmentAge: "9",
      homeSize: "2100",
      makeModel: "Model E",
      callStatus: "answered",
      financingInterest: "yes",
      creditScore: 7,
      paymentMethod: null,
      urgency: "high",
      availability: "afternoon",
      callDuration: 150,
    },
  ];
}

function mockCallsResponse(data: Call[] = createPayload()) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => data,
    }))
  );
}

describe("CallFeed", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shows a loading indicator while calls are being fetched", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => undefined))
    );

    render(<CallFeed />);

    expect(screen.getByText("Loading call feed...")).toBeInTheDocument();
  });

  it("renders calls newest first", async () => {
    mockCallsResponse();

    render(<CallFeed />);

    const rowButtons = await screen.findAllByRole("button", {
      name: /Toggle details for/i,
    });

    expect(rowButtons).toHaveLength(5);
    expect(rowButtons[0]).toHaveTextContent("Alice Today");
    expect(rowButtons[1]).toHaveTextContent("Bob Today");
  });

  it("filters by call status", async () => {
    mockCallsResponse();

    render(<CallFeed />);

    await screen.findByRole("button", { name: /Toggle details for Alice Today/i });

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "answered" },
    });

    expect(screen.getByRole("button", { name: /Alice Today/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cara Week/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Bob Today/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mia Monthly/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "voicemail" },
    });

    expect(screen.getByRole("button", { name: /Bob Today/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mia Monthly/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Alice Today/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "all" },
    });

    expect(screen.getByRole("button", { name: /Alice Today/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Alex February/i })).toBeInTheDocument();
  });

  it("filters by preset date ranges", async () => {
    mockCallsResponse();

    render(<CallFeed />);

    await screen.findByRole("button", { name: /Toggle details for Alice Today/i });

    fireEvent.change(screen.getByLabelText("Date range"), {
      target: { value: "today" },
    });

    expect(screen.getByRole("button", { name: /Alice Today/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Bob Today/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cara Week/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Date range"), {
      target: { value: "week" },
    });

    expect(screen.getByRole("button", { name: /Cara Week/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Alice Today/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mia Monthly/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Date range"), {
      target: { value: "month" },
    });

    expect(screen.getByRole("button", { name: /Mia Monthly/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Alex February/i })).not.toBeInTheDocument();
  });

  it("filters by a custom date range", async () => {
    const payload = createPayload();
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    mockCallsResponse(payload);

    render(<CallFeed />);

    await screen.findByRole("button", { name: /Toggle details for Alice Today/i });

    fireEvent.change(screen.getByLabelText("Date range"), {
      target: { value: "custom" },
    });

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: toDateInputValue(yesterday) },
    });

    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: toDateInputValue(today) },
    });

    expect(screen.getByRole("button", { name: /Cara Week/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Alice Today/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mia Monthly/i })).not.toBeInTheDocument();
  });

  it("filters by search term for name case-insensitively", async () => {
    mockCallsResponse();

    render(<CallFeed />);

    await screen.findByRole("button", { name: /Toggle details for Alice Today/i });

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "aLiCe" },
    });

    expect(screen.getByRole("button", { name: /Alice Today/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Bob Today/i })).not.toBeInTheDocument();
  });

  it("filters by search term for phone number partial match", async () => {
    mockCallsResponse();

    render(<CallFeed />);

    await screen.findByRole("button", { name: /Toggle details for Alice Today/i });

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "999" },
    });

    expect(screen.getByRole("button", { name: /Alex February/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Alice Today/i })).not.toBeInTheDocument();
  });

  it("applies status, date range, and search together", async () => {
    mockCallsResponse();

    render(<CallFeed />);

    await screen.findByRole("button", { name: /Toggle details for Alice Today/i });

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "answered" },
    });

    fireEvent.change(screen.getByLabelText("Date range"), {
      target: { value: "month" },
    });

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "today" },
    });

    expect(screen.getByRole("button", { name: /Alice Today/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cara Week/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Bob Today/i })).not.toBeInTheDocument();
  });

  it("shows empty state and resets all filters", async () => {
    const payload = createPayload();
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    mockCallsResponse(payload);

    render(<CallFeed />);

    await screen.findByRole("button", { name: /Toggle details for Alice Today/i });

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "voicemail" },
    });

    fireEvent.change(screen.getByLabelText("Date range"), {
      target: { value: "custom" },
    });

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: toDateInputValue(yesterday) },
    });

    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: toDateInputValue(today) },
    });

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "does-not-match" },
    });

    expect(screen.getByText("No calls found.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getByLabelText("Status")).toHaveValue("all");
    expect(screen.getByLabelText("Date range")).toHaveValue("none");
    expect(screen.getByLabelText("Search")).toHaveValue("");
    expect(screen.getByRole("button", { name: /Toggle details for Alice Today/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Toggle details for Alex February/i })).toBeInTheDocument();
  });
});
