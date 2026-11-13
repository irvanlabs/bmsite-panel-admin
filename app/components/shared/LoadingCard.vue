<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

withDefaults(defineProps<{
  lines?: number
}>(), {
  lines: 3,
})
</script>

<template>
  <Card class="rounded-2xl">
    <CardContent class="space-y-3 p-4">
      <Skeleton class="h-4 w-1/3" />
      <Skeleton v-for="n in lines" :key="n" class="h-3 w-full" :class="n === lines ? 'w-2/3' : ''" />
    </CardContent>
  </Card>
</template>
