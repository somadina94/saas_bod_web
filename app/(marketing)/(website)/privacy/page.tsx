import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";

export default function PrivacyPage() {
  return (
    <MarketingPageShell
      title="Privacy policy"
      subtitle={`How we handle information in ${PLATFORM_DISPLAY_NAME}. This is a concise product policy—have your counsel adapt it for your jurisdiction and deployment.`}
    >
      <p>
        <strong>Last updated:</strong> {new Date().toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <h2>Who we are</h2>
      <p>
        {PLATFORM_DISPLAY_NAME} is a multi-tenant business operations platform. Your organization’s data is
        logically separated by workspace (company). This policy describes categories of
        information the product is designed to process and how operators typically
        configure it.
      </p>

      <h2>Data you provide</h2>
      <ul>
        <li>Account identifiers such as name, email, and role for each teammate.</li>
        <li>
          Business records you enter: customers, suppliers, products, documents,
          invoices, payments, and uploaded files (e.g. logos, receipts, images).
        </li>
        <li>
          Payment-related configuration when you connect providers (e.g. Paystack keys
          for your workspace). Secrets should be stored using strong server-side
          encryption in production environments.
        </li>
      </ul>

      <h2>Cookies and sessions</h2>
      <p>
        The web application uses secure, HTTP-only cookies for session continuity and
        CSRF-aware API access patterns where implemented. Avoid sharing browser profiles
        between individuals so sessions remain personal.
      </p>

      <h2>Service providers</h2>
      <p>
        Deployments may integrate third-party infrastructure such as email (SMTP),
        object storage for uploads, and payment processors. Your administrator chooses
        those providers and their regions; review their DPAs alongside this policy.
      </p>

      <h2>Retention</h2>
      <p>
        Operational and audit data may be retained for as long as your workspace
        remains active and as required for compliance. Soft-deleted records may remain
        in databases for referential integrity until purged by your processes.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Workspace owners can invite, suspend, or remove users.</li>
        <li>Users can update profile preferences where the product exposes them.</li>
        <li>Contact your workspace administrator for export or deletion requests.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        For privacy questions about a specific deployment, contact the organization that
        operates your {PLATFORM_DISPLAY_NAME} instance. For product feedback, use the channels your team
        provides.
      </p>
    </MarketingPageShell>
  );
}
