<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

withDefaults(defineProps<{
  label: string
  value: string | number
  icon?: string
  hint?: string
}>(), {})
</script>

<template>
  <Card class="rounded-2xl">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {{ label }}
      </CardTitle>
      <Icon v-if="icon" :name="icon" class="size-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-semibold tracking-tight">
        {{ value }}
      </div>
      <p v-if="hint" class="mt-1 text-xs text-muted-foreground">
        {{ hint }}
      </p>
    </CardContent>
  </Card>
</template>
