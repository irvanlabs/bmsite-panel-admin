<script setup lang="ts">
import type { UserProfile } from '~/types/shared'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

defineProps<{
  user: UserProfile
}>()

const emit = defineEmits<{
  (e: 'logout'): void
}>()

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button class="flex items-center gap-2 rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring" :aria-label="`${user.name} menu`">
        <Avatar class="size-8 rounded-lg">
          <AvatarImage :src="user.avatar" :alt="user.name" />
          <AvatarFallback class="rounded-lg">
            {{ initials(user.name) }}
          </AvatarFallback>
        </Avatar>
        <span class="hidden text-left text-sm leading-tight sm:grid">
          <span class="truncate font-semibold">{{ user.name }}</span>
          <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
        </span>
        <Icon name="i-lucide-chevrons-up-down" class="hidden size-4 text-muted-foreground sm:block" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-56 rounded-xl" align="end">
      <DropdownMenuLabel class="font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar class="size-8 rounded-lg">
            <AvatarImage :src="user.avatar" :alt="user.name" />
            <AvatarFallback class="rounded-lg">
              {{ initials(user.name) }}
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ user.name }}</span>
            <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <NuxtLink to="/admin/settings">
          <Icon name="i-lucide-settings" />
          Pengaturan
        </NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="emit('logout')">
        <Icon name="i-lucide-log-out" />
        Keluar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
