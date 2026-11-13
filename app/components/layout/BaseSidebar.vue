<script setup lang="ts">
import type { NavLink, NavMenu } from '~/types/nav'
import type { UserProfile } from '~/types/shared'
import { useAppSettings } from '~/composables/useAppSettings'

const props = defineProps<{
  nav: NavMenu[]
  navBottom: NavLink[]
  teams: { name: string, logo: string, plan: string }[]
  user: UserProfile
}>()

const { sidebar } = useAppSettings()
// ponytail: teams/user passed via props so client & admin share one sidebar shell
void props
</script>

<template>
  <Sidebar :collapsible="sidebar?.collapsible" :side="sidebar?.side" :variant="sidebar?.variant">
    <SidebarHeader>
      <LayoutSidebarNavHeader :teams="teams" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="(group, i) in nav" :key="i">
        <SidebarGroupLabel v-if="group.heading">
          {{ group.heading }}
        </SidebarGroupLabel>
        <template v-for="(item, j) in group.items" :key="j">
          <LayoutSidebarNavGroup v-if="'children' in item" :item="item" />
          <LayoutSidebarNavLink v-else :item="(item as NavLink)" />
        </template>
      </SidebarGroup>
      <SidebarGroup class="mt-auto">
        <LayoutSidebarNavLink
          v-for="(item, k) in navBottom"
          :key="k"
          :item="item"
          size="sm"
        />
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <LayoutSidebarNavFooter :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
