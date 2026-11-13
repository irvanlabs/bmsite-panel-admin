<script setup lang="ts">
import SharedMetricCard from '@/components/shared/MetricCard.vue'

withDefaults(defineProps<{
  usersCount?: string
  activeCount?: string
  pendingCount?: string
  expiredCount?: string
  newCount?: string
  payingCount?: string
}>(), {
  usersCount: '–',
  activeCount: '–',
  pendingCount: '–',
  expiredCount: '–',
  newCount: '–',
  payingCount: '–',
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
    <SharedMetricCard label="Total Pengguna" :value="usersCount" icon="i-lucide-users" :hint="`${usersCount} total`" />
    <SharedMetricCard label="Aktif" :value="activeCount" icon="i-lucide-badge-check" :hint="`${activeCount} aktif`" />
    <SharedMetricCard label="Tertunda" :value="pendingCount" icon="i-lucide-clock-3" :hint="`${pendingCount} tertunda`" />
    <SharedMetricCard label="Kadaluarsa" :value="expiredCount" icon="i-lucide-calendar-x" :hint="`${expiredCount} kadaluarsa`" />
    <SharedMetricCard label="Baru" :value="newCount" icon="i-lucide-user-plus" :hint="`${newCount} baru`" />
    <SharedMetricCard label="Membayar" :value="payingCount" icon="i-lucide-credit-card" :hint="`${payingCount} membayar`" />
  </div>
</template>
