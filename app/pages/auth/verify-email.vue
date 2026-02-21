<template>
  <div>
    <NuxtLayout name="auth">
      <!-- Loading -->
      <div v-if="status === 'verifying'" class="text-center py-8">
        <div class="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-5" />
        <h3 class="text-title3 font-bold text-slate-900 dark:text-white mb-1">Verifying your email…</h3>
        <p class="text-callout text-slate-500">This will just take a moment.</p>
      </div>

      <!-- Success -->
      <div
        v-else-if="status === 'success'"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 400 } }"
        class="text-center py-4"
      >
        <div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:mail-check" class="w-8 h-8 text-success" />
        </div>
        <h3 class="text-title3 font-bold text-slate-900 dark:text-white mb-2">Email Verified!</h3>
        <p class="text-callout text-slate-500 mb-6">
          Your email address has been verified. You can now use all features.
        </p>
        <GlassButton variant="primary" icon-right="lucide:arrow-right" @click="$router.push('/')">
          Go to Dashboard
        </GlassButton>
      </div>

      <!-- Error -->
      <div v-else class="text-center py-4">
        <div class="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:alert-triangle" class="w-8 h-8 text-danger" />
        </div>
        <h3 class="text-title3 font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h3>
        <p class="text-callout text-slate-500 mb-6">This link may have expired. Please request a new verification email.</p>
        <GlassButton variant="secondary" icon-left="lucide:send" @click="resend">
          Resend Verification Email
        </GlassButton>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const { verifyEmail } = useAuth()

type Status = 'verifying' | 'success' | 'error'
const status = ref<Status>('verifying')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) { status.value = 'error'; return }
  try {
    await verifyEmail(token)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
})

async function resend() {
  // In production: POST /api/auth/resend-verification
  await new Promise(r => setTimeout(r, 500))
}
</script>
