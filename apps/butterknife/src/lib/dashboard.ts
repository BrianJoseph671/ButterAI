import type { Call } from "@/types/call";

const DAYS_WINDOW = 14;

export interface CallsBarDatum {
  date: string;
  label: string;
  count: number;
}

function formatUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function extractUtcDateKey(dateValue: string | null): string | null {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return formatUtcDateKey(date);
}

export function buildLast14DayCallsSeries(
  calls: Call[],
  now: Date = new Date(),
): CallsBarDatum[] {
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDay = now.getUTCDate();

  const baseDates = Array.from({ length: DAYS_WINDOW }, (_, index) => {
    const offset = DAYS_WINDOW - 1 - index;
    const date = new Date(Date.UTC(utcYear, utcMonth, utcDay - offset));

    return {
      date,
      key: formatUtcDateKey(date),
      label: formatDayLabel(date),
    };
  });

  const counts = new Map<string, number>(baseDates.map((entry) => [entry.key, 0]));

  for (const call of calls) {
    const dateKey = extractUtcDateKey(call.date);

    if (!dateKey || !counts.has(dateKey)) {
      continue;
    }

    counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
  }

  return baseDates.map((entry) => ({
    date: entry.key,
    label: entry.label,
    count: counts.get(entry.key) ?? 0,
  }));
}
