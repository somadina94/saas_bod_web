"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { ExpenseFormDialog } from "@/components/molecules/expense-form-dialog";
import { ExpenseRowActions } from "@/components/molecules/expense-row-actions";
import { Button } from "@/components/ui/button";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";
import { toast } from "sonner";

export default function ExpensesPage() {
  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success("Expense ID copied");
  };

  return (
    <ResourceListPage
      title="Expenses"
      description="Spend tracking with approvals where configured."
      queryKey={["expenses"]}
      endpointPath="/expenses"
      headerActions={<ExpenseFormDialog />}
      columns={[
        {
          id: "recordId",
          header: "ID",
          cell: (r) => {
            const id = String(r.id ?? "—");
            if (id === "—") return id;
            return (
              <div className="flex items-center gap-2">
                <span className="max-w-40 truncate">{id}</span>
                <Button size="xs" variant="outline" onClick={() => void copyId(id)}>
                  Copy
                </Button>
              </div>
            );
          },
        },
        {
          id: "title",
          header: "Title",
          cell: (r) => String(r.title ?? "—"),
        },
        {
          id: "amount",
          header: "Amount",
          cell: (r) =>
            typeof r.amount === "number"
              ? formatMoney(r.amount, APP_CURRENCY)
              : "—",
        },
        {
          id: "status",
          header: "Status",
          cell: (r) => String(r.status ?? "—"),
        },
        {
          id: "date",
          header: "Date",
          cell: (r) => formatDate(r.expenseDate),
        },
        {
          id: "receipt",
          header: "Receipt",
          cell: (r) =>
            typeof r.attachmentUrl === "string" && r.attachmentUrl ? (
              <a
                href={r.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                View
              </a>
            ) : (
              "—"
            ),
        },
        {
          id: "actions",
          header: "",
          cell: (r) => <ExpenseRowActions row={r} />,
        },
      ]}
    />
  );
}
