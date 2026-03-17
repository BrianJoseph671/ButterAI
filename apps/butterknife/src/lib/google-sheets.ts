import { google, type sheets_v4 } from "googleapis";

import type { Call, CallStatus, FinancingInterest } from "@/types/call";

type SheetCell = string | number | boolean | null | undefined;

const SHEET_NAME = "Sheet1";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function normalizePrivateKey(privateKey: string): string {
  return privateKey.replace(/\\n/g, "\n");
}

export function toCamelCase(header: string): string {
  const normalized = header.trim().toLowerCase();

  return normalized.replace(/[^a-z0-9]+([a-z0-9])/g, (_, group: string) => {
    return group.toUpperCase();
  });
}

function toNullableString(value: SheetCell): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

function toNullableNumber(value: SheetCell): number | null {
  const normalized = toNullableString(value);
  if (normalized === null || normalized.trim() === "") {
    return null;
  }

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function toCallStatus(value: SheetCell): CallStatus | null {
  const normalized = toNullableString(value)?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized === "answered" || normalized === "voicemail") {
    return normalized;
  }

  return null;
}

function toFinancingInterest(value: SheetCell): FinancingInterest | null {
  const normalized = toNullableString(value)?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized === "yes" || normalized === "no") {
    return normalized;
  }

  return null;
}

function mapRowByCamelHeaders(
  headers: readonly string[],
  row: readonly SheetCell[]
): Record<string, SheetCell> {
  return headers.reduce<Record<string, SheetCell>>((accumulator, header, index) => {
    accumulator[toCamelCase(header)] = row[index] ?? null;
    return accumulator;
  }, {});
}

function toCall(
  headers: readonly string[],
  row: readonly SheetCell[]
): Call {
  const mapped = mapRowByCamelHeaders(headers, row);

  return {
    date: toNullableString(mapped.date),
    name: toNullableString(mapped.name),
    number: toNullableString(mapped.number),
    request: toNullableString(mapped.request),
    equipmentAge: toNullableString(mapped.equipmentAge),
    homeSize: toNullableString(mapped.homeSize),
    makeModel: toNullableString(mapped.makeModel),
    callStatus: toCallStatus(mapped.callStatus),
    financingInterest: toFinancingInterest(mapped.financingInterest),
    creditScore: toNullableNumber(mapped.creditScore),
    paymentMethod: toNullableString(mapped.paymentMethod),
    urgency: toNullableString(mapped.urgency),
    availability: toNullableString(mapped.availability),
    callDuration: toNullableNumber(mapped.callDuration),
  };
}

export function mapSheetValuesToCalls(
  values: readonly (readonly SheetCell[])[] | null | undefined
): Call[] {
  if (!values || values.length <= 1) {
    return [];
  }

  const [headerRow, ...dataRows] = values;
  const headers = headerRow.map((cell) => toNullableString(cell) ?? "");

  return dataRows.map((row) => toCall(headers, row));
}

function createSheetsClient(): sheets_v4.Sheets {
  const auth = new google.auth.JWT({
    email: getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: normalizePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY")),
    scopes: [SHEETS_SCOPE],
  });

  return google.sheets({ version: "v4", auth });
}

export async function fetchCallsFromGoogleSheets(
  sheetName: string = SHEET_NAME
): Promise<Call[]> {
  const sheets = createSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getRequiredEnv("GOOGLE_SHEETS_ID"),
    range: sheetName,
  });

  return mapSheetValuesToCalls(response.data.values as readonly (readonly SheetCell[])[] | undefined);
}
