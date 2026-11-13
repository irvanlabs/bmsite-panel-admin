<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

withDefaults(defineProps<{
  icon?: string
  title?: string
}>(), { icon: 'i-lucide-user', title: '' })
</script>

<template>
  <Card class="rounded-2xl h-full">
    <CardHeader class="flex flex-row items-center gap-3 space-y-0 pb-2">
      <span class="flex size-9 items-center justify-center rounded-xl bg-editor-secondary text-editor-primary">
        <Icon :name="icon" class="size-4" />
      </span>
      <CardTitle class="text-base font-semibold">
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>
