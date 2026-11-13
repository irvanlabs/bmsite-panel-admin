<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const auth = useAuth()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const turnstileSiteKey = computed(() => runtimeConfig.public.turnstile?.siteKey as string)

const email = ref('')
const password = ref('')
const totpCode = ref('')
const showTotp = ref(false)
const turnstileToken = ref<string>('')
const turnstileWidget = ref<{ reset: () => void } | null>(null)
// Cloudflare renders a fixed 300x65 widget; scale it to the form width.
const turnstileWrap = ref<HTMLElement | null>(null)
const turnstileScale = ref(1)
function fitTurnstile() {
  const w = turnstileWrap.value?.clientWidth ?? 0
  if (w > 0) turnstileScale.value = Math.min(w / 300, 1.25)
}
useResizeObserver(turnstileWrap, fitTurnstile)
onMounted(fitTurnstile)
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  loading.value = true
  error.value = null
  try {
    if (turnstileSiteKey.value) {
      if (!turnstileToken.value) {
        throw new Error('Silakan selesaikan verifikasi Turnstile')
      }
    }
    await auth.login(email.value, password.value, turnstileToken.value || undefined, showTotp.value ? totpCode.value : undefined)
    if (!auth.isAdmin.value) {
      // Panel admin hanya untuk superadmin; akun lain ditolak di halaman login.
      toast.error('Akun ini bukan admin. Masuk dengan akun admin.')
      return
    }
    const turnstileRef = turnstileWidget.value
    if (turnstileRef?.reset) {
      turnstileRef.reset()
    }
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
      await navigateTo(redirect)
      return
    }
    await navigateTo('/admin')
  }
  catch (e) {
    if (e && typeof e === 'object' && 'requires2fa' in e) {
      showTotp.value = true
      error.value = 'Masukkan kode 6 digit dari aplikasi autentikator Anda'
    }
    else {
      error.value = e instanceof Error ? e.message : 'Gagal masuk'
    }
  }
  finally {
    loading.value = false
  }
}

function onTurnstileError() {
  error.value = 'Verifikasi keamanan gagal. Silakan coba lagi.'
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-sm rounded-2xl">
      <CardHeader>
        <CardTitle class="text-xl font-semibold tracking-tight">
          Masuk
        </CardTitle>
        <CardDescription>Selamat datang kembali di Panel BMSite</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="submit">
          <div v-if="error" class="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {{ error }}
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="anda@contoh.com" class="rounded-xl" required />
          </div>
          <div class="space-y-2">
            <Label for="password">Kata Sandi</Label>
            <Input id="password" v-model="password" type="password" placeholder="••••••••" class="rounded-xl" required />
          </div>
          <div v-if="showTotp" class="space-y-2">
            <Label for="totp">Kode Autentikator</Label>
            <Input
              id="totp"
              v-model="totpCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="123456"
              autocomplete="one-time-code"
              class="rounded-xl text-center font-mono tracking-widest"
              required
            />
          </div>
          <div v-if="turnstileSiteKey" ref="turnstileWrap" class="w-full overflow-hidden" :style="{ height: `${65 * turnstileScale}px` }">
            <div :style="{ width: '300px', height: '65px', transform: `scale(${turnstileScale})`, transformOrigin: 'top left' }">
              <NuxtTurnstile
                ref="turnstileWidget"
                v-model="turnstileToken"
                :site-key="turnstileSiteKey"
                @error="onTurnstileError"
              />
            </div>
          </div>
          <div v-else class="text-sm text-xs text-muted-foreground">
            Turnstile key missing (siteKey: {{ turnstileSiteKey }})
          </div>
          <Button type="submit" class="w-full rounded-xl" :disabled="loading">
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
