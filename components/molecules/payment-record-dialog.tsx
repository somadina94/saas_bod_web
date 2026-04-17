"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@phosphor-icons/react";
import { paymentsApi } from "@/lib/api/entities";
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
import { CustomerSelect } from "./customer-select";
import { InvoiceSelect } from "./invoice-select";

const schema = z.object({
  customerId: z.string().min(1),
  invoiceId: z.string().optional(),
  amount: z
    .string()
    .min(1)
    .refine((s) => !Number.isNaN(Number(s)) && Number(s) > 0, "Invalid amount"),
  currency: z.string().min(1),
  method: z.enum(["cash", "bank_transfer", "card", "other"]),
  reference: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PaymentRecordDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const tc = useTranslations("common");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: "",
      invoiceId: "",
      amount: "",
      currency: "NGN",
      method: "cash",
      reference: "",
    },
  });

  const customerId = form.watch("customerId");

  async function onSubmit(values: FormValues) {
    try {
      const allocations = values.invoiceId
        ? [{ invoiceId: values.invoiceId, amount: values.amount }]
        : [];
      await paymentsApi.record({
        customerId: values.customerId,
        amount: Number(values.amount),
        currency: values.currency,
        method: values.method,
        reference: values.reference || undefined,
        allocations,
      });
      toast.success("Payment recorded");
      await qc.invalidateQueries({ queryKey: ["payments"] });
      await qc.invalidateQueries({ queryKey: ["invoices"] });
      await qc.invalidateQueries({ queryKey: ["customers"] });
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
            {tc("actionCreate")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>{tc("actionCreate")}</DialogTitle>
          <DialogDescription>
            Allocates to one invoice when selected; otherwise posts to customer
            balance handling per server rules.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <CustomerSelect
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
              name="invoiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apply to invoice (optional)</FormLabel>
                  <FormControl>
                    <InvoiceSelect
                      customerId={customerId}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        className="rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-none w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">cash</SelectItem>
                      <SelectItem value="bank_transfer">bank_transfer</SelectItem>
                      <SelectItem value="card">card</SelectItem>
                      <SelectItem value="other">other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference (optional)</FormLabel>
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
                {tc("actionCancel")}
              </Button>
              <Button
                type="submit"
                className="rounded-none"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? tc("actionSaving") : "Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
