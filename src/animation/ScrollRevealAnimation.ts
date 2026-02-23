import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "./AnimationController";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  start?: string;
  stagger?: number;
}

/**
 * Reveals elements as they enter the viewport using GSAP ScrollTrigger.
 * Supports both single-element and multi-element (staggered) reveals.
 */
export class ScrollRevealAnimation extends AnimationController {
  private options: Required<ScrollRevealOptions>;

  constructor(options: ScrollRevealOptions = {}) {
    super();
    this.options = {
      y: options.y ?? 40,
      x: options.x ?? 0,
      opacity: options.opacity ?? 0,
      duration: options.duration ?? 0.7,
      ease: options.ease ?? "power3.out",
      start: options.start ?? "top 85%",
      stagger: options.stagger ?? 0,
    };
  }

  mount(container: HTMLElement): void {
    this.createContext(container, () => {
      const targets =
        this.options.stagger > 0 ? Array.from(container.children) : [container];

      gsap.fromTo(
        targets,
        {
          opacity: this.options.opacity,
          y: this.options.y,
          x: this.options.x,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: this.options.duration,
          ease: this.options.ease,
          stagger: this.options.stagger,
          clearProps: "all",
          scrollTrigger: {
            trigger: container,
            start: this.options.start,
            once: true,
          },
        },
      );
    });
  }
}
