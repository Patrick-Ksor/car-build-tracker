import { onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { ScrollRevealAnimation } from "@/animation/ScrollRevealAnimation";

interface UseScrollRevealOptions {
  y?: number;
  x?: number;
  duration?: number;
  start?: string;
  stagger?: number;
}

/**
 * Reveals an element (or its children, if stagger > 0) when it enters the viewport.
 */
export function useScrollReveal(
  containerRef: Ref<HTMLElement | null>,
  options: UseScrollRevealOptions = {},
) {
  let animation: ScrollRevealAnimation | null = null;

  onMounted(() => {
    if (!containerRef.value) return;
    animation = new ScrollRevealAnimation(options);
    animation.mount(containerRef.value);
  });

  onUnmounted(() => {
    animation?.destroy();
  });
}
