# Design System

Unified design tokens and component conventions for **bmsite-panel** (Nuxt 4 + shadcn-vue + TailwindCSS 4). All token values are sourced from `app/assets/css/tailwind.css` (base theme) and `app/assets/css/themes.css`.

There are **two coordinated token systems**:

1. **Base / shadcn theme** — neutral, used by the dashboard and all shared primitives. Tokens exposed as `--color-*`, `--radius-*`.
2. **Editor tokens** (`editor-*`) — a blue-accented surface system for the Website Editor. Deliberately distinct in palette and spacing scale, but anchored to the same brand blue.

The single source of brand blue is `editor-primary` (`#0F6AAE`). Both surfaces reference it (dashboard links/buttons use `editor-primary`, `editor-primary-hover`).

---

## 1. Color tokens

### Base theme (neutral, `:root`)

| Token (CSS var) | Tailwind utility | Light value | Dark value |
|---|---|---|---|
| `--background` | `bg-background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | `text-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--card` | `bg-card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--card-foreground` | `text-card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--popover` | `bg-popover` | `oklch(1 0 0)` | `oklch(0.269 0 0)` |
| `--primary` | `bg-primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` |
| `--primary-foreground` | `text-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--secondary` | `bg-secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--muted` | `bg-muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--muted-foreground` | `text-muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| `--accent` | `bg-accent` | `oklch(0.97 0 0)` | `oklch(0.371 0 0)` |
| `--accent-foreground` | `text-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--destructive` | `bg-destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| `--border` | `border-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--input` | `border-input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` |
| `--ring` | `ring-ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |
| `--warning` | `bg-warning` | `oklch(85.2% 0.199 91.936)` | `oklch(79.5% 0.184 86.047)` |
| `--surface` | `bg-surface` | `oklch(0.98 0 0)` | `oklch(0.2 0 0)` |
| `--chart-1..5` | `bg-chart-*` | `blue-300..800` (light & dark) | same |

### Editor tokens (`editor-*`) — brand blue system

| CSS var | Tailwind utility | Light | Dark |
|---|---|---|---|
| `--editor-primary` | `bg-editor-primary` / `text-editor-primary` | `#0F6AAE` | `#1E7FC4` |
| `--editor-primary-hover` | `hover:bg-editor-primary-hover` | `#0B5C98` | `#2A8FD4` |
| `--editor-primary-foreground` | `text-editor-primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--editor-secondary` | `bg-editor-secondary` | `#EAF4FB` | `#172033` |
| `--editor-bg` | `bg-editor-bg` | `#F6F8FC` | `#0F172A` |
| `--editor-surface` | `bg-editor-surface` | `#FFFFFF` | `#1E293B` |
| `--editor-border` | `border-editor-border` | `#E5EAF2` | `#334155` |
| `--editor-muted` | `bg-editor-muted` | `#F2F5FA` | `#1B2638` |
| `--editor-text` | `text-editor-text` | `#1F2937` | `#E2E8F0` |
| `--editor-text-secondary` | `text-editor-text-secondary` | `#6B7280` | `#94A3B8` |
| `--editor-placeholder` | `placeholder:text-editor-placeholder` | `#9CA3AF` | `#64748B` |
| `--editor-success` | `bg-editor-success` | `#16A34A` | `#22C55E` |
| `--editor-danger` | `bg-editor-danger` | `#DC2626` | `#EF4444` |
| `--editor-preview` | `bg-editor-preview` | `#EEF3FA` | `#0B1220` |
| `--editor-sidebar` | `bg-editor-sidebar` | `#FFFFFF` | `#111A2B` |
| `--editor-upload-border` | `border-editor-upload-border` | `#D6DEE8` | `#334155` |

> **Brand blue is the single source of truth.** `editor-primary` (`#0F6AAE`) is used by both the dashboard (links, CTAs) and the editor (buttons, active states, focus rings). Do not introduce ad-hoc blue hex values — extend the `editor-*` palette instead.

---

## 2. Radius

| Token | Utility | Value | Used by |
|---|---|---|---|
| `--radius` (base) | `rounded-xl` is default button/base | `0.625rem` (~10px) | shadcn primitives |
| `--radius-lg` | `rounded-lg` | `var(--radius)` | Avatar, small surfaces |
| Shared card | `rounded-2xl` | ~16px (Tailwind 2xl) | shared `Card` wrappers, `StatCard`, `MetricCard`, `InfoCard`, `ActionCard`, `ConfirmDialog`, `EmptyState`, `LoadingCard`, `PropertyList` |
| Editor card | `rounded-editor-card` | `24px` | editor form/sidebar cards, preview, `BrowserFrame` |
| Shared button | `rounded-xl` | ~12px | shared buttons, `StatusBadge`, `SearchInput`, `ImageUploader` dropzone |
| Editor button | `rounded-editor-button` | `16px` | editor buttons, `DeviceSwitcher`, `SectionNavigation`, `BackButton`, preview CTA |

> Shared cards (`rounded-2xl`, ~16px) and editor cards (`rounded-editor-card`, 24px) are **intentionally in the same family** — generous, modern radius — but not identical by design. Buttons follow the same split (`rounded-xl` vs `rounded-editor-button`).

---

## 3. Spacing

Two deliberate scales:

| Scale | Tokens | Values | Scope |
|---|---|---|---|
| **Editor** | `p-editor-outer`, `gap-editor-section`, `gap-editor-card`, `gap-editor-form` | `32px / 32px / 24px / 24px` | Website Editor page only |
| **Dashboard (base)** | `p-4 lg:p-6`, `gap-4`, `space-y-6` | `16px / 24px / 32px` | Dashboard + shared page layout |

The editor uses its own spacing tokens (`editor-outer` = 32px outer padding, `editor-section` = 32px section gap, `editor-card` = 24px card gap) to give the editor a spacious, app-like canvas. The dashboard uses standard Tailwind spacing. **These are different by design — do not force unification.**

The editor page root is `flex flex-col gap-editor-section p-editor-outer bg-editor-bg` (`app/pages/client/websites/[id]/edit.vue:50`).

Dashboard cards consistently use `gap-4` grids and `space-y-6` section rhythm (`app/pages/client/index.vue:36,41,47`). No inconsistent gaps found within the dashboard.

---

## 4. Typography

- **Font:** `--font-sans` = Geist, `--font-mono` = Geist Mono.
- **Page headings:** `text-2xl font-semibold tracking-tight` (shared `PageHeader`, `WelcomeBanner`) — `WelcomeBanner` steps up to `sm:text-3xl`.
- **Card titles:** `text-base font-semibold tracking-tight` (`ActionCard`, `RecentActivityCard`); value figures `text-2xl font-semibold tracking-tight`.
- **Uppercase section labels (eyebrows):** `text-xs font-medium uppercase tracking-widest text-muted-foreground` — used by `StatCard` / `MetricCard` labels, `FormSection` titles, `SectionHeader` titles. This is the consistent "card label" convention.
- **Body / muted text:** `text-sm text-muted-foreground`.
- **Editor surfaces** use `text-editor-text` / `text-editor-text-secondary` instead of `foreground` / `muted-foreground`, but keep the same weight/tracking rhythm (e.g. `PreviewViewport` titles `text-3xl font-bold tracking-tight text-editor-text`).

---

## 5. Shadow

- Base/shadcn theme is **clean / minimal**: shadcn primitives use `shadow-xs` on buttons; most cards use **no shadow** (flat, borderless or `border` only).
- Editor preview's `BrowserFrame` is the one place with a visible shadow: `shadow-sm` (desktop) and `shadow-lg` (mobile device frame) — intentional emphasis on the live preview.
- Mobile sticky save button in the editor also uses `shadow-lg` for lift.

---

## 6. Hover & Focus

| State | Convention | Where |
|---|---|---|
| Hover (neutral) | `hover:bg-accent` / `hover:bg-accent/40` | `StatCard`, `Button` ghost/outline variants, `UserMenu` |
| Hover (brand) | `hover:bg-editor-primary-hover` | editor primary buttons, dashboard CTAs |
| Hover (editor nav) | `hover:bg-editor-secondary/50 hover:text-editor-text` | `SectionNavigation` |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-ring` | `UserMenu`, `SearchInput` |
| Focus ring (editor) | `focus-visible:ring-2 focus-visible:ring-editor-primary/50` | `SectionNavigation`, `BackButton`, editor `Input`, `ImageUploader` |
| Button focus | `focus-visible:ring-ring/50 focus-visible:ring-[3px]` | `buttonVariants` (base) |
| Active press | `active:opacity-60 md:opacity-100` | global `a`/`button` base layer |

Consistent across both systems; the only variation is editor uses its brand-blue focus ring (`ring-editor-primary/50`) instead of `ring-ring`.

---

## 7. Animation

- **Subtle only.** Global: `scroll-smooth`, active-opacity press feedback.
- **Accordion** keyframes (`accordion-down`/`accordion-up`, `0.2s ease-out`) defined in `@theme`.
- Editor preview device transition: `transition-all duration-300` (`PreviewViewport`).
- Editor form section highlight: `transition-shadow` + `transition-colors` on nav.
- No entrance/parallax animations.

---

## 8. Dark mode

- Driven by `.dark` class on `<html>` (toggled by `DarkToggle` / `ThemeCustomize`); `color-scheme` switched via `html.dark` / `html.light`.
- All base + editor tokens are redefined under `.dark` (see `tailwind.css:174+`). Chart colors and `--vis-*` tooltip vars are shared.
- Editor surfaces swap to deep navy (`editor-bg: #0F172A`, `editor-surface: #1E293B`); brand blue lightens to `#1E7FC4` for contrast.

---

## 9. Known / residual inconsistencies

- **Dashboard vs editor radius are close but not equal** (16px vs 24px cards). Intentional; documented above.
- **Editor spacing scale is editor-scoped only**; dashboard does not reuse `editor-*` spacing. Intentional.
- **One historical mix fixed during audit:** `QuickActionsCard` previously used `rounded-editor-button` (editor token) on its dashboard CTA; changed to `rounded-xl` to match shared-button convention. The brand-blue fill (`bg-editor-primary`) is retained because `editor-primary` is the shared brand source.
- A reusable `DataTable` component exists at `app/components/shared/DataTable.vue` (generic, with sorting, pagination, filtering, bulk selection, loading skeleton, and empty state). Future list pages should use it instead of composing `ui/table` directly. `DataToolbar` provides a search + filter/action slot bar that pairs with it.
