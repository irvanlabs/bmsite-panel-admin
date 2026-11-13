<script setup lang="ts">
withDefaults(defineProps<{
  placeholder?: string
}>(), {
  placeholder: 'Cari...',
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="relative w-full">
    <Icon name="i-lucide-search" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      class="rounded-xl pl-9"
      aria-label="Cari"
    />
  </div>
</template>
