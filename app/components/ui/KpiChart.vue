<template>
  <!--
    KpiChart — Flexible inline chart component.
    Supports line, area, and bar chart types with SVG rendering.
  -->
  <div class="flex flex-col gap-3">
    <!-- Optional header -->
    <div v-if="title" class="flex items-center justify-between">
      <div>
        <p class="text-callout font-semibold text-slate-800 dark:text-white">{{ title }}</p>
        <p v-if="subtitle" class="text-caption2 text-slate-400">{{ subtitle }}</p>
      </div>
      <slot name="header-right" />
    </div>

    <!-- SVG chart container -->
    <div :style="{ height: height + 'px' }">
      <svg
        class="w-full h-full overflow-visible"
        :viewBox="`0 0 ${viewW} ${viewH}`"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="color" :stop-opacity="type === 'area' ? 0.35 : 0" />
            <stop offset="100%" :stop-color="color" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        <g class="opacity-50">
          <line
            v-for="y in gridLines"
            :key="y"
            x1="0" :y1="y" :x2="viewW" :y2="y"
            stroke="currentColor"
            stroke-width="0.4"
            stroke-dasharray="3,3"
            class="text-slate-200 dark:text-slate-700"
          />
        </g>

        <!-- Area fill (for area chart) -->
        <path
          v-if="type !== 'bar'"
          :d="areaPath"
          :fill="`url(#${gradId})`"
        />

        <!-- Bars (for bar chart) -->
        <template v-if="type === 'bar'">
          <rect
            v-for="(bar, i) in bars"
            :key="i"
            :x="bar.x"
            :y="bar.y"
            :width="bar.w"
            :height="bar.h"
            :fill="color"
            :fill-opacity="0.8"
            rx="2"
            class="hover:fill-opacity-100 transition-all"
          />
        </template>

        <!-- Line -->
        <path
          v-if="type !== 'bar'"
          :d="linePath"
          :stroke="color"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Data point circles -->
        <circle
          v-for="(pt, i) in points"
          :key="`pt-${i}`"
          :cx="pt.x"
          :cy="pt.y"
          r="3"
          :fill="color"
          class="opacity-0 hover:opacity-100 transition-opacity"
        />
      </svg>
    </div>

    <!-- X-axis labels -->
    <div v-if="labels?.length" class="flex justify-between">
      <span
        v-for="(label, i) in displayLabels"
        :key="i"
        class="text-caption2 text-slate-400 tabular-nums"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
type ChartType = 'line' | 'area' | 'bar'

const props = withDefaults(defineProps<{
  data: number[]
  type?: ChartType
  color?: string
  height?: number
  title?: string
  subtitle?: string
  labels?: string[]
  gridCount?: number
}>(), {
  type: 'area',
  color: '#1C6EF2',
  height: 80,
  gridCount: 4,
})

const uid    = Math.random().toString(36).slice(2, 8)
const gradId = `kpi-grad-${uid}`
const viewW  = 200
const viewH  = 80
const padX   = 4
const padY   = 4

// ── Computed values ───────────────────────────────────────────────────────────
const minV = computed(() => Math.min(...props.data))
const maxV = computed(() => Math.max(...props.data))
const span = computed(() => maxV.value - minV.value || 1)

function toY(v: number) {
  return viewH - padY - ((v - minV.value) / span.value) * (viewH - padY * 2)
}
function toX(i: number) {
  return padX + (i / (props.data.length - 1)) * (viewW - padX * 2)
}

const points = computed(() =>
  props.data.map((v, i) => ({ x: toX(i), y: toY(v) })),
)

const linePath = computed(() => {
  if (points.value.length < 2) return ''
  return `M ${points.value.map(p => `${p.x},${p.y}`).join(' L ')}`
})

const areaPath = computed(() => {
  if (points.value.length < 2) return ''
  const lineCoords = points.value.map(p => `${p.x},${p.y}`).join(' L ')
  const last = points.value[points.value.length - 1]
  const first = points.value[0]
  return `M ${lineCoords} L ${last.x},${viewH} L ${first.x},${viewH} Z`
})

const bars = computed(() => {
  const count = props.data.length
  const totalW = viewW - padX * 2
  const barW   = totalW / count * 0.7
  const gap    = totalW / count * 0.3
  return props.data.map((v, i) => {
    const h = ((v - minV.value) / span.value) * (viewH - padY * 2)
    return {
      x: padX + i * (barW + gap),
      y: viewH - padY - h,
      w: barW,
      h: Math.max(h, 1),
    }
  })
})

const gridLines = computed(() => {
  return Array.from({ length: props.gridCount + 1 }, (_, i) =>
    padY + (i / props.gridCount) * (viewH - padY * 2),
  )
})

// Show at most 6 labels to avoid crowding
const displayLabels = computed(() => {
  if (!props.labels?.length) return []
  const step = Math.ceil(props.labels.length / 6)
  return props.labels.filter((_, i) => i % step === 0 || i === props.labels!.length - 1)
})
</script>
