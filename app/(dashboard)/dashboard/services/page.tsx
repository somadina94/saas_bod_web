"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddServiceButton } from "@/components/molecules/service-form-dialog";
import { ServiceRowActions } from "@/components/molecules/service-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatMoney } from "@/lib/format";

export default function ServicesPage() {
  return (
    <ResourceListPage
      title="Services"
      description="Billable services and recurring line items."
      queryKey={["services"]}
      endpointPath="/services"
      headerActions={<AddServiceButton />}
      columns={[
        {
          id: "name",
          header: "Name",
          cell: (r) => String(r.name ?? "—"),
        },
        {
          id: "code",
          header: "Code",
          cell: (r) => String(r.code ?? "—"),
        },
        {
          id: "price",
          header: "Price",
          cell: (r) =>
            typeof r.price === "number"
              ? formatMoney(r.price, APP_CURRENCY)
              : "—",
        },
        {
          id: "status",
          header: "Status",
          cell: (r) => String(r.status ?? "—"),
        },
        {
          id: "actions",
          header: "",
          cell: (r) => <ServiceRowActions row={r} />,
        },
      ]}
    />
  );
}
