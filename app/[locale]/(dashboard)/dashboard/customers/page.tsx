"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddCustomerButton } from "@/components/molecules/customer-form-dialog";
import { CustomerRowActions } from "@/components/molecules/customer-row-actions";
import { Button } from "@/components/ui/button";
import { APP_CURRENCY } from "@/lib/currency";
import { formatMoney } from "@/lib/format";
import { toast } from "sonner";

export default function CustomersPage() {
  const t = useTranslations("dashboard.customers");
  const tc = useTranslations("common");

  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success(t("toastCopied"));
  };

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["customers"]}
      endpointPath="/customers"
      headerActions={<AddCustomerButton />}
      columns={[
        {
          id: "recordId",
          header: t("columns.id"),
          cell: (r) => {
            const id = String(r.id ?? tc("dash"));
            if (id === tc("dash")) return id;
            return (
              <div className="flex items-center gap-2">
                <span className="max-w-40 truncate">{id}</span>
                <Button size="xs" variant="outline" onClick={() => void copyId(id)}>
                  {tc("copy")}
                </Button>
              </div>
            );
          },
        },
        {
          id: "name",
          header: t("columns.name"),
          cell: (r) => String(r.name ?? tc("dash")),
        },
        {
          id: "email",
          header: t("columns.email"),
          cell: (r) => String(r.email ?? tc("dash")),
        },
        {
          id: "phone",
          header: t("columns.phone"),
          cell: (r) => String(r.phone ?? tc("dash")),
        },
        {
          id: "status",
          header: t("columns.status"),
          cell: (r) => String(r.status ?? tc("dash")),
        },
        {
          id: "balance",
          header: t("columns.balance"),
          cell: (r) =>
            typeof r.balance === "number"
              ? formatMoney(r.balance, APP_CURRENCY)
              : tc("dash"),
        },
        {
          id: "documents",
          header: t("columns.docs"),
          cell: (r) => {
            const docs = Array.isArray(r.documents) ? r.documents : [];
            const first = docs.find(
              (d): d is { url: string } =>
                typeof d === "object" &&
                d !== null &&
                "url" in d &&
                typeof (d as { url?: unknown }).url === "string",
            );
            return first?.url ? (
              <a
                href={first.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                {tc("view", { count: docs.length })}
              </a>
            ) : (
              tc("dash")
            );
          },
        },
        {
          id: "actions",
          header: "",
          cell: (r) => <CustomerRowActions row={r} />,
        },
      ]}
    />
  );
}
