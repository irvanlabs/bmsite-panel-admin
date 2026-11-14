<script setup lang="ts">
import type { CouponInput, CouponRow } from '~/services/admin/coupons.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { idr } from '@/lib/utils'
import { useAuth } from '~/composables/useAuth'
import { createCoupon, deleteCoupon, fetchCoupons, updateCoupon } from '~/services/admin/coupons.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()

const loading = ref(true)
const rows = ref<CouponRow[]>([])
const page = ref(1)
const lastPage = ref(1)

const columns = [
  { key: 'code', label: 'Kode', sortable: true },
  { key: 'discount', label: 'Diskon' },
  { key: 'min_amount', label: 'Min. Belanja' },
  { key: 'scope', label: 'Scope' },
  { key: 'usage', label: 'Terpakai' },
  { key: 'periode', label: 'Periode' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Aksi' },
]

const scopeLabels: Record<string, string> = {
  all: 'Semua',
  subscription: 'Langganan',
  domain: 'Domain',
}

function formatMoneyValue(value: string | number): string {
  return idr(Number(value))
}

function discountLabel(coupon: CouponRow): string {
  return coupon.discount_type === 'percent'
    ? `${Number(coupon.discount_value)}%`
    : formatMoneyValue(coupon.discount_value)
}

function formatDate(v: string | null): string {
  if (!v)
    return '-'
  return new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function periodeLabel(coupon: CouponRow): string {
  return `${formatDate(coupon.starts_at)} – ${formatDate(coupon.expires_at)}`
}

async function loadCoupons() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    const result = await fetchCoupons(token, { page: page.value })
    rows.value = result.data
    lastPage.value = result.meta.last_page
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat kupon')
  }
  finally {
    loading.value = false
  }
}

// form dialog
const formOpen = ref(false)
const editingCoupon = ref<CouponRow | null>(null)
const formSaving = ref(false)
const form = ref({
  code: '',
  description: '',
  discount_type: 'percent' as 'percent' | 'fixed',
  discount_value: '',
  min_amount: '',
  usage_limit: '',
  usage_limit_per_user: '',
  scope: 'all' as 'all' | 'subscription' | 'domain',
  starts_at: '',
  expires_at: '',
  is_active: true,
})

const discountValueLabel = computed(() => form.value.discount_type === 'percent' ? '% diskon' : 'Rp')

function openCreate() {
  editingCoupon.value = null
  form.value = {
    code: '',
    description: '',
    discount_type: 'percent',
    discount_value: '',
    min_amount: '',
    usage_limit: '',
    usage_limit_per_user: '',
    scope: 'all',
    starts_at: '',
    expires_at: '',
    is_active: true,
  }
  formOpen.value = true
}

function openEdit(coupon: CouponRow) {
  editingCoupon.value = coupon
  form.value = {
    code: coupon.code,
    description: coupon.description ?? '',
    discount_type: coupon.discount_type,
    discount_value: String(Number(coupon.discount_value)),
    min_amount: coupon.min_amount != null ? String(coupon.min_amount) : '',
    usage_limit: coupon.usage_limit != null ? String(coupon.usage_limit) : '',
    usage_limit_per_user: coupon.usage_limit_per_user != null ? String(coupon.usage_limit_per_user) : '',
    scope: coupon.scope,
    starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 10) : '',
    expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
    is_active: coupon.is_active,
  }
  formOpen.value = true
}

function parseNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed)
    return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function buildPayload(): CouponInput | null {
  const code = form.value.code.trim().toUpperCase()
  if (!code) {
    toast.error('Kode kupon wajib diisi')
    return null
  }
  const discountValue = parseNumber(form.value.discount_value)
  if (discountValue === null || discountValue <= 0) {
    toast.error('Nilai diskon harus lebih dari 0')
    return null
  }
  if (form.value.discount_type === 'percent' && discountValue > 100) {
    toast.error('Diskon persen tidak boleh lebih dari 100')
    return null
  }
  const minAmount = parseNumber(form.value.min_amount)
  const usageLimit = parseNumber(form.value.usage_limit)
  const usageLimitPerUser = parseNumber(form.value.usage_limit_per_user)

  return {
    code,
    description: form.value.description.trim() || null,
    discount_type: form.value.discount_type,
    discount_value: discountValue,
    currency: 'IDR',
    min_amount: minAmount,
    usage_limit: usageLimit,
    usage_limit_per_user: usageLimitPerUser,
    scope: form.value.scope,
    starts_at: form.value.starts_at || null,
    expires_at: form.value.expires_at || null,
    is_active: form.value.is_active,
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
    if (editingCoupon.value) {
      await updateCoupon(token, editingCoupon.value.id, payload)
      toast.success(`Kupon "${payload.code}" diperbarui`)
    }
    else {
      await createCoupon(token, payload)
      toast.success(`Kupon "${payload.code}" dibuat`)
    }
    formOpen.value = false
    await loadCoupons()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menyimpan kupon')
  }
  finally {
    formSaving.value = false
  }
}

// delete dialog
const deleteOpen = ref(false)
const deleteTarget = ref<CouponRow | null>(null)
const deleteSaving = ref(false)

function confirmDelete(coupon: CouponRow) {
  deleteTarget.value = coupon
  deleteOpen.value = true
}

async function submitDelete() {
  const token = auth.token.value
  const target = deleteTarget.value
  if (!token || !target)
    return

  deleteSaving.value = true
  try {
    await deleteCoupon(token, target.id)
    toast.success(`Kupon "${target.code}" dihapus`)
    deleteOpen.value = false
    await loadCoupons()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menghapus kupon')
  }
  finally {
    deleteSaving.value = false
  }
}

onMounted(async () => {
  await auth.bootstrap()
  await loadCoupons()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Set Kupon" description="Kelola kupon diskon untuk langganan dan domain.">
      <template #actions>
        <Button class="rounded-xl" @click="openCreate">
          <Icon name="i-lucide-plus" class="size-4" /> Tambah Kupon
        </Button>
      </template>
    </SharedPageHeader>

    <SharedDataTable
      :columns="columns"
      :data="rows"
      :loading="loading"
      :filter-keys="['code']"
      empty-text="Belum ada kupon"
    >
      <template #cell-code="{ row }">
        <span class="font-mono font-medium">{{ (row as CouponRow).code }}</span>
      </template>
      <template #cell-discount="{ row }">
        <span class="tabular-nums">{{ discountLabel(row as CouponRow) }}</span>
      </template>
      <template #cell-min_amount="{ row }">
        <span class="tabular-nums">{{ (row as CouponRow).min_amount != null ? idr(Number((row as CouponRow).min_amount)) : '-' }}</span>
      </template>
      <template #cell-scope="{ row }">
        {{ scopeLabels[(row as CouponRow).scope] ?? (row as CouponRow).scope }}
      </template>
      <template #cell-usage="{ row }">
        <span class="tabular-nums">
          {{ (row as CouponRow).usage_count }} / {{ (row as CouponRow).usage_limit ?? '∞' }}
        </span>
      </template>
      <template #cell-periode="{ row }">
        <span class="text-xs">{{ periodeLabel(row as CouponRow) }}</span>
      </template>
      <template #cell-status="{ row }">
        <SharedStatusBadge
          :status="((row as CouponRow).is_active ? 'active' : 'error') as any"
          :label="(row as CouponRow).is_active ? 'Aktif' : 'Nonaktif'"
        />
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" class="rounded-xl" title="Ubah kupon" @click="openEdit(row as CouponRow)">
            <Icon name="i-lucide-pencil" class="size-3.5" />
          </Button>
          <Button variant="outline" size="sm" class="rounded-xl text-destructive" title="Hapus kupon" @click="confirmDelete(row as CouponRow)">
            <Icon name="i-lucide-trash-2" class="size-3.5" />
          </Button>
        </div>
      </template>
    </SharedDataTable>

    <div v-if="lastPage > 1" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadCoupons()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }} dari {{ lastPage }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page >= lastPage" @click="page++; loadCoupons()">
        Selanjutnya
      </Button>
    </div>

    <Dialog v-model:open="formOpen">
      <DialogContent class="max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{{ editingCoupon ? 'Ubah Kupon' : 'Tambah Kupon' }}</DialogTitle>
          <DialogDescription>Kupon dipakai saat checkout langganan dan pembelian domain.</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-2">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="coupon-code" class="text-sm font-medium">Kode</Label>
              <Input id="coupon-code" v-model="form.code" placeholder="HEMAT10" class="uppercase" />
            </div>
            <div class="space-y-1.5">
              <Label for="coupon-scope" class="text-sm font-medium">Scope</Label>
              <Select v-model="form.scope">
                <SelectTrigger id="coupon-scope" class="w-full rounded-xl border-editor-border">
                  <SelectValue placeholder="Pilih scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="subscription">Langganan</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-1.5">
            <Label for="coupon-description" class="text-sm font-medium">Deskripsi</Label>
            <Input id="coupon-description" v-model="form.description" placeholder="Diskon 10% untuk langganan baru" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="coupon-type" class="text-sm font-medium">Tipe Diskon</Label>
              <Select v-model="form.discount_type">
                <SelectTrigger id="coupon-type" class="w-full rounded-xl border-editor-border">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Persen</SelectItem>
                  <SelectItem value="fixed">Nominal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label for="coupon-value" class="text-sm font-medium">
                Nilai <span class="text-muted-foreground">({{ discountValueLabel }})</span>
              </Label>
              <Input id="coupon-value" v-model="form.discount_value" type="number" min="0" placeholder="10" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-1.5">
              <Label for="coupon-min" class="text-sm font-medium">Min. Belanja</Label>
              <Input id="coupon-min" v-model="form.min_amount" type="number" min="0" placeholder="100000" />
            </div>
            <div class="space-y-1.5">
              <Label for="coupon-limit" class="text-sm font-medium">Batas Pakai</Label>
              <Input id="coupon-limit" v-model="form.usage_limit" type="number" min="0" placeholder="100" />
            </div>
            <div class="space-y-1.5">
              <Label for="coupon-limit-user" class="text-sm font-medium">Batas / Pengguna</Label>
              <Input id="coupon-limit-user" v-model="form.usage_limit_per_user" type="number" min="0" placeholder="1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="coupon-starts" class="text-sm font-medium">Mulai</Label>
              <Input id="coupon-starts" v-model="form.starts_at" type="date" />
            </div>
            <div class="space-y-1.5">
              <Label for="coupon-expires" class="text-sm font-medium">Berakhir</Label>
              <Input id="coupon-expires" v-model="form.expires_at" type="date" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Switch id="coupon-active" v-model="form.is_active" />
            <Label for="coupon-active" class="text-sm font-medium">Aktif</Label>
          </div>
        </div>
        <DialogFooter>
          <Button class="rounded-xl" :disabled="formSaving" @click="submitForm">
            {{ editingCoupon ? 'Simpan' : 'Buat' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <SharedConfirmDialog
      v-model="deleteOpen"
      :title="`Hapus kupon &quot;${deleteTarget?.code}&quot;?`"
      description="Kupon yang dihapus tidak dapat digunakan kembali."
      confirm-text="Hapus"
      destructive
      @confirm="submitDelete"
    />
  </div>
</template>
