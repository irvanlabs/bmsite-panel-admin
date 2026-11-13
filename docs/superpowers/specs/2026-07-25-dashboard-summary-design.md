# Dashboard Summary — Replace Dummy Data with API

> Replace hardcoded dashboard data (status, domain, subscription) with live API data from bmsite-api.

**Goal:** The /client dashboard fetches real data from `GET /api/v1/dashboard-summary` instead of using hardcoded values. Site selector dropdown lets users switch between their sites. "View Live Site" links to the actual domain.

## Architecture Decisions

- **New API endpoint** (`GET /api/v1/dashboard-summary`) in bmsite-api — aggregates site list, selected site detail (status + primary domain), and active subscription. No activity log (deferred to separate task).
- **Site selector** — dropdown in the dashboard page. Defaults to most recently updated site. Changing it re-fetches with `?site_id=`.
- **Token passed explicitly** via Bearer header, same pattern as existing auth service.

## API Contract

```
GET /api/v1/dashboard-summary?site_id=<optional>
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "sites": [
      { "id": "uuid", "subdomain": "mysite", "status": "active", "primary_domain": "mysite.com" }
    ],
    "selected_site": {
      "id": "uuid", "subdomain": "mysite", "status": "active", "primary_domain": "mysite.com"
    },
    "subscription": {
      "status": "active", "plan": "Pro", "renewal_date": "2026-08-01"
    }
  }
}
```

**If user has no sites:** `sites: []`, `selected_site: null`, `subscription: null`.
**If no active subscription:** `subscription: null`.
**If no primary domain:** `primary_domain` is the subdomain fallback (e.g., `mysite.bmsite.app`).

## Files

### bmsite-api

| File | Action |
|------|--------|
| `app/Http/Controllers/Api/V1/DashboardController.php` | **New** — handles the endpoint |
| `routes/api.php` | **Edit** — add route |

### bmsite-panel

| File | Action |
|------|--------|
| `app/services/client/dashboard.service.ts` | **New** — fetchDashboardSummary |
| `app/pages/client/index.vue` | **Edit** — fetch on mount, site selector, pass data |
| `app/components/dashboard/QuickActionsCard.vue` | **Edit** — accept `liveUrl` prop instead of hardcoded URL |
| `app/components/shared/WelcomeBanner.vue` | **Edit** — use auth user name |
