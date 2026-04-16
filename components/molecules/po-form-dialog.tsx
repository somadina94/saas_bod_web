"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@phosphor-icons/react";
import { purchaseOrdersApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { buildPurchaseOrderPayload } from "@/lib/po-lines";
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
import { SupplierSelect } from "./supplier-select";
import { PoLinesEditor, defaultPoLines, type PoLineForm } from "./po-lines-editor";

const schema = z.object({
  supplierId: z.string().min(1),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PurchaseOrderFormDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<PoLineForm[]>(defaultPoLines());

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { supplierId: "", expectedDate: "", notes: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const validLines = lines.filter((l) => l.productId);
      if (validLines.length === 0) {
        toast.error("Add at least one line with a product");
        return;
      }
      const payload = buildPurchaseOrderPayload(validLines);
      await purchaseOrdersApi.create({
        supplierId: values.supplierId,
        status: "draft",
        expectedDate: values.expectedDate || undefined,
        notes: values.notes || undefined,
        ...payload,
      });
      toast.success("Purchase order created");
      await qc.invalidateQueries({ queryKey: ["purchase-orders"] });
      setOpen(false);
      form.reset();
      setLines(defaultPoLines());
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
            New purchase order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl rounded-none">
        <DialogHeader>
          <DialogTitle>New purchase order</DialogTitle>
          <DialogDescription>
            Creates a draft PO — approve and receive from the list.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <SupplierSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected date (optional)</FormLabel>
                  <FormControl>
                    <Input type="date" className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <PoLinesEditor lines={lines} onChange={setLines} />
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
                {form.formState.isSubmitting ? "Saving…" : "Create draft"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
