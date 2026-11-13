<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: '',
})
</script>

<template>
  <div class="space-y-0.5">
    <h2 class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
      {{ title }}
    </h2>
    <p v-if="description" class="text-sm text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>
