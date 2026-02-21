<template>
  <!-- KPI / Metric stat card with trend indicator and sparkline -->
  <div
    v-motion
    :initial="{ opacity: 0, y: 16 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: (props.index || 0) * 80, ease: 'easeOut' } }"
    class="liquid-glass rounded-2xl p-5 pressable cursor-default"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div :class="['icon-well', iconWellColor]">
        <Icon :name="icon" class="w-5 h-5" />
      </div>
      <!-- Delta badge -->
      <span
        class="inline-flex items-center gap-1 text-caption1 font-semibold px-2 py-1 rounded-full"
        :class="deltaClass"
      >
        <Icon :name="trend === 'up' ? 'lucide:trending-up' : trend === 'down' ? 'lucide:trending-down' : 'lucide:minus'" class="w-3 h-3" />
        {{ Math.abs(delta) }}%
      </span>
    </div>

    <!-- Value -->
    <div class="mb-1">
      <p class="text-large-title font-extrabold text-slate-900 dark:text-white tabular-nums leading-none">
        {{ formattedValue }}
      </p>
    </div>

    <!-- Label -->
    <p class="text-footnote text-slate-500 dark:text-slate-400 font-medium mb-3">{{ label }}</p>

    <!-- Sparkline -->
    <div v-if="sparkline?.length" class="h-10">
      <svg class="w-full h-full" viewBox="0 0 80 40" preserveAspectRatio="none">
        <defs>
          <linearGradient :id="`grad-${uid}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="sparklineColor" stop-opacity="0.3" />
            <stop offset="100%" :stop-color="sparklineColor" stop-opacity="0" />
          </linearGradient>
        </defs>
        <!-- Area fill -->
        <path :d="areaPath" :fill="`url(#grad-${uid})`" />
        <!-- Line -->
        <path :d="linePath" :stroke="sparklineColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Comparison -->
    <p class="text-caption2 text-slate-400 dark:text-slate-500 mt-2">
      vs {{ previousFormatted }} prev. period
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Metric } from '~/types'

const props = defineProps<Metric & {
  label: string
  icon: string
  iconColor?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan'
  index?: number
}>()

const uid = Math.random().toString(36).slice(2, 8)

const iconWellColor = computed(() => `icon-well-${props.iconColor ?? 'blue'}`)

const trend = computed(() => props.trend)

const deltaClass = computed(() => {
  if (trend.value === 'flat') return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
  if (trend.value === 'up')   return 'bg-success-light text-success dark:bg-green-900/30 dark:text-green-400'
  return 'bg-danger-light text-danger dark:bg-red-900/30 dark:text-red-400'
})

const sparklineColor = computed(() => {
  if (trend.value === 'up')   return '#10B981'
  if (trend.value === 'down') return '#EF4444'
  return '#94A3B8'
})

function formatValue(v: number, format?: string): string {
  if (format === 'currency') return `$${(v / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
  if (format === 'percent')  return `${v}%`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}k`
  return v.toLocaleString()
}

const formattedValue  = computed(() => formatValue(props.value,    props.format) + (props.unit && props.format !== 'currency' ? props.unit : ''))
const previousFormatted = computed(() => formatValue(props.previous, props.format))

// ── SVG Sparkline Paths ─────────────────────────────────────────────────────
const linePath = computed(() => {
  const data = props.sparkline ?? []
  if (data.length < 2) return ''
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const W = 80, H = 36, pad = 2
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - min) / range) * (H - pad * 2)
    return `${x},${y}`
  })
  return `M ${points.join(' L ')}`
})

const areaPath = computed(() => {
  const data = props.sparkline ?? []
  if (data.length < 2) return ''
  const min = data.length ? Math.min(...data) : 0
  const max = data.length ? Math.max(...data) : 1
  const range = max - min || 1
  const W = 80, H = 36, pad = 2
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - min) / range) * (H - pad * 2)
    return `${x},${y}`
  })
  return `M ${points.join(' L ')} L ${80 - pad},${H} L ${pad},${H} Z`
})
</script>
