"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddServiceButton } from "@/components/molecules/service-form-dialog";
import { ServiceRowActions } from "@/components/molecules/service-row-actions";
import { APP_CURRENCY } from "@/lib/currency";
import { formatMoney } from "@/lib/format";

export default function ServicesPage() {
  const t = useTranslations("dashboard.services");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["services"]}
      endpointPath="/services"
      headerActions={<AddServiceButton />}
      columns={[
        {
          id: "name",
          header: t("columns.name"),
          cell: (r) => String(r.name ?? tc("dash")),
        },
        {
          id: "code",
          header: t("columns.code"),
          cell: (r) => String(r.code ?? tc("dash")),
        },
        {
          id: "price",
          header: t("columns.price"),
          cell: (r) =>
            typeof r.price === "number"
              ? formatMoney(r.price, APP_CURRENCY)
              : tc("dash"),
        },
        {
          id: "status",
          header: t("columns.status"),
          cell: (r) => String(r.status ?? tc("dash")),
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
