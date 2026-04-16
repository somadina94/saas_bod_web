import { computeLineAmounts, sumLineTotals } from "./pricing";
import type { LineTaxMode } from "./line-types";

export type PoLineForm = {
  productId: string;
  description: string;
  quantityOrdered: number;
  unitCost: number;
  taxRate: number;
  taxMode: LineTaxMode;
};

export function buildPurchaseOrderPayload(lines: PoLineForm[]) {
  const parts = lines.map((line) =>
    computeLineAmounts({
      quantity: line.quantityOrdered,
      unitPrice: line.unitCost,
      discount: 0,
      taxRate: line.taxRate,
      taxMode: line.taxMode,
    }),
  );
  const totals = sumLineTotals(parts);
  const items = lines.map((line, i) => ({
    productId: line.productId,
    description: line.description || "Item",
    quantityOrdered: line.quantityOrdered,
    quantityReceived: 0,
    unitCost: line.unitCost,
    taxRate: line.taxRate,
    taxMode: line.taxMode,
    lineTotal: parts[i].lineTotal,
  }));
  return {
    items,
    subtotal: totals.subtotal,
    taxTotal: totals.taxTotal,
    total: totals.total,
  };
}
