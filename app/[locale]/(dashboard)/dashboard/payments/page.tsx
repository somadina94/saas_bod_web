"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { PaymentRecordDialog } from "@/components/molecules/payment-record-dialog";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";

export default function PaymentsPage() {
  const t = useTranslations("dashboard.payments");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["payments"]}
      endpointPath="/payments"
      headerActions={<PaymentRecordDialog />}
      columns={[
        {
          id: "num",
          header: t("columns.number"),
          cell: (r) => String(r.paymentNumber ?? tc("dash")),
        },
        {
          id: "method",
          header: t("columns.method"),
          cell: (r) => String(r.method ?? tc("dash")),
        },
        {
          id: "amount",
          header: t("columns.amount"),
          cell: (r) =>
            typeof r.amount === "number"
              ? formatMoney(r.amount, APP_CURRENCY)
              : tc("dash"),
        },
        {
          id: "status",
          header: t("columns.status"),
          cell: (r) => String(r.status ?? tc("dash")),
        },
        {
          id: "created",
          header: t("columns.recorded"),
          cell: (r) => formatDate(r.createdAt),
        },
      ]}
    />
  );
}
