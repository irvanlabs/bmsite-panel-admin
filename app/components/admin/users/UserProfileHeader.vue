<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

withDefaults(defineProps<{
  name?: string
  email?: string
  joined?: string
  status?: string
  statusVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}>(), {
  name: '',
  email: '',
  joined: '',
  status: 'Active',
  statusVariant: 'default',
})

const emit = defineEmits<{ suspend: [], extend: [] }>()

function initials(n: string) {
  return n.split(' ').map(w => w[0]).join('').slice(0, 2)
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div class="flex items-start gap-4">
      <Avatar class="size-[72px] rounded-xl">
        <AvatarFallback class="rounded-xl text-2xl font-semibold">
          {{ initials(name) }}
        </AvatarFallback>
      </Avatar>
      <div class="flex flex-col gap-1">
        <h1 class="text-3xl font-bold tracking-tight text-foreground">
          {{ name }}
        </h1>
        <p class="text-sm text-muted-foreground">
          {{ email }}
          <template v-if="joined">
            &bull; Member since {{ joined }}
          </template>
        </p>
        <Badge :variant="statusVariant" class="mt-1 w-fit rounded-xl">
          {{ status }}
        </Badge>
      </div>
    </div>
    <div class="flex flex-col gap-2 sm:flex-row">
      <Button variant="outline" class="w-full rounded-xl sm:w-auto" @click="emit('suspend')">
        <Icon name="i-lucide-ban" class="size-4" />
        Suspend User
      </Button>
      <Button class="w-full rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover sm:w-auto" @click="emit('extend')">
        <Icon name="i-lucide-shield-check" class="size-4" />
        Extend Subscription
      </Button>
    </div>
  </div>
</template>
