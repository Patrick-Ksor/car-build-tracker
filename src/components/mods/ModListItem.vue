<script setup lang="ts">
import type { Mod } from "@/models";
import BaseBadge from "@/components/ui/BaseBadge.vue";

defineProps<{
  mod: Mod;
}>();

const emit = defineEmits<{
  edit: [mod: Mod];
  delete: [mod: Mod];
}>();
</script>

<template>
  <div
    class="flex items-start gap-4 p-4 card hover:border-zinc-700 transition-all duration-150 group"
  >
    <!-- Category dot -->
    <div class="flex-shrink-0 mt-1">
      <div class="w-2 h-2 rounded-full bg-brand-blue" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap items-center gap-2 mb-1">
        <span class="text-sm font-semibold text-zinc-100">{{ mod.name }}</span>
        <BaseBadge :color-class="mod.categoryColor">{{
          mod.categoryLabel
        }}</BaseBadge>
      </div>

      <div class="flex flex-wrap gap-4 text-xs text-zinc-500">
        <span>{{ mod.formattedDate }}</span>
        <span class="text-zinc-300 font-medium">{{ mod.formattedCost }}</span>
        <span v-if="mod.hpGain > 0" class="text-emerald-400 font-medium"
          >+{{ mod.hpGain }} HP</span
        >
        <span v-if="mod.hpGain === 0" class="text-zinc-600">No HP change</span>
      </div>

      <p v-if="mod.notes" class="text-xs text-zinc-600 mt-1.5 italic">
        {{ mod.notes }}
      </p>
    </div>

    <!-- Actions -->
    <div
      class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
    >
      <button
        class="p-1.5 rounded text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
        @click="emit('edit', mod)"
        title="Edit"
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
      <button
        class="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        @click="emit('delete', mod)"
        title="Delete"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
