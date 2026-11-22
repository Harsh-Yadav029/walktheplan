import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal, ImageWithFallback } from './MotionPrimitives';
import { AUDIENCE_SOLUTIONS } from '../data/siteContent';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AudienceSectionProps {
  onBookClick: () => void;
}

export function AudienceSection({ onBookClick }: AudienceSectionProps) {
  const [selectedId, setSelectedId] = useState(AUDIENCE_SOLUTIONS[0].id);
  const sectionRef = useRef<HTMLElement | null>(null);
  const active =
    AUDIENCE_SOLUTIONS.find((a) => a.id === selectedId) ?? AUDIENCE_SOLUTIONS[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const panel = section.querySelector<HTMLElement>('[data-audience-panel]');
      const imgWrap = section.querySelector<HTMLElement>('[data-audience-parallax-img]');

      if (panel) {
        gsap.fromTo(
          panel,
          { transformPerspective: 1200, rotateX: 1.8, y: 20 },
          {
            rotateX: -1.0,
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
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedId]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#E8E3D9] text-[#191A18] py-10 md:py-14 border-b border-[#191A18]/10 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                Built For Every Stakeholder
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
                Tailored Spatial Clarity Across Residential &amp; Commercial Teams.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <Reveal delay={0.1}>
              <div
                role="tablist"
                aria-label="Select audience solution"
                className="flex flex-wrap gap-1.5 bg-[#F5F2EB] p-1.5 border border-[#191A18]/10"
              >
                {AUDIENCE_SOLUTIONS.map((item) => {
                  const isActive = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedId(item.id)}
                      className={`px-4 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-[#191A18] text-[#F5F2EB]'
                          : 'text-[#191A18]/75 hover:text-[#191A18]'
                      }`}
                    >
                      {item.audience}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.12} yOffset={30}>
        <div
          data-audience-panel
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch bg-[#F5F2EB] border border-[#191A18]/10 p-6 md:p-10 will-change-transform"
        >
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#B97856] font-medium">
                {active.audience}
              </p>
              <h3 className="mt-3 font-serif text-3xl md:text-4xl leading-[1.12] text-[#191A18]">
                {active.headline}
              </h3>
              <p className="mt-5 text-base leading-[1.75] text-[#77746D]">
                {active.description}
              </p>
            </div>

            <div className="space-y-4 border-t border-[#191A18]/12 pt-6">
              <ul className="space-y-3">
                {active.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-sm text-[#191A18]">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#B97856] shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onBookClick}
                  className="inline-flex items-center gap-2 bg-[#191A18] px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#F5F2EB] hover:bg-[#B97856] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Book Consultation Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] lg:min-h-[420px] overflow-hidden">
              <div
                data-audience-parallax-img
                className="relative w-full h-[126%] -top-[13%] will-change-transform"
              >
                <ImageWithFallback
                  src={active.image}
                  alt={active.imageAlt}
                  className="w-full h-full object-cover"
                  fallbackTitle={active.audience}
                />
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
