<script setup lang="ts">
import type { AdminDashboardResponse } from '~/services/admin/dashboard.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import ChartsLineChart from '@/components/charts/LineChart.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '~/composables/useAuth'
import { fetchAdminDashboard } from '~/services/admin/dashboard.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const dashboard = ref<AdminDashboardResponse | null>(null)

async function load() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    dashboard.value = await fetchAdminDashboard(token, 1)
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat analytics')
  }
  finally {
    loading.value = false
  }
}

onMounted(async () => {
  await auth.bootstrap()
  await load()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Analytics" description="Metrik platform dari dashboard admin." />

    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div v-for="i in 4" :key="i" class="h-24 animate-pulse rounded-2xl bg-muted" />
    </div>

    <div v-else-if="dashboard" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card class="rounded-2xl p-5">
        <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Total Pengguna
        </p>
        <p class="mt-2 text-2xl font-bold">
          {{ dashboard.metrics.total_users }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          {{ dashboard.metrics.total_users_change.value }}
        </p>
      </Card>
      <Card class="rounded-2xl p-5">
        <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Site Aktif
        </p>
        <p class="mt-2 text-2xl font-bold">
          {{ dashboard.metrics.active_sites }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          {{ dashboard.metrics.active_sites_change.value }}
        </p>
      </Card>
      <Card class="rounded-2xl p-5">
        <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Pendapatan Bulanan
        </p>
        <p class="mt-2 text-2xl font-bold">
          {{ dashboard.metrics.monthly_revenue }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          {{ dashboard.metrics.monthly_revenue_change.value }}
        </p>
      </Card>
      <Card class="rounded-2xl p-5">
        <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Langganan Kadaluarsa
        </p>
        <p class="mt-2 text-2xl font-bold">
          {{ dashboard.metrics.expired_subs }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          {{ dashboard.metrics.expired_subs_change.value }}
        </p>
      </Card>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card class="rounded-2xl p-6 flex flex-col">
        <CardHeader class="px-0 pt-0 shrink-0">
          <CardTitle class="text-base font-semibold">
            Pendapatan per Bulan
          </CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col flex-1 min-h-0 p-0 pt-4">
          <div class="flex-1 min-h-0 h-64">
            <ChartsLineChart
              v-if="dashboard"
              :data="dashboard.revenue_chart"
              index="date"
              :categories="['revenue']"
              :colors="['#0F6AAE']"
              :show-legend="false"
              class="h-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card class="rounded-2xl p-6 flex flex-col">
        <CardHeader class="px-0 pt-0 shrink-0">
          <CardTitle class="text-base font-semibold">
            Pertumbuhan Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col flex-1 min-h-0 p-0 pt-4">
          <div class="flex-1 min-h-0 h-64">
            <ChartsLineChart
              v-if="dashboard"
              :data="dashboard.user_growth_chart"
              index="month"
              :categories="['users']"
              :colors="['#10B981']"
              :show-legend="false"
              class="h-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="rounded-2xl p-6">
      <p class="text-sm text-muted-foreground">
        Analitik pengunjung per situs (device, sumber traffic, konten teratas) tidak tersedia di scope admin.
      </p>
    </Card>
  </div>
</template>
