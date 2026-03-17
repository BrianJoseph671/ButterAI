"use client";

import { useEffect, useRef, useState } from "react";

import {
  DEFAULT_SETTINGS,
  SETTINGS_UPDATED_EVENT,
  parseNumericInput,
  readSettings,
  sanitizeNumericInput,
  saveSettings,
} from "@/lib/settings";

const SAVE_DEBOUNCE_MS = 500;
const SAVED_MESSAGE_DURATION_MS = 1500;

type SaveStatus = "idle" | "saving" | "saved";

function formatNumberForInput(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return "0";
  }

  return String(value);
}

export function SettingsForm() {
  const [businessName, setBusinessName] = useState(DEFAULT_SETTINGS.businessName);
  const [averageJobValue, setAverageJobValue] = useState(formatNumberForInput(DEFAULT_SETTINGS.averageJobValue));
  const [monthlyCost, setMonthlyCost] = useState(formatNumberForInput(DEFAULT_SETTINGS.monthlyCost));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const hasHydrated = useRef(false);
  const isFirstRenderAfterHydration = useRef(true);

  useEffect(() => {
    const storedSettings = readSettings(window.localStorage);

    const timeoutId = window.setTimeout(() => {
      setBusinessName(storedSettings.businessName);
      setAverageJobValue(formatNumberForInput(storedSettings.averageJobValue));
      setMonthlyCost(formatNumberForInput(storedSettings.monthlyCost));
      hasHydrated.current = true;
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    if (isFirstRenderAfterHydration.current) {
      isFirstRenderAfterHydration.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveSettings(window.localStorage, {
        businessName,
        averageJobValue: parseNumericInput(averageJobValue, DEFAULT_SETTINGS.averageJobValue),
        monthlyCost: parseNumericInput(monthlyCost, DEFAULT_SETTINGS.monthlyCost),
      });

      window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
      setSaveStatus("saved");
    }, SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [averageJobValue, businessName, monthlyCost]);

  useEffect(() => {
    if (saveStatus !== "saved") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSaveStatus("idle");
    }, SAVED_MESSAGE_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [saveStatus]);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-zinc-700">Update your business profile and ROI configuration.</p>
      </header>

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <label className="block space-y-1.5" htmlFor="business-name-input">
          <span className="text-sm font-medium text-zinc-800">Business Name</span>
          <input
            id="business-name-input"
            aria-label="Business Name"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            type="text"
            value={businessName}
            onChange={(event) => {
              setBusinessName(event.target.value);
              setSaveStatus("saving");
            }}
          />
        </label>

        <label className="block space-y-1.5" htmlFor="average-job-value-input">
          <span className="text-sm font-medium text-zinc-800">Average Job Value</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              $
            </span>
            <input
              id="average-job-value-input"
              aria-label="Average Job Value"
              className="w-full rounded-md border border-zinc-300 py-2 pl-7 pr-3 text-sm text-zinc-900"
              type="text"
              inputMode="decimal"
              value={averageJobValue}
              onChange={(event) => {
                setAverageJobValue(sanitizeNumericInput(event.target.value));
                setSaveStatus("saving");
              }}
              onBlur={() => {
                if (averageJobValue.trim().length === 0) {
                  setAverageJobValue("0");
                  setSaveStatus("saving");
                }
              }}
            />
          </div>
        </label>

        <label className="block space-y-1.5" htmlFor="monthly-cost-input">
          <span className="text-sm font-medium text-zinc-800">Butter AI Monthly Cost</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              $
            </span>
            <input
              id="monthly-cost-input"
              aria-label="Butter AI Monthly Cost"
              className="w-full rounded-md border border-zinc-300 py-2 pl-7 pr-3 text-sm text-zinc-900"
              type="text"
              inputMode="decimal"
              value={monthlyCost}
              onChange={(event) => {
                setMonthlyCost(sanitizeNumericInput(event.target.value));
                setSaveStatus("saving");
              }}
              onBlur={() => {
                if (monthlyCost.trim().length === 0) {
                  setMonthlyCost("0");
                  setSaveStatus("saving");
                }
              }}
            />
          </div>
        </label>
      </form>

      <div className="mt-4 min-h-5">
        {saveStatus !== "idle" ? (
          <p role="status" aria-live="polite" className="text-sm text-zinc-600">
            {saveStatus === "saving" ? "Saving..." : "Saved"}
          </p>
        ) : null}
      </div>
    </section>
  );
}
