"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@phosphor-icons/react";
import { quotationsApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { buildDocumentLines } from "@/lib/build-lines";
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
import { CustomerSelect } from "./customer-select";
import {
  LineItemsEditor,
  defaultLineItems,
  type LineItemFormRow,
} from "./line-items-editor";

const schema = z.object({
  customerId: z.string().min(1, "Pick a customer"),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function mapItemsFromApi(raw: unknown): LineItemFormRow[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaultLineItems();
  return raw.map((line: Record<string, unknown>) => ({
    description: String(line.description ?? ""),
    quantity: typeof line.quantity === "number" ? line.quantity : 1,
    unitPrice: typeof line.unitPrice === "number" ? line.unitPrice : 0,
    taxRate: typeof line.taxRate === "number" ? line.taxRate : 0,
    taxMode: (line.taxMode as LineItemFormRow["taxMode"]) ?? "exclusive",
    discount: typeof line.discount === "number" ? line.discount : 0,
  }));
}

export function QuotationFormDialog({
  mode,
  quotationId,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: {
  mode: "create" | "edit";
  quotationId?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const tc = useTranslations("common");
  const t = useTranslations("dashboard.quotations");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const [lines, setLines] = useState<LineItemFormRow[]>(defaultLineItems());
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customerId: "", validUntil: "", notes: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      form.reset({ customerId: "", validUntil: "", notes: "" });
      setLines(defaultLineItems());
      return;
    }
    if (!quotationId) return;
    let cancelled = false;
    setLoading(true);
    void quotationsApi
      .get(quotationId)
      .then((q) => {
        if (cancelled) return;
        form.reset({
          customerId: String(q.customerId ?? ""),
          validUntil: q.validUntil
            ? String(q.validUntil).slice(0, 10)
            : "",
          notes: q.notes != null ? String(q.notes) : "",
        });
        setLines(mapItemsFromApi(q.items));
      })
      .catch(() => toast.error("Could not load quotation"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, mode, quotationId, form]);

  async function onSubmit(values: FormValues) {
    try {
      const items = buildDocumentLines(lines);
      if (mode === "create") {
        await quotationsApi.create({
          customerId: values.customerId,
          items,
          validUntil: values.validUntil || undefined,
          notes: values.notes || undefined,
        });
        toast.success("Quotation created");
      } else if (quotationId) {
        await quotationsApi.patch(quotationId, {
          items,
          validUntil: values.validUntil || undefined,
          notes: values.notes || undefined,
        });
        toast.success("Quotation updated");
      }
      await qc.invalidateQueries({ queryKey: ["quotations"] });
      setOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Request failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl rounded-none">
        <DialogHeader>
          <DialogTitle>
            {`${mode === "create" ? tc("actionCreate") : tc("actionEdit")} ${t("title")}`}
          </DialogTitle>
          <DialogDescription>
            Line totals are recalculated on the server.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{useTranslations("dashboard.customers")("title")}</FormLabel>
                    <FormControl>
                      <CustomerSelect
                        value={field.value}
                        onChange={field.onChange}
                        disabled={mode === "edit"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid until (optional)</FormLabel>
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
                    <FormLabel>{tc("menuTitle")}</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LineItemsEditor lines={lines} onChange={setLines} />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none"
                  onClick={() => setOpen(false)}
                >
                  {tc("actionCancel")}
                </Button>
                <Button
                  type="submit"
                  className="rounded-none"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? tc("actionSaving") : tc("actionSave")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AddQuotationButton() {
  const tc = useTranslations("common");
  const t = useTranslations("dashboard.quotations");
  return (
    <QuotationFormDialog
      mode="create"
      trigger={
        <Button type="button" className="rounded-none gap-2">
          <PlusIcon className="size-4" weight="bold" />
          {tc("actionCreate")}
        </Button>
      }
    />
  );
}
