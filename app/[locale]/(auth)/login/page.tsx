"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { SparkleIcon } from "@phosphor-icons/react";
import { loginRequest } from "@/lib/api/auth-client";
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

function LoginForm() {
  const t = useTranslations("auth.login");
  const tv = useTranslations("auth.login.validation");
  const schema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, tv("emailRequired")).email(tv("emailInvalid")),
        password: z.string().min(1, tv("passwordRequired")),
      }),
    [tv],
  );
  type FormValues = z.infer<typeof schema>;

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const from = searchParams.get("from") ?? "/dashboard";

  useEffect(() => {
    if (user) {
      router.replace(from.startsWith("/") ? from : "/dashboard");
    }
  }, [user, router, from]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const u = await loginRequest(values);
      dispatch(setUser(u));
      toast.success(t("welcome"));
      router.push(from.startsWith("/") ? from : "/dashboard");
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("failed");
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
              <SparkleIcon className="size-5" weight="fill" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-xl">{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        className="rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-primary text-xs font-medium underline-offset-4 hover:underline"
                >
                  {t("forgot")}
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full rounded-none"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </form>
          </Form>
          <p className="text-muted-foreground mt-6 text-center text-xs">
            {t("newWorkspace")}{" "}
            <Link
              href="/setup"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              {t("createCompany")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoginFallback() {
  const t = useTranslations("auth.login");
  return <div className="text-muted-foreground text-sm">{t("loading")}</div>;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
