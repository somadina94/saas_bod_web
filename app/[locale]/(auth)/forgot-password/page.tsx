"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeftIcon, EnvelopeIcon, SparkleIcon } from "@phosphor-icons/react";
import { requestPasswordReset } from "@/lib/api/password-client";
import { ApiError } from "@/lib/api/client";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgot");
  const tv = useTranslations("auth.forgot.validation");
  const schema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, tv("emailRequired")).email(tv("emailInvalid")),
      }),
    [tv],
  );
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const [sent, setSent] = useState<{
    message: string;
    resetUrl?: string;
  } | null>(null);

  async function onSubmit(values: FormValues) {
    try {
      const result = await requestPasswordReset(values.email);
      setSent({
        message: result.message,
        resetUrl: result.resetUrl,
      });
      toast.success(t("toastInbox"));
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : t("genericError");
      toast.error(msg);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-border/80 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-none">
              <EnvelopeIcon className="size-5" weight="duotone" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-xl">{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <>
              <Alert className="rounded-none">
                <SparkleIcon className="size-4" aria-hidden />
                <AlertTitle>{t("requestTitle")}</AlertTitle>
                <AlertDescription>{sent.message}</AlertDescription>
              </Alert>
              {sent.resetUrl ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs">{t("devHint")}</p>
                  <a
                    href={sent.resetUrl}
                    className="text-primary text-xs font-medium break-all underline-offset-4 hover:underline"
                  >
                    {sent.resetUrl}
                  </a>
                </div>
              ) : null}
              <Button variant="outline" className="w-full rounded-none" asChild>
                <Link href="/login">{t("backLogin")}</Link>
              </Button>
            </>
          ) : (
            <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            className="rounded-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full rounded-none"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? t("submitting") : t("submit")}
                  </Button>
                </form>
              </Form>
              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-none gap-2"
                asChild
              >
                <Link href="/login">
                  <ArrowLeftIcon className="size-4" aria-hidden />
                  {t("backLogin")}
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
