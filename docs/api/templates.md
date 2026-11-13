# Templates API

Template Management (Grid, Upload, Edit, Preview, Delete, Duplicate dialogs).

## List Templates

### GET /api/admin/templates

**Auth:** Super Admin

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `perPage` | number | Items per page (default: 20) |
| `search` | string | Search by name or description |
| `category` | string | Filter by category |
| `sort` | string | Sort field and direction |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "tmpl_1",
      "name": "Modern Portfolio",
      "slug": "modern-portfolio",
      "category": "portfolio",
      "description": "A clean portfolio template for creatives.",
      "thumbnail": "https://example.com/thumbs/modern-portfolio.jpg",
      "status": "published",
      "featured": true,
      "downloads": 1240,
      "rating": 4.8,
      "lastUpdated": "2026-07-18T14:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 45
  }
}
```

**Related UI:** Admin > Template Management

---

## Create Template

### POST /api/admin/templates

**Auth:** Super Admin

**Body:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Template name |
| `slug` | string | URL slug |
| `category` | string | Template category |
| `description` | string | Template description |
| `thumbnail` | file | Thumbnail image |
| `previews` | files[] | Preview images |
| `zip` | file | Template ZIP archive |
| `status` | string | Optional, default: `draft` |
| `featured` | boolean | Optional, default: `false` |

**Response `201`:**
```json
{
  "id": "tmpl_2",
  "name": "Modern Portfolio",
  "slug": "modern-portfolio"
}
```

**Related UI:** Template Management > Upload Template dialog

---

## Get Template

### GET /api/admin/templates/:id

**Auth:** Super Admin

**Response `200`:**
```json
{
  "id": "tmpl_1",
  "name": "Modern Portfolio",
  "slug": "modern-portfolio",
  "category": "portfolio",
  "description": "A clean portfolio template for creatives.",
  "thumbnail": "https://example.com/thumbs/modern-portfolio.jpg",
  "previews": [
    "https://example.com/previews/modern-1.jpg",
    "https://example.com/previews/modern-2.jpg"
  ],
  "status": "published",
  "featured": true
}
```

---

## Update Template

### PUT /api/admin/templates/:id

**Auth:** Super Admin

**Body (all fields optional):**
```json
{
  "name": "Modern Portfolio v2",
  "slug": "modern-portfolio-v2",
  "category": "portfolio",
  "description": "Updated description.",
  "status": "published",
  "featured": true
}
```

**Response `200`:**
```json
{
  "id": "tmpl_1"
}
```

**Related UI:** Template > Edit dialog

---

## Upload Template Media

### POST /api/admin/templates/:id/upload-media

**Auth:** Super Admin

**Body:** `multipart/form-data`

Either `thumbnail` (single file) or `preview` (multiple files).

| Field | Type | Description |
|-------|------|-------------|
| `thumbnail` | file | Replace thumbnail image |
| `preview` | files[] | Add preview images |

**Response `200`:**
```json
{
  "url": "https://example.com/media/new-thumbnail.jpg"
}
```

---

## Duplicate Template

### POST /api/admin/templates/:id/duplicate

**Auth:** Super Admin

**Response `201`:**
```json
{
  "id": "tmpl_3",
  "name": "Modern Portfolio (Copy)",
  "status": "draft"
}
```

**Related UI:** Template > Duplicate confirm dialog

---

## Delete Template

### DELETE /api/admin/templates/:id

**Auth:** Super Admin

**Response `200`:**
```json
{
  "deleted": true,
  "softDelete": true
}
```

**Related UI:** Template > Delete confirm dialog

---

## Publish Template

### POST /api/admin/templates/:id/publish

**Auth:** Super Admin

**Response `200`:**
```json
{
  "status": "published"
}
```

---

## Archive Template

### POST /api/admin/templates/:id/archive

**Auth:** Super Admin

**Response `200`:**
```json
{
  "status": "archived",
  "visibility": false
}
```

---

## Feature Template

### POST /api/admin/templates/:id/feature

**Auth:** Super Admin

**Response `200`:**
```json
{
  "featured": true,
  "status": "featured"
}
```
