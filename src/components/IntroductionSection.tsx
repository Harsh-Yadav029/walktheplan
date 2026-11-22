import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal, ImageWithFallback } from './MotionPrimitives';
import { ASSETS } from '../data/siteContent';

gsap.registerPlugin(ScrollTrigger);

export function IntroductionSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const imgWrap = section.querySelector<HTMLElement>('[data-intro-parallax-img]');
      const figureFrame = section.querySelector<HTMLElement>('[data-intro-figure]');
      const copyCol = section.querySelector<HTMLElement>('[data-intro-copy]');

      if (imgWrap) {
        gsap.fromTo(
          imgWrap,
          { yPercent: -8, scale: 1.07 },
          {
            yPercent: 8,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (figureFrame) {
        gsap.fromTo(
          figureFrame,
          { transformPerspective: 1200, rotateX: 2, y: 24 },
          {
            rotateX: -1.2,
            y: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.85,
            },
          }
        );
      }

      if (copyCol) {
        gsap.fromTo(
          copyCol,
          { y: 12 },
          {
            y: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.85,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#F5F2EB] text-[#191A18] py-10 md:py-14 border-b border-[#191A18]/10 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Left Editorial Column */}
          <div
            data-intro-copy
            className="lg:col-span-6 flex flex-col justify-between gap-10 will-change-transform"
          >
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-4">
                Spatial Reality Over Paper Guesswork
              </p>
              <h2 className="font-serif text-[clamp(2.2rem,3.8vw,3.5rem)] leading-[1.08] tracking-[-0.015em] text-[#191A18]">
                Where Vision Meets Living Scale.
              </h2>
            </Reveal>

            <Reveal delay={0.08} className="space-y-6 text-base leading-[1.75] text-[#191A18]/80 max-w-xl">
              <p>
                A home is one of the biggest investments a person makes in their lifetime. Yet, for decades, homeowners have been forced to make critical, life-altering decisions based solely on flat blueprints and digital screens. With over 8 years of architectural and site execution experience, our founders recognized a common heartbreak: "People struggle to truly understand a space before it is built."
              </p>
              <p>
                Walk The Plan bridges the gap between imagination and physical reality. Inside our calibrated studios, your proposed floor plan is projected onto the floor at exact 1:1 scale so you can walk every room, arrange real modular furniture, verify door clearances, and achieve collaborative Day-1 Plan Freeze before a single brick is laid.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#191A18]/15 pt-8">
                <div>
                  <p className="font-serif text-3xl text-[#191A18] tabular-nums">1:1</p>
                  <p className="mt-1 text-xs text-[#77746D] leading-relaxed">
                    Exact physical blueprint scale projected underfoot
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-[#191A18] tabular-nums">5 Studios</p>
                  <p className="mt-1 text-xs text-[#77746D] leading-relaxed">
                    Active experience centers across North & South India
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-[#191A18] tabular-nums">Day 1</p>
                  <p className="mt-1 text-xs text-[#77746D] leading-relaxed">
                    Stakeholder consensus & collaborative plan freeze
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Portrait Image Column with ScrollTrigger Parallax */}
          <Reveal delay={0.1} className="lg:col-span-6">
            <figure
              data-intro-figure
              className="relative h-full min-h-[420px] lg:min-h-[600px] flex flex-col will-change-transform"
            >
              <div data-cursor="View" className="flex-1 overflow-hidden">
                <div
                  data-intro-parallax-img
                  className="relative w-full h-[126%] -top-[13%] will-change-transform"
                >
                  <ImageWithFallback
                    src={ASSETS.introBlueprint}
                    alt="Architect and homeowner examining stone and oak material samples over a true 1:1 projected floor plan"
                    className="w-full h-full object-cover object-center"
                    fallbackTitle="1:1 Architectural Floor Projection"
                  />
                </div>
              </div>
              <figcaption className="mt-3 flex items-center justify-between text-xs text-[#77746D]">
                <span>Live 1:1 floor plan calibration & material review</span>
                <span>Studio Walkthrough</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
