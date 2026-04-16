"use client";

import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSelect } from "./product-select";
import type { LineTaxMode } from "@/lib/line-types";

export type PoLineForm = {
  productId: string;
  description: string;
  quantityOrdered: number;
  unitCost: number;
  taxRate: number;
  taxMode: LineTaxMode;
};

const emptyLine = (): PoLineForm => ({
  productId: "",
  description: "",
  quantityOrdered: 1,
  unitCost: 0,
  taxRate: 0,
  taxMode: "exclusive",
});

export function defaultPoLines(): PoLineForm[] {
  return [emptyLine()];
}

export function PoLinesEditor({
  lines,
  onChange,
}: {
  lines: PoLineForm[];
  onChange: (next: PoLineForm[]) => void;
}) {
  function update(i: number, patch: Partial<PoLineForm>) {
    const next = [...lines];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>PO lines</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-none gap-1"
          onClick={() => onChange([...lines, emptyLine()])}
        >
          <PlusIcon className="size-4" />
          Add line
        </Button>
      </div>
      {lines.map((line, i) => (
        <div
          key={i}
          className="border-border grid gap-2 border p-3 sm:grid-cols-2 lg:grid-cols-6"
        >
          <div className="lg:col-span-2">
            <Label className="text-[11px]">Product</Label>
            <div className="mt-1">
              <ProductSelect
                value={line.productId}
                onChange={(id) => update(i, { productId: id })}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <Label className="text-[11px]">Description</Label>
            <Input
              className="rounded-none mt-1"
              value={line.description}
              onChange={(e) => update(i, { description: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-[11px]">Qty</Label>
            <Input
              type="number"
              min={0}
              step="any"
              className="rounded-none mt-1"
              value={line.quantityOrdered}
              onChange={(e) =>
                update(i, { quantityOrdered: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label className="text-[11px]">Unit cost</Label>
            <Input
              type="number"
              min={0}
              step="any"
              className="rounded-none mt-1"
              value={line.unitCost}
              onChange={(e) =>
                update(i, { unitCost: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label className="text-[11px]">Tax %</Label>
            <Input
              type="number"
              min={0}
              step="any"
              className="rounded-none mt-1"
              value={line.taxRate}
              onChange={(e) =>
                update(i, { taxRate: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label className="text-[11px]">Tax mode</Label>
            <Select
              value={line.taxMode}
              onValueChange={(v) => update(i, { taxMode: v as LineTaxMode })}
            >
              <SelectTrigger className="rounded-none mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exclusive">exclusive</SelectItem>
                <SelectItem value="inclusive">inclusive</SelectItem>
                <SelectItem value="none">none</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end justify-end lg:col-span-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-none text-destructive"
              onClick={() => onChange(lines.filter((_, j) => j !== i))}
              disabled={lines.length <= 1}
            >
              <TrashIcon className="size-4" />
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
