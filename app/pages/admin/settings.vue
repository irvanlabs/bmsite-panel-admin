<script setup lang="ts">
import type { AdminDnsSettings, AdminDomainSettings, AdminGeneralSettings, AdminIntegrationSettings, AdminLandingSettings, AdminNotificationSettings, AdminSecuritySettings } from '~/services/admin/settings.service'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '~/composables/useAuth'
import { fetchAdminSettings, updateAdminSettings } from '~/services/admin/settings.service'

definePageMeta({ layout: 'admin' })

const auth = useAuth()
const activeTab = ref('general')
const loading = ref(true)
const saving = ref(false)

const general = ref<AdminGeneralSettings>({ default_plan_id: null, default_template_id: null })
const dns = ref<AdminDnsSettings>({ nameservers: [] })
const domainSettings = ref<AdminDomainSettings>({ markup_percent: 10, tax_percent: 11, platform_ipv4: '' })
const newNs = ref('')

const landingFields = [
  { key: 'hero_title', label: 'Headline hero' },
  { key: 'hero_subtitle', label: 'Subheadline hero' },
  { key: 'hero_slide_store', label: 'Caption slide etalase' },
  { key: 'hero_slide_web', label: 'Caption slide website' },
  { key: 'problem_title', label: 'Judul section masalah' },
  { key: 'problem_subtitle', label: 'Sub section masalah' },
  { key: 'solution_title', label: 'Judul section solusi' },
  { key: 'template_title', label: 'Judul section template' },
  { key: 'template_subtitle', label: 'Sub section template' },
  { key: 'pricing_title', label: 'Judul section harga' },
  { key: 'pricing_subtitle', label: 'Sub section harga' },
  { key: 'process_title', label: 'Judul section cara mulai' },
  { key: 'process_subtitle', label: 'Sub section cara mulai' },
  { key: 'cta_title', label: 'Judul CTA penutup' },
  { key: 'cta_subtitle', label: 'Sub CTA penutup' },
  { key: 'footer_tagline', label: 'Tagline footer' },
] as const

const security = ref<AdminSecuritySettings>({
  turnstile_site_key: '',
  turnstile_secret_key: '',
  force_admin_2fa: false,
  password_min_length: 8,
})

const notifications = ref<AdminNotificationSettings>({
  mail_from_address: '',
  mail_from_name: '',
  admin_notify_email: '',
  notify_on_order: true,
  notify_on_payment: true,
})

const integrations = ref<AdminIntegrationSettings>({
  duitku_merchant_code: '',
  duitku_api_key: '',
  snap_server_key: '',
  snap_client_key: '',
  s3_key: '',
  s3_secret: '',
  s3_bucket: '',
  s3_region: '',
  s3_endpoint: '',
})

const landing = ref<AdminLandingSettings>({
  hero_title: '',
  hero_subtitle: '',
  hero_slide_store: '',
  hero_slide_web: '',
  problem_title: '',
  problem_subtitle: '',
  solution_title: '',
  template_title: '',
  template_subtitle: '',
  pricing_title: '',
  pricing_subtitle: '',
  process_title: '',
  process_subtitle: '',
  cta_title: '',
  cta_subtitle: '',
  footer_tagline: '',
})

async function load() {
  loading.value = true
  try {
    const token = auth.token.value
    if (!token)
      return
    const [g, d, dom, land, sec, notif, integ] = await Promise.all([
      fetchAdminSettings<AdminGeneralSettings>(token, 'general'),
      fetchAdminSettings<AdminDnsSettings>(token, 'dns'),
      fetchAdminSettings<AdminDomainSettings>(token, 'domain'),
      fetchAdminSettings<AdminLandingSettings>(token, 'landing'),
      fetchAdminSettings<AdminSecuritySettings>(token, 'security'),
      fetchAdminSettings<AdminNotificationSettings>(token, 'notifications'),
      fetchAdminSettings<AdminIntegrationSettings>(token, 'integrations'),
    ])
    general.value = g
    dns.value = d
    domainSettings.value = dom
    landing.value = { ...landing.value, ...land }
    security.value = { ...security.value, ...sec }
    notifications.value = { ...notifications.value, ...notif }
    integrations.value = { ...integrations.value, ...integ }
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal memuat pengaturan')
  }
  finally {
    loading.value = false
  }
}

async function handleSave() {
  const token = auth.token.value
  if (!token)
    return
  if (!['general', 'dns', 'domain', 'landing', 'security', 'notifications', 'integrations'].includes(activeTab.value)) {
    toast.info('Pengaturan ini belum didukung backend')
    return
  }
  saving.value = true
  try {
    if (activeTab.value === 'general') {
      await updateAdminSettings(token, 'general', {
        default_plan_id: general.value.default_plan_id,
        default_template_id: general.value.default_template_id,
      })
    }
    else if (activeTab.value === 'dns') {
      await updateAdminSettings(token, 'dns', { nameservers: dns.value.nameservers })
    }
    else if (activeTab.value === 'domain') {
      await updateAdminSettings(token, 'domain', {
        markup_percent: Number(domainSettings.value.markup_percent),
        tax_percent: Number(domainSettings.value.tax_percent),
        platform_ipv4: domainSettings.value.platform_ipv4,
      })
    }
    else if (activeTab.value === 'landing') {
      await updateAdminSettings(token, 'landing', { ...landing.value })
    }
    else if (activeTab.value === 'security') {
      await updateAdminSettings(token, 'security', {
        turnstile_site_key: security.value.turnstile_site_key,
        turnstile_secret_key: security.value.turnstile_secret_key,
        force_admin_2fa: security.value.force_admin_2fa,
        password_min_length: Number(security.value.password_min_length),
      })
    }
    else if (activeTab.value === 'notifications') {
      await updateAdminSettings(token, 'notifications', { ...notifications.value })
    }
    else {
      await updateAdminSettings(token, 'integrations', { ...integrations.value })
    }
    toast.success('Pengaturan berhasil disimpan')
  }
  catch (e: unknown) {
    const err = e as { data?: { error?: { message?: string } } }
    toast.error(err.data?.error?.message ?? 'Gagal menyimpan pengaturan')
  }
  finally {
    saving.value = false
  }
}

function addNs() {
  const v = newNs.value.trim()
  if (!v)
    return
  dns.value.nameservers = [...dns.value.nameservers, v]
  newNs.value = ''
}

function removeNs(i: number) {
  dns.value.nameservers = dns.value.nameservers.filter((_, idx) => idx !== i)
}

onMounted(async () => {
  await auth.bootstrap()
  await load()
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          Pengaturan Platform
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Konfigurasi pengaturan global platform.
        </p>
      </div>
      <Button class="rounded-xl" :disabled="saving || loading" @click="handleSave">
        <Icon name="i-lucide-save" class="size-4" />
        Simpan Perubahan
      </Button>
    </div>

    <Tabs v-model="activeTab" default-value="general" class="w-full">
      <TabsList class="mb-6 rounded-xl bg-muted p-1">
        <TabsTrigger value="general" class="rounded-lg">
          Umum
        </TabsTrigger>
        <TabsTrigger value="dns" class="rounded-lg">
          DNS
        </TabsTrigger>
        <TabsTrigger value="domain" class="rounded-lg">
          Domain
        </TabsTrigger>
        <TabsTrigger value="landing" class="rounded-lg">
          Landing
        </TabsTrigger>
        <TabsTrigger value="security" class="rounded-lg">
          Keamanan
        </TabsTrigger>
        <TabsTrigger value="notifications" class="rounded-lg">
          Notifikasi
        </TabsTrigger>
        <TabsTrigger value="integrations" class="rounded-lg">
          Integrasi
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" class="space-y-6">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base font-bold">
              Pengaturan Umum
            </CardTitle>
            <CardDescription>Nilai default platform yang didukung backend.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-3">
              <Label for="default-plan-id">Default Plan ID</Label>
              <Input id="default-plan-id" type="number" :value="general.default_plan_id ?? ''" @input="general.default_plan_id = ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null" />
            </div>
            <div class="grid gap-3">
              <Label for="default-template-id">Default Template ID</Label>
              <Input id="default-template-id" type="number" :value="general.default_template_id ?? ''" @input="general.default_template_id = ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dns" class="space-y-6">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base font-bold">
              Nameservers
            </CardTitle>
            <CardDescription>Daftar nameserver platform.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Input v-model="newNs" placeholder="ns1.example.com" @keyup.enter="addNs" />
              <Button type="button" @click="addNs">
                Tambah
              </Button>
            </div>
            <ul class="space-y-2">
              <li v-for="(ns, i) in dns.nameservers" :key="i" class="flex items-center justify-between rounded-xl border p-3">
                <span class="font-mono text-sm">{{ ns }}</span>
                <Button variant="outline" size="sm" @click="removeNs(i)">
                  Hapus
                </Button>
              </li>
            </ul>
            <p v-if="dns.nameservers.length === 0" class="text-sm text-muted-foreground">
              Belum ada nameserver.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="domain" class="space-y-6">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base font-bold">
              Harga &amp; Domain
            </CardTitle>
            <CardDescription>
              Harga dasar diambil dari RNA saat pengecekan; jual = dasar + markup ini, lalu pajak di atasnya.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="grid gap-2">
                <Label for="domain-markup">Markup layanan (%)</Label>
                <Input id="domain-markup" v-model.number="domainSettings.markup_percent" type="number" min="0" max="500" step="0.1" />
              </div>
              <div class="grid gap-2">
                <Label for="domain-tax">Pajak (%)</Label>
                <Input id="domain-tax" v-model.number="domainSettings.tax_percent" type="number" min="0" max="50" step="0.1" />
              </div>
            </div>
            <div class="grid gap-2">
              <Label for="platform-ipv4">IP platform (A record)</Label>
              <Input id="platform-ipv4" v-model="domainSettings.platform_ipv4" placeholder="203.0.113.10" />
              <p class="text-xs text-muted-foreground">
                Ditampilkan ke customer sebagai target A record saat menyambungkan domain sendiri, dan dipakai auto-config DNS untuk domain yang dibeli.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="landing" class="space-y-6">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base font-bold">
              Konten Landing
            </CardTitle>
            <CardDescription>
              Teks yang tampil di halaman depan. Kosongkan untuk memakai bawaan.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="field in landingFields"
              :key="field.key"
              class="grid gap-2"
            >
              <Label :for="`landing-${field.key}`">{{ field.label }}</Label>
              <Textarea
                :id="`landing-${field.key}`"
                v-model="landing[field.key]"
                rows="2"
                class="rounded-xl resize-y"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" class="space-y-6">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base font-bold">
              Keamanan
            </CardTitle>
            <CardDescription>
              Kunci Turnstile pindah ke sini (env jadi cadangan). Wajib 2FA mengunci login admin yang belum pasang 2FA.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label for="sec-site-key">Turnstile site key</Label>
              <Input
                id="sec-site-key"
                v-model="security.turnstile_site_key"
                placeholder="0x4AAAAA…"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="sec-secret">Turnstile secret key</Label>
              <Input
                id="sec-secret"
                v-model="security.turnstile_secret_key"
                type="password"
                placeholder="Kosongkan = tidak diubah"
                autocomplete="off"
                class="rounded-xl"
              />
              <p class="text-xs text-muted-foreground">
                Tersimpan tampil tersamar (••••abcd).
              </p>
            </div>
            <div class="grid gap-2">
              <Label for="sec-minlen">Panjang password minimal (8–72)</Label>
              <Input
                id="sec-minlen"
                v-model.number="security.password_min_length"
                type="number"
                min="8"
                max="72"
                class="rounded-xl max-w-32"
              />
            </div>
            <div class="flex items-center gap-3">
              <Switch
                id="sec-force2fa"
                v-model="security.force_admin_2fa"
              />
              <Label for="sec-force2fa">Wajibkan 2FA untuk admin</Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" class="space-y-6">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base font-bold">
              Notifikasi
            </CardTitle>
            <CardDescription>
              Pengirim email dan saklar notifikasi order/pembayaran.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label for="notif-from-addr">Email pengirim</Label>
              <Input
                id="notif-from-addr"
                v-model="notifications.mail_from_address"
                type="email"
                placeholder="noreply@domainmu.id"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="notif-from-name">Nama pengirim</Label>
              <Input
                id="notif-from-name"
                v-model="notifications.mail_from_name"
                placeholder="BismaLabs"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="notif-admin">Email admin penerima notifikasi</Label>
              <Input
                id="notif-admin"
                v-model="notifications.admin_notify_email"
                type="email"
                placeholder="admin@domainmu.id"
                class="rounded-xl"
              />
            </div>
            <div class="flex items-center gap-3">
              <Switch
                id="notif-order"
                v-model="notifications.notify_on_order"
              />
              <Label for="notif-order">Notifikasi order baru</Label>
            </div>
            <div class="flex items-center gap-3">
              <Switch
                id="notif-payment"
                v-model="notifications.notify_on_payment"
              />
              <Label for="notif-payment">Notifikasi pembayaran</Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integrations" class="space-y-6">
        <Card class="rounded-2xl">
          <CardHeader>
            <CardTitle class="text-base font-bold">
              Integrasi
            </CardTitle>
            <CardDescription>
              Kunci payment gateway dan storage. Field secret tampil tersamar; kosongkan = tidak diubah.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label for="int-duitku-merchant">Duitku merchant code</Label>
              <Input
                id="int-duitku-merchant"
                v-model="integrations.duitku_merchant_code"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-duitku-key">Duitku API key</Label>
              <Input
                id="int-duitku-key"
                v-model="integrations.duitku_api_key"
                type="password"
                placeholder="Kosongkan = tidak diubah"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-snap-server">Midtrans/Snap server key</Label>
              <Input
                id="int-snap-server"
                v-model="integrations.snap_server_key"
                type="password"
                placeholder="Kosongkan = tidak diubah"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-snap-client">Midtrans/Snap client key</Label>
              <Input
                id="int-snap-client"
                v-model="integrations.snap_client_key"
                type="password"
                placeholder="Kosongkan = tidak diubah"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-s3-key">S3 access key</Label>
              <Input
                id="int-s3-key"
                v-model="integrations.s3_key"
                type="password"
                placeholder="Kosongkan = tidak diubah"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-s3-secret">S3 secret</Label>
              <Input
                id="int-s3-secret"
                v-model="integrations.s3_secret"
                type="password"
                placeholder="Kosongkan = tidak diubah"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-s3-bucket">S3 bucket</Label>
              <Input
                id="int-s3-bucket"
                v-model="integrations.s3_bucket"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-s3-region">S3 region</Label>
              <Input
                id="int-s3-region"
                v-model="integrations.s3_region"
                placeholder="ap-southeast-1"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
            <div class="grid gap-2">
              <Label for="int-s3-endpoint">S3 endpoint (opsional)</Label>
              <Input
                id="int-s3-endpoint"
                v-model="integrations.s3_endpoint"
                placeholder="https://…"
                autocomplete="off"
                class="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
