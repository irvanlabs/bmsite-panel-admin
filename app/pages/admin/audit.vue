<script setup lang="ts">
import type { AdminActivityLogEntry } from '~/services/admin/audit.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedDataTable from '@/components/shared/DataTable.vue'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '~/composables/useAuth'
import { fetchActivityLog } from '~/services/admin/audit.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const loading = ref(true)
const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const page = ref(1)
const perPage = 15
const total = ref(0)
const lastPage = ref(1)

interface AuditRow {
  id: number
  timestamp: string
  user: string
  action: string
  resource: string
  detail: string
  ip: string
}
const entries = ref<AuditRow[]>([])
const rawEntries = ref<AdminActivityLogEntry[]>([])

function mapEntry(raw: AdminActivityLogEntry): AuditRow {
  return {
    id: raw.id,
    timestamp: raw.created_at ? new Date(raw.created_at).toLocaleString('id-ID') : '-',
    user: raw.causer?.name ?? raw.causer_type ?? 'System',
    action: raw.description ?? '-',
    resource: raw.subject_type ? `${raw.subject_type}${raw.subject?.id ? ` #${raw.subject.id}` : ''}` : '-',
    detail: raw.properties ? JSON.stringify(raw.properties) : '-',
    ip: raw.ip_address ?? '-',
  }
}

async function load() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    const result = await fetchActivityLog(token, {
      per_page: perPage,
      page: page.value,
      date_from: dateFrom.value || undefined,
      date_to: dateTo.value || undefined,
    })
    rawEntries.value = result.data
    entries.value = result.data.map(mapEntry)
    total.value = result.meta.total
    lastPage.value = result.meta.last_page
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat log audit')
  }
  finally {
    loading.value = false
  }
}

function handleExport() {
  const csv = [['Waktu', 'Pengguna', 'Aksi', 'Sumber', 'Detail', 'IP'].join(',')]
    .concat(entries.value.map(e => [e.timestamp, e.user, e.action, e.resource, e.detail, e.ip].join(',')))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const columns = [
  { key: 'timestamp', label: 'Waktu', sortable: true, class: 'whitespace-nowrap' },
  { key: 'user', label: 'Pengguna', sortable: true },
  { key: 'action', label: 'Aksi', sortable: true },
  { key: 'resource', label: 'Sumber', sortable: true },
  { key: 'detail', label: 'Detail', class: 'max-w-xs truncate' },
  { key: 'ip', label: 'Alamat IP', sortable: true, class: 'font-mono text-xs' },
]

onMounted(async () => {
  await auth.bootstrap()
  await load()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Log Audit" description="Lacak setiap aksi di platform secara real-time.">
      <template #actions>
        <Button variant="outline" class="rounded-xl" @click="handleExport">
          <Icon name="i-lucide-download" class="size-4" /> Ekspor
        </Button>
        <Button variant="outline" class="rounded-xl" disabled title="Penghapusan log audit belum tersedia di API">
          <Icon name="i-lucide-trash-2" class="size-4" /> Hapus Log
        </Button>
      </template>
    </SharedPageHeader>

    <div class="flex flex-wrap items-center gap-3">
      <Input v-model="dateFrom" type="date" class="w-40 rounded-xl" />
      <Input v-model="dateTo" type="date" class="w-40 rounded-xl" />
      <Button class="rounded-xl" @click="page = 1; load()">
        Terapkan
      </Button>
    </div>

    <SharedDataTable
      v-model:search="search"
      :columns="columns"
      :data="entries"
      :loading="loading"
      :filter-keys="['user', 'action', 'resource', 'detail', 'ip']"
      empty-text="Tidak ada log audit"
    />

    <div v-if="total > perPage" class="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page <= 1" @click="page--; load()">
        Sebelumnya
      </Button>
      <span class="text-sm text-muted-foreground">Halaman {{ page }} / {{ lastPage }}</span>
      <Button variant="outline" size="sm" class="rounded-xl" :disabled="page >= lastPage" @click="page++; load()">
        Selanjutnya
      </Button>
    </div>
  </div>
</template>
