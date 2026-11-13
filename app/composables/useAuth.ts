import type { AuthUser } from '~/types/auth'
import { getCurrentUser, login as loginApi, logout as logoutApi } from '~/services/auth.service'

interface AuthState {
  user: AuthUser | null
  token: string | null
}

function useAuthState() {
  return useState<AuthState>('auth', () => ({
    user: null,
    token: null,
  }))
}

export function useAuth() {
  const state = useAuthState()
  const inflight = useState<Promise<void> | null>('auth_bootstrap', () => null)
  const tokenCookie = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  if (state.value.token == null && tokenCookie.value) {
    state.value.token = tokenCookie.value
  }

  const user = computed(() => state.value.user)
  const isAuthenticated = computed(() => !!state.value.token && !!state.value.user)
  // Backend gates every /admin/* route with `role:superadmin` (routes/api.php).
  // The `admin` role has no admin API access, so it must not reach /admin either.
  const isAdmin = computed(() => state.value.user?.role === 'superadmin')

  async function login(email: string, password: string, turnstileToken?: string, totpCode?: string) {
    const result = await loginApi({ email, password, turnstile_token: turnstileToken, totp_code: totpCode })
    if (result.requires_2fa && !result.token) {
      const err = new Error('Kode autentikasi dua faktor diperlukan') as Error & { requires2fa?: boolean }
      err.requires2fa = true
      throw err
    }
    state.value.token = result.token
    tokenCookie.value = result.token
    if (result.user) {
      state.value.user = result.user
      return
    }
    const me = await getCurrentUser(result.token)
    state.value.user = me
    if (!me)
      throw new Error('Gagal mengambil data pengguna')
  }

  async function fetchUser() {
    const token = state.value.token
    if (!token) {
      state.value.user = null
      return
    }
    const me = await getCurrentUser(token)
    if (state.value.token !== token)
      return
    state.value.user = me
    if (!me) {
      state.value.token = null
      tokenCookie.value = null
    }
  }

  async function doLogout() {
    if (state.value.token) {
      await logoutApi(state.value.token)
    }
    state.value.token = null
    state.value.user = null
    tokenCookie.value = null
    inflight.value = null
  }

  async function bootstrap() {
    const token = state.value.token ?? tokenCookie.value ?? null
    if (token && state.value.token == null) {
      state.value.token = token
    }
    if (!state.value.token)
      return
    if (state.value.user)
      return
    if (!inflight.value) {
      inflight.value = fetchUser().finally(() => {
        inflight.value = null
      })
    }
    await inflight.value
  }

  const token = computed(() => state.value.token)

  return { user, token, isAuthenticated, isAdmin, login, logout: doLogout, fetchUser, bootstrap }
}
