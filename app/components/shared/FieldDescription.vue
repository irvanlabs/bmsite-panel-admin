<script setup lang="ts">
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})
</script>

<template>
  <!-- Plain <p>, not FormDescription: this shared component is used outside
       <FormField> contexts (SeoPanel, editor cards) where FormDescription's
       useFormField() throws. -->
  <p :class="cn('text-xs text-muted-foreground', $props.class)">
    <slot />
  </p>
</template>
