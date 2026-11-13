<script setup lang="ts">
import type { AdminInvoiceResponse } from '~/services/admin/billing.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { idr } from '@/lib/utils'
import { useAuth } from '~/composables/useAuth'
import { fetchAdminInvoices } from '~/services/admin/billing.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const search = ref('')
const statusFilter = ref('_all')
const page = ref(1)
const total = ref(0)

interface Invoice {
  id: string
  customer: string
  email: string
  date: string
  amount: number
  status: string
  plan: string
}
const invoices = ref<Invoice[]>([])

function mapInvoice(raw: AdminInvoiceResponse): Invoice {
  return {
    id: raw.invoice_number,
    customer: raw.user?.name ?? '-',
    email: raw.user?.email ?? '-',
    date: new Date(raw.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    amount: raw.total,
    status: raw.status,
    plan: raw.items[0]?.name ?? '-',
  }
}

const metrics = ref<{ label: string, value: string, icon: string, color?: string }[]>([
  { label: 'Total Faktur', value: '0', icon: 'i-lucide-file-text' },
  { label: 'Dibayar', value: '0', icon: 'i-lucide-check-circle', color: 'text-emerald-500' },
  { label: 'Tertunda', value: '0', icon: 'i-lucide-clock', color: 'text-amber-500' },
  { label: 'Gagal', value: '0', icon: 'i-lucide-x-circle', color: 'text-red-500' },
])

const statusOptions = [
  { value: '_all', label: 'Semua Status' },
  { value: 'paid', label: 'Dibayar' },
  { value: 'pending', label: 'Tertunda' },
  { value: 'failed', label: 'Gagal' },
  { value: 'expired', label: 'Kadaluarsa' },
]

const columns = [
  { key: 'id', label: 'Faktur', sortable: true },
  { key: 'customer', label: 'Pelanggan', sortable: true },
  { key: 'date', label: 'Tanggal', sortable: true },
  { key: 'plan', label: 'Paket' },
  { key: 'amount', label: 'Jumlah', class: 'text-right font-mono tabular-nums', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

async function loadInvoices() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    const result = await fetchAdminInvoices(token, {
      status: statusFilter.value,
      page: page.value,
    })

    const all = result.data
    metrics.value[0]!.value = String(result.meta.total)
    metrics.value[1]!.value = String(all.filter(i => i.status === 'paid').length)
    metrics.value[2]!.value = String(all.filter(i => i.status === 'pending').length)
    metrics.value[3]!.value = String(all.filter(i => i.status === 'failed').length)

    invoices.value = all.map(mapInvoice)
    total.value = result.meta.total
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat faktur')
  }
  finally {
    loading.value = false
  }
}

function handleExport() {
  const csv = [['Faktur', 'Pelanggan', 'Email', 'Tanggal', 'Paket', 'Jumlah', 'Status'].join(',')]
    .concat(invoices.value.map(i => [i.id, i.customer, i.email, i.date, i.plan, String(i.amount), i.status].join(',')))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `invoices-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('Laporan terunduh')
}

onMounted(async () => {
  await auth.bootstrap()
  await loadInvoices()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Faktur" description="Kelola dan lacak semua faktur platform.">
      <template #actions>
        <Button variant="outline" class="rounded-xl" @click="handleExport">
          <Icon name="i-lucide-download" class="size-4" /> Ekspor CSV
        </Button>
        <Button class="rounded-xl" disabled title="Pembuatan faktur manual belum didukung backend">
          <Icon name="i-lucide-plus" class="size-4" /> Faktur Baru
        </Button>
      </template>
    </SharedPageHeader>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="m in metrics" :key="m.label" class="rounded-2xl p-5">
        <CardContent class="p-0">
          <div class="flex items-center justify-between">
            <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {{ m.label }}
            </p>
            <Icon :name="m.icon" class="size-4" :class="[m.color ?? 'text-muted-foreground']" />
          </div>
          <p class="mt-2 text-2xl font-bold tracking-tight" :class="m.color">
            {{ m.value }}
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <Select v-model="statusFilter" @update:model-value="page = 1; loadInvoices()">
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
      v-model:search="search"
      :columns="columns"
      :data="invoices"
      :loading="loading"
      :filter-keys="['id', 'customer']"
      empty-text="Tidak ada faktur"
    >
      <template #cell-customer="{ row }">
        <div>
          <p class="text-sm font-medium text-foreground">
            {{ row.customer }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ row.email }}
          </p>
        </div>
      </template>
      <template #cell-amount="{ row }">
        <span class="tabular-nums">{{ idr(row.amount) }}</span>
      </template>
      <template #cell-status="{ row }">
        <SharedStatusBadge :status="row.status as any" />
      </template>
    </SharedDataTable>

    <div v-if="total > 10" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadInvoices()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page * 10 >= total" @click="page++; loadInvoices()">
        Selanjutnya
      </Button>
    </div>
  </div>
</template>
