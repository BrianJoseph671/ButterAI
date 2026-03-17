import { NextResponse } from "next/server";

import { fetchCallsFromGoogleSheets } from "@/lib/google-sheets";
import type { Call } from "@/types/call";

function toSortableTimestamp(date: string | null): number {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function sortCallsReverseChronological(calls: Call[]): Call[] {
  return [...calls].sort((a, b) => toSortableTimestamp(b.date) - toSortableTimestamp(a.date));
}

export async function GET() {
  try {
    const calls = await fetchCallsFromGoogleSheets();
    const sortedCalls = sortCallsReverseChronological(calls);

    return NextResponse.json(sortedCalls, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 });
  }
}
