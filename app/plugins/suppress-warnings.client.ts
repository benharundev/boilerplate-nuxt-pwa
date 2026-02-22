/**
 * Suppresses known benign Vue/Nuxt development warnings that have no
 * impact on functionality or production builds.
 *
 * - "<Suspense> is an experimental feature" — triggered by NuxtPage's
 *   internal use of <Suspense>; will resolve when Vue stabilises the API.
 */
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.warnHandler = (msg, _instance, trace) => {
        const suppress = [
            'Suspense is an experimental feature',
        ]

        if (suppress.some((pattern) => msg.includes(pattern))) return

        // Fall back to the default console warning for everything else
        console.warn(`[Vue warn]: ${msg}${trace}`)
    }
})
