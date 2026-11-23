import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.85 });

export interface SmoothScrollContextValue {
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number; immediate?: boolean; force?: boolean }
  ) => void;
  stopScroll: () => void;
  startScroll: () => void;
  getLenis: () => Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: (target) => {
    if (typeof target === 'number') {
      window.scrollTo({ top: target });
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView();
    } else {
      target.scrollIntoView();
    }
  },
  stopScroll: () => {},
  startScroll: () => {},
  getLenis: () => null,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    document.documentElement.classList.add('has-motion');

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      smoothWheel: true,
      anchors: {
        offset: -88,
      },
    });

    lenisRef.current = lenis;

    // Synchronize Darkroom Engineering Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger measurements once fonts and initial layout settle
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.documentElement.classList.remove('has-motion');
      window.clearTimeout(refreshTimer);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(updateTicker);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback(
    (
      target: string | HTMLElement | number,
      options?: { offset?: number; duration?: number; immediate?: boolean }
    ) => {
      const lenis = lenisRef.current;
      const offset = options?.offset ?? -88;
      if (lenis) {
        lenis.scrollTo(target, {
          offset,
          duration: options?.duration ?? 1.15,
          immediate: options?.immediate ?? false,
          force: options?.immediate ?? false,
        });
        if (options?.immediate) ScrollTrigger.update();
        return;
      }

      if (typeof target === 'number') {
        window.scrollTo({ top: target });
        return;
      }

      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView();
    },
    []
  );

  const stopScroll = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const startScroll = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const getLenis = useCallback(() => lenisRef.current, []);

  const value = useMemo(
    () => ({
      scrollTo,
      stopScroll,
      startScroll,
      getLenis,
    }),
    [scrollTo, stopScroll, startScroll, getLenis]
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
