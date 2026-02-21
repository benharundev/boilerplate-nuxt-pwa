<template>
  <!-- Multi-purpose glass button with 4 variants, 3 sizes, loading state -->
  <button
    class="inline-flex items-center justify-center gap-2 font-semibold
           select-none pressable focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-primary-500 focus-visible:ring-offset-2
           disabled:opacity-50 disabled:pointer-events-none"
    :class="[variantClass, sizeClass, roundedClass]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="flex-shrink-0">
      <svg class="animate-spin" :class="iconSizeClass" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </span>

    <!-- Leading icon -->
    <Icon v-else-if="iconLeft" :name="iconLeft" :class="iconSizeClass" />

    <!-- Label -->
    <span class="truncate">
      <slot />
    </span>

    <!-- Trailing icon -->
    <Icon v-if="iconRight && !loading" :name="iconRight" :class="iconSizeClass" />
  </button>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
type Size    = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  iconLeft?: string
  iconRight?: string
  loading?: boolean
  disabled?: boolean
  pill?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
})

defineOptions({ inheritAttrs: false })

const variantClass = computed(() => ({
  primary:     'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-fab hover:shadow-fab-hover',
  secondary:   'material-thin text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700/80',
  ghost:       'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  destructive: 'bg-danger hover:bg-red-600 active:bg-red-700 text-white shadow-md',
  outline:     'border border-[var(--color-border-strong)] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
}[props.variant]))

const sizeClass = computed(() => ({
  sm: 'text-caption1 px-3 py-1.5 min-h-[32px]',
  md: 'text-callout  px-4 py-2.5 min-h-[40px]',
  lg: 'text-body     px-5 py-3   min-h-[48px]',
  xl: 'text-headline px-7 py-4   min-h-[56px]',
}[props.size]))

const roundedClass = computed(() =>
  props.pill ? 'rounded-full' : 'rounded-xl',
)

const iconSizeClass = computed(() => ({
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-5 h-5',
}[props.size]))
</script>
