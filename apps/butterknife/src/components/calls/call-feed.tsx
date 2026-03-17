"use client";

import { useEffect, useMemo, useState } from "react";

import type { Call } from "@/types/call";

import { CallRow } from "./call-row";

type StatusFilter = "all" | "answered" | "voicemail";
type DateRangeFilter = "none" | "today" | "week" | "month" | "custom";

function toSortableTimestamp(date: string | null): number {
  if (!date) {
    return Number.NEGATIVE_INFINITY;
  }

  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function sortCallsNewestFirst(calls: Call[]): Call[] {
  return [...calls].sort((a, b) => toSortableTimestamp(b.date) - toSortableTimestamp(a.date));
}

function normalizeCalls(payload: unknown): Call[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter((item): item is Call => typeof item === "object" && item !== null);
}

function buildCallKey(call: Call, index: number): string {
  return `${call.date ?? "no-date"}-${call.number ?? "no-number"}-${index}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parseDateInput(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function matchesDateRange(
  callDate: string | null,
  dateRangeFilter: DateRangeFilter,
  customStartDate: string,
  customEndDate: string
): boolean {
  if (dateRangeFilter === "none") {
    return true;
  }

  if (!callDate) {
    return false;
  }

  const date = new Date(callDate);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  const todayStart = startOfDay(now);

  if (dateRangeFilter === "today") {
    return date >= todayStart && date < addDays(todayStart, 1);
  }

  if (dateRangeFilter === "week") {
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());
    return date >= weekStart && date < addDays(weekStart, 7);
  }

  if (dateRangeFilter === "month") {
    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
    const monthEnd = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 1);
    return date >= monthStart && date < monthEnd;
  }

  const customStart = parseDateInput(customStartDate);
  const customEnd = parseDateInput(customEndDate);

  if (customStart && date < startOfDay(customStart)) {
    return false;
  }

  if (customEnd && date >= addDays(startOfDay(customEnd), 1)) {
    return false;
  }

  return true;
}

function normalizeSearchText(value: string | null | undefined): string {
  return value?.toLowerCase() ?? "";
}

export function CallFeed() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>("none");
  const [searchTerm, setSearchTerm] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCalls = async () => {
      try {
        const response = await fetch("/api/calls", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to fetch call feed");
        }

        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        setCalls(sortCallsNewestFirst(normalizeCalls(payload)));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Unable to load call feed right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCalls();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const matchesStatus = statusFilter === "all" || call.callStatus === statusFilter;
      const matchesDate = matchesDateRange(call.date, dateRangeFilter, customStartDate, customEndDate);

      const nameText = normalizeSearchText(call.name);
      const numberText = normalizeSearchText(call.number);
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        nameText.includes(normalizedSearchTerm) ||
        numberText.includes(normalizedSearchTerm);

      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [calls, customEndDate, customStartDate, dateRangeFilter, normalizedSearchTerm, statusFilter]);

  const hasActiveFilters =
    statusFilter !== "all" ||
    dateRangeFilter !== "none" ||
    normalizedSearchTerm.length > 0 ||
    customStartDate.length > 0 ||
    customEndDate.length > 0;

  const resetFilters = () => {
    setStatusFilter("all");
    setDateRangeFilter("none");
    setSearchTerm("");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Call Feed</h1>
        <p className="mt-1 text-sm text-zinc-600">All Butter AI calls, newest first.</p>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-end">
          <label className="space-y-1" htmlFor="status-filter">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Status</span>
            <select
              id="status-filter"
              aria-label="Status"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
              }}
            >
              <option value="all">All</option>
              <option value="answered">Answered</option>
              <option value="voicemail">Voicemail</option>
            </select>
          </label>

          <label className="space-y-1" htmlFor="date-range-filter">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Date range</span>
            <select
              id="date-range-filter"
              aria-label="Date range"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              value={dateRangeFilter}
              onChange={(event) => {
                const nextValue = event.target.value as DateRangeFilter;
                setDateRangeFilter(nextValue);

                if (nextValue !== "custom") {
                  setCustomStartDate("");
                  setCustomEndDate("");
                }
              }}
            >
              <option value="none">Any date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="space-y-1" htmlFor="call-search">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Search</span>
            <input
              id="call-search"
              aria-label="Search"
              type="text"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              placeholder="Search by name or phone number"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </label>

          <button
            type="button"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!hasActiveFilters}
            onClick={resetFilters}
          >
            Reset filters
          </button>
        </div>

        {dateRangeFilter === "custom" ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1" htmlFor="custom-start-date">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Start date</span>
              <input
                id="custom-start-date"
                aria-label="Start date"
                type="date"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                value={customStartDate}
                onChange={(event) => {
                  setCustomStartDate(event.target.value);
                }}
              />
            </label>

            <label className="space-y-1" htmlFor="custom-end-date">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">End date</span>
              <input
                id="custom-end-date"
                aria-label="End date"
                type="date"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                value={customEndDate}
                onChange={(event) => {
                  setCustomEndDate(event.target.value);
                }}
              />
            </label>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
          <span aria-hidden="true" className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#F5D76E]" />
          Loading call feed...
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && filteredCalls.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-6">
          <p className="text-sm text-zinc-600">No calls found.</p>
          {hasActiveFilters ? (
            <button
              type="button"
              className="mt-3 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !errorMessage && filteredCalls.length > 0 ? (
        <ul className="space-y-3" aria-label="Call list">
          {filteredCalls.map((call, index) => (
            <li key={buildCallKey(call, index)}>
              <CallRow call={call} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
