"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api/client";
import { normalizeUser } from "@/lib/api/normalize";
import { setUser } from "@/lib/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const t = useTranslations("dashboard.settings");
  const tv = useTranslations("dashboard.settings.validation");
  const schema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(1, tv("firstNameRequired")),
        lastName: z.string().min(1, tv("lastNameRequired")),
        phone: z.string().optional(),
        timezone: z.string().optional(),
      }),
    [tv],
  );
  type FormValues = z.infer<typeof schema>;

  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
      timezone:
        user?.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? "",
      timezone:
        user.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [
    user?.id,
    user?.firstName,
    user?.lastName,
    user?.phone,
    user?.timezone,
    form,
  ]);

  async function onSubmit(values: FormValues) {
    try {
      const raw = await apiFetch<Record<string, unknown>>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone || undefined,
          timezone: values.timezone || undefined,
        }),
      });
      dispatch(setUser(normalizeUser(raw)));
      toast.success(t("saved"));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t("updateFailed"));
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("pageTitle")}</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          {t("pageDescription")}
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="max-w-lg rounded-none border">
          <CardHeader>
            <CardTitle className="text-base">{t("cardTitle")}</CardTitle>
            <CardDescription>
              {t("signedInAs", { email: user?.email ?? "—" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("firstName")}</FormLabel>
                        <FormControl>
                          <Input className="rounded-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("lastName")}</FormLabel>
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone")}</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("timezone")}</FormLabel>
                      <FormControl>
                        <Input className="rounded-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="rounded-none"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? t("saving") : t("save")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
