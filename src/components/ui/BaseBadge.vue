<script setup lang="ts">
withDefaults(
  defineProps<{
    colorClass?: string;
  }>(),
  {
    colorClass: "text-zinc-400 bg-zinc-400/10 ring-zinc-400/20",
  }
);
</script>

<template>
  <span :class="['badge', colorClass]">
    <slot />
  </span>
</template>
