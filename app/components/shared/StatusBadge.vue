<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

type Status = 'active' | 'trialing' | 'canceled' | 'past_due' | 'live' | 'building' | 'offline' | 'success' | 'warning' | 'error' | 'info'
  | 'published' | 'draft' | 'archived' | 'private' | 'scheduled'
  | 'paid' | 'completed' | 'pending' | 'failed' | 'refunded' | 'processing' | 'suspended' | 'expired'
  | 'open' | 'in_progress' | 'resolved' | 'closed'

const props = withDefaults(defineProps<{
  status?: Status
  label?: string
}>(), {
  status: 'active',
  label: '',
})

const map: Record<Status, { text: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { text: 'Aktif', variant: 'default' },
  live: { text: 'Online', variant: 'default' },
  success: { text: 'Berhasil', variant: 'default' },
  trialing: { text: 'Trial', variant: 'secondary' },
  building: { text: 'Dibangun', variant: 'secondary' },
  info: { text: 'Info', variant: 'secondary' },
  warning: { text: 'Peringatan', variant: 'outline' },
  past_due: { text: 'Jatuh Tempo', variant: 'outline' },
  canceled: { text: 'Dibatalkan', variant: 'destructive' },
  offline: { text: 'Offline', variant: 'destructive' },
  error: { text: 'Galat', variant: 'destructive' },
  published: { text: 'Dipublikasikan', variant: 'default' },
  draft: { text: 'Konsep', variant: 'secondary' },
  scheduled: { text: 'Terjadwal', variant: 'outline' },
  private: { text: 'Pribadi', variant: 'secondary' },
  archived: { text: 'Diarsipkan', variant: 'outline' },
  paid: { text: 'Dibayar', variant: 'default' },
  completed: { text: 'Lunas', variant: 'default' },
  pending: { text: 'Tertunda', variant: 'outline' },
  failed: { text: 'Gagal', variant: 'destructive' },
  refunded: { text: 'Dikembalikan', variant: 'secondary' },
  processing: { text: 'Diproses', variant: 'default' },
  suspended: { text: 'Ditangguhkan', variant: 'secondary' },
  expired: { text: 'Kadaluarsa', variant: 'destructive' },
  open: { text: 'Terbuka', variant: 'default' },
  in_progress: { text: 'Diproses', variant: 'secondary' },
  resolved: { text: 'Terselesaikan', variant: 'default' },
  closed: { text: 'Ditutup', variant: 'secondary' },
}

const dotClass: Record<Status, string> = {
  active: 'bg-primary',
  live: 'bg-primary',
  success: 'bg-primary',
  trialing: 'bg-muted-foreground',
  building: 'bg-muted-foreground',
  info: 'bg-muted-foreground',
  warning: 'bg-yellow-500',
  past_due: 'bg-yellow-500',
  canceled: 'bg-destructive',
  offline: 'bg-destructive',
  error: 'bg-destructive',
  published: 'bg-green-500',
  draft: 'bg-muted-foreground',
  scheduled: 'bg-yellow-500',
  private: 'bg-muted-foreground',
  archived: 'bg-destructive',
  paid: 'bg-primary',
  completed: 'bg-primary',
  processing: 'bg-primary',
  suspended: 'bg-muted-foreground',
  pending: 'bg-yellow-500',
  failed: 'bg-destructive',
  refunded: 'bg-muted-foreground',
  expired: 'bg-destructive',
  open: 'bg-primary',
  in_progress: 'bg-muted-foreground',
  resolved: 'bg-green-500',
  closed: 'bg-muted-foreground',
}

const meta = computed(() => map[props.status])
</script>

<template>
  <Badge :variant="meta.variant" class="h-fit w-fit gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-0.5 text-xs font-medium">
    <span class="size-1.5 shrink-0 rounded-full" :class="dotClass[status]" />
    {{ label || meta.text }}
  </Badge>
</template>
