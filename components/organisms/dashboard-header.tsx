"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

function initials(first?: string, last?: string) {
  const a = (first?.[0] ?? "").toUpperCase();
  const b = (last?.[0] ?? "").toUpperCase();
  return (a + b || "?").slice(0, 2);
}

export function DashboardHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { setTheme, resolvedTheme } = useTheme();

  async function onLogout() {
    try {
      await logoutRequest();
      dispatch(clearAuth());
      toast.success("Signed out");
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
            <Link href="/" title="Marketing site home">
              <HouseIcon className="size-4 shrink-0" aria-hidden />
              <span className="max-w-[6rem] truncate text-xs font-medium max-sm:sr-only">
                Home
              </span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <p className="text-muted-foreground hidden text-xs md:block">
            Operations · CRM · Inventory · Billing
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-none"
            aria-label={
              resolvedTheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
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
                aria-label="Account menu"
              >
                <Avatar className="size-7 rounded-none">
                  {user?.profileImageUrl ? (
                    <AvatarImage
                      key={user.profileImageUrl}
                      src={user.profileImageUrl}
                      alt=""
                      className="rounded-none object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="rounded-none bg-primary/15 text-primary text-xs font-medium">
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
                  Profile &amp; preferences
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
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
