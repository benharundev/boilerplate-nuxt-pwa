<template>
  <!-- Onboarding step card — icon, title, description, with optional slot  -->
  <div
    v-motion
    :initial="{ opacity: 0, y: 24, scale: 0.97 }"
    :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 450, ease: 'easeOut' } }"
    class="liquid-glass rounded-3xl p-7 mb-6"
  >
    <!-- Step icon -->
    <div
      class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-fab"
      :class="iconBgClass"
    >
      <Icon :name="icon" class="w-8 h-8 text-white" />
    </div>

    <!-- Heading -->
    <div class="text-center mb-6">
      <h2 class="text-title2 font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        {{ title }}
      </h2>
      <p class="text-callout text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
        {{ description }}
      </p>
    </div>

    <!-- Default slot: form fields etc. -->
    <slot />
  </div>
</template>

<script setup lang="ts">
type IconColor = 'blue' | 'green' | 'purple' | 'amber' | 'cyan'

const props = withDefaults(defineProps<{
  title: string
  description: string
  icon: string
  iconColor?: IconColor
}>(), {
  iconColor: 'blue',
})

const ICON_BG: Record<IconColor, string> = {
  blue:   'bg-gradient-to-br from-primary-500 to-primary-700',
  green:  'bg-gradient-to-br from-emerald-400 to-emerald-600',
  purple: 'bg-gradient-to-br from-violet-500 to-violet-700',
  amber:  'bg-gradient-to-br from-amber-400 to-amber-600',
  cyan:   'bg-gradient-to-br from-cyan-400 to-cyan-600',
}

const iconBgClass = computed(() => ICON_BG[props.iconColor])
</script>
