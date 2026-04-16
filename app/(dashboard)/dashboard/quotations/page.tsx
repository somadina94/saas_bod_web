"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddQuotationButton } from "@/components/molecules/quotation-form-dialog";
import { QuotationRowActions } from "@/components/molecules/quotation-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function QuotationsPage() {
  return (
    <ResourceListPage
      title="Quotations"
      description="Sales quotes before they convert to invoices."
      queryKey={["quotations"]}
      endpointPath="/quotations"
      headerActions={<AddQuotationButton />}
      columns={[
        {
          id: "num",
          header: "Number",
          cell: (r) => String(r.quotationNumber ?? "—"),
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
          id: "issue",
          header: "Issued",
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
