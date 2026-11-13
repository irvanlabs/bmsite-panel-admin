# Users API

Admin User Directory (UserStatsCards, UserFilters, UserTable with DataTable) and User Detail (`[id]/index.vue` with UserProfileHeader, InfoCards, PaymentHistoryTable).

## List Users

### GET /api/admin/users

**Purpose:** List all platform users with pagination, search, filters.

**Auth:** Super Admin

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `perPage` | number | Items per page (default: 20) |
| `search` | string | Search by name or email |
| `status` | string | Filter by status |
| `plan` | string | Filter by plan |
| `sort` | string | Sort field and direction |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "usr_1",
      "name": "John Doe",
      "email": "john@acme.com",
      "avatar": "https://example.com/avatar.jpg",
      "website": "https://johns-site.com",
      "createdDate": "2026-01-15T08:00:00Z",
      "plan": "professional",
      "status": "active",
      "paymentAmount": 290000,
      "paymentDate": "2026-07-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 142
  }
}
```

**Related UI:** Admin > User Directory

---

## Get User

### GET /api/admin/users/:id

**Auth:** Super Admin

**Response `200`:**
```json
{
  "id": "usr_1",
  "name": "John Doe",
  "email": "john@acme.com",
  "phone": "+1234567890",
  "joined": "2026-01-15T08:00:00Z",
  "avatar": "https://example.com/avatar.jpg",
  "website": {
    "domain": "johns-site.com",
    "template": "portfolio",
    "status": "active"
  },
  "subscription": {
    "plan": "professional",
    "expiry": "2027-01-15T08:00:00Z",
    "renewal": "auto"
  },
  "adminNotes": "Prefers email contact.",
  "payments": [
    {
      "id": "pay_1",
      "invoice": "INV-2026-001",
      "date": "2026-07-01T10:00:00Z",
      "amount": 290000,
      "status": "paid"
    }
  ]
}
```

**Related UI:** Admin > User Detail

---

## Create User

### POST /api/admin/users

**Auth:** Super Admin

**Body:**
```json
{
  "name": "New User",
  "email": "new@acme.com",
  "phone": "+1234567890",
  "plan": "basic",
  "password": "temporary-pass"
}
```

`phone`, `plan`, `password` optional.

**Response `201`:**
```json
{
  "id": "usr_2",
  "name": "New User",
  "email": "new@acme.com"
}
```

**Related UI:** User Directory > New User button

---

## Suspend User

### POST /api/admin/users/:id/suspend

**Auth:** Super Admin

**Response `200`:**
```json
{
  "status": "suspended"
}
```

**Related UI:** User Detail > Suspend User button

---

## Extend Subscription

### POST /api/admin/users/:id/extend

**Auth:** Super Admin

**Body:**
```json
{
  "months": 6
}
```

**Response `200`:**
```json
{
  "newExpiry": "2027-07-15T08:00:00Z",
  "status": "active"
}
```

**Related UI:** User Detail > Extend Subscription button

---

## Update Admin Notes

### PUT /api/admin/users/:id/notes

**Auth:** Super Admin

**Body:**
```json
{
  "notes": "Prefers email contact. Upgraded to pro plan."
}
```

**Response `200`:**
```json
{
  "notes": "Prefers email contact. Upgraded to pro plan."
}
```

**Related UI:** User Detail > Admin Notes card

---

## User Invoices

### GET /api/admin/users/:id/invoices

**Auth:** Super Admin

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `perPage` | number | Items per page (default: 20) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "pay_1",
      "invoice": "INV-2026-001",
      "date": "2026-07-01T10:00:00Z",
      "amount": 290000,
      "status": "paid"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 5
  }
}
```

**Related UI:** User Detail > Payment History table
