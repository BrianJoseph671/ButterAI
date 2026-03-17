const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function toSafeNonNegativeNumber(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

export function formatDuration(seconds: number | null | undefined): string {
  const safeSeconds = Math.round(toSafeNonNegativeNumber(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function formatCurrency(amount: number | null | undefined): string {
  const safeAmount = Math.round(toSafeNonNegativeNumber(amount));
  return currencyFormatter.format(safeAmount);
}
