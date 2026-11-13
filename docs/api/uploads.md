# Uploads API

All file upload across the platform.

## Upload File

### POST /api/upload

**Purpose:** Generic file upload endpoint used by ImageUploader, editor images, featured images.

**Auth:** Authenticated

**Body:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | Upload file (max 10MB) |

**Accepted MIME types:**

- `image/png`
- `image/jpeg`
- `image/webp`
- `application/zip` (templates only)

**Response `201`:**
```json
{
  "id": "upl_1",
  "url": "https://example.com/uploads/file.jpg",
  "filename": "file.jpg",
  "size": 204800,
  "mimeType": "image/jpeg"
}
```

### Errors

**`413` File too large:**
```json
{
  "error": "File too large"
}
```

**`422` Invalid file type:**
```json
{
  "error": "Invalid file type"
}
```

**Related UI:** ImageUploader, FeaturedImageCard, editor images, template ZIP
