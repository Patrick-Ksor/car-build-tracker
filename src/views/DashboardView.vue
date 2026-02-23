<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppShell from "@/components/layout/AppShell.vue";
import StatsGrid from "@/components/dashboard/StatsGrid.vue";
import { useCarsStore } from "@/stores/cars";
import { useModsStore } from "@/stores/mods";
import { useAuthStore } from "@/stores/auth";
import { useScrollReveal } from "@/composables/useScrollReveal";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const carsStore = useCarsStore();
const modsStore = useModsStore();
const authStore = useAuthStore();

const contentRef = ref<HTMLElement | null>(null);
useScrollReveal(contentRef, { stagger: 0.1 });

onMounted(async () => {
  await carsStore.fetchCars();
  // Prefetch mods for all cars to populate stats
  for (const car of carsStore.cars) {
    await modsStore.fetchMods(car.id);
  }
});
</script>

<template>
  <AppShell>
    <div class="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-zinc-100">
          Welcome back,
          <span class="text-gradient-blue">{{ authStore.displayName }}</span>
          👋
        </h1>
        <p class="text-zinc-500 mt-1 text-sm">Here's your build overview.</p>
      </div>

      <!-- Loading -->
      <div
        v-if="carsStore.isLoading"
        class="flex items-center justify-center py-20"
      >
        <LoadingSpinner size="lg" />
      </div>

      <template v-else>
        <!-- Stats -->
        <div ref="contentRef">
          <StatsGrid />
        </div>

        <!-- Recent cars -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="section-heading">Recent Builds</h2>
            <RouterLink
              to="/cars"
              class="text-sm text-brand-blue hover:text-brand-blue-light transition-colors"
            >
              View all →
            </RouterLink>
          </div>

          <div v-if="carsStore.cars.length === 0" class="card p-8 text-center">
            <p class="text-4xl mb-3">🚗</p>
            <p class="text-zinc-400 font-medium">No builds yet</p>
            <p class="text-zinc-600 text-sm mt-1">
              Add your first car to get started
            </p>
            <RouterLink to="/cars" class="btn-primary inline-flex mt-4">
              Add a car
            </RouterLink>
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <RouterLink
              v-for="car in carsStore.cars.slice(0, 3)"
              :key="car.id"
              :to="`/cars/${car.id}`"
              class="card-hover p-5 block group"
            >
              <!-- Car gradient header -->
              <div
                :class="[
                  'h-2 w-full rounded-t-lg -mx-5 -mt-5 mb-4 bg-gradient-to-r',
                  car.gradientClass,
                ]"
                style="
                  margin-top: -1.25rem;
                  margin-left: -1.25rem;
                  width: calc(100% + 2.5rem);
                "
              />

              <div class="flex items-start justify-between">
                <div>
                  <p
                    class="font-semibold text-zinc-100 group-hover:text-brand-blue transition-colors"
                  >
                    {{ car.shortName }}
                  </p>
                  <p v-if="car.nickname" class="text-xs text-zinc-500 mt-0.5">
                    {{ car.nickname }}
                  </p>
                </div>
                <span
                  class="badge text-emerald-400 bg-emerald-400/10 ring-emerald-400/20"
                >
                  {{ car.currentHp }} HP
                </span>
              </div>

              <div
                class="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500"
              >
                <span>{{ car.formattedCost }} invested</span>
                <span class="text-emerald-400"
                  >+{{ car.gainedHp }} HP gained</span
                >
              </div>
            </RouterLink>
          </div>
        </section>
      </template>
    </div>
  </AppShell>
</template>
