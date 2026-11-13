<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  htmlFor?: string
  class?: string
}>(), {
  htmlFor: undefined,
  class: '',
})
</script>

<template>
  <!-- Plain Label, not FormLabel: this shared component is used outside
       <FormField> contexts (SeoPanel, editor cards) where FormLabel's
       useFormField() throws. -->
  <Label :for="htmlFor" :class="cn('text-sm font-medium', $props.class)">
    <slot />
  </Label>
</template>
