<script setup lang="ts">
import BaseBadge from "@/components/ui/BaseBadge.vue";
import type { Mod } from "@/models";

defineProps<{ mod: Mod; index: number }>();
</script>

<template>
  <li class="relative flex gap-4 pb-8 last:pb-0">
    <!-- Timeline line -->
    <div
      class="absolute left-[18px] top-8 bottom-0 w-px bg-dark-700 last:hidden"
      aria-hidden="true"
    />

    <!-- Dot -->
    <div class="relative flex-none mt-1">
      <div
        :class="[
          'w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-dark-950 text-xs font-bold',
          mod.categoryColor,
        ]"
      >
        {{ index + 1 }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 card p-4">
      <div class="flex flex-wrap items-start gap-2 justify-between">
        <div>
          <h3 class="font-semibold text-white">{{ mod.name }}</h3>
          <time class="text-xs text-dark-400">{{ mod.formattedDate }}</time>
        </div>
        <BaseBadge :color="mod.categoryColor">{{
          mod.categoryLabel
        }}</BaseBadge>
      </div>

      <div class="flex gap-4 mt-3 text-sm">
        <span class="text-dark-400">
          Cost:
          <span class="text-white font-medium">{{ mod.formattedCost }}</span>
        </span>
        <span v-if="mod.hpGain > 0" class="text-dark-400">
          HP Gain:
          <span class="text-brand-blue font-medium">+{{ mod.hpGain }}</span>
        </span>
      </div>

      <p v-if="mod.notes" class="mt-2 text-sm text-dark-400 italic">
        {{ mod.notes }}
      </p>
    </div>
  </li>
</template>
