<template>
  <div class="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950 gradient-mesh overflow-hidden">
    <!-- Full-screen onboarding layout with step indicator and animated bg -->
    <!-- Top progress bar -->
    <div class="h-1 bg-slate-200 dark:bg-slate-800">
      <div
        class="h-full bg-primary-600 transition-all duration-500 ease-decelerate"
        :style="{ width: `${progressPct}%` }"
      />
    </div>

    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-5">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
          <Icon name="lucide:zap" class="w-5 h-5 text-white" />
        </div>
        <span class="text-headline font-bold text-slate-900 dark:text-white">Enterprise</span>
      </div>

      <!-- Step counter -->
      <div class="text-callout text-slate-500 dark:text-slate-400 font-medium">
        Step {{ currentStep }} of {{ totalSteps }}
      </div>
    </header>

    <!-- Step bubbles -->
    <div class="flex items-center justify-center gap-2 py-2">
      <div
        v-for="step in totalSteps"
        :key="step"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="[
          step === currentStep
            ? 'w-6 bg-primary-600'
            : step < currentStep
              ? 'w-3 bg-primary-400'
              : 'w-3 bg-slate-200 dark:bg-slate-700',
        ]"
      />
    </div>

    <!-- Page content -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      <div class="w-full max-w-lg">
        <slot />
      </div>
    </main>

    <!-- Skip / help -->
    <div class="flex items-center justify-between px-6 py-5 text-footnote text-slate-400">
      <button class="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
        Need help?
      </button>
      <NuxtLink
        to="/"
        class="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      >
        Skip setup →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const totalSteps = 4

const currentStep = computed(() => {
  const map: Record<string, number> = {
    '/onboarding':           1,
    '/onboarding/workspace': 2,
    '/onboarding/invite':    3,
    '/onboarding/plan':      4,
  }
  return map[route.path] ?? 1
})

const progressPct = computed(() => (currentStep.value / totalSteps) * 100)
</script>
