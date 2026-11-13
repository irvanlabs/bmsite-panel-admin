<script setup lang="ts">
import { defaultColors } from '@/components/ui/chart'
import { BarChart as UiBarChart } from '@/components/ui/chart-bar'

withDefaults(defineProps<{
  data: Record<string, any>[]
  index?: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (tick: number, i?: number, ticks?: number[]) => string
  showLegend?: boolean
  showGridLine?: boolean
}>(), {
  index: 'label',
  colors: () => defaultColors(2),
  showLegend: false,
  showGridLine: true,
})
</script>

<template>
  <div class="w-full min-h-[300px]">
    <UiBarChart
      :data="data"
      :index="(index as any)"
      :categories="(categories as any)"
      :colors="colors"
      type="grouped"
      :show-legend="showLegend"
      :show-grid-line="showGridLine"
      :rounded-corners="4"
      class="h-full"
    />
  </div>
</template>
