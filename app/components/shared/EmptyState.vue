<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'

withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
}>(), {
  icon: 'i-lucide-inbox',
  title: 'Belum ada data',
  description: '',
})
</script>

<template>
  <Card class="rounded-2xl border-dashed">
    <CardContent class="flex flex-col items-center justify-center gap-2 p-10 text-center">
      <span class="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon :name="icon" class="size-5" />
      </span>
      <p class="text-sm font-medium">
        {{ title }}
      </p>
      <p v-if="description" class="max-w-xs text-xs text-muted-foreground">
        {{ description }}
      </p>
      <div v-if="$slots.action" class="mt-2">
        <slot name="action" />
      </div>
    </CardContent>
  </Card>
</template>
