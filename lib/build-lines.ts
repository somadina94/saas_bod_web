import { computeLineAmounts } from "./pricing";
import type { LineItemFormRow } from "@/components/molecules/line-items-editor";
import type { LineTaxMode } from "./line-types";

/** Builds API payload lines for quotations / invoices / sales. */
export function buildDocumentLines(rows: LineItemFormRow[]) {
  return rows.map((row) => {
    const { lineTotal } = computeLineAmounts({
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      discount: row.discount,
      taxRate: row.taxRate,
      taxMode: row.taxMode as LineTaxMode,
    });
    return {
      description: row.description || "Line item",
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      taxRate: row.taxRate,
      taxMode: row.taxMode,
      discount: row.discount,
      lineTotal,
    };
  });
}
