"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@phosphor-icons/react";
import { salesApi } from "@/lib/api/entities";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z
  .object({
    party: z.enum(["customer", "walkin"]),
    customerId: z.string().optional(),
    walkInCustomerName: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.party === "customer" && !data.customerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a customer",
        path: ["customerId"],
      });
    }
    if (data.party === "walkin" && !data.walkInCustomerName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter walk-in name",
        path: ["walkInCustomerName"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export function SaleFormDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const tc = useTranslations("common");
  const [lines, setLines] = useState<LineItemFormRow[]>(defaultLineItems());

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      party: "customer",
      customerId: "",
      walkInCustomerName: "",
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const items = buildDocumentLines(lines);
      await salesApi.create({
        customerId:
          values.party === "customer" ? values.customerId : undefined,
        walkInCustomerName:
          values.party === "walkin" ? values.walkInCustomerName : undefined,
        items,
        notes: values.notes || undefined,
      });
      toast.success("Sale created (draft)");
      await qc.invalidateQueries({ queryKey: ["sales"] });
      setOpen(false);
      form.reset();
      setLines(defaultLineItems());
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Request failed");
    }
  }

  const party = form.watch("party");

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
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl rounded-none">
        <DialogHeader>
          <DialogTitle>{tc("actionCreate")}</DialogTitle>
          <DialogDescription>
            Creates a draft sale — complete it from the list to deduct stock.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Customer type</Label>
              <FormField
                control={form.control}
                name="party"
                render={({ field }) => (
                  <FormItem>
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
                        <SelectItem value="customer">Existing customer</SelectItem>
                        <SelectItem value="walkin">Walk-in</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {party === "customer" ? (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <CustomerSelect
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="walkInCustomerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Walk-in name</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                {form.formState.isSubmitting ? tc("actionSaving") : "Create draft"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
