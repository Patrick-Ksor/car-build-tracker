import gsap from "gsap";

/**
 * Provides static enter/leave hooks for Vue's <Transition> component.
 * Usage in template:
 *   <Transition
 *     :css="false"
 *     @enter="PageTransitionAnimation.enter"
 *     @leave="PageTransitionAnimation.leave"
 *   >
 */
export class PageTransitionAnimation {
  static enter(el: Element, done: () => void): void {
    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: done,
        clearProps: "all",
      },
    );
  }

  static leave(el: Element, done: () => void): void {
    gsap.to(el, {
      opacity: 0,
      y: -16,
      duration: 0.2,
      ease: "power2.in",
      onComplete: done,
    });
  }

  /** Fade-only variant — useful for modals */
  static fadeEnter(el: Element, done: () => void): void {
    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power1.out", onComplete: done },
    );
  }

  static fadeLeave(el: Element, done: () => void): void {
    gsap.to(el, {
      opacity: 0,
      duration: 0.2,
      ease: "power1.in",
      onComplete: done,
    });
  }

  /** Scale + fade — used for modals and cards */
  static scaleEnter(el: Element, done: () => void): void {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.4)",
        onComplete: done,
        clearProps: "all",
      },
    );
  }

  static scaleLeave(el: Element, done: () => void): void {
    gsap.to(el, {
      opacity: 0,
      scale: 0.94,
      duration: 0.2,
      ease: "power2.in",
      onComplete: done,
    });
  }
}
