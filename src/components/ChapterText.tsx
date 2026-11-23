import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG, type StoryChapter } from '../config';

interface ChapterTextProps {
  chapter: StoryChapter;
  reducedMotion: boolean;
  onBookWalkthrough: () => void;
  onViewProjects: () => void;
}

/**
 * Magnetic button wrapper using GSAP quickTo on desktop fine pointers.
 */
const MagneticButton: React.FC<{
  children: React.ReactNode;
  className: string;
  onClick: () => void;
  reducedMotion: boolean;
}> = ({ children, className, onClick, reducedMotion }) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = btnRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.2;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.2;
      xTo(dx);
      yTo(dy);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      data-cursor-interactive
      className={className}
    >
      {children}
    </button>
  );
};

function renderLineWithAccent(line: string, accentWord?: string, hasBlueGlow?: boolean) {
  if (!accentWord || !hasBlueGlow || !line.includes(accentWord)) {
    return line;
  }
  const idx = line.indexOf(accentWord);
  const before = line.slice(0, idx);
  const after = line.slice(idx + accentWord.length);

  return (
    <>
      {before}
      <span className="electric-word-glow italic">{accentWord}</span>
      {after}
    </>
  );
}

/**
 * Chapter editorial overlay: lower-left on desktop, centered on mobile.
 * Animates headline lines line-by-line (mask + translateY, 0.8s, power3.out)
 * with sub-copy fading in 150ms later.
 */
export const ChapterText: React.FC<ChapterTextProps> = ({
  chapter,
  reducedMotion,
  onBookWalkthrough,
  onViewProjects,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll('[data-chapter-el]'), {
        clearProps: 'all',
        opacity: 1,
        yPercent: 0,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector('[data-chapter-eyebrow]');
      const lines = root.querySelectorAll('[data-chapter-line]');
      const sub = root.querySelector('[data-chapter-sub]');
      const ctas = root.querySelector('[data-chapter-ctas]');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (eyebrow) {
        tl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
      }

      if (lines.length) {
        tl.fromTo(
          lines,
          { yPercent: 108, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          0.06,
        );
      }

      if (sub) {
        tl.fromTo(sub, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.21);
      }

      if (ctas) {
        tl.fromTo(ctas, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75 }, 0.34);
      }
    }, root);

    return () => ctx.revert();
  }, [chapter.id, reducedMotion]);

  return (
    <div
      ref={containerRef}
      key={chapter.id}
      data-testid="chapter-text"
      data-chapter-id={chapter.id}
      className="pointer-events-none absolute inset-x-0 bottom-24 sm:bottom-24 lg:bottom-20 z-20 px-6 sm:px-10 lg:pl-36 lg:pr-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Eyebrow & chapter counter */}
        <p
          data-chapter-el
          data-chapter-eyebrow
          className="font-ui text-[11px] sm:text-xs font-medium uppercase tracking-[0.28em] text-[#C8A97E]/90 mb-3 sm:mb-4"
        >
          {chapter.eyebrow}
        </p>

        {/* Serif headline with overflow mask for line-by-line reveal */}
        <h1
          data-testid="chapter-headline"
          className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-light leading-[1.04] text-[#F2EEE8] max-w-4xl"
        >
          {chapter.headlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-1">
              <span
                data-chapter-el
                data-chapter-line
                className="inline-block will-change-transform"
              >
                {renderLineWithAccent(line, chapter.accentWord, chapter.hasBlueGlow)}
              </span>
            </span>
          ))}
        </h1>

        {/* Sub-copy / editorial context */}
        {chapter.sub && (
          <p
            data-chapter-el
            data-chapter-sub
            className="font-ui mt-4 sm:mt-6 text-sm sm:text-base md:text-lg font-light leading-relaxed text-[#F2EEE8]/75 max-w-xl will-change-transform"
          >
            {chapter.sub}
          </p>
        )}

        {/* Chapter 6 final dual CTAs */}
        {chapter.showCtas && (
          <div
            data-chapter-el
            data-chapter-ctas
            className="pointer-events-auto mt-7 sm:mt-9 flex flex-wrap items-center gap-4 will-change-transform"
          >
            <MagneticButton
              onClick={onBookWalkthrough}
              reducedMotion={reducedMotion}
              className="group relative inline-flex items-center gap-3 rounded-full bg-[#F2EEE8] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#07090C] transition-all duration-300 hover:bg-[#3DA9FF] hover:text-[#07090C] hover:shadow-[0_0_36px_rgba(61,169,255,0.45)] focus-visible:outline-none"
            >
              <span>{SITE_CONFIG.ctas.primary}</span>
              <ArrowRight className="btn-arrow-slide h-4 w-4" />
            </MagneticButton>

            <button
              type="button"
              onClick={onViewProjects}
              data-cursor-interactive
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#F2EEE8] backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:outline-none cursor-pointer"
            >
              <span>{SITE_CONFIG.ctas.secondary}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
