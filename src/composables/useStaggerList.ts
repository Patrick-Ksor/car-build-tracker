import { onMounted, onUnmounted, watch } from "vue";
import type { Ref } from "vue";
import { StaggerAnimation } from "@/animation/StaggerAnimation";

interface UseStaggerListOptions {
  selector?: string;
  stagger?: number;
  duration?: number;
  y?: number;
}

/**
 * Triggers a staggered entrance animation on list children.
 * Re-runs whenever the items array changes length.
 */
export function useStaggerList<T>(
  containerRef: Ref<HTMLElement | null>,
  items: Ref<T[]>,
  options: UseStaggerListOptions = {},
) {
  let animation: StaggerAnimation | null = null;

  async function runAnimation() {
    if (!containerRef.value) return;
    animation?.destroy();
    // Wait one tick for Vue to finish rendering new list items
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    if (!containerRef.value) return;
    animation = new StaggerAnimation(options.selector, {
      stagger: options.stagger,
      duration: options.duration,
      y: options.y,
    });
    animation.mount(containerRef.value);
  }

  onMounted(() => {
    runAnimation();
  });

  watch(
    () => items.value.length,
    () => {
      runAnimation();
    },
  );

  onUnmounted(() => {
    animation?.destroy();
  });
}
