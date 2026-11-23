import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Minimal desktop-only circular cursor that softly trails the pointer
 * and grows gently over buttons and interactive links.
 */
export const LuxuryCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    const el = dotRef.current;
    if (!el) return;

    let visible = false;
    gsap.set(el, { autoAlpha: 0, scale: 0.7 });

    const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const setExpanded = (expanded: boolean) => {
      el.dataset.expanded = expanded ? 'true' : 'false';
      gsap.to(el, {
        scale: expanded ? 2.4 : 1,
        duration: 0.32,
        ease: 'power3.out',
      });
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = Boolean(
        target.closest('button, a, [data-cursor-interactive]'),
      );
      setExpanded(isInteractive);
    };

    const onLeaveWindow = () => {
      visible = false;
      setExpanded(false);
      gsap.to(el, { autoAlpha: 0, duration: 0.25 });
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
    };
  }, []);

  return <div ref={dotRef} aria-hidden="true" data-expanded="false" className="luxury-cursor" />;
};
