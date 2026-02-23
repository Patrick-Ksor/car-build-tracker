<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCarsStore } from "@/stores/cars";
import { useModsStore } from "@/stores/mods";
import AppShell from "@/components/layout/AppShell.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import HPLineChart from "@/components/analytics/HPLineChart.vue";
import SpendingPieChart from "@/components/analytics/SpendingPieChart.vue";
import MonthlyBarChart from "@/components/analytics/MonthlyBarChart.vue";

const route = useRoute();
const router = useRouter();
const carsStore = useCarsStore();
const modsStore = useModsStore();

const carId = route.params.id as string;
const isLoading = ref(true);

const car = computed(() => carsStore.currentCar);
const mods = computed(() => modsStore.modsByCarId.get(carId) ?? []);

onMounted(async () => {
  try {
    await Promise.all([carsStore.fetchCar(carId), modsStore.fetchMods(carId)]);
  } catch {
    router.push({ name: "cars" });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <AppShell>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <LoadingSpinner size="lg" />
    </div>

    <template v-else-if="car">
      <!-- Header -->
      <div class="mb-8">
        <BaseButton
          variant="ghost"
          size="sm"
          class="-ml-2 mb-4 text-dark-400 hover:text-white"
          @click="router.push({ name: 'car-detail', params: { id: carId } })"
        >
          ← Back to {{ car.shortName }}
        </BaseButton>

        <div
          class="flex flex-wrap items-end justify-between gap-4 border-b border-dark-800 p-6"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1"
            >
              Analytics
            </p>
            <h1 class="text-3xl font-bold text-white leading-tight">
              {{ car.displayName }}
            </h1>
            <p v-if="car.nickname" class="text-dark-400 text-sm mt-1">
              &ldquo;{{ car.nickname }}&rdquo;
            </p>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-white tabular-nums">
                {{ mods.length }}
              </p>
              <p class="text-xs text-dark-500 uppercase tracking-wide mt-0.5">
                Mods
              </p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-brand-blue tabular-nums">
                +{{ car.gainedHp }}
              </p>
              <p class="text-xs text-dark-500 uppercase tracking-wide mt-0.5">
                HP gained
              </p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-white tabular-nums">
                {{ car.formattedCost }}
              </p>
              <p class="text-xs text-dark-500 uppercase tracking-wide mt-0.5">
                Invested
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No mods empty state -->
      <div
        v-if="mods.length === 0"
        class="card flex flex-col items-center justify-center py-20 text-center"
      >
        <p class="text-dark-400">No modifications to analyze yet.</p>
        <BaseButton
          variant="primary"
          class="mt-4"
          @click="router.push({ name: 'car-detail', params: { id: carId } })"
        >
          Add your first mod
        </BaseButton>
      </div>

      <!-- Charts grid -->
      <div v-else class="space-y-6">
        <HPLineChart :car-id="carId" :base-hp="car.baseHp" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingPieChart :car-id="carId" />
          <MonthlyBarChart :car-id="carId" />
        </div>
      </div>
    </template>
  </AppShell>
</template>
