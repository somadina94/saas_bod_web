"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddInvoiceButton } from "@/components/molecules/invoice-form-dialog";
import { InvoiceRowActions } from "@/components/molecules/invoice-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function InvoicesPage() {
  return (
    <ResourceListPage
      title="Invoices"
      description="Accounts receivable with balances and statuses."
      queryKey={["invoices"]}
      endpointPath="/invoices"
      headerActions={<AddInvoiceButton />}
      columns={[
        {
          id: "num",
          header: "Number",
          cell: (r) => String(r.invoiceNumber ?? "—"),
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
          id: "due",
          header: "Due",
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
