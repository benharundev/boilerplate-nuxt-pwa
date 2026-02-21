<template>
  <div>
    <NuxtLayout name="auth">
      <div class="mb-8">
        <h2 class="text-title2 font-bold text-slate-900 dark:text-white">Create your workspace</h2>
        <p class="text-callout text-slate-500 mt-1">Start your 14-day free trial. No credit card required.</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSignup">
        <!-- Name + Org row -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
            <input v-model="form.name" type="text" required placeholder="Alex Johnson"
              class="w-full px-3 py-3 rounded-xl border border-[var(--color-border)] bg-white/50 dark:bg-slate-800/50
                     text-callout text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2
                     focus:ring-primary-500 placeholder:text-slate-400 transition-all" />
          </div>
          <div>
            <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company name</label>
            <input v-model="form.orgName" type="text" required placeholder="Acme Corp"
              class="w-full px-3 py-3 rounded-xl border border-[var(--color-border)] bg-white/50 dark:bg-slate-800/50
                     text-callout text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2
                     focus:ring-primary-500 placeholder:text-slate-400 transition-all" />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work email</label>
          <div class="relative">
            <Icon name="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input v-model="form.email" type="email" required placeholder="alex@company.com"
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-white/50 dark:bg-slate-800/50
                     text-callout text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2
                     focus:ring-primary-500 placeholder:text-slate-400 transition-all" />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input v-model="form.password" :type="showPw ? 'text' : 'password'" required placeholder="Min 8 characters"
              class="w-full pl-10 pr-12 py-3 rounded-xl border border-[var(--color-border)] bg-white/50 dark:bg-slate-800/50
                     text-callout text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2
                     focus:ring-primary-500 placeholder:text-slate-400 transition-all" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 touch-target text-slate-400" @click="showPw = !showPw">
              <Icon :name="showPw ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
            </button>
          </div>
          <!-- Strength indicators -->
          <div class="flex gap-1 mt-1.5">
            <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-colors"
              :class="strengthLevel >= i ? strengthColor : 'bg-slate-200 dark:bg-slate-700'" />
          </div>
        </div>

        <!-- Terms -->
        <label class="flex items-start gap-3 cursor-pointer">
          <input v-model="agreed" type="checkbox" required class="mt-0.5 w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" />
          <span class="text-caption1 text-slate-500">
            I agree to the
            <NuxtLink to="/terms" class="text-primary-600 hover:underline">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/privacy" class="text-primary-600 hover:underline">Privacy Policy</NuxtLink>
          </span>
        </label>

        <!-- Error -->
        <Transition name="fade">
          <p v-if="error" class="text-caption1 text-danger flex items-center gap-1.5">
            <Icon name="lucide:alert-circle" class="w-4 h-4" />{{ error }}
          </p>
        </Transition>

        <GlassButton type="submit" variant="primary" size="lg" :loading="isLoadingAuth" class="w-full justify-center">
          Create Account
        </GlassButton>
      </form>

      <p class="mt-6 text-center text-callout text-slate-500">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-primary-600 font-semibold hover:text-primary-700">Sign in</NuxtLink>
      </p>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['guest'], layout: false })

const { signup, isLoadingAuth } = useAuth()
const form = reactive({ name: '', orgName: '', email: '', password: '' })
const showPw = ref(false)
const agreed = ref(false)
const error = ref('')

const strengthLevel = computed(() => {
  const pw = form.password
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
})

const strengthColor = computed(() => {
  if (strengthLevel.value <= 1) return 'bg-danger'
  if (strengthLevel.value === 2) return 'bg-warning'
  if (strengthLevel.value === 3) return 'bg-info'
  return 'bg-success'
})

async function handleSignup() {
  error.value = ''
  try {
    await signup(form)
  } catch {
    error.value = 'Something went wrong. Please try again.'
  }
}
</script>
