<script setup lang="ts">
import { adminNav, adminNavBottom } from '@/config/navigation/admin'
import { useSidebarSession } from '~/composables/shared/useSidebarSession'

const { teams, user } = useSidebarSession()
</script>

<template>
  <LayoutBaseSidebar :nav="adminNav" :nav-bottom="adminNavBottom" :teams="teams" :user="user" />
</template>
