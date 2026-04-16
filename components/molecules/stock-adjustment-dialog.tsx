"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@phosphor-icons/react";
import { inventoryApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSelect } from "./product-select";

const schema = z
  .object({
    kind: z.enum(["stock_in", "stock_out", "adjust"]),
    productId: z.string().min(1),
    quantity: z.number().positive(),
    quantityDelta: z.number(),
    unitCost: z.number().min(0).optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "adjust" && data.quantityDelta === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a non-zero adjustment",
        path: ["quantityDelta"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export function StockAdjustmentDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: "stock_in",
      productId: "",
      quantity: 1,
      quantityDelta: 0,
      unitCost: undefined,
      notes: "",
    },
  });

  const kind = form.watch("kind");

  async function onSubmit(values: FormValues) {
    try {
      if (values.kind === "stock_in") {
        await inventoryApi.stockIn({
          productId: values.productId,
          quantity: values.quantity,
          unitCost: values.unitCost ?? undefined,
          notes: values.notes,
        });
        toast.success("Stock received");
      } else if (values.kind === "stock_out") {
        await inventoryApi.stockOut({
          productId: values.productId,
          quantity: values.quantity,
          notes: values.notes,
        });
        toast.success("Stock removed");
      } else {
        await inventoryApi.adjust({
          productId: values.productId,
          quantityDelta: values.quantityDelta,
          notes: values.notes,
        });
        toast.success("Stock adjusted");
      }
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      form.reset();
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Request failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" className="rounded-none gap-2">
            <PlusIcon className="size-4" weight="bold" />
            Stock movement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>Record stock movement</DialogTitle>
          <DialogDescription>
            Stock-in / stock-out / adjustment (requires inventory permissions).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="kind"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="stock_in">Stock in</SelectItem>
                      <SelectItem value="stock_out">Stock out</SelectItem>
                      <SelectItem value="adjust">Adjustment (+/−)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <ProductSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {kind === "adjust" ? (
              <FormField
                control={form.control}
                name="quantityDelta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity delta (+/−)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        className="rounded-none"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        className="rounded-none"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {kind === "stock_in" ? (
              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit cost (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        className="rounded-none"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-none"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving…" : "Apply"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
