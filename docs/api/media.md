# Media API

## GET /api/media

Purpose: List uploaded media for the authenticated user.

Auth: Authenticated

Query: page?, perPage?, type? (image|zip)

**Response 200:**
```json
{
  "data": [
    {
      "id": "m1",
      "url": "https://cdn.bmsite.app/uploads/logo.png",
      "filename": "logo.png",
      "size": 245000,
      "mimeType": "image/png",
      "createdAt": "2026-07-14T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "perPage": 20, "total": 45 }
}
```

**Related UI:** ImageUploader.vue, FeaturedImageCard.vue, editor image fields

## DELETE /api/media/:id

Purpose: Delete a previously uploaded media asset.

Auth: Authenticated

**Response 200:**
```json
{ "deleted": true }
```
