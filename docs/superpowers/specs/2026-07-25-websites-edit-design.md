# Websites + Edit Content — Replace Dummy with API

> Replace hardcoded website list and editor form with real CRUD against bmsite-api. Sites listed from `GET /api/v1/sites`, editor fetches `GET /api/v1/sites/{id}` and submits `PUT /api/v1/sites/{id}`. Image upload via presigned URL → R2.

**Goal:** `/client/websites` shows user's real sites. `/client/websites/{id}/edit` fetches and saves via API. Publish toggle sets `status: 'active'`/`'inactive'` — no build/deploy needed (ResolveController serves content immediately when published).

## Architecture Decisions

- **No new API endpoints needed** — all exist (`/sites`, `/sites/{id}`, `/upload/presigned-url`).
- **Images stored as URLs** in `settings.images[]` via presigned upload → R2.
- **Publish = `status: active`** — ResolveController uses `SiteStatus::ACTIVE` filter, so toggling status immediately gates visibility.
- **Vertical slice**: services → list page → edit page → upload → publish.

## Files

| File | Action |
|------|--------|
| `app/services/client/site.service.ts` | New — fetchSites, fetchSite, updateSite |
| `app/services/client/upload.service.ts` | New — getPresignedUrl, uploadToR2 |
| `app/pages/client/websites/index.vue` | Edit — fetch list from API |
| `app/pages/client/websites/[id]/edit.vue` | Edit — fetch detail, populate, submit |
| `app/components/editor/EditorTopNavigation.vue` | Edit — publish status badge + toggle |
| `app/components/shared/ImageUploader.vue` | Edit — accept string[] (URLs) too |
| `app/types/client/index.ts` | Edit — images: (File \| string)[] |
