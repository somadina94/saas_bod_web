"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

const RTL_LOCALES = new Set(["ar"]);

/** Syncs `<html lang>` and `dir` with the active next-intl locale (inside `[locale]` layout only). */
export function HtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
