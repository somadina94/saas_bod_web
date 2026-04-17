# JAHBYTE BOD — QA script for a bottled water distributor

**Canonical copy (GitHub):** [github.com/somadina94/saas_bod_web/blob/main/doc.md](https://github.com/somadina94/saas_bod_web/blob/main/doc.md)

Use **one browser profile per role** so sessions do not clash. This script assumes a **production-ready deployment** with working SMTP and a real invite email flow.

**Business theme:** a bottled water distribution company that buys stock from suppliers, stores inventory, sells to distributors/retailers, invoices customers, records payments, and tracks expenses.

**Money display** uses **NGN** in list columns.

**Base URL:** your deployed URL.

## Architecture: multi-tenant SaaS

**JAHBYTE BOD** is a **multi-tenant** product: each **company** is an isolated workspace (`companyId` on users and tenant data). A user belongs to one workspace per account; JWT/session carries **company scope** so API routes and queries stay tenant-safe.

If you are migrating from an older **single-tenant** mental model, treat every “global” record as **per-company** instead: customers, invoices, Paystack webhooks, uploads, and subscriptions are all scoped to the active workspace.

## Extended platform features (beyond core CRM/inventory)

These are important for production QA and operator setup:

| Area | What to verify |
|------|----------------|
| **Platform billing** | **Billing** lets the workspace pay for the **JAHBYTE BOD** subscription (Paystack checkout when enabled). Distinct from customer invoice payments. |
| **Tenant Paystack** | Under **Company** (or billing-related settings), tenants can save **Paystack public/secret keys** for **their own** customer payments, callback URL, tenant webhook URL, and **test connection** (balance API). In **production**, the API must have **`ENCRYPTION_KEY`** set to **64 hex characters** (32 bytes, e.g. `openssl rand -hex 32`) so secrets encrypt/decrypt; missing key surfaces a clear configuration error instead of a silent failure. |
| **Team administration** | **Team** supports **invite**, **role change**, **status** (active / suspended / disabled), and **remove from team** (soft delete). Workspace **owner** rows show as Owner and cannot be edited via those actions. |
| **Uploads** | **Uploads** sends files to **Backblaze B2** when env is set (`B2_*`). Kinds include **company logo**, **user avatar** (updates profile image), receipts, product images, etc. |
| **Public links** | Customers may receive **public invoice/quotation** links (tokenized URLs under `/public/...`) without logging into the dashboard. |
| **Marketing site** | The public **home**, **Features**, **How it works**, **Privacy**, and **Terms** pages describe the product; auth pages link **Back to home**; the dashboard header links **Home** to the marketing site. |

The rest of this document is still the **end-to-end bottled-water QA script**—use it unchanged for role and flow coverage.

## Pre-flight

1. Owner account can log in successfully.
2. SMTP is working and staff invites are sent by email.
3. You can access inboxes for invited staff and at least one test customer email.
4. Use a separate browser profile for each invited user.

---

## 0. Screen map

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [ ≡ ]   Operations · CRM · Inventory · Billing     [ ☀/☽ ]   [ initials ▼ ]  │
├─────────────────┬────────────────────────────────────────────────────────────┤
│  Workspace      │  Page title                    [ Primary action buttons ]   │
│   Overview …    │  Subtitle                                                   │
│  Account &      │  ┌──────────────────────────────────────────────────────┐ │
│   admin …       │  │ Data table · last column often has [ ⋮ ] row menu     │ │
│                 │  └──────────────────────────────────────────────────────┘ │
└─────────────────┴────────────────────────────────────────────────────────────┘
```

- **Primary actions** such as **Add product** or **New invoice** are at the top-right of the page.
- The last table column may show a **⋮** row menu for actions like **Edit**, **Archive**, **Send invoice**, **Approve**, or **Receive remaining**.

---

## 1. Company story and actors

### Company

**BlueDrop Bottled Water Distribution Ltd**

This company buys bottled water stock from suppliers and distributes to supermarkets, hotels, offices, and event vendors.

### Roles

| Profile label | Role | Example email | Password after invite |
|---|---|---|---|
| OWNER | Owner | existing owner login | your owner password |
| ADMIN | Admin | `admin@bluedrop.test` | `BlueDrop2026!` |
| MGR | Manager | `manager@bluedrop.test` | `BlueDrop2026!` |
| SALES | Sales | `sales@bluedrop.test` | `BlueDrop2026!` |
| STOCK | Inventory | `inventory@bluedrop.test` | `BlueDrop2026!` |
| ACC | Accountant | `accounts@bluedrop.test` | `BlueDrop2026!` |
| SUP | Support | `support@bluedrop.test` | `BlueDrop2026!` |
| VIEW | Viewer | `viewer@bluedrop.test` | `BlueDrop2026!` |

Invite flow:
**Team** → **Invite team member** → **Send invite** → user receives email → opens invite link → **Join workspace**

---

## 2. Master data to use during testing

### Suppliers

Use these suppliers during setup:

1. `AquaPure Beverages Depot`
2. `CrystalPack Wholesale`
3. `Prime Logistics Fuel Station`

### Customers

Use these customers:

1. `FreshMart Supermarket`
2. `Golden Suites Hotel`
3. `City Events Vendor`

### Products

Create these SKUs:

1. SKU: `BW-75CL-12`
   Name: `BlueDrop Bottle Water 75cl (12 pack)`
   Unit price: `2500`
   Reorder level: `30`
   Stock on hand: `120`

2. SKU: `BW-50CL-20`
   Name: `BlueDrop Bottle Water 50cl (20 pack)`
   Unit price: `3200`
   Reorder level: `25`
   Stock on hand: `90`

3. SKU: `BW-DISP-19L`
   Name: `BlueDrop Dispenser Water 19L`
   Unit price: `1800`
   Reorder level: `20`
   Stock on hand: `60`

### Service

1. Name: `Delivery within city`
   Price: `5000`

---

## 3. End-to-end business flow

Run these steps in order.

### A — Owner: team setup

1. Log in as owner.
2. Open **Team**.
3. Invite one user for each role from section 1.
4. Confirm invite emails are delivered.
5. Each invited user opens the invite email, clicks the invite link, sets password `BlueDrop2026!`, and reaches the dashboard.

### B — Owner or Admin: company review

1. Open **Company**.
2. If **Edit company** is available, update the legal name to `BlueDrop Bottled Water Distribution Ltd`.
3. Save changes.

### C — Inventory role: create catalog

Profile: `STOCK`

1. Open **Products**.
2. Click **Add product**.
3. Add product `BW-75CL-12` using the values in section 2.
4. Repeat for `BW-50CL-20`.
5. Repeat for `BW-DISP-19L`.
6. Open **Services**.
7. Click **Add service**.
8. Add `Delivery within city` with price `5000`.

### D — Inventory role: stock movement

Profile: `STOCK`

1. Open **Inventory**.
2. Click **Stock movement**.
3. Select **Stock in**.
4. Choose product `BlueDrop Bottle Water 75cl (12 pack)`.
5. Enter quantity `30`.
6. Enter unit cost `1800`.
7. Enter note `Restock from main depot`.
8. Click **Apply**.
9. Confirm the movement appears in **Stock movements**.

### E — Sales or Support: create customers

Profile: `SALES` or `SUP`

1. Open **Customers**.
2. Click **Add customer**.
3. Add:
   - `FreshMart Supermarket`
   - email `procurement@freshmart.test`
   - phone `+2348000001001`
4. Add:
   - `Golden Suites Hotel`
   - email `accounts@goldensuites.test`
   - phone `+2348000001002`
5. Add:
   - `City Events Vendor`
   - email `sales@cityevents.test`
   - phone `+2348000001003`

### F — Sales: quotation flow

Profile: `SALES`

1. Open **Quotations**.
2. Click **New quotation**.
3. Customer: `FreshMart Supermarket`
4. Add line 1:
   - Description: `BlueDrop Bottle Water 75cl (12 pack)`
   - Quantity: `20`
   - Unit price: `2500`
   - Tax: `0`
5. Add line 2:
   - Description: `Delivery within city`
   - Quantity: `1`
   - Unit price: `5000`
   - Tax: `0`
6. Save.
7. On the row menu **⋮**, click **Mark as sent**.
8. Confirm customer receives quotation email.
9. On the same row menu, click **Convert to invoice**.

### G — Accountant: invoice and payment

Profile: `ACC`

1. Open **Invoices**.
2. Find the invoice created from the quotation.
3. If it is still in draft, use row menu **⋮** → **Send invoice**.
4. Confirm customer receives invoice email.
5. Open **Payments**.
6. Click **Record payment**.
7. Customer: `FreshMart Supermarket`
8. Apply to the open invoice.
9. Amount: use a partial payment like `25000`.
10. Currency: `NGN`
11. Method: `bank_transfer`
12. Reference: `FM-PAY-001`
13. Click **Record**.
14. Confirm payment appears in the payments list.
15. Confirm customer receives payment email.

### H — Sales: direct sale

Profile: `SALES`

1. Open **Sales**.
2. Click **New sale**.
3. Select **Existing customer**.
4. Customer: `Golden Suites Hotel`
5. Add line:
   - Description: `BlueDrop Dispenser Water 19L`
   - Quantity: `10`
   - Unit price: `1800`
   - Tax: `0`
6. Click **Create draft**.
7. On the row menu **⋮**, click **Complete sale**.
8. Leave **Deduct inventory for product lines** enabled.
9. Confirm sale status changes from draft.

### I — Manager or Owner: supplier and purchase order

Profile: `MGR` or `OWNER`

1. Open **Suppliers**.
2. Click **Add supplier**.
3. Add `AquaPure Beverages Depot`.
4. Add `CrystalPack Wholesale`.
5. Open **Purchase orders**.
6. Click **New purchase order**.
7. Supplier: `AquaPure Beverages Depot`
8. Add one line:
   - Product: `BlueDrop Bottle Water 50cl (20 pack)`
   - Description: `Bulk restock for weekend dispatch`
   - Quantity: `40`
   - Unit cost: `2200`
9. Click **Create draft**.
10. Use row menu **⋮** → **Approve**.
11. Use row menu **⋮** → **Receive remaining**.
12. Confirm inventory is updated.

### J — Expense flow

Create one expense and approve it.

Profile: `ACC`

1. Open **Expenses**.
2. Click **New expense**.
3. Title: `Truck fuel for supermarket delivery`
4. Category: `travel`
5. Amount: `18000`
6. Currency: `NGN`
7. Save as draft.
8. Use row menu **⋮** → **Submit for approval**.

Profile: `OWNER`, `ADMIN`, or permitted `MGR`

9. Open **Expenses**.
10. Find the submitted expense.
11. Use row menu **⋮** → **Approve**.
12. Confirm submitter receives expense status email.

### K — Notifications

Any role:

1. Open **Notifications**.
2. Click **Mark all read**.

### L — Viewer access check

Profile: `VIEW`

1. Confirm **Customers**, **Invoices**, **Payments**, **Purchase orders**, and **Expenses** are not available for editing actions.
2. Confirm restricted modules are hidden or return permission-denied behavior.
3. Confirm **Settings** still allows that user to edit their own profile.

---

## 4. Screen-by-screen action reference

| Screen | Primary action | Row menu |
|---|---|---|
| Customers | **Add customer** | **Edit**, **Archive** |
| Suppliers | **Add supplier** | **Edit**, **Archive** |
| Products | **Add product** | **Edit**, **Archive** |
| Services | **Add service** | **Edit**, **Archive** |
| Quotations | **New quotation** | **Edit**, **Mark as sent**, **Convert to invoice** |
| Invoices | **New invoice** | **Edit draft**, **Send invoice** |
| Payments | **Record payment** | — |
| Sales | **New sale** | **Complete sale** |
| Purchase orders | **New purchase order** | **Approve**, **Receive remaining** |
| Expenses | **New expense** | **Submit for approval**, **Approve**, **Reject…** |
| Inventory | **Stock movement** | — |
| Notifications | **Mark all read** | — |
| Company | **Edit company** card when permitted | — |

---

## 5. Role expectations

- **Owner**: full access.
- **Admin**: broad operational and admin access.
- **Manager**: operational visibility and approvals, but not team invite by default.
- **Sales**: customers, quotations, invoices, sales.
- **Inventory**: products, services, inventory.
- **Accountant**: invoices, payments, expenses.
- **Support**: customer management only.
- **Viewer**: read-only style access, no operational mutation.

---

## 6. Failure checks

- If an invite does not send, the user should not remain as a successful invited account.
- If an invoice is not draft, **Send invoice** should not appear.
- If the role lacks access, action buttons should not be usable.
- If email is not received, verify SMTP, sender identity, and spam/quarantine.

---

*This document is tailored to a bottled water distributor operating with inventory, supplier purchasing, customer sales, invoicing, and payments.*
