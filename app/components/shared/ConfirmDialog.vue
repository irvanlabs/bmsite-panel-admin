<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

withDefaults(defineProps<{
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}>(), {
  title: 'Apakah Anda yakin?',
  description: '',
  confirmText: 'Konfirmasi',
  cancelText: 'Batal',
  destructive: false,
})

const emit = defineEmits<{ (e: 'confirm'): void }>()

const open = defineModel<boolean>({ default: false })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="rounded-2xl">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2 sm:gap-0">
        <Button variant="outline" class="rounded-xl" @click="open = false">
          {{ cancelText }}
        </Button>
        <Button :variant="destructive ? 'destructive' : 'default'" class="rounded-xl" @click="emit('confirm')">
          {{ confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
