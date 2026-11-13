<script setup lang="ts">
import type { Template } from '~/types/shared'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import TemplateCard from '@/components/admin/templates/TemplateCard.vue'
import SharedEmptyState from '@/components/shared/EmptyState.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import SharedSearchInput from '@/components/shared/SearchInput.vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { fetchTemplates, createTemplate, updateTemplate, deleteTemplate, toggleFeatured } from '~/services/admin/templates.service'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const searching = ref(false)
const search = ref('')
const activeCategory = ref('all')
const sortBy = ref('created_at')

const templates = ref<Template[]>([])
const total = ref(0)
const page = ref(1)

const categories = [
  { value: 'all', label: 'Semua' },
  { value: 'umkm', label: 'UMKM' },
  { value: 'company', label: 'Perusahaan' },
  { value: 'school', label: 'Sekolah' },
  { value: 'government', label: 'Pemerintah' },
  { value: 'organization', label: 'Organisasi' },
  { value: 'portfolio', label: 'Portofolio' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'blog', label: 'Blog' },
  { value: 'e-commerce', label: 'E-Commerce' },
]

function mapTemplate(raw: { id: number; name: string; slug: string; description: string | null; thumbnail_url: string | null; is_featured: boolean; categories: { id: number; name: string; slug: string }[]; created_at: string; updated_at: string }): Template {
  const cat = raw.categories[0]
  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.slug,
    category: (cat?.slug ?? 'umkm') as Template['category'],
    description: raw.description ?? '',
    thumbnail: raw.thumbnail_url ?? '',
    previews: [],
    lastUpdated: new Date(raw.updated_at).toLocaleDateString('id-ID'),
    visibility: true,
    status: raw.is_featured ? 'featured' : 'published',
    featured: raw.is_featured,
    downloads: 0,
    rating: 0,
  }
}

async function loadTemplates() {
  searching.value = true
  try {
    const result = await fetchTemplates({
      search: search.value || undefined,
      category: activeCategory.value,
      page: page.value,
      sort: sortBy.value,
    })
    templates.value = result.data.map(mapTemplate)
    total.value = result.meta.total
  } catch {
    // empty
  } finally {
    searching.value = false
    loading.value = false
  }
}

// --- Create/Edit dialogs ---
const formOpen = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ name: '', slug: '', description: '', thumbnail_url: '', cdn_url: '', category: 'umkm' })
const submitting = ref(false)

function openCreate() {
  editingId.value = null
  form.value = { name: '', slug: '', description: '', thumbnail_url: '', cdn_url: '', category: 'umkm' }
  formOpen.value = true
}

function openEdit(t: Template) {
  editingId.value = Number(t.id)
  form.value = { name: t.name, slug: t.slug, description: t.description, thumbnail_url: t.thumbnail, cdn_url: '', category: t.category }
  formOpen.value = true
}

async function handleFormSave() {
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token) return
    if (editingId.value) {
      await updateTemplate(token, editingId.value, {
        name: form.value.name,
        slug: form.value.slug || undefined,
        description: form.value.description,
        thumbnail_url: form.value.thumbnail_url || undefined,
        cdn_url: form.value.cdn_url || undefined,
      })
      toast.success('Template diperbarui')
    } else {
      await createTemplate(token, {
        name: form.value.name,
        slug: form.value.slug || undefined,
        description: form.value.description,
        thumbnail_url: form.value.thumbnail_url || 'https://placehold.co/800x600',
        cdn_url: form.value.cdn_url || 'https://placehold.co/800x600',
        category_ids: [],
      })
      toast.success('Template dibuat')
    }
    formOpen.value = false
    await loadTemplates()
  } catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menyimpan')
  } finally {
    submitting.value = false
  }
}

// --- Delete ---
const deleteOpen = ref(false)
const deleteTarget = ref<Template | null>(null)

function handleDelete(t: Template) {
  deleteTarget.value = t
  deleteOpen.value = true
}

async function handleDeleteConfirm() {
  if (!deleteTarget.value) return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token) return
    await deleteTemplate(token, Number(deleteTarget.value.id))
    toast.success('Template dihapus')
    deleteOpen.value = false
    await loadTemplates()
  } catch {
    toast.error('Gagal menghapus')
  } finally {
    submitting.value = false
  }
}

// --- Featured ---
async function handleSetFeatured(t: Template) {
  try {
    const token = auth.token.value
    if (!token) return
    await toggleFeatured(token, Number(t.id), !t.featured)
    t.featured = !t.featured
    t.status = t.featured ? 'featured' : 'published'
    toast.success(t.featured ? 'Unggulan' : 'Non-unggulan')
  } catch {
    toast.error('Gagal mengubah status')
  }
}

function handleArchive(t: Template) {
  toast.info('Arsip belum tersedia')
}

function handleDuplicate(t: Template) {
  toast.info('Duplikasi belum tersedia')
}

function handleToggleVisibility(t: Template, v: boolean) {
  t.visibility = v
  toast.success(v ? 'Template terlihat' : 'Template disembunyikan')
}

function handlePreview(t: Template) {
  toast.info(`Pratinjau: ${t.name}`)
}

const tabsListRef = ref<{ $el?: HTMLElement } | null>(null)

function scrollActiveTabIntoView() {
  const root = tabsListRef.value?.$el
  const active = root?.querySelector('[data-state="active"]')
  active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

watch(activeCategory, () => {
  nextTick(() => scrollActiveTabIntoView())
})

watch([search, activeCategory, sortBy], () => {
  page.value = 1
  loadTemplates()
})

onMounted(async () => {
  await auth.bootstrap()
  await loadTemplates()
  nextTick(() => scrollActiveTabIntoView())
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Manajemen Template" description="Kelola semua template website yang tersedia untuk klien." size="large">
      <template #actions>
        <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" @click="openCreate">
          <Icon name="i-lucide-plus" class="size-4" /> Template Baru
        </Button>
      </template>
    </SharedPageHeader>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="w-full sm:max-w-xs">
        <SharedSearchInput v-model="search" placeholder="Cari template..." />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="rounded-xl border-editor-border">
            Urutkan <Icon name="i-lucide-chevron-down" class="ml-1 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-40 rounded-xl">
          <DropdownMenuItem @click="sortBy = 'created_at'">Terbaru</DropdownMenuItem>
          <DropdownMenuItem @click="sortBy = 'updated_at'">Terbaru Diperbarui</DropdownMenuItem>
          <DropdownMenuItem @click="sortBy = 'name'">Abjad</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Tabs v-model="activeCategory" class="w-full">
      <TabsList ref="tabsListRef" class="flex h-auto w-full items-center justify-start gap-1 overflow-x-auto rounded-xl bg-muted p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:w-fit sm:max-w-full [&::-webkit-scrollbar]:hidden">
        <TabsTrigger v-for="cat in categories" :key="cat.value" :value="cat.value" class="shrink-0 rounded-lg px-3 py-1.5 whitespace-nowrap data-[state=active]:bg-editor-primary data-[state=active]:text-editor-primary-foreground">
          {{ cat.label }}
        </TabsTrigger>
      </TabsList>
    </Tabs>

    <div v-if="!searching && templates.length === 0 && !loading">
      <SharedEmptyState icon="i-lucide-layers" title="Tidak Ada Template Ditemukan" description="Coba ubah filter atau buat template baru.">
        <template #action>
          <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" @click="openCreate">
            Template Baru
          </Button>
        </template>
      </SharedEmptyState>
    </div>

    <div v-else-if="searching || loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 6" :key="n">
        <Card class="overflow-hidden rounded-2xl">
          <Skeleton class="aspect-[16/10] w-full" />
          <CardContent class="space-y-3 p-4">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-3 w-1/2" />
            <Skeleton class="h-3 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <TemplateCard
        v-for="t in templates" :key="t.id"
        :template="t"
        @preview="handlePreview"
        @edit="openEdit"
        @duplicate="handleDuplicate"
        @delete="handleDelete"
        @archive="handleArchive"
        @featured="handleSetFeatured"
        @toggle-visibility="handleToggleVisibility"
      />
    </div>

    <div v-if="!searching && total > 12" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadTemplates()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page * 12 >= total" @click="page++; loadTemplates()">
        Selanjutnya
      </Button>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:open="formOpen">
      <DialogContent class="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>{{ editingId ? 'Edit Template' : 'Template Baru' }}</DialogTitle>
          <DialogDescription>Isi detail template.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="space-y-1.5">
            <Label for="t-name">Nama Template</Label>
            <Input id="t-name" v-model="form.name" placeholder="Template Saya" class="rounded-xl" />
          </div>
          <div class="space-y-1.5">
            <Label for="t-slug">Slug</Label>
            <Input id="t-slug" v-model="form.slug" placeholder="template-saya" class="rounded-xl" />
          </div>
          <div class="space-y-1.5">
            <Label for="t-cat">Kategori</Label>
            <Select v-model="form.category">
              <SelectTrigger id="t-cat" class="rounded-xl">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in categories.slice(1)" :key="c.value" :value="c.value">
                  {{ c.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="t-desc">Deskripsi</Label>
            <Textarea id="t-desc" v-model="form.description" rows="3" class="rounded-xl" />
          </div>
          <div class="space-y-1.5">
            <Label for="t-thumb">URL Thumbnail</Label>
            <Input id="t-thumb" v-model="form.thumbnail_url" placeholder="https://..." class="rounded-xl" />
          </div>
          <div class="space-y-1.5">
            <Label for="t-cdn">URL CDN (ZIP)</Label>
            <Input id="t-cdn" v-model="form.cdn_url" placeholder="https://..." class="rounded-xl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="formOpen = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" :disabled="submitting" @click="handleFormSave">
            {{ editingId ? 'Simpan' : 'Buat' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete confirmation -->
    <AlertDialog v-model:open="deleteOpen">
      <AlertDialogContent class="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
          <AlertDialogDescription>"{{ deleteTarget?.name }}" akan dihapus permanen dan tidak dapat dipulihkan.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="rounded-xl">Batal</AlertDialogCancel>
          <AlertDialogAction class="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" @click="handleDeleteConfirm">
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
