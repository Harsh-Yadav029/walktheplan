import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/siteContent';
import { MagneticButton } from './MotionPrimitives';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export function HeroSection({ onBookClick, onExploreClick }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgParallaxRef = useRef<HTMLDivElement | null>(null);
  const contentParallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgParallaxRef.current;
    const content = contentParallaxRef.current;
    if (!section || !bg || !content || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(bg, {
        yPercent: 14,
        scale: 1.07,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(content, {
        y: -48,
        opacity: 0.72,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[94vh] w-full flex flex-col justify-end overflow-hidden bg-[#191A18] text-white"
    >
      {/* Full-bleed Studio Photography with subtle editorial zoom & Lenis ScrollTrigger parallax */}
      <motion.div
        initial={prefersReducedMotion ? undefined : { scale: 1.07 }}
        animate={prefersReducedMotion ? undefined : { scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <div ref={bgParallaxRef} className="w-full h-full will-change-transform">
          <img
            src={ASSETS.heroStudio}
            alt="Walk The Plan 1:1 scale architectural blueprint floor projection inside the studio bay"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#191A18] via-[#191A18]/55 to-[#191A18]/30"
          aria-hidden="true"
        />
      </motion.div>

      {/* Main Editorial Hero Content */}
      <div
        ref={contentParallaxRef}
        className="relative z-10 mx-auto w-full max-w-[1360px] px-5 md:px-10 pt-32 pb-12 md:pb-16 will-change-transform"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 text-xs md:text-sm tracking-[0.18em] uppercase text-[#E8E3D9]/85"
            >
              1:1 Architectural Spatial Studio · India
            </motion.p>

            <motion.h1
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(2.5rem,5.2vw,4.75rem)] font-normal leading-[1.03] tracking-[-0.02em] text-white max-w-4xl"
            >
              Experience Your Future Home Before It Exists.
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-2xl text-base md:text-lg font-light leading-relaxed text-[#E8E3D9]/90"
            >
              Step inside your architectural blueprints at actual 1:1 scale. Experience
              dimensions, furniture placement and spatial relationships before construction
              begins.
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center gap-3 bg-[#B97856] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#a66847] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Book Your Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>

              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 border border-white/30 bg-[#191A18]/40 px-6 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-white hover:border-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Explore the Experience</span>
              </button>
            </motion.div>
          </div>

          {/* Minimal Editorial Context & Scroll Cue */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-end gap-5 border-t lg:border-t-0 border-white/15 pt-6 lg:pt-0">
            <div className="text-left lg:text-right text-xs text-[#E8E3D9]/80 space-y-1.5">
              <p className="text-[#E8E3D9] font-medium tracking-wide">
                Gurugram · Dehradun · Varanasi · Hyderabad · Madurai
              </p>
              <p className="text-[#E8E3D9]/70">
                1:1 Laser Projection · Real-Time VR · 3D Validation
              </p>
            </div>

            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#E8E3D9]/75 hover:text-white transition-colors cursor-pointer self-start lg:self-end"
            >
              <span>Scroll to discover</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
