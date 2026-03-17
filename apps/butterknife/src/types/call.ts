export type CallStatus = "answered" | "voicemail";

export type FinancingInterest = "yes" | "no";

export interface Call {
  date: string | null;
  name: string | null;
  number: string | null;
  request: string | null;
  equipmentAge: string | null;
  homeSize: string | null;
  makeModel: string | null;
  callStatus: CallStatus | null;
  financingInterest: FinancingInterest | null;
  creditScore: number | null;
  paymentMethod: string | null;
  urgency: string | null;
  availability: string | null;
  callDuration: number | null;
}

export const SHEET_COLUMNS = [
  "Date",
  "Name",
  "Number",
  "Request",
  "Equipment Age",
  "Home Size",
  "Make/Model",
  "Call Status",
  "Financing Interest",
  "Credit Score",
  "Payment Method",
  "Urgency",
  "Availability",
  "Call Duration",
] as const;

export type SheetColumn = (typeof SHEET_COLUMNS)[number];
