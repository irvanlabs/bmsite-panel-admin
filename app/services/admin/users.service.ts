export interface AdminUserResponse {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  website: string | null
  plan: string | null
  plan_id: string | null
  payment_amount: number | null
  payment_date: string | null
  created_at: string
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchUsers(token: string, params: { search?: string, status?: string, role?: string, page?: number, per_page?: number, sort?: string, direction?: string }): Promise<{ data: AdminUserResponse[], meta: { current_page: number, last_page: number, total: number } }> {
  const qs = new URLSearchParams()
  qs.set('per_page', String(params.per_page ?? 10))
  if (params.search)
    qs.set('search', params.search)
  if (params.status && params.status !== '_all')
    qs.set('status', params.status)
  if (params.role && params.role !== '_all')
    qs.set('role', params.role)
  if (params.page)
    qs.set('page', String(params.page))
  if (params.sort)
    qs.set('sort', params.sort)
  if (params.direction)
    qs.set('direction', params.direction)

  const res = await $fetch<{ success: boolean, data: AdminUserResponse[], meta: { current_page: number, last_page: number, per_page: number, total: number } }>(
    `${apiBase()}/admin/users?${qs.toString()}`,
    { headers: authHeaders(token) },
  )
  return { data: res.data, meta: res.meta }
}

export async function fetchAdminUser(token: string, id: number): Promise<AdminUserResponse> {
  const res = await $fetch<{ success: boolean, data: AdminUserResponse }>(
    `${apiBase()}/admin/users/${id}`,
    { headers: authHeaders(token) },
  )
  return res.data
}

export async function createUser(token: string, payload: { name: string, email: string, phone?: string, password?: string, role?: string }): Promise<AdminUserResponse> {
  const res = await $fetch<{ success: boolean, data: AdminUserResponse }>(
    `${apiBase()}/admin/users`,
    { method: 'POST', headers: authHeaders(token), body: payload },
  )
  return res.data
}

export async function updateUserStatus(token: string, userId: number, status: string): Promise<AdminUserResponse> {
  const res = await $fetch<{ success: boolean, data: AdminUserResponse }>(
    `${apiBase()}/admin/users/${userId}/status`,
    { method: 'PUT', headers: authHeaders(token), body: { status } },
  )
  return res.data
}

export async function updateUserRole(token: string, userId: number, role: string): Promise<AdminUserResponse> {
  const res = await $fetch<{ success: boolean, data: AdminUserResponse }>(
    `${apiBase()}/admin/users/${userId}/role`,
    { method: 'PUT', headers: authHeaders(token), body: { role } },
  )
  return res.data
}
