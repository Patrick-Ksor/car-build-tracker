<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCarsStore } from "@/stores/cars";
import { useModsStore } from "@/stores/mods";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import BuildHero from "@/components/public/BuildHero.vue";
import ModTimeline from "@/components/public/ModTimeline.vue";

const route = useRoute();
const carsStore = useCarsStore();
const modsStore = useModsStore();

const carId = route.params.id as string;
const isLoading = ref(true);
const notFound = ref(false);

const car = computed(() => carsStore.currentCar);
const mods = computed(() => modsStore.modsByCarId.get(carId) ?? []);

onMounted(async () => {
  try {
    const [fetchedCar] = await Promise.all([
      carsStore.fetchPublicBuild(carId),
      modsStore.fetchMods(carId),
    ]);
    if (!fetchedCar) notFound.value = true;
  } catch {
    notFound.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-dark-950">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Not found / private build -->
    <div
      v-else-if="notFound || !car"
      class="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center"
    >
      <h1 class="text-4xl font-bold text-white">Build not found</h1>
      <p class="text-dark-400 max-w-md">
        This build is either private or doesn't exist.
      </p>
    </div>

    <!-- Public build -->
    <template v-else>
      <BuildHero :car="car" :mod-count="mods.length" />
      <ModTimeline :mods="mods" />
      <footer
        class="py-8 text-center text-dark-500 text-xs border-t border-dark-800"
      >
        Powered by Car Build Tracker
      </footer>
    </template>
  </div>
</template>
