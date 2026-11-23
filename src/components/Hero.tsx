import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'motion/react';
import { SITE_CONFIG } from '../config';
import {
  getActiveChapterIndex,
  getChapterJumpProgress,
  getLetterboxFactor,
  progressToFrameIndex,
} from '../utils/frameScrubMath';
import { FrameCanvas, type FrameCanvasHandle } from './FrameCanvas';
import { ChapterText } from './ChapterText';
import { ProgressRail } from './ProgressRail';

gsap.registerPlugin(ScrollTrigger);

export interface HeroProps {
  framesRef: React.MutableRefObject<Array<HTMLImageElement | null>>;
  loadVersion: number;
  reducedMotion: boolean;
  onHeroPassedChange: (passed: boolean) => void;
  onBookWalkthrough: () => void;
  onViewProjects: () => void;
  onScrollToY: (targetY: number) => void;
}

/**
 * Scroll-driven cinematic 180-frame architectural hero.
 * - Pins for 500vh on desktop and 350vh on mobile with tactile scrub: 0.1.
 * - Maps scroll progress 0 -> 1 to frames 0 -> 179 and 6 editorial chapters.
 * - Flashes a single sweeping electric-blue line when Chapter 2 ("THE SPARK") begins.
 * - Eases subtle 2.35:1 letterbox bars during chapter transitions + subtle film grain.
 * - Respects prefers-reduced-motion with static poster frame 180 and final CTAs.
 */
export const Hero: React.FC<HeroProps> = ({
  framesRef,
  loadVersion,
  reducedMotion,
  onHeroPassedChange,
  onBookWalkthrough,
  onViewProjects,
  onScrollToY,
}) => {
  const triggerRef = useRef<HTMLElement | null>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const canvasHandleRef = useRef<FrameCanvasHandle | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);

  const initialFrameIdx = reducedMotion ? SITE_CONFIG.frames.posterFrameIndex : 0;
  const initialChapterIdx = reducedMotion ? SITE_CONFIG.chapters.length - 1 : 0;

  const frameIndexRef = useRef<number>(initialFrameIdx);
  const progressRef = useRef<number>(reducedMotion ? 1 : 0);

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(initialChapterIdx);
  const [scrollProgress, setScrollProgress] = useState<number>(reducedMotion ? 1 : 0);
  const [scrolledPastStart, setScrolledPastStart] = useState<boolean>(false);
  const [inHeroView, setInHeroView] = useState<boolean>(true);
  const [sparkKey, setSparkKey] = useState<number>(0);
  const sparkHasFiredRef = useRef<boolean>(false);

  // Trigger repaint whenever newly decoded frames arrive from background preloading
  useEffect(() => {
    canvasHandleRef.current?.renderFrame(true);
  }, [loadVersion]);

  // Set up GSAP ScrollTrigger pinning + frame-wise scrub
  useEffect(() => {
    const section = triggerRef.current;
    if (!section) return;

    if (reducedMotion) {
      frameIndexRef.current = SITE_CONFIG.frames.posterFrameIndex;
      progressRef.current = 1;
      setActiveChapterIndex(SITE_CONFIG.chapters.length - 1);
      setScrollProgress(1);
      canvasHandleRef.current?.renderFrame(true);

      const reducedSt = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          setInHeroView(false);
          onHeroPassedChange(true);
        },
        onEnterBack: () => {
          setInHeroView(true);
          onHeroPassedChange(false);
        },
      });
      scrollTriggerInstanceRef.current = reducedSt;

      return () => {
        reducedSt.kill();
        scrollTriggerInstanceRef.current = null;
      };
    }

    const mm = gsap.matchMedia();

    const createHeroTrigger = (pinVh: number) => {
      const scrubState = { progress: 0 };

      const tween = gsap.to(scrubState, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round((pinVh / 100) * window.innerHeight)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: SITE_CONFIG.frames.scrubInertia,
          invalidateOnRefresh: true,
          onLeave: () => {
            setInHeroView(false);
            onHeroPassedChange(true);
          },
          onEnterBack: () => {
            setInHeroView(true);
            onHeroPassedChange(false);
          },
        },
        onUpdate: () => {
          const p = scrubState.progress;
          progressRef.current = p;

          const nextFrameIdx = progressToFrameIndex(p, SITE_CONFIG.frames.totalFrames);
          const frameChanged = nextFrameIdx !== frameIndexRef.current;
          frameIndexRef.current = nextFrameIdx;

          if (frameChanged) {
            // Imperative zero-alloc canvas repaint
            canvasHandleRef.current?.renderFrame();

            // Direct DOM update for subtle frame counter in lower-right
            if (counterRef.current) {
              counterRef.current.textContent = `${String(nextFrameIdx + 1).padStart(3, '0')} / ${SITE_CONFIG.frames.totalFrames}`;
            }
          }

          const frame1Based = nextFrameIdx + 1;
          const nextChapterIdx = getActiveChapterIndex(frame1Based, SITE_CONFIG.chapters);

          setActiveChapterIndex((prev) => {
            if (prev !== nextChapterIdx) {
              // Flash sweeping electric-blue line once when Chapter 2 ("THE SPARK") starts
              const nextCh = SITE_CONFIG.chapters[nextChapterIdx];
              if (nextCh?.hasSparkFlash && !sparkHasFiredRef.current) {
                sparkHasFiredRef.current = true;
                setSparkKey((k) => k + 1);
              }
              return nextChapterIdx;
            }
            return prev;
          });

          // Direct DOM updates for 2.35:1 letterbox bars (no React re-render thrash)
          const factor = getLetterboxFactor(frame1Based, SITE_CONFIG.chapters);
          const maxBarPx = Math.max(24, Math.min(56, window.innerHeight * 0.055));
          const barPx = Math.round(factor * maxBarPx);
          if (topBarRef.current && bottomBarRef.current) {
            topBarRef.current.style.height = `${barPx}px`;
            bottomBarRef.current.style.height = `${barPx}px`;
          }

          // Smooth scroll indicator fade toggle
          if (p > 0.05) {
            setScrolledPastStart(true);
          } else if (p <= 0.02) {
            setScrolledPastStart(false);
          }

          // Update progress rail state throttled to significant step intervals
          setScrollProgress((prev) => (Math.abs(prev - p) > 0.015 || p === 0 || p === 1 ? p : prev));
        },
      });

      scrollTriggerInstanceRef.current = tween.scrollTrigger ?? null;
    };

    mm.add('(min-width: 768px)', () => {
      createHeroTrigger(SITE_CONFIG.frames.desktopPinVh);
    });

    mm.add('(max-width: 767px)', () => {
      createHeroTrigger(SITE_CONFIG.frames.mobilePinVh);
    });

    return () => {
      mm.revert();
      scrollTriggerInstanceRef.current = null;
    };
  }, [reducedMotion, onHeroPassedChange]);

  const handleSelectChapter = useCallback(
    (chapterIndex: number) => {
      const st = scrollTriggerInstanceRef.current;
      if (!st || reducedMotion) return;
      const targetProgress = getChapterJumpProgress(
        chapterIndex,
        SITE_CONFIG.chapters,
        SITE_CONFIG.frames.totalFrames,
      );
      const targetY = st.start + (st.end - st.start) * targetProgress;
      onScrollToY(targetY);
    },
    [onScrollToY, reducedMotion],
  );

  const activeChapter = SITE_CONFIG.chapters[activeChapterIndex] ?? SITE_CONFIG.chapters[0];
  const showScrollHint = !reducedMotion && !scrolledPastStart;

  return (
    <section
      ref={triggerRef}
      id="hero-experience"
      aria-label="Walk The Plan architectural sequence"
      data-testid="hero-section"
      data-active-chapter={activeChapter.id}
      data-current-frame={frameIndexRef.current + 1}
      className="relative h-screen w-full overflow-hidden bg-[#07090C]"
    >
      {/* Full-viewport DPR-aware sequential frame canvas with imperative draw handle */}
      <FrameCanvas
        ref={canvasHandleRef}
        framesRef={framesRef}
        frameIndexRef={frameIndexRef}
        progressRef={progressRef}
        renderSignal={loadVersion}
        ariaLabel={`${SITE_CONFIG.brand.name} — ${activeChapter.title}: ${activeChapter.headlineLines.join(' ')}`}
      />

      {/* Subtle animated film grain overlay */}
      <div aria-hidden="true" className="film-grain-overlay z-10" />

      {/* Chapter 2 one-time sweeping electric-blue light streak */}
      {sparkKey > 0 && (
        <div
          key={`spark-${sparkKey}`}
          aria-hidden="true"
          data-testid="spark-flash"
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        >
          <div className="spark-sweep-line absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-transparent via-[#3DA9FF]/65 to-transparent blur-[2px]" />
          <div className="spark-sweep-line absolute inset-y-0 left-0 w-[2px] bg-[#9AD5FF] shadow-[0_0_24px_4px_rgba(61,169,255,0.9)]" />
        </div>
      )}

      {/* Subtle 2.35:1 cinematic letterbox bars easing in/out during chapter transitions */}
      <div
        ref={topBarRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-[#07090C] transition-[height] duration-200 ease-out"
        style={{ height: '0px' }}
      />
      <div
        ref={bottomBarRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-[#07090C] transition-[height] duration-200 ease-out"
        style={{ height: '0px' }}
      />

      {/* Synchronized Chapter Editorial Typography + Chapter 6 CTAs */}
      <ChapterText
        chapter={activeChapter}
        reducedMotion={reducedMotion}
        onBookWalkthrough={onBookWalkthrough}
        onViewProjects={onViewProjects}
      />

      {/* Left-edge 6-tick Progress Rail (visible while inside the Hero sequence) */}
      {inHeroView && !reducedMotion && (
        <ProgressRail
          chapters={SITE_CONFIG.chapters}
          activeChapterIndex={activeChapterIndex}
          progress={scrollProgress}
          onSelectChapter={handleSelectChapter}
        />
      )}

      {/* Subtle frame counter & brand descriptor in lower-right (desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:flex absolute right-10 bottom-16 z-20 flex-col items-end gap-1.5 text-right"
      >
        <span
          ref={counterRef}
          className="font-mono-tech text-[11px] tracking-[0.18em] text-[#F2EEE8]/55"
        >
          {String(frameIndexRef.current + 1).padStart(3, '0')} / {SITE_CONFIG.frames.totalFrames}
        </span>
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C8A97E]/75">
          {SITE_CONFIG.brand.tagline}
        </span>
      </div>

      {/* Bottom-center "Scroll" indicator — fades out after first 5% of scroll */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            data-testid="scroll-indicator"
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5"
          >
            <span className="font-ui text-[10px] uppercase tracking-[0.24em] text-[#F2EEE8]/65">
              Scroll
            </span>
            <div className="relative h-9 w-px overflow-hidden bg-white/15">
              <div className="scroll-indicator-line absolute inset-0 bg-gradient-to-b from-transparent via-[#3DA9FF] to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
