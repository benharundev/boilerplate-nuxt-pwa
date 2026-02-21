// plugins/pwa.client.ts — PWA install prompt + standalone detection
export default defineNuxtPlugin(() => {
    if (!import.meta.client) return

    // ── Standalone mode detection ──────────────────────────────────────────
    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true

    if (isStandalone) {
        document.documentElement.classList.add('pwa-standalone')
    }

    // ── Online/Offline class ───────────────────────────────────────────────
    const setOnlineClass = () => {
        document.documentElement.classList.toggle('offline', !navigator.onLine)
    }
    setOnlineClass()
    window.addEventListener('online', setOnlineClass)
    window.addEventListener('offline', setOnlineClass)

    // ── BeforeInstallPrompt (Android / Chrome) ─────────────────────────────
    let deferredPrompt: BeforeInstallPromptEvent | null = null

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e as BeforeInstallPromptEvent
    })

    // ── Service Worker update available toast ──────────────────────────────
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            // New SW activated — page will be refreshed by workbox autoUpdate
            console.info('[PWA] Service worker updated.')
        })
    }

    return {
        provide: {
            pwa: {
                isStandalone,
                showInstallPrompt: async () => {
                    if (!deferredPrompt) return false
                    deferredPrompt.prompt()
                    const { outcome } = await (deferredPrompt as BeforeInstallPromptEvent).userChoice
                    deferredPrompt = null
                    return outcome === 'accepted'
                },
            },
        },
    }
})

// Type augmentation for non-standard browser API
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
    prompt(): Promise<void>
}
