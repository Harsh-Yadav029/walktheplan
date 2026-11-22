"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight, Compass, Ruler, Move, CheckCircle2 } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useTransitionTo } from './PageTransition';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CONFIGURATION & TUNING CONSTANTS
// ============================================================================
// Total frames available in public/frames/
const TOTAL_FRAMES = 300;

// Path generator for extracted frames: ezgif-frame-001.jpg ... ezgif-frame-300.jpg
function getFramePath(frameNumber: number): string {
  const padded = String(frameNumber).padStart(3, '0');
  return `/frames/ezgif-frame-${padded}.jpg`;
}

interface ArchitecturalHeroProps {
  onBookClick?: () => void;
  onExploreClick?: () => void;
}

export function ArchitecturalHero({
  onBookClick,
  onExploreClick,
}: ArchitecturalHeroProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // In-memory cache holding preloaded HTMLImageElement instances
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

  // Render tracking refs to prevent re-renders and enforce RAF repainting
  const currentFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const isMobileRef = useRef<boolean>(false);

  // Component UI State
  const [loadProgress, setLoadProgress] = useState(0);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const { scrollTo } = useSmoothScroll();
  const transitionTo = useTransitionTo();

  const handleBook = useCallback(() => {
    if (onBookClick) onBookClick();
    else scrollTo('#book');
  }, [onBookClick, scrollTo]);

  const handleExplore = useCallback(() => {
    if (onExploreClick) onExploreClick();
    else transitionTo('#experience');
  }, [onExploreClick, transitionTo]);

  // --------------------------------------------------------------------------
  // 1. CANVAS DRAW FUNCTION (Fail-Safe Nearest Frame + Cover Math)
  // --------------------------------------------------------------------------
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retrieve requested image from cache or find closest valid loaded frame
    let img = imagesRef.current.get(frameIndex);
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let delta = 1; delta <= 40; delta++) {
        const prev = imagesRef.current.get(frameIndex - delta);
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current.get(frameIndex + delta);
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    // Fallback: If still not found, search Frame 1 or ANY loaded frame in cache
    if (!img || !img.complete || img.naturalWidth === 0) {
      const f1 = imagesRef.current.get(1);
      if (f1 && f1.complete && f1.naturalWidth > 0) {
        img = f1;
      } else {
        for (const [_, loadedImg] of imagesRef.current.entries()) {
          if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
            img = loadedImg;
            break;
          }
        }
      }
    }

    // If no valid image is available yet, don't clear the canvas
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (iw === 0 || ih === 0) return;

    // Aspect-ratio "Cover" algorithm (completely fills canvas without distortion)
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const dx = (cw - nw) / 2;
    const dy = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, nw, nh);
  }, []);

  // --------------------------------------------------------------------------
  // 2. CANVAS SIZING & DPR CAPPING
  // --------------------------------------------------------------------------
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    const frameToDraw = currentFrameRef.current >= 1 ? currentFrameRef.current : 1;
    drawFrame(frameToDraw);
  }, [drawFrame]);

  // --------------------------------------------------------------------------
  // 3. PROGRESSIVE FRAME PRELOADING
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setIsReducedMotion(true);
      return;
    }

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;

    // Priority 1: Immediately fetch Frame 1 and render it on canvas
    const img1 = new Image();
    img1.src = getFramePath(1);
    const onFrame1Ready = () => {
      imagesRef.current.set(1, img1);
      currentFrameRef.current = 1;
      setIsFirstFrameReady(true);
      resizeCanvas();
      drawFrame(1);
    };

    if (img1.complete && img1.naturalWidth > 0) {
      onFrame1Ready();
    } else {
      img1.onload = onFrame1Ready;
      img1.onerror = onFrame1Ready;
    }

    // Priority 2: Preload remaining frames
    // Mobile loads every 2nd frame; Desktop loads all frames
    const step = isMobile ? 2 : 1;
    const remainingFrames: number[] = [];
    for (let i = 2; i <= TOTAL_FRAMES; i += step) {
      remainingFrames.push(i);
    }
    if (remainingFrames[remainingFrames.length - 1] !== TOTAL_FRAMES) {
      remainingFrames.push(TOTAL_FRAMES);
    }

    let loadedCount = 1; // frame 1 already handled
    const totalToLoad = remainingFrames.length + 1;

    remainingFrames.forEach((frameNum) => {
      const img = new Image();
      img.src = getFramePath(frameNum);

      const checkFinish = () => {
        imagesRef.current.set(frameNum, img);
        loadedCount++;
        const pct = Math.min(100, Math.round((loadedCount / totalToLoad) * 100));
        setLoadProgress(pct);

        // If the current frame was pending and just loaded, repaint it
        if (currentFrameRef.current === frameNum) {
          drawFrame(frameNum);
        }
      };

      if (img.complete && img.naturalWidth > 0) {
        checkFinish();
      } else {
        img.onload = checkFinish;
        img.onerror = checkFinish;
      }
    });

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame, resizeCanvas]);

  // --------------------------------------------------------------------------
  // 4. GSAP SCROLLTRIGGER SCRUB (TALL CONTAINER + CSS STICKY VIEWPORT)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (isReducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let targetFrame = 1;

    // Use ScrollTrigger on the 350vh-400vh container without 'pin: true'
    // CSS 'sticky top-0' handles viewport locking cleanly and prevents any transform bugs
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        setScrollProgress(progress);

        // Notify Navbar of active hero state & progress
        window.dispatchEvent(
          new CustomEvent('wtp-hero-progress', {
            detail: { progress, active: self.isActive },
          })
        );

        // SCROLL-TO-FRAME CALCULATION:
        // Progress 0.00 -> Frame 1
        // Progress 1.00 -> Frame 300
        targetFrame = Math.min(
          Math.max(Math.floor(progress * (TOTAL_FRAMES - 1)) + 1, 1),
          TOTAL_FRAMES
        );

        // Snap to nearest loaded frame on mobile
        if (isMobileRef.current && targetFrame % 2 === 0 && targetFrame < TOTAL_FRAMES) {
          targetFrame -= 1;
        }

        // Repaint only when the frame index changes
        if (targetFrame !== currentFrameRef.current) {
          currentFrameRef.current = targetFrame;
          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = requestAnimationFrame(() => {
            drawFrame(targetFrame);
          });
        }

        // Choreograph narrative stages:
        if (progress < 0.33) {
          setActiveStage(1);
        } else if (progress < 0.66) {
          setActiveStage(2);
        } else {
          setActiveStage(3);
        }
      },
    });

    // Initial draw
    resizeCanvas();

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      resizeCanvas();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      st.kill();
    };
  }, [isReducedMotion, drawFrame, resizeCanvas]);

  // --------------------------------------------------------------------------
  // REDUCED MOTION STATIC FALLBACK
  // --------------------------------------------------------------------------
  if (isReducedMotion) {
    return (
      <section className="relative min-h-screen w-full bg-[#141516] text-[#F2EDE5] flex items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-6">
          <span className="text-xs font-mono text-[#C47B52] uppercase tracking-widest">
            Walk The Plan • 1:1 Scale Studio
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight">
            Don't just imagine it. <br />
            <span className="text-[#C47B52]">Walk it.</span>
          </h1>
          <p className="text-base text-[#A5A7A4]">
            Where vision meets living scale. Step inside your architectural layouts at actual 1:1 scale before construction begins across Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleBook}
              className="bg-[#C47B52] text-white px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider"
            >
              Book Studio Walkthrough
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={sectionRef}
      id="top"
      className="relative w-full h-[350vh] sm:h-[400vh] bg-[#141516] select-none"
    >
      {/* 
        STICKY VIEWPORT:
        Holds in place for the full 350-400vh container without requiring GSAP pin:true,
        preventing parent CSS transform breakage and mobile viewport jitter.
      */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-[#141516]">
        {/* Full-screen 3D Blueprint Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block object-cover z-0"
        />

        {/* Subtle Dark Luxury Vignette & Left Gradient for Maximum Text Legibility */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#141516] via-transparent to-[#141516]/60" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#141516]/85 via-[#141516]/40 to-transparent max-w-3xl" />

        {/* --------------------------------------------------------------------
            A. TOP TELEMETRY BAR
        --------------------------------------------------------------------- */}
        <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 px-5 sm:px-8 max-w-[1360px] mx-auto flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono uppercase tracking-widest text-[#EED77A]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SCALE 1:1 • CALIBRATED • STUDIO PROJECTION ACTIVE</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-[#A5A7A4] bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <span>
              FRAME: {String(currentFrameRef.current >= 1 ? currentFrameRef.current : 1).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span>STAGE: 0{activeStage} / 03</span>
            {loadProgress < 100 && (
              <>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-[#C47B52] text-[10px]">Preload: {loadProgress}%</span>
              </>
            )}
          </div>
        </div>

        {/* --------------------------------------------------------------------
            B. CHOREOGRAPHED NARRATIVE OVERLAYS (STAGES 1, 2, 3)
        --------------------------------------------------------------------- */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8 pointer-events-none">
          <div className="max-w-[1360px] w-full mx-auto">
            {/* STAGE 1: 0% to 33% */}
            {activeStage === 1 && (
              <div className="max-w-xl space-y-4 p-6 sm:p-8 rounded-2xl bg-black/65 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/20 border border-[#C47B52]/40 text-[11px] font-mono uppercase tracking-widest text-[#EED77A]">
                  <Ruler className="w-3.5 h-3.5 text-[#C47B52]" />
                  <span>Stage 01 • 2D CAD to Laser Grid</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F2EDE5] leading-[1.08]">
                  Precision 2D Vectors Morph to 1:1 Scale
                </h1>
                <p className="text-sm sm:text-base text-[#A5A7A4] font-light leading-relaxed max-w-lg">
                  Laser-calibrated architectural lines draw across a dark void. Exact dimensional markers define rooms and Vastu alignments before physical geometry lifts.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#EED77A]/90">
                  <span>↓ Scroll down to lift 3D walls & test clearances</span>
                </div>
              </div>
            )}

            {/* STAGE 2: 33% to 66% */}
            {activeStage === 2 && (
              <div className="max-w-xl space-y-4 p-6 sm:p-8 rounded-2xl bg-black/65 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/20 border border-[#C47B52]/40 text-[11px] font-mono uppercase tracking-widest text-[#EED77A]">
                  <Move className="w-3.5 h-3.5 text-[#C47B52]" />
                  <span>Stage 02 • Spatial Scale & Furniture</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F2EDE5] leading-[1.08]">
                  Test Clearances Before Concrete is Poured
                </h2>
                <p className="text-sm sm:text-base text-[#A5A7A4] font-light leading-relaxed max-w-lg">
                  Place modular rolling sofas, beds, and dining islands directly inside your projected layout. Catch door-swing clashes and tight corridor bottlenecks early.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#EED77A]/90">
                  <span>↓ Scroll further to enter the finished studio walkthrough</span>
                </div>
              </div>
            )}

            {/* STAGE 3: 66% to 100% (Grand Final Presentation & CTAs) */}
            {activeStage === 3 && (
              <div className="text-center max-w-3xl mx-auto space-y-6 pointer-events-auto p-8 sm:p-10 rounded-2xl bg-black/75 backdrop-blur-lg border border-white/15 shadow-2xl transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono tracking-widest uppercase text-[#EED77A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C47B52]" />
                  <span>The Definitive Pre-Build Reality</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F2EDE5] leading-[1.06]">
                  Don't just imagine it.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C47B52] via-[#E09067] to-[#EED77A]">
                    Walk it.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#A5A7A4] max-w-xl mx-auto leading-relaxed font-light">
                  Where vision meets living scale. Step inside your future architectural layouts at actual 1:1 scale before construction begins across Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleBook}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#C47B52] hover:bg-[#A85E43] px-8 py-4 text-xs font-mono font-semibold uppercase tracking-[0.18em] text-white transition-all shadow-xl hover:shadow-[#C47B52]/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer rounded-xl"
                  >
                    <span>Book Your Experience</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleExplore}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#C47B52] bg-white/5 hover:bg-white/10 px-7 py-4 text-xs font-mono uppercase tracking-[0.18em] text-[#F2EDE5] transition-all cursor-pointer rounded-xl backdrop-blur-sm"
                  >
                    <span>Explore Our Technology</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --------------------------------------------------------------------
            C. BOTTOM SCRUB TIMELINE BAR
        ------------------------------------------------------------------- */}
        <div className="absolute bottom-6 left-5 right-5 sm:left-12 sm:right-12 z-20 pointer-events-none">
          <div className="max-w-[1360px] mx-auto flex items-center gap-4 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
            <span className="text-[11px] font-mono text-[#A5A7A4] uppercase tracking-wider">
              Scrub Timeline
            </span>
            <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C47B52] via-[#E09067] to-[#EED77A] transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-[#EED77A]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
