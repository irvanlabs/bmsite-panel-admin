<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'

withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'muted'
  icon?: string
  title?: string
}>(), {
  variant: 'default',
  icon: '',
  title: '',
})

const variantClass = {
  default: 'bg-card',
  accent: 'bg-accent/60 border-accent',
  muted: 'bg-muted/50',
}
</script>

<template>
  <Card class="rounded-2xl" :class="variantClass[variant]">
    <CardContent class="p-4">
      <div v-if="icon || title" class="mb-1.5 flex items-center gap-2">
        <Icon v-if="icon" :name="icon" class="size-4 text-primary" />
        <span v-if="title" class="text-sm font-semibold tracking-tight">{{ title }}</span>
      </div>
      <slot />
    </CardContent>
  </Card>
</template>
