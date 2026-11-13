<script setup lang="ts">
import SharedSearchInput from '@/components/shared/SearchInput.vue'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const emit = defineEmits<{ (e: 'reset'): void }>()

const statusOptions = [
  { value: '_all', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'pending', label: 'Tertunda' },
  { value: 'suspended', label: 'Ditangguhkan' },
]

const roleOptions = [
  { value: '_all', label: 'Semua Role' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Superadmin' },
]

const search = defineModel<string>('search', { default: '' })
const _status = defineModel<string>('status', { default: '_all' })
const _role = defineModel<string>('role', { default: '_all' })

const status = computed({
  get: () => _status.value,
  set: (v) => { _status.value = v || '_all' },
})
const role = computed({
  get: () => _role.value,
  set: (v) => { _role.value = v || '_all' },
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <div class="w-full sm:max-w-xs">
      <SharedSearchInput v-model="search" placeholder="Cari nama atau email..." />
    </div>
    <Select v-model="status">
      <SelectTrigger class="w-40 rounded-xl border-editor-border">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <Select v-model="role">
      <SelectTrigger class="w-36 rounded-xl border-editor-border">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <Button variant="outline" size="sm" class="rounded-xl" @click="emit('reset')">
      Reset
    </Button>
  </div>
</template>
