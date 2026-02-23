import { defineStore } from "pinia";
import { ref, computed, shallowRef, markRaw } from "vue";
import { services } from "@/services/factory/serviceFactory";
import type { User } from "@/models";
import type { LoginPayload, RegisterPayload } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  // ---- State ----
  // shallowRef prevents Vue from deep-proxying the User class instance,
  // preserving prototype methods and avoiding silent instanceof breaks.
  const user = shallowRef<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ---- Getters ----
  const isAuthenticated = computed(() => user.value !== null);
  const displayName = computed(() => user.value?.displayName ?? "");
  const initials = computed(() => user.value?.initials ?? "?");

  // ---- Actions ----
  async function login(payload: LoginPayload): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.auth.login(payload);
      user.value = markRaw(result);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Login failed";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(payload: RegisterPayload): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.auth.register(payload);
      user.value = markRaw(result);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Registration failed";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<void> {
    try {
      await services.auth.logout();
    } finally {
      user.value = null;
    }
  }

  async function fetchMe(): Promise<void> {
    try {
      const result = await services.auth.getMe();
      user.value = markRaw(result);
    } catch {
      // Not authenticated — stay as null; don't throw (called on app boot)
      user.value = null;
    }
  }

  function clearError(): void {
    error.value = null;
  }

  // Listen for the 401 event emitted by BaseApiService
  if (typeof window !== "undefined") {
    window.addEventListener("auth:expired", () => {
      user.value = null;
    });
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    displayName,
    initials,
    login,
    register,
    logout,
    fetchMe,
    clearError,
  };
});
