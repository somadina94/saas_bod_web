"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ChartLineIcon,
  LockIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function MarketingHome() {
  return (
    <div className="from-background via-background to-primary/5 relative flex min-h-svh flex-col overflow-hidden bg-gradient-to-b">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #1098ad 0, transparent 45%), radial-gradient(circle at 80% 0%, #c45c26 0, transparent 40%)",
        }}
        aria-hidden
      />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-none shadow-sm">
            <SparkleIcon className="size-5" weight="fill" aria-hidden />
          </span>
          <span>BOD</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="rounded-none">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="rounded-none">
            <Link href="/setup">Create workspace</Link>
          </Button>
        </nav>
      </header>
      <main className="relative z-10 mx-auto flex max-w-5xl flex-1 flex-col justify-center px-6 pb-24 pt-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <p className="text-primary inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <LockIcon className="size-3.5" aria-hidden />
            Cookie-based sessions · Role-based access
          </p>
          <h1 className="text-foreground max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Run your business operations with clarity and speed.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
            CRM, inventory, quotes, invoices, payments, and reporting in one
            polished workspace—built for teams that outgrow spreadsheets.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild className="rounded-none gap-2">
              <Link href="/setup">
                Start free <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-none">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="border-border bg-card/60 grid gap-4 rounded-none border p-6 backdrop-blur md:grid-cols-3"
          >
            {[
              {
                title: "Unified pipeline",
                body: "Customers, suppliers, and stock in sync with audit trails.",
              },
              {
                title: "Finance-ready",
                body: "Quotes, invoices, Paystack payments, and expense flows.",
              },
              {
                title: "Insightful",
                body: "Dashboards tuned for leadership—not toy charts.",
              },
            ].map((c, i) => (
              <div key={c.title} className="space-y-2">
                <ChartLineIcon
                  className="text-primary size-5"
                  aria-hidden
                  style={{ opacity: 0.9 - i * 0.1 }}
                />
                <h2 className="text-sm font-semibold">{c.title}</h2>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>
      <footer className="text-muted-foreground relative z-10 border-t px-6 py-6 text-xs md:px-10">
        © {new Date().getFullYear()} BOD. Built for production teams.
      </footer>
    </div>
  );
}
