export interface TemplateCategoryResponse {
  id: number
  name: string
  slug: string
}

export interface TemplateResponse {
  id: number
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  cdn_url: string | null
  is_featured: boolean
  lighthouse_score: number | null
  wcag_compliant: boolean
  categories: TemplateCategoryResponse[]
  created_at: string
  updated_at: string
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

// Public template catalog (GET /templates, no auth) — safe for both builds.
export async function fetchTemplates(params: { search?: string; category?: string; featured?: boolean; page?: number; sort?: string }): Promise<{ data: TemplateResponse[]; meta: { current_page: number; last_page: number; total: number } }> {
  const qs = new URLSearchParams()
  qs.set('per_page', '12')
  if (params.search) qs.set('search', params.search)
  if (params.category && params.category !== 'all') qs.set('category', params.category)
  if (params.featured) qs.set('featured', '1')
  if (params.page) qs.set('page', String(params.page))
  if (params.sort) qs.set('sort', params.sort)
  qs.set('direction', 'desc')

  const res = await $fetch<{ success: boolean; data: TemplateResponse[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }>(
    `${apiBase()}/templates?${qs.toString()}`
  )
  return { data: res.data, meta: res.meta }
}
