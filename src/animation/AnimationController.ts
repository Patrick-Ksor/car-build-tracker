import gsap from "gsap";

/**
 * Base class for all GSAP animation controllers.
 * Enforces the mount() / destroy() lifecycle contract,
 * preventing memory leaks in SPA navigation.
 */
export abstract class AnimationController {
  protected ctx: gsap.Context | null = null;

  /**
   * Call this from onMounted() — scopes all GSAP instances to the container
   * so ctx.revert() can clean everything up atomically.
   */
  abstract mount(container: HTMLElement): void;

  /**
   * Call this from onUnmounted() — kills all tweens/timelines created in mount().
   */
  destroy(): void {
    this.ctx?.revert();
    this.ctx = null;
  }

  protected createContext(container: HTMLElement, setup: () => void): void {
    this.ctx = gsap.context(setup, container);
  }
}
