export interface AdminInvoiceResponse {
  id: number
  user_id: number
  invoice_number: string
  subtotal: number
  discount: number
  total: number
  currency: string
  status: string
  payment_method: string | null
  paid_at: string | null
  created_at: string
  items: { id: number; name: string; price: number; quantity: number; total: number }[]
  user?: { id: number; name: string; email: string } | null
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchAdminInvoices(token: string, params: { status?: string; page?: number; search?: string; date_from?: string; date_to?: string }): Promise<{ data: AdminInvoiceResponse[]; meta: { current_page: number; last_page: number; total: number } }> {
  const qs = new URLSearchParams()
  qs.set('per_page', '10')
  qs.set('sort', 'created_at')
  qs.set('direction', 'desc')
  if (params.status && params.status !== '_all') qs.set('status', params.status)
  if (params.page) qs.set('page', String(params.page))

  const res = await $fetch<{ success: boolean; data: AdminInvoiceResponse[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }>(
    `${apiBase()}/admin/invoices?${qs.toString()}`,
    { headers: authHeaders(token) }
  )
  return { data: res.data, meta: res.meta }
}
