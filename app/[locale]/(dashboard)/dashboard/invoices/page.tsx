"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddInvoiceButton } from "@/components/molecules/invoice-form-dialog";
import { InvoiceRowActions } from "@/components/molecules/invoice-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function InvoicesPage() {
  const t = useTranslations("dashboard.invoices");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["invoices"]}
      endpointPath="/invoices"
      headerActions={<AddInvoiceButton />}
      columns={[
        {
          id: "num",
          header: t("columns.number"),
          cell: (r) => String(r.invoiceNumber ?? tc("dash")),
        },
        {
          id: "status",
          header: t("columns.status"),
          cell: (r) => String(r.status ?? tc("dash")),
        },
        {
          id: "total",
          header: t("columns.total"),
          cell: (r) =>
            typeof r.total === "number"
              ? formatMoney(r.total, APP_CURRENCY)
              : tc("dash"),
        },
        {
          id: "due",
          header: t("columns.due"),
          cell: (r) => formatDate(r.dueDate),
        },
        {
          id: "actions",
          header: "",
          cell: (r) => <InvoiceRowActions row={r} />,
        },
      ]}
    />
  );
}
