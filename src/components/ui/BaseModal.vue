<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { PageTransitionAnimation } from "@/animation/PageTransitionAnimation";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
    closable?: boolean;
  }>(),
  {
    size: "md",
    closable: true,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

function close() {
  if (props.closable) {
    emit("update:modelValue", false);
    emit("close");
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};
</script>

<template>
  <Teleport to="body">
    <Transition
      :css="false"
      @enter="PageTransitionAnimation.fadeEnter"
      @leave="PageTransitionAnimation.fadeLeave"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="close"
        />

        <!-- Panel -->
        <Transition
          :css="false"
          @enter="PageTransitionAnimation.scaleEnter"
          @leave="PageTransitionAnimation.scaleLeave"
        >
          <div
            v-if="modelValue"
            :class="['relative w-full card shadow-2xl', sizeClasses[size]]"
          >
            <!-- Header -->
            <div
              v-if="title || closable"
              class="flex items-center justify-between px-6 py-4 border-b border-zinc-800"
            >
              <h2 v-if="title" class="section-heading">{{ title }}</h2>
              <button
                v-if="closable"
                class="ml-auto p-1.5 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
                @click="close"
              >
                <svg
                  class="w-4 h-4"
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

            <!-- Body -->
            <div class="px-6 py-5">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-zinc-800"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
