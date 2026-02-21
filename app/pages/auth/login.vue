<template>
  <div>
    <NuxtLayout name="auth">
      <!-- Heading -->
      <div class="mb-8">
        <h2 class="text-title2 font-bold text-slate-900 dark:text-white">Welcome back</h2>
        <p class="text-callout text-slate-500 dark:text-slate-400 mt-1">Sign in to your workspace</p>
      </div>

      <!-- SSO buttons -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <GlassButton variant="outline" icon-left="lucide:chrome" class="justify-center">
          Google
        </GlassButton>
        <GlassButton variant="outline" icon-left="lucide:box" class="justify-center">
          Microsoft
        </GlassButton>
      </div>

      <!-- Divider -->
      <div class="relative mb-6">
        <div class="divider" />
        <span class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <span class="px-3 bg-white dark:bg-slate-900 text-caption1 text-slate-400">
            or continue with email
          </span>
        </span>
      </div>

      <!-- Login form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <!-- Email -->
        <div>
          <label class="block text-footnote font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email address
          </label>
          <div class="relative">
            <Icon name="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              placeholder="alex@company.com"
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)]
                     bg-white/50 dark:bg-slate-800/50 text-callout text-slate-800 dark:text-slate-200
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-footnote font-medium text-slate-700 dark:text-slate-300">Password</label>
            <NuxtLink to="/auth/forgot-password" class="text-caption1 text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </NuxtLink>
          </div>
          <div class="relative">
            <Icon name="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              placeholder="Enter your password"
              class="w-full pl-10 pr-12 py-3 rounded-xl border border-[var(--color-border)]
                     bg-white/50 dark:bg-slate-800/50 text-callout text-slate-800 dark:text-slate-200
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     placeholder:text-slate-400 transition-all"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 touch-target text-slate-400 hover:text-slate-600"
              @click="showPassword = !showPassword"
            >
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Error -->
        <Transition name="fade">
          <p v-if="error" class="text-caption1 text-danger flex items-center gap-1.5">
            <Icon name="lucide:alert-circle" class="w-4 h-4 flex-shrink-0" />
            {{ error }}
          </p>
        </Transition>

        <!-- Submit -->
        <GlassButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isLoadingAuth"
          class="w-full justify-center mt-2"
        >
          Sign In
        </GlassButton>
      </form>

      <!-- Sign up link -->
      <p class="mt-6 text-center text-callout text-slate-500">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary-600 font-semibold hover:text-primary-700">
          Create workspace
        </NuxtLink>
      </p>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['guest'], layout: false })

const { login, isLoadingAuth } = useAuth()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await login(form.email, form.password)
  }
  catch {
    error.value = 'Invalid email or password. Please try again.'
  }
}
</script>
