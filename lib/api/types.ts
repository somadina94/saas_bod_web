export type ApiSuccess<T> = {
  status: "success";
  data: T;
  meta?: Record<string, unknown>;
};
export type ApiFail = { status: "fail" | "error"; message: string };

export type UserPermissions = {
  canManageUsers?: boolean;
  canManageCompanySettings?: boolean;
  canViewDashboard?: boolean;
  canManageCustomers?: boolean;
  canManageSuppliers?: boolean;
  canManageProducts?: boolean;
  canManageInventory?: boolean;
  canAdjustStock?: boolean;
  canCreateSales?: boolean;
  canManageInvoices?: boolean;
  canRecordPayments?: boolean;
  canManagePurchases?: boolean;
  canManageExpenses?: boolean;
  canApproveExpenses?: boolean;
  canApproveDiscounts?: boolean;
  canViewReports?: boolean;
  canExportReports?: boolean;
  canViewAuditLogs?: boolean;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  timezone?: string;
  role: string;
  permissions: UserPermissions;
  status?: string;
  profileImageUrl?: string;
  isOwner?: boolean;
};

export type LoginResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type DashboardOverview = {
  currency: string;
  monthlySalesTotal: number;
  outstandingInvoices: number;
  lowStockCount: number;
  customerCount: number;
  supplierCount: number;
  recentSales: Array<Record<string, unknown>>;
  recentPayments: Array<Record<string, unknown>>;
  expensesThisMonth: number;
  topProductsByRevenue: Array<{
    productId: unknown;
    quantity: number;
    revenue: number;
  }>;
};
