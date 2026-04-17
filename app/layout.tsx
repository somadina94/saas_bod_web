import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";
import { themeInitScript } from "@/lib/theme-init-script";
import { Providers } from "./providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PLATFORM_DISPLAY_NAME} · Business operations dashboard`,
    template: `%s · ${PLATFORM_DISPLAY_NAME}`,
  },
  description:
    "CRM, inventory, quotations, invoicing, payments, and reporting—built for teams that need production-grade operations software.",
  applicationName: PLATFORM_DISPLAY_NAME,
  keywords: [
    "CRM",
    "inventory",
    "invoicing",
    "operations",
    "ERP",
    "business dashboard",
  ],
  authors: [{ name: PLATFORM_DISPLAY_NAME }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: PLATFORM_DISPLAY_NAME,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: PLATFORM_DISPLAY_NAME,
    title: `${PLATFORM_DISPLAY_NAME} · Business operations dashboard`,
    description:
      "Run customers, stock, billing, and insights in one polished workspace.",
  },
  twitter: {
    card: "summary_large_image",
    title: PLATFORM_DISPLAY_NAME,
    description:
      "Production-grade business operations: CRM, inventory, billing, and more.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1098ad" },
    { media: "(prefers-color-scheme: dark)", color: "#0d7a8c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        plusJakarta.variable,
        jetbrainsMono.variable,
        "antialiased",
      )}
    >
      <body className="font-sans min-h-full">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
