"use client";

import { useState } from "react";

import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Call, CallStatus, FinancingInterest } from "@/types/call";

function formatText(value: string | null | undefined): string {
  if (!value) {
    return "N/A";
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "N/A";
}

function formatStatusLabel(status: CallStatus | null): string {
  if (status === "answered") {
    return "Answered";
  }

  if (status === "voicemail") {
    return "Voicemail";
  }

  return "N/A";
}

function formatFinancingLabel(financingInterest: FinancingInterest | null): string {
  if (financingInterest === "yes") {
    return "Yes";
  }

  if (financingInterest === "no") {
    return "No";
  }

  return "N/A";
}

function formatCreditScore(creditScore: number | null): string {
  if (typeof creditScore !== "number" || !Number.isFinite(creditScore)) {
    return "N/A";
  }

  return `${creditScore}`;
}

export function formatCallDateTime(date: string | null | undefined): string {
  if (!date) {
    return "N/A";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

interface DetailItemProps {
  label: string;
  value: string;
  testId: string;
}

function DetailItem({ label, value, testId }: DetailItemProps) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-800" data-testid={testId}>
        {value}
      </dd>
    </div>
  );
}

interface CallRowProps {
  call: Call;
  initiallyExpanded?: boolean;
}

export function CallRow({ call, initiallyExpanded = false }: CallRowProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const leadName = formatText(call.name);
  const phoneNumber = formatText(call.number);
  const requestText = formatText(call.request);
  const statusLabel = formatStatusLabel(call.callStatus);
  const financingLabel = formatFinancingLabel(call.financingInterest);
  const isFinancingYes = call.financingInterest === "yes";
  const isFinancingNo = call.financingInterest === "no";
  const statusDotClass = call.callStatus === "answered" ? "bg-emerald-500" : "bg-zinc-400";

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        className="w-full px-4 py-4 text-left transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D76E]"
        aria-expanded={isExpanded}
        aria-label={`Toggle details for ${leadName}`}
        onClick={() => {
          setIsExpanded((previous) => !previous);
        }}
      >
        <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_2fr_auto] md:items-center md:gap-4">
          <div className="min-w-0">
            <p className="text-sm text-zinc-500">{formatCallDateTime(call.date)}</p>
            <p className="text-base font-semibold text-[#1a1a1a]">{leadName}</p>
            <p className="text-sm text-zinc-600">{phoneNumber}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <span
              aria-hidden="true"
              data-testid="call-status-dot"
              className={cn("h-2.5 w-2.5 rounded-full", statusDotClass)}
            />
            <span>{statusLabel}</span>
          </div>

          <p className="truncate text-sm text-zinc-600" data-testid="call-request-summary">
            {requestText}
          </p>

          <p className="text-sm font-medium text-zinc-700">{formatDuration(call.callDuration)}</p>
        </div>
      </button>

      {isExpanded ? (
        <div className="border-t border-zinc-200 px-4 py-4" data-testid="call-row-details">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Equipment Age" value={formatText(call.equipmentAge)} testId="detail-equipment-age" />
            <DetailItem label="Home Size" value={formatText(call.homeSize)} testId="detail-home-size" />
            <DetailItem label="Make/Model" value={formatText(call.makeModel)} testId="detail-make-model" />
            <DetailItem label="Financing Interest" value={financingLabel} testId="detail-financing-interest" />
            {isFinancingYes ? (
              <DetailItem
                label="Credit Score"
                value={formatCreditScore(call.creditScore)}
                testId="detail-credit-score"
              />
            ) : null}
            {isFinancingNo ? (
              <DetailItem
                label="Payment Method"
                value={formatText(call.paymentMethod)}
                testId="detail-payment-method"
              />
            ) : null}
            <DetailItem label="Urgency" value={formatText(call.urgency)} testId="detail-urgency" />
            <DetailItem
              label="Availability"
              value={formatText(call.availability)}
              testId="detail-availability"
            />
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Request</dt>
              <dd
                className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-800"
                data-testid="call-request-full"
              >
                {requestText}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </article>
  );
}
