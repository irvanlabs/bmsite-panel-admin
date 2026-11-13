<script setup lang="ts">
import type { AdminPlanPayload, AdminPlanResponse } from '~/services/admin/plans.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { rp } from '@/lib/utils'
import { useAuth } from '~/composables/useAuth'
import { createAdminPlan, deleteAdminPlan, fetchAdminPlans, updateAdminPlan } from '~/services/admin/plans.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()

const loading = ref(true)
const plans = ref<AdminPlanResponse[]>([])

const formOpen = ref(false)
const editingPlan = ref<AdminPlanResponse | null>(null)
const formSaving = ref(false)
const form = ref({
  name: '',
  description: '',
  price_monthly: '',
  price_yearly: '',
  currency: 'IDR',
  is_popular: false,
  features: '',
})

const deleteOpen = ref(false)
const deleteTarget = ref<AdminPlanResponse | null>(null)
const deleteSaving = ref(false)

async function loadPlans() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    plans.value = await fetchAdminPlans(token)
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat paket')
  }
  finally {
    loading.value = false
  }
}

function openCreate() {
  editingPlan.value = null
  form.value = { name: '', description: '', price_monthly: '', price_yearly: '', currency: 'IDR', is_popular: false, features: '' }
  formOpen.value = true
}

function openEdit(plan: AdminPlanResponse) {
  editingPlan.value = plan
  form.value = {
    name: plan.name,
    description: plan.description ?? '',
    price_monthly: String(plan.price_monthly),
    price_yearly: plan.price_yearly != null ? String(plan.price_yearly) : '',
    currency: plan.currency,
    is_popular: plan.is_popular,
    features: (plan.features ?? []).join(', '),
  }
  formOpen.value = true
}

function parsePrice(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed)
    return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function buildPayload(): AdminPlanPayload | null {
  const name = form.value.name.trim()
  if (!name) {
    toast.error('Nama paket wajib diisi')
    return null
  }
  const priceMonthly = parsePrice(form.value.price_monthly)
  if (priceMonthly === null) {
    toast.error('Harga bulanan tidak valid')
    return null
  }
  const priceYearly = parsePrice(form.value.price_yearly)
  if (form.value.price_yearly.trim() && priceYearly === null) {
    toast.error('Harga tahunan tidak valid')
    return null
  }
  const currency = form.value.currency.trim().toUpperCase()
  if (currency.length !== 3) {
    toast.error('Kode mata uang harus 3 huruf (cth. IDR)')
    return null
  }

  return {
    name,
    description: form.value.description.trim() || null,
    price_monthly: priceMonthly,
    price_yearly: priceYearly,
    currency,
    is_popular: form.value.is_popular,
    features: form.value.features.split(',').map(f => f.trim()).filter(Boolean),
  }
}

async function submitForm() {
  const token = auth.token.value
  if (!token)
    return
  const payload = buildPayload()
  if (!payload)
    return

  formSaving.value = true
  try {
    if (editingPlan.value) {
      await updateAdminPlan(token, editingPlan.value.id, payload)
      toast.success(`Paket "${payload.name}" diperbarui`)
    }
    else {
      await createAdminPlan(token, payload)
      toast.success(`Paket "${payload.name}" dibuat`)
    }
    formOpen.value = false
    await loadPlans()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menyimpan paket')
  }
  finally {
    formSaving.value = false
  }
}

function confirmDelete(plan: AdminPlanResponse) {
  deleteTarget.value = plan
  deleteOpen.value = true
}

async function submitDelete() {
  const token = auth.token.value
  const target = deleteTarget.value
  if (!token || !target)
    return

  deleteSaving.value = true
  try {
    await deleteAdminPlan(token, target.id)
    toast.success(`Paket "${target.name}" dihapus`)
    deleteOpen.value = false
    await loadPlans()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menghapus paket')
  }
  finally {
    deleteSaving.value = false
  }
}

onMounted(async () => {
  await auth.bootstrap()
  await loadPlans()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Paket Langganan" description="Kelola paket langganan yang tersedia.">
      <template #actions>
        <Button class="rounded-xl" @click="openCreate">
          <Icon name="i-lucide-plus" class="size-4" /> Tambah Paket
        </Button>
      </template>
    </SharedPageHeader>

    <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="h-64 animate-pulse rounded-2xl bg-muted" />
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="plan in plans" :key="plan.id" class="relative">
        <div v-if="plan.is_popular" class="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge class="rounded-xl bg-editor-primary px-3 py-1 text-xs text-editor-primary-foreground">
            Terpopuler
          </Badge>
        </div>
        <div class="flex h-full flex-col rounded-2xl border p-6">
          <h3 class="text-lg font-semibold">
            {{ plan.name }}
          </h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ plan.description ?? '-' }}
          </p>
          <div class="mt-4 flex items-baseline gap-1">
            <span class="text-3xl font-bold">{{ rp(plan.price_monthly) }}</span>
            <span class="text-sm text-muted-foreground">/bln</span>
          </div>
          <div v-if="plan.price_yearly" class="mt-1 text-sm text-muted-foreground">
            {{ rp(plan.price_yearly) }}/tahun
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="feature in plan.features ?? []" :key="feature" class="flex items-center gap-2 text-sm">
              <Icon name="i-lucide-check" class="size-4 shrink-0 text-green-500" />
              <span>{{ feature }}</span>
            </div>
          </div>
          <div class="mt-6 flex gap-2">
            <Button variant="outline" size="sm" class="rounded-xl" title="Ubah paket" @click="openEdit(plan)">
              <Icon name="i-lucide-pencil" class="size-3.5" />
            </Button>
            <Button variant="outline" size="sm" class="rounded-xl text-destructive" title="Hapus paket" @click="confirmDelete(plan)">
              <Icon name="i-lucide-trash-2" class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && plans.length === 0" class="text-sm text-muted-foreground">
      Tidak ada paket.
    </div>

    <Dialog v-model:open="formOpen">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{{ editingPlan ? 'Ubah Paket' : 'Tambah Paket' }}</DialogTitle>
          <DialogDescription>Paket dipakai untuk berlangganan dan penentuan harga invoice.</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <Label for="plan-name" class="text-sm font-medium">Nama</Label>
            <Input id="plan-name" v-model="form.name" placeholder="Pro" />
          </div>
          <div class="space-y-1.5">
            <Label for="plan-description" class="text-sm font-medium">Deskripsi</Label>
            <Input id="plan-description" v-model="form.description" placeholder="Untuk pengguna profesional" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="plan-price-monthly" class="text-sm font-medium">Harga bulanan</Label>
              <Input id="plan-price-monthly" v-model="form.price_monthly" type="number" min="0" placeholder="99000" />
            </div>
            <div class="space-y-1.5">
              <Label for="plan-price-yearly" class="text-sm font-medium">Harga tahunan</Label>
              <Input id="plan-price-yearly" v-model="form.price_yearly" type="number" min="0" placeholder="999000" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="plan-currency" class="text-sm font-medium">Mata uang</Label>
              <Input id="plan-currency" v-model="form.currency" maxlength="3" placeholder="IDR" />
            </div>
            <div class="flex items-end gap-2 pb-2">
              <Switch id="plan-popular" v-model="form.is_popular" />
              <Label for="plan-popular" class="text-sm font-medium">Terpopuler</Label>
            </div>
          </div>
          <div class="space-y-1.5">
            <Label for="plan-features" class="text-sm font-medium">Fitur (pisahkan dengan koma)</Label>
            <Input id="plan-features" v-model="form.features" placeholder="10 situs, Domain kustom" />
          </div>
        </div>
        <DialogFooter>
          <Button class="rounded-xl" :disabled="formSaving" @click="submitForm">
            {{ editingPlan ? 'Simpan' : 'Buat' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="deleteOpen">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Hapus paket "{{ deleteTarget?.name }}"?</DialogTitle>
          <DialogDescription>
            Paket yang masih dipakai langganan aktif tidak dapat dihapus.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" @click="deleteOpen = false">
            Batal
          </Button>
          <Button variant="destructive" class="rounded-xl" :disabled="deleteSaving" @click="submitDelete">
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
