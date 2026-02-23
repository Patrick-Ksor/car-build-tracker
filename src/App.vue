<script setup lang="ts">
import { RouterView } from "vue-router";
import PageTransition from "@/components/layout/PageTransition.vue";
import ToastContainer from "@/components/ui/ToastContainer.vue";
</script>

<template>
  <PageTransition>
    <RouterView />
  </PageTransition>
  <ToastContainer />
</template>
