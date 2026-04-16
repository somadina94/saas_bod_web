"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { companyApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { useAppSelector } from "@/lib/store/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
  currency: z.string().min(1),
  taxRate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CompanyEditForm({
  initial,
}: {
  initial: Record<string, unknown>;
}) {
  const qc = useQueryClient();
  const canEdit = useAppSelector(
    (s) =>
      s.auth.user?.isOwner ||
      s.auth.user?.permissions?.canManageCompanySettings === true,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: String(initial.name ?? ""),
      email: initial.email != null ? String(initial.email) : "",
      phone: initial.phone != null ? String(initial.phone) : "",
      currency: String(initial.currency ?? "NGN"),
      taxRate:
        typeof initial.taxRate === "number"
          ? String(initial.taxRate)
          : "",
    },
  });

  useEffect(() => {
    form.reset({
      name: String(initial.name ?? ""),
      email: initial.email != null ? String(initial.email) : "",
      phone: initial.phone != null ? String(initial.phone) : "",
      currency: String(initial.currency ?? "NGN"),
      taxRate:
        typeof initial.taxRate === "number"
          ? String(initial.taxRate)
          : "",
    });
  }, [initial, form]);

  async function onSubmit(values: FormValues) {
    try {
      const tr = values.taxRate?.trim();
      await companyApi.patch({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        currency: values.currency,
        taxRate: tr !== undefined && tr !== "" ? Number(tr) : undefined,
      });
      toast.success("Company updated");
      await qc.invalidateQueries({ queryKey: ["company"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  if (!canEdit) {
    return null;
  }

  return (
    <Card className="max-w-xl rounded-none border">
      <CardHeader>
        <CardTitle className="text-base">Edit company</CardTitle>
        <CardDescription>
          Visible only to roles with company settings permission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal name</FormLabel>
                  <FormControl>
                    <Input className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency code</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default tax %</FormLabel>
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
            </div>
            <Button
              type="submit"
              className="rounded-none"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving…" : "Save company"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
