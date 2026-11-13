import type { WithdrawalRow } from '~/types/shared'

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export type { WithdrawalRow }

export async function fetchAdminWithdrawals(
  token: string,
  params: { status?: string, page?: number, per_page?: number, sort?: string, direction?: string },
): Promise<{ data: WithdrawalRow[], meta: { current_page: number, last_page: number, per_page: number, total: number, sort?: string, direction?: string } }> {
  const qs = new URLSearchParams()
  qs.set('per_page', String(params.per_page ?? 10))
  if (params.status && params.status !== '_all')
    qs.set('status', params.status)
  if (params.page)
    qs.set('page', String(params.page))
  if (params.sort)
    qs.set('sort', params.sort)
  if (params.direction)
    qs.set('direction', params.direction)

  const res = await $fetch<{ success: boolean, data: WithdrawalRow[], meta: { current_page: number, last_page: number, per_page: number, total: number, sort?: string, direction?: string } }>(
    `${apiBase()}/admin/withdrawals?${qs.toString()}`,
    { headers: authHeaders(token) },
  )
  return { data: res.data, meta: res.meta }
}

export async function updateWithdrawalStatus(
  token: string,
  id: number,
  status: 'processing' | 'completed' | 'rejected',
  notes?: string,
): Promise<WithdrawalRow> {
  const res = await $fetch<{ success: boolean, data: WithdrawalRow, message?: string }>(
    `${apiBase()}/admin/withdrawals/${id}/status`,
    { method: 'PUT', headers: authHeaders(token), body: { status, notes } },
  )
  return res.data
}
