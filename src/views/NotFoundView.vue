<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";

const router = useRouter();
</script>

<template>
  <div
    class="min-h-screen bg-dark-950 flex flex-col items-center justify-center px-4 text-center"
  >
    <p class="text-7xl font-extrabold text-brand-blue mb-4 select-none">404</p>
    <h1 class="text-2xl font-bold text-white mb-2">Page not found</h1>
    <p class="text-dark-400 max-w-sm mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <BaseButton variant="primary" @click="router.push({ name: 'dashboard' })"
      >Go to dashboard</BaseButton
    >
  </div>
</template>
