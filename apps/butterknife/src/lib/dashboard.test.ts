import { describe, expect, it } from "vitest";

import { buildLast14DayCallsSeries } from "./dashboard";

describe("buildLast14DayCallsSeries", () => {
  it("always returns a 14-day series with zero-fill", () => {
    const series = buildLast14DayCallsSeries([], new Date("2026-03-16T12:00:00Z"));

    expect(series).toHaveLength(14);
    expect(series[0].date).toBe("2026-03-03");
    expect(series[13].date).toBe("2026-03-16");
    expect(series.every((item) => item.count === 0)).toBe(true);
  });

  it("counts calls that fall within the last 14 days", () => {
    const series = buildLast14DayCallsSeries(
      [
        {
          date: "2026-03-16T09:00:00Z",
          name: null,
          number: null,
          request: null,
          equipmentAge: null,
          homeSize: null,
          makeModel: null,
          callStatus: null,
          financingInterest: null,
          creditScore: null,
          paymentMethod: null,
          urgency: null,
          availability: null,
          callDuration: null,
        },
        {
          date: "2026-03-16T10:00:00Z",
          name: null,
          number: null,
          request: null,
          equipmentAge: null,
          homeSize: null,
          makeModel: null,
          callStatus: null,
          financingInterest: null,
          creditScore: null,
          paymentMethod: null,
          urgency: null,
          availability: null,
          callDuration: null,
        },
        {
          date: "2026-03-15T10:00:00Z",
          name: null,
          number: null,
          request: null,
          equipmentAge: null,
          homeSize: null,
          makeModel: null,
          callStatus: null,
          financingInterest: null,
          creditScore: null,
          paymentMethod: null,
          urgency: null,
          availability: null,
          callDuration: null,
        },
      ],
      new Date("2026-03-16T12:00:00Z"),
    );

    expect(series.at(-1)?.count).toBe(2);
    expect(series.at(-2)?.count).toBe(1);
  });
});
