const numberFormatter = new Intl.NumberFormat("en-US");
const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function toDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

export function formatBudgetMillions(value: number) {
  return `$${formatNumber(value)}M`;
}

export function formatShortDate(value: string) {
  const date = toDate(value);
  return date ? shortDateFormatter.format(date) : value;
}

export function formatPercent(value: number, maximumFractionDigits = 0) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(maximumFractionDigits)}%`;
}
