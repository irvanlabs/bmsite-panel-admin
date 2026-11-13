# SEO API

## PUT /api/client/pages/:id/seo

Purpose: Update SEO metadata for a page.

Auth: Client

**Request Body:**
```json
{
  "metaTitle": "About Us - My Brand",
  "metaDescription": "Learn about our company mission and values.",
  "socialTitle": "About Us",
  "socialDescription": "Discover what drives us.",
  "slug": "about-us"
}
```

**Response 200:**
```json
{
  "id": "1",
  "metaTitle": "About Us - My Brand",
  "metaDescription": "Learn about our company mission and values.",
  "socialTitle": "About Us",
  "socialDescription": "Discover what drives us.",
  "slug": "about-us"
}
```

**Validation:**
| Field | Rules |
|---|---|
| metaTitle | max 60 characters |
| metaDescription | max 160 characters |

**Related UI:** Client > Page Editor > SEO panel (SeoPanel.vue), PropertiesPanel.vue, SocialPreviewCard.vue
