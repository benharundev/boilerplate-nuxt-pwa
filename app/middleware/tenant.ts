// middleware/tenant.ts — Resolve and validate tenant from subdomain/path
import type { UserRole } from '~/types'

export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) return

    const { tenant, tenantSlug } = useTenant(to)
    const { hasRole } = useAuth()

    // ── Admin route guard ─────────────────────────────────────────────────
    if (to.path.startsWith('/admin')) {
        if (!hasRole('super_admin')) {
            return navigateTo('/')
        }
    }

    // ── Settings: tenant_admin minimum ───────────────────────────────────
    if (to.path.startsWith('/settings/billing')) {
        if (!hasRole('tenant_owner')) {
            return navigateTo('/settings')
        }
    }

    // ── Tenant must be active ─────────────────────────────────────────────
    if (tenant.value && tenant.value.status === 'suspended') {
        if (!to.path.startsWith('/suspended')) {
            return navigateTo('/suspended')
        }
    }
})
