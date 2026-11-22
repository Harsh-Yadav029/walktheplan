import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 4.5;
      setInHero(window.scrollY < heroHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`pointer-events-none fixed top-0 left-0 right-0 z-[45] h-[2px] bg-transparent transition-opacity duration-300 ${
        inHero ? 'opacity-0' : 'opacity-100'
      }`}
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
