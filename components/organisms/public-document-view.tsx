"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api/client";
import { formatDate, formatMoney } from "@/lib/format";

type PublicLine = {
  description?: string;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
};

type PublicCustomer = {
  name?: string;
  email?: string;
  phone?: string;
};

type PublicQuotation = {
  quotationNumber?: string;
  status?: string;
  issueDate?: string;
  validUntil?: string;
  items?: PublicLine[];
  total?: number;
  notes?: string;
};

type PublicInvoice = {
  invoiceNumber?: string;
  status?: string;
  issueDate?: string;
  dueDate?: string;
  items?: PublicLine[];
  total?: number;
  paidAmount?: number;
  balance?: number;
  notes?: string;
};

type PublicResponse = {
  kind: "quotation" | "invoice";
  customer: PublicCustomer;
  quotation?: PublicQuotation;
  invoice?: PublicInvoice;
};

export function PublicDocumentView({
  kind,
  token,
}: {
  kind: "quotations" | "invoices";
  token: string;
}) {
  const q = useQuery({
    queryKey: ["public-doc", kind, token],
    queryFn: () =>
      apiFetch<PublicResponse>(`/public/${kind}/${encodeURIComponent(token)}`),
  });

  if (q.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl p-6">
        <p className="text-muted-foreground text-sm">Loading document…</p>
      </div>
    );
  }

  if (q.isError || !q.data) {
    return (
      <div className="mx-auto w-full max-w-4xl p-6">
        <Card className="rounded-none border">
          <CardHeader>
            <CardTitle>Document unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            This link is invalid, expired, or the document is no longer
            available.
          </CardContent>
        </Card>
      </div>
    );
  }

  const d = q.data;
  const doc = d.kind === "quotation" ? d.quotation : d.invoice;
  const title =
    d.kind === "quotation"
      ? `Quotation ${d.quotation?.quotationNumber ?? ""}`.trim()
      : `Invoice ${d.invoice?.invoiceNumber ?? ""}`.trim();
  const status = String(doc?.status ?? "—");
  const items = doc?.items ?? [];
  const total = typeof doc?.total === "number" ? doc.total : 0;

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
      <Card className="rounded-none border">
        <CardHeader className="space-y-2">
          <Badge variant="secondary" className="w-fit rounded-none">
            Customer copy
          </Badge>
          <CardTitle>{title}</CardTitle>
          <p className="text-muted-foreground text-xs">
            Status: <span className="font-medium">{status}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Customer
              </p>
              <p>{d.customer.name ?? "—"}</p>
              <p className="text-muted-foreground">{d.customer.email ?? "—"}</p>
              <p className="text-muted-foreground">{d.customer.phone ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                Dates
              </p>
              <p>
                Issued:{" "}
                {formatDate(
                  d.kind === "quotation" ? d.quotation?.issueDate : d.invoice?.issueDate,
                )}
              </p>
              {d.kind === "quotation" ? (
                <p>
                  Valid until: {formatDate(d.quotation?.validUntil)}
                </p>
              ) : (
                <p>
                  Due: {formatDate(d.invoice?.dueDate)}
                </p>
              )}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No line items.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((line, i) => (
                  <TableRow key={i}>
                    <TableCell>{line.description ?? "—"}</TableCell>
                    <TableCell>{line.quantity ?? 0}</TableCell>
                    <TableCell>{formatMoney(line.unitPrice ?? 0, "NGN")}</TableCell>
                    <TableCell>{formatMoney(line.lineTotal ?? 0, "NGN")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="space-y-1 text-sm">
            {d.kind === "invoice" ? (
              <>
                <p>Total: {formatMoney(total, "NGN")}</p>
                <p>Paid: {formatMoney(d.invoice?.paidAmount ?? 0, "NGN")}</p>
                <p className="font-semibold">
                  Balance: {formatMoney(d.invoice?.balance ?? total, "NGN")}
                </p>
              </>
            ) : (
              <p className="font-semibold">
                Total: {formatMoney(total, "NGN")}
              </p>
            )}
            {doc?.notes ? (
              <p className="text-muted-foreground">Notes: {doc.notes}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
