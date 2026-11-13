<script setup lang="ts">
import type { AdminUser } from '~/types/shared'
import AdminPlanBadge from '@/components/admin/PlanBadge.vue'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { idr } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

withDefaults(defineProps<{
  data: AdminUser[]
  loading?: boolean
}>(), { loading: false })

const emit = defineEmits<{
  suspend: [user: AdminUser]
  activate: [user: AdminUser]
  changeRole: [user: AdminUser]
  view: [user: AdminUser]
}>()

const columns = [
  { key: 'name', label: 'Pengguna', sortable: true },
  { key: 'website', label: 'Website / Domain', sortable: true },
  { key: 'createdDate', label: 'Dibuat', sortable: true },
  { key: 'plan', label: 'Paket', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'payment', label: 'Pembayaran', sortable: false },
  { key: 'actions', label: 'Aksi', sortable: false, class: 'text-right' },
] as { key: string, label: string, sortable?: boolean, class?: string }[]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}
</script>

<template>
  <SharedDataTable
    :columns="columns"
    :data="data"
    :loading="loading"
    :filter-keys="['name', 'email', 'website']"
    empty-text="Pengguna tidak ditemukan"
  >
    <template #cell-name="{ row }">
      <div class="flex items-center gap-3">
        <Avatar class="size-9 rounded-xl">
          <AvatarFallback class="rounded-xl text-xs">
            {{ initials(row.name) }}
          </AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm font-medium text-foreground">
            {{ row.name }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ row.email }}
          </p>
        </div>
      </div>
    </template>
    <template #cell-website="{ row }">
      <p class="text-sm text-muted-foreground">
        {{ row.website ?? '-' }}
      </p>
    </template>
    <template #cell-createdDate="{ row }">
      <span class="text-sm text-muted-foreground">{{ new Date(row.createdDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
    </template>
    <template #cell-plan="{ row }">
      <AdminPlanBadge v-if="row.plan" :plan="row.plan" />
      <span v-else class="text-sm text-muted-foreground">-</span>
    </template>
    <template #cell-status="{ row }">
      <SharedStatusBadge :status="row.status as any" />
    </template>
    <template #cell-payment="{ row }">
      <template v-if="row.paymentAmount !== null">
        <p class="text-sm font-medium text-foreground">
          {{ idr(row.paymentAmount) }}
        </p>
        <p v-if="row.paymentDate" class="text-xs text-muted-foreground">
          {{ new Date(row.paymentDate).toLocaleDateString('id-ID') }}
        </p>
      </template>
      <p v-else class="text-sm text-muted-foreground">
        -
      </p>
    </template>
    <template #cell-actions="{ row }">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8 rounded-xl" :aria-label="`Actions for ${row.name}`">
            <Icon name="i-lucide-more-horizontal" class="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-44 rounded-xl">
          <DropdownMenuItem class="cursor-pointer" @click="emit('view', row)">
            <Icon name="i-lucide-eye" class="size-4" /> Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <template v-if="row.status === 'suspended'">
            <DropdownMenuItem class="cursor-pointer" @click="emit('activate', row)">
              <Icon name="i-lucide-user-check" class="size-4" /> Aktifkan
            </DropdownMenuItem>
          </template>
          <template v-else>
            <DropdownMenuItem class="cursor-pointer" @click="emit('suspend', row)">
              <Icon name="i-lucide-pause-circle" class="size-4" /> Tangguhkan
            </DropdownMenuItem>
          </template>
          <DropdownMenuItem class="cursor-pointer" @click="emit('changeRole', row)">
            <Icon name="i-lucide-shield" class="size-4" /> Ubah Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </SharedDataTable>
</template>
