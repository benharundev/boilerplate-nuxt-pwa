// ─────────────────────────────────────────────────────────────────────────────
// types/api.ts — API Response Shapes
// ─────────────────────────────────────────────────────────────────────────────

// ── Generic API Response ──────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
    data: T
    meta?: ApiMeta
    message?: string
}

export interface ApiError {
    statusCode: number
    error: string
    message: string
    details?: Record<string, string[]>
    requestId?: string
}

export interface ApiMeta {
    requestId: string
    version: string
    timestamp: string
    tenantId?: string
}

// ── Pagination ────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T = unknown> {
    data: T[]
    pagination: Pagination
    meta?: ApiMeta
}

export interface Pagination {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface PaginationQuery {
    page?: number
    perPage?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// ── Auth API ─────────────────────────────────────────────────────────────────
export interface LoginRequest {
    email: string
    password: string
    tenantSlug?: string
    rememberMe?: boolean
    mfaCode?: string
}

export interface SignupRequest {
    email: string
    password: string
    name: string
    orgName: string
    timezone?: string
    plan?: import('./index').PlanId
}

export interface ForgotPasswordRequest {
    email: string
    tenantSlug?: string
}

export interface ResetPasswordRequest {
    token: string
    password: string
    confirmPassword: string
}

// ── Tenant API ────────────────────────────────────────────────────────────────
export interface UpdateTenantRequest {
    name?: string
    timezone?: string
    dateFormat?: 'DMY' | 'MDY' | 'YMD'
    language?: string
    primaryColor?: string
    mfaRequired?: boolean
    allowedEmailDomains?: string[]
}

export interface InviteMembersRequest {
    emails: string[]
    role: import('./index').UserRole
    message?: string
}

// ── Billing API ───────────────────────────────────────────────────────────────
export interface ChangePlanRequest {
    planId: import('./index').PlanId
    interval: 'month' | 'year'
    prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice'
}

export interface UpdatePaymentMethodRequest {
    paymentMethodId: string  // Stripe PM ID
}

// ── SSE / Real-time ───────────────────────────────────────────────────────────
export interface RealtimeEvent<T = unknown> {
    id: string
    type: string
    payload: T
    tenantId: string
    timestamp: string
}
