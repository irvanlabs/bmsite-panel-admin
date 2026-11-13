import { useAuth } from '~/composables/useAuth'

export function useLogout() {
  const auth = useAuth()

  return {
    async handleLogout() {
      await auth.logout()
      await navigateTo('/auth/login')
    },
  }
}
