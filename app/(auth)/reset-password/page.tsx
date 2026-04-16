"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  KeyIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { resetPasswordWithToken } from "@/lib/api/password-client";
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

const schema = z
  .object({
    email: z.string().min(1).email(),
    token: z.string().min(1, "Reset token is missing"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string().min(8),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [missingParams, setMissingParams] = useState(false);

  const tokenFromUrl = searchParams.get("token") ?? "";
  const emailFromUrl = searchParams.get("email") ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      confirm: "",
    },
  });

  useEffect(() => {
    if (!tokenFromUrl || !emailFromUrl) {
      setMissingParams(true);
      return;
    }
    setMissingParams(false);
    form.reset({
      email: decodeURIComponent(emailFromUrl),
      token: tokenFromUrl,
      password: "",
      confirm: "",
    });
  }, [tokenFromUrl, emailFromUrl, form]);

  async function onSubmit(values: FormValues) {
    try {
      await resetPasswordWithToken({
        email: values.email,
        token: values.token,
        password: values.password,
      });
      toast.success("Password updated — you can sign in now");
      router.push("/login");
      router.refresh();
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Reset failed";
      toast.error(msg);
    }
  }

  if (missingParams) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-border/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Invalid reset link</CardTitle>
            <CardDescription>
              This page needs a <code className="text-xs">token</code> and{" "}
              <code className="text-xs">email</code> in the URL (from your reset
              email).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="rounded-none" asChild>
              <Link href="/forgot-password">Request a new link</Link>
            </Button>
            <Button variant="ghost" className="rounded-none gap-2" asChild>
              <Link href="/login">
                <ArrowLeftIcon className="size-4" aria-hidden />
                Sign in
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
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
              <KeyIcon className="size-5" weight="duotone" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-xl">Choose a new password</CardTitle>
              <CardDescription>
                Signed in as {decodeURIComponent(emailFromUrl)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 rounded-none">
            <SparkleIcon className="size-4" aria-hidden />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              After saving, sign in with your new password. Old sessions are
              cleared for security.
            </AlertDescription>
          </Alert>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        readOnly
                        className="bg-muted/40 rounded-none"
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
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
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
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
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
                {form.formState.isSubmitting ? "Saving…" : "Update password"}
              </Button>
            </form>
          </Form>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full rounded-none gap-2"
            asChild
          >
            <Link href="/login">
              <ArrowLeftIcon className="size-4" aria-hidden />
              Back to sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground text-sm">Loading…</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
