<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import SharedEmptyState from '@/components/shared/EmptyState.vue'
import SharedSearchInput from '@/components/shared/SearchInput.vue'
import { cn } from '@/lib/utils'

type SortDir = 'asc' | 'desc' | null

interface Column {
  key: keyof T | string
  label: string
  sortable?: boolean
  class?: string
}

const props = withDefaults(defineProps<{
  columns: Column[]
  data: T[]
  loading?: boolean
  emptyText?: string
  selectable?: boolean
  pageSize?: number
  search?: string
  filterKeys?: (keyof T)[]
}>(), {
  loading: false,
  emptyText: 'Hasil tidak ditemukan',
  selectable: false,
  pageSize: 10,
  search: '',
  filterKeys: () => [],
})

const emit = defineEmits<{
  'update:search': [value: string]
  'update:selection': [value: T[]]
}>()

const search = computed({
  get: () => props.search,
  set: (v: string) => emit('update:search', v),
})

const sortKey = ref<keyof T | string | null>(null)
const sortDir = ref<SortDir>(null)
const page = ref(1)
const selected = ref<Set<number>>(new Set())

const filtered = computed<T[]>(() => {
  const q = props.search.trim().toLowerCase()
  if (!q || props.filterKeys.length === 0) return props.data
  return props.data.filter((row) =>
    props.filterKeys.some((k) => {
      const v = row[k]
      return v != null && String(v).toLowerCase().includes(q)
    }),
  )
})

const sorted = computed<T[]>(() => {
  if (!sortKey.value || !sortDir.value) return filtered.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => {
    const av = a[sortKey.value as keyof T]
    const bv = b[sortKey.value as keyof T]
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av).localeCompare(String(bv)) * dir
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / props.pageSize)))
const pageRows = computed<T[]>(() => {
  const start = (page.value - 1) * props.pageSize
  return sorted.value.slice(start, start + props.pageSize)
})

const selectedRows = computed<T[]>(() =>
  pageRows.value.filter((_, i) => selected.value.has(rowIndex(i))),
)

const allOnPageSelected = computed<boolean>(() =>
  pageRows.value.length > 0 && pageRows.value.every((_, i) => selected.value.has(rowIndex(i))),
)

function rowIndex(localIndex: number): number {
  return (page.value - 1) * props.pageSize + localIndex
}

function toggleSort(key: keyof T | string) {
  if (!props.columns.find((c) => c.key === key)?.sortable) return
  if (sortKey.value !== key) {
    sortKey.value = key
    sortDir.value = 'asc'
  } else if (sortDir.value === 'asc') {
    sortDir.value = 'desc'
  } else if (sortDir.value === 'desc') {
    sortDir.value = null
    sortKey.value = null
  } else {
    sortDir.value = 'asc'
  }
}

function toggleRow(localIndex: number) {
  const id = rowIndex(localIndex)
  const next = new Set(selected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
  emit('update:selection', selectedRows.value)
}

function toggleAllOnPage() {
  const next = new Set(selected.value)
  if (allOnPageSelected.value) {
    pageRows.value.forEach((_, i) => next.delete(rowIndex(i)))
  } else {
    pageRows.value.forEach((_, i) => next.add(rowIndex(i)))
  }
  selected.value = next
  emit('update:selection', selectedRows.value)
}

function goToPage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
}

watch(
  () => [props.data, props.search, sortKey.value, sortDir.value, props.pageSize],
  () => {
    if (page.value > totalPages.value) page.value = totalPages.value
    if (props.data.length === 0) page.value = 1
    emit('update:selection', selectedRows.value)
  },
)

watch(() => props.data, () => {
  page.value = 1
  selected.value = new Set()
})
</script>

<template>
  <Card class="rounded-2xl">
    <CardContent class="p-0">
      <div v-if="filterKeys.length > 0" class="border-b p-4">
        <div class="w-full sm:max-w-xs">
          <SharedSearchInput v-model="search" />
        </div>
      </div>

      <div v-if="selectable && selectedRows.length > 0" class="flex items-center gap-3 border-b bg-muted/30 px-4 py-2">
        <span class="text-sm text-muted-foreground">{{ selectedRows.length }} dipilih</span>
        <slot name="bulk-actions" :selected="selectedRows" />
      </div>

      <Table>
        <TableHeader>
          <TableRow class="bg-muted/50 hover:bg-muted/50">
            <TableHead v-if="selectable" class="w-10">
              <Checkbox
                :model-value="allOnPageSelected"
                aria-label="Select all on page"
                @update:model-value="toggleAllOnPage"
              />
            </TableHead>
            <TableHead
              v-for="col in columns"
              :key="String(col.key)"
              :class="cn(
                col.sortable && 'cursor-pointer select-none',
                col.class,
              )"
              @click="col.sortable && toggleSort(col.key)"
            >
              <div class="flex items-center gap-1">
                <span>{{ col.label }}</span>
                <Icon
                  v-if="col.sortable"
                  :name="sortKey === col.key
                    ? (sortDir === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down')
                    : 'i-lucide-chevrons-up-down'"
                  class="size-3.5 text-muted-foreground"
                />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="loading">
            <TableRow v-for="n in Math.min(pageSize, 5)" :key="`skeleton-${n}`">
              <TableCell v-if="selectable" class="w-10">
                <Skeleton class="size-4 rounded" />
              </TableCell>
              <TableCell v-for="col in columns" :key="String(col.key)" :class="col.class">
                <Skeleton class="h-4 w-full" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="pageRows.length === 0">
            <TableRow>
              <TableCell :colspan="columns.length + (selectable ? 1 : 0)" class="p-0">
                <SharedEmptyState :title="emptyText" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow
              v-for="(row, i) in pageRows"
              :key="rowIndex(i)"
              :data-selected="selected.has(rowIndex(i))"
              :class="cn(selected.has(rowIndex(i)) && 'bg-muted/40')"
            >
              <TableCell v-if="selectable" class="w-10">
                <Checkbox
                  :model-value="selected.has(rowIndex(i))"
                  :aria-label="`Select row ${rowIndex(i) + 1}`"
                  @update:model-value="toggleRow(i)"
                />
              </TableCell>
              <TableCell v-for="col in columns" :key="String(col.key)" :class="col.class">
                <slot :name="`cell-${String(col.key)}`" :row="row" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>

      <div class="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
        <p class="text-sm text-muted-foreground">
          {{ sorted.length === 0 ? 0 : (page - 1) * pageSize + 1 }}&ndash;{{ Math.min(page * pageSize, sorted.length) }}
          of {{ sorted.length }}
        </p>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" :disabled="page <= 1" @click="goToPage(page - 1)">
            <Icon name="i-lucide-chevron-left" class="size-4" />
            Sebelumnya
          </Button>
            <span class="text-sm text-muted-foreground">Halaman {{ page }} dari {{ totalPages }}</span>
          <Button variant="outline" size="sm" :disabled="page >= totalPages" @click="goToPage(page + 1)">
            Selanjutnya
            <Icon name="i-lucide-chevron-right" class="size-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
