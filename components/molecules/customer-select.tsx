"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import { SearchableSelect, type SearchableOption } from "./searchable-select";

export function CustomerSelect({
  value,
  onChange,
  disabled,
  placeholder = "Select customer",
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const q = useQuery({
    queryKey: ["customers", "select"],
    queryFn: () =>
      apiFetch<Paginated<Record<string, unknown>>>(
        "/customers?page=1&limit=100",
      ),
  });

  const options: SearchableOption[] = useMemo(() => {
    const items = q.data?.items ?? [];
    return items.map((c) => {
      const id = String(c.id ?? c._id ?? "");
      const label = `${String(c.name ?? "—")}${c.email ? ` (${String(c.email)})` : ""}`;
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
      searchPlaceholder="Search customers…"
      emptyLabel="No customers found"
    />
  );
}
