export function formatMoney(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function greetingForHour(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function formatDate(v: unknown) {
  if (v === null || v === undefined) return "—";
  try {
    const d =
      typeof v === "string"
        ? new Date(v)
        : v instanceof Date
          ? v
          : new Date(String(v));
    if (Number.isNaN(d.getTime())) return String(v);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return String(v);
  }
}
