<script setup lang="ts">
import type { AdminUserResponse } from '~/services/admin/users.service'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import SharedPageHeader from '@/components/shared/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '~/composables/useAuth'
import { fetchAdminUser, updateUserStatus } from '~/services/admin/users.service'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const auth = useAuth()
const loading = ref(true)
const notFound = ref(false)
const user = ref<AdminUserResponse | null>(null)

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
    user.value = await fetchAdminUser(token, id)
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat pengguna')
    notFound.value = true
  }
  finally {
    loading.value = false
  }
}

async function handleSuspend() {
  if (!user.value)
    return
  try {
    const token = auth.token.value
    if (!token)
      return
    await updateUserStatus(token, user.value.id, 'suspended')
    toast.success('Pengguna ditangguhkan')
    await load()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menangguhkan')
  }
}

async function handleActivate() {
  if (!user.value)
    return
  try {
    const token = auth.token.value
    if (!token)
      return
    await updateUserStatus(token, user.value.id, 'active')
    toast.success('Pengguna diaktifkan')
    await load()
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal mengaktifkan')
  }
}

onMounted(async () => {
  await auth.bootstrap()
  await load()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <nav class="flex items-center gap-2 text-sm text-muted-foreground">
      <NuxtLink to="/admin/users" class="font-medium text-foreground hover:text-editor-primary">
        Pengguna
      </NuxtLink>
      <Icon name="i-lucide-chevron-right" class="size-4" />
      <span>{{ user?.name ?? 'Detail' }}</span>
    </nav>

    <div v-if="loading" class="h-40 animate-pulse rounded-2xl bg-muted" />

    <div v-else-if="notFound" class="rounded-2xl border p-8 text-center">
      <p class="text-muted-foreground">
        Pengguna tidak ditemukan.
      </p>
      <Button class="mt-4" @click="navigateTo('/admin/users')">
        Kembali ke Pengguna
      </Button>
    </div>

    <template v-else-if="user">
      <SharedPageHeader :title="user.name" :description="user.email" />

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base">
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Nama</span><span class="font-medium">{{ user.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Email</span><span class="font-medium">{{ user.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Telepon</span><span class="font-medium">{{ user.phone ?? '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Role</span><span class="font-medium">{{ user.role }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Status</span><span class="font-medium">{{ user.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Terdaftar</span><span class="font-medium">{{ user.created_at }}</span>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base">
              Website &amp; Paket
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Website</span><span class="font-medium">{{ user.website ?? '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Paket</span><span class="font-medium">{{ user.plan ?? '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Pembayaran</span><span class="font-medium">{{ user.payment_amount ?? '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Tgl Pembayaran</span><span class="font-medium">{{ user.payment_date ?? '-' }}</span>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base">
              Aksi
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button v-if="user.status !== 'suspended'" variant="outline" class="w-full" @click="handleSuspend">
              Tangguhkan
            </Button>
            <Button v-else variant="outline" class="w-full" @click="handleActivate">
              Aktifkan
            </Button>
            <Button variant="outline" class="w-full" disabled title="Perpanjangan langganan belum didukung backend">
              Perpanjang
            </Button>
            <Button variant="outline" class="w-full" disabled title="Edit profil pengguna belum didukung backend">
              Edit Profil
            </Button>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
