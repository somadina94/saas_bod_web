"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddQuotationButton } from "@/components/molecules/quotation-form-dialog";
import { QuotationRowActions } from "@/components/molecules/quotation-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function QuotationsPage() {
  const t = useTranslations("dashboard.quotations");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["quotations"]}
      endpointPath="/quotations"
      headerActions={<AddQuotationButton />}
      columns={[
        {
          id: "num",
          header: t("columns.number"),
          cell: (r) => String(r.quotationNumber ?? tc("dash")),
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
          id: "issue",
          header: t("columns.issued"),
          cell: (r) => formatDate(r.issueDate),
        },
        {
          id: "actions",
          header: "",
          cell: (r) => <QuotationRowActions row={r} />,
        },
      ]}
    />
  );
}
