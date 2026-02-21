// composables/useDeviceType.ts
// Reactive device-type detection based on Apple HIG breakpoints.
//   Mobile  : < 744px  (iPhone)
//   Tablet  : 744–1023px (iPad)
//   Desktop : ≥ 1024px

import { useWindowSize, useMediaQuery } from '@vueuse/core'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type Orientation = 'portrait' | 'landscape'

export function useDeviceType() {
    const { width, height } = useWindowSize()

    // ── Breakpoint checks ──────────────────────────────────────────────────
    const isMobile = computed(() => width.value < 744)
    const isTablet = computed(() => width.value >= 744 && width.value < 1024)
    const isDesktop = computed(() => width.value >= 1024)

    // ── Extended desktop sizes ─────────────────────────────────────────────
    const isWide = computed(() => width.value >= 1280)
    const isUltraWide = computed(() => width.value >= 1440)

    // ── Orientation ────────────────────────────────────────────────────────
    const orientation = computed<Orientation>(() =>
        width.value >= height.value ? 'landscape' : 'portrait',
    )

    const isLandscape = computed(() => orientation.value === 'landscape')
    const isPortrait = computed(() => orientation.value === 'portrait')

    // ── iPad-specific: landscape tablet = show sidebar ────────────────────
    const isTabletLandscape = computed(() => isTablet.value && isLandscape.value)
    const isTabletPortrait = computed(() => isTablet.value && isPortrait.value)

    // ── Derived device type ────────────────────────────────────────────────
    const deviceType = computed<DeviceType>(() => {
        if (isDesktop.value) return 'desktop'
        if (isTablet.value) return 'tablet'
        return 'mobile'
    })

    // ── Touch device detection ────────────────────────────────────────────
    const isTouch = useMediaQuery('(pointer: coarse)')
    const hasHover = useMediaQuery('(hover: hover)')
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

    // ── PWA standalone mode ───────────────────────────────────────────────
    const isStandalone = computed(() => {
        if (!import.meta.client) return false
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            (navigator as unknown as { standalone?: boolean }).standalone === true
        )
    })

    return {
        // Raw dimensions
        width,
        height,

        // Breakpoint flags
        isMobile,
        isTablet,
        isDesktop,
        isWide,
        isUltraWide,

        // Orientation
        orientation,
        isLandscape,
        isPortrait,
        isTabletLandscape,
        isTabletPortrait,

        // Derived
        deviceType,

        // Capabilities
        isTouch,
        hasHover,
        prefersReducedMotion,
        isStandalone,
    }
}
