<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  icon?: string
  timestamp?: string
  last?: boolean
}>(), {
  icon: 'i-lucide-circle',
  timestamp: '',
  last: false,
})
</script>

<template>
  <li class="relative flex gap-3 pb-4 last:pb-0">
    <div class="flex flex-col items-center">
      <span class="flex size-7 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
        <Icon :name="icon" class="size-3.5" />
      </span>
      <span v-if="!last" class="mt-1 w-px flex-1 bg-border" />
    </div>
    <div class="space-y-0.5 pt-0.5">
      <p class="text-sm font-medium leading-none">
        {{ title }}
      </p>
      <p v-if="timestamp" class="text-xs text-muted-foreground">
        {{ timestamp }}
      </p>
      <div v-if="$slots.default" class="pt-1 text-sm text-muted-foreground">
        <slot />
      </div>
    </div>
  </li>
</template>
