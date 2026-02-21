// composables/useTenant.ts
// Multi-tenant context: resolves active tenant from subdomain/path/cookie.
// Works both server-side (via request headers) and client-side reactively.

import type { Tenant, TenantMembership, PlanId, User } from '~/types'

const TENANT_COOKIE_KEY = 'active_tenant_slug'

// ── Mock data for boilerplate demo ──────────────────────────────────────────
const MOCK_TENANT: Tenant = {
    id: 'tenant_01',
    slug: 'acme',
    name: 'Acme Corp',
    plan: 'pro',
    status: 'active',
    ownerId: 'user_01',
    seats: 25,
    usedSeats: 14,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2025-11-20T10:30:00Z',
    settings: {
        primaryColor: '#1C6EF2',
        timezone: 'Asia/Kuala_Lumpur',
        dateFormat: 'DMY',
        language: 'en',
        features: { analytics: true, api: true, customDomain: true },
        ssoEnabled: false,
        allowedEmailDomains: ['acme.com'],
        mfaRequired: false,
    },
}

const MOCK_MEMBERSHIPS: TenantMembership[] = [
    {
        tenant: MOCK_TENANT,
        role: 'tenant_owner',
        isPrimary: true,
    },
    {
        tenant: { ...MOCK_TENANT, id: 'tenant_02', slug: 'globex', name: 'Globex Inc', plan: 'starter' },
        role: 'member',
        isPrimary: false,
    },
]

// ── State ────────────────────────────────────────────────────────────────────
const tenant = ref<Tenant | null>(MOCK_TENANT)
const tenants = ref<TenantMembership[]>(MOCK_MEMBERSHIPS)
const isLoading = ref(false)
const error = ref<string | null>(null)

import type { RouteLocationNormalized } from 'vue-router'

export function useTenant(providedRoute?: RouteLocationNormalized) {
    const cookie = useCookie<string>(TENANT_COOKIE_KEY, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
        secure: true,
    })

    const route = providedRoute || useRoute()

    // ── Tenant resolution ────────────────────────────────────────────────────
    const tenantSlug = computed<string>(() => {
        // 1. Subdomain (production)
        if (import.meta.client) {
            const hostname = window.location.hostname
            const parts = hostname.split('.')
            // e.g. acme.myapp.com → parts = ['acme', 'myapp', 'com']
            if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'app') {
                return parts[0]
            }
        }

        // 2. Path segment (/t/acme/...)
        const pathSlug = route.params?.tenant as string
        if (pathSlug) return pathSlug

        // 3. Cookie (last selected)
        if (cookie.value) return cookie.value

        // 4. Default to first membership
        return tenant.value?.slug ?? ''
    })

    // ── Plan helpers ─────────────────────────────────────────────────────────
    const plan = computed<PlanId>(() => tenant.value?.plan ?? 'free')

    const isFree = computed(() => plan.value === 'free')
    const isStarter = computed(() => plan.value === 'starter')
    const isPro = computed(() => plan.value === 'pro')
    const isEnterprise = computed(() => plan.value === 'enterprise')

    function hasFeature(feature: string): boolean {
        return tenant.value?.settings.features?.[feature] === true
    }

    // ── Seat usage ───────────────────────────────────────────────────────────
    const seatPercentage = computed(() => {
        if (!tenant.value) return 0
        const { usedSeats, seats } = tenant.value
        if (!seats) return 0
        return Math.round((usedSeats / seats) * 100)
    })

    const seatStatus = computed<'ok' | 'warning' | 'critical'>(() => {
        const pct = seatPercentage.value
        if (pct >= 90) return 'critical'
        if (pct >= 75) return 'warning'
        return 'ok'
    })

    // ── Trial ────────────────────────────────────────────────────────────────
    const isOnTrial = computed(() => tenant.value?.status === 'trial')

    const trialDaysLeft = computed(() => {
        if (!tenant.value?.trialEndsAt) return 0
        const diff = new Date(tenant.value.trialEndsAt).getTime() - Date.now()
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    })

    // ── Actions ──────────────────────────────────────────────────────────────
    async function switchTenant(slug: string) {
        const membership = tenants.value.find(m => m.tenant.slug === slug)
        if (!membership) return

        isLoading.value = true
        try {
            // In production: POST /api/auth/switch-tenant { slug }
            await new Promise(r => setTimeout(r, 400)) // simulate API
            tenant.value = membership.tenant
            cookie.value = slug
            await navigateTo('/')
        }
        finally {
            isLoading.value = false
        }
    }

    async function refreshTenant() {
        if (!tenantSlug.value) return
        isLoading.value = true
        try {
            // In production: GET /api/tenants/me
            await new Promise(r => setTimeout(r, 300))
        }
        catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Failed to load tenant'
        }
        finally {
            isLoading.value = false
        }
    }

    return {
        // State
        tenant: readonly(tenant),
        tenants: readonly(tenants),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Resolved
        tenantSlug,
        plan,

        // Plan flags
        isFree,
        isStarter,
        isPro,
        isEnterprise,

        // Helpers
        hasFeature,
        seatPercentage,
        seatStatus,
        isOnTrial,
        trialDaysLeft,

        // Actions
        switchTenant,
        refreshTenant,
    }
}
