import gsap from "gsap";
import { AnimationController } from "./AnimationController";

interface CounterOptions {
  duration?: number;
  ease?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Animates a numeric counter from 0 to target value.
 * Calls onUpdate with the current rounded value each frame.
 */
export class CounterAnimation extends AnimationController {
  private target: number;
  private onUpdate: (val: number) => void;
  private options: Required<CounterOptions>;

  constructor(
    target: number,
    onUpdate: (val: number) => void,
    options: CounterOptions = {},
  ) {
    super();
    this.target = target;
    this.onUpdate = onUpdate;
    this.options = {
      duration: options.duration ?? 1.5,
      ease: options.ease ?? "power2.out",
      prefix: options.prefix ?? "",
      suffix: options.suffix ?? "",
    };
  }

  mount(container: HTMLElement): void {
    const proxy = { val: 0 };
    this.createContext(container, () => {
      gsap.to(proxy, {
        val: this.target,
        duration: this.options.duration,
        ease: this.options.ease,
        onUpdate: () => {
          this.onUpdate(Math.round(proxy.val));
        },
      });
    });
  }

  /** Update target and re-run animation (useful when reactive data changes) */
  updateTarget(newTarget: number): void {
    this.target = newTarget;
  }
}
