<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: '',
  description: '',
})
</script>

<template>
  <section class="space-y-4">
    <header v-if="title || description || $slots.description" class="space-y-1">
      <h2 v-if="title" class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {{ title }}
      </h2>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
      <slot name="description" />
    </header>
    <div class="space-y-4 border-t border-border pt-4">
      <slot />
    </div>
  </section>
</template>
