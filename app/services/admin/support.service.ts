import type { TicketResponse, TicketStatusKind, TicketPriority } from '~/types/shared'

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

interface PaginatedTickets {
  data: TicketResponse[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

interface TicketListParams {
  status?: string
  priority?: string
  page?: number
}

export async function fetchAdminTickets(token: string, params: TicketListParams = {}): Promise<PaginatedTickets> {
  const qs = new URLSearchParams()
  qs.set('per_page', '10')
  if (params.status && params.status !== '_all') qs.set('status', params.status)
  if (params.priority && params.priority !== '_all') qs.set('priority', params.priority)
  if (params.page) qs.set('page', String(params.page))

  const res = await $fetch<{ success: boolean; data: TicketResponse[]; meta: PaginatedTickets['meta'] }>(
    `${apiBase()}/admin/support?${qs.toString()}`,
    { headers: authHeaders(token) }
  )
  return { data: res.data, meta: res.meta }
}

export async function fetchAdminTicket(token: string, id: number): Promise<TicketResponse> {
  const res = await $fetch<{ success: boolean; data: TicketResponse }>(
    `${apiBase()}/admin/support/${id}`,
    { headers: authHeaders(token) }
  )
  return res.data
}

export async function replyToTicket(token: string, id: number, message: string): Promise<TicketResponse> {
  const res = await $fetch<{ success: boolean; data: TicketResponse }>(
    `${apiBase()}/admin/support/${id}/reply`,
    { method: 'POST', headers: authHeaders(token), body: { message } }
  )
  return res.data
}

export async function updateTicketStatus(token: string, id: number, status: TicketStatusKind): Promise<TicketResponse> {
  const res = await $fetch<{ success: boolean; data: TicketResponse }>(
    `${apiBase()}/admin/support/${id}/status`,
    { method: 'PUT', headers: authHeaders(token), body: { status } }
  )
  return res.data
}

export async function assignTicket(token: string, id: number, assignedTo: number): Promise<TicketResponse> {
  const res = await $fetch<{ success: boolean; data: TicketResponse }>(
    `${apiBase()}/admin/support/${id}/assign`,
    { method: 'PUT', headers: authHeaders(token), body: { assigned_to: assignedTo } }
  )
  return res.data
}
