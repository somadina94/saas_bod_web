"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { PaymentRecordDialog } from "@/components/molecules/payment-record-dialog";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function PaymentsPage() {
  return (
    <ResourceListPage
      title="Payments"
      description="Captured payments including Paystack flows."
      queryKey={["payments"]}
      endpointPath="/payments"
      headerActions={<PaymentRecordDialog />}
      columns={[
        {
          id: "num",
          header: "Number",
          cell: (r) => String(r.paymentNumber ?? "—"),
        },
        {
          id: "method",
          header: "Method",
          cell: (r) => String(r.method ?? "—"),
        },
        {
          id: "amount",
          header: "Amount",
          cell: (r) =>
            typeof r.amount === "number"
              ? formatMoney(r.amount, APP_CURRENCY)
              : "—",
        },
        {
          id: "status",
          header: "Status",
          cell: (r) => String(r.status ?? "—"),
        },
        {
          id: "created",
          header: "Recorded",
          cell: (r) => formatDate(r.createdAt),
        },
      ]}
    />
  );
}
