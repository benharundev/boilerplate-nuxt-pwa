// composables/useSwipeBack.ts
// Left-edge swipe gesture → router.go(-1) with progress strip feedback.
// Mirrors iOS interactive back navigation.

interface SwipeBackOptions {
    edgeThreshold?: number   // px from left edge to start listening
    minSwipeDistance?: number
    enableHaptic?: boolean
}

export function useSwipeBack(options: SwipeBackOptions = {}) {
    const {
        edgeThreshold = 24,
        minSwipeDistance = 80,
        enableHaptic = true,
    } = options

    const router = useRouter()
    const haptics = useHaptics()

    const isSwipingBack = ref(false)
    const swipeProgress = ref(0)   // 0–1, used for the swipe strip width

    let startX = 0
    let startY = 0
    let startedFromEdge = false

    function onTouchStart(e: Event) {
        const evt = e as TouchEvent
        const touch = evt.touches[0]
        startX = touch!.clientX
        startY = touch!.clientY
        startedFromEdge = startX < edgeThreshold
        isSwipingBack.value = false
        swipeProgress.value = 0
    }

    function onTouchMove(e: Event) {
        if (!startedFromEdge) return
        const evt = e as TouchEvent
        const touch = evt.touches[0]
        const dx = touch!.clientX - startX
        const dy = touch!.clientY - startY

        // Only treat as horizontal swipe if horizontal dominates
        if (Math.abs(dx) < Math.abs(dy)) {
            startedFromEdge = false
            return
        }

        if (dx > 8) {
            isSwipingBack.value = true
            swipeProgress.value = Math.min(dx / 200, 1)
            // Prevent page scroll
            evt.preventDefault()
        }
    }

    function onTouchEnd(e: Event) {
        if (!startedFromEdge || !isSwipingBack.value) {
            reset()
            return
        }

        const evt = e as TouchEvent
        const touch = evt.changedTouches[0]
        const dx = touch!.clientX - startX

        if (dx >= minSwipeDistance) {
            if (enableHaptic) haptics.light()
            router.go(-1)
        }

        reset()
    }

    function reset() {
        isSwipingBack.value = false
        swipeProgress.value = 0
        startedFromEdge = false
    }

    function attach(el: HTMLElement | null) {
        if (!el || !import.meta.client) return
        el.addEventListener('touchstart', onTouchStart, { passive: true })
        el.addEventListener('touchmove', onTouchMove, { passive: false })
        el.addEventListener('touchend', onTouchEnd, { passive: true })
    }

    function detach(el: HTMLElement | null) {
        if (!el) return
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchmove', onTouchMove)
        el.removeEventListener('touchend', onTouchEnd)
    }

    return {
        isSwipingBack: readonly(isSwipingBack),
        swipeProgress: readonly(swipeProgress),
        attach,
        detach,
    }
}
