"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import { SearchableSelect, type SearchableOption } from "./searchable-select";

export function SupplierSelect({
  value,
  onChange,
  disabled,
  placeholder = "Select supplier",
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const q = useQuery({
    queryKey: ["suppliers", "select"],
    queryFn: () =>
      apiFetch<Paginated<Record<string, unknown>>>(
        "/suppliers?page=1&limit=100",
      ),
  });

  const options: SearchableOption[] = useMemo(() => {
    const items = q.data?.items ?? [];
    return items.map((s) => {
      const id = String(s.id ?? s._id ?? "");
      const label = String(s.name ?? "—");
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
      searchPlaceholder="Search suppliers…"
      emptyLabel="No suppliers found"
    />
  );
}
