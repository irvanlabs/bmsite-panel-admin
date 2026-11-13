import type { Updater } from '@tanstack/vue-table'
import type { ClassValue } from 'clsx'
import type { Ref } from 'vue'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}

export function idr(n: number): string {
  return 'Rp' + n.toLocaleString('id-ID')
}

// ponytail: single-purpose, no config, no class
export function rp(usd: number): string {
  const v = usd * 16_000
  if (v >= 1e9) return `Rp${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `Rp${(v / 1e6).toFixed(1)}M`
  if (v >= 1e3) return `Rp${(v / 1e3).toFixed(0)}K`
  return `Rp${v.toLocaleString('id-ID')}`
}
