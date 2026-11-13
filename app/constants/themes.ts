export type ThemeColor = 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'yellow' | 'rose'
export type ThemeType = 'default' | 'mono' | 'scaled'

export const THEME_COLORS: { name: ThemeColor, value: string }[] = [
  { name: 'default', value: '#71717a' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'green', value: '#22c55e' },
  { name: 'orange', value: '#f97316' },
  { name: 'purple', value: '#a855f7' },
  { name: 'red', value: '#ef4444' },
  { name: 'teal', value: '#14b8a6' },
  { name: 'yellow', value: '#eab308' },
  { name: 'rose', value: '#f43f5e' },
]

export const THEME_TYPE: ThemeType[] = ['default', 'mono', 'scaled']
