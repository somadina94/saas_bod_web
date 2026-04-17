import { defineRouting } from "next-intl/routing";

/** EN default + major European locales + Arabic */
export const locales = [
  "en",
  "de",
  "fr",
  "es",
  "it",
  "pl",
  "nl",
  "ar",
] as const;

export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  /** English keeps clean URLs (`/dashboard`); other locales use `/de/...` — keeps Paystack callbacks stable. */
  localePrefix: "as-needed",
});

export const localeLabels: Record<AppLocale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  pl: "Polski",
  nl: "Nederlands",
  ar: "العربية",
};
