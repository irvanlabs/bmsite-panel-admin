<script setup lang="ts">
withDefaults(defineProps<{
  rows?: { label: string, value: string }[]
}>(), {
  rows: () => [],
})
</script>

<template>
  <dl class="divide-y rounded-2xl border bg-card">
    <div v-for="row in rows" :key="row.label" class="flex items-center justify-between px-4 py-3 text-sm">
      <dt class="text-muted-foreground">
        {{ row.label }}
      </dt>
      <dd class="font-medium">
        {{ row.value }}
      </dd>
    </div>
    <slot />
  </dl>
</template>
