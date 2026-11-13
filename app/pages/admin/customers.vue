<script setup lang="ts">
import type { AdminUserResponse } from '~/services/admin/users.service'
import type { AdminUser } from '~/types/shared'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import AdminPlanBadge from '@/components/admin/PlanBadge.vue'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '~/composables/useAuth'
import { fetchUsers, updateUserStatus } from '~/services/admin/users.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const search = ref('')
const page = ref(1)
const total = ref(0)
const customers = ref<AdminUser[]>([])

function mapUser(raw: AdminUserResponse): AdminUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: '',
    website: raw.website,
    createdDate: raw.created_at ? new Date(raw.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    plan: raw.plan,
    status: raw.status,
    role: raw.role,
    paymentAmount: raw.payment_amount,
    paymentDate: raw.payment_date,
  }
}

async function loadCustomers() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    const result = await fetchUsers(token, { role: 'user', page: page.value, sort: 'created_at', direction: 'desc' })
    customers.value = result.data.map(mapUser)
    total.value = result.meta.total
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat pelanggan')
  }
  finally {
    loading.value = false
  }
}

const columns = [
  { key: 'name', label: 'Pelanggan', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'website', label: 'Website', sortable: true },
  { key: 'plan', label: 'Paket', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdDate', label: 'Dibuat', sortable: true },
  { key: 'actions', label: '', sortable: false, class: 'text-right' },
] as { key: string, label: string, sortable?: boolean, class?: string }[]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}

async function handleSuspend(id: number) {
  try {
    const token = auth.token.value
    if (!token)
      return
    await updateUserStatus(token, id, 'suspended')
    toast.success('Pelanggan ditangguhkan')
    await loadCustomers()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menangguhkan')
  }
}

async function handleActivate(id: number) {
  try {
    const token = auth.token.value
    if (!token)
      return
    await updateUserStatus(token, id, 'active')
    toast.success('Pelanggan diaktifkan')
    await loadCustomers()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal mengaktifkan')
  }
}

function handleExport() {
  const csv = [['Nama', 'Email', 'Website', 'Paket', 'Status', 'Dibuat'].join(',')]
    .concat(customers.value.map(c => [c.name, c.email, c.website ?? '', c.plan ?? '', c.status, c.createdDate].join(',')))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  await auth.bootstrap()
  await loadCustomers()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Direktori Pelanggan" description="Kelola semua pelanggan platform dan akun mereka." size="large">
      <template #actions>
        <Button variant="outline" class="rounded-xl" @click="handleExport">
          <Icon name="i-lucide-download" class="size-4" /> Ekspor CSV
        </Button>
      </template>
    </SharedPageHeader>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <SharedMetricCard label="Total Pelanggan" :value="String(total)" icon="i-lucide-users" :hint="`${total} terdaftar (role user)`" />
      <SharedMetricCard label="Status breakdown" value="—" icon="i-lucide-info" hint="Tidak tersedia dari API" />
    </div>

    <SharedDataTable
      v-model:search="search"
      :columns="columns"
      :data="customers"
      :loading="loading"
      :filter-keys="['name', 'email', 'website']"
      empty-text="Pelanggan tidak ditemukan"
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
        <span class="text-sm text-foreground">{{ row.website ?? '-' }}</span>
      </template>
      <template #cell-plan="{ row }">
        <AdminPlanBadge v-if="row.plan" :plan="row.plan" />
        <span v-else class="text-sm text-muted-foreground">-</span>
      </template>
      <template #cell-status="{ row }">
        <SharedStatusBadge :status="row.status as any" />
      </template>
      <template #cell-createdDate="{ row }">
        <span class="text-sm text-muted-foreground">{{ row.createdDate }}</span>
      </template>
      <template #cell-actions="{ row }">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="size-8 rounded-xl" :aria-label="`Aksi untuk ${row.name}`">
              <Icon name="i-lucide-more-horizontal" class="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-44 rounded-xl">
            <DropdownMenuItem class="cursor-pointer" @click="navigateTo(`/admin/users/${row.id}`)">
              <Icon name="i-lucide-eye" class="size-4" /> Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem v-if="row.status !== 'suspended'" class="cursor-pointer" @click="handleSuspend(row.id)">
              <Icon name="i-lucide-pause-circle" class="size-4" /> Tangguhkan
            </DropdownMenuItem>
            <DropdownMenuItem v-else class="cursor-pointer" @click="handleActivate(row.id)">
              <Icon name="i-lucide-play-circle" class="size-4" /> Aktifkan
            </DropdownMenuItem>
            <DropdownMenuItem disabled title="Pengelolaan role dilakukan di halaman Pengguna">
              <Icon name="i-lucide-shield" class="size-4" /> Ubah Role
            </DropdownMenuItem>
            <DropdownMenuItem disabled class="text-destructive" title="Hapus pengguna belum tersedia">
              <Icon name="i-lucide-trash-2" class="size-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </SharedDataTable>

    <div v-if="total > 10" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadCustomers()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page * 10 >= total" @click="page++; loadCustomers()">
        Selanjutnya
      </Button>
    </div>
  </div>
</template>
