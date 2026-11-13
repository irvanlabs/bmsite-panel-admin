<script setup lang="ts">
import { rp } from '@/lib/utils'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { Button } from '@/components/ui/button'

defineProps<{
  data: { invoice: string, date: string, amount: number, status: string }[]
  loading?: boolean
}>()

const emit = defineEmits<{ (e: 'viewInvoice', row: { invoice: string }): void }>()

const columns = [
  { key: 'invoice', label: 'ID Faktur', sortable: true },
  { key: 'date', label: 'Tanggal Tagihan', sortable: true },
  { key: 'amount', label: 'Jumlah', sortable: true, class: 'text-right' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'action', label: 'Aksi', sortable: false, class: 'text-right' },
] as { key: string, label: string, sortable?: boolean, class?: string }[]
</script>

<template>
  <SharedDataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    empty-text="Belum ada riwayat pembayaran"
  >
    <template #cell-amount="{ value }">
      <span class="tabular-nums">{{ rp(value as number) }}</span>
    </template>
    <template #cell-status="{ row }">
      <SharedStatusBadge :status="(row.status as any)" />
    </template>
    <template #cell-action="{ row }">
      <Button variant="outline" size="sm" class="rounded-xl" @click="emit('viewInvoice', row)">
        <Icon name="i-lucide-eye" class="size-4" /> Lihat Faktur
      </Button>
    </template>
  </SharedDataTable>
</template>
