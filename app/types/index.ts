// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts — Core SaaS Domain Types
// ─────────────────────────────────────────────────────────────────────────────

// ── Roles ─────────────────────────────────────────────────────────────────────
export type UserRole =
    | 'super_admin'   // Platform-level: access to /admin/**
    | 'tenant_owner'  // Full control of their tenant, billing
    | 'tenant_admin'  // Admin without billing access
    | 'member'        // Standard member: dashboard + profile
    | 'viewer'        // Read-only access

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    super_admin: 100,
    tenant_owner: 80,
    tenant_admin: 60,
    member: 40,
    viewer: 20,
}

// ── Plan ──────────────────────────────────────────────────────────────────────
export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise'

export interface Plan {
    id: PlanId
    name: string
    monthlyPrice: number   // cents
    annualPrice: number    // cents
    seats: number | null   // null = unlimited
    features: PlanFeature[]
    limits: PlanLimits
    color: string          // tailwind color class
    badge: string          // display label
    isPopular?: boolean
}

export interface PlanFeature {
    key: string
    label: string
    included: boolean
    limit?: number         // e.g. 5 workspaces
}

export interface PlanLimits {
    seats: number | null
    storage: number        // MB
    apiCalls: number       // per month
    projects: number | null
    customDomains: number
    auditLogDays: number | null
}

// ── Tenant ────────────────────────────────────────────────────────────────────
export type TenantStatus = 'active' | 'suspended' | 'trial' | 'churned'

export interface Tenant {
    id: string
    slug: string           // subdomain slug, e.g. "acme"
    name: string
    domain?: string        // custom domain
    logoUrl?: string
    logoUrlDark?: string
    plan: PlanId
    status: TenantStatus
    ownerId: string
    seats: number
    usedSeats: number
    trialEndsAt?: string   // ISO 8601
    createdAt: string
    updatedAt: string
    settings: TenantSettings
    billing?: TenantBilling
}

export interface TenantSettings {
    primaryColor: string
    timezone: string
    dateFormat: 'DMY' | 'MDY' | 'YMD'
    language: string
    features: Partial<Record<string, boolean>>
    ssoEnabled: boolean
    ssoProvider?: 'google' | 'microsoft' | 'okta' | 'saml'
    allowedEmailDomains: string[]
    mfaRequired: boolean
}

export interface TenantBilling {
    stripeCustomerId: string
    stripeSubscriptionId: string
    interval: 'month' | 'year'
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
    paymentMethod?: PaymentMethod
    invoices: Invoice[]
}

export interface PaymentMethod {
    brand: string
    last4: string
    expMonth: number
    expYear: number
    isDefault: boolean
}

export interface Invoice {
    id: string
    number: string
    amount: number         // cents
    currency: string
    status: 'paid' | 'open' | 'void' | 'uncollectible'
    createdAt: string
    paidAt?: string
    hostedUrl?: string
    pdfUrl?: string
}

// ── User ──────────────────────────────────────────────────────────────────────
export type UserStatus = 'active' | 'invited' | 'suspended' | 'deactivated'

export interface User {
    id: string
    email: string
    name: string
    avatarUrl?: string
    role: UserRole
    status: UserStatus
    tenantId: string
    lastActiveAt?: string
    createdAt: string
    updatedAt: string
    preferences: UserPreferences
    mfaEnabled: boolean
    emailVerified: boolean
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    notifications: NotificationPreferences
    compactMode: boolean
}

export interface NotificationPreferences {
    email: boolean
    push: boolean
    inApp: boolean
    digest: 'realtime' | 'daily' | 'weekly' | 'off'
    categories: Partial<Record<NotificationCategory, boolean>>
}

export type NotificationCategory =
    | 'billing'
    | 'security'
    | 'team'
    | 'product_updates'
    | 'marketing'

// ── Team ─────────────────────────────────────────────────────────────────────
export interface TeamMember {
    userId: string
    user: User
    role: UserRole
    joinedAt: string
    invitedBy?: string
}

export interface Invitation {
    id: string
    email: string
    role: UserRole
    tenantId: string
    invitedBy: User
    token: string
    expiresAt: string
    acceptedAt?: string
    status: 'pending' | 'accepted' | 'expired' | 'revoked'
}

// ── API Key ───────────────────────────────────────────────────────────────────
export interface ApiKey {
    id: string
    name: string
    prefix: string         // first 8 chars, e.g. "ek_live_"
    scopes: string[]
    expiresAt?: string
    lastUsedAt?: string
    createdAt: string
    createdBy: User
    revoked: boolean
}

// ── Webhook ───────────────────────────────────────────────────────────────────
export interface Webhook {
    id: string
    url: string
    events: WebhookEvent[]
    secret: string         // masked
    active: boolean
    createdAt: string
    deliveries: WebhookDelivery[]
}

export type WebhookEvent =
    | 'user.created'
    | 'user.updated'
    | 'user.deleted'
    | 'team.member.added'
    | 'team.member.removed'
    | 'subscription.updated'
    | 'invoice.paid'
    | 'invoice.failed'

export interface WebhookDelivery {
    id: string
    event: WebhookEvent
    status: 'success' | 'failed' | 'pending'
    statusCode: number
    duration: number       // ms
    createdAt: string
}

// ── Audit Log ─────────────────────────────────────────────────────────────────
export interface AuditLogEntry {
    id: string
    action: string         // e.g. "user.role.changed"
    actor: { id: string; name: string; email: string }
    target?: { type: string; id: string; label: string }
    metadata: Record<string, unknown>
    ipAddress: string
    userAgent: string
    createdAt: string
}

// ── Auth Session ──────────────────────────────────────────────────────────────
export interface AuthSession {
    user: User
    tenant: Tenant
    accessToken: string
    refreshToken: string
    expiresAt: string
    sessionId: string
    tenants: TenantMembership[]
}

export interface TenantMembership {
    tenant: Tenant
    role: UserRole
    isPrimary: boolean
}

// ── SaaS Metrics ─────────────────────────────────────────────────────────────
export interface DashboardMetrics {
    mrr: Metric
    activeUsers: Metric
    churnRate: Metric
    supportTickets: Metric
    nps: Metric
    apiUsage: Metric
}

export interface Metric {
    value: number
    previous: number
    delta: number          // percentage change
    trend: 'up' | 'down' | 'flat'
    sparkline: number[]    // last 7 data points
    unit?: string          // '$', '%', 'k', etc.
    format?: 'currency' | 'percent' | 'number' | 'integer'
}

export interface RevenueDataPoint {
    date: string
    mrr: number
    arr: number
    newRevenue: number
    churn: number
}

export interface ActivityEvent {
    id: string
    type: 'signup' | 'upgrade' | 'downgrade' | 'churn' | 'payment' | 'ticket' | 'login'
    user: { name: string; email: string; avatarUrl?: string }
    tenant: { name: string; slug: string }
    description: string
    amount?: number
    createdAt: string
}

// ── Integration ───────────────────────────────────────────────────────────────
export interface Integration {
    id: string
    name: string
    slug: string
    description: string
    logoUrl: string
    category: IntegrationCategory
    connected: boolean
    connectedAt?: string
    status?: 'healthy' | 'error' | 'syncing'
}

export type IntegrationCategory =
    | 'crm'
    | 'analytics'
    | 'communication'
    | 'payment'
    | 'storage'
    | 'devtools'
    | 'sso'

// ── Navigation ────────────────────────────────────────────────────────────────
export interface NavItem {
    label: string
    icon: string           // lucide icon name
    to: string
    badge?: string | number
    badgeColor?: 'blue' | 'green' | 'amber' | 'red'
    requiredRole?: UserRole
    children?: NavItem[]
    isExternal?: boolean
}

// ── Onboarding ────────────────────────────────────────────────────────────────
export interface OnboardingState {
    step: 1 | 2 | 3 | 4
    orgName: string
    timezone: string
    logoFile?: File
    invites: string[]
    selectedPlan: PlanId
    billingInterval: 'month' | 'year'
    completed: boolean
}
