<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  plan: 's' | 'm' | 'xl' | 'enterprise' | 'professional' | 'startup' | string
}>(), {})

const map: Record<string, string> = {
  s: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  m: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  xl: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  enterprise: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  startup: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}
</script>

<template>
  <Badge :class="cn('rounded-xl font-medium', map[plan] ?? 'bg-muted text-muted-foreground')">
    {{ plan }}
  </Badge>
</template>
