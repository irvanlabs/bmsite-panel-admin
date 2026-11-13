import type { TemplateResponse } from '~/services/shared/templates'
export { fetchTemplates } from '~/services/shared/templates'
export type { TemplateCategoryResponse, TemplateResponse } from '~/services/shared/templates'

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function createTemplate(token: string, payload: { name: string; slug?: string; description?: string; thumbnail_url: string; cdn_url: string; is_featured?: boolean; category_ids?: number[] }): Promise<TemplateResponse> {
  const res = await $fetch<{ success: boolean; data: TemplateResponse }>(
    `${apiBase()}/admin/templates`,
    { method: 'POST', headers: authHeaders(token), body: payload }
  )
  return res.data
}

export async function updateTemplate(token: string, id: number, payload: { name?: string; slug?: string; description?: string; thumbnail_url?: string; cdn_url?: string; is_featured?: boolean; category_ids?: number[] }): Promise<TemplateResponse> {
  const res = await $fetch<{ success: boolean; data: TemplateResponse }>(
    `${apiBase()}/admin/templates/${id}`,
    { method: 'PUT', headers: authHeaders(token), body: payload }
  )
  return res.data
}

export async function deleteTemplate(token: string, id: number): Promise<void> {
  await $fetch(`${apiBase()}/admin/templates/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export async function toggleFeatured(token: string, id: number, is_featured: boolean): Promise<TemplateResponse> {
  const res = await $fetch<{ success: boolean; data: TemplateResponse }>(
    `${apiBase()}/admin/templates/${id}/featured`,
    { method: 'PUT', headers: authHeaders(token), body: { is_featured } }
  )
  return res.data
}
