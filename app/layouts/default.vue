<template>
  <div class="h-full w-full">
    <!-- Adaptive layout: renders correct layout per device type -->
    <DesktopLayout v-if="isDesktop">
      <slot />
    </DesktopLayout>

    <TabletLayout v-else-if="isTablet">
      <slot />
    </TabletLayout>

    <MobileLayout v-else>
      <slot />
    </MobileLayout>
  </div>
</template>

<script setup lang="ts">
const { isDesktop, isTablet } = useDeviceType()
</script>
