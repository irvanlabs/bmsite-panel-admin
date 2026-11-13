# Auth Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real authentication to bmsite-panel with role-based route protection, mirroring bmsite-landing's `useAuth` composable pattern.

**Architecture:** In-memory auth state via Nuxt `useState`, Bearer token auth service, global middleware for `/client/*` (any role) and `/admin/*` (admin/superadmin only). Reuses the same Sanctum API endpoints as bmsite-landing (`POST /auth/login`, `GET /auth/me`, `POST /auth/logout`).

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, `$fetch`, `vue-sonner` (already installed)

---

### Task 1: Auth type

**Files:**
- Create: `app/types/auth.ts`

- [ ] **Step 1: Create the file**

```typescript
export interface AuthUser {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  created_at: string
  updated_at: string
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`

---

### Task 2: Auth service

**Files:**
- Create: `app/services/auth.service.ts`

- [ ] **Step 1: Create the file**

```typescript
import type { AuthUser } from '~/types/auth'

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function login(input: { email: string, password: string, remember?: boolean }): Promise<{ token: string }> {
  try {
    const res = await $fetch<{ success: boolean, data: { token: string } }>(
      `${apiBase()}/auth/login`,
      { method: 'POST', headers: authHeaders(), body: input }
    )
    return res.data
  } catch (e) {
    if (e && typeof e === 'object' && 'data' in e) {
      const err = e as { data?: { message?: string } }
      if (err.data?.message) throw new Error(err.data.message)
    }
    throw new Error('Gagal terhubung ke server')
  }
}

export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await $fetch<{ success: boolean, data: AuthUser }>(
      `${apiBase()}/auth/me`,
      { headers: authHeaders(token) }
    )
    return res.data ?? null
  } catch {
    return null
  }
}

export async function logout(token: string): Promise<void> {
  try {
    await $fetch(`${apiBase()}/auth/logout`, { method: 'POST', headers: authHeaders(token) })
  } catch {
    // token may already be expired — clear local state regardless
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`

---

### Task 3: useAuth composable

**Files:**
- Create: `app/composables/useAuth.ts`

- [ ] **Step 1: Create the file**

```typescript
import type { AuthUser } from '~/types/auth'
import { login as loginApi, getCurrentUser, logout as logoutApi } from '~/services/auth.service'

interface AuthState {
  user: AuthUser | null
  token: string | null
}

const useAuthState = () => useState<AuthState>('auth', () => ({
  user: null,
  token: null
}))

export function useAuth() {
  const state = useAuthState()

  const user = computed(() => state.value.user)
  const isAuthenticated = computed(() => !!state.value.token && !!state.value.user)
  const isAdmin = computed(() => state.value.user?.role === 'admin' || state.value.user?.role === 'superadmin')

  async function login(email: string, password: string) {
    const result = await loginApi({ email, password })
    state.value.token = result.token
    const me = await getCurrentUser(result.token)
    state.value.user = me
    if (!me) throw new Error('Gagal mengambil data pengguna')
  }

  async function fetchUser() {
    if (!state.value.token) {
      state.value.user = null
      return
    }
    state.value.user = await getCurrentUser(state.value.token)
  }

  async function doLogout() {
    if (state.value.token) {
      await logoutApi(state.value.token)
    }
    state.value.token = null
    state.value.user = null
  }

  async function bootstrap() {
    if (!state.value.token) return
    await fetchUser()
  }

  return { user, isAuthenticated, isAdmin, login, logout: doLogout, fetchUser, bootstrap }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`

---

### Task 4: Global auth middleware

**Files:**
- Create: `app/middleware/auth.global.ts`

- [ ] **Step 1: Create the file**

```typescript
import { useAuth } from '~/composables/useAuth'
import { toast } from 'vue-sonner'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  if (to.path.startsWith('/auth/login')) return

  await auth.bootstrap()

  if (to.path.startsWith('/admin')) {
    if (!auth.isAuthenticated.value) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    if (!auth.isAdmin.value) {
      toast.error('Anda tidak memiliki akses ke halaman admin')
      return navigateTo('/client')
    }
    return
  }

  if (to.path.startsWith('/client') || to.path.startsWith('/')) {
    if (!auth.isAuthenticated.value) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    return
  }
})
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`

---

### Task 5: Wire login page

**Files:**
- Edit: `app/pages/auth/login.vue`

- [ ] **Step 1: Replace the login page**

Replace the existing file content with:

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const auth = useAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  loading.value = true
  error.value = null
  try {
    await auth.login(email.value, password.value)
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      await navigateTo(redirect)
      return
    }
    await navigateTo('/client')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Gagal masuk'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-sm rounded-2xl">
      <CardHeader>
        <CardTitle class="text-xl font-semibold tracking-tight">
          Masuk
        </CardTitle>
        <CardDescription>Selamat datang kembali di Panel BMSite</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="submit">
          <div v-if="error" class="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {{ error }}
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="anda@contoh.com" class="rounded-xl" required />
          </div>
          <div class="space-y-2">
            <Label for="password">Kata Sandi</Label>
            <Input id="password" v-model="password" type="password" placeholder="••••••••" class="rounded-xl" required />
          </div>
          <Button type="submit" class="w-full rounded-xl" :disabled="loading">
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`

---

### Task 6: Wire useSidebarSession to useAuth

**Files:**
- Edit: `app/composables/shared/useSidebarSession.ts`

- [ ] **Step 1: Replace the file content**

Replace the existing file content with:

```typescript
import { useAuth } from '~/composables/useAuth'

export function useSidebarSession() {
  const auth = useAuth()

  const teams = computed(() => [
    { name: 'BMSite', logo: 'i-lucide-gallery-vertical-end', plan: 'Pro' },
  ])

  const user = computed(() => ({
    name: auth.user.value?.name ?? '',
    email: auth.user.value?.email ?? '',
    avatar: '/avatars/avatartion.png',
  }))

  return { teams, user }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`

---

### Task 7: Wire useLogout to useAuth

**Files:**
- Edit: `app/composables/shared/useLogout.ts`

- [ ] **Step 1: Replace the file content**

Replace the existing file content with:

```typescript
import { useAuth } from '~/composables/useAuth'

export function useLogout() {
  const auth = useAuth()

  return {
    async handleLogout() {
      await auth.logout()
      await navigateTo('/auth/login')
    },
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bun run typecheck`

---

### Final verification

- [ ] **Step 1: Run full typecheck**

```bash
bun run typecheck
```
Expected: PASS with no errors

- [ ] **Step 2: Run build**

```bash
bun run build
```
Expected: Successful build

---

## Dependency order

```
Task 1 (types) ──→ Task 2 (service) ──→ Task 3 (composable) ──→ Task 4 (middleware)
                                      ├──→ Task 5 (login page)
                                      ├──→ Task 6 (sidebar session)
                                      └──→ Task 7 (logout)
```

Tasks 4-7 can be done in any order after Task 3.
