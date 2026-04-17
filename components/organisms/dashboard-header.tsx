"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  HouseIcon,
  MoonIcon,
  SignOutIcon,
  SunIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/providers/theme-provider";
import { toast } from "sonner";
import { logoutRequest } from "@/lib/api/auth-client";
import { clearAuth } from "@/lib/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";

function initials(first?: string, last?: string) {
  const a = (first?.[0] ?? "").toUpperCase();
  const b = (last?.[0] ?? "").toUpperCase();
  return (a + b || "?").slice(0, 2);
}

export function DashboardHeader() {
  const t = useTranslations("dashboardHeader");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { setTheme, resolvedTheme } = useTheme();

  async function onLogout() {
    try {
      await logoutRequest();
      dispatch(clearAuth());
      toast.success(t("signedOut"));
      router.push("/login");
      router.refresh();
    } catch {
      dispatch(clearAuth());
      router.push("/login");
    }
  }

  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b px-3 backdrop-blur md:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hidden rounded-none gap-1.5 px-2 sm:inline-flex"
            asChild
          >
            <Link
              href="/"
              title={t("marketingHomeTitle")}
              className="inline-flex items-center gap-1.5"
            >
              <HouseIcon className="size-4 shrink-0" aria-hidden />
              <span className="max-w-[6rem] truncate text-xs font-medium max-sm:sr-only">
                {t("home")}
              </span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <p className="text-muted-foreground hidden text-xs md:block">
            {t("tagline")}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <LocaleSwitcher
            className="h-8 w-[min(100%,9.5rem)] rounded-none text-xs"
            id="dashboard-locale"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-none"
            aria-label={
              resolvedTheme === "dark" ? t("themeLight") : t("themeDark")
            }
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <SunIcon className="dark:hidden size-4" aria-hidden />
            <MoonIcon className="hidden dark:block size-4" aria-hidden />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-none px-2"
                aria-label={t("accountMenu")}
              >
                <Avatar className="size-7 rounded-full">
                  {user?.profileImageUrl ? (
                    <AvatarImage
                      key={user.profileImageUrl}
                      src={user.profileImageUrl}
                      alt=""
                      className="rounded-full object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="rounded-full bg-primary/15 text-primary text-xs font-medium">
                    {initials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[10rem] truncate text-left text-xs font-medium sm:inline">
                  {user?.firstName} {user?.lastName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <UserIcon className="size-4" />
                  {t("profilePrefs")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  void onLogout();
                }}
              >
                <SignOutIcon className="size-4" />
                {t("signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
