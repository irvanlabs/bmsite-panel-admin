# Folder Structure

Tree of `app/` with short annotations for the important directories/files. (Generated components under `app/components/ui/*` are collapsed — they are shadcn-vue primitives.)

```
app/
├── assets/
│   └── css/
│       ├── tailwind.css        # Design tokens (:root + .dark) + @theme mapping + base layer. SINGLE SOURCE OF TOKENS.
│       └── themes.css          # Imported by tailwind.css (theme variables).
│
├── components/
│   ├── ui/                     # shadcn-vue primitives (generated, do not hand-edit).
│   ├── shared/                 # ★ Cross-page primitives (PageHeader, StatCard, StatusBadge, ConfirmDialog, Timeline, ImageUploader, FormSection, Field*, etc.)
│   ├── dashboard/              # Client dashboard cards (StatusCard, DomainCard, SubscriptionCard, QuickActionsCard, RecentActivityCard, ProTipCard).
│   ├── editor/                 # Website editor (EditorTopNavigation, EditorSidebar, EditorForm, WebsitePreview, BrowserFrame, PreviewViewport, DeviceSwitcher, field components, BackButton).
│   ├── layout/                 # Chrome: ClientSidebar, AdminSidebar, DashboardHeader, Header, TopNavigation, ContentWrapper, PageContainer, SidebarNav*.
│   ├── base/                   # BreadcrumbCustom, DateRangePicker.
│   ├── AppSettings.vue         # Settings panel (theme/appearance).
│   ├── DarkToggle.vue          # Light/dark mode switch.
│   ├── ThemeCustomize.vue      # Theme customizer.
│   └── PasswordInput.vue       # Reusable password field.
│
├── composables/
│   ├── shared/
│   │   └── useSidebarSession.ts  # Current user + sidebar session state (used by client layout).
│   ├── useAppSettings.ts       # App appearance/settings state.
│   ├── useShortcuts.ts         # Keyboard shortcut registration.
│   ├── useKanban.ts            # Kanban board state (demo feature).
│   └── defineShortcuts.ts      # Shortcut helper.
│
├── config/
│   └── navigation/
│       ├── client.ts           # clientNav + clientNavBottom (drives client sidebar).
│       └── admin.ts            # Admin navigation config.
│
├── layouts/
│   ├── client.vue              # Sidebar + DashboardHeader + content inset (p-4 lg:p-6). Used by dashboard + editor.
│   ├── admin.vue               # Admin shell.
│   ├── auth.vue                # Auth shell.
│   └── blank.vue               # Bare shell.
│
├── pages/
│   ├── client/
│   │   ├── index.vue           # Client Dashboard (uses dashboard/* + shared/*).
│   │   └── websites/
│   │       └── [id]/
│   │           └── edit.vue    # Website Editor (uses editor/* + editor-* tokens).
│   ├── admin/                  # Admin pages (future).
│   └── auth/                   # Auth pages (future).
│
├── services/                   # API / data-access layer (per-domain modules).
│
├── types/
│   ├── shared/index.ts         # UserProfile, ActivityItem, SubscriptionInfo, WebsiteInfo.
│   ├── client/index.ts         # EditorFormData, PreviewData.
│   ├── nav.d.ts                # NavMenu, NavLink.
│   ├── appSettings.d.ts        # App settings types.
│   └── kanban.ts               # Kanban types.
│
└── (app.config.ts, error.vue, etc. at app root)
```

## Legend

- **★ `shared/`** — the reusable component bucket. Safe to compose on any future page.
- **`dashboard/`** and **`editor/`** — page-scoped compositions built on `shared/`; they carry their respective token systems (base neutral vs `editor-*` blue).
- **Tokens** live only in `app/assets/css/tailwind.css` + `themes.css` — change tokens there, not in components.
- **Navigation** is config-driven from `app/config/navigation/*.ts`; add menu entries there to expose new routes.
