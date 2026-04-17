import { getTranslations } from "next-intl/server";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <MarketingPageShell
      title={t("title")}
      subtitle={t("subtitle", { platform: PLATFORM_DISPLAY_NAME })}
    >
      <p>
        <strong>{t("lastUpdated")}</strong>{" "}
        {new Date().toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <h2>{t("h1")}</h2>
      <p>{t("p1", { platform: PLATFORM_DISPLAY_NAME })}</p>

      <h2>{t("h2")}</h2>
      <p>{t("p2")}</p>

      <h2>{t("h3")}</h2>
      <ul>
        <li>{t("li1")}</li>
        <li>{t("li2")}</li>
        <li>{t("li3")}</li>
        <li>{t("li4")}</li>
      </ul>

      <h2>{t("h4")}</h2>
      <p>{t("p3")}</p>

      <h2>{t("h5")}</h2>
      <p>{t("p4")}</p>

      <h2>{t("h6")}</h2>
      <p>{t("p5")}</p>

      <h2>{t("h7")}</h2>
      <p>
        {t("p6", {
          platformUpper: PLATFORM_DISPLAY_NAME.toUpperCase(),
        })}
      </p>

      <h2>{t("h8")}</h2>
      <p>{t("p7")}</p>
    </MarketingPageShell>
  );
}
