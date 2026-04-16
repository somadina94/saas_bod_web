"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddCustomerButton } from "@/components/molecules/customer-form-dialog";
import { CustomerRowActions } from "@/components/molecules/customer-row-actions";
import { Button } from "@/components/ui/button";
import { APP_CURRENCY } from "@/lib/currency";
import { formatMoney } from "@/lib/format";
import { toast } from "sonner";

export default function CustomersPage() {
  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success("Customer ID copied");
  };

  return (
    <ResourceListPage
      title="Customers"
      description="Active CRM records with balances and contact details."
      queryKey={["customers"]}
      endpointPath="/customers"
      headerActions={<AddCustomerButton />}
      columns={[
        {
          id: "recordId",
          header: "ID",
          cell: (r) => {
            const id = String(r.id ?? "—");
            if (id === "—") return id;
            return (
              <div className="flex items-center gap-2">
                <span className="max-w-40 truncate">{id}</span>
                <Button size="xs" variant="outline" onClick={() => void copyId(id)}>
                  Copy
                </Button>
              </div>
            );
          },
        },
        {
          id: "name",
          header: "Name",
          cell: (r) => String(r.name ?? "—"),
        },
        {
          id: "email",
          header: "Email",
          cell: (r) => String(r.email ?? "—"),
        },
        {
          id: "phone",
          header: "Phone",
          cell: (r) => String(r.phone ?? "—"),
        },
        {
          id: "status",
          header: "Status",
          cell: (r) => String(r.status ?? "—"),
        },
        {
          id: "balance",
          header: "Balance",
          cell: (r) =>
            typeof r.balance === "number"
              ? formatMoney(r.balance, APP_CURRENCY)
              : "—",
        },
        {
          id: "documents",
          header: "Docs",
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
                View ({docs.length})
              </a>
            ) : (
              "—"
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
