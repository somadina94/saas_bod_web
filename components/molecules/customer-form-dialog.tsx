"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon } from "@phosphor-icons/react";
import { customersApi } from "@/lib/api/entities";
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

const schema = z.object({
  name: z.string().min(1, "Required"),
  code: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof schema>;

function mapRow(row?: Record<string, unknown>): FormValues {
  return {
    name: String(row?.name ?? ""),
    code: row?.code != null ? String(row.code) : "",
    email: row?.email != null ? String(row.email) : "",
    phone: row?.phone != null ? String(row.phone) : "",
    status: (row?.status as FormValues["status"]) ?? "active",
  };
}

export function CustomerFormDialog({
  mode,
  initialRow,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: {
  mode: "create" | "edit";
  initialRow?: Record<string, unknown>;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const tc = useTranslations("common");
  const t = useTranslations("dashboard.customers");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: mapRow(initialRow),
  });

  useEffect(() => {
    if (open) {
      form.reset(mapRow(initialRow));
    }
  }, [open, initialRow, form]);

  async function onSubmit(values: FormValues) {
    try {
      const body = {
        name: values.name,
        code: values.code || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        status: values.status,
      };
      if (mode === "create") {
        await customersApi.create(body);
        toast.success("Customer created");
      } else {
        const id = String(initialRow?.id ?? initialRow?._id ?? "");
        await customersApi.patch(id, body);
        toast.success("Customer updated");
      }
      await qc.invalidateQueries({ queryKey: ["customers"] });
      setOpen(false);
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Request failed";
      toast.error(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>
            {`${mode === "create" ? tc("actionCreate") : tc("actionEdit")} ${t("title")}`}
          </DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("columns.name")}</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code (optional)</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("columns.email")}</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("columns.phone")}</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("columns.status")}</FormLabel>
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
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
                {form.formState.isSubmitting ? tc("actionSaving") : tc("actionSave")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AddCustomerButton() {
  const tc = useTranslations("common");
  const t = useTranslations("dashboard.customers");
  return (
    <CustomerFormDialog
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
