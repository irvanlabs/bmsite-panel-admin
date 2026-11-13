<script setup lang="ts">
withDefaults(defineProps<{
  name?: string
  subtitle?: string
}>(), {
  name: 'di sini',
  subtitle: 'Berikut aktivitas akun Anda hari ini.',
})
</script>

<template>
  <div class="space-y-1">
    <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
      Selamat datang kembali, {{ name }}
    </h1>
    <p class="text-sm text-muted-foreground">
      {{ subtitle }}
    </p>
  </div>
</template>
