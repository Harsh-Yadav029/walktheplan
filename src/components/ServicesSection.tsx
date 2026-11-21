import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Reveal, ImageWithFallback } from './MotionPrimitives';
import { EDITORIAL_SERVICES } from '../data/siteContent';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onSelectService: (packageId: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector<HTMLElement>('[data-service-header]');
      if (header) {
        gsap.fromTo(
          header,
          { y: 24, opacity: 0.85 },
          {
            y: -10,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: header,
              start: 'top 90%',
              end: 'bottom 25%',
              scrub: 0.75,
            },
          }
        );
      }

      const rows = gsap.utils.toArray<HTMLElement>('[data-service-row]');
      rows.forEach((row) => {
        const mediaFrame = row.querySelector<HTMLElement>('[data-service-media]');
        const parallaxImg = row.querySelector<HTMLElement>('[data-service-parallax-img]');
        const copyCol = row.querySelector<HTMLElement>('[data-service-copy]');
        const numBadge = row.querySelector<HTMLElement>('[data-service-num]');

        if (parallaxImg) {
          gsap.fromTo(
            parallaxImg,
            { yPercent: -8, scale: 1.07 },
            {
              yPercent: 8,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (mediaFrame) {
          gsap.fromTo(
            mediaFrame,
            { transformPerspective: 1200, rotateX: 2.2, y: 24 },
            {
              rotateX: -1.4,
              y: -22,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
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
            { y: 16 },
            {
              y: -14,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.85,
              },
            }
          );
        }

        if (numBadge) {
          gsap.fromTo(
            numBadge,
            { y: 14, opacity: 0.75 },
            {
              y: -12,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                end: 'center center',
                scrub: 0.65,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-[#F5F2EB] text-[#191A18] py-20 md:py-28 border-b border-[#191A18]/10 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div
          data-service-header
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-14 border-b border-[#191A18]/15 will-change-transform"
        >
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                Core Studio Services
              </p>
              <h2 className="font-serif text-[clamp(2.1rem,3.8vw,3.4rem)] leading-[1.08] tracking-[-0.015em]">
                Four Spatial Validation Disciplines Under One Roof.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <Reveal delay={0.08}>
              <p className="text-sm md:text-base text-[#77746D] leading-relaxed">
                Every session combines physical 1:1 scale testing with real-time digital spatial
                tools so homeowners, architects, and developers validate layouts with certainty.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="divide-y divide-[#191A18]/12">
          {EDITORIAL_SERVICES.map((service, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <article
                key={service.id}
                data-service-row
                className="py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
              >
                {/* Image Column with GSAP ScrollTrigger Parallax */}
                <Reveal
                  delay={0.06}
                  className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <div
                    data-service-media
                    data-cursor="View"
                    className="aspect-[4/3] w-full overflow-hidden border border-[#191A18]/10 will-change-transform"
                  >
                    <div
                      data-service-parallax-img
                      className="relative w-full h-[126%] -top-[13%] will-change-transform"
                    >
                      <ImageWithFallback
                        src={service.image}
                        alt={service.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                        fallbackTitle={service.title}
                      />
                    </div>
                  </div>
                </Reveal>

                {/* Editorial Copy Column */}
                <Reveal
                  delay={0.1}
                  className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div data-service-copy className="space-y-6 will-change-transform">
                    <div className="flex items-baseline gap-4">
                      <span
                        data-service-num
                        className="font-serif text-3xl text-[#B97856] tabular-nums inline-block will-change-transform"
                      >
                        {service.number}
                      </span>
                      <span className="text-xs uppercase tracking-[0.16em] text-[#77746D]">
                        {service.subtitle}
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl md:text-4xl leading-[1.12] text-[#191A18]">
                      {service.title}
                    </h3>

                    <p className="text-base leading-[1.75] text-[#191A18]/80 max-w-xl">
                      {service.description}
                    </p>

                    <ul className="space-y-2.5 border-t border-[#191A18]/10 pt-5">
                      {service.highlights.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm text-[#77746D]"
                        >
                          <span className="mt-2 h-1 w-4 shrink-0 bg-[#B97856]" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onSelectService(service.packageId)}
                        className="inline-flex items-center gap-3 border border-[#191A18] px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#191A18] hover:bg-[#191A18] hover:text-[#F5F2EB] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Explore &amp; Book Service</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
