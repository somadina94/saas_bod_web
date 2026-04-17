"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ChartLineIcon,
  LockIcon,
  SparkleIcon,
  StorefrontIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { AppStoreBadges } from "@/components/marketing/app-store-badges";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";

export default function MarketingHome() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const authCtaHref = user ? "/dashboard" : "/login";
  const authCtaLabel = user ? tc("dashboard") : t("ctaSignIn");

  const cards = [
    {
      title: t("card1Title"),
      body: t("card1Body"),
      icon: StorefrontIcon,
    },
    {
      title: t("card2Title"),
      body: t("card2Body"),
      icon: ChartLineIcon,
    },
    {
      title: t("card3Title"),
      body: t("card3Body"),
      icon: UsersThreeIcon,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, #1098ad 0, transparent 42%), radial-gradient(circle at 82% 8%, #c45c26 0, transparent 38%), radial-gradient(circle at 50% 100%, hsl(var(--primary)) 0, transparent 45%)",
        }}
        aria-hidden
      />

      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <p className="text-primary inline-flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide uppercase">
            <LockIcon className="size-3.5 shrink-0" aria-hidden />
            <span>{t("badge1")}</span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="hidden sm:inline">{t("badge2")}</span>
            <span className="text-border hidden md:inline">·</span>
            <span className="hidden md:inline">{t("badge3")}</span>
          </p>
          <h1 className="text-foreground max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            {t("headline")}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
            {t("subhead")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild className="rounded-none gap-2 shadow-sm">
              <Link href="/setup">
                {t("ctaStart")} <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-none">
              <Link href={authCtaHref}>{authCtaLabel}</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="rounded-none">
              <Link href="/features">{t("ctaFeatures")}</Link>
            </Button>
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
              {t("mobileTitle")}
            </p>
            <AppStoreBadges variant="light" />
            <p className="text-muted-foreground max-w-md text-xs leading-relaxed">
              {t("mobileHint")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="border-border bg-card/70 mt-16 grid gap-6 rounded-none border p-8 backdrop-blur-md md:grid-cols-3 md:gap-8 md:p-10"
        >
          {cards.map((c, i) => (
            <div key={c.title} className="space-y-3">
              <c.icon
                className="text-primary size-6"
                aria-hidden
                style={{ opacity: 0.95 - i * 0.06 }}
              />
              <h2 className="text-foreground text-base font-semibold">{c.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="border-border bg-muted/15 mt-10 flex flex-col items-start justify-between gap-6 rounded-none border p-8 md:flex-row md:items-center md:p-10"
        >
          <div className="space-y-2">
            <div className="text-primary flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <SparkleIcon className="size-4" weight="fill" aria-hidden />
              {t("ctaSectionKicker")}
            </div>
            <p className="text-foreground max-w-xl text-base font-medium leading-snug">
              {t("ctaSectionBody")}
            </p>
          </div>
          <Button variant="secondary" size="lg" asChild className="rounded-none shrink-0">
            <Link href="/how-it-works">
              {t("ctaHowItWorks")} <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
