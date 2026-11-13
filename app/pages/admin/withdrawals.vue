<script setup lang="ts">
import type { WithdrawalRow } from '~/services/admin/withdrawals.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
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
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { idr } from '@/lib/utils'
import { useAuth } from '~/composables/useAuth'
import {
  fetchAdminWithdrawals,
  updateWithdrawalStatus,

} from '~/services/admin/withdrawals.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const forbidden = ref(false)
const statusFilter = ref('_all')
const page = ref(1)
const lastPage = ref(1)
const rows = ref<WithdrawalRow[]>([])

const statusOptions = [
  { value: '_all', label: 'Semua' },
  { value: 'pending', label: 'Tertunda' },
  { value: 'processing', label: 'Diproses' },
  { value: 'completed', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' },
]

const statusMeta: Record<string, { status: string, label: string }> = {
  // `status` drives badge colour: it must be a key present in StatusBadge's
  // dotClass map, so map withdrawal states onto close-by badge states
  // instead of emitting non-existent ones.
  pending: { status: 'pending', label: 'Tertunda' },
  processing: { status: 'processing', label: 'Diproses' },
  completed: { status: 'paid', label: 'Selesai' },
  rejected: { status: 'failed', label: 'Ditolak' },
}

const columns = [
  { key: 'withdrawal_number', label: 'Nomor Penarikan', sortable: true },
  { key: 'customer', label: 'Pelanggan' },
  { key: 'amount', label: 'Jumlah', class: 'text-right font-mono tabular-nums', sortable: true },
  { key: 'bank', label: 'Bank / Rekening' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Tanggal Diminta', sortable: true },
  { key: 'processed_at', label: 'Diproses' },
  { key: 'actions', label: 'Aksi' },
]

function customerName(row: WithdrawalRow): string {
  return row.user?.name ?? `#${row.user_id}`
}

function customerEmail(row: WithdrawalRow): string {
  return row.user?.email ?? ''
}

function formatDate(v: string | null): string {
  if (!v)
    return '-'
  return new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function validTransitions(status: string): Array<'processing' | 'completed' | 'rejected'> {
  if (status === 'pending')
    return ['processing', 'completed', 'rejected']
  if (status === 'processing')
    return ['completed', 'rejected']
  return []
}

function transitionLabel(s: string): string {
  if (s === 'processing')
    return 'Diproses'
  if (s === 'completed')
    return 'Selesai'
  if (s === 'rejected')
    return 'Ditolak'
  return s
}

async function loadWithdrawals() {
  loading.value = true
  forbidden.value = false
  try {
    const token = auth.token.value
    if (!token)
      return
    const result = await fetchAdminWithdrawals(token, {
      status: statusFilter.value,
      page: page.value,
      sort: 'created_at',
      direction: 'desc',
    })
    rows.value = result.data
    lastPage.value = result.meta.last_page
  }
  catch (e: unknown) {
    const err = e as { statusCode?: number, status?: number, data?: { error?: { message?: string }, message?: string } }
    const st = err.statusCode ?? err.status
    if (st === 403) {
      forbidden.value = true
      return
    }
    toast.error(err.data?.error?.message ?? err.data?.message ?? 'Gagal memuat data penarikan')
  }
  finally {
    loading.value = false
  }
}

// action dialog
const actionDialog = ref(false)
const selectedRow = ref<WithdrawalRow | null>(null)
const selectedStatus = ref<'processing' | 'completed' | 'rejected'>('processing')
const notes = ref('')
const submitting = ref(false)

function openAction(row: WithdrawalRow) {
  selectedRow.value = row
  const opts = validTransitions(row.status)
  selectedStatus.value = opts[0] ?? 'processing'
  notes.value = ''
  actionDialog.value = true
}

async function confirmAction() {
  if (!selectedRow.value)
    return
  submitting.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    await updateWithdrawalStatus(token, selectedRow.value.id, selectedStatus.value, notes.value.trim() || undefined)
    toast.success('Status penarikan diperbarui')
    actionDialog.value = false
    await loadWithdrawals()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string }, message?: string } }
    toast.error(err.data?.error?.message ?? err.data?.message ?? 'Gagal memperbarui status')
  }
  finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await auth.bootstrap()
  await loadWithdrawals()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Penarikan" description="Kelola permintaan penarikan dana dari pelanggan." />

    <div v-if="forbidden" class="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p class="text-sm font-medium text-destructive">
        Akses khusus superadmin
      </p>
    </div>

    <template v-else>
      <div class="flex flex-wrap items-center gap-3">
        <Select v-model="statusFilter" @update:model-value="page = 1; loadWithdrawals()">
          <SelectTrigger class="w-40 rounded-xl border-editor-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SharedDataTable
        :columns="columns"
        :data="rows"
        :loading="loading"
        :filter-keys="['withdrawal_number']"
        empty-text="Belum ada permintaan penarikan"
      >
        <template #cell-customer="{ row }">
          <div>
            <p class="text-sm font-medium text-foreground">
              {{ customerName(row as WithdrawalRow) }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ customerEmail(row as WithdrawalRow) }}
            </p>
          </div>
        </template>
        <template #cell-amount="{ row }">
          <span class="tabular-nums">{{ idr(Number((row as WithdrawalRow).amount)) }}</span>
        </template>
        <template #cell-bank="{ row }">
          <div>
            <p class="text-sm font-medium text-foreground">
              {{ (row as WithdrawalRow).bank_name }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ (row as WithdrawalRow).account_number }} · {{ (row as WithdrawalRow).account_name }}
            </p>
          </div>
        </template>
        <template #cell-status="{ row }">
          <SharedStatusBadge
            :status="(statusMeta[(row as WithdrawalRow).status]?.status ?? 'pending') as any"
            :label="statusMeta[(row as WithdrawalRow).status]?.label"
          />
        </template>
        <template #cell-created_at="{ row }">
          {{ formatDate((row as WithdrawalRow).created_at) }}
        </template>
        <template #cell-processed_at="{ row }">
          {{ formatDate((row as WithdrawalRow).processed_at) }}
        </template>
        <template #cell-actions="{ row }">
          <Button
            v-if="validTransitions((row as WithdrawalRow).status).length > 0"
            variant="outline"
            size="sm"
            class="rounded-xl"
            @click="openAction(row as WithdrawalRow)"
          >
            Kelola
          </Button>
          <span v-else class="text-xs text-muted-foreground">-</span>
        </template>
      </SharedDataTable>

      <div v-if="lastPage > 1" class="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadWithdrawals()">
          Sebelumnya
        </Button>
        <span class="text-sm text-muted-foreground">Halaman {{ page }} dari {{ lastPage }}</span>
        <Button variant="outline" size="sm" class="rounded-xl" :disabled="page >= lastPage" @click="page++; loadWithdrawals()">
          Selanjutnya
        </Button>
      </div>
    </template>

    <Dialog v-model:open="actionDialog">
      <DialogContent class="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Kelola Penarikan</DialogTitle>
          <DialogDescription>
            {{ selectedRow?.withdrawal_number }} · {{ selectedRow ? customerName(selectedRow) : '' }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-1.5">
            <Label for="new-status">Status Baru</Label>
            <Select v-model="selectedStatus">
              <SelectTrigger id="new-status" class="w-full rounded-xl border-editor-border">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="s in (selectedRow ? validTransitions(selectedRow.status) : [])"
                  :key="s"
                  :value="s"
                >
                  {{ transitionLabel(s) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="notes">Catatan <span class="text-muted-foreground">(opsional)</span></Label>
            <Textarea id="notes" v-model="notes" rows="3" class="rounded-xl resize-none" placeholder="Catatan penolakan..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" class="rounded-xl" :disabled="submitting" @click="actionDialog = false">
            Batal
          </Button>
          <Button
            class="rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover"
            :disabled="submitting || !selectedStatus"
            @click="confirmAction"
          >
            {{ submitting ? 'Menyimpan...' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
