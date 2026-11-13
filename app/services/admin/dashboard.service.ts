export interface AdminOrderResponse {
  id: string
  customer: string
  plan: string
  amount: number
  date: string
  status: 'paid' | 'pending' | 'failed' | 'expired'
}

export interface AdminDashboardResponse {
  metrics: {
    total_users: number
    total_users_change: { value: string, dir: 'up' | 'down' }
    active_sites: number
    active_sites_change: { value: string, dir: 'up' | 'down' }
    monthly_revenue: number
    monthly_revenue_change: { value: string, dir: 'up' | 'down' }
    expired_subs: number
    expired_subs_change: { value: string, dir: 'up' | 'down' }
  }
  revenue_chart: { date: string, revenue: number }[]
  user_growth_chart: { month: string, users: number }[]
  recent_orders: AdminOrderResponse[]
  orders: AdminOrderResponse[]
  orders_meta: { current_page: number, last_page: number, total: number }
}

export interface AdminRevenueResponse {
  total_revenue: number
  monthly_revenue: number
  monthly_breakdown: { month: string, revenue: number }[]
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchAdminDashboard(token: string, ordersPage = 1): Promise<AdminDashboardResponse> {
  const params = new URLSearchParams()
  params.set('orders_page', String(ordersPage))
  const res = await $fetch<{ success: boolean, data: AdminDashboardResponse }>(
    `${apiBase()}/admin/dashboard?${params.toString()}`,
    { headers: authHeaders(token) },
  )
  return res.data
}

export async function fetchAdminRevenue(token: string): Promise<AdminRevenueResponse> {
  const res = await $fetch<{ success: boolean, data: AdminRevenueResponse }>(
    `${apiBase()}/admin/revenue`,
    { headers: authHeaders(token) },
  )
  return res.data
}
