<script setup lang="ts">
import SharedEmptyState from '@/components/shared/EmptyState.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'

withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
}>(), {
  description: '',
  icon: 'i-lucide-construction',
})
</script>

<template>
  <div class="space-y-6">
    <SharedPageHeader :title="title" :description="description" />
    <SharedEmptyState
      :icon="icon"
      :title="`${title} coming soon`"
      description="This section is part of the architecture and will be built out next."
    />
  </div>
</template>
