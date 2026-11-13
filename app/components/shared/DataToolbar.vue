<script setup lang="ts">
import { Separator } from '@/components/ui/separator'

withDefaults(defineProps<{
  searchPlaceholder?: string
}>(), {
  searchPlaceholder: 'Cari...',
})

const search = defineModel<string>('search', { default: '' })
</script>

<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div class="w-full sm:max-w-xs">
      <SharedSearchInput v-model="search" :placeholder="searchPlaceholder" />
    </div>
    <div class="flex items-center gap-2">
      <slot name="filters" />
      <Separator orientation="vertical" class="hidden h-6 sm:block" />
      <slot name="actions" />
    </div>
  </div>
</template>
