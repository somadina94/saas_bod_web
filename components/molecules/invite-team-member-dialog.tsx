"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlusIcon } from "@phosphor-icons/react";
import {
  createStaffUser,
  type StaffRole,
} from "@/lib/api/users-client";
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

const roleOptions: { value: StaffRole; label: string; hint: string }[] = [
  { value: "admin", label: "Admin", hint: "Full access except owner-only actions" },
  { value: "manager", label: "Manager", hint: "Operations without user management" },
  { value: "sales", label: "Sales", hint: "Customers, quotes, invoices" },
  { value: "inventory", label: "Inventory", hint: "Products & stock" },
  { value: "accountant", label: "Accountant", hint: "Invoices, payments, expenses" },
  { value: "support", label: "Support", hint: "Customer-facing" },
  { value: "viewer", label: "Viewer", hint: "Read-only dashboard & reports" },
];

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().min(1).email(),
  role: z.enum([
    "admin",
    "manager",
    "sales",
    "inventory",
    "accountant",
    "support",
    "viewer",
  ]),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const emptyForm: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  role: "viewer",
  department: "",
  jobTitle: "",
};

export function InviteTeamMemberDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyForm,
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset(emptyForm);
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      await createStaffUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        department: values.department || undefined,
        jobTitle: values.jobTitle || undefined,
      });
      await qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("Invitation sent by email.");
      setOpen(false);
      form.reset(emptyForm);
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Could not invite user";
      toast.error(msg);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="rounded-none gap-2">
          <UserPlusIcon className="size-4" weight="bold" aria-hidden />
          Invite team member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
            They&apos;ll get status <span className="font-semibold">invited</span> until they open the
            link in email and set a password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <motion.form
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
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
                      <FormLabel>Last name</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work email</FormLabel>
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none w-full">
                          <SelectValue placeholder="Choose role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-[11px] leading-snug">
                      {
                        roleOptions.find((o) => o.value === field.value)
                          ?.hint
                      }
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department (optional)</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title (optional)</FormLabel>
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-none"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Sending…" : "Send invite"}
                </Button>
              </div>
          </motion.form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
