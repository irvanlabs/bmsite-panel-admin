<script setup lang="ts">
import { toast } from 'vue-sonner'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: false })

const auth = useAuth()
await auth.bootstrap()

if (!auth.isAuthenticated.value) {
  await navigateTo('/auth/login', { replace: true })
}
else if (auth.isAdmin.value) {
  await navigateTo('/admin', { replace: true })
}
else {
  toast.error('Akun ini bukan admin. Masuk dengan akun admin.')
  await navigateTo('/auth/login', { replace: true })
}
</script>

<template>
  <div />
</template>
