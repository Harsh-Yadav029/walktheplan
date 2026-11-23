import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, type TargetAndTransition } from 'motion/react';
import { TRANSITION, type TransitionConfig, type TransitionStyle } from './transitionConfig';
import { useRouteScrollReset } from './useRouteScrollReset';
import { useTransitionState } from './TransitionProvider';

interface PageTransitionProps {
  children: ReactNode;
  pathname: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}

interface StyleVariants {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
}

function get3DVariants(
  style: TransitionStyle,
  isMobile: boolean,
  isReduced: boolean,
  cfg: TransitionConfig
): StyleVariants {
  if (isReduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
      exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
    };
  }

  const duration = isMobile ? cfg.duration * 0.8 : cfg.duration;
  const mScale = isMobile ? cfg.mobileScale : 1;
  const activeStyle = isMobile && (style === 'cube' || style === 'curtain') ? 'depth-push' : style;

  switch (activeStyle) {
    case 'depth-push':
      return {
        initial: {
          opacity: 0,
          scale: 1.04,
          z: 300 * mScale,
          rotateX: -4 * mScale,
        },
        animate: {
          opacity: 1,
          scale: 1,
          z: 0,
          rotateX: 0,
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
        exit: {
          opacity: 0,
          scale: 0.92,
          z: -300 * mScale,
          rotateX: 4 * mScale,
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
      };

    case 'door-swing':
      return {
        initial: {
          opacity: 0,
          rotateY: -35 * mScale,
          x: isMobile ? '4%' : '8%',
          filter: isMobile ? 'none' : 'blur(6px)',
          transformOrigin: 'left center',
        },
        animate: {
          opacity: 1,
          rotateY: 0,
          x: '0%',
          filter: 'blur(0px)',
          transformOrigin: 'left center',
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
        exit: {
          opacity: 0,
          rotateY: 35 * mScale,
          transformOrigin: 'left center',
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
      };

    case 'cube':
      return {
        initial: {
          opacity: 0,
          rotateY: 90,
          x: '25%',
          transformOrigin: 'left center',
        },
        animate: {
          opacity: 1,
          rotateY: 0,
          x: '0%',
          transformOrigin: 'left center',
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
        exit: {
          opacity: 0,
          rotateY: -90,
          x: '-25%',
          transformOrigin: 'right center',
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
      };

    case 'flip':
      return {
        initial: {
          opacity: 0,
          rotateX: -60 * mScale,
        },
        animate: {
          opacity: 1,
          rotateX: 0,
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
        exit: {
          opacity: 0,
          rotateX: 60 * mScale,
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
      };

    case 'curtain':
      return {
        initial: {
          opacity: 0,
          rotateY: 30,
          scale: 0.96,
          z: 180,
        },
        animate: {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          z: 0,
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
        exit: {
          opacity: 0,
          rotateY: -30,
          scale: 0.96,
          z: -180,
          transition: {
            duration,
            ease: cfg.ease,
          },
        },
      };
  }
}

/**
 * 3D Curtain Overlay for the 'curtain' transition style (Desktop only).
 * 5 vertical 3D panels that rotateY and slide across screen during route handoff.
 */
function CurtainPanels({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex overflow-hidden"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
          animate={{
            rotateY: [ -90, 0, 90 ],
            opacity: [ 0, 1, 0 ],
          }}
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1],
            delay: i * 0.05,
          }}
          className="h-full flex-1 bg-[#141516]/95 border-r border-white/5"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: i % 2 === 0 ? 'left center' : 'right center',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Cinematic 3D Page Transition Wrapper
 * Wraps route content (<main>) with full 3D perspective without wrapping global UI (Navbar, Cursor, Footer).
 * Clears CSS transform to "none" after entrance completes so fixed elements and GSAP ScrollTrigger pins work reliably.
 */
export const PageTransition = memo(function PageTransition({
  children,
  pathname,
}: PageTransitionProps) {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { startTransition, endTransition } = useTransitionState();
  const { handleExitStart, handleExitComplete, handleEnterComplete } = useRouteScrollReset();

  // Track animation state so CSS transform & will-change are active ONLY during transition
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const showCurtain = !isMobile && !prefersReduced && TRANSITION.style === 'curtain' && isTransitionActive;

  const variants = useMemo(
    () => get3DVariants(TRANSITION.style, isMobile, prefersReduced, TRANSITION),
    [isMobile, prefersReduced]
  );

  // Clear transform & will-change when idle so position: fixed (GSAP ScrollTrigger pin) works natively
  useEffect(() => {
    if (!isTransitionActive && contentRef.current) {
      contentRef.current.style.transform = 'none';
      contentRef.current.style.willChange = 'auto';
    }
  }, [isTransitionActive]);

  return (
    <>
      <CurtainPanels isVisible={showCurtain} />

      <div
        id="page-perspective-container"
        className="w-full overflow-x-clip"
        style={{
          perspective: isTransitionActive ? `${TRANSITION.perspective}px` : undefined,
          perspectiveOrigin: '50% 40%',
          backgroundColor: 'inherit',
        }}
      >
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            handleExitComplete();
          }}
        >
          <motion.div
            key={pathname}
            ref={contentRef}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            onAnimationStart={() => {
              setIsTransitionActive(true);
              startTransition();
              handleExitStart();
            }}
            onAnimationComplete={() => {
              setIsTransitionActive(false);
              endTransition();
              if (contentRef.current) {
                contentRef.current.style.transform = 'none';
                contentRef.current.style.willChange = 'auto';
              }
              handleEnterComplete(pathname);
            }}
            className="w-full"
            style={{
              transformStyle: isTransitionActive ? 'preserve-3d' : 'flat',
              willChange: isTransitionActive ? 'transform, opacity' : 'auto',
              // CRITICAL: Explicitly clear parent transform when idle so child fixed / pin elements work
              transform: isTransitionActive ? undefined : 'none',
              backgroundColor: 'inherit',
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
});
