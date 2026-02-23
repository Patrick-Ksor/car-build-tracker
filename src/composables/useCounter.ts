import { ref, watch, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { CounterAnimation } from "@/animation/CounterAnimation";

/**
 * Animates a number counter from 0 to the target value.
 * Returns a displayValue ref that updates each animation frame.
 *
 * @param target - reactive ref or plain number to animate to
 * @param containerRef - ref to the DOM element that scopes the GSAP context
 */
export function useCounter(
  target: Ref<number> | number,
  containerRef: Ref<HTMLElement | null>,
) {
  const displayValue = ref(0);
  let animation: CounterAnimation | null = null;

  function runAnimation(val: number) {
    if (!containerRef.value) return;
    animation?.destroy();
    animation = new CounterAnimation(val, (v) => {
      displayValue.value = v;
    });
    animation.mount(containerRef.value);
  }

  onMounted(() => {
    const val = typeof target === "number" ? target : target.value;
    runAnimation(val);
  });

  if (typeof target !== "number") {
    watch(target, (newVal) => {
      runAnimation(newVal);
    });
  }

  onUnmounted(() => {
    animation?.destroy();
  });

  return { displayValue };
}
