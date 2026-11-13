<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 text-sm">
    <dt class="text-muted-foreground">
      {{ label }}
    </dt>
    <dd class="font-medium">
      <slot>{{ value }}</slot>
    </dd>
  </div>
</template>
