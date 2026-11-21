import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: reducedMotion ? true : 0.12,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      data-testid="scroll-progress-track"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[45] h-[2px] bg-transparent"
    >
      <div
        ref={barRef}
        data-testid="scroll-progress-bar"
        className="h-full w-full origin-left bg-[#B97856] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
