<script setup lang="ts" generic="T extends Record<string, any>">
import { LineChart } from '@/components/ui/chart-line'
import { CurveType } from '@unovis/ts'
import { defaultColors } from '@/components/ui/chart'

type KeyOf<T extends Record<string, any>> = Extract<keyof T, string>

withDefaults(defineProps<{
  data: T[]
  index: KeyOf<T>
  categories: KeyOf<T>[]
  colors?: string[]
  valueFormatter?: (v: number) => string
  showLegend?: boolean
  showGridLine?: boolean
}>(), {
  colors: () => defaultColors(2),
  showLegend: true,
  showGridLine: true,
})
</script>

<template>
  <LineChart
    :data="data"
    :index="index"
    :categories="categories"
    :colors="colors"
    :value-formatter="valueFormatter"
    :show-legend="showLegend"
    :show-grid-line="showGridLine"
    :curve-type="CurveType.MonotoneX"
  />
</template>
