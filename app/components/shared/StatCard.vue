<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

withDefaults(defineProps<{
  title: string
  icon?: string
}>(), {})
</script>

<template>
  <Card class="rounded-2xl transition-colors hover:bg-accent/40">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {{ title }}
      </CardTitle>
      <Icon v-if="icon" :name="icon" class="size-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>
