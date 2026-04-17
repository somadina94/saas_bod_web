"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CloudArrowUpIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { publicApiBase } from "@/lib/env";
import { fetchCurrentUser } from "@/lib/api/auth-client";
import { refreshSession } from "@/lib/api/refresh";
import { setUser } from "@/lib/store/slices/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerSelect } from "@/components/molecules/customer-select";
import { SupplierSelect } from "@/components/molecules/supplier-select";
import { ProductSelect } from "@/components/molecules/product-select";
import { ExpenseSelect } from "@/components/molecules/expense-select";

const kinds = [
  "company_logo",
  "user_avatar",
  "customer_doc",
  "supplier_doc",
  "expense_receipt",
  "product_image",
] as const;

async function postUpload(params: {
  kind: string;
  file: File;
  productId?: string;
  expenseId?: string;
  customerId?: string;
  supplierId?: string;
}) {
  const url = `${publicApiBase}/uploads`;
  const run = () => {
    const fd = new FormData();
    fd.append("file", params.file);
    fd.append("kind", params.kind);
    if (params.productId) fd.append("productId", params.productId);
    if (params.expenseId) fd.append("expenseId", params.expenseId);
    if (params.customerId) fd.append("customerId", params.customerId);
    if (params.supplierId) fd.append("supplierId", params.supplierId);
    return fetch(url, { method: "POST", body: fd, credentials: "include" });
  };
  let res = await run();
  if (res.status === 401) {
    const ok = await refreshSession();
    if (ok) {
      res = await run();
    }
  }
  const json = (await res.json().catch(() => ({}))) as {
    status?: string;
    data?: { url?: string };
    message?: string;
  };
  if (!res.ok) {
    throw new Error(json.message ?? "Upload failed");
  }
  return json.data;
}

export default function UploadsPage() {
  const dispatch = useAppDispatch();
  const [kind, setKind] = useState<(typeof kinds)[number]>("expense_receipt");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [entityId, setEntityId] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Choose a file");
      return;
    }
    if (
      ["product_image", "expense_receipt", "customer_doc", "supplier_doc"].includes(
        kind,
      ) &&
      !entityId.trim()
    ) {
      toast.error("Select the related record");
      return;
    }
    setBusy(true);
    try {
      const data = await postUpload({
        kind,
        file,
        productId: kind === "product_image" ? entityId || undefined : undefined,
        expenseId: kind === "expense_receipt" ? entityId || undefined : undefined,
        customerId: kind === "customer_doc" ? entityId || undefined : undefined,
        supplierId: kind === "supplier_doc" ? entityId || undefined : undefined,
      });
      toast.success("Uploaded", {
        description: data?.url ? `URL: ${data.url}` : undefined,
      });
      if (kind === "user_avatar") {
        try {
          const u = await fetchCurrentUser();
          dispatch(setUser(u));
        } catch {
          /* header refreshes on next navigation / reload */
        }
      }
      setFile(null);
      setEntityId("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Uploads</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Files are stored per kind and wired to entities when applicable (e.g.
          avatars, logos).
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="max-w-lg rounded-none border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CloudArrowUpIcon className="size-6" aria-hidden />
              <div>
                <CardTitle className="text-base">Upload file</CardTitle>
                <CardDescription>Max ~10MB per request (server limit).</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kind">Kind</Label>
                <Select
                  value={kind}
                  onValueChange={(v) => {
                    setKind(v as (typeof kinds)[number]);
                    setEntityId("");
                  }}
                >
                  <SelectTrigger id="kind" className="rounded-none w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kinds.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {kind === "product_image" ? (
                <div className="space-y-2">
                  <Label>Product</Label>
                  <ProductSelect
                    value={entityId}
                    onChange={setEntityId}
                    placeholder="Search and select product"
                  />
                </div>
              ) : null}
              {kind === "expense_receipt" ? (
                <div className="space-y-2">
                  <Label>Expense</Label>
                  <ExpenseSelect
                    value={entityId}
                    onChange={setEntityId}
                    placeholder="Search and select expense"
                  />
                </div>
              ) : null}
              {kind === "customer_doc" ? (
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <CustomerSelect
                    value={entityId}
                    onChange={setEntityId}
                    placeholder="Search and select customer"
                  />
                </div>
              ) : null}
              {kind === "supplier_doc" ? (
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <SupplierSelect
                    value={entityId}
                    onChange={setEntityId}
                    placeholder="Search and select supplier"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <InputFile
                  id="file"
                  onChange={(f) => setFile(f)}
                />
              </div>
              <Button type="submit" className="rounded-none" disabled={busy}>
                {busy ? "Uploading…" : "Upload"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function InputFile({
  id,
  onChange,
}: {
  id: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <input
      id={id}
      type="file"
      className="border-input bg-background file:text-foreground flex h-9 w-full border px-3 py-1 text-xs file:mr-3 file:border-0 file:bg-transparent file:text-xs"
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
    />
  );
}
