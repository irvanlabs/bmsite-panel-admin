# Statistics & Analytics API

Client-facing visitor analytics and admin platform-wide analytics.

## GET /api/client/statistics

Get client analytics data.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Query | `range?` (`30d` \| `quarter` \| `custom`), `startDate?`, `endDate?` |

```json
{
  "metrics": [
    { "label": "Visitors", "value": 12430, "icon": "users", "trend": { "dir": "up", "value": 12 } }
  ],
  "visitorsSeries": [
    { "date": "2026-07-01", "visitors": 420, "unique": 380 }
  ],
  "devices": [
    { "label": "Desktop", "value": 65 },
    { "label": "Mobile", "value": 30 },
    { "label": "Tablet", "value": 5 }
  ],
  "trafficSources": [
    { "label": "Organic", "value": 45 },
    { "label": "Direct", "value": 30 },
    { "label": "Social", "value": 15 },
    { "label": "Referral", "value": 10 }
  ],
  "topContent": [
    { "path": "/home", "pageviews": 5200, "uniqueViews": 4100, "avgTime": 185, "trend": "up" }
  ]
}
```

**Related UI:** Client > Visitor Analytics

---

## GET /api/admin/analytics

Get platform-wide analytics for super admins.

| Detail | Value |
|--------|-------|
| Auth | Super Admin |
| Query | `range?`, `startDate?`, `endDate?` |

```json
{
  "metrics": [
    { "label": "Total Visitors", "value": 142000, "icon": "users", "trend": { "dir": "up", "value": 8 } }
  ],
  "visitorsSeries": [
    { "date": "2026-07-01", "active": 4200, "previous": 3900 }
  ],
  "devices": [
    { "label": "Desktop", "value": 60 },
    { "label": "Mobile", "value": 35 },
    { "label": "Tablet", "value": 5 }
  ],
  "trafficSources": [
    { "label": "Organic", "value": 40 },
    { "label": "Direct", "value": 25 },
    { "label": "Social", "value": 20 },
    { "label": "Referral", "value": 15 }
  ],
  "topContent": [
    { "path": "/home", "pageviews": 52000, "uniqueViews": 41000, "avgTime": 185, "trend": "up" }
  ]
}
```

**Related UI:** Admin > Analytics

---

## GET /api/admin/analytics/export

Export analytics report as CSV or PDF.

| Detail | Value |
|--------|-------|
| Auth | Super Admin |
| Query | `range?`, `format?` (`csv` \| `pdf`) |

**Response:** binary file with `Content-Disposition: attachment` header.

**Related UI:** Admin Analytics > Export button

## Related Components

| Component | File |
|-----------|------|
| Client Statistics | `app/pages/client/statistics.vue` |
| Admin Analytics | `app/pages/admin/analytics.vue` |
| AnalyticsHeader | shared component |
| MetricsGrid | shared component |
| DeviceBreakdownCard | shared component |
| TrafficSourcesCard | shared component |
| TopContentCard | shared component |
| LineChart | shared component |
| DonutChart | shared component |
