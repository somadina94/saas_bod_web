import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";

export default function TermsPage() {
  return (
    <MarketingPageShell
      title="Terms of service"
      subtitle={`Rules for using ${PLATFORM_DISPLAY_NAME}. Replace placeholders with your legal entity and governing law before production marketing.`}
    >
      <p>
        <strong>Last updated:</strong>{" "}
        {new Date().toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <h2>Agreement</h2>
      <p>
        By accessing or using {PLATFORM_DISPLAY_NAME} (“Service”), you agree to these Terms on behalf of
        yourself and, if applicable, the organization you represent. If you do not
        agree, do not use the Service.
      </p>

      <h2>Accounts</h2>
      <p>
        You must provide accurate information and keep credentials confidential. You are
        responsible for activity under your account. Workspace owners may invite or
        revoke access to their company data subject to product capabilities.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to access workspaces or data that are not yours.</li>
        <li>Do not probe, scan, or disrupt the Service or other tenants.</li>
        <li>Do not use the Service for unlawful or fraudulent purposes.</li>
        <li>Comply with payment network and third-party provider rules you enable.</li>
      </ul>

      <h2>Customer data</h2>
      <p>
        You retain rights to your business data. You grant the Service permission to host
        and process that data to provide features you use. You are responsible for
        compliance with laws applicable to your customers and employees.
      </p>

      <h2>Availability & changes</h2>
      <p>
        We aim for reliable operation but do not guarantee uninterrupted access. Features
        may evolve; we may modify or discontinue parts of the Service with reasonable
        notice where appropriate.
      </p>

      <h2>Disclaimer</h2>
      <p>
        THE SERVICE IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW,{" "}
        {PLATFORM_DISPLAY_NAME.toUpperCase()} AND ITS SUPPLIERS WILL NOT BE LIABLE
        FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS
        OF PROFITS, DATA, OR GOODWILL. AGGREGATE LIABILITY FOR DIRECT DAMAGES SHOULD BE
        CAPPED AS SET FORTH IN YOUR ORDER FORM IF ANY; OTHERWISE, TO THE FEES PAID IN THE
        TWELVE MONTHS PRECEDING THE CLAIM OR ONE HUNDRED DOLLARS, WHICHEVER IS GREATER.
      </p>

      <h2>Governing law</h2>
      <p>
        Insert governing law and venue. Until then, consult qualified counsel before
        publishing these terms publicly.
      </p>
    </MarketingPageShell>
  );
}
