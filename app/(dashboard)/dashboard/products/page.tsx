"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddProductButton } from "@/components/molecules/product-form-dialog";
import { ProductRowActions } from "@/components/molecules/product-row-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductsPage() {
  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success("Product ID copied");
  };

  return (
    <ResourceListPage
      title="Products"
      description="Catalog items with stock and SKU visibility."
      queryKey={["products"]}
      endpointPath="/products"
      headerActions={<AddProductButton />}
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
          id: "sku",
          header: "SKU",
          cell: (r) => String(r.sku ?? "—"),
        },
        {
          id: "stock",
          header: "On hand",
          cell: (r) => String(r.stockOnHand ?? "—"),
        },
        {
          id: "status",
          header: "Status",
          cell: (r) => String(r.status ?? "—"),
        },
        {
          id: "image",
          header: "Image",
          cell: (r) => {
            const first =
              Array.isArray(r.imageUrls) && typeof r.imageUrls[0] === "string"
                ? r.imageUrls[0]
                : null;
            return first ? (
              <a
                href={first}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                View
              </a>
            ) : (
              "—"
            );
          },
        },
        {
          id: "actions",
          header: "",
          cell: (r) => <ProductRowActions row={r} />,
        },
      ]}
    />
  );
}
