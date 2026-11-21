import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { computeMagneticOffset } from '../lib/magneticMath';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function Reveal({ children, className = '', delay = 0, yOffset = 28 }: RevealProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay,
          ease: 'power3.out',
          clearProps: 'transform,willChange',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [delay, yOffset]);

  return (
    <div ref={elRef} data-scroll-reveal className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
  maxOffset?: number;
  innerRatio?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.28,
  maxOffset = 14,
  innerRatio = 0.35,
  disabled = false,
  type = 'button',
  ...rest
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    const inner = innerRef.current;
    if (!btn) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (disabled || reducedMotion || coarsePointer) {
      gsap.set([btn, inner], { x: 0, y: 0 });
      return;
    }

    let returnTween: gsap.core.Tween | null = null;
    let innerReturnTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.42, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.42, ease: 'power3.out' });
      const innerXTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.42, ease: 'power3.out' }) : null;
      const innerYTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.42, ease: 'power3.out' }) : null;

      const handleMouseMove = (e: MouseEvent) => {
        returnTween?.kill();
        innerReturnTween?.kill();

        const rect = btn.getBoundingClientRect();
        const currentX = Number(gsap.getProperty(btn, 'x')) || 0;
        const currentY = Number(gsap.getProperty(btn, 'y')) || 0;

        const { x, y } = computeMagneticOffset({
          clientX: e.clientX,
          clientY: e.clientY,
          rectLeft: rect.left,
          rectTop: rect.top,
          rectWidth: rect.width,
          rectHeight: rect.height,
          currentX,
          currentY,
          strength,
          maxOffset,
        });

        xTo(x);
        yTo(y);
        innerXTo?.(x * innerRatio);
        innerYTo?.(y * innerRatio);
      };

      const handleMouseLeave = () => {
        xTo.tween?.kill();
        yTo.tween?.kill();
        innerXTo?.tween?.kill();
        innerYTo?.tween?.kill();

        returnTween = gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.45)',
        });

        if (inner) {
          innerReturnTween = gsap.to(inner, {
            x: 0,
            y: 0,
            duration: 0.65,
            ease: 'elastic.out(1, 0.45)',
          });
        }
      };

      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, buttonRef);

    return () => {
      returnTween?.kill();
      innerReturnTween?.kill();
      ctx.revert();
    };
  }, [disabled, strength, maxOffset, innerRatio]);

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      data-magnetic-cta
      className={`will-change-transform ${className}`}
      {...rest}
    >
      <span
        ref={innerRef}
        className="inline-flex items-center justify-center [gap:inherit] pointer-events-none will-change-transform"
      >
        {children}
      </span>
    </button>
  );
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  loading?: 'eager' | 'lazy';
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackTitle,
  loading = 'lazy',
}: ImageWithFallbackProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#E8E3D9]">
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        className={className}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div
        className="hidden absolute inset-0 flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#E8E3D9] to-[#D6CFC2] text-[#191A18]"
        aria-hidden="true"
      >
        <span className="font-serif text-xl tracking-tight">
          {fallbackTitle ?? 'Walk The Plan Spatial Studio'}
        </span>
        <span className="mt-1 text-xs text-[#77746D]">1:1 Architectural Visualization</span>
      </div>
    </div>
  );
}
