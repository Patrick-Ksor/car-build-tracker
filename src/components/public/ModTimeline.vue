<script setup lang="ts">
import { ref, computed } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import TimelineItem from "./TimelineItem.vue";
import type { Mod } from "@/models";

const props = defineProps<{ mods: Mod[] }>();

const containerRef = ref<HTMLElement | null>(null);
useScrollReveal(containerRef, { stagger: 0.12 });

const sorted = computed(() =>
  [...props.mods].sort(
    (a, b) =>
      new Date(a.installDate).getTime() - new Date(b.installDate).getTime()
  )
);
</script>

<template>
  <section class="py-16 px-4">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-white mb-2">Modification history</h2>
      <p class="text-dark-400 text-sm mb-10">
        {{ mods.length }} mod{{ mods.length !== 1 ? "s" : "" }} installed
      </p>

      <ul ref="containerRef" class="space-y-0">
        <TimelineItem
          v-for="(mod, i) in sorted"
          :key="mod.id"
          :mod="mod"
          :index="i"
        />
      </ul>
    </div>
  </section>
</template>
