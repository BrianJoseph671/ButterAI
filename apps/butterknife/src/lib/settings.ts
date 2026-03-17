export const SETTINGS_STORAGE_KEYS = {
  businessName: "butter-businessName",
  averageJobValue: "butter-avgJobValue",
  monthlyCost: "butter-monthlyCost",
} as const;

export const SETTINGS_UPDATED_EVENT = "butter-settings-updated";

export interface ButterSettings {
  businessName: string;
  averageJobValue: number;
  monthlyCost: number;
}

export const DEFAULT_SETTINGS: ButterSettings = {
  businessName: "ButterAI",
  averageJobValue: 0,
  monthlyCost: 300,
};

function toSafeNonNegativeNumber(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
}

export function parseStoredSettingNumber(value: string | null, fallback: number): number {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  return toSafeNonNegativeNumber(parsed, fallback);
}

export function normalizeBusinessName(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? "";
  return trimmed || DEFAULT_SETTINGS.businessName;
}

export function readSettings(storage: Pick<Storage, "getItem">): ButterSettings {
  return {
    businessName: normalizeBusinessName(storage.getItem(SETTINGS_STORAGE_KEYS.businessName)),
    averageJobValue: parseStoredSettingNumber(
      storage.getItem(SETTINGS_STORAGE_KEYS.averageJobValue),
      DEFAULT_SETTINGS.averageJobValue,
    ),
    monthlyCost: parseStoredSettingNumber(
      storage.getItem(SETTINGS_STORAGE_KEYS.monthlyCost),
      DEFAULT_SETTINGS.monthlyCost,
    ),
  };
}

export function saveSettings(storage: Pick<Storage, "setItem">, settings: ButterSettings): void {
  storage.setItem(SETTINGS_STORAGE_KEYS.businessName, normalizeBusinessName(settings.businessName));
  storage.setItem(
    SETTINGS_STORAGE_KEYS.averageJobValue,
    String(toSafeNonNegativeNumber(settings.averageJobValue, DEFAULT_SETTINGS.averageJobValue)),
  );
  storage.setItem(
    SETTINGS_STORAGE_KEYS.monthlyCost,
    String(toSafeNonNegativeNumber(settings.monthlyCost, DEFAULT_SETTINGS.monthlyCost)),
  );
}

export function sanitizeNumericInput(value: string): string {
  const sanitized = value.replace(/[^\d.]/g, "");
  const [wholePart, ...fractionParts] = sanitized.split(".");

  if (fractionParts.length === 0) {
    return wholePart;
  }

  return `${wholePart}.${fractionParts.join("")}`;
}

export function parseNumericInput(value: string, fallback: number): number {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 0;
  }

  const parsed = Number(trimmed);
  return toSafeNonNegativeNumber(parsed, fallback);
}
