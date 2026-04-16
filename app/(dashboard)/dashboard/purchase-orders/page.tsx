"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { PurchaseOrderFormDialog } from "@/components/molecules/po-form-dialog";
import { PurchaseOrderRowActions } from "@/components/molecules/po-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function PurchaseOrdersPage() {
  return (
    <ResourceListPage
      title="Purchase orders"
      description="Procurement lifecycle tied to suppliers."
      queryKey={["purchase-orders"]}
      endpointPath="/purchase-orders"
      headerActions={<PurchaseOrderFormDialog />}
      columns={[
        {
          id: "num",
          header: "PO #",
          cell: (r) => String(r.poNumber ?? "—"),
        },
        {
          id: "status",
          header: "Status",
          cell: (r) => String(r.status ?? "—"),
        },
        {
          id: "total",
          header: "Total",
          cell: (r) =>
            typeof r.total === "number"
              ? formatMoney(r.total, APP_CURRENCY)
              : "—",
        },
        {
          id: "created",
          header: "Created",
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
