<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import gsap from "gsap";
import { useCounter } from "@/composables/useCounter";
import type { Car } from "@/models";

const props = defineProps<{ car: Car; modCount: number }>();

const heroRef = ref<HTMLElement | null>(null);
const hpContainerRef = ref<HTMLElement | null>(null);
const gainContainerRef = ref<HTMLElement | null>(null);
const countContainerRef = ref<HTMLElement | null>(null);

const targetHp = computed(() => props.car.currentHp);
const targetGain = computed(() => props.car.gainedHp);
const targetCount = computed(() => props.modCount);

const { displayValue: hpDisplay } = useCounter(targetHp, hpContainerRef);
const { displayValue: gainDisplay } = useCounter(targetGain, gainContainerRef);
const { displayValue: countDisplay } = useCounter(
  targetCount,
  countContainerRef
);

onMounted(() => {
  if (!heroRef.value) return;
  gsap.fromTo(
    heroRef.value.querySelectorAll("[data-hero-item]"),
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: "power2.out",
      delay: 0.1,
    }
  );
});
</script>

<template>
  <section
    ref="heroRef"
    :class="['relative overflow-hidden py-24 px-6', car.gradientClass]"
  >
    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-dark-950/60 to-dark-950/90"
    />

    <div class="relative z-10 max-w-4xl mx-auto text-center">
      <p
        data-hero-item
        class="text-brand-blue text-xs font-bold uppercase tracking-[0.25em] mb-3"
      >
        Build showcase
      </p>
      <h1
        data-hero-item
        class="text-4xl sm:text-5xl font-extrabold text-white leading-tight"
      >
        {{ car.displayName }}
      </h1>
      <p v-if="car.nickname" data-hero-item class="text-xl text-white/60 mt-2">
        &ldquo;{{ car.nickname }}&rdquo;
      </p>

      <!-- Stats row -->
      <div
        data-hero-item
        class="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto text-center"
      >
        <div
          ref="hpContainerRef"
          class="bg-dark-900/70 backdrop-blur-sm rounded-2xl p-5 ring-1 ring-white/10"
        >
          <p class="text-3xl font-bold text-white tabular-nums">
            {{ hpDisplay }}
          </p>
          <p class="text-xs text-dark-400 mt-1 uppercase tracking-wide">
            Current HP
          </p>
        </div>
        <div
          ref="gainContainerRef"
          class="bg-dark-900/70 backdrop-blur-sm rounded-2xl p-5 ring-1 ring-white/10"
        >
          <p class="text-3xl font-bold text-brand-blue tabular-nums">
            {{ gainDisplay }}
          </p>
          <p class="text-xs text-dark-400 mt-1 uppercase tracking-wide">
            HP Gained
          </p>
        </div>
        <div
          ref="countContainerRef"
          class="bg-dark-900/70 backdrop-blur-sm rounded-2xl p-5 ring-1 ring-white/10"
        >
          <p class="text-3xl font-bold text-white tabular-nums">
            {{ countDisplay }}
          </p>
          <p class="text-xs text-dark-400 mt-1 uppercase tracking-wide">Mods</p>
        </div>
      </div>

      <p data-hero-item class="text-dark-400 text-sm mt-8">
        Total invested:
        <span class="text-white font-semibold">{{ car.formattedCost }}</span>
      </p>
    </div>
  </section>
</template>
