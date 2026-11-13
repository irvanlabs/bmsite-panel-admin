# API Summary — BMSite Panel

## Endpoints by Module

### Auth (`auth.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 1 | POST | `/api/auth/login` | 🟡 Needs Backend |
| 2 | POST | `/api/auth/logout` | 🟡 Needs Backend |
| 3 | GET | `/api/auth/me` | 🟡 Needs Backend |
| 4 | PUT | `/api/auth/me` | 🟡 Needs Backend |
| 5 | POST | `/api/auth/change-password` | 🟡 Needs Backend |

### Dashboard (`dashboard.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 6 | GET | `/api/client/dashboard` | 🟡 Needs Backend |
| 7 | GET | `/api/admin/dashboard` | 🟡 Needs Backend |

### Websites (`websites.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 8 | GET | `/api/client/websites` | 🟡 Needs Backend |
| 9 | POST | `/api/client/websites` | 🟡 Needs Backend |
| 10 | GET | `/api/client/websites/:id` | 🟡 Needs Backend |
| 11 | PUT | `/api/client/websites/:id` | 🟡 Needs Backend |
| 12 | POST | `/api/client/websites/:id/upload-image` | 🟡 Needs Backend |
| 13 | POST | `/api/client/websites/:id/publish` | 🟡 Needs Backend |
| 14 | GET | `/api/admin/websites` | 🟡 Needs Backend |
| 15 | GET | `/api/admin/websites/:id` | 🟡 Needs Backend |
| 16 | PUT | `/api/admin/websites/:id` | 🟡 Needs Backend |

### Pages (`pages.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 17 | GET | `/api/client/pages` | 🟡 Needs Backend |
| 18 | GET | `/api/client/pages/:id` | 🟡 Needs Backend |
| 19 | POST | `/api/client/pages` | 🟡 Needs Backend |
| 20 | PUT | `/api/client/pages/:id` | 🟡 Needs Backend |
| 21 | POST | `/api/client/pages/:id/upload-image` | 🟡 Needs Backend |
| 22 | DELETE | `/api/client/pages/:id` | 🟡 Needs Backend |
| 23 | GET | `/api/client/pages/:id/collaborators` | 🟡 Needs Backend |

### SEO (`seo.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 24 | PUT | `/api/client/pages/:id/seo` | 🟡 Needs Backend |

### Statistics / Analytics (`statistics.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 25 | GET | `/api/client/statistics` | 🟡 Needs Backend |
| 26 | GET | `/api/admin/analytics` | 🟡 Needs Backend |
| 27 | GET | `/api/admin/analytics/export` | 🟡 Needs Backend |

### Billing (`billing.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 28 | GET | `/api/client/billing` | 🟡 Needs Backend |
| 29 | POST | `/api/client/billing/upgrade` | 🟡 Needs Backend |
| 30 | GET | `/api/client/billing/invoices` | 🟡 Needs Backend |
| 31 | GET | `/api/client/billing/invoices/:id/download` | 🟡 Needs Backend |
| 32 | POST | `/api/client/billing/invoices/:id/pay` | 🟡 Needs Backend |

### Settings (`settings.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 33 | GET | `/api/client/settings/profile` | 🟡 Needs Backend |
| 34 | PUT | `/api/client/settings/profile` | 🟡 Needs Backend |
| 35 | GET | `/api/client/settings/security` | 🟡 Needs Backend |
| 36 | POST | `/api/client/settings/security/change-password` | 🟡 Needs Backend |
| 37 | POST | `/api/client/settings/security/toggle-2fa` | 🟡 Needs Backend |
| 38 | POST | `/api/client/settings/security/logout-all` | 🟡 Needs Backend |
| 39 | GET | `/api/client/settings/notifications` | 🟡 Needs Backend |
| 40 | PUT | `/api/client/settings/notifications` | 🟡 Needs Backend |
| 41 | GET | `/api/client/settings/team` | 🟡 Needs Backend |
| 42 | POST | `/api/client/settings/team/invite` | 🟡 Needs Backend |
| 43 | DELETE | `/api/client/settings/team/:memberId` | 🟡 Needs Backend |

### API Keys (`settings.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 44 | GET | `/api/client/settings/api-keys` | 🟡 Needs Backend |
| 45 | POST | `/api/client/settings/api-keys` | 🟡 Needs Backend |
| 46 | DELETE | `/api/client/settings/api-keys/:id` | 🟡 Needs Backend |

### Users (Admin) (`users.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 47 | GET | `/api/admin/users` | 🟡 Needs Backend |
| 48 | GET | `/api/admin/users/:id` | 🟡 Needs Backend |
| 49 | POST | `/api/admin/users` | 🟡 Needs Backend |
| 50 | POST | `/api/admin/users/:id/suspend` | 🟡 Needs Backend |
| 51 | POST | `/api/admin/users/:id/extend` | 🟡 Needs Backend |
| 52 | PUT | `/api/admin/users/:id/notes` | 🟡 Needs Backend |
| 53 | GET | `/api/admin/users/:id/invoices` | 🟡 Needs Backend |

### Templates (Admin) (`templates.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 54 | GET | `/api/admin/templates` | 🟡 Needs Backend |
| 55 | POST | `/api/admin/templates` | 🟡 Needs Backend |
| 56 | GET | `/api/admin/templates/:id` | 🟡 Needs Backend |
| 57 | PUT | `/api/admin/templates/:id` | 🟡 Needs Backend |
| 58 | POST | `/api/admin/templates/:id/upload-media` | 🟡 Needs Backend |
| 59 | POST | `/api/admin/templates/:id/duplicate` | 🟡 Needs Backend |
| 60 | DELETE | `/api/admin/templates/:id` | 🟡 Needs Backend |
| 61 | POST | `/api/admin/templates/:id/publish` | 🟡 Needs Backend |
| 62 | POST | `/api/admin/templates/:id/archive` | 🟡 Needs Backend |
| 63 | POST | `/api/admin/templates/:id/feature` | 🟡 Needs Backend |

### Super Admin Platform (`super-admin.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 64 | GET | `/api/admin/platform/stats` | 🟡 Needs Backend |
| 65 | GET | `/api/admin/platform/export` | 🟡 Needs Backend |

### Upload / Media (`uploads.md`, `media.md`)
| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 66 | POST | `/api/upload` | 🟡 Needs Backend |
| 67 | GET | `/api/media` | 🟡 Needs Backend |
| 68 | DELETE | `/api/media/:id` | 🟡 Needs Backend |

---

## Implementation Priority

| Priority | Module | Rationale |
|---|---|---|
| **P0** | Auth | Required for all other endpoints |
| **P1** | Dashboard + Websites | Core client product |
| **P1** | Upload + Media | Needed by websites, pages, templates |
| **P2** | Pages + SEO | Content management |
| **P2** | Billing | Revenue |
| **P3** | Statistics / Analytics | Value-add insights |
| **P3** | Settings (all subsections) | Account management |
| **P4** | Users (Admin) | Platform operations |
| **P4** | Templates (Admin) | Template marketplace |
| **P5** | Super Admin export | Reporting |

## Authentication Flow

```
POST /api/auth/login → token
     ↓
All endpoints: Authorization: Bearer <token>
     ↓
Role check: client → /client/* routes
            super_admin → /admin/* routes
     ↓
POST /api/auth/logout → invalidate token
```

## Editor Flow

```
GET /client/websites/:id     → load editor state
GET /client/pages/:id        → load page editor state
POST /upload                 → upload images
PUT /client/websites/:id     → save website
PUT /client/pages/:id        → save page
PUT /client/pages/:id/seo    → save SEO metadata
POST /client/websites/:id/publish → go live
```

## Dependency Graph

```
Auth
 ├── Dashboard (client + admin)
 ├── Websites (client + admin)
 │    └── Upload / Media
 ├── Pages
 │    ├── SEO
 │    └── Upload / Media
 ├── Statistics / Analytics
 ├── Billing
 ├── Settings
 │    ├── Profile
 │    ├── Security
 │    ├── Notifications
 │    ├── Team
 │    └── API Keys
 ├── Users (Admin)
 └── Templates (Admin)
      └── Upload / Media
```

## Coverage

| UI Page | Endpoints | Status |
|---|---|---|
| Client Dashboard | 6 | 🟡 |
| Client Billing | 28, 29, 30, 31, 32 | 🟡 |
| Client Visitor Analytics | 25 | 🟡 |
| Client Pages Management | 17, 22, 23 | 🟡 |
| Client Page Editor | 18, 20, 21, 24 | 🟡 |
| Client Settings: Profile | 33, 34 | 🟡 |
| Client Settings: Security | 35, 36, 37, 38 | 🟡 |
| Client Settings: Notifications | 39, 40 | 🟡 |
| Client Settings: Team | 41, 42, 43 | 🟡 |
| Client Settings: API Keys | 44, 45, 46 | 🟡 |
| Admin Dashboard | 7, 64, 65 | 🟡 |
| Admin Analytics | 26, 27 | 🟡 |
| Admin User Directory | 47, 49 | 🟡 |
| Admin User Detail | 48, 50, 51, 52, 53 | 🟡 |
| Admin Templates | 54–63 | 🟡 |
| Admin Websites Editor | 14, 15, 16 | 🟡 |
| Website Editor (Client) | 8–13 | 🟡 |
| Auth (Login) | 1, 2, 3, 4, 5 | 🟡 |

**Total: 68 endpoints. Status: 0 existing, 68 need backend, 0 missing.**
