<script setup lang="ts">
withDefaults(defineProps<{
  items?: { name: string, color: string }[]
}>(), {
  items: () => [],
})
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div
      v-for="item in items"
      :key="item.name"
      class="flex items-center gap-2"
    >
      <span
        class="h-3 w-3 rounded-full"
        :style="{ backgroundColor: item.color }"
      />
      <span class="text-sm text-muted-foreground">{{ item.name }}</span>
    </div>
  </div>
</template>
