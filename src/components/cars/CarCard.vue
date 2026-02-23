<script setup lang="ts">
import type { Car } from "@/models";

defineProps<{
  car: Car;
}>();

const emit = defineEmits<{
  edit: [car: Car];
  delete: [car: Car];
}>();
</script>

<template>
  <div
    class="card group hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover overflow-hidden flex flex-col"
  >
    <!-- Gradient header -->
    <div
      :class="['h-24 bg-gradient-to-br flex items-end p-4', car.gradientClass]"
    >
      <div>
        <h3 class="font-bold text-white text-sm leading-tight">
          {{ car.shortName }}
        </h3>
        <p v-if="car.nickname" class="text-white/70 text-xs mt-0.5">
          {{ car.nickname }}
        </p>
      </div>
      <div v-if="car.isPublic" class="ml-auto">
        <span class="badge text-white/90 bg-white/10 ring-white/20 text-xs"
          >Public</span
        >
      </div>
    </div>

    <!-- Body -->
    <div class="p-4 flex-1 space-y-3">
      <!-- HP row -->
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-zinc-500">Horsepower</p>
          <div class="flex items-baseline gap-1.5 mt-0.5">
            <span class="text-xl font-bold text-zinc-100">{{
              car.currentHp
            }}</span>
            <span class="text-xs text-zinc-500">HP</span>
            <span
              v-if="car.gainedHp > 0"
              class="text-xs text-emerald-400 font-medium"
              >+{{ car.gainedHp }}</span
            >
          </div>
        </div>
        <div>
          <p class="text-xs text-zinc-500 text-right">Invested</p>
          <p class="text-lg font-bold text-zinc-100 mt-0.5">
            {{ car.formattedCost }}
          </p>
        </div>
      </div>

      <!-- HP progress bar -->
      <div>
        <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-brand-blue to-blue-400 rounded-full transition-all duration-500"
            :style="{ width: `${Math.min(car.hpGainPercent, 100)}%` }"
          />
        </div>
        <p class="text-xs text-zinc-600 mt-1">
          +{{ car.hpGainPercent }}% from stock
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div
      class="px-4 py-3 border-t border-zinc-800 flex items-center gap-2 bg-zinc-900/50"
    >
      <RouterLink
        :to="`/cars/${car.id}`"
        class="btn-ghost text-xs flex-1 justify-center"
      >
        View build
      </RouterLink>
      <button
        class="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
        title="Edit car"
        @click.stop="emit('edit', car)"
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
        class="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        title="Delete car"
        @click.stop="emit('delete', car)"
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
