<template>
  <!-- Liquid glass content card with shimmer, depth levels, optional CTA -->
  <div
    :class="[
      'liquid-glass rounded-2xl overflow-hidden pressable',
      depthClass,
    ]"
    v-motion
    :initial="{ opacity: 0, y: 12 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: index * 60, ease: 'easeOut' } }"
  >
    <!-- Header row -->
    <div v-if="title || icon" class="flex items-center justify-between px-5 pt-5 pb-3">
      <div class="flex items-center gap-3">
        <div v-if="icon" :class="['icon-well', iconWellColor]">
          <Icon :name="icon" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-headline font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
          <p v-if="subtitle" class="text-caption1 text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
        </div>
      </div>
      <slot name="header-right" />
    </div>

    <!-- Default slot -->
    <div :class="padded ? 'px-5 pb-5' : 'pb-0'">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  icon?: string
  iconColor?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan'
  depth?: 1 | 2 | 3
  padded?: boolean
  index?: number
}>(), {
  depth: 2,
  padded: true,
  iconColor: 'blue',
  index: 0,
})

const depthClass = computed(() => ({
  1: 'shadow-sm',
  2: 'shadow-glass',
  3: 'shadow-glass-lg',
}[props.depth]))

const iconWellColor = computed(() => `icon-well-${props.iconColor}`)
</script>
