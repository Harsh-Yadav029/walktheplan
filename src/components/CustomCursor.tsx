import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { computeFrameAlpha, lerpValue, resolveCursorMode, type CursorMode } from '../lib/cursorLerp';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const targetRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const dotPosRef = useRef({ x: -100, y: -100 });
  const hasPointerRef = useRef(false);
  const modeRef = useRef<CursorMode>('default');

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add('wtp-custom-cursor');
    return () => {
      document.documentElement.classList.remove('wtp-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const setRingX = gsap.quickSetter(ring, 'x', 'px');
    const setRingY = gsap.quickSetter(ring, 'y', 'px');
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');

    const updateModeFromTarget = (el: EventTarget | null) => {
      if (!(el instanceof Element)) {
        if (modeRef.current !== 'default') {
          modeRef.current = 'default';
          setMode('default');
        }
        return;
      }

      const matched = el.closest('[data-cursor], button, a, [role="tab"], [role="button"], input, select, textarea');
      if (!matched) {
        if (modeRef.current !== 'default') {
          modeRef.current = 'default';
          setMode('default');
        }
        return;
      }

      const nextMode = resolveCursorMode({
        explicitCursor: matched.getAttribute('data-cursor'),
        tagName: matched.tagName,
        role: matched.getAttribute('role'),
      });

      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      if (!hasPointerRef.current) {
        hasPointerRef.current = true;
        ringPosRef.current.x = e.clientX;
        ringPosRef.current.y = e.clientY;
        dotPosRef.current.x = e.clientX;
        dotPosRef.current.y = e.clientY;
        setRingX(e.clientX);
        setRingY(e.clientY);
        setDotX(e.clientX);
        setDotY(e.clientY);
        setVisible(true);
      }

      updateModeFromTarget(e.target);
    };

    const handleMouseLeave = () => {
      hasPointerRef.current = false;
      setVisible(false);
    };

    const handleScrollSync = () => {
      if (!hasPointerRef.current) return;
      const underPointer = document.elementFromPoint(targetRef.current.x, targetRef.current.y);
      updateModeFromTarget(underPointer);
    };

    const tick = () => {
      if (!hasPointerRef.current) return;
      const ratio = gsap.ticker.deltaRatio(60);
      const ringAlpha = computeFrameAlpha(0.14, ratio);
      const dotAlpha = computeFrameAlpha(0.45, ratio);

      ringPosRef.current.x = lerpValue(ringPosRef.current.x, targetRef.current.x, ringAlpha);
      ringPosRef.current.y = lerpValue(ringPosRef.current.y, targetRef.current.y, ringAlpha);
      dotPosRef.current.x = lerpValue(dotPosRef.current.x, targetRef.current.x, dotAlpha);
      dotPosRef.current.y = lerpValue(dotPosRef.current.y, targetRef.current.y, dotAlpha);

      setRingX(ringPosRef.current.x);
      setRingY(ringPosRef.current.y);
      setDotX(dotPosRef.current.x);
      setDotY(dotPosRef.current.y);
    };

    gsap.ticker.add(tick);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScrollSync, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScrollSync);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot) return;

    if (!visible) {
      gsap.to([ring, dot], { opacity: 0, duration: 0.2, ease: 'power2.out' });
      return;
    }

    if (mode === 'Explore') {
      gsap.to(ring, {
        width: 76,
        height: 76,
        scale: 1,
        opacity: 1,
        backgroundColor: '#F5F2EB',
        borderColor: 'rgba(25, 26, 24, 0.25)',
        color: '#191A18',
        boxShadow: '0 8px 24px rgba(25, 26, 24, 0.18)',
        duration: 0.34,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { opacity: 0, scale: 0.2, duration: 0.2, overwrite: 'auto' });
      if (label) {
        gsap.fromTo(
          label,
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.24, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    } else if (mode === 'View') {
      gsap.to(ring, {
        width: 76,
        height: 76,
        scale: 1,
        opacity: 1,
        backgroundColor: '#191A18',
        borderColor: 'rgba(245, 242, 235, 0.3)',
        color: '#F5F2EB',
        boxShadow: '0 8px 24px rgba(25, 26, 24, 0.28)',
        duration: 0.34,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { opacity: 0, scale: 0.2, duration: 0.2, overwrite: 'auto' });
      if (label) {
        gsap.fromTo(
          label,
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.24, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    } else if (mode === 'muted') {
      gsap.to(ring, {
        width: 24,
        height: 24,
        scale: 0.7,
        opacity: 0.22,
        backgroundColor: 'rgba(25, 26, 24, 0)',
        borderColor: 'rgba(185, 120, 86, 0.45)',
        boxShadow: 'none',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { opacity: 0.3, scale: 0.65, duration: 0.2, overwrite: 'auto' });
    } else {
      gsap.to(ring, {
        width: 34,
        height: 34,
        scale: 1,
        opacity: 1,
        backgroundColor: 'rgba(25, 26, 24, 0.06)',
        borderColor: 'rgba(185, 120, 86, 0.62)',
        boxShadow: 'none',
        duration: 0.32,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    }
  }, [enabled, visible, mode]);

  if (!enabled) return null;

  const badgeText = mode === 'Explore' || mode === 'View' ? mode : '';

  return (
    <div
      data-testid="custom-cursor"
      data-cursor-mode={mode}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 flex items-center justify-center rounded-full border will-change-transform opacity-0"
        style={{ width: 34, height: 34 }}
      >
        {badgeText && (
          <span
            ref={labelRef}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] select-none"
          >
            {badgeText}
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 rounded-full bg-[#B97856] ring-1 ring-[#F5F2EB]/85 will-change-transform opacity-0"
      />
    </div>
  );
}
