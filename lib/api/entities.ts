import { apiFetch } from "./client";
import type { Paginated } from "./types";

export async function listOptions<T>(
  path: string,
): Promise<T[]> {
  const res = await apiFetch<Paginated<T>>(`${path}?page=1&limit=200`);
  return res.items ?? [];
}

export const customersApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/customers", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  archive: (id: string) =>
    apiFetch<unknown>(`/customers/${id}`, { method: "DELETE" }),
  get: (id: string) =>
    apiFetch<Record<string, unknown>>(`/customers/${id}`),
};

export const suppliersApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/suppliers", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/suppliers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  archive: (id: string) =>
    apiFetch<unknown>(`/suppliers/${id}`, { method: "DELETE" }),
};

export const productsApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  archive: (id: string) =>
    apiFetch<unknown>(`/products/${id}`, { method: "DELETE" }),
};

export const servicesApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/services", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  archive: (id: string) =>
    apiFetch<unknown>(`/services/${id}`, { method: "DELETE" }),
};

export const quotationsApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/quotations", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  get: (id: string) =>
    apiFetch<Record<string, unknown>>(`/quotations/${id}`),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/quotations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  convertToInvoice: (id: string, body?: { dueDays?: number }) =>
    apiFetch<Record<string, unknown>>(`/quotations/${id}/convert-to-invoice`, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),
};

export const invoicesApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/invoices", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  get: (id: string) =>
    apiFetch<Record<string, unknown>>(`/invoices/${id}`),
  patchDraft: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/invoices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  send: (id: string) =>
    apiFetch<Record<string, unknown>>(`/invoices/${id}/send`, {
      method: "POST",
    }),
};

export const paymentsApi = {
  record: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/payments", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const salesApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/sales", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  get: (id: string) =>
    apiFetch<Record<string, unknown>>(`/sales/${id}`),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/sales/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  complete: (id: string, deductInventory = true) =>
    apiFetch<Record<string, unknown>>(`/sales/${id}/complete`, {
      method: "POST",
      body: JSON.stringify({ deductInventory }),
    }),
};

export const purchaseOrdersApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/purchase-orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  get: (id: string) =>
    apiFetch<Record<string, unknown>>(`/purchase-orders/${id}`),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/purchase-orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  approve: (id: string) =>
    apiFetch<Record<string, unknown>>(`/purchase-orders/${id}/approve`, {
      method: "POST",
    }),
  receive: (id: string, body: { lines?: { lineIndex: number; quantity: number }[] }) =>
    apiFetch<Record<string, unknown>>(`/purchase-orders/${id}/receive`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const expensesApi = {
  create: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/expenses", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/expenses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  approve: (id: string) =>
    apiFetch<Record<string, unknown>>(`/expenses/${id}/approve`, {
      method: "POST",
    }),
  reject: (id: string, reason: string) =>
    apiFetch<Record<string, unknown>>(`/expenses/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

export const inventoryApi = {
  stockIn: (body: Record<string, unknown>) =>
    apiFetch<unknown>("/inventory/stock-in", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  stockOut: (body: Record<string, unknown>) =>
    apiFetch<unknown>("/inventory/stock-out", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  adjust: (body: Record<string, unknown>) =>
    apiFetch<unknown>("/inventory/adjust", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const companyApi = {
  get: () => apiFetch<Record<string, unknown>>("/company"),
  patch: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/company", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  testPaystack: () =>
    apiFetch<{ ok: boolean }>("/company/payments/test-paystack", {
      method: "POST",
      body: JSON.stringify({}),
    }),
};

export const billingApi = {
  getSubscription: () =>
    apiFetch<{
      subscription: Record<string, unknown> | null;
      pricing: { monthlyNgn: number; yearlyNgn: number; currency: string };
    }>("/billing/subscription"),
  checkout: (body: { interval: "monthly" | "yearly" }) =>
    apiFetch<{
      authorizationUrl: string;
      accessCode: string;
      reference: string;
    }>("/billing/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const notificationsApi = {
  markRead: (id: string) =>
    apiFetch<unknown>(`/notifications/${id}/read`, { method: "POST" }),
  markAllRead: () =>
    apiFetch<unknown>("/notifications/read-all", { method: "POST" }),
};
