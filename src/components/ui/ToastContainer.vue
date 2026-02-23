<script setup lang="ts">
import { useUiStore } from "@/stores/ui";
import type { Toast } from "@/types";

const uiStore = useUiStore();

const icons: Record<Toast["type"], string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const colorClasses: Record<Toast["type"], string> = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500/30 bg-red-500/10 text-red-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl',
            'bg-zinc-900/95',
            colorClasses[toast.type],
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5',
            ]"
          >
            {{ icons[toast.type] }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-zinc-100">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-zinc-400 mt-0.5">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close -->
          <button
            class="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
            @click="uiStore.removeToast(toast.id)"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
