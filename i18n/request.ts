import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { AppLocale } from "./routing";

async function loadMessages(locale: AppLocale) {
  const [core, dashboard, marketing, legal] = await Promise.all([
    import(`../messages/${locale}/core.json`),
    import(`../messages/${locale}/dashboard.json`),
    import(`../messages/${locale}/marketing.json`),
    import(`../messages/${locale}/legal.json`),
  ]);
  return {
    ...core.default,
    ...dashboard.default,
    ...marketing.default,
    ...legal.default,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (
    !locale ||
    !routing.locales.includes(locale as AppLocale)
  ) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale as AppLocale),
  };
});
