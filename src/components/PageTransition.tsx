import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'motion/react';
import { useSmoothScroll } from './SmoothScrollProvider';

const COLUMNS = 5;

const SECTION_LABELS: Record<string, string> = {
  '#top': 'Home',
  '#experience': 'The Experience',
  '#walkthrough': 'The Walkthrough',
  '#configurator': '3D Studio',
  '#services': 'Services',
  '#gallery': 'Gallery',
  '#process': 'Process',
  '#studios': 'Studios',
  '#book': 'Book a Walkthrough',
  '#contact': 'Contact',
};

type TransitionTo = (target: string, label?: string) => void;

const TransitionContext = createContext<TransitionTo>(() => {});

export function useTransitionTo() {
  return useContext(TransitionContext);
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const { scrollTo, stopScroll, startScroll } = useSmoothScroll();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const colsRef = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const busyRef = useRef(false);
  const [label, setLabel] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // First-load preloader: columns start covering the screen, count to 100, then lift away
  useEffect(() => {
    const overlay = overlayRef.current;
    const cols = colsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!overlay) return;

    if (reduced) {
      gsap.set(overlay, { autoAlpha: 0 });
      setBooting(false);
      return;
    }

    const root = document.documentElement;
    root.style.overflow = 'hidden';
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(cols, { yPercent: 0, transformOrigin: 'top' });

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0 });
        setBooting(false);
        root.style.overflow = '';
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
      },
    })
      .to('[data-pt-brand]', { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in' }, '+=0.1')
      .to(cols, { yPercent: -100, duration: 0.85, ease: 'expo.inOut', stagger: { each: 0.07, from: 'start' } }, '<0.1');

    return () => {
      tl.kill();
      root.style.overflow = '';
    };
  }, [reduced]);

  const transitionTo = useCallback<TransitionTo>(
    (target, customLabel) => {
      const overlay = overlayRef.current;
      const cols = colsRef.current.filter(Boolean) as HTMLDivElement[];

      // Short hops and reduced motion use the normal Lenis glide
      const el = typeof target === 'string' && target !== '#top' ? document.querySelector(target) : null;
      const destY = target === '#top' ? 0 : el ? el.getBoundingClientRect().top + window.scrollY : window.scrollY;
      const far = Math.abs(destY - window.scrollY) > window.innerHeight * 1.5;

      if (reduced || !overlay || busyRef.current || !far) {
        scrollTo(target === '#top' ? 0 : target);
        return;
      }

      busyRef.current = true;
      setLabel(customLabel ?? SECTION_LABELS[target] ?? '');
      stopScroll();

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
          setLabel(null);
          busyRef.current = false;
          startScroll();
        },
      });

      tl.set(overlay, { autoAlpha: 1 })
        .set(cols, { yPercent: 100, transformOrigin: 'bottom' })
        // Cover
        .to(cols, { yPercent: 0, duration: 0.6, ease: 'expo.inOut', stagger: { each: 0.05, from: 'center' } })
        // Jump while hidden
        .add(() => {
          startScroll();
          scrollTo(target === '#top' ? 0 : target, { immediate: true });
          stopScroll();
        })
        .to({}, { duration: 0.35 })
        // Reveal
        .to(cols, { yPercent: -100, duration: 0.7, ease: 'expo.inOut', stagger: { each: 0.05, from: 'center' } });
    },
    [reduced, scrollTo, stopScroll, startScroll]
  );

  return (
    <TransitionContext.Provider value={transitionTo}>
      {children}

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] flex"
        style={{ visibility: 'visible' }}
      >
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              colsRef.current[i] = el;
            }}
            className="h-full flex-1 bg-[#191A18]"
            style={{ marginRight: i < COLUMNS - 1 ? '-1px' : 0 }}
          />
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#F5F2EB]">
          {booting ? (
            <div data-pt-brand className="flex flex-col items-center gap-4">
              <span className="font-serif text-3xl tracking-tight md:text-4xl">Walk The Plan</span>
              <span ref={counterRef} className="text-xs tabular-nums tracking-[0.3em] text-[#B97856]">
                000
              </span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {label ? (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-4xl tracking-tight md:text-6xl"
                >
                  {label}
                </motion.span>
              ) : null}
            </AnimatePresence>
          )}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
