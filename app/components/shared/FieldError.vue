<script setup lang="ts">
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})
</script>

<template>
  <!-- Plain <p>, not FormMessage: this shared component is used outside
       <FormField> contexts where FormMessage's useFormField() throws. -->
  <p :class="cn('text-xs text-destructive', $props.class)">
    <slot />
  </p>
</template>
