import { PublicDocumentView } from "@/components/organisms/public-document-view";

export default async function PublicQuotationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PublicDocumentView kind="quotations" token={token} />;
}
