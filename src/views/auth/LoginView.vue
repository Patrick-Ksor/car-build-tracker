<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";
import { useAuthStore } from "@/stores/auth";
import { loginValidator } from "@/validators/AuthValidator";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const formRef = ref<HTMLElement | null>(null);
const email = ref("");
const password = ref("");
const errors = ref({
  email: null as string | null,
  password: null as string | null,
});

function validateField(field: "email" | "password") {
  errors.value[field] = loginValidator.validateField(
    field,
    field === "email" ? email.value : password.value
  );
}

async function handleSubmit() {
  const result = loginValidator.validate({
    email: email.value,
    password: password.value,
  });
  errors.value = result as typeof errors.value;
  if (!loginValidator.isValid({ email: email.value, password: password.value }))
    return;

  await authStore.login({ email: email.value, password: password.value });
  const redirect = route.query.redirect as string | undefined;
  router.push(redirect ?? { name: "dashboard" });
}

onMounted(() => {
  if (formRef.value) {
    gsap.from(formRef.value, {
      opacity: 0,
      y: 32,
      duration: 0.5,
      ease: "power3.out",
      clearProps: "all",
    });
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-zinc-950 bg-hero-mesh flex items-center justify-center p-4"
  >
    <div ref="formRef" class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 mb-4"
        >
          <span class="text-2xl">🚗</span>
        </div>
        <h1 class="text-2xl font-bold text-zinc-100">Welcome back</h1>
        <p class="text-zinc-500 mt-1 text-sm">
          Sign in to your Build Tracker account
        </p>
      </div>

      <!-- Form card -->
      <div class="card p-6 space-y-4">
        <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
          <BaseInput
            v-model="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            :error="errors.email"
            required
            @blur="validateField('email')"
          />

          <BaseInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            required
            @blur="validateField('password')"
          />

          <!-- Error banner -->
          <Transition name="error-slide">
            <div
              v-if="authStore.error"
              class="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
            >
              {{ authStore.error }}
            </div>
          </Transition>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.isLoading"
            class="w-full"
          >
            Sign in
          </BaseButton>
        </form>

        <!-- Mock hint -->
        <p
          v-if="true"
          class="text-center text-xs text-zinc-600 pt-2 border-t border-zinc-800"
        >
          🔧 Mock mode — any credentials work
        </p>
      </div>

      <!-- Register link -->
      <p class="text-center text-sm text-zinc-500 mt-6">
        Don't have an account?
        <RouterLink
          to="/register"
          class="text-brand-blue hover:text-brand-blue-light transition-colors font-medium"
        >
          Create one
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.2s ease;
}
.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
