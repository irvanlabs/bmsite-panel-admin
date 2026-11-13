# Pages CRUD — Wire to bmsite-api

> Replace hardcoded page data with real CRUD against `GET/POST/PUT/DELETE /sites/{siteId}/pages`.

**Goal:** `/client/pages` lists user's real pages, create/edit/delete via API. Site context from global `useSelectedSite` composable.

## Architecture Decisions

- **No backend changes** — all endpoints exist.
- **`useSelectedSite` via `useState('selectedSite')`** — dashboard site selector writes it, pages page reads it.
- **PublishPanel restricted to `draft`/`published`** — matching API (only 2 PageStatus values).
- **`scheduled`/`archived`** not supported by API yet — removed from UI for now.
- **`content` stored as JSON array** — matches API's `content: 'required|array'`.

## Files

| File | Action |
|------|--------|
| `app/composables/shared/useSelectedSite.ts` | New |
| `app/services/client/page.service.ts` | New |
| `app/pages/client/index.vue` | Edit — sync selection |
| `app/pages/client/pages.vue` | Edit — fetch, create, delete |
| `app/pages/client/pages/[id].vue` | Edit — fetch, save |
| `app/components/editor/PublishPanel.vue` | Edit — restrict statuses |
