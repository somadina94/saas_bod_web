"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import { APP_CURRENCY } from "@/lib/currency";
import { formatDate, formatMoney } from "@/lib/format";
import { SearchableSelect, type SearchableOption } from "./searchable-select";

export function ExpenseSelect({
  value,
  onChange,
  disabled,
  placeholder = "Select expense",
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const q = useQuery({
    queryKey: ["expenses", "select"],
    queryFn: () =>
      apiFetch<Paginated<Record<string, unknown>>>(
        "/expenses?page=1&limit=100",
      ),
  });

  const options: SearchableOption[] = useMemo(() => {
    const items = q.data?.items ?? [];
    return items.map((e) => {
      const id = String(e.id ?? e._id ?? "");
      const title = String(e.title ?? "—");
      const amt =
        typeof e.amount === "number"
          ? formatMoney(e.amount, APP_CURRENCY)
          : "—";
      const d = formatDate(e.expenseDate);
      const st = String(e.status ?? "");
      return {
        id,
        label: `${title} · ${amt} · ${d}${st ? ` · ${st}` : ""}`,
      };
    });
  }, [q.data?.items]);

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      loading={q.isLoading}
      disabled={disabled}
      placeholder={placeholder}
      searchPlaceholder="Search by title, amount, status…"
      emptyLabel="No expenses found"
    />
  );
}
