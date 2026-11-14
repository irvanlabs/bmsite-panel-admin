export interface CouponRow {
  id: number
  code: string
  description: string | null
  discount_type: 'percent' | 'fixed'
  discount_value: string
  currency: string
  min_amount: number | null
  usage_limit: number | null
  usage_count: number
  usage_limit_per_user: number | null
  scope: 'all' | 'subscription' | 'domain'
  starts_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CouponInput {
  code: string
  description?: string | null
  discount_type: 'percent' | 'fixed'
  discount_value: number
  currency?: string
  min_amount?: number | null
  usage_limit?: number | null
  usage_limit_per_user?: number | null
  scope: 'all' | 'subscription' | 'domain'
  starts_at?: string | null
  expires_at?: string | null
  is_active?: boolean
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchCoupons(token: string, params?: { per_page?: number, page?: number }): Promise<{ data: CouponRow[], meta: { current_page: number, last_page: number, per_page: number, total: number } }> {
  const res = await $fetch<{ success: boolean, data: CouponRow[], meta: { current_page: number, last_page: number, per_page: number, total: number } }>(
    `${apiBase()}/admin/coupons`,
    { headers: authHeaders(token), params },
  )
  return { data: res.data, meta: res.meta }
}

export async function createCoupon(token: string, body: CouponInput): Promise<CouponRow> {
  const res = await $fetch<{ success: boolean, data: CouponRow }>(
    `${apiBase()}/admin/coupons`,
    { method: 'POST', headers: authHeaders(token), body },
  )
  return res.data
}

export async function updateCoupon(token: string, id: number, body: Partial<CouponInput>): Promise<CouponRow> {
  const res = await $fetch<{ success: boolean, data: CouponRow }>(
    `${apiBase()}/admin/coupons/${id}`,
    { method: 'PUT', headers: authHeaders(token), body },
  )
  return res.data
}

export async function deleteCoupon(token: string, id: number): Promise<void> {
  await $fetch(`${apiBase()}/admin/coupons/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}
