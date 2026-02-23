<script setup lang="ts">
import { computed, ref } from "vue";
import { Bar } from "vue-chartjs";
import { useModsStore } from "@/stores/mods";
import { ChartConfigBuilder } from "@/services/ChartConfigBuilder";
import { useScrollReveal } from "@/composables/useScrollReveal";

const props = defineProps<{ carId: string }>();

const modsStore = useModsStore();
const containerRef = ref<HTMLElement | null>(null);
useScrollReveal(containerRef);

const chartConfig = computed(() => {
  const months = modsStore.spendingByMonth(props.carId);
  return ChartConfigBuilder.barChart(
    months.map((m) => m.label),
    months.map((m) => m.amount),
    "Spend ($)"
  );
});

const chartDataset = computed(() => ({
  labels: chartConfig.value.data.labels,
  datasets: chartConfig.value.data.datasets,
}));
const chartOptions = computed(() => chartConfig.value.options);
</script>

<template>
  <div ref="containerRef" class="card p-5">
    <h3
      class="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4"
    >
      Monthly Spending
    </h3>
    <div class="h-64">
      <Bar :data="chartDataset" :options="(chartOptions as any)" />
    </div>
  </div>
</template>
