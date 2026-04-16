"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type SearchableOption = { id: string; label: string };

export function SearchableSelect({
  value,
  onChange,
  options,
  loading,
  disabled,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyLabel = "No matches",
}: {
  value: string;
  onChange: (id: string) => void;
  options: SearchableOption[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selected = useMemo(
    () => options.find((o) => o.id === value),
    [options, value],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(needle) ||
        o.id.toLowerCase().includes(needle),
    );
  }, [options, q]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQ("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || loading}
          className={cn(
            "h-9 w-full justify-between rounded-none font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          <span className="truncate text-left">
            {loading ? "Loading…" : selected?.label ?? placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] max-w-[min(100vw-2rem,24rem)] p-0"
      >
        <div className="border-b p-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 rounded-none text-xs"
            autoComplete="off"
          />
        </div>
        <ScrollArea className="h-60">
          <div className="p-1">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground px-2 py-3 text-xs">
                {emptyLabel}
              </p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={cn(
                    "hover:bg-muted/80 flex w-full rounded-none px-2 py-1.5 text-left text-xs",
                    o.id === value && "bg-muted",
                  )}
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                    setQ("");
                  }}
                >
                  <span className="line-clamp-2">{o.label}</span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
