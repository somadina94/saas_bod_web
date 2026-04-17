"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { ExpenseFormDialog } from "@/components/molecules/expense-form-dialog";
import { ExpenseRowActions } from "@/components/molecules/expense-row-actions";
import { Button } from "@/components/ui/button";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";
import { toast } from "sonner";

export default function ExpensesPage() {
  const t = useTranslations("dashboard.expenses");
  const tc = useTranslations("common");

  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success(t("toastCopied"));
  };

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["expenses"]}
      endpointPath="/expenses"
      headerActions={<ExpenseFormDialog />}
      columns={[
        {
          id: "recordId",
          header: t("columns.id"),
          cell: (r) => {
            const id = String(r.id ?? tc("dash"));
            if (id === tc("dash")) return id;
            return (
              <div className="flex items-center gap-2">
                <span className="max-w-40 truncate">{id}</span>
                <Button size="xs" variant="outline" onClick={() => void copyId(id)}>
                  {tc("copy")}
                </Button>
              </div>
            );
          },
        },
        {
          id: "title",
          header: t("columns.title"),
          cell: (r) => String(r.title ?? tc("dash")),
        },
        {
          id: "amount",
          header: t("columns.amount"),
          cell: (r) =>
            typeof r.amount === "number"
              ? formatMoney(r.amount, APP_CURRENCY)
              : tc("dash"),
        },
        {
          id: "status",
          header: t("columns.status"),
          cell: (r) => String(r.status ?? tc("dash")),
        },
        {
          id: "date",
          header: t("columns.date"),
          cell: (r) => formatDate(r.expenseDate),
        },
        {
          id: "receipt",
          header: t("columns.receipt"),
          cell: (r) =>
            typeof r.attachmentUrl === "string" && r.attachmentUrl ? (
              <a
                href={r.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                {t("columns.view")}
              </a>
            ) : (
              tc("dash")
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
