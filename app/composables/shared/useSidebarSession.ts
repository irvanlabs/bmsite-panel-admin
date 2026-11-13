import { useAuth } from '~/composables/useAuth'

export function useSidebarSession() {
  const auth = useAuth()

  const teams = computed(() => [
    { name: 'BMSite', logo: 'i-lucide-gallery-vertical-end', plan: 'Pro' },
  ])

  const user = computed(() => ({
    name: auth.user.value?.name ?? '',
    email: auth.user.value?.email ?? '',
    avatar: '/avatars/avatartion.png',
  }))

  return { teams, user }
}
