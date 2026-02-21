// middleware/auth.ts — Protect routes that require authentication
export default defineNuxtRouteMiddleware((to) => {
    // Skip middleware on server during prerender
    if (import.meta.server) return

    const { isAuthenticated } = useAuth()

    if (!isAuthenticated.value) {
        return navigateTo({
            path: '/auth/login',
            query: { redirect: to.fullPath !== '/' ? to.fullPath : undefined },
        })
    }
})
