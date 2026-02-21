// composables/useAppleTheme.ts
// System-aware dark/light theme with localStorage persistence.

import { usePreferredDark, useColorMode } from '@vueuse/core'
import type { UserPreferences } from '~/types'

type ThemePref = UserPreferences['theme']

const COLOR_MODE_KEY = 'enterprise-theme'

export function useAppleTheme() {
    const systemPrefersDark = usePreferredDark()
    const colorMode = useColorMode({
        storageKey: COLOR_MODE_KEY,
        attribute: 'class',
        modes: {
            light: 'light',
            dark: 'dark',
        },
    })

    // ── Computed states ────────────────────────────────────────────────────
    const isDark = computed(
        () =>
            colorMode.value === 'dark' ||
            (colorMode.value === 'auto' && systemPrefersDark.value),
    )

    const isLight = computed(() => !isDark.value)
    const isSystem = computed(() => colorMode.value === 'auto')

    const currentTheme = computed<ThemePref>(() => {
        if (colorMode.value === 'auto') return 'system'
        return colorMode.value as ThemePref
    })

    // ── Actions ────────────────────────────────────────────────────────────
    function setTheme(theme: ThemePref) {
        colorMode.value = theme === 'system' ? 'auto' : theme
        syncMetaThemeColor()
    }

    function toggleTheme() {
        setTheme(isDark.value ? 'light' : 'dark')
    }

    // ── iOS status bar colour sync ────────────────────────────────────────
    function syncMetaThemeColor() {
        if (!import.meta.client) return
        const meta = document.querySelector('meta[name="theme-color"]')
        if (meta) {
            meta.setAttribute('content', isDark.value ? '#0F172A' : '#F8FAFC')
        }
    }

    // ── Initialise ────────────────────────────────────────────────────────
    if (import.meta.client) {
        watch(isDark, syncMetaThemeColor, { immediate: true })
    }

    return {
        isDark,
        isLight,
        isSystem,
        currentTheme,
        setTheme,
        toggleTheme,
        colorMode,
    }
}
