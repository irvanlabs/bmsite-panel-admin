<script setup lang="ts">
import type { UserProfile } from '~/types/shared'
import SharedSearchInput from '@/components/shared/SearchInput.vue'
import SharedUserMenu from '@/components/shared/UserMenu.vue'
import { Button } from '@/components/ui/button'

defineProps<{
  user: UserProfile
}>()

const emit = defineEmits<{ (e: 'logout'): void }>()
</script>

<template>
  <LayoutHeader>
    <div class="flex w-full items-center justify-between gap-3">
      <div class="w-full max-w-sm">
        <SharedSearchInput placeholder="Cari pengguna atau situs web..." />
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon" class="size-9 rounded-xl" aria-label="Notifikasi">
          <Icon name="i-lucide-bell" class="size-4" />
        </Button>
        <SharedUserMenu :user="user" @logout="emit('logout')" />
      </div>
    </div>
  </LayoutHeader>
</template>
