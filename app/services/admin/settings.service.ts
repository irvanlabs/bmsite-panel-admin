export interface AdminGeneralSettings {
  default_plan_id: number | null
  default_template_id: number | null
}

export interface AdminDnsSettings {
  nameservers: string[]
}

export interface AdminDomainSettings {
  markup_percent: number
  tax_percent: number
  platform_ipv4: string
}

export interface AdminSecuritySettings {
  turnstile_site_key: string
  turnstile_secret_key: string
  force_admin_2fa: boolean
  password_min_length: number
}

export interface AdminNotificationSettings {
  mail_from_address: string
  mail_from_name: string
  admin_notify_email: string
  notify_on_order: boolean
  notify_on_payment: boolean
}

export interface AdminIntegrationSettings {
  duitku_merchant_code: string
  duitku_api_key: string
  snap_server_key: string
  snap_client_key: string
  s3_key: string
  s3_secret: string
  s3_bucket: string
  s3_region: string
  s3_endpoint: string
}

export interface AdminLandingSettings {
  hero_title: string
  hero_subtitle: string
  hero_slide_store: string
  hero_slide_web: string
  problem_title: string
  problem_subtitle: string
  solution_title: string
  template_title: string
  template_subtitle: string
  pricing_title: string
  pricing_subtitle: string
  process_title: string
  process_subtitle: string
  cta_title: string
  cta_subtitle: string
  footer_tagline: string
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export type AdminSettingsGroup = 'dns' | 'general' | 'domain' | 'landing' | 'security' | 'notifications' | 'integrations'

export async function fetchAdminSettings<T = unknown>(token: string, group: AdminSettingsGroup): Promise<T> {
  const res = await $fetch<{ success: boolean, data: T }>(
    `${apiBase()}/admin/settings/${group}`,
    { headers: authHeaders(token) },
  )
  return res.data
}

export async function updateAdminSettings<T = unknown>(token: string, group: AdminSettingsGroup, payload: Record<string, unknown>): Promise<T> {
  const res = await $fetch<{ success: boolean, data: T }>(
    `${apiBase()}/admin/settings/${group}`,
    { method: 'PUT', headers: authHeaders(token), body: payload },
  )
  return res.data
}
