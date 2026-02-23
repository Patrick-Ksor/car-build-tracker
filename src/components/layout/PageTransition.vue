<script setup lang="ts">
import { PageTransitionAnimation } from "@/animation/PageTransitionAnimation";
</script>

<template>
  <Transition
    :css="false"
    mode="out-in"
    @enter="PageTransitionAnimation.enter"
    @leave="PageTransitionAnimation.leave"
  >
    <slot />
  </Transition>
</template>
