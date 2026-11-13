# Auth Pattern for bmsite-panel

> Mirrors bmsite-landing's composable-based auth (useAuth, Sanctum Bearer token).

**Goal:** Add real authentication to bmsite-panel with role-based route protection.

## Design Decisions

- **In-memory only** (Nuxt `useState`), same as landing — no cookies/localStorage.
- **Global middleware** (`auth.global.ts`) — no per-page `definePageMeta` needed.
- **Reuse landing's login endpoint** (`POST /auth/login`, `GET /auth/me`, `POST /auth/logout`) via same API base.

## Architecture

```
useAuth composable
  ├── useState('auth') → { user, token }
  ├── login(email, password) → POST /auth/login → token → GET /auth/me → user
  ├── logout() → POST /auth/logout → clear state
  ├── bootstrap() → if token exists, GET /auth/me to re-hydrate
  ├── isAuthenticated (computed)
  └── isAdmin (computed) — user.role === 'admin' || 'superadmin'

auth.service.ts
  ├── login(input) → { token }
  ├── getCurrentUser(token) → AuthUser | null
  └── logout(token) → void

middleware/auth.global.ts (one file, global)
  ├── /auth/login → allow (pass-through)
  ├── /client/* → must be authenticated, else redirect /auth/login?redirect=<path>
  └── /admin/* → must be authenticated AND isAdmin, else redirect /client with toast
```

## Role values (from backend)

- `user`, `admin`, `superadmin`
- `isAdmin` = `role === 'admin' || role === 'superadmin'`

## What's NOT ported from landing

- `register`, `forgotPassword` — panel doesn't need registration
- `fieldErrors`, `AuthError` type — simpler error handling (string message)
- `guest` middleware — auth.global.ts handles `/auth/login` as pass-through

## Files

| File | Action |
|------|--------|
| `app/types/auth.ts` | New — AuthUser interface |
| `app/services/auth.service.ts` | New — API calls |
| `app/composables/useAuth.ts` | New — auth composable |
| `app/middleware/auth.global.ts` | New — global route guard |
| `app/pages/auth/login.vue` | Edit — wire to real login |
| `app/composables/shared/useSidebarSession.ts` | Edit — read from useAuth |
| `app/composables/shared/useLogout.ts` | Edit — call useAuth().logout() |
