# Super Admin Platform API

## GET /api/admin/platform/stats

Purpose: Get aggregate platform metrics.

Auth: Super Admin

**Response 200:**
```json
{
  "users": "12.4k",
  "activeUsers": "10.2k",
  "pendingUsers": "450",
  "expiredUsers": "1.2k",
  "newUsers": "850",
  "payingUsers": "8.9k",
  "websites": "8,920",
  "mrr": "$142,500"
}
```

**Related UI:** Admin > Dashboard metrics

## GET /api/admin/platform/export

Purpose: Export platform data as CSV.

Auth: Super Admin

Query: type? (users|websites|billing), range? (30d|quarter|custom), startDate?, endDate?

**Response 200:** binary file (text/csv)

**Related UI:** Admin Dashboard > Export button, Admin User Directory > Export CSV button
