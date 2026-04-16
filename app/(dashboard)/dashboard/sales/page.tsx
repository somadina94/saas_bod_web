"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { SaleFormDialog } from "@/components/molecules/sale-form-dialog";
import { SaleRowActions } from "@/components/molecules/sale-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function SalesPage() {
  return (
    <ResourceListPage
      title="Sales"
      description="Completed and in-progress sales orders."
      queryKey={["sales"]}
      endpointPath="/sales"
      headerActions={<SaleFormDialog />}
      columns={[
        {
          id: "num",
          header: "Sale #",
          cell: (r) => String(r.saleNumber ?? "—"),
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
          cell: (r) => <SaleRowActions row={r} />,
        },
      ]}
    />
  );
}
