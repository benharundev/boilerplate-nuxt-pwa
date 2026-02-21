<template>
  <div
    class="min-h-dvh flex flex-col items-center justify-center
           bg-slate-50 dark:bg-slate-950
           gradient-mesh px-4 py-12"
  >
    <!-- Full-screen auth layout — centred card on frosted glass gradient bg -->
    <!-- Logo + brand -->
    <div
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }"
      class="mb-8 flex flex-col items-center gap-3"
    >
      <div class="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-fab">
        <Icon name="lucide:zap" class="w-8 h-8 text-white" />
      </div>
      <div class="text-center">
        <h1 class="text-title2 font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enterprise
        </h1>
        <p class="text-footnote text-slate-500 dark:text-slate-400">
          Powered by BenHarun IT Solutions
        </p>
      </div>
    </div>

    <!-- Auth card -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 24, scale: 0.97 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 500, delay: 100, ease: 'easeOut' } }"
      class="w-full max-w-md"
    >
      <div class="liquid-glass rounded-3xl p-8 shadow-glass-lg">
        <slot />
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center text-caption1 text-slate-400 dark:text-slate-600">
      <p>© {{ year }} BenHarun IT Solutions & Innovation. All rights reserved.</p>
      <div class="flex items-center justify-center gap-4 mt-2">
        <NuxtLink to="/privacy" class="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          Privacy
        </NuxtLink>
        <span>·</span>
        <NuxtLink to="/terms" class="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          Terms
        </NuxtLink>
        <span>·</span>
        <NuxtLink to="/security" class="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          Security
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
