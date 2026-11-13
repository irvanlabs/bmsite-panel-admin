<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'

withDefaults(defineProps<{
  maxHeight?: string
}>(), {
  maxHeight: '320px',
})
</script>

<template>
  <ScrollArea class="w-full" :style="{ maxHeight }">
    <ol class="relative space-y-0">
      <slot />
    </ol>
  </ScrollArea>
</template>
