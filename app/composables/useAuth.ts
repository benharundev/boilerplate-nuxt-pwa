// composables/useAuth.ts
// Authentication state, session management, and role-based access control.

import type { User, UserRole, AuthSession, TenantMembership } from '~/types'
import { ROLE_HIERARCHY } from '~/types'

const AUTH_COOKIE_KEY = 'auth_session'

// ── Mock user for boilerplate demo ────────────────────────────────────────────
const MOCK_USER: User = {
    id: 'user_01',
    email: 'alex@acme.com',
    name: 'Alex Johnson',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=alex',
    role: 'tenant_owner',
    status: 'active',
    tenantId: 'tenant_01',
    lastActiveAt: new Date().toISOString(),
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: new Date().toISOString(),
    preferences: {
        theme: 'system',
        language: 'en',
        timezone: 'Asia/Kuala_Lumpur',
        compactMode: false,
        notifications: {
            email: true,
            push: true,
            inApp: true,
            digest: 'daily',
            categories: {
                billing: true,
                security: true,
                team: true,
                product_updates: true,
                marketing: false,
            },
        },
    },
    mfaEnabled: false,
    emailVerified: true,
}

// ── Module-level shared state ─────────────────────────────────────────────────
const user = ref<User | null>(MOCK_USER)
const isAuthenticated = ref(true)        // demo: pre-authenticated
const isLoadingAuth = ref(false)
const sessionId = ref<string | null>('demo_session_01')

export function useAuth() {
    const router = useRouter()
    const haptics = useHaptics()

    // ── Role checks ──────────────────────────────────────────────────────────
    function hasRole(required: UserRole): boolean {
        if (!user.value) return false
        return ROLE_HIERARCHY[user.value.role] >= ROLE_HIERARCHY[required]
    }

    function isRole(role: UserRole): boolean {
        return user.value?.role === role
    }

    const isSuperAdmin = computed(() => isRole('super_admin'))
    const isTenantOwner = computed(() => hasRole('tenant_owner'))
    const isTenantAdmin = computed(() => hasRole('tenant_admin'))
    const isMember = computed(() => hasRole('member'))

    // ── User display helpers ─────────────────────────────────────────────────
    const displayName = computed(() => user.value?.name ?? 'Unknown')
    const initials = computed(() => {
        const name = user.value?.name ?? ''
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    })
    const avatarUrl = computed(() => user.value?.avatarUrl)

    // ── Auth actions ──────────────────────────────────────────────────────────
    async function login(email: string, _password: string, tenantSlug?: string) {
        isLoadingAuth.value = true
        try {
            // In production: POST /api/auth/login
            await new Promise(r => setTimeout(r, 800))
            user.value = { ...MOCK_USER, email, tenantId: tenantSlug ?? 'tenant_01' }
            isAuthenticated.value = true
            sessionId.value = `session_${Date.now()}`
            haptics.success()
            await router.push('/')
        }
        catch (e) {
            haptics.error()
            throw e
        }
        finally {
            isLoadingAuth.value = false
        }
    }

    async function signup(data: {
        email: string
        name: string
        password: string
        orgName: string
    }) {
        isLoadingAuth.value = true
        try {
            // In production: POST /api/auth/signup
            await new Promise(r => setTimeout(r, 1000))
            user.value = { ...MOCK_USER, ...data }
            isAuthenticated.value = true
            haptics.success()
            await router.push('/onboarding')
        }
        finally {
            isLoadingAuth.value = false
        }
    }

    async function logout() {
        isLoadingAuth.value = true
        try {
            // In production: POST /api/auth/logout
            await new Promise(r => setTimeout(r, 300))
            user.value = null
            isAuthenticated.value = false
            sessionId.value = null
            haptics.light()
            await router.push('/auth/login')
        }
        finally {
            isLoadingAuth.value = false
        }
    }

    async function forgotPassword(email: string) {
        // In production: POST /api/auth/forgot-password
        await new Promise(r => setTimeout(r, 600))
        return { success: true, email }
    }

    async function resetPassword(token: string, password: string) {
        // In production: POST /api/auth/reset-password
        await new Promise(r => setTimeout(r, 700))
        return { success: true }
    }

    async function verifyEmail(token: string) {
        // In production: POST /api/auth/verify-email
        await new Promise(r => setTimeout(r, 500))
        if (user.value) user.value.emailVerified = true
        return { success: true }
    }

    async function updateProfile(data: Partial<User>) {
        if (!user.value) return
        // In production: PATCH /api/users/me
        await new Promise(r => setTimeout(r, 400))
        user.value = { ...user.value, ...data }
        haptics.success()
    }

    async function refreshSession() {
        if (!sessionId.value) return
        // In production: POST /api/auth/refresh
        isLoadingAuth.value = true
        try {
            await new Promise(r => setTimeout(r, 200))
        }
        finally {
            isLoadingAuth.value = false
        }
    }

    return {
        // State
        user: readonly(user),
        isAuthenticated: readonly(isAuthenticated),
        isLoadingAuth: readonly(isLoadingAuth),
        sessionId: readonly(sessionId),

        // Role flags
        isSuperAdmin,
        isTenantOwner,
        isTenantAdmin,
        isMember,

        // Role helpers
        hasRole,
        isRole,

        // Display
        displayName,
        initials,
        avatarUrl,

        // Actions
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateProfile,
        refreshSession,
    }
}
