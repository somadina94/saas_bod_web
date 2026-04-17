"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  dashboardNavMain,
  dashboardNavSecondary,
  filterNavForUser,
} from "@/lib/navigation/dashboard-nav";
import { useAppSelector } from "@/lib/store/hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SparkleIcon } from "@phosphor-icons/react";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";

export function AppSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const main = filterNavForUser(dashboardNavMain, user);
  const secondary = filterNavForUser(dashboardNavSecondary, user);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2 py-1.5 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-none shadow-sm">
            <SparkleIcon className="size-4" weight="fill" aria-hidden />
          </span>
          <span
            className="group-data-[collapsible=icon]:hidden max-w-[11rem] truncate text-left text-xs font-semibold leading-tight tracking-tight sm:max-w-[14rem]"
            title={PLATFORM_DISPLAY_NAME}
          >
            {PLATFORM_DISPLAY_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("workspace")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href + "/"));
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={t(item.titleKey as never)}
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" aria-hidden />
                        <span>{t(item.titleKey as never)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>{t("accountAdmin")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={t(item.titleKey as never)}
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" aria-hidden />
                        <span>{t(item.titleKey as never)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-muted-foreground border-t border-sidebar-border/60 text-[10px] leading-snug">
        <p className="group-data-[collapsible=icon]:hidden px-2">
          {t("sidebarFootnote")}
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
