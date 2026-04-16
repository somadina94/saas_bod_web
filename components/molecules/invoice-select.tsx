"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InvoiceSelect({
  customerId,
  value,
  onChange,
  disabled,
}: {
  customerId: string;
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const q = useQuery({
    queryKey: ["invoices", "for-payment", customerId],
    queryFn: () =>
      apiFetch<Paginated<Record<string, unknown>>>(
        `/invoices?customerId=${encodeURIComponent(customerId)}&page=1&limit=100`,
      ),
    enabled: !!customerId,
  });

  const items = (q.data?.items ?? []).filter((inv) => {
    const bal = inv.balance;
    const st = String(inv.status ?? "");
    return (
      typeof bal === "number" &&
      bal > 0 &&
      st !== "void" &&
      st !== "cancelled" &&
      st !== "draft"
    );
  });

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || q.isLoading || !customerId}
    >
      <SelectTrigger className="rounded-none w-full">
        <SelectValue
          placeholder={
            !customerId
              ? "Pick customer first"
              : q.isLoading
                ? "Loading…"
                : "Select open invoice"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {items.map((inv) => {
          const id = String(inv.id ?? inv._id ?? "");
          const num = String(inv.invoiceNumber ?? id);
          const bal =
            typeof inv.balance === "number" ? inv.balance.toFixed(2) : "—";
          return (
            <SelectItem key={id} value={id}>
              {num} · balance {bal}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
