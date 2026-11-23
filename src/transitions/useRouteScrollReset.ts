import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../components/SmoothScrollProvider';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Walk The Plan — Experience Your Future Home Before It Exists',
  '/about': 'About Us — Leadership & Architectural Guidance | Walk The Plan',
  '/services': 'Services & Spatial Validation | Walk The Plan',
  '/franchise': 'Franchise Studio Opportunities Across India | Walk The Plan',
  '/gallery': '1:1 Scale Walkthrough Gallery | Walk The Plan',
  '/blog': 'Architectural Insights & Layout Checklists | Walk The Plan',
};

/**
 * Hook synchronizing route transitions with Lenis smooth scroll, GSAP ScrollTrigger
 * lifecycle, accessibility focus shifts, and hash anchor navigation.
 */
export function useRouteScrollReset() {
  const { scrollTo, stopScroll, startScroll, getLenis } = useSmoothScroll();
  const activeHashRef = useRef<string | null>(null);

  /**
   * Called immediately when the current route begins exiting:
   * 1. Stops Lenis scroll loop to prevent mid-transition scrubbing.
   */
  const handleExitStart = useCallback(() => {
    stopScroll();
  }, [stopScroll]);

  /**
   * Called when the previous page's exit animation finishes:
   * 1. Kills orphaned ScrollTriggers from the leaving page.
   * 2. Resets scroll position immediately to 0 so the entering page mounts at the top.
   */
  const handleExitComplete = useCallback(() => {
    // Clean up leaving page ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => {
      // Keep hero trigger if on home, or clean thoroughly
      trigger.kill();
    });

    // Reset window & Lenis scroll position instantly to top
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [getLenis]);

  /**
   * Called when the entering page's animation finishes:
   * 1. Restarts Lenis.
   * 2. Scrolls to hash target if present in the URL.
   * 3. Refreshes ScrollTrigger layout calculations.
   * 4. Updates document title and shifts accessible focus to the page's primary <h1>.
   */
  const handleEnterComplete = useCallback(
    (pathname: string) => {
      startScroll();

      // Update document title for the new route
      const normalized = pathname.replace(/\/$/, '') || '/';
      if (ROUTE_TITLES[normalized]) {
        document.title = ROUTE_TITLES[normalized];
      }

      // Check if URL has a hash to scroll to
      const hash = window.location.hash;
      if (hash) {
        activeHashRef.current = hash;
        const targetEl = document.querySelector<HTMLElement>(hash);
        if (targetEl) {
          setTimeout(() => {
            scrollTo(targetEl, { offset: -88, duration: 1.15 });
          }, 60);
        }
      }

      // Refresh ScrollTrigger once DOM layout settles without transform
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      // Shift focus to the page's main <h1> for screen reader accessibility
      setTimeout(() => {
        const h1 = document.querySelector<HTMLHeadingElement>('main h1');
        if (h1) {
          h1.tabIndex = -1;
          h1.focus({ preventScroll: true });
        }
      }, 100);
    },
    [scrollTo, startScroll]
  );

  return {
    handleExitStart,
    handleExitComplete,
    handleEnterComplete,
  };
}
