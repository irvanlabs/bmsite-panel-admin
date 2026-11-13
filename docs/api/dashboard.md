# Dashboard API

Aggregated dashboard data endpoints. Client dashboard and super admin dashboard return all data in a single call each.

---

## GET /api/client/dashboard

Get all client dashboard data in one call.

| Property | Value |
|----------|-------|
| **Auth** | Authenticated (Client) |
| **Related UI** | Client > Dashboard |

**UI components consuming this response:**

- WelcomeBanner
- StatusCard (websites)
- DomainCard
- SubscriptionCard
- QuickActionsCard
- RecentActivityCard (Timeline)
- ProTipCard

### Response 200

```json
{
  "welcome": {
    "name": "string",
    "subtitle": "string"
  },
  "websites": [
    {
      "domain": "string",
      "status": "string"
    }
  ],
  "subscription": {
    "plan": "string",
    "renewalDate": "string",
    "status": "string"
  },
  "activities": [
    {
      "id": "number",
      "title": "string",
      "icon": "string",
      "timestamp": "string"
    }
  ],
  "quickActions": [
    {
      "label": "string",
      "link": "string"
    }
  ],
  "proTip": {
    "title": "string",
    "description": "string"
  }
}
```

---

## GET /api/admin/dashboard

Get all super admin dashboard data in one call.

| Property | Value |
|----------|-------|
| **Auth** | Super Admin |
| **Related UI** | Admin > Dashboard |

**UI components consuming this response:**

- DashboardToolbar
- DashboardMetrics
- RevenueChart
- UserGrowthChart
- RecentOrdersTable

### Response 200

```json
{
  "metrics": [
    {
      "label": "string",
      "value": "string|number",
      "icon": "string",
      "change": "number",
      "changeDir": "up | down"
    }
  ],
  "revenueSeries": [
    {
      "date": "string",
      "revenue": "number"
    }
  ],
  "userGrowth": [
    {
      "month": "string",
      "users": "number"
    }
  ],
  "recentOrders": [
    {
      "id": "number",
      "customer": "string",
      "plan": "string",
      "amount": "number",
      "date": "string",
      "status": "string"
    }
  ]
}
```