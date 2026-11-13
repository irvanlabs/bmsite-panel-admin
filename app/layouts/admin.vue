<script setup lang="ts">
import { useSidebarSession } from '~/composables/shared/useSidebarSession'
import { useLogout } from '~/composables/shared/useLogout'

const { user } = useSidebarSession()
const { handleLogout } = useLogout()
</script>

<template>
  <SidebarProvider>
    <LayoutAdminSidebar />
    <SidebarInset>
      <LayoutDashboardHeader :user="user" @logout="handleLogout" />
      <div class="flex flex-col flex-1">
        <div class="@container/main p-4 lg:p-6 grow">
          <slot />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
