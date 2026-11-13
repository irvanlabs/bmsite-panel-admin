<script setup lang="ts">
import type { AdminMetric, AdminOrder } from '~/types/shared'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import RecentOrdersTable from '@/components/admin/dashboard/RecentOrdersTable.vue'
import RevenueChart from '@/components/admin/dashboard/RevenueChart.vue'
import UserGrowthChart from '@/components/admin/dashboard/UserGrowthChart.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchAdminDashboard } from '~/services/admin/dashboard.service'
import { useAuth } from '~/composables/useAuth'
import { idr } from '@/lib/utils'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const range = ref<string>('7d')
const loading = ref(true)

const metrics = ref<AdminMetric[]>([
  { label: 'Total Pengguna', value: '0', icon: 'i-lucide-users', change: '0%', changeDir: 'up' },
  { label: 'Website Aktif', value: '0', icon: 'i-lucide-globe', change: '0%', changeDir: 'up' },
  { label: 'Pendapatan Bulanan', value: 'Rp0', icon: 'i-lucide-dollar-sign', change: '0%', changeDir: 'up' },
  { label: 'Langganan Kadaluarsa', value: '0', icon: 'i-lucide-calendar-x', change: '0%', changeDir: 'down' },
])

const revenueData = ref<{ date: string; revenue: number }[]>([])
const growthData = ref<{ month: string; users: number }[]>([])
const orders = ref<AdminOrder[]>([])
const ordersTotal = ref(0)
const ordersPage = ref(1)

async function loadDashboard() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token) return
    const data = await fetchAdminDashboard(token, ordersPage.value)

    metrics.value = [
      { label: 'Total Pengguna', value: data.metrics.total_users.toLocaleString('id-ID'), icon: 'i-lucide-users', change: data.metrics.total_users_change.value, changeDir: data.metrics.total_users_change.dir },
      { label: 'Website Aktif', value: data.metrics.active_sites.toLocaleString('id-ID'), icon: 'i-lucide-globe', change: data.metrics.active_sites_change.value, changeDir: data.metrics.active_sites_change.dir },
      { label: 'Pendapatan Bulanan', value: idr(data.metrics.monthly_revenue), icon: 'i-lucide-dollar-sign', change: data.metrics.monthly_revenue_change.value, changeDir: data.metrics.monthly_revenue_change.dir },
      { label: 'Langganan Kadaluarsa', value: data.metrics.expired_subs.toLocaleString('id-ID'), icon: 'i-lucide-calendar-x', change: data.metrics.expired_subs_change.value, changeDir: data.metrics.expired_subs_change.dir },
    ]
    revenueData.value = data.revenue_chart
    growthData.value = data.user_growth_chart
    orders.value = data.orders.map(o => ({ ...o, status: o.status as AdminOrder['status'] }))
    ordersTotal.value = data.orders_meta.total
  } catch {
    // stays empty on error
  } finally {
    loading.value = false
  }
}

function handleExport() { toast.info('Exporting report...') }

onMounted(async () => {
  await auth.bootstrap()
  await loadDashboard()
})
</script>

<template>
  <!-- Hallmark · genre: modern-minimal · macrostructure: Stat-Led · design-system: design.md · designed-as-app -->
  <div class="flex flex-col gap-8 p-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold tracking-tight">Ringkasan Dashboard</h1>
        <p class="mt-1 text-sm text-muted-foreground">Selamat datang! Pantau aktivitas platform di sini.</p>
      </div>
      <div class="flex items-center gap-3">
        <Tabs v-model="range" class="hidden sm:block">
          <TabsList class="bg-muted rounded-xl p-1">
            <TabsTrigger value="7d" class="rounded-lg px-3 py-1.5 text-xs">7 Hari</TabsTrigger>
            <TabsTrigger value="30d" class="rounded-lg px-3 py-1.5 text-xs">30 Hari</TabsTrigger>
            <TabsTrigger value="custom" class="rounded-lg px-3 py-1.5 text-xs">Kustom</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" class="rounded-xl" @click="handleExport">
          <Icon name="i-lucide-download" class="mr-1.5 size-4" />
          Ekspor
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="m in metrics" :key="m.label" class="rounded-2xl border-0 bg-surface-raised shadow-[var(--shadow-card)] p-6">
        <CardContent class="p-0">
          <template v-if="loading">
            <Skeleton class="mb-3 size-10 rounded-xl" />
            <Skeleton class="mb-2 h-4 w-24" />
            <Skeleton class="h-8 w-20" />
          </template>
          <template v-else>
            <div class="mb-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent p-2.5 text-white shadow-[var(--shadow-card)]">
              <Icon :name="m.icon" class="size-5" />
            </div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ m.label }}</p>
            <div class="flex items-end gap-2">
              <span class="font-display text-3xl font-extrabold tracking-tight">{{ m.value }}</span>
              <SharedStatusBadge :status="m.changeDir === 'up' ? 'success' : 'error'" :label="m.change" />
            </div>
          </template>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <RevenueChart :data="revenueData" :loading="loading" />
      <UserGrowthChart :data="growthData" :loading="loading" />
    </div>

    <RecentOrdersTable :orders="orders" :loading="loading" />
  </div>
</template>
