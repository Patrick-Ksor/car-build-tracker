<script setup lang="ts">
import { computed } from "vue";
import StatCard from "./StatCard.vue";
import { useCarsStore } from "@/stores/cars";
import { useModsStore } from "@/stores/mods";

const carsStore = useCarsStore();
const modsStore = useModsStore();

const totalCost = computed(() => carsStore.totalSpend);
const totalMods = computed(() => modsStore.totalModCount);
const highestHp = computed(() => carsStore.highestHp);
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <StatCard
      label="Total Invested"
      :value="totalCost"
      icon="💰"
      prefix="$"
      accentColor="border-brand-blue"
      description="Across all builds"
    />
    <StatCard
      label="Modifications"
      :value="totalMods"
      icon="🔧"
      accentColor="border-blue-500"
      description="Total parts installed"
    />
    <StatCard
      label="Peak Horsepower"
      :value="highestHp"
      icon="⚡"
      suffix=" HP"
      accentColor="border-emerald-500"
      description="Highest build"
    />
  </div>
</template>
