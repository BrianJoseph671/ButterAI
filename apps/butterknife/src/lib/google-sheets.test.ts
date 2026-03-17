import { describe, expect, it } from "vitest";

import { SHEET_COLUMNS } from "@/types/call";
import {
  mapSheetValuesToCalls,
  normalizePrivateKey,
  toCamelCase,
} from "@/lib/google-sheets";

describe("toCamelCase", () => {
  it("maps known Google Sheet headers to camelCase field names", () => {
    expect(toCamelCase("Call Status")).toBe("callStatus");
    expect(toCamelCase("Equipment Age")).toBe("equipmentAge");
    expect(toCamelCase("Make/Model")).toBe("makeModel");
    expect(toCamelCase("Call Duration")).toBe("callDuration");
  });
});

describe("mapSheetValuesToCalls", () => {
  it("maps rows using the header row and parses typed fields", () => {
    const values: string[][] = [
      [...SHEET_COLUMNS],
      [
        "2026-03-15T10:30:00Z",
        "Jane Doe",
        "+15745550123",
        "No heat upstairs",
        "14",
        "2400",
        "Carrier XYZ",
        "Answered",
        "Yes",
        "7",
        "",
        "high",
        "Tomorrow morning",
        "125",
      ],
    ];

    const calls = mapSheetValuesToCalls(values);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      date: "2026-03-15T10:30:00Z",
      callStatus: "answered",
      financingInterest: "yes",
      creditScore: 7,
      paymentMethod: "",
      callDuration: 125,
    });
    expect(calls[0].paymentMethod).not.toBeUndefined();
  });

  it("fills missing trailing cells with null (never undefined)", () => {
    const values: string[][] = [
      [...SHEET_COLUMNS],
      ["2026-03-15", "", "", "", "", "", "", "Voicemail"],
    ];

    const calls = mapSheetValuesToCalls(values);

    expect(calls).toHaveLength(1);
    expect(calls[0].callStatus).toBe("voicemail");
    expect(calls[0].financingInterest).toBeNull();
    expect(calls[0].creditScore).toBeNull();
    expect(calls[0].paymentMethod).toBeNull();
    expect(calls[0].callDuration).toBeNull();
  });

  it("returns an empty array for empty or header-only sheets", () => {
    expect(mapSheetValuesToCalls([])).toEqual([]);
    expect(mapSheetValuesToCalls([[...SHEET_COLUMNS]])).toEqual([]);
  });
});

describe("normalizePrivateKey", () => {
  it("converts escaped newlines to real newlines", () => {
    const raw = "line-one\\nline-two\\nline-three";
    expect(normalizePrivateKey(raw)).toBe("line-one\nline-two\nline-three");
  });
});
