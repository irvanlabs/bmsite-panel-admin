import { useAuth } from '~/composables/useAuth'
import { toast } from 'vue-sonner'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  if (to.path.startsWith('/auth/login')) return

  await auth.bootstrap()

  if (to.path.startsWith('/admin')) {
    if (!auth.isAuthenticated.value) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    if (!auth.isAdmin.value) {
      toast.error('Akun ini bukan admin. Masuk dengan akun admin.')
      return navigateTo('/auth/login')
    }
    return
  }

  if (to.path === '/') {
    if (!auth.isAuthenticated.value) {
      return navigateTo('/auth/login')
    }
    if (auth.isAdmin.value) {
      return navigateTo('/admin')
    }
    toast.error('Akun ini bukan admin. Masuk dengan akun admin.')
    return navigateTo('/auth/login')
  }

  // Any other path falls through: no page matches it, so the 404 page handles it.
})
