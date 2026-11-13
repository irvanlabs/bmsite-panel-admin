<script setup lang="ts">
import type { AdminSiteResponse } from '~/services/admin/sites.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedSearchInput from '@/components/shared/SearchInput.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '~/composables/useAuth'
import { deleteSite, fetchAdminSites, updateSiteStatus } from '~/services/admin/sites.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const search = ref('')
const statusFilter = ref('_all')
const page = ref(1)
const total = ref(0)

const sites = ref<AdminSiteResponse[]>([])

const stats = ref({ total: 0, active: 0, inactive: 0, suspended: 0 })

const tabs = [
  { value: '_all', label: 'Semua' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
  { value: 'suspended', label: 'Ditangguhkan' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadSites() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    const result = await fetchAdminSites(token, {
      search: search.value,
      status: statusFilter.value,
      page: page.value,
    })
    sites.value = result.data
    total.value = result.meta.total

    // Hitung stats dari total (simple — per-page count kurang akurat untuk filter)
    stats.value = {
      total: result.meta.total,
      active: result.data.filter(s => s.status === 'active').length,
      inactive: result.data.filter(s => s.status === 'inactive').length,
      suspended: result.data.filter(s => s.status === 'suspended').length,
    }
  }
  catch {
    // stays empty
  }
  finally {
    loading.value = false
  }
}

// --- Suspend / Activate dialogs ---
const suspendDialog = ref(false)
const activateDialog = ref(false)
const deleteDialog = ref(false)
const selectedSite = ref<AdminSiteResponse | null>(null)
const submitting = ref(false)

function handleSuspend(site: AdminSiteResponse) {
  selectedSite.value = site
  suspendDialog.value = true
}

function handleActivate(site: AdminSiteResponse) {
  selectedSite.value = site
  activateDialog.value = true
}

function handleDelete(site: AdminSiteResponse) {
  selectedSite.value = site
  deleteDialog.value = true
}

async function confirmSuspend() {
  if (!selectedSite.value)
    return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    await updateSiteStatus(token, selectedSite.value.id, 'suspended')
    toast.success(`${selectedSite.value.subdomain} ditangguhkan`)
    suspendDialog.value = false
    await loadSites()
  }
  catch {
    toast.error('Gagal menangguhkan')
  }
  finally {
    submitting.value = false
  }
}

async function confirmActivate() {
  if (!selectedSite.value)
    return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    await updateSiteStatus(token, selectedSite.value.id, 'active')
    toast.success(`${selectedSite.value.subdomain} diaktifkan`)
    activateDialog.value = false
    await loadSites()
  }
  catch {
    toast.error('Gagal mengaktifkan')
  }
  finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!selectedSite.value)
    return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    await deleteSite(token, selectedSite.value.id)
    toast.success(`${selectedSite.value.subdomain} dihapus`)
    deleteDialog.value = false
    await loadSites()
  }
  catch {
    toast.error('Gagal menghapus')
  }
  finally {
    submitting.value = false
  }
}

function handleView(site: AdminSiteResponse) {
  navigateTo(`/admin/websites/${site.id}/editor`)
}

watch([search, statusFilter], () => {
  page.value = 1
  loadSites()
})

onMounted(async () => {
  await auth.bootstrap()
  await loadSites()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold tracking-tight">
          Manajemen Website
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Monitor dan moderasi semua website di platform.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card class="rounded-2xl p-5">
        <CardContent class="p-0">
          <div class="mb-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent p-2 text-white">
            <Icon name="i-lucide-globe" class="size-4" />
          </div>
          <p class="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total
          </p>
          <span class="text-2xl font-extrabold tracking-tight">{{ stats.total }}</span>
        </CardContent>
      </Card>
      <Card class="rounded-2xl p-5">
        <CardContent class="p-0">
          <div class="mb-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent p-2 text-white">
            <Icon name="i-lucide-check-circle" class="size-4" />
          </div>
          <p class="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Aktif
          </p>
          <span class="text-2xl font-extrabold tracking-tight text-emerald-500">{{ stats.active }}</span>
        </CardContent>
      </Card>
      <Card class="rounded-2xl p-5">
        <CardContent class="p-0">
          <div class="mb-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent p-2 text-white">
            <Icon name="i-lucide-pause-circle" class="size-4" />
          </div>
          <p class="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Ditangguhkan
          </p>
          <span class="text-2xl font-extrabold tracking-tight text-amber-500">{{ stats.suspended }}</span>
        </CardContent>
      </Card>
      <Card class="rounded-2xl p-5">
        <CardContent class="p-0">
          <div class="mb-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent p-2 text-white">
            <Icon name="i-lucide-x-circle" class="size-4" />
          </div>
          <p class="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Nonaktif
          </p>
          <span class="text-2xl font-extrabold tracking-tight text-red-500">{{ stats.inactive }}</span>
        </CardContent>
      </Card>
    </div>

    <div class="flex flex-col gap-4">
      <Tabs v-model="statusFilter">
        <TabsList class="bg-muted rounded-xl p-1">
          <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value" class="rounded-lg data-[state=active]:bg-editor-primary data-[state=active]:text-editor-primary-foreground">
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div class="w-full sm:max-w-xs">
        <SharedSearchInput v-model="search" placeholder="Cari subdomain atau pemilik..." />
      </div>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 5" :key="n" class="h-16 animate-pulse rounded-2xl bg-muted" />
    </div>

    <div v-else-if="sites.length === 0" class="py-12 text-center text-muted-foreground">
      Tidak ada website ditemukan.
    </div>

    <div v-else class="overflow-hidden rounded-2xl border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <th class="px-4 py-3">
              Domain
            </th>
            <th class="px-4 py-3">
              Pemilik
            </th>
            <th class="px-4 py-3">
              Paket
            </th>
            <th class="px-4 py-3">
              Status
            </th>
            <th class="px-4 py-3">
              Halaman
            </th>
            <th class="px-4 py-3">
              Dibuat
            </th>
            <th class="px-4 py-3">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in sites" :key="s.id" class="border-b last:border-0 transition-colors hover:bg-muted/30">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <Icon name="i-lucide-globe" class="size-4 shrink-0 text-editor-primary" />
                <span class="text-sm font-semibold">{{ s.subdomain }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div>
                <p class="text-sm">
                  {{ s.owner_name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ s.owner_email }}
                </p>
              </div>
            </td>
            <td class="px-4 py-3">
              <span v-if="s.plan" class="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium">{{ s.plan }}</span>
              <span v-else class="text-xs text-muted-foreground">-</span>
            </td>
            <td class="px-4 py-3">
              <SharedStatusBadge :status="s.status as any" />
            </td>
            <td class="px-4 py-3 text-sm">
              {{ s.pages_count }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
              {{ formatDate(s.created_at) }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" class="rounded-lg" @click="handleView(s)">
                  <Icon name="i-lucide-eye" class="size-3.5" />
                </Button>
                <template v-if="s.status === 'suspended'">
                  <Button variant="ghost" size="icon-sm" class="rounded-lg text-emerald-500" @click="handleActivate(s)">
                    <Icon name="i-lucide-play" class="size-3.5" />
                  </Button>
                </template>
                <template v-else>
                  <Button variant="ghost" size="icon-sm" class="rounded-lg text-amber-500" @click="handleSuspend(s)">
                    <Icon name="i-lucide-pause" class="size-3.5" />
                  </Button>
                </template>
                <Button variant="ghost" size="icon-sm" class="rounded-lg text-destructive" @click="handleDelete(s)">
                  <Icon name="i-lucide-trash-2" class="size-3.5" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="total > 12" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadSites()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page * 12 >= total" @click="page++; loadSites()">
        Selanjutnya
      </Button>
    </div>

    <!-- Suspend Dialog -->
    <Dialog v-model:open="suspendDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Tangguhkan Website</DialogTitle>
          <DialogDescription>
            Tangguhkan <strong>{{ selectedSite?.subdomain }}</strong>?
            Website tidak akan dapat diakses publik.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="suspendDialog = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-amber-500 text-white hover:bg-amber-600" :disabled="submitting" @click="confirmSuspend">
            Tangguhkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Activate Dialog -->
    <Dialog v-model:open="activateDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Aktifkan Website</DialogTitle>
          <DialogDescription>
            Aktifkan kembali <strong>{{ selectedSite?.subdomain }}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="activateDialog = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" :disabled="submitting" @click="confirmActivate">
            Aktifkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Dialog -->
    <Dialog v-model:open="deleteDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Hapus Website</DialogTitle>
          <DialogDescription>
            Hapus <strong>{{ selectedSite?.subdomain }}</strong> dari platform?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="deleteDialog = false">
            Batal
          </Button>
          <Button class="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" :disabled="submitting" @click="confirmDelete">
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
