# BMSite Panel Admin

Panel admin (superadmin) untuk platform BMSite, di-split dari monorepo panel `bmsite-panel` menjadi repo mandiri. Berisi direktori pengguna & pelanggan, faktur & penarikan, website & template pelanggan, paket, analytics, audit, dukungan, dan pengaturan platform. Portal client (tenant) berada di repo terpisah `bmsite-panel-user`.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) (file-based routing, SSR, Cloudflare Workers) |
| UI Components | [shadcn-vue](https://www.shadcn-vue.com) (dari starter `nuxt-shadcn-dashboard`) |
| Styling | [TailwindCSS 4](https://tailwindcss.com) + `@tailwindcss/vite` |
| Charts | [Unovis](https://unovis.dev) (`@unovis/vue`) via chart primitives shadcn |
| Icons | [Lucide](https://lucide.dev) via `@nuxt/icon` |
| Dark Mode | `@nuxtjs/color-mode` |
| Fonts | Geist / Geist Mono via `@nuxt/fonts` |
| Backend | Go API (`bmsite-api-go`), JWT auth + Turnstile |
| Package Manager | **bun** (v1.2.0+) |
| Linting | ESLint (flat config via `@nuxt/eslint`) |
| TypeScript | `vue-tsc` |

## Requirements

- **Node.js** >= 20.x
- **bun** >= 1.2.0

## Installation

```bash
bun install
```

## Development

```bash
bun run dev
```

`.env` dev (Go API lokal):

```
NUXT_API_BASE=http://127.0.0.1:8012/api/v1
```

Login dev memakai akun **superadmin** dari Go API. Akun non-superadmin ditolak di halaman login (`toast` "Akun ini bukan admin") dan oleh middleware route.

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `nuxt dev` | Development server dengan HMR |
| `build` | `nuxt build` | Production build (Cloudflare Pages preset) |
| `typecheck` | `vue-tsc --noEmit` | Type checking |
| `lint` / `format` | `eslint .` / `eslint --fix .` | Lint & auto-fix |

## Auth Flow

Middleware global `app/middleware/auth.global.ts` (admin-only):

- `/auth/login` → selalu dilewati.
- `/admin/*` → belum login: redirect ke `/auth/login?redirect=...`; login tapi bukan superadmin: toast penolakan + `/auth/login`.
- `/` → belum login: `/auth/login`; superadmin: `/admin`; non-superadmin: toast penolakan + `/auth/login`.
- Path lain → diteruskan (ditangani halaman 404).

Role dicek di `useAuth().isAdmin` (`user.role === 'superadmin'`); role `admin` biasa tidak punya akses API admin di backend, jadi juga ditolak di sini.

## Deployment

Deploy ke Cloudflare Workers (`nitro` preset `cloudflare_pages`, `wrangler.jsonc`).

- **main** → `bun run build` + `bunx wrangler deploy --env admin` (project `bmsite-panel-admin`, domain production tetap).
- **development** → `bun run build` + `bunx wrangler versions upload --env admin` (preview version).

Workflow: `.github/workflows/deploy.yml` (single job). Secret yang dibutuhkan: `CLOUDFLARE_API_TOKEN`; variables: `NUXT_API_BASE`, `NUXT_PUBLIC_TURNSTILE_SITE_KEY`.

Build manual:

```bash
bun run build
bunx wrangler deploy --env admin
```

## Shared Files — kebijakan copy identik

Repo ini dan `bmsite-panel-user` menurunkan kode yang sama dari `bmsite-panel`. File di bawah **harus tetap identik byte-per-byte** di kedua repo; jika mengubah salah satu, copy ke repo satunya (rollback tetap ada di `bmsite-panel`):

```
app/app.vue
app/error.vue
app/assets/css/tailwind.css
app/assets/css/themes.css
app/components/ui/**                  # shadcn-vue primitives (auto-generated)
app/components/shared/**              # komponen reusable lintas halaman (kecuali UserMenu.vue, lihat di bawah)
app/components/base/**
app/components/charts/**
app/components/layout/BaseSidebar.vue
app/components/layout/Header.vue
app/components/layout/SidebarNavLink.vue
app/components/layout/SidebarNavGroup.vue
app/components/layout/SidebarNavHeader.vue
app/components/layout/SidebarNavFooter.vue
app/composables/useAuth.ts
app/composables/useAppSettings.ts
app/composables/defineShortcuts.ts
app/composables/shared/useLogout.ts
app/composables/shared/useSidebarSession.ts
app/lib/utils.ts
app/plugins/ssrWidth.ts
app/constants/themes.ts
app/services/auth.service.ts
app/services/shared/templates.ts
app/types/auth.ts
app/types/nav.d.ts
app/types/appSettings.d.ts
app/types/shared/index.ts
server/routes/_api/[...path].ts
```

File auth-adjacent yang **ada di kedua repo tapi berbeda isi** (branch per-repo): `app/middleware/auth.global.ts`, `app/pages/auth/login.vue`, `app/pages/index.vue`, `app/components/shared/UserMenu.vue`, `app/components/layout/DashboardHeader.vue` (semuanya mengarah ke `/admin` di repo ini, `/client` di user repo). Jika mengubahnya, jaga pesan toast & perilaku tetap konsisten antar repo, tapi branch redirect mengikuti tree masing-masing.

File yang khusus repo ini: `app/pages/admin/**`, `app/components/admin/**`, `app/services/admin/**`, `app/config/navigation/admin.ts`, `app/layouts/admin.vue`.

## Project Structure

```
app/
├── components/
│   ├── ui/                   # ★ shadcn-vue primitives (auto-generated)
│   ├── shared/               # ★ Komponen reusable (PageHeader, DataTable, StatusBadge, …)
│   ├── layout/               # Chrome (AdminSidebar, BaseSidebar, DashboardHeader, …)
│   ├── admin/                # Widget khusus admin (dashboard, users, templates, websites)
│   ├── base/                 # BreadcrumbCustom, DateRangePicker
│   └── charts/               # Wrapper chart (LineChart, BarChart, DonutChart)
├── composables/
│   ├── useAuth.ts            # Bootstrap session, login/logout, isAdmin (superadmin)
│   ├── shared/               # useLogout, useSidebarSession
│   └── useAppSettings.ts
├── config/navigation/admin.ts  # Konfigurasi sidebar admin
├── layouts/
│   ├── admin.vue             # Shell admin (sidebar + header)
│   └── auth.vue              # Shell auth
├── middleware/auth.global.ts # Route guard admin-only
├── pages/
│   ├── admin/                # 15 halaman: dashboard, analytics, users, customers,
│   │                         # audit, billings, invoices, withdrawals, websites,
│   │                         # templates, plans, support, settings
│   ├── auth/login.vue
│   └── index.vue             # Root redirector
├── services/
│   ├── admin/                # API layer per-domain (users, billings, sites, …)
│   ├── auth.service.ts
│   └── shared/templates.ts
└── types/
    ├── auth.ts
    └── shared/index.ts       # Domain types bersama (AdminUser, Template, Ticket, …)
```

## Troubleshooting

| Problem | Likely Cause | Solution |
|---|---|---|
| `vue-tsc` error di komponen starter (auto-form, chart-donut) | Isu bawaan starter | Abaikan — bukan bagian halaman built |
| Login gagal di dev | Go API belum jalan di `:8012` | Cek `.env` `NUXT_API_BASE` dan proxy `server/routes/_api` |
| Turnstile "key missing" | `NUXT_PUBLIC_TURNSTILE_SITE_KEY` kosong | Set variable di CI/CD; dev lokal bisa tanpa key (verifikasi dilewati) |
