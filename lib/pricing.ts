import type { LineTaxMode } from "./line-types";

export type LineInput = {
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxMode: LineTaxMode;
};

/** Mirrors `server/src/utils/pricing.ts` for client-side line previews. */
export function computeLineAmounts(input: LineInput): {
  lineTotal: number;
  taxAmount: number;
  netBeforeTax: number;
} {
  const qty = input.quantity;
  const unit = input.unitPrice;
  const discount = input.discount;
  const rate = input.taxRate / 100;

  const base = qty * unit - discount;
  if (input.taxMode === "none" || input.taxRate <= 0) {
    const lineTotal = Math.max(0, base);
    return { lineTotal, taxAmount: 0, netBeforeTax: lineTotal };
  }

  if (input.taxMode === "exclusive") {
    const netBeforeTax = Math.max(0, base);
    const taxAmount = netBeforeTax * rate;
    return {
      lineTotal: Math.max(0, netBeforeTax + taxAmount),
      taxAmount,
      netBeforeTax,
    };
  }

  const lineTotal = Math.max(0, base);
  const netBeforeTax = lineTotal / (1 + rate);
  const taxAmount = lineTotal - netBeforeTax;
  return { lineTotal, taxAmount, netBeforeTax };
}

export function sumLineTotals(
  lines: { lineTotal: number; taxAmount: number; netBeforeTax: number }[],
) {
  return lines.reduce(
    (acc, l) => ({
      subtotal: acc.subtotal + l.netBeforeTax,
      taxTotal: acc.taxTotal + l.taxAmount,
      total: acc.total + l.lineTotal,
    }),
    { subtotal: 0, taxTotal: 0, total: 0 },
  );
}
