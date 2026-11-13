# Websites API

Website management endpoints for client users and super admins. Covers listing, creation, editor form, image uploads, and publish flow.

---

## Client Endpoints (My Websites)

### GET /api/client/websites

List all websites belonging to the current client user.

| Property | Value |
|----------|-------|
| **Auth** | Client |
| **Related UI** | Client > My Websites (`/client/websites`) |

#### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `perPage` | number | 10 | Items per page |
| `search` | string | — | Search by domain |

#### Response 200

```json
{
  "data": [
    {
      "id": "number",
      "domain": "string",
      "status": "string",
      "createdAt": "string"
    }
  ],
  "meta": {
    "page": "number",
    "perPage": "number",
    "total": "number"
  }
}
```

---

### POST /api/client/websites

Create a new website for the client.

| Property | Value |
|----------|-------|
| **Auth** | Client |
| **Related UI** | My Websites (future Create button) |

#### Request

```json
{
  "domain": "string",
  "templateId?": "number"
}
```

#### Response 201

```json
{
  "id": "number",
  "domain": "string",
  "status": "string"
}
```

---

### GET /api/client/websites/:id

Get full website editor data.

| Property | Value |
|----------|-------|
| **Auth** | Client |
| **Related UI** | Client > Website Editor (`/client/websites/[id]/edit`) |

#### Response 200

```json
{
  "id": "number",
  "domain": "string",
  "form": {
    "businessName": "string",
    "description": "string",
    "phone": "string",
    "address": "string",
    "images": [
      { "url": "string" }
    ]
  }
}
```

---

### PUT /api/client/websites/:id

Save website editor form data.

| Property | Value |
|----------|-------|
| **Auth** | Client |
| **Related UI** | Website Editor > Save button |

#### Request

Multipart form with fields:

| Field | Type | Required |
|-------|------|----------|
| `businessName` | string | No |
| `description` | string | No |
| `phone` | string | No |
| `address` | string | No |
| `images` | File[] | No |

#### Response 200

```json
{
  "id": "number",
  "domain": "string",
  "form": {
    "businessName": "string",
    "description": "string",
    "phone": "string",
    "address": "string",
    "images": [
      { "url": "string" }
    ]
  }
}
```

---

### POST /api/client/websites/:id/upload-image

Upload an image to the website editor.

| Property | Value |
|----------|-------|
| **Auth** | Client |
| **Related UI** | ImageUploader component in editor form |

#### Request

| Field | Type | Constraints |
|-------|------|-------------|
| `image` | File | max 5 MB, mime: `image/png`, `image/jpeg`, `image/webp` |

`Content-Type: multipart/form-data`

#### Response 201

```json
{
  "url": "string",
  "filename": "string"
}
```

---

### POST /api/client/websites/:id/publish

Publish website changes.

| Property | Value |
|----------|-------|
| **Auth** | Client |
| **Related UI** | Website Editor > Save (Publish action) |

#### Request

```json
{}
```

#### Response 200

```json
{
  "published": true,
  "url": "string"
}
```

---

## Admin Endpoints (Super Admin)

### GET /api/admin/websites

List all websites across the platform.

| Property | Value |
|----------|-------|
| **Auth** | Super Admin |
| **Related UI** | Admin > Websites list (`/admin/websites`) |

#### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number |
| `perPage` | number | Items per page |
| `search` | string | Search by domain |
| `status` | string | Filter by status |
| `plan` | string | Filter by plan |

#### Response 200

```json
{
  "data": [
    {
      "id": "number",
      "domain": "string",
      "owner": {
        "name": "string",
        "email": "string"
      },
      "plan": "string",
      "status": "string",
      "createdAt": "string"
    }
  ],
  "meta": {
    "page": "number",
    "perPage": "number",
    "total": "number"
  }
}
```

---

### GET /api/admin/websites/:id

Get website detail with owner info for the super admin editor.

| Property | Value |
|----------|-------|
| **Auth** | Super Admin |
| **Related UI** | Admin > Websites > Editor (`/admin/websites/[id]/editor`) — OwnerCard + Editor |

#### Response 200

```json
{
  "id": "number",
  "domain": "string",
  "owner": {
    "id": "number",
    "name": "string",
    "email": "string",
    "plan": "string"
  },
  "form": {
    "businessName": "string",
    "description": "string",
    "phone": "string",
    "address": "string",
    "images": [
      { "url": "string" }
    ]
  },
  "status": "string"
}
```

---

### PUT /api/admin/websites/:id

Save website editor data as super admin.

| Property | Value |
|----------|-------|
| **Auth** | Super Admin |
| **Related UI** | Admin > Websites Editor > Save |

#### Request

```json
{
  "businessName": "string",
  "description": "string",
  "phone": "string",
  "address": "string",
  "images": [
    { "url": "string" }
  ]
}
```

#### Response 200

```json
{
  "id": "number",
  "form": {
    "businessName": "string",
    "description": "string",
    "phone": "string",
    "address": "string",
    "images": [
      { "url": "string" }
    ]
  }
}
```

---

## Editor UI Components

Pages and components consuming these endpoints:

| Page | Path | Components |
|------|------|------------|
| My Websites list | `/client/websites` | Table/pagination |
| Client Website Editor | `/client/websites/[id]/edit` | EditorTopNavigation, EditorSidebar, EditorForm, WebsitePreview |
| Admin Websites list | `/admin/websites` | Table with owner/plan/status columns |
| Admin Website Editor | `/admin/websites/[id]/editor` | OwnerCard + same Editor components |

### EditorForm sub-components

| Component | Field |
|-----------|-------|
| BusinessNameField | `businessName` |
| DescriptionField | `description` |
| PhoneField | `phone` |
| AddressField | `address` |
| ImageUploader | `images[]` |