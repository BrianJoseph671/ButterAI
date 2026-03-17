import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Call } from "@/types/call";

import { GET } from "./route";

const fetchCallsFromGoogleSheets = vi.hoisted(() => vi.fn<() => Promise<Call[]>>());

vi.mock("@/lib/google-sheets", () => ({
  fetchCallsFromGoogleSheets,
}));

function buildExpectedCallsPerDay(): Array<{ date: string; count: number }> {
  return [
    { date: "2026-03-03", count: 0 },
    { date: "2026-03-04", count: 0 },
    { date: "2026-03-05", count: 0 },
    { date: "2026-03-06", count: 0 },
    { date: "2026-03-07", count: 0 },
    { date: "2026-03-08", count: 0 },
    { date: "2026-03-09", count: 0 },
    { date: "2026-03-10", count: 1 },
    { date: "2026-03-11", count: 0 },
    { date: "2026-03-12", count: 0 },
    { date: "2026-03-13", count: 0 },
    { date: "2026-03-14", count: 0 },
    { date: "2026-03-15", count: 1 },
    { date: "2026-03-16", count: 2 },
  ];
}

describe("GET /api/calls/stats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T12:00:00Z"));
    fetchCallsFromGoogleSheets.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns aggregated stats with accurate calculations", async () => {
    const calls: Call[] = [
      {
        date: "2026-03-16T09:00:00Z",
        name: "Alice",
        number: "+15745550001",
        request: "AC issue",
        equipmentAge: null,
        homeSize: null,
        makeModel: null,
        callStatus: "answered",
        financingInterest: "yes",
        creditScore: 8,
        paymentMethod: null,
        urgency: "high",
        availability: "Today",
        callDuration: 120,
      },
      {
        date: "2026-03-16T11:00:00Z",
        name: null,
        number: "+15745550002",
        request: null,
        equipmentAge: null,
        homeSize: null,
        makeModel: null,
        callStatus: "voicemail",
        financingInterest: null,
        creditScore: null,
        paymentMethod: null,
        urgency: null,
        availability: null,
        callDuration: 60,
      },
      {
        date: "2026-03-15T08:30:00Z",
        name: "Bob",
        number: "+15745550003",
        request: "",
        equipmentAge: null,
        homeSize: null,
        makeModel: null,
        callStatus: "answered",
        financingInterest: "no",
        creditScore: null,
        paymentMethod: "cash",
        urgency: "low",
        availability: "Next week",
        callDuration: 180,
      },
      {
        date: "2026-03-10T14:20:00Z",
        name: "Charlie",
        number: "+15745550004",
        request: "No heat",
        equipmentAge: null,
        homeSize: null,
        makeModel: null,
        callStatus: "answered",
        financingInterest: "yes",
        creditScore: 6,
        paymentMethod: null,
        urgency: "high",
        availability: "ASAP",
        callDuration: 90,
      },
      {
        date: "2026-03-01T10:00:00Z",
        name: "Dana",
        number: "+15745550005",
        request: "Tune-up",
        equipmentAge: null,
        homeSize: null,
        makeModel: null,
        callStatus: "voicemail",
        financingInterest: null,
        creditScore: null,
        paymentMethod: null,
        urgency: "low",
        availability: "Anytime",
        callDuration: 30,
      },
    ];

    fetchCallsFromGoogleSheets.mockResolvedValue(calls);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      totalCalls: 5,
      thisWeekCalls: 2,
      todayCalls: 2,
      answeredCount: 3,
      voicemailCount: 2,
      qualifiedLeads: 2,
      averageDuration: 96,
      callsPerDay: buildExpectedCallsPerDay(),
    });
  });

  it("returns zeroed-out stats for an empty sheet", async () => {
    fetchCallsFromGoogleSheets.mockResolvedValue([]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.totalCalls).toBe(0);
    expect(payload.thisWeekCalls).toBe(0);
    expect(payload.todayCalls).toBe(0);
    expect(payload.answeredCount).toBe(0);
    expect(payload.voicemailCount).toBe(0);
    expect(payload.qualifiedLeads).toBe(0);
    expect(payload.averageDuration).toBe(0);
    expect(payload.callsPerDay).toHaveLength(14);
    expect(payload.callsPerDay.every((day: { count: number }) => day.count === 0)).toBe(true);
  });

  it("returns a structured error with status 500 on Sheets API failure", async () => {
    fetchCallsFromGoogleSheets.mockRejectedValue(new Error("Sheets API unavailable"));

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({ error: "Failed to fetch call stats" });
  });
});
