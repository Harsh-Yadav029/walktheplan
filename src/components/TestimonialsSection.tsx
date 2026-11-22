import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { Reveal, ImageWithFallback } from './MotionPrimitives';
import { useSmoothScroll } from './SmoothScrollProvider';
import { VERIFIED_TESTIMONIALS } from '../data/siteContent';

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { stopScroll, startScroll } = useSmoothScroll();

  useEffect(() => {
    if (videoModalOpen) {
      stopScroll();
    } else {
      startScroll();
    }
    return () => startScroll();
  }, [videoModalOpen, stopScroll, startScroll]);

  const current = VERIFIED_TESTIMONIALS[index];

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + VERIFIED_TESTIMONIALS.length) % VERIFIED_TESTIMONIALS.length);
  };
  const handleNext = () => {
    setIndex((prev) => (prev + 1) % VERIFIED_TESTIMONIALS.length);
  };

  return (
    <section className="bg-[#E8E3D9] text-[#191A18] py-10 md:py-14 border-b border-[#191A18]/10">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
              Industry Perspectives &amp; Studio Highlights
            </p>
            <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
              Trusted by Architects &amp; Homeowners Across India.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="inline-flex items-center justify-center w-11 h-11 border border-[#191A18]/20 bg-[#F5F2EB] text-[#191A18] hover:bg-[#191A18] hover:text-[#F5F2EB] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs tabular-nums text-[#77746D]">
                0{index + 1} / 0{VERIFIED_TESTIMONIALS.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="inline-flex items-center justify-center w-11 h-11 border border-[#191A18]/20 bg-[#F5F2EB] text-[#191A18] hover:bg-[#191A18] hover:text-[#F5F2EB] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} yOffset={30}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#F5F2EB] border border-[#191A18]/10 p-6 md:p-10">
          {/* Quote Column */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="flex items-center gap-2 text-xs text-[#77746D]">
              <span className="text-[#B97856] font-medium">{current.category}</span>
              <span aria-hidden="true">·</span>
              <span>{current.highlight}</span>
            </div>

            <blockquote className="font-serif text-2xl md:text-4xl leading-[1.28] text-[#191A18]">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div className="border-t border-[#191A18]/12 pt-5 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="font-medium text-base text-[#191A18]">{current.author}</p>
                <p className="text-xs text-[#77746D] mt-0.5">
                  {current.role} · {current.organization}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#B97856] hover:text-[#191A18] transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>View Walkthrough Reel Summary</span>
              </button>
            </div>
          </div>

          {/* Video / Studio Preview Poster */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[280px] overflow-hidden bg-[#191A18]">
              <ImageWithFallback
                src={current.posterImage}
                alt={current.videoLabel}
                className="w-full h-full object-cover opacity-85"
                fallbackTitle={current.videoLabel}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#191A18]/80 via-transparent to-transparent"
                aria-hidden="true"
              />
              <button
                type="button"
                data-cursor="View"
                onClick={() => setVideoModalOpen(true)}
                aria-label={`Open ${current.videoLabel}`}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white group cursor-pointer"
              >
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#B97856] text-white group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 ml-0.5" />
                </span>
                <span className="text-xs uppercase tracking-[0.16em] text-[#F5F2EB]">
                  {current.videoLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
        </Reveal>
      </div>

      {/* Studio Reel Inspection Modal */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.videoLabel}
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-[#191A18]/92 text-[#F5F2EB] flex items-center justify-center p-5"
        >
          <div className="max-w-3xl w-full bg-[#191A18] border border-white/15 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#B97856]">
                  {current.category}
                </p>
                <h3 className="font-serif text-2xl text-white mt-1">{current.videoLabel}</h3>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                aria-label="Close walkthrough reel modal"
                className="inline-flex items-center justify-center w-10 h-10 border border-white/20 text-white hover:bg-[#B97856] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full overflow-hidden bg-[#141513] relative">
              <img
                src={current.posterImage}
                alt={current.videoLabel}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-5">
                <p className="font-serif text-xl text-white">&ldquo;{current.quote}&rdquo;</p>
                <p className="mt-2 text-xs text-[#E8E3D9]/80">
                  {current.author} — {current.role}, {current.organization}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
