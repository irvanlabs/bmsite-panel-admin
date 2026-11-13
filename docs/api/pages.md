# Pages API

Client-facing endpoints for page management — listing, editing, publishing, and deleting pages.

## GET /api/client/pages

List all pages for the current client.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Query | `page?`, `perPage?`, `search?`, `status?` |

```json
{
  "data": [
    {
      "id": "page_01",
      "name": "Homepage",
      "slug": "home",
      "lastModified": "2026-07-20T10:30:00Z",
      "status": "published",
      "live": true,
      "seoScore": 92,
      "collaborators": [
        { "id": "user_01", "name": "Alice", "avatar": "https://..." }
      ]
    }
  ],
  "meta": { "page": 1, "perPage": 20, "total": 5 }
}
```

**Related UI:** Client > Pages Management

---

## GET /api/client/pages/:id

Get full page editor data.

| Detail | Value |
|--------|-------|
| Auth | Client |

```json
{
  "id": "page_01",
  "title": "Homepage",
  "status": "published",
  "visibility": "public",
  "slug": "home",
  "featuredImage": { "url": "https://..." },
  "content": "<h1>Welcome</h1>",
  "metaTitle": "Home | Brand",
  "metaDescription": "Welcome to our site",
  "socialTitle": "Home | Brand",
  "socialDescription": "Welcome to our site"
}
```

**Related UI:** Client > Page Editor

---

## POST /api/client/pages

Create a new page.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Body | `{ title, slug?, status?, visibility? }` |

```json
// Response 201
{ "id": "page_02", "title": "About", "slug": "about", "status": "draft" }
```

**Related UI:** Pages > Create Page button

---

## PUT /api/client/pages/:id

Save page editor content.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Body | `{ title?, content?, status?, visibility?, slug?, metaTitle?, metaDescription?, socialTitle?, socialDescription? }` |

```json
// Response 200
{ "id": "page_01", "title": "Homepage", "status": "published" }
```

**Related UI:** Page Editor > Save Draft / Publish buttons

---

## POST /api/client/pages/:id/upload-image

Upload featured image for a page.

| Detail | Value |
|--------|-------|
| Auth | Client |
| Body | multipart, field `"image"` |

**Constraints:** max 5MB, mime: `image/png`, `image/jpeg`, `image/webp`

```json
// Response 201
{ "url": "https://cdn.example.com/pages/page_01/hero.png" }
```

---

## DELETE /api/client/pages/:id

Delete a page.

| Detail | Value |
|--------|-------|
| Auth | Client |

```json
// Response 200
{ "deleted": true }
```

**Related UI:** Pages Management > delete confirm dialog

---

## GET /api/client/pages/:id/collaborators

List collaborators for the summary card.

| Detail | Value |
|--------|-------|
| Auth | Client |

```json
// Response 200
{ "collaborators": [{ "id": "user_01", "name": "Alice", "avatar": "https://..." }] }
```

## Related Components

| Component | File |
|-----------|------|
| Pages Management | `app/pages/client/pages.vue` |
| Page Editor | `app/pages/client/pages/[id].vue` |
| EditorHeader | shared component |
| EditorSidebar | shared component |
| FeaturedImageCard | shared component |
| ContentEditorCard | shared component |
| RichTextEditor | shared component |
| SeoPanel | shared component |
| PublishPanel | shared component |
| SocialPreviewCard | shared component |
