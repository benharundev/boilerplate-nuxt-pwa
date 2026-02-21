<template>
  <!-- Plan badge chip -->
  <span
    class="inline-flex items-center font-semibold rounded-full whitespace-nowrap"
    :class="[sizeClass, colorClass]"
  >
    <Icon v-if="showIcon" :name="icon" class="mr-1 flex-shrink-0" :class="iconSize" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { PlanId } from '~/types'

const props = defineProps<{
  plan: PlanId
  size?: 'xs' | 'sm' | 'md'
  showIcon?: boolean
}>()

const PLAN_CONFIG: Record<PlanId, { label: string; color: string; icon: string }> = {
  free:       { label: 'Free',       color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300', icon: 'lucide:sparkles' },
  starter:    { label: 'Starter',    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: 'lucide:rocket' },
  pro:        { label: 'Pro',        color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400', icon: 'lucide:zap' },
  enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: 'lucide:crown' },
}

const config = computed(() => PLAN_CONFIG[props.plan])
const label  = computed(() => config.value.label)
const icon   = computed(() => config.value.icon)
const colorClass = computed(() => config.value.color)

const sizeClass = computed(() => {
  const s = props.size ?? 'sm'
  return {
    xs: 'text-[10px] px-1.5 py-0',
    sm: 'text-caption2 px-2 py-0.5',
    md: 'text-footnote px-2.5 py-1',
  }[s]
})

const iconSize = computed(() => {
  return props.size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'
})
</script>
