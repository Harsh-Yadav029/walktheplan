import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Expand, X } from 'lucide-react';
import { Reveal, ImageWithFallback } from './MotionPrimitives';
import { useSmoothScroll } from './SmoothScrollProvider';
import { GALLERY_ITEMS, type GalleryItem } from '../data/siteContent';

gsap.registerPlugin(ScrollTrigger);

type GalleryFilter = 'All' | GalleryItem['category'];

const FILTERS: GalleryFilter[] = [
  'All',
  '1:1 Projection Studio',
  'VR Walkthroughs',
  '3D Visualization',
];

export function GallerySection() {
  const [filter, setFilter] = useState<GalleryFilter>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { stopScroll, startScroll } = useSmoothScroll();

  const visibleItems =
    filter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter);

  useEffect(() => {
    if (lightboxItem) {
      stopScroll();
    } else {
      startScroll();
    }
    return () => startScroll();
  }, [lightboxItem, stopScroll, startScroll]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector<HTMLElement>('[data-gallery-header]');
      if (header) {
        gsap.fromTo(
          header,
          { y: 20 },
          {
            y: -12,
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

      const cards = gsap.utils.toArray<HTMLElement>('[data-gallery-card]');
      cards.forEach((card, idx) => {
        const isOdd = idx % 2 === 1;
        const parallaxImg = card.querySelector<HTMLElement>('[data-gallery-parallax-img]');

        gsap.fromTo(
          card,
          {
            transformPerspective: 1200,
            rotateX: isOdd ? 2.8 : 2.0,
            y: isOdd ? 40 : 22,
          },
          {
            rotateX: isOdd ? -1.4 : -0.9,
            y: isOdd ? -26 : -12,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        );

        if (parallaxImg) {
          gsap.fromTo(
            parallaxImg,
            { yPercent: -8, scale: 1.08 },
            {
              yPercent: 8,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [filter]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="bg-[#F5F2EB] text-[#191A18] py-20 md:py-28 border-b border-[#191A18]/10 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div
          data-gallery-header
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 will-change-transform"
        >
          <Reveal>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
              Studio &amp; Spatial Gallery
            </p>
            <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
              Inside Walk The Plan Studios.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="self-start lg:self-auto">
            <div
              role="tablist"
              aria-label="Filter gallery by studio discipline"
              className="flex flex-wrap gap-1.5 bg-[#E8E3D9] p-1.5 border border-[#191A18]/10"
            >
              {FILTERS.map((cat) => {
                const active = filter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(cat)}
                    className={`px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#191A18] text-[#F5F2EB]'
                        : 'text-[#191A18]/75 hover:text-[#191A18]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Asymmetric Masonry Editorial Grid with GSAP ScrollTrigger Parallax */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {visibleItems.map((item, idx) => {
            const spanClass =
              item.aspect === 'wide'
                ? 'md:col-span-7'
                : item.aspect === 'tall'
                  ? 'md:col-span-5'
                  : 'md:col-span-6';
            const heightClass =
              item.aspect === 'wide'
                ? 'h-[320px] md:h-[400px]'
                : item.aspect === 'tall'
                  ? 'h-[360px] md:h-[400px]'
                  : 'h-[320px] md:h-[360px]';

            return (
              <Reveal key={item.id} delay={idx * 0.05} className={spanClass}>
                <figure
                  data-gallery-card
                  className="group border border-[#191A18]/10 bg-white will-change-transform"
                >
                  <div
                    data-cursor="View"
                    className={`relative w-full ${heightClass} overflow-hidden`}
                  >
                    <div
                      data-gallery-parallax-img
                      className="relative w-full h-[126%] -top-[13%] will-change-transform"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        fallbackTitle={item.title}
                      />
                    </div>
                    <button
                      type="button"
                      data-cursor="View"
                      onClick={() => setLightboxItem(item)}
                      aria-label={`Inspect ${item.title} full screen`}
                      className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 bg-[#191A18]/90 text-[#F5F2EB] px-3 py-2 text-xs font-medium hover:bg-[#B97856] transition-colors cursor-pointer"
                    >
                      <Expand className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                  <figcaption className="p-5 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#77746D]">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.location}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#191A18]">{item.title}</h3>
                    <p className="text-sm text-[#77746D] leading-relaxed">{item.caption}</p>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Accessible Lightbox */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-[#191A18]/95 text-[#F5F2EB] flex flex-col justify-between p-5 md:p-10"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-[#E8E3D9]/80 flex items-center gap-2">
              <span>{lightboxItem.category}</span>
              <span aria-hidden="true">·</span>
              <span>{lightboxItem.location}</span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close full-screen image viewer"
              className="inline-flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:bg-[#B97856] hover:border-[#B97856] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-auto mx-auto max-w-5xl w-full max-h-[72vh] overflow-hidden flex items-center justify-center">
            <img
              src={lightboxItem.image}
              alt={lightboxItem.alt}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] w-auto object-contain"
            />
          </div>

          <div className="max-w-3xl">
            <h3 className="font-serif text-2xl md:text-3xl text-white">{lightboxItem.title}</h3>
            <p className="mt-1 text-sm text-[#E8E3D9]/80">{lightboxItem.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
