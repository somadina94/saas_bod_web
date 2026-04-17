"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { AddProductButton } from "@/components/molecules/product-form-dialog";
import { ProductRowActions } from "@/components/molecules/product-row-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductsPage() {
  const t = useTranslations("dashboard.products");
  const tc = useTranslations("common");

  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success(t("toastCopied"));
  };

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["products"]}
      endpointPath="/products"
      headerActions={<AddProductButton />}
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
          id: "sku",
          header: t("columns.sku"),
          cell: (r) => String(r.sku ?? tc("dash")),
        },
        {
          id: "stock",
          header: t("columns.onHand"),
          cell: (r) => String(r.stockOnHand ?? tc("dash")),
        },
        {
          id: "status",
          header: t("columns.status"),
          cell: (r) => String(r.status ?? tc("dash")),
        },
        {
          id: "image",
          header: t("columns.image"),
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
                {t("columns.preview")}
              </a>
            ) : (
              tc("dash")
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
