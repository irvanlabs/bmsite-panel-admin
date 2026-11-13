<script setup lang="ts">
import type { AdminOrder } from '@/types/shared'
import AdminPlanBadge from '@/components/admin/PlanBadge.vue'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { idr } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  orders: AdminOrder[]
  loading?: boolean
}>()

const columns = [
  { key: 'id' as const, label: 'ID Pesanan', sortable: true },
  { key: 'customer' as const, label: 'Pelanggan', sortable: true },
  { key: 'plan' as const, label: 'Paket' },
  { key: 'amount' as const, label: 'Jumlah', class: 'text-right font-mono tabular-nums' },
  { key: 'date' as const, label: 'Tanggal' },
  { key: 'status' as const, label: 'Status' },
  { key: 'actions' as const, label: '', class: 'w-10' },
]
</script>

<template>
  <Card class="rounded-2xl p-6">
    <CardHeader class="px-0 pt-0">
      <CardTitle class="text-lg font-semibold">
        Pesanan Terbaru
      </CardTitle>
    </CardHeader>
    <SharedDataTable
      :columns
      :data="orders"
      :loading
      :filter-keys="['id', 'customer']"
      empty-text="Pesanan tidak ditemukan"
    >
      <template #cell-plan="{ row }">
        <AdminPlanBadge :plan="row.plan" />
      </template>
      <template #cell-amount="{ row }">
        <span class="tabular-nums">{{ idr(row.amount) }}</span>
      </template>
      <template #cell-status="{ row }">
        <SharedStatusBadge :status="row.status" />
      </template>
      <template #cell-actions>
        <Button variant="ghost" size="icon-sm" disabled>
          <Icon name="i-lucide-more-horizontal" class="size-4" />
        </Button>
      </template>
    </SharedDataTable>
  </Card>
</template>
