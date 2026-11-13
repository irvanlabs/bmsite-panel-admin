<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedStatCard from '@/components/shared/StatCard.vue'
import SharedStatusBadge from '@/components/shared/StatusBadge.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { TicketResponse, TicketStatusKind, TicketPriority } from '~/types/shared'
import { fetchAdminTickets, fetchAdminTicket, replyToTicket, updateTicketStatus } from '~/services/admin/support.service'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'admin' })

const auth = useAuth()

interface TicketMessage {
  from: string
  text: string
  time: string
}

interface SupportTicket {
  id: number
  subject: string
  customer: string
  email: string
  priority: TicketPriority
  status: TicketStatusKind
  agent: string
  lastUpdated: string
  messages: TicketMessage[]
}

const loading = ref(false)
const search = ref('')
const activeTab = ref('_all')
const detailOpen = ref(false)
const selectedTicket = ref<SupportTicket | null>(null)
const replyText = ref('')
const replyLoading = ref(false)
const page = ref(1)
const total = ref(0)

const tickets = ref<SupportTicket[]>([])

function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  return `${days} hari lalu`
}

const tabOptions = [
  { value: '_all', label: 'Semua' },
  { value: 'open', label: 'Terbuka' },
  { value: 'in_progress', label: 'Diproses' },
  { value: 'resolved', label: 'Terselesaikan' },
  { value: 'closed', label: 'Ditutup' },
]

function mapTicket(raw: TicketResponse): SupportTicket {
  return {
    id: raw.id,
    subject: raw.subject,
    customer: raw.user?.name ?? '-',
    email: raw.user?.email ?? '-',
    priority: raw.priority,
    status: raw.status,
    agent: raw.assignee?.name ?? 'Belum ditugaskan',
    lastUpdated: formatTime(raw.updated_at),
    messages: (raw.messages ?? []).map(m => ({
      from: m.user?.name ?? 'System',
      text: m.message,
      time: formatTime(m.created_at),
    })),
  }
}

async function loadTickets() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token) return
    const result = await fetchAdminTickets(token, {
      status: activeTab.value,
      page: page.value,
    })
    tickets.value = result.data.map(mapTicket)
    total.value = result.meta.total
  } catch {
    // stays empty
  } finally {
    loading.value = false
  }
}

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'subject', label: 'Subjek', sortable: true },
  { key: 'customer', label: 'Pelanggan', sortable: true },
  { key: 'priority', label: 'Prioritas', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'agent', label: 'Agen' },
  { key: 'lastUpdated', label: 'Terakhir', sortable: true },
]

const filtered = computed(() => {
  if (!search.value) return tickets.value
  const q = search.value.toLowerCase()
  return tickets.value.filter(t =>
    String(t.id).includes(q) || t.subject.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.agent.toLowerCase().includes(q)
  )
})

const stats = computed(() => {
  const total = tickets.value.length
  const urgent = tickets.value.filter(t => t.priority === 'urgent').length
  const inProgress = tickets.value.filter(t => t.status === 'in_progress').length
  // ponytail: closedToday counts from this page only; full stat needs backend aggregation
  const closedToday = tickets.value.filter(t => t.status === 'closed').length
  return { open: tickets.value.filter(t => t.status === 'open').length, urgent, awaiting: inProgress, resolvedToday: closedToday }
})

const priorityMeta: Record<string, { class: string; label: string }> = {
  urgent: { class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Darurat' },
  high: { class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Tinggi' },
  medium: { class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Sedang' },
  low: { class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', label: 'Rendah' },
}

const statusMeta: Record<TicketStatusKind, { status: TicketStatusKind; label: string }> = {
  open: { status: 'open', label: 'Terbuka' },
  in_progress: { status: 'in_progress', label: 'Diproses' },
  resolved: { status: 'resolved', label: 'Terselesaikan' },
  closed: { status: 'closed', label: 'Ditutup' },
}

function handleExport() {
  const csv = [['ID', 'Subjek', 'Pelanggan', 'Email', 'Prioritas', 'Status', 'Agen', 'Terakhir'].join(',')]
    .concat(tickets.value.map(t => [String(t.id), t.subject, t.customer, t.email, t.priority, t.status, t.agent, t.lastUpdated].join(',')))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tickets-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('CSV terunduh')
}

// ponytail: detail opens with list data; fetch full detail on open for fresh messages
async function handleOpenTicket(t: SupportTicket) {
  selectedTicket.value = t
  detailOpen.value = true
  const token = auth.token.value
  if (!token) return
  const fresh = await fetchAdminTicket(token, t.id)
  selectedTicket.value = mapTicket(fresh)
}

async function handleReply() {
  if (!replyText.value.trim() || !selectedTicket.value || replyLoading.value) return
  replyLoading.value = true
  try {
    const token = auth.token.value
    if (!token) return
    const updated = await replyToTicket(token, selectedTicket.value.id, replyText.value)
    selectedTicket.value = mapTicket(updated)
    replyText.value = ''
    toast.success('Balasan terkirim')
  } catch {
    toast.error('Gagal mengirim balasan')
  } finally {
    replyLoading.value = false
  }
}

async function handleChangeStatus(status: TicketStatusKind) {
  if (!selectedTicket.value) return
  try {
    const token = auth.token.value
    if (!token) return
    const updated = await updateTicketStatus(token, selectedTicket.value.id, status)
    selectedTicket.value = mapTicket(updated)
    detailOpen.value = false
    await loadTickets()
    toast.success(status === 'resolved' ? 'Tiket terselesaikan' : status === 'closed' ? 'Tiket ditutup' : 'Status diperbarui')
  } catch {
    toast.error('Gagal memperbarui status')
  }
}

onMounted(async () => {
  await auth.bootstrap()
  await loadTickets()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Tiket Dukungan" description="Kelola semua permintaan dukungan pelanggan di platform." size="large">
      <template #actions>
        <Button variant="outline" class="rounded-xl" @click="handleExport">
          <Icon name="i-lucide-download" class="size-4" /> Ekspor
        </Button>
      </template>
    </SharedPageHeader>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SharedStatCard title="Tiket Terbuka" icon="i-lucide-inbox">
        <span class="text-2xl font-bold">{{ stats.open }}</span>
      </SharedStatCard>
      <SharedStatCard title="Darurat" icon="i-lucide-alert-triangle">
        <span class="text-2xl font-bold text-destructive">{{ stats.urgent }}</span>
      </SharedStatCard>
      <SharedStatCard title="Diproses" icon="i-lucide-clock">
        <span class="text-2xl font-bold">{{ stats.awaiting }}</span>
      </SharedStatCard>
      <SharedStatCard title="Selesai / Ditutup" icon="i-lucide-check-circle">
        <span class="text-2xl font-bold text-green-600">{{ stats.resolvedToday }}</span>
      </SharedStatCard>
    </div>

    <Tabs :model-value="activeTab" @update:model-value="activeTab = $event as string; page = 1; loadTickets()">
      <TabsList class="flex-wrap bg-muted">
        <TabsTrigger
          v-for="tab in tabOptions" :key="tab.value" :value="tab.value"
          class="rounded-xl data-[state=active]:bg-editor-primary data-[state=active]:text-editor-primary-foreground"
        >
          {{ tab.label }}
        </TabsTrigger>
      </TabsList>
    </Tabs>

    <SharedDataTable
      :columns="columns" :data="filtered" :loading="loading"
      v-model:search="search"
      :filter-keys="['id', 'subject', 'customer', 'agent']"
      empty-text="Tidak ada tiket"
    >
      <template #cell-id="{ row }">
        <button class="font-mono text-sm font-medium text-editor-primary hover:underline" @click="handleOpenTicket(row)">
          #T-{{ row.id }}
        </button>
      </template>
      <template #cell-subject="{ row }">
        <button class="text-left font-medium hover:text-editor-primary" @click="handleOpenTicket(row)">
          <span class="flex items-center gap-2">
            {{ row.subject }}
            <span v-if="row.priority === 'urgent'" class="inline-flex size-2 rounded-full bg-destructive" title="Darurat" />
          </span>
        </button>
      </template>
      <template #cell-priority="{ row }">
        <Badge :class="priorityMeta[row.priority]?.class" class="rounded-xl border-0 font-medium">
          {{ priorityMeta[row.priority]?.label }}
        </Badge>
      </template>
      <template #cell-status="{ row }">
        <SharedStatusBadge :status="statusMeta[row.status]?.status" :label="statusMeta[row.status]?.label" />
      </template>
    </SharedDataTable>

    <div v-if="total > 10" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; loadTickets()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page * 10 >= total" @click="page++; loadTickets()">
        Selanjutnya
      </Button>
    </div>

    <Dialog v-model:open="detailOpen">
      <DialogContent class="max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-3">
            <span>{{ selectedTicket?.subject }}</span>
            <SharedStatusBadge v-if="selectedTicket" :status="statusMeta[selectedTicket.status]?.status" :label="statusMeta[selectedTicket.status]?.label" />
          </DialogTitle>
        </DialogHeader>

        <div class="space-y-1 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <span class="font-medium text-foreground">{{ selectedTicket?.customer }}</span>
            <span>&lt;{{ selectedTicket?.email }}&gt;</span>
          </div>
          <div class="flex items-center gap-2">
            <span>Ticket: <span class="font-mono font-medium text-foreground">#T-{{ selectedTicket?.id }}</span></span>
            <span class="text-muted-foreground/50">|</span>
            <Badge v-if="selectedTicket" :class="priorityMeta[selectedTicket.priority]?.class" class="rounded-xl border-0">
              {{ priorityMeta[selectedTicket.priority]?.label }}
            </Badge>
          </div>
        </div>

        <div class="flex max-h-80 flex-col gap-3 overflow-y-auto rounded-xl bg-muted/30 p-4">
          <div v-for="(msg, i) in selectedTicket?.messages ?? []" :key="i" class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-foreground">{{ msg.from }}</span>
              <span class="text-xs text-muted-foreground">{{ msg.time }}</span>
            </div>
            <p class="rounded-lg bg-background px-3 py-2 text-sm shadow-sm">
              {{ msg.text }}
            </p>
          </div>
        </div>

        <div class="flex items-end gap-3">
          <Textarea v-model="replyText" placeholder="Ketik balasan..." rows="3" class="rounded-xl resize-none" :disabled="replyLoading" />
          <Button class="shrink-0 rounded-xl bg-editor-primary text-editor-primary-foreground hover:bg-editor-primary-hover" :disabled="replyLoading" @click="handleReply">
            <Icon name="i-lucide-send" class="size-4" /> Kirim
          </Button>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <Button v-if="selectedTicket?.status === 'open' || selectedTicket?.status === 'in_progress'" variant="outline" class="rounded-xl" @click="handleChangeStatus('resolved')">
            <Icon name="i-lucide-check-check" class="size-4" /> Tandai Selesai
          </Button>
          <Button v-if="selectedTicket?.status === 'resolved'" variant="outline" class="rounded-xl" @click="handleChangeStatus('closed')">
            <Icon name="i-lucide-lock" class="size-4" /> Tutup Tiket
          </Button>
          <Button v-if="selectedTicket?.status !== 'closed' && selectedTicket?.status !== 'resolved'" variant="outline" class="rounded-xl" @click="handleChangeStatus('in_progress')">
            <Icon name="i-lucide-play" class="size-4" /> Tandai Diproses
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
