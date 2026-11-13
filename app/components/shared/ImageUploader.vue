<script setup lang="ts">
import { ref, onBeforeUnmount, computed } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'

const files = defineModel<(File | string)[]>({ default: () => [] })

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const previews = ref<string[]>([])

function syncPreviews(next: (File | string)[]) {
  previews.value.forEach((url) => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url)
  })
  previews.value = next.map((f) => typeof f === 'string' ? f : URL.createObjectURL(f))
}

function update(next: (File | string)[]) {
  files.value = next
  syncPreviews(next)
}

function handleFiles(fileList: FileList | null) {
  if (!fileList) return
  const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
  update([...files.value, ...incoming])
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  handleFiles(e.dataTransfer?.files ?? null)
}

function onBrowse() {
  inputRef.value?.click()
}

function onInputChange(e: Event) {
  handleFiles((e.target as HTMLInputElement).files)
}

function removeAt(index: number) {
  const next = files.value.filter((_, i) => i !== index)
  update(next)
}

const hasFiles = computed(() => files.value.length > 0)

onBeforeUnmount(() => {
  previews.value.forEach((url) => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url)
  })
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <Label>Gambar</Label>
    <div
      role="button"
      tabindex="0"
      aria-label="Unggah gambar"
      :class="[
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/50 px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        isDragging ? 'bg-muted' : 'hover:bg-muted',
      ]"
      @click="onBrowse"
      @keydown.enter.prevent="onBrowse"
      @keydown.space.prevent="onBrowse"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <Icon name="i-lucide-upload-cloud" class="size-8 text-muted-foreground" />
      <p class="text-sm text-muted-foreground">
        Seret &amp; lepas gambar di sini, atau klik untuk memilih
      </p>
      <input
        ref="inputRef"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="onInputChange"
      >
    </div>

    <ScrollArea v-if="hasFiles" class="max-h-48 w-full rounded-xl border border-border">
      <div class="grid grid-cols-3 gap-3 p-3 sm:grid-cols-4">
        <div
          v-for="(src, i) in previews"
          :key="src"
          class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
        >
          <img :src="src" alt="" class="size-full object-cover">
          <button
            type="button"
            aria-label="Hapus gambar"
            class="absolute right-1 top-1 size-6 rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            @click.stop="removeAt(i)"
          >
            <Icon name="i-lucide-x" class="size-4" />
          </button>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
