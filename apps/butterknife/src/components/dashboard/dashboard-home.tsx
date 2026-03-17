"use client";

import { useEffect, useMemo, useState } from "react";

import { AverageCallDurationCard } from "@/components/dashboard/average-call-duration-card";
import { AnsweredVsVoicemailCard } from "@/components/dashboard/answered-vs-voicemail-card";
import { CallsBarChartCard } from "@/components/dashboard/calls-bar-chart-card";
import { QualifiedLeadsCard } from "@/components/dashboard/qualified-leads-card";
import { RoiEstimateCard } from "@/components/dashboard/roi-estimate-card";
import { TotalCallsCard } from "@/components/dashboard/total-calls-card";
import { buildLast14DayCallsSeries } from "@/lib/dashboard";
import type { Call } from "@/types/call";

interface CallStatsResponse {
  totalCalls?: number;
  thisWeekCalls?: number;
  todayCalls?: number;
  answeredCount?: number;
  voicemailCount?: number;
  qualifiedLeads?: number;
  averageDuration?: number;
}

interface DashboardStats {
  totalCalls: number;
  thisWeekCalls: number;
  todayCalls: number;
  answeredCount: number;
  voicemailCount: number;
  qualifiedLeads: number;
  averageDuration: number;
}

const defaultStats: DashboardStats = {
  totalCalls: 0,
  thisWeekCalls: 0,
  todayCalls: 0,
  answeredCount: 0,
  voicemailCount: 0,
  qualifiedLeads: 0,
  averageDuration: 0,
};

function toSafeWholeNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}

function normalizeStats(payload: CallStatsResponse | null | undefined): DashboardStats {
  if (!payload) {
    return defaultStats;
  }

  return {
    totalCalls: toSafeWholeNumber(payload.totalCalls),
    thisWeekCalls: toSafeWholeNumber(payload.thisWeekCalls),
    todayCalls: toSafeWholeNumber(payload.todayCalls),
    answeredCount: toSafeWholeNumber(payload.answeredCount),
    voicemailCount: toSafeWholeNumber(payload.voicemailCount),
    qualifiedLeads: toSafeWholeNumber(payload.qualifiedLeads),
    averageDuration: toSafeWholeNumber(payload.averageDuration),
  };
}

function normalizeCalls(payload: unknown): Call[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter((item): item is Call => typeof item === "object" && item !== null);
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6" data-testid="dashboard-loading-skeleton">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`card-skeleton-${index}`}
            className="h-44 animate-pulse rounded-lg border border-zinc-200 bg-white"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-lg border border-zinc-200 bg-white" />
    </div>
  );
}

export function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [statsResponse, callsResponse] = await Promise.all([
          fetch("/api/calls/stats", { cache: "no-store" }),
          fetch("/api/calls", { cache: "no-store" }),
        ]);

        if (!statsResponse.ok || !callsResponse.ok) {
          throw new Error("Unable to fetch dashboard data");
        }

        const [statsPayload, callsPayload] = await Promise.all([
          (statsResponse.json() as Promise<CallStatsResponse>),
          callsResponse.json(),
        ]);

        if (!isMounted) {
          return;
        }

        setStats(normalizeStats(statsPayload));
        setCalls(normalizeCalls(callsPayload));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Unable to load dashboard data right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const callsSeries = useMemo(() => buildLast14DayCallsSeries(calls), [calls]);

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TotalCallsCard
          totalCalls={stats.totalCalls}
          thisWeekCalls={stats.thisWeekCalls}
          todayCalls={stats.todayCalls}
        />
        <AnsweredVsVoicemailCard
          answeredCount={stats.answeredCount}
          voicemailCount={stats.voicemailCount}
        />
        <QualifiedLeadsCard qualifiedLeads={stats.qualifiedLeads} />
        <AverageCallDurationCard averageDuration={stats.averageDuration} />
        <RoiEstimateCard qualifiedLeads={stats.qualifiedLeads} />
      </div>

      <CallsBarChartCard data={callsSeries} />
    </div>
  );
}
