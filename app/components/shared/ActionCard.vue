<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
}>(), {
  description: '',
  icon: '',
})
</script>

<template>
  <Card class="rounded-2xl">
    <CardHeader>
      <div v-if="icon" class="mb-1 flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon :name="icon" class="size-4" />
      </div>
      <CardTitle class="text-base font-semibold tracking-tight">
        {{ title }}
      </CardTitle>
      <CardDescription v-if="description">
        {{ description }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>
</template>
