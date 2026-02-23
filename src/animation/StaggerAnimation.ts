import gsap from "gsap";
import { AnimationController } from "./AnimationController";

interface StaggerOptions {
  stagger?: number;
  duration?: number;
  ease?: string;
  from?: gsap.TweenVars["from"];
  y?: number;
  x?: number;
  scale?: number;
}

/**
 * Animates a list of child elements with a staggered entrance.
 * Targets are selected by CSS selector within the container.
 */
export class StaggerAnimation extends AnimationController {
  private selector: string;
  private options: Required<StaggerOptions>;

  constructor(selector = ":scope > *", options: StaggerOptions = {}) {
    super();
    this.selector = selector;
    this.options = {
      stagger: options.stagger ?? 0.08,
      duration: options.duration ?? 0.5,
      ease: options.ease ?? "power3.out",
      from: options.from ?? undefined,
      y: options.y ?? 20,
      x: options.x ?? 0,
      scale: options.scale ?? 1,
    };
  }

  mount(container: HTMLElement): void {
    const targets = container.querySelectorAll(this.selector);
    if (targets.length === 0) return;

    this.createContext(container, () => {
      gsap.from(targets, {
        opacity: 0,
        y: this.options.y,
        x: this.options.x,
        scale: this.options.scale < 1 ? this.options.scale : undefined,
        stagger: this.options.stagger,
        duration: this.options.duration,
        ease: this.options.ease,
        clearProps: "all",
      });
    });
  }
}
