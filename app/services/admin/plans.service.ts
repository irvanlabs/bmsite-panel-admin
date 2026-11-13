export interface AdminPlanResponse {
  id: number
  name: string
  description: string | null
  price_monthly: number
  price_yearly: number | null
  currency: string
  is_popular: boolean
  limits: Record<string, unknown> | null
  features: string[] | null
  created_at: string
  updated_at: string
}

export interface AdminPlanPayload {
  name: string
  description?: string | null
  price_monthly: number
  price_yearly?: number | null
  currency: string
  is_popular?: boolean
  features?: string[] | null
  limits?: Record<string, unknown> | null
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchAdminPlans(token: string): Promise<AdminPlanResponse[]> {
  const res = await $fetch<{ success: boolean, data: AdminPlanResponse[] }>(
    `${apiBase()}/plans`,
    { headers: authHeaders(token) },
  )
  return res.data
}

export async function createAdminPlan(token: string, payload: AdminPlanPayload): Promise<AdminPlanResponse> {
  const res = await $fetch<{ success: boolean, data: AdminPlanResponse }>(
    `${apiBase()}/admin/plans`,
    { method: 'POST', headers: authHeaders(token), body: payload },
  )
  return res.data
}

export async function updateAdminPlan(token: string, id: number, payload: AdminPlanPayload): Promise<AdminPlanResponse> {
  const res = await $fetch<{ success: boolean, data: AdminPlanResponse }>(
    `${apiBase()}/admin/plans/${id}`,
    { method: 'PUT', headers: authHeaders(token), body: payload },
  )
  return res.data
}

export async function deleteAdminPlan(token: string, id: number): Promise<void> {
  await $fetch(`${apiBase()}/admin/plans/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}
