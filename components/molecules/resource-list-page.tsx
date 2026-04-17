"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { Paginated } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionDenied } from "./permission-denied";

export type ColumnDef = {
  id: string;
  header: string;
  cell: (row: Record<string, unknown>) => React.ReactNode;
};

function rowKey(row: Record<string, unknown>, index: number) {
  const id = row.id ?? row._id;
  if (id != null) return String(id);
  return `row-${index}`;
}

export function ResourceListPage({
  title,
  description,
  queryKey,
  endpointPath,
  columns,
  pageSize = 15,
  headerActions,
  rowActions,
}: {
  title: string;
  description?: string;
  queryKey: string[];
  /** e.g. `/customers` (no query string) */
  endpointPath: string;
  columns: ColumnDef[];
  pageSize?: number;
  /** e.g. primary buttons shown next to the title */
  headerActions?: ReactNode;
  /** When set, an Actions column is appended (e.g. row menus). */
  rowActions?: (row: Record<string, unknown>) => ReactNode;
}) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: [...queryKey, page],
    queryFn: () =>
      apiFetch<Paginated<Record<string, unknown>>>(
        `${endpointPath}?page=${page}&limit=${pageSize}`,
      ),
  });

  const rows = query.data?.items ?? [];
  const pagination = query.data?.pagination;

  const canPrev = useMemo(
    () => pagination && pagination.page > 1,
    [pagination],
  );
  const canNext = useMemo(
    () => pagination && pagination.page < pagination.totalPages,
    [pagination],
  );

  if (query.error instanceof ApiError && query.error.status === 403) {
    return <PermissionDenied />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
              {description}
            </p>
          ) : null}
        </div>
        {headerActions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {headerActions}
          </div>
        ) : null}
      </div>

      <div className="border-border bg-card overflow-hidden rounded-none border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.id}>{c.header}</TableHead>
              ))}
              {rowActions ? (
                <TableHead className="w-[4rem] text-right">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {columns.map((c) => (
                    <TableCell key={c.id}>
                      <Skeleton className="h-4 w-full max-w-[12rem]" />
                    </TableCell>
                  ))}
                  {rowActions ? (
                    <TableCell>
                      <Skeleton className="ml-auto h-8 w-8" />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="text-muted-foreground py-12 text-center text-sm"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={rowKey(row, i)}>
                  {columns.map((c) => (
                    <TableCell key={c.id} className="max-w-[20rem] truncate">
                      {c.cell(row)}
                    </TableCell>
                  ))}
                  {rowActions ? (
                    <TableCell className="text-right">{rowActions(row)}</TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total}{" "}
            total
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none"
              disabled={!canPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <CaretLeftIcon className="size-4" aria-hidden />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-none"
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <CaretRightIcon className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
