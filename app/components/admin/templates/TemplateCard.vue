<script setup lang="ts">
import type { Template } from '~/types/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  template: Template
  loading?: boolean
}>(), { loading: false })

const emit = defineEmits<{
  preview: [t: Template]
  edit: [t: Template]
  duplicate: [t: Template]
  delete: [t: Template]
  archive: [t: Template]
  featured: [t: Template]
  toggleVisibility: [t: Template, v: boolean]
}>()

defineModel<boolean>('visible', { default: true })

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  private: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  featured: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
}
</script>

<template>
  <Card v-if="!loading" class="overflow-hidden rounded-2xl">
    <div class="flex aspect-[16/10] items-center justify-center bg-muted">
      <Icon v-if="!template.thumbnail" name="i-lucide-image" class="size-10 text-muted-foreground/40" />
      <img v-else :src="template.thumbnail" :alt="template.name" class="size-full object-cover">
    </div>
    <CardContent class="flex flex-col gap-2 p-4">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="truncate font-semibold text-foreground">
            {{ template.name }}
          </p>
          <span class="inline-block rounded-xl bg-editor-secondary px-2 py-0.5 text-xs text-editor-primary">
            {{ template.category }}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="size-8 shrink-0 rounded-xl" :aria-label="`Actions for ${template.name}`">
              <Icon name="i-lucide-more-horizontal" class="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-40 rounded-xl">
            <DropdownMenuItem @click="emit('preview', template)">
              <Icon name="i-lucide-eye" class="size-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('edit', template)">
              <Icon name="i-lucide-pencil" class="size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('duplicate', template)">
              <Icon name="i-lucide-copy" class="size-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('featured', template)">
              <Icon name="i-lucide-star" class="size-4" /> Set Featured
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="emit('archive', template)">
              <Icon name="i-lucide-archive" class="size-4" /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem class="text-destructive" @click="emit('delete', template)">
              <Icon name="i-lucide-trash-2" class="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p class="line-clamp-2 text-sm text-muted-foreground">
        {{ template.description }}
      </p>
      <div class="mt-auto flex items-center justify-between pt-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground">{{ template.lastUpdated }}</span>
          <Badge :class="cn('rounded-xl text-xs', statusColors[template.status] ?? 'bg-muted text-muted-foreground')">
            {{ template.status }}
          </Badge>
        </div>
        <Switch
          aria-label="Toggle visibility"
          :model-value="template.visibility"
          @update:model-value="v => emit('toggleVisibility', template, v)"
        />
      </div>
    </CardContent>
  </Card>
  <Card v-else class="overflow-hidden rounded-2xl">
    <Skeleton class="aspect-[16/10] w-full" />
    <CardContent class="space-y-3 p-4">
      <Skeleton class="h-4 w-3/4" />
      <Skeleton class="h-3 w-1/2" />
      <Skeleton class="h-3 w-full" />
      <Skeleton class="h-3 w-1/3" />
    </CardContent>
  </Card>
</template>
