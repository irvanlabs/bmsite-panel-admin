# Billing API

Client-facing billing endpoints — plan management, usage tracking, and invoice operations.

## GET /api/client/billing

Get billing overview for the current client.

| Detail | Value |
|--------|-------|
| Auth | Client |

```json
{
  "plan": {
    "tier": "professional",
    "name": "Professional",
    "monthlyPrice": 29,
    "renewalDate": "2026-08-01",
    "status": "active"
  },
  "usage": [
    { "icon": "hard-drive", "title": "Storage", "current": 2.4, "maximum": 10, "unit": "GB" },
    { "icon": "users", "title": "Team Members", "current": 3, "maximum": 5, "unit": "seats" },
    { "icon": "activity", "title": "API Calls", "current": 8500, "maximum": 50000, "unit": "reqs" }
  ],
  "invoices": [
    { "id": "inv_01", "date": "2026-07-01", "amount": 29, "status": "paid" },
    { "id": "inv_02", "date": "2026-06-01", "amount": 29, "status": "paid" }
  ]
}
```

**Related UI:** Client > Billing

---

## POST /api/client/billing/upgrade

Initiate a plan upgrade.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Body | `{ plan: 'starter' \| 'professional' \| 'enterprise' }` |

```json
// Response 200
{ "checkoutUrl": "https://checkout.stripe.com/pay/cs_..." }
```

**Related UI:** ActiveSubscriptionCard > Upgrade Plan button

---

## GET /api/client/billing/invoices

List all invoices with pagination.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Query | `page?`, `perPage?`, `status?` |

```json
{
  "data": [
    { "id": "inv_01", "date": "2026-07-01", "amount": 29, "status": "paid" }
  ],
  "meta": { "page": 1, "perPage": 20, "total": 6 }
}
```

**Related UI:** BillingHistoryCard

---

## GET /api/client/billing/invoices/:id/download

Download invoice PDF.

| Detail | Value |
|--------|-------|
| Auth | Client |

**Response:** binary (`application/pdf`)

**Related UI:** Invoice row > Download Invoice dropdown

---

## POST /api/client/billing/invoices/:id/pay

Pay a pending invoice.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Body | `{ paymentMethodId? }` |

```json
// Response 200
{ "id": "inv_03", "status": "paid" }
```

**Related UI:** Invoice row > Pay Now (pending only)

## Related Components

| Component | File |
|-----------|------|
| Billing page | `app/pages/client/billing.vue` |
| ActiveSubscriptionCard | shared component |
| UsageGrid | shared component |
| BillingHistoryCard | shared component |
| DataTable | shared component |
