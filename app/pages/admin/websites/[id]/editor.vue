<script setup lang="ts">
import type { AdminSiteResponse } from '~/services/admin/sites.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '~/composables/useAuth'
import { fetchAdminSite } from '~/services/admin/sites.service'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const auth = useAuth()
const loading = ref(true)
const notFound = ref(false)
const site = ref<AdminSiteResponse | null>(null)

async function load() {
  loading.value = true
  notFound.value = false
  try {
    const token = auth.token.value
    if (!token)
      return
    const id = Number(route.params.id)
    if (!Number.isFinite(id)) {
      notFound.value = true
      return
    }
    site.value = await fetchAdminSite(token, id)
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat website')
    notFound.value = true
  }
  finally {
    loading.value = false
  }
}

function goBack() {
  navigateTo('/admin/websites')
}

onMounted(async () => {
  await auth.bootstrap()
  await load()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SharedPageHeader title="Editor Website" description="Lihat detail website (read-only)." />

    <div v-if="loading" class="h-40 animate-pulse rounded-2xl bg-muted" />

    <div v-else-if="notFound" class="rounded-2xl border p-8 text-center">
      <p class="text-muted-foreground">
        Website tidak ditemukan.
      </p>
      <Button class="mt-4" @click="goBack">
        Kembali
      </Button>
    </div>

    <template v-else-if="site">
      <Card class="rounded-2xl">
        <CardHeader>
          <CardTitle class="text-base">
            Detail Website
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Subdomain</span><span class="font-medium">{{ site.subdomain }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Status</span><span class="font-medium">{{ site.status }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Pemilik</span><span class="font-medium">{{ site.owner_name }} ({{ site.owner_email }})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Paket</span><span class="font-medium">{{ site.plan ?? '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Jumlah Halaman</span><span class="font-medium">{{ site.pages_count }}</span>
          </div>
        </CardContent>
      </Card>

      <Card class="rounded-2xl border-dashed">
        <CardContent class="p-6 text-sm text-muted-foreground">
          Pengeditan konten website pelanggan lain tidak didukung oleh API. Halaman ini hanya menampilkan detail.
        </CardContent>
      </Card>

      <Button variant="outline" @click="goBack">
        Kembali
      </Button>
    </template>
  </div>
</template>
