<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

defineProps<{
  data: { date: string, revenue: number }[]
  loading?: boolean
}>()
</script>

<template>
  <Card class="rounded-2xl p-6">
    <CardHeader class="px-0 pt-0">
      <CardTitle class="text-lg font-semibold">
        Pendapatan dari Waktu ke Waktu
      </CardTitle>
    </CardHeader>
    <CardContent class="p-0 pt-4">
      <template v-if="loading">
        <Skeleton class="h-[300px] w-full rounded-2xl" />
      </template>
      <ChartsLineChart
        v-else
        :data
        index="date"
        :categories="['revenue']"
        :colors="['#0F6AAE']"
      />
    </CardContent>
  </Card>
</template>
