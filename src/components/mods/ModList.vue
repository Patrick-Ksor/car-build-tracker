<script setup lang="ts">
import { ref, computed } from "vue";
import { useStaggerList } from "@/composables/useStaggerList";
import ModListItem from "./ModListItem.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import type { Mod } from "@/models";

const props = withDefaults(
  defineProps<{
    mods: Mod[];
    isLoading?: boolean;
  }>(),
  { isLoading: false }
);

const emit = defineEmits<{
  edit: [mod: Mod];
  delete: [mod: Mod];
}>();

const listRef = ref<HTMLElement | null>(null);

const sorted = computed(() =>
  [...props.mods].sort(
    (a, b) =>
      new Date(b.installDate).getTime() - new Date(a.installDate).getTime()
  )
);

useStaggerList(listRef, sorted);
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="sorted.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4"
      >
        <svg
          class="w-8 h-8 text-dark-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <p class="text-dark-400 text-sm font-medium">No modifications yet</p>
      <p class="text-dark-500 text-xs mt-1">
        Add your first mod using the button above.
      </p>
    </div>

    <!-- List -->
    <ul v-else ref="listRef" class="divide-y divide-dark-800/60">
      <ModListItem
        v-for="mod in sorted"
        :key="mod.id"
        :mod="mod"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </ul>
  </div>
</template>
