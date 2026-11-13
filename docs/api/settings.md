# Settings API

Client Settings pages: profile, security (change-password/2fa/sessions/logins), notifications, team, api-keys.

## Profile

### GET /api/client/settings/profile

**Auth:** Client

**Response `200`:**
```json
{
  "companyName": "Acme Inc",
  "ownerName": "John Doe",
  "email": "john@acme.com",
  "phone": "+1234567890",
  "website": "https://acme.com",
  "timeze": "UTC",
  "language": "en"
}
```

### PUT /api/client/settings/profile

**Auth:** Client

**Body:**
```json
{
  "companyName": "Acme Inc",
  "ownerName": "John Doe",
  "email": "john@acme.com",
  "phone": "+1234567890",
  "website": "https://acme.com",
  "timeze": "UTC",
  "language": "en"
}
```

All fields optional.

**Response `200`:**
```json
{
  "profile": { "companyName": "Acme Inc", "ownerName": "John Doe", "email": "john@acme.com", "phone": "+1234567890", "website": "https://acme.com", "timeze": "UTC", "language": "en" }
}
```

**Related UI:** Client Settings > Profile section

---

## Security

### GET /api/client/settings/security

**Auth:** Client

**Response `200`:**
```json
{
  "twoFactorEnabled": false,
  "sessions": [
    { "id": "sess_1", "device": "Chrome on macOS", "location": "Jakarta, ID", "current": true }
  ],
  "logins": [
    { "id": "log_1", "device": "Chrome on macOS", "location": "Jakarta, ID", "date": "2026-07-20T10:30:00Z" }
  ]
}
```

### POST /api/client/settings/security/change-password

**Auth:** Client

**Body:**
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

**Response `200`:**
```json
{
  "message": "Password changed successfully"
}
```

### POST /api/client/settings/security/toggle-2fa

**Auth:** Client

**Body:**
```json
{
  "enabled": true
}
```

**Response `200`:**
```json
{
  "twoFactorEnabled": true
}
```

### POST /api/client/settings/security/logout-all

**Auth:** Client

**Response `200`:**
```json
{
  "message": "All other sessions logged out"
}
```

---

## Notifications

### GET /api/client/settings/notifications

**Auth:** Client

**Response `200`:**
```json
{
  "email": true,
  "billing": true,
  "website": false,
  "marketing": false,
  "system": true
}
```

### PUT /api/client/settings/notifications

**Auth:** Client

**Body (all fields optional):**
```json
{
  "email": true,
  "billing": true,
  "website": false,
  "marketing": false,
  "system": true
}
```

**Response `200`:**
```json
{
  "prefs": { "email": true, "billing": true, "website": false, "marketing": false, "system": true }
}
```

---

## Team

### GET /api/client/settings/team

**Auth:** Client

**Response `200`:**
```json
{
  "members": [
    { "id": "mem_1", "name": "Jane Doe", "email": "jane@acme.com", "role": "admin", "avatar": "https://example.com/avatar.jpg" }
  ]
}
```

### POST /api/client/settings/team/invite

**Auth:** Client

**Body:**
```json
{
  "email": "newmember@acme.com",
  "role": "admin"
}
```

Role: `admin`, `editor`, or `viewer`.

**Response `201`:**
```json
{
  "member": { "id": "mem_2", "name": null, "email": "newmember@acme.com", "role": "admin", "avatar": null }
}
```

**Related UI:** Team section > Invite Member dialog

### DELETE /api/client/settings/team/:memberId

**Auth:** Client

**Response `200`:**
```json
{
  "removed": true
}
```

**Related UI:** Team section > Remove dropdown

---

## API Keys

### GET /api/client/settings/api-keys

**Auth:** Client

**Response `200`:**
```json
{
  "keys": [
    { "id": "key_1", "name": "Production", "key": "bms_...abc123", "lastUsed": "2026-07-19T08:00:00Z" }
  ]
}
```

### POST /api/client/settings/api-keys

**Auth:** Client

**Body:**
```json
{
  "name": "Production"
}
```

**Response `201`:** Full key shown once only.
```json
{
  "id": "key_2",
  "name": "Production",
  "key": "bms_sk_prod_abc123def456"
}
```

### DELETE /api/client/settings/api-keys/:id

**Auth:** Client

**Response `200`:**
```json
{
  "revoked": true
}
```
