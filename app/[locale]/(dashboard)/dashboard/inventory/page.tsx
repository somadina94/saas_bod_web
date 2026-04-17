"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api/client";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { StockAdjustmentDialog } from "@/components/molecules/stock-adjustment-dialog";
import { useAppSelector } from "@/lib/store/hooks";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function InventoryToolbar() {
  const canAdjust = useAppSelector(
    (s) =>
      s.auth.user?.isOwner ||
      s.auth.user?.permissions?.canAdjustStock === true,
  );
  if (!canAdjust) return null;
  return <StockAdjustmentDialog />;
}

export default function InventoryPage() {
  const t = useTranslations("dashboard.inventory");
  const tc = useTranslations("common");

  const low = useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: () => apiFetch<Record<string, unknown>[]>("/inventory/low-stock"),
  });

  return (
    <div className="flex flex-1 flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="border-destructive/30 rounded-none">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <WarningCircleIcon className="text-destructive size-6" aria-hidden />
            <CardTitle className="text-base">{t("lowStockTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {low.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : low.data && low.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("lowStockProduct")}</TableHead>
                    <TableHead>{t("lowStockOnHand")}</TableHead>
                    <TableHead>{t("lowStockReorder")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {low.data.map((p, i) => (
                    <TableRow key={String(p._id ?? p.id ?? i)}>
                      <TableCell>{String(p.name ?? tc("dash"))}</TableCell>
                      <TableCell>{String(p.stockOnHand ?? tc("dash"))}</TableCell>
                      <TableCell>{String(p.reorderLevel ?? tc("dash"))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">{t("lowStockAllOk")}</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ResourceListPage
        title={t("title")}
        description={t("description")}
        queryKey={["inventory", "movements"]}
        endpointPath="/inventory/movements"
        headerActions={<InventoryToolbar />}
        columns={[
          {
            id: "type",
            header: t("columns.type"),
            cell: (r) => String(r.type ?? tc("dash")),
          },
          {
            id: "qty",
            header: t("columns.qty"),
            cell: (r) => String(r.quantity ?? tc("dash")),
          },
          {
            id: "product",
            header: t("columns.productId"),
            cell: (r) => String(r.productId ?? tc("dash")),
          },
          {
            id: "when",
            header: t("columns.when"),
            cell: (r) => formatDate(r.createdAt),
          },
        ]}
      />
    </div>
  );
}
