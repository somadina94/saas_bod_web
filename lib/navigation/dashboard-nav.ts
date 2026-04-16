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
  title: string;
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
    title: "Overview",
    href: "/dashboard",
    icon: HouseIcon,
    permission: "canViewDashboard",
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: UsersIcon,
    permission: "canManageCustomers",
  },
  {
    title: "Suppliers",
    href: "/dashboard/suppliers",
    icon: TruckIcon,
    permission: "canManageSuppliers",
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: PackageIcon,
    permission: "canManageProducts",
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: WrenchIcon,
    permission: "canManageProducts",
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: WarehouseIcon,
    permission: "canManageInventory",
  },
  {
    title: "Quotations",
    href: "/dashboard/quotations",
    icon: FileTextIcon,
    permission: "canManageInvoices",
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: ReceiptIcon,
    permission: "canManageInvoices",
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCardIcon,
    permission: "canRecordPayments",
  },
  {
    title: "Sales",
    href: "/dashboard/sales",
    icon: ShoppingCartIcon,
    permission: "canCreateSales",
  },
  {
    title: "Purchase orders",
    href: "/dashboard/purchase-orders",
    icon: ClipboardTextIcon,
    permission: "canManagePurchases",
  },
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: CurrencyDollarIcon,
    permission: "canManageExpenses",
  },
];

export const dashboardNavSecondary: DashboardNavItem[] = [
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: BellIcon,
  },
  {
    title: "Team",
    href: "/dashboard/users",
    icon: UserGearIcon,
    permission: "canManageUsers",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCardIcon,
  },
  {
    title: "Company",
    href: "/dashboard/company",
    icon: BuildingsIcon,
  },
  {
    title: "System",
    href: "/dashboard/system",
    icon: GearSixIcon,
    permission: "canManageCompanySettings",
  },
  {
    title: "Audit log",
    href: "/dashboard/audit-logs",
    icon: ScrollIcon,
    permission: "canViewAuditLogs",
  },
  {
    title: "Uploads",
    href: "/dashboard/uploads",
    icon: CloudArrowUpIcon,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: SlidersIcon,
  },
];
