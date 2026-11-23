export type TransitionStyle =
  | 'depth-push'
  | 'door-swing'
  | 'cube'
  | 'flip'
  | 'curtain';

export interface TransitionConfig {
  /**
   * The active 3D transition style.
   * Selectable options: 'depth-push' | 'door-swing' | 'cube' | 'flip' | 'curtain'
   */
  style: TransitionStyle;
  /** Duration in seconds for enter and exit animations */
  duration: number;
  /** Cubic bezier easing array */
  ease: [number, number, number, number];
  /** 3D CSS perspective distance in pixels */
  perspective: number;
  /** Scale factor applied to 3D rotation angles & z-distance on mobile (<768px) */
  mobileScale: number;
}

/**
 * Global Cinematic 3D Page Transition Configuration
 * Modify this configuration to instantly switch between the 5 supported 3D styles
 * and tune animation timing, easing curve, perspective depth, or mobile scaling.
 */
export const TRANSITION: TransitionConfig = {
  style: 'depth-push', // Options: 'depth-push' | 'door-swing' | 'cube' | 'flip' | 'curtain'
  duration: 0.85,
  ease: [0.76, 0, 0.24, 1],
  perspective: 1600,
  mobileScale: 0.5,
};
