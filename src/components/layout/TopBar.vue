<script setup lang="ts">
import { useRoute } from "vue-router";
import { useUiStore } from "@/stores/ui";

const route = useRoute();
const uiStore = useUiStore();
</script>

<template>
  <header
    class="lg:hidden flex items-center gap-4 px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex-shrink-0"
  >
    <!-- Hamburger -->
    <button
      class="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
      aria-label="Open navigation"
      @click="uiStore.toggleSidebar()"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Page title -->
    <span class="font-semibold text-zinc-100 text-sm">
      {{ String(route.meta.title ?? "Car Build Tracker") }}
    </span>

    <!-- Logo -->
    <div
      class="ml-auto w-7 h-7 rounded-md bg-brand-blue flex items-center justify-center font-bold text-white text-xs"
    >
      C
    </div>
  </header>
</template>
