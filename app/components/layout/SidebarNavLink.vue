<script setup lang="ts">
import type { SidebarMenuButtonVariants } from '~/components/ui/sidebar'
import type { NavLink } from '~/types/nav'
import { sidebarMenuButtonVariants } from '~/components/ui/sidebar'

const props = defineProps<{
  item: NavLink
  size?: SidebarMenuButtonVariants['size']
}>()

const route = useRoute()

const active = computed(() => {
  if (props.item.exact)
    return route.path === props.item.link
  return route.path === props.item.link || route.path.startsWith(`${props.item.link}/`)
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <NuxtLink
        :to="item.link"
        :class="cn(sidebarMenuButtonVariants({ size }), 'cursor-pointer')"
        :data-active="active"
      >
        <Icon :name="item.icon || ''" />
        <span>{{ item.title }}</span>
        <span v-if="item.new" class="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs text-black leading-none no-underline">
          New
        </span>
      </NuxtLink>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
