"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { PurchaseOrderFormDialog } from "@/components/molecules/po-form-dialog";
import { PurchaseOrderRowActions } from "@/components/molecules/po-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function PurchaseOrdersPage() {
  const t = useTranslations("dashboard.purchaseOrders");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["purchase-orders"]}
      endpointPath="/purchase-orders"
      headerActions={<PurchaseOrderFormDialog />}
      columns={[
        {
          id: "num",
          header: t("columns.poNum"),
          cell: (r) => String(r.poNumber ?? tc("dash")),
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
          cell: (r) => <PurchaseOrderRowActions row={r} />,
        },
      ]}
    />
  );
}
