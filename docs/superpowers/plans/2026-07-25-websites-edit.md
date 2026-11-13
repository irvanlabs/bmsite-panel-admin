# Websites List + Edit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded website list and editor form with real CRUD against bmsite-api.

**Architecture:** Thin service layer (`site.service.ts`, `upload.service.ts`) wrapping existing `$fetch` pattern. Websites list fetches `GET /api/v1/sites` with pagination. Editor fetches detail via `GET /api/v1/sites/{id}`, submits `PUT` with merged settings. Image upload via presigned URL → direct R2 PUT. Publish toggles `status` between `active`/`inactive`.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, `$fetch`

---

### Task 1: Site service

**Files:**
- Create: `app/services/client/site.service.ts`

- [ ] **Step 1: Create the file**

```typescript
interface SiteListMeta {
  current_page?: number
  last_page?: number
  per_page: number
  total: number
  sort: string
  direction: string
}

interface SiteResponse {
  id: string
  user_id: string
  template_id: string | null
  subscription_id: string | null
  subdomain: string
  full_url: string
  ga_id: string | null
  status: string
  settings: Record<string, unknown> | null
  widgets: unknown[] | null
  created_at: string
  updated_at: string
  template: { id: string, name: string, slug: string, thumbnail_url: string | null } | null
  subscription: { id: string, plan_id: string, status: string, billing_cycle: string, renewal_date: string | null } | null
  domains: { id: string, domain: string, is_primary: boolean, type: string, status: string }[]
  pages: { id: string, title: string, slug: string, type: string, status: string }[]
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchSites(token: string, params?: { search?: string, per_page?: number, sort?: string, direction?: string }): Promise<{ data: SiteResponse[], meta: SiteListMeta }> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.per_page) query.set('per_page', String(params.per_page))
  if (params?.sort) query.set('sort', params.sort)
  if (params?.direction) query.set('direction', params.direction)

  const qs = query.toString()
  const url = `${apiBase()}/sites${qs ? `?${qs}` : ''}`
  const res = await $fetch<{ success: boolean, data: SiteResponse[], meta: SiteListMeta }>(url, { headers: authHeaders(token) })
  return { data: res.data, meta: res.meta }
}

export async function fetchSite(token: string, id: string): Promise<SiteResponse> {
  const res = await $fetch<{ success: boolean, data: SiteResponse }>(`${apiBase()}/sites/${id}`, { headers: authHeaders(token) })
  return res.data
}

export async function updateSite(token: string, id: string, body: Record<string, unknown>): Promise<SiteResponse> {
  const res = await $fetch<{ success: boolean, data: SiteResponse }>(`${apiBase()}/sites/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body,
  })
  return res.data
}
```

> URLs follow the same pattern as `auth.service.ts` (e.g., `${apiBase()}/sites`).

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "site.service" || echo "No errors"
```

---

### Task 2: Upload service

**Files:**
- Create: `app/services/client/upload.service.ts`

- [ ] **Step 1: Create the file**

```typescript
interface PresignedUrlResult {
  presigned_url: string
  key: string
  expires_in: number
}

function apiBase() {
  return useRuntimeConfig().public.apiBase as string
}

function authHeaders(token: string): Record<string, string> {
  return { Accept: 'application/json', Authorization: `Bearer ${token}` }
}

export async function getPresignedUrl(token: string, filename: string, mimeType: string, fileSize: number): Promise<PresignedUrlResult> {
  const res = await $fetch<{ success: boolean, data: PresignedUrlResult }>(`${apiBase()}/upload/presigned-url`, {
    method: 'POST',
    headers: authHeaders(token),
    body: { filename, mime_type: mimeType, file_size: fileSize },
  })
  return res.data
}

export async function uploadToR2(presignedUrl: string, file: File): Promise<string> {
  await $fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  // Return the public URL by stripping query params from presigned URL
  return presignedUrl.split('?')[0]
}
```

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "upload.service" || echo "No errors"
```

---

### Task 3: Wire websites list page

**Files:**
- Edit: `app/pages/client/websites/index.vue`

- [ ] **Step 1: Replace the script section**

Replace everything from `<script setup>` to `</script>` (lines 1-93) with:

```typescript
import { toast } from 'vue-sonner'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import SharedStatCard from '@/components/shared/StatCard.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchSites, type SiteResponse } from '~/services/client/site.service'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'client' })

const auth = useAuth()
const loading = ref(false)
const activeTab = ref<string>('all')
const sort = ref('updated_at')
const direction = ref<'asc' | 'desc'>('desc')

const sites = ref<SiteResponse[]>([])

function mapStatus(status: string): 'live' | 'building' | 'offline' {
  if (status === 'active') return 'live'
  if (status === 'suspended') return 'offline'
  return 'building'
}

const stats = computed(() => ({
  total: sites.value.length,
  online: sites.value.filter(s => s.status === 'active').length,
  offline: sites.value.filter(s => s.status !== 'active').length,
}))

const filtered = computed(() => {
  let result = sites.value
  if (activeTab.value === 'live')
    result = result.filter(s => s.status === 'active')
  else if (activeTab.value === 'building')
    result = result.filter(s => s.status === 'inactive')
  else if (activeTab.value === 'offline')
    result = result.filter(s => s.status === 'suspended')
  return result
})

const columns = [
  { key: 'name', label: 'Situs', sortable: true },
  { key: 'domain', label: 'Domain', sortable: true },
  { key: 'pages', label: 'Halaman', sortable: false, class: 'text-right' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: '', sortable: false, class: 'text-right' },
]

const tabs = [
  { value: 'all', label: 'Semua' },
  { value: 'live', label: 'Live' },
  { value: 'building', label: 'Membangun' },
  { value: 'offline', label: 'Offline' },
]

async function loadSites() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token) return
    const result = await fetchSites(token, { sort: sort.value, direction: direction.value })
    sites.value = result.data
  } catch {
    toast.error('Gagal memuat daftar situs')
  } finally {
    loading.value = false
  }
}

function handleAdd() { toast.info('Buat situs baru') }
function handleImport() { toast.info('Impor situs') }
function handleRefresh() { loadSites() }
function handleOpen(s: SiteResponse) { window.open(s.full_url, '_blank') }
function handleManage(s: SiteResponse) { navigateTo(`/client/websites/${s.id}/edit`) }
function handlePages(s: SiteResponse) { toast.info(`Halaman untuk ${s.subdomain}`) }
function handleAnalytics() { navigateTo('/client/statistics') }
function handleSettings(s: SiteResponse) { toast.info(`Pengaturan untuk ${s.subdomain}`) }
function handleDelete(s: SiteResponse) {
  toast.info(`Hapus belum tersedia`)
}

onMounted(async () => {
  await auth.bootstrap()
  await loadSites()
})
```

- [ ] **Step 2: Update the template section**

Replace `cell-name`, `cell-ssl`, `cell-visitors` templates:

```vue
      <!-- cell-name (replace line ~145) -->
      <template #cell-name="{ row }">
        <span class="font-medium">{{ row.subdomain }}</span>
      </template>

      <!-- cell-pages (replace the old cell-ssl slot, line ~148) -->
      <template #cell-pages="{ row }">
        <span class="tabular-nums">{{ row.pages?.length ?? 0 }}</span>
      </template>

      <!-- Remove cell-visitors slot entirely (line ~157) -->
```

Also remove the visitors `SharedStatCard` (the 4th stat card, line ~122) — we don't have visitor counts from the API.

- [ ] **Step 4: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "websites/index" || echo "No errors"
```

---

### Task 4: Update EditorFormData type

**Files:**
- Edit: `app/types/client/index.ts`

- [ ] **Step 1: Change images type**

Replace line 6: `images: File[]` → `images: (File | string)[]`

Also in PreviewData (line 14): `images: File[]` → `images: (File | string)[]`

Full updated file:

```typescript
export interface EditorFormData {
  businessName: string
  description: string
  phone: string
  address: string
  images: (File | string)[]
}

export interface PreviewData {
  businessName: string
  description: string
  phone: string
  address: string
  images: (File | string)[]
}

export type PageEditorStatus = 'draft' | 'published' | 'scheduled' | 'archived'

export interface PageEditorData {
  id: string
  title: string
  status: PageEditorStatus
  visibility: 'public' | 'private' | 'password'
  slug: string
  featuredImage: File | null
  content: string
  metaTitle: string
  metaDescription: string
  socialTitle: string
  socialDescription: string
}
```

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "types/client" || echo "No errors"
```

---

### Task 5: Update ImageUploader to accept URLs

**Files:**
- Edit: `app/components/shared/ImageUploader.vue`

- [ ] **Step 1: Change model type and add URL display**

Replace line 6: `const files = defineModel<File[]>({ default: () => [] })` → `const files = defineModel<(File | string)[]>({ default: () => [] })`

Update `syncPreviews` and `update` functions:

Replace lines 12-19:

```typescript
function syncPreviews(next: (File | string)[]) {
  previews.value.forEach((url) => URL.revokeObjectURL(url))
  previews.value = next.map((f) => typeof f === 'string' ? f : URL.createObjectURL(f))
}

function update(next: (File | string)[]) {
  files.value = next
  syncPreviews(next)
}
```

Update `handleFiles` (line 22-26) to keep File type for new uploads:

```typescript
function handleFiles(fileList: FileList | null) {
  if (!fileList) return
  const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
  update([...files.value, ...incoming])
}
```

- [ ] **Step 2: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "ImageUploader" || echo "No errors"
```

---

### Task 6: Wire editor page (fetch + save + upload + publish)

**Files:**
- Edit: `app/pages/client/websites/[id]/edit.vue`
- Edit: `app/components/editor/EditorTopNavigation.vue`

- [ ] **Step 1: Replace edit.vue script section**

Replace lines 1-47:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import EditorTopNavigation from '@/components/editor/EditorTopNavigation.vue'
import EditorSidebar from '@/components/editor/EditorSidebar.vue'
import EditorForm from '@/components/editor/EditorForm.vue'
import WebsitePreview from '@/components/editor/WebsitePreview.vue'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { EditorFormData, PreviewData } from '@/types/client'
import { fetchSite, updateSite } from '~/services/client/site.service'
import { getPresignedUrl, uploadToR2 } from '~/services/client/upload.service'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'client' })

const route = useRoute()
const siteId = route.params.id as string
const auth = useAuth()

const siteStatus = ref<string>('inactive')
const url = ref('')
const loading = ref(true)
const saving = ref(false)

const form = ref<EditorFormData>({
  businessName: '',
  description: '',
  phone: '',
  address: '',
  images: [],
})

const activeSection = ref('header')
const activeTab = ref('editor')

const previewData = computed<PreviewData>(() => ({
  businessName: form.value.businessName,
  description: form.value.description,
  phone: form.value.phone,
  address: form.value.address,
  images: form.value.images,
}))

async function loadSite() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token) return

    const site = await fetchSite(token, siteId)
    siteStatus.value = site.status
    url.value = site.subdomain
    form.value = {
      businessName: (site.settings as Record<string, unknown> | null)?.business_name as string ?? '',
      description: (site.settings as Record<string, unknown> | null)?.description as string ?? '',
      phone: (site.settings as Record<string, unknown> | null)?.phone as string ?? '',
      address: (site.settings as Record<string, unknown> | null)?.address as string ?? '',
      images: ((site.settings as Record<string, unknown> | null)?.images as string[]) ?? [],
    }
  } catch {
    toast.error('Gagal memuat data situs')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  saving.value = true
  try {
    const token = auth.token.value
    if (!token) return

    // Upload new images (File objects) and collect URLs
    const existingUrls = form.value.images.filter((f): f is string => typeof f === 'string')
    const newFiles = form.value.images.filter((f): f is File => f instanceof File)

    const uploadedUrls: string[] = []
    for (const file of newFiles) {
      const { presigned_url } = await getPresignedUrl(token, file.name, file.type, file.size)
      const publicUrl = await uploadToR2(presigned_url, file)
      uploadedUrls.push(publicUrl)
    }

    const allImageUrls = [...existingUrls, ...uploadedUrls]

    await updateSite(token, siteId, {
      settings: {
        business_name: form.value.businessName,
        description: form.value.description,
        phone: form.value.phone,
        address: form.value.address,
        images: allImageUrls,
      },
    })

    // Update form images to all be URLs now (so they'd be strings for preview)
    form.value.images = allImageUrls
    toast.success('Website disimpan')
  } catch {
    toast.error('Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

async function handlePublish() {
  try {
    const token = auth.token.value
    if (!token) return

    const newStatus = siteStatus.value === 'active' ? 'inactive' : 'active'
    await updateSite(token, siteId, { status: newStatus })
    siteStatus.value = newStatus
    toast.success(newStatus === 'active' ? 'Website dipublikasikan' : 'Website dinonaktifkan')
  } catch {
    toast.error('Gagal mengubah status')
  }
}

function goBack() {
  navigateTo('/client/websites')
}

onMounted(async () => {
  await auth.bootstrap()
  await loadSite()
})
</script>
```

- [ ] **Step 2: Update template to pass new props to EditorTopNavigation**

Replace lines 51-55:

```vue
    <EditorTopNavigation
      v-model:active-tab="activeTab"
      :url="url"
      :status="siteStatus"
      :saving="saving"
      @save="handleSave"
      @publish="handlePublish"
    />
```

- [ ] **Step 3: Update EditorTopNavigation to accept status + publish props**

Replace `app/components/editor/EditorTopNavigation.vue` entirely:

```vue
<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  url?: string
  activeTab?: string
  status?: string
  saving?: boolean
}>(), {
  url: 'yoursite.bmsite.app',
  activeTab: 'editor',
  status: 'inactive',
  saving: false,
})

const emit = defineEmits<{
  'update:activeTab': [value: string]
  save: []
  publish: []
}>()

const statusLabel = computed(() => {
  if (props.status === 'active') return 'Live'
  if (props.status === 'suspended') return 'Offline'
  return 'Building'
})

const statusVariant = computed(() => {
  if (props.status === 'active') return 'default'
  if (props.status === 'suspended') return 'destructive'
  return 'secondary'
})

const tabs = [
  { id: 'editor', label: 'Editor' },
  { id: 'seo', label: 'SEO' },
  { id: 'domain', label: 'Domain' },
]
</script>

<template>
  <header class="flex flex-col gap-3 border-b border-editor-border bg-editor-surface px-editor-outer py-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-3">
      <Icon name="i-lucide-globe" class="size-5 text-editor-primary" />
      <span class="text-base font-semibold text-editor-text">Editor Website</span>
      <Tabs :model-value="activeTab" @update:model-value="emit('update:activeTab', $event as string)">
        <TabsList class="bg-editor-muted">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.id"
            :class="cn(activeTab === tab.id && 'bg-editor-surface text-editor-primary')"
          >
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <div class="flex items-center gap-2">
      <Badge :variant="statusVariant" class="rounded-xl">
        {{ statusLabel }}
      </Badge>
      <Button
        type="button"
        variant="outline"
        class="rounded-editor-button border-editor-border"
        @click="emit('publish')"
      >
        <Icon :name="status === 'active' ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
        {{ status === 'active' ? 'Unpublish' : 'Publish' }}
      </Button>
      <Button
        type="button"
        variant="outline"
        class="rounded-editor-button border-editor-border"
        :as-child="true"
      >
        <a :href="`https://${url}.bmsite.app`" target="_blank" rel="noopener noreferrer">
          <Icon name="i-lucide-external-link" class="size-4" />
          Pratinjau
        </a>
      </Button>
      <Button
        type="button"
        class="rounded-editor-button bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover"
        :disabled="saving"
        @click="emit('save')"
      >
        <Icon name="i-lucide-save" class="size-4" />
        {{ saving ? 'Menyimpan...' : 'Simpan' }}
      </Button>
    </div>
  </header>
</template>
```

- [ ] **Step 4: Verify compiles**

```bash
bun run typecheck 2>&1 | grep "edit.vue\|EditorTopNavigation\|ImageUploader" || echo "No errors"
```

---

### Task 7: Final verification

- [ ] **Step 1: Full typecheck**

```bash
bun run typecheck 2>&1 | tail -5
```

- [ ] **Step 2: Build**

```bash
bun run build
```

Expected: Build complete.

---

## Dependency Order

```
Task 1 (site.service) ──┐
                         ├──→ Task 3 (websites list)
                         │
Task 2 (upload.service) ─┤
                         │
Task 4 (types) ──────────┤
                         │
Task 5 (ImageUploader) ──┤
                         │
                         └──→ Task 6 (edit page + EditorTopNavigation)
                                        │
                                        └──→ Task 7 (final verify)
```

Tasks 1-5 are independent and can run in parallel. Task 6 depends on all. Task 7 final.
