import type { AuthUser } from '~/types/auth'

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token)
    headers.Authorization = `Bearer ${token}`
  return headers
}

export async function login(input: { email: string, password: string, turnstile_token?: string, remember?: boolean, totp_code?: string }): Promise<{ token: string, user?: AuthUser, requires_2fa?: boolean }> {
  try {
    const res = await $fetch<{ success: boolean, data: { token: string, user?: AuthUser, requires_2fa?: boolean } }>(
      `${apiBase()}/auth/login`,
      { method: 'POST', headers: authHeaders(), body: input },
    )
    return res.data
  }
  catch (e) {
    if (e && typeof e === 'object' && 'data' in e) {
      const data = (e as { data?: { message?: unknown, error?: { message?: unknown } } }).data
      if (typeof data?.message === 'string' && data.message) {
        throw new Error(data.message)
      }
      if (typeof data?.error?.message === 'string' && data.error.message) {
        throw new Error(data.error.message)
      }
    }
    throw new Error('Gagal terhubung ke server')
  }
}

export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await $fetch<{ success: boolean, data: AuthUser }>(
      `${apiBase()}/auth/me`,
      { headers: authHeaders(token) },
    )
    return res.data ?? null
  }
  catch {
    return null
  }
}

export async function logout(token: string): Promise<void> {
  try {
    await $fetch(`${apiBase()}/auth/logout`, { method: 'POST', headers: authHeaders(token) })
  }
  catch {
    // token may already be expired — clear local state regardless
  }
}
