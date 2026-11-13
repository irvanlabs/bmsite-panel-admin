# Component Library

Catalog of reusable Vue components grouped by bucket. All live under `app/components/`. **Reusable across pages** = safe to use on any future route without editor/dashboard coupling.

> "shared/*" components are the cross-page building blocks. "dashboard/*" and "editor/*" are page-specific compositions built on top of shared primitives.

---

## Shared components (`app/components/shared/`) — reusable across pages

| Component | Purpose | Key props |
|---|---|---|
| `PageHeader` | Page title + description + optional `actions` slot | `title`, `description` |
| `PageToolbar` | Compact title + description + `search` / `actions` slots (smaller than `PageHeader`) | `title`, `description` |
| `SectionHeader` | Uppercase eyebrow label for in-page sections | `title`, `description` |
| `WelcomeBanner` | Greeting hero ("Welcome back, {name}") | `name`, `subtitle` |
| `StatCard` | Labeled stat card (uppercase eyebrow + slot) | `title`, `icon` |
| `MetricCard` | Stat card with a big value + hint | `label`, `value`, `icon?`, `hint?` |
| `InfoCard` | Info panel, variants `default`/`accent`/`muted` | `variant?`, `icon?`, `title?` |
| `ActionCard` | Action panel with title/description/icon + slot | `title`, `description?`, `icon?` |
| `StatusBadge` | Colored status pill with dot | `status`, `label?` (status: active/live/trialing/building/canceled/past_due/offline/success/warning/error/info) |
| `ConfirmDialog` | Confirm/cancel modal (v-model `open`) | `title?`, `description?`, `confirmText?`, `cancelText?`, `destructive?`, emits `confirm` |
| `EmptyState` | Dashed-border empty placeholder | `icon?`, `title?`, `description?`, slot `action` |
| `LoadingCard` | Skeleton card for loading states | `lines?` |
| `PlaceholderPage` | `PageHeader` + `EmptyState` "coming soon" wrapper | `title`, `description?`, `icon?` |
| `SearchInput` | Search field with leading icon (v-model) | `placeholder?` |
| `DataToolbar` | Search + filter/action slots bar (v-model `search`) | `searchPlaceholder?`, slots `filters`/`actions` |
| `UserMenu` | Avatar dropdown (profile/settings/logout) | `user: UserProfile`, emits `logout` |
| `Timeline` | Scrollable vertical timeline container | `maxHeight?`, slot |
| `TimelineItem` | Timeline entry with icon + connector | `title`, `icon?`, `timestamp?`, `last?` |
| `FormSection` | Grouped form section w/ title + top border | `title?`, `description?` |
| `FieldLabel` | Label wrapper (`ui/form`) | `for?`, `class?` |
| `FieldDescription` | Helper text (`ui/form`) | `class?` |
| `FieldError` | Error message (`ui/form`) | `class?` |
| `ImageUploader` | Drag/drop + browse multi-image upload (v-model `File[]`) | — |
| `InfoRow` | Label/value row | `label`, `value`, slot |
| `PropertyList` | Divided label/value definition list (rounded card) | `rows?: {label,value}[]`, slot |

---

## Dashboard components (`app/components/dashboard/`) — client dashboard only

Built on shared primitives. Reusable pattern but tuned for the dashboard page.

| Component | Purpose | Props |
|---|---|---|
| `StatusCard` | System status stat (uses `StatCard` + `StatusBadge`) | `website: WebsiteInfo` |
| `DomainCard` | Live domain stat + visit link | `website: WebsiteInfo` |
| `SubscriptionCard` | Plan + renewal + status badge | `subscription: SubscriptionInfo` |
| `QuickActionsCard` | CTA panel (Edit Website / View Live) — uses `ActionCard` | — |
| `RecentActivityCard` | Activity timeline (uses `Timeline`/`TimelineItem`) | `activities: ActivityItem[]` |
| `ProTipCard` | Accent info card with keyboard-shortcut tip (uses `InfoCard`) | — |

---

## Editor components (`app/components/editor/`) — website editor only

| Component | Purpose | Key props |
|---|---|---|
| `EditorTopNavigation` | Top bar: title, Editor/SEO/Domain tabs, Preview + Save | `url?`, `activeTab?`, emits `update:activeTab`, `save` |
| `EditorSidebar` | Left section nav + back button | `activeSection`, `backTo?`, `backLabel?`, emits `update:activeSection`, `back` |
| `SectionNavigation` | Section tablist (header/body/sidebar/footer) | `modelValue`, `sections?`, emits `update:modelValue` |
| `BackButton` | Editor back link/button (brand focus ring) | `to?`, `label?`, emits `click` |
| `EditorForm` | Card wrapping the content fields; scroll-to-section + active ring | `activeSection?`, v-model `EditorFormData` |
| `BusinessNameField` | Labeled business-name `Input` | v-model `string` |
| `DescriptionField` | Labeled description `Textarea`/input | v-model `string` |
| `PhoneField` | Labeled phone input | v-model `string` |
| `AddressField` | Labeled address input | v-model `string` |
| `ImageUploader` | *(see shared `ImageUploader` — same component, reused in editor)* | v-model `File[]` |
| `WebsitePreview` | Preview canvas: device switcher + `BrowserFrame` | `data?`, `url?`, v-model `device` |
| `PreviewViewport` | Rendered mock site inside the frame (desktop/mobile) | `device?`, `data?` |
| `BrowserFrame` | Faux browser chrome (traffic lights + URL bar) with `shadow-sm` | `url?` |
| `DeviceSwitcher` | Desktop/Mobile toggle (tablet disabled "coming soon") | v-model `device` |

---

## Key UI primitives (`app/components/ui/`) — shadcn-vue

Auto-generated shadcn-vue primitives. Most-used in this project:

- **`button`** — `buttonVariants` (variants: default/outline/secondary/ghost/destructive/link; sizes default/sm/lg/icon*). Base radius `rounded-md`, focus `ring-ring/50 ring-[3px]`.
- **`card`** — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`.
- **`badge`** — used by `StatusBadge` (variants default/secondary/destructive/outline).
- **`dialog`** / **`alert-dialog`** — modal shells (`ConfirmDialog` uses `dialog`).
- **`input`** / **`label`** / **`textarea`** — form controls.
- **`tabs`** — used by `EditorTopNavigation`.
- **`sheet`** — mobile sections drawer in the editor.
- **`dropdown-menu`** — `UserMenu`.
- **`tooltip`** — `DeviceSwitcher` disabled hint.
- **`scroll-area`** — `Timeline`, `ImageUploader` preview grid.
- **`avatar`**, **`skeleton`**, **`separator`**, **`sonner`** (toasts), **`sidebar`** (layout system).

---

## Reusability notes

- **Cross-page safe now:** `PageHeader`, `PageToolbar`, `SectionHeader`, `StatCard`, `MetricCard`, `InfoCard`, `ActionCard`, `StatusBadge`, `ConfirmDialog`, `EmptyState`, `LoadingCard`, `PlaceholderPage`, `SearchInput`, `DataToolbar`, `UserMenu`, `Timeline`/`TimelineItem`, `FormSection` + `Field*`, `ImageUploader`, `InfoRow`, `PropertyList`.
- **Page-scoped:** `dashboard/*` (dashboard layout/tokens) and `editor/*` (editor surfaces/tokens). They compose shared primitives, so they inherit the shared conventions but carry page-specific tokens.
- A bespoke `DataTable` (`app/components/shared/DataTable.vue`) exists and is the recommended table for future list pages (sorting, pagination, filtering, bulk selection, loading, empty state). Pair it with `DataToolbar` for the search/filter bar.
