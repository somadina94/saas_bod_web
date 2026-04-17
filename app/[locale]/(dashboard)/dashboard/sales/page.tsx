"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { SaleFormDialog } from "@/components/molecules/sale-form-dialog";
import { SaleRowActions } from "@/components/molecules/sale-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function SalesPage() {
  const t = useTranslations("dashboard.sales");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["sales"]}
      endpointPath="/sales"
      headerActions={<SaleFormDialog />}
      columns={[
        {
          id: "num",
          header: t("columns.saleNum"),
          cell: (r) => String(r.saleNumber ?? tc("dash")),
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
          id: "created",
          header: t("columns.created"),
          cell: (r) => formatDate(r.createdAt),
        },
        {
          id: "actions",
          header: "",
          cell: (r) => <SaleRowActions row={r} />,
        },
      ]}
    />
  );
}
