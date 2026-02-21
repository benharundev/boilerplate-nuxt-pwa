// plugins/haptics.client.ts — Provide $haptics globally
import { useHaptics } from '~/composables/useHaptics'

export default defineNuxtPlugin(() => {
    const haptics = useHaptics()
    return {
        provide: { haptics },
    }
})
