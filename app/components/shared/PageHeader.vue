<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  size?: 'base' | 'large'
}>(), {
  description: '',
  size: 'base',
})
</script>

<template>
  <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
    <div class="space-y-1">
      <h1 :class="size === 'large' ? 'text-4xl font-bold tracking-tight' : 'text-2xl font-semibold tracking-tight'">
        {{ title }}
      </h1>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
