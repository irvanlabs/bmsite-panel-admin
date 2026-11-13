# Auth API

Authentication and user profile endpoints. Used by login page, layouts (client/admin) with DashboardHeader sidebar footer, UserMenu dropdown, and client settings pages.

---

## POST /api/auth/login

Authenticate a user and return a session token.

| Property | Value |
|----------|-------|
| **Auth** | Public |
| **Related UI** | Auth > Login page |

### Request

```json
{
  "email": "string",
  "password": "string"
}
```

### Response 200

```json
{
  "token": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "avatar": "string|null",
    "role": "client | super_admin"
  }
}
```

### Response 401

```json
{
  "error": "Invalid credentials"
}
```

---

## POST /api/auth/logout

Invalidate the current session.

| Property | Value |
|----------|-------|
| **Auth** | Authenticated |
| **Related UI** | Sidebar footer / UserMenu dropdown logout |

### Request

*No body.*

### Response 200

```json
{
  "message": "Logged out"
}
```

---

## GET /api/auth/me

Get the currently authenticated user profile.

| Property | Value |
|----------|-------|
| **Auth** | Authenticated |
| **Related UI** | DashboardHeader, Sidebar footer (user display), all layouts |

### Response 200

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "avatar": "string|null",
  "role": "string",
  "settings": {}
}
```

---

## PUT /api/auth/me

Update current user profile.

| Property | Value |
|----------|-------|
| **Auth** | Authenticated |
| **Related UI** | Client Settings > Profile page |

### Request

```json
{
  "name?": "string",
  "email?": "string",
  "avatar?": "string"
}
```

### Response 200

```json
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "avatar": "string|null",
    "role": "string"
  }
}
```

---

## POST /api/auth/change-password

Change password for the current user.

| Property | Value |
|----------|-------|
| **Auth** | Authenticated |
| **Related UI** | Client Settings > Security > Change Password dialog |

### Request

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Response 200

```json
{
  "message": "Password changed successfully"
}
```

### Response 422

```json
{
  "error": "current password wrong"
}
```