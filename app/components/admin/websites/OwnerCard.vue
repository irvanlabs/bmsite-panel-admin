<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

withDefaults(defineProps<{
  name?: string
  email?: string
  plan?: string
  domain?: string
  status?: string
}>(), {
  name: '',
  email: '',
  plan: '',
  domain: '',
  status: '',
})

function initials(n: string) {
  return n.split(' ').map(w => w[0]).join('').slice(0, 2)
}
</script>

<template>
  <Card class="rounded-2xl border-editor-border bg-editor-surface">
    <CardContent class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <Avatar class="size-10 rounded-xl">
          <AvatarFallback class="rounded-xl text-sm font-semibold">
            {{ initials(name) }}
          </AvatarFallback>
        </Avatar>
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-editor-text">{{ name }}</span>
            <Badge class="rounded-xl bg-blue-100 text-blue-800 text-xs dark:bg-blue-900/40 dark:text-blue-300">
              Managed by Super Admin
            </Badge>
          </div>
          <p class="text-xs text-editor-text-secondary">
            {{ email }} &bull; {{ plan }} &bull; {{ domain }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Badge variant="default" class="rounded-xl bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
          {{ status }}
        </Badge>
        <Button variant="outline" size="sm" class="rounded-xl border-editor-border text-editor-text hover:bg-editor-secondary">
          <Icon name="i-lucide-user" class="size-4" /> View Customer
        </Button>
        <Button variant="outline" size="sm" class="rounded-xl border-editor-border text-editor-text hover:bg-editor-secondary">
          <Icon name="i-lucide-external-link" class="size-4" /> Open Website
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
