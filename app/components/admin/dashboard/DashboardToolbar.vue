<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

defineEmits<{
  export: []
}>()

const range = ref<string>('7d')
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">
        Dashboard Overview
      </h1>
      <p class="text-sm text-muted-foreground">
        Welcome back, here's what's happening today.
      </p>
    </div>
    <div class="flex items-center gap-3">
      <Tabs v-model="range" class="hidden sm:block">
        <TabsList class="bg-muted rounded-xl p-1">
          <TabsTrigger value="7d" class="rounded-lg px-3 py-1.5 text-xs">
            Last 7d
          </TabsTrigger>
          <TabsTrigger value="30d" class="rounded-lg px-3 py-1.5 text-xs">
            Last 30d
          </TabsTrigger>
          <TabsTrigger value="custom" class="rounded-lg px-3 py-1.5 text-xs">
            Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Popover v-if="range === 'custom'">
        <PopoverTrigger />
        <PopoverContent class="text-sm text-muted-foreground">
          Date picker coming soon
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="sm" class="rounded-xl" @click="$emit('export')">
        <Icon name="i-lucide-download" class="mr-1.5 size-4" />
        Export
      </Button>
    </div>
  </div>
</template>
