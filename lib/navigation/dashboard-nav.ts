import type { IconProps } from "@phosphor-icons/react";
import {
  BellIcon,
  BuildingsIcon,
  CurrencyDollarIcon,
  ClipboardTextIcon,
  CloudArrowUpIcon,
  CreditCardIcon,
  FileTextIcon,
  GearSixIcon,
  HouseIcon,
  PackageIcon,
  ReceiptIcon,
  ScrollIcon,
  ShoppingCartIcon,
  SlidersIcon,
  TruckIcon,
  UserGearIcon,
  UsersIcon,
  WarehouseIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import type { User } from "@/lib/api/types";

export type PermissionKey = keyof NonNullable<User["permissions"]>;

export type DashboardNavItem = {
  /** Key under `nav.*` in messages */
  titleKey: string;
  href: string;
  icon: React.ComponentType<IconProps>;
  /** If set, item is shown only when user has this permission (or is owner with implied access). */
  permission?: PermissionKey;
};

function hasPerm(user: User | null, key: PermissionKey | undefined): boolean {
  if (!user) return false;
  if (user.isOwner) return true;
  if (!key) return true;
  return user.permissions[key] === true;
}

export function filterNavForUser(
  items: DashboardNavItem[],
  user: User | null,
): DashboardNavItem[] {
  return items.filter((i) => hasPerm(user, i.permission));
}

export const dashboardNavMain: DashboardNavItem[] = [
  {
    titleKey: "overview",
    href: "/dashboard",
    icon: HouseIcon,
    permission: "canViewDashboard",
  },
  {
    titleKey: "customers",
    href: "/dashboard/customers",
    icon: UsersIcon,
    permission: "canManageCustomers",
  },
  {
    titleKey: "suppliers",
    href: "/dashboard/suppliers",
    icon: TruckIcon,
    permission: "canManageSuppliers",
  },
  {
    titleKey: "products",
    href: "/dashboard/products",
    icon: PackageIcon,
    permission: "canManageProducts",
  },
  {
    titleKey: "services",
    href: "/dashboard/services",
    icon: WrenchIcon,
    permission: "canManageProducts",
  },
  {
    titleKey: "inventory",
    href: "/dashboard/inventory",
    icon: WarehouseIcon,
    permission: "canManageInventory",
  },
  {
    titleKey: "quotations",
    href: "/dashboard/quotations",
    icon: FileTextIcon,
    permission: "canManageInvoices",
  },
  {
    titleKey: "invoices",
    href: "/dashboard/invoices",
    icon: ReceiptIcon,
    permission: "canManageInvoices",
  },
  {
    titleKey: "payments",
    href: "/dashboard/payments",
    icon: CreditCardIcon,
    permission: "canRecordPayments",
  },
  {
    titleKey: "sales",
    href: "/dashboard/sales",
    icon: ShoppingCartIcon,
    permission: "canCreateSales",
  },
  {
    titleKey: "purchaseOrders",
    href: "/dashboard/purchase-orders",
    icon: ClipboardTextIcon,
    permission: "canManagePurchases",
  },
  {
    titleKey: "expenses",
    href: "/dashboard/expenses",
    icon: CurrencyDollarIcon,
    permission: "canManageExpenses",
  },
];

export const dashboardNavSecondary: DashboardNavItem[] = [
  {
    titleKey: "notifications",
    href: "/dashboard/notifications",
    icon: BellIcon,
  },
  {
    titleKey: "team",
    href: "/dashboard/users",
    icon: UserGearIcon,
    permission: "canManageUsers",
  },
  {
    titleKey: "billing",
    href: "/dashboard/billing",
    icon: CreditCardIcon,
  },
  {
    titleKey: "company",
    href: "/dashboard/company",
    icon: BuildingsIcon,
  },
  {
    titleKey: "system",
    href: "/dashboard/system",
    icon: GearSixIcon,
    permission: "canManageCompanySettings",
  },
  {
    titleKey: "auditLog",
    href: "/dashboard/audit-logs",
    icon: ScrollIcon,
    permission: "canViewAuditLogs",
  },
  {
    titleKey: "uploads",
    href: "/dashboard/uploads",
    icon: CloudArrowUpIcon,
  },
  {
    titleKey: "settings",
    href: "/dashboard/settings",
    icon: SlidersIcon,
  },
];
