export interface AdminActivityLogEntry {
  id: number
  description: string
  causer: { id?: number, name?: string, email?: string } | null
  subject: { id?: number, type?: string } | null
  properties: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  causer_type?: string
  subject_type?: string
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchActivityLog(token: string, params: { per_page?: number, page?: number, date_from?: string, date_to?: string, causer_type?: string, subject_type?: string }): Promise<{ data: AdminActivityLogEntry[], meta: { current_page: number, last_page: number, per_page: number, total: number } }> {
  const qs = new URLSearchParams()
  if (params.per_page)
    qs.set('per_page', String(params.per_page))
  if (params.page)
    qs.set('page', String(params.page))
  if (params.date_from)
    qs.set('date_from', params.date_from)
  if (params.date_to)
    qs.set('date_to', params.date_to)
  if (params.causer_type)
    qs.set('causer_type', params.causer_type)
  if (params.subject_type)
    qs.set('subject_type', params.subject_type)

  const res = await $fetch<{ success: boolean, data: AdminActivityLogEntry[], meta?: { current_page: number, last_page: number, per_page: number, total: number } }>(
    `${apiBase()}/admin/activity-log?${qs.toString()}`,
    { headers: authHeaders(token) },
  )
  const data = res.data ?? []
  const meta = res.meta ?? { current_page: params.page ?? 1, last_page: 1, per_page: data.length, total: data.length }
  return { data, meta }
}
