<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: '',
})
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div v-if="title || description" class="space-y-1">
      <h1 v-if="title" class="text-xl font-semibold tracking-tight">
        {{ title }}
      </h1>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <slot name="search" />
      <slot name="actions" />
    </div>
  </div>
</template>
