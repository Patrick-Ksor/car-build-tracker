<script setup lang="ts">
import { onMounted } from "vue";
import Sidebar from "./Sidebar.vue";
import TopBar from "./TopBar.vue";
import ToastContainer from "@/components/ui/ToastContainer.vue";

const emit = defineEmits<{
  ready: [];
}>();

onMounted(() => {
  // Ensure dark mode class is on html element
  document.documentElement.classList.add("dark");
  emit("ready");
});
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-zinc-950">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Top bar (mobile) -->
      <TopBar />

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden">
        <slot />
      </main>
    </div>

    <!-- Toast notifications -->
    <ToastContainer />
  </div>
</template>
