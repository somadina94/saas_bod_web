import { PublicDocumentView } from "@/components/organisms/public-document-view";

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PublicDocumentView kind="invoices" token={token} />;
}
