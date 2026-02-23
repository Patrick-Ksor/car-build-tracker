<script setup lang="ts">
import { ref, computed } from "vue";
import { useCounter } from "@/composables/useCounter";

const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    icon: string;
    prefix?: string;
    suffix?: string;
    accentColor?: string;
    description?: string;
  }>(),
  {
    prefix: "",
    suffix: "",
    accentColor: "border-brand-blue",
  }
);

const containerRef = ref<HTMLElement | null>(null);
const target = computed(() => props.value);
const { displayValue } = useCounter(target, containerRef);
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      'card p-5 border-t-2 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 group',
      accentColor,
    ]"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <p
          class="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2"
        >
          {{ label }}
        </p>
        <div class="flex items-baseline gap-1">
          <span v-if="prefix" class="text-sm font-medium text-zinc-400">{{
            prefix
          }}</span>
          <span class="text-3xl font-bold text-zinc-100 tabular-nums">
            {{ displayValue.toLocaleString() }}
          </span>
          <span v-if="suffix" class="text-sm font-medium text-zinc-400">{{
            suffix
          }}</span>
        </div>
        <p v-if="description" class="text-xs text-zinc-600 mt-1.5">
          {{ description }}
        </p>
      </div>
      <div
        class="ml-4 w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors flex items-center justify-center text-xl flex-shrink-0"
      >
        {{ icon }}
      </div>
    </div>
  </div>
</template>
