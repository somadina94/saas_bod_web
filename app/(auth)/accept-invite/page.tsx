"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { SparkleIcon } from "@phosphor-icons/react";
import { acceptInviteRequest, fetchCurrentUser } from "@/lib/api/auth-client";
import { setUser } from "@/lib/store/slices/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
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

function AcceptInviteForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

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
    if (token && email) {
      form.reset({
        email: decodeURIComponent(email),
        token,
        password: "",
        confirm: "",
      });
    }
  }, [token, email, form]);

  async function onSubmit(values: FormValues) {
    try {
      await acceptInviteRequest({
        email: values.email,
        token: values.token,
        newPassword: values.password,
      });
      const user = await fetchCurrentUser();
      dispatch(setUser(user));
      toast.success("Welcome to the team");
      router.push("/dashboard");
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not complete invite";
      toast.error(msg);
    }
  }

  if (!token || !email) {
    return (
      <Card className="border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Invalid invitation link</CardTitle>
          <CardDescription>
            Open the full link from your invitation email. If it expired, ask an
            admin to send a new invite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="rounded-none" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
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
              <SparkleIcon className="size-5" weight="fill" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-xl">Accept invitation</CardTitle>
              <CardDescription>
                Set your password for {decodeURIComponent(email)}
              </CardDescription>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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
                name="token"
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                {form.formState.isSubmitting ? "Saving…" : "Join workspace"}
              </Button>
            </form>
          </Form>
          <p className="text-muted-foreground mt-4 text-center text-xs">
            <Link href="/login" className="underline-offset-4 hover:underline">
              Already have an account?
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground text-sm">Loading…</div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
