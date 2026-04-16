"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import { SearchableSelect, type SearchableOption } from "./searchable-select";

export function ProductSelect({
  value,
  onChange,
  disabled,
  placeholder = "Select product",
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const q = useQuery({
    queryKey: ["products", "select"],
    queryFn: () =>
      apiFetch<Paginated<Record<string, unknown>>>(
        "/products?page=1&limit=100",
      ),
  });

  const options: SearchableOption[] = useMemo(() => {
    const items = q.data?.items ?? [];
    return items.map((p) => {
      const id = String(p.id ?? p._id ?? "");
      const label = `${String(p.sku ?? "—")} · ${String(p.name ?? "")}`;
      return { id, label };
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
      searchPlaceholder="Search by SKU or name…"
      emptyLabel="No products found"
    />
  );
}
