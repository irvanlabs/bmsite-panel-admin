export interface AdminSiteResponse {
  id: number
  user_id: number
  subdomain: string
  status: string
  owner_name: string
  owner_email: string
  plan: string | null
  pages_count: number
  created_at: string
  updated_at: string
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchAdminSites(token: string, params: { search?: string, status?: string, page?: number, per_page?: number }): Promise<{ data: AdminSiteResponse[], meta: { current_page: number, last_page: number, total: number } }> {
  const qs = new URLSearchParams()
  qs.set('per_page', String(params.per_page ?? 12))
  qs.set('sort', 'created_at')
  qs.set('direction', 'desc')
  if (params.search)
    qs.set('search', params.search)
  if (params.status && params.status !== '_all')
    qs.set('status', params.status)
  if (params.page)
    qs.set('page', String(params.page))

  const res = await $fetch<{ success: boolean, data: AdminSiteResponse[], meta: { current_page: number, last_page: number, per_page: number, total: number } }>(
    `${apiBase()}/admin/sites?${qs.toString()}`,
    { headers: authHeaders(token) },
  )
  return { data: res.data, meta: res.meta }
}

export async function fetchAdminSite(token: string, id: number): Promise<AdminSiteResponse> {
  const res = await $fetch<{ success: boolean, data: AdminSiteResponse }>(
    `${apiBase()}/admin/sites/${id}`,
    { headers: authHeaders(token) },
  )
  return res.data
}

export async function updateSiteStatus(token: string, id: number, status: string): Promise<AdminSiteResponse> {
  const res = await $fetch<{ success: boolean, data: AdminSiteResponse }>(
    `${apiBase()}/admin/sites/${id}/status`,
    { method: 'PUT', headers: authHeaders(token), body: { status } },
  )
  return res.data
}

export async function deleteSite(token: string, id: number): Promise<void> {
  await $fetch(`${apiBase()}/admin/sites/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}
