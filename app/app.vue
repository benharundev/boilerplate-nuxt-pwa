<template>
  <div id="app">
    <!-- Swipe-back progress strip (mobile only) -->
    <div
      v-if="isMobile && swipeProgress > 0"
      class="fixed top-0 left-0 h-0.5 bg-primary-600 z-[500] transition-all"
      :style="{ width: `${swipeProgress * 100}%` }"
    />

    <!-- Page transitions with layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- PWA offline toast -->
    <Transition name="pop">
      <div
        v-if="isOffline"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-toast px-5 py-3 rounded-xl
               material-thick shadow-glass-lg flex items-center gap-3 text-sm font-medium"
      >
        <span class="w-2 h-2 rounded-full bg-danger animate-pulse-slow" />
        You're offline — working from cache
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { isDark } = useAppleTheme()
const { isMobile } = useDeviceType()
const { swipeProgress, attach, detach } = useSwipeBack()

// ── Online/offline detection ────────────────────────────────────────────────
const isOffline = ref(false)

if (import.meta.client) {
  isOffline.value = !navigator.onLine
  window.addEventListener('offline', () => { isOffline.value = true })
  window.addEventListener('online',  () => { isOffline.value = false })
}

// ── Attach swipe-back to root on mobile ─────────────────────────────────────
const appRoot = ref<HTMLElement | null>(null)

onMounted(() => {
  appRoot.value = document.getElementById('app')
  if (isMobile.value) attach(appRoot.value)
})

onUnmounted(() => {
  detach(appRoot.value)
})

watch(isMobile, (val) => {
  val ? attach(appRoot.value) : detach(appRoot.value)
})

// ── Head defaults ────────────────────────────────────────────────────────────
useHead({
  htmlAttrs: { lang: 'en' }
})
</script>
