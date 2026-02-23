<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { useAuthStore } from "@/stores/auth";
import { registerValidator } from "@/validators/AuthValidator";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const authStore = useAuthStore();
const router = useRouter();

const formRef = ref<HTMLElement | null>(null);
const email = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");

const errors = ref({
  email: null as string | null,
  username: null as string | null,
  password: null as string | null,
  confirmPassword: null as string | null,
});

function validateField(field: keyof typeof errors.value) {
  const val = {
    email: email.value,
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };
  if (field === "confirmPassword") {
    errors.value.confirmPassword = registerValidator.validatePasswords(
      password.value,
      confirmPassword.value
    );
  } else {
    errors.value[field] = registerValidator.validateField(field, val[field]);
  }
}

async function handleSubmit() {
  const payload = {
    email: email.value,
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };
  const result = registerValidator.validate(payload);
  const confirmErr = registerValidator.validatePasswords(
    password.value,
    confirmPassword.value
  );
  errors.value = {
    ...result,
    confirmPassword: confirmErr,
  } as typeof errors.value;

  const allValid = Object.values(errors.value).every((e) => e === null);
  if (!allValid) return;

  await authStore.register(payload);
  router.push({ name: "dashboard" });
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
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 mb-4"
        >
          <span class="text-2xl">🏁</span>
        </div>
        <h1 class="text-2xl font-bold text-zinc-100">Start your build</h1>
        <p class="text-zinc-500 mt-1 text-sm">
          Create your Car Build Tracker account
        </p>
      </div>

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
            v-model="username"
            label="Username"
            placeholder="BuilderZero"
            :error="errors.username"
            required
            @blur="validateField('username')"
          />
          <BaseInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            hint="At least 8 characters"
            required
            @blur="validateField('password')"
          />
          <BaseInput
            v-model="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            :error="errors.confirmPassword"
            required
            @blur="validateField('confirmPassword')"
          />

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
            Create account
          </BaseButton>
        </form>
      </div>

      <p class="text-center text-sm text-zinc-500 mt-6">
        Already have an account?
        <RouterLink
          to="/login"
          class="text-brand-blue hover:text-brand-blue-light transition-colors font-medium"
        >
          Sign in
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
