// composables/useHaptics.ts
// Maps Web Vibration API to Apple UIImpactFeedbackGenerator patterns.
// Gracefully degrades on unsupported platforms.

type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type HapticNotification = 'success' | 'warning' | 'error'

// Vibration durations (ms) matching Apple haptic feel
const PATTERNS: Record<HapticStyle, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 40,
    rigid: [10, 10, 10],
    soft: [5, 5],
}

const NOTIFICATIONS: Record<HapticNotification, number[]> = {
    success: [10, 50, 10],
    warning: [20, 30, 20],
    error: [40, 30, 40, 30, 40],
}

function vibrate(pattern: number | number[]) {
    if (!import.meta.client) return
    if (!('vibrate' in navigator)) return
    try {
        navigator.vibrate(pattern)
    }
    catch {
        // Silently ignore — some browsers throw on non-touch devices
    }
}

export function useHaptics() {
    function impact(style: HapticStyle = 'medium') {
        vibrate(PATTERNS[style])
    }

    function notification(type: HapticNotification) {
        vibrate(NOTIFICATIONS[type])
    }

    const light = () => impact('light')
    const medium = () => impact('medium')
    const heavy = () => impact('heavy')
    const rigid = () => impact('rigid')
    const soft = () => impact('soft')
    const success = () => notification('success')
    const warning = () => notification('warning')
    const error = () => notification('error')

    // Selection feedback (used on list item taps)
    const selection = () => vibrate(8)

    return {
        impact,
        notification,
        light,
        medium,
        heavy,
        rigid,
        soft,
        success,
        warning,
        error,
        selection,
    }
}
