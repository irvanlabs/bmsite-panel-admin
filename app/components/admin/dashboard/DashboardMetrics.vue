<script setup lang="ts">
import type { AdminMetric } from '@/types/shared'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

defineProps<{
  metrics: AdminMetric[]
  loading?: boolean
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <Card v-for="m in metrics" :key="m.label" class="rounded-2xl p-6">
      <CardContent class="p-0">
        <template v-if="loading">
          <Skeleton class="mb-3 size-10 rounded-xl" />
          <Skeleton class="mb-2 h-4 w-24" />
          <Skeleton class="h-8 w-20" />
        </template>
        <template v-else>
          <div class="mb-3 inline-flex items-center justify-center rounded-xl bg-editor-primary/10 p-2.5">
            <Icon :name="m.icon" class="size-5 text-editor-primary" />
          </div>
          <p class="mb-1 text-sm uppercase tracking-wider text-muted-foreground">
            {{ m.label }}
          </p>
          <div class="flex items-end gap-2">
            <span class="text-3xl font-bold tracking-tight">{{ m.value }}</span>
            <SharedStatusBadge
              :status="m.changeDir === 'up' ? 'success' : 'error'"
              :label="m.change"
            />
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
