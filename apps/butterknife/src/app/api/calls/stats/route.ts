import { NextResponse } from "next/server";

import { fetchCallsFromGoogleSheets } from "@/lib/google-sheets";
import type { Call } from "@/types/call";

const DAYS_WINDOW = 14;

interface CallsPerDayEntry {
  date: string;
  count: number;
}

interface CallStats {
  totalCalls: number;
  thisWeekCalls: number;
  todayCalls: number;
  answeredCount: number;
  voicemailCount: number;
  qualifiedLeads: number;
  averageDuration: number;
  callsPerDay: CallsPerDayEntry[];
}

function isNonEmptyString(value: string | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function formatUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildLast14DayDates(now: Date): string[] {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  const keys: string[] = [];
  for (let offset = DAYS_WINDOW - 1; offset >= 0; offset -= 1) {
    const utcDate = new Date(Date.UTC(year, month, day - offset));
    keys.push(formatUtcDateKey(utcDate));
  }

  return keys;
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

function calculateAverageDuration(calls: Call[]): number {
  const durations = calls
    .map((call) => call.callDuration)
    .filter((duration): duration is number => typeof duration === "number" && Number.isFinite(duration));

  if (durations.length === 0) {
    return 0;
  }

  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
  return Math.round(totalDuration / durations.length);
}

function calculateCallsPerDay(calls: Call[], now: Date): CallsPerDayEntry[] {
  const last14Days = buildLast14DayDates(now);
  const callsByDay = new Map<string, number>(last14Days.map((date) => [date, 0]));

  for (const call of calls) {
    const dateKey = extractUtcDateKey(call.date);
    if (!dateKey || !callsByDay.has(dateKey)) {
      continue;
    }

    callsByDay.set(dateKey, (callsByDay.get(dateKey) ?? 0) + 1);
  }

  return last14Days.map((date) => ({
    date,
    count: callsByDay.get(date) ?? 0,
  }));
}

function toUtcStartOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toUtcStartOfWeek(date: Date): Date {
  const startOfDay = toUtcStartOfDay(date);
  const dayOfWeek = startOfDay.getUTCDay();
  const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  startOfDay.setUTCDate(startOfDay.getUTCDate() - (isoDayOfWeek - 1));

  return startOfDay;
}

function parseDate(dateValue: string | null): Date | null {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function calculateTodayAndThisWeek(calls: Call[], now: Date): { todayCalls: number; thisWeekCalls: number } {
  const startOfToday = toUtcStartOfDay(now).getTime();
  const startOfTomorrow = startOfToday + 24 * 60 * 60 * 1000;
  const startOfWeek = toUtcStartOfWeek(now).getTime();

  let todayCalls = 0;
  let thisWeekCalls = 0;

  for (const call of calls) {
    const callDate = parseDate(call.date);

    if (!callDate) {
      continue;
    }

    const timestamp = callDate.getTime();

    if (timestamp >= startOfWeek) {
      thisWeekCalls += 1;
    }

    if (timestamp >= startOfToday && timestamp < startOfTomorrow) {
      todayCalls += 1;
    }
  }

  return { todayCalls, thisWeekCalls };
}

function buildStats(calls: Call[], now: Date = new Date()): CallStats {
  const totalCalls = calls.length;
  const { todayCalls, thisWeekCalls } = calculateTodayAndThisWeek(calls, now);
  const answeredCount = calls.filter((call) => call.callStatus === "answered").length;
  const voicemailCount = calls.filter((call) => call.callStatus === "voicemail").length;
  const qualifiedLeads = calls.filter(
    (call) =>
      call.callStatus === "answered" &&
      isNonEmptyString(call.name) &&
      isNonEmptyString(call.request)
  ).length;

  return {
    totalCalls,
    thisWeekCalls,
    todayCalls,
    answeredCount,
    voicemailCount,
    qualifiedLeads,
    averageDuration: calculateAverageDuration(calls),
    callsPerDay: calculateCallsPerDay(calls, now),
  };
}

export async function GET() {
  try {
    const calls = await fetchCallsFromGoogleSheets();
    const stats = buildStats(calls);

    return NextResponse.json(stats, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch call stats" }, { status: 500 });
  }
}
