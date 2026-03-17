import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Call } from "@/types/call";

import { GET } from "./route";

const fetchCallsFromGoogleSheets = vi.hoisted(() => vi.fn<() => Promise<Call[]>>());

vi.mock("@/lib/google-sheets", () => ({
  fetchCallsFromGoogleSheets,
}));

describe("GET /api/calls", () => {
  beforeEach(() => {
    fetchCallsFromGoogleSheets.mockReset();
  });

  it("returns calls sorted in reverse-chronological order", async () => {
    const calls: Call[] = [
      {
        date: "2026-03-14T09:00:00Z",
        name: "Older Lead",
        number: "+15745550100",
        request: "Furnace check",
        equipmentAge: "8",
        homeSize: "1800",
        makeModel: "Trane A1",
        callStatus: "answered",
        financingInterest: "no",
        creditScore: null,
        paymentMethod: "card",
        urgency: "medium",
        availability: "Afternoon",
        callDuration: 120,
      },
      {
        date: "2026-03-16T11:00:00Z",
        name: "Newest Lead",
        number: "+15745550101",
        request: "AC repair",
        equipmentAge: "12",
        homeSize: "2200",
        makeModel: "Carrier X",
        callStatus: "voicemail",
        financingInterest: "yes",
        creditScore: 7,
        paymentMethod: null,
        urgency: "high",
        availability: "Morning",
        callDuration: 90,
      },
      {
        date: "2026-03-15T11:00:00Z",
        name: "Middle Lead",
        number: "+15745550102",
        request: "No heat",
        equipmentAge: "15",
        homeSize: "2000",
        makeModel: "Lennox Z",
        callStatus: "answered",
        financingInterest: "yes",
        creditScore: 6,
        paymentMethod: null,
        urgency: "high",
        availability: "Today",
        callDuration: 180,
      },
    ];

    fetchCallsFromGoogleSheets.mockResolvedValue(calls);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toHaveLength(3);
    expect(payload.map((call: Call) => call.name)).toEqual([
      "Newest Lead",
      "Middle Lead",
      "Older Lead",
    ]);
    expect(payload[0]).toMatchObject({
      date: "2026-03-16T11:00:00Z",
      name: "Newest Lead",
      number: "+15745550101",
      request: "AC repair",
      equipmentAge: "12",
      homeSize: "2200",
      makeModel: "Carrier X",
      callStatus: "voicemail",
      financingInterest: "yes",
      creditScore: 7,
      paymentMethod: null,
      urgency: "high",
      availability: "Morning",
      callDuration: 90,
    });
  });

  it("returns an empty array when sheet has no data rows", async () => {
    fetchCallsFromGoogleSheets.mockResolvedValue([]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual([]);
  });

  it("returns a structured error with status 500 on Sheets API failure", async () => {
    fetchCallsFromGoogleSheets.mockRejectedValue(new Error("Sheets API unavailable"));

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({ error: "Failed to fetch calls" });
  });
});
