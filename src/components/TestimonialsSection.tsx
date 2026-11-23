import { useEffect, useState, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Star,
  Sparkles,
  Quote,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, ImageWithFallback } from './MotionPrimitives';
import { useSmoothScroll } from './SmoothScrollProvider';
import { VERIFIED_TESTIMONIALS, TestimonialItem } from '../data/siteContent';

const AUTOPLAY_DURATION_MS = 7500;

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const { stopScroll, startScroll } = useSmoothScroll();

  const current: TestimonialItem = VERIFIED_TESTIMONIALS[currentIndex];

  // Freeze smooth scroll when modal opens
  useEffect(() => {
    if (videoModalOpen) {
      stopScroll();
    } else {
      startScroll();
    }
    return () => startScroll();
  }, [videoModalOpen, stopScroll, startScroll]);

  // Navigate functions
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % VERIFIED_TESTIMONIALS.length);
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + VERIFIED_TESTIMONIALS.length) % VERIFIED_TESTIMONIALS.length);
    setProgress(0);
  }, []);

  const selectSlide = useCallback((targetIndex: number) => {
    if (targetIndex === currentIndex) return;
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentIndex(targetIndex);
    setProgress(0);
  }, [currentIndex]);

  // Autoplay timer with progress bar
  useEffect(() => {
    if (!isPlaying || isHovered || videoModalOpen) return;

    const intervalStep = 50;
    const progressIncrement = (intervalStep / AUTOPLAY_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, videoModalOpen, goToNext]);

  // Ensure preview video autoplays safely when current changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = isMuted;
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented; fallback silent
        });
      }
    }
  }, [currentIndex, isMuted]);

  // Toggle preview sound
  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <section
      id="testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full py-16 md:py-24 bg-[#141516] text-[#F2EDE5] border-b border-white/10 overflow-hidden select-none outline-none"
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#C47B52]/10 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[#EED77A]/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-calligraphy text-3xl sm:text-4xl text-[#EED77A] tracking-wide select-none">
                Voices of Living Scale
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A]">
              <Sparkles className="w-3.5 h-3.5 text-[#C47B52]" />
              <span>Proven Across 500+ Residential &amp; Commercial Projects</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.08]">
              Trusted by Architects &amp; Homeowners Across India.
            </h2>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3 self-start lg:self-end">
            {/* Play / Pause Autoplay button */}
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause carousel autoplay' : 'Resume carousel autoplay'}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-[#191A18]/80 hover:bg-[#202223] text-xs font-mono text-[#A5A7A4] hover:text-[#F2EDE5] transition-all cursor-pointer backdrop-blur-md"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#EED77A]" />
                  <span className="hidden sm:inline">Auto</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#C47B52]" />
                  <span className="hidden sm:inline">Paused</span>
                </>
              )}
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous testimonial"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-[#191A18]/80 text-[#F2EDE5] hover:border-[#C47B52]/50 hover:bg-[#C47B52]/20 hover:text-[#EED77A] transition-all cursor-pointer backdrop-blur-md shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Index Counter */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/10 bg-[#191A18]/80 text-xs font-mono tabular-nums text-[#A5A7A4] backdrop-blur-md">
              <span className="text-white font-semibold">0{currentIndex + 1}</span>
              <span className="text-white/30">/</span>
              <span>0{VERIFIED_TESTIMONIALS.length}</span>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next testimonial"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-[#191A18]/80 text-[#F2EDE5] hover:border-[#C47B52]/50 hover:bg-[#C47B52]/20 hover:text-[#EED77A] transition-all cursor-pointer backdrop-blur-md shadow-lg active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Linear progress timer bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-[#C47B52] to-[#EED77A] transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Carousel Showcase Card */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-3xl bg-gradient-to-b from-[#1C1E20]/95 via-[#161718]/95 to-[#121314]/98 border border-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden p-6 sm:p-8 lg:p-12 transition-all"
        >
          {/* Subtle Corner Accents */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#C47B52]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#EED77A]/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
            >
              {/* Left Column: Editorial Testimonial & Social Proof */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                {/* Badges & Meta */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category chip */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-wider text-[#EED77A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {current.category}
                    </span>

                    {/* Studio location */}
                    {current.location && (
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-[#A5A7A4]">
                        📍 {current.location}
                      </span>
                    )}

                    {/* Verified Year */}
                    {current.year && (
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#A5A7A4]">
                        {current.year} Verified
                      </span>
                    )}
                  </div>

                  {/* 5-Star Rating & ROI Highlight Pill */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="flex items-center gap-1 text-[#EED77A]" aria-label="5 star rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#EED77A] text-[#EED77A]" />
                      ))}
                    </div>
                    {current.metric && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-[#EED77A]/10 border border-[#EED77A]/25 text-xs font-mono font-medium text-[#EED77A]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#EED77A]" />
                        {current.metric}
                      </span>
                    )}
                  </div>
                </div>

                {/* The Quote */}
                <div className="relative py-2">
                  <Quote className="absolute -top-3 -left-3 w-10 h-10 text-[#C47B52]/20 pointer-events-none" />
                  <blockquote className="relative z-10 font-serif text-2xl sm:text-3xl lg:text-[2.15rem] leading-[1.32] text-[#F2EDE5] font-light">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>
                  <p className="mt-3 text-xs sm:text-sm text-[#C47B52] font-mono tracking-wide">
                    ✦ {current.highlight}
                  </p>
                </div>

                {/* Author Credential Block & CTAs */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#C47B52] to-[#EED77A] shadow-md flex-shrink-0">
                      <img
                        src={current.avatar || current.posterImage}
                        alt={current.author}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          // Fallback to studio poster on error
                          (e.target as HTMLImageElement).src = current.posterImage;
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-medium text-white tracking-tight">
                        {current.author}
                      </h4>
                      <p className="text-xs text-[#A5A7A4] font-sans mt-0.5">
                        <span className="text-[#F2EDE5]">{current.role}</span> · {current.organization}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setVideoModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C47B52]/40 bg-[#C47B52]/10 hover:bg-[#C47B52]/20 text-xs font-mono uppercase tracking-wider text-[#EED77A] transition-all cursor-pointer group shadow-sm active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 text-[#EED77A] group-hover:scale-110 transition-transform" />
                      <span>Watch Reel</span>
                    </button>
                    <a
                      href="#book"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-wider text-[#F2EDE5] hover:text-white transition-all cursor-pointer"
                    >
                      <span>Book 1:1</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Cinematic Video / Media Reel */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-[#0D0E0F] shadow-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] group">
                  {/* Active Video Player */}
                  {current.videoUrl ? (
                    <video
                      ref={videoRef}
                      key={current.videoUrl}
                      src={current.videoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      preload="metadata"
                      poster={current.posterImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageWithFallback
                      src={current.posterImage}
                      alt={current.videoLabel}
                      className="w-full h-full object-cover"
                      fallbackTitle={current.videoLabel}
                    />
                  )}

                  {/* Dark gradient overlay at bottom for legible captions */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider text-[#EED77A] pointer-events-auto">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      1:1 STUDIO REEL
                    </span>

                    {/* Audio & Expand controls */}
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      {current.videoUrl && (
                        <button
                          type="button"
                          onClick={handleToggleSound}
                          aria-label={isMuted ? 'Unmute preview video' : 'Mute preview video'}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md transition-transform hover:scale-105 cursor-pointer shadow-lg"
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-[#A5A7A4]" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-[#EED77A]" />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setVideoModalOpen(true)}
                        aria-label="Expand walkthrough reel fullscreen"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md transition-transform hover:scale-105 cursor-pointer shadow-lg"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#F2EDE5]" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Video Caption & Trigger */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={() => setVideoModalOpen(true)}
                      className="w-full text-left p-3 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 backdrop-blur-md transition-colors cursor-pointer group/caption"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-wider text-[#C47B52]">
                            {current.category}
                          </p>
                          <p className="font-serif text-sm sm:text-base text-white group-hover/caption:text-[#EED77A] transition-colors font-medium truncate">
                            {current.videoLabel}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#C47B52]/20 border border-[#C47B52]/40 flex items-center justify-center text-[#EED77A] flex-shrink-0 group-hover/caption:scale-110 transition-transform">
                          <Play className="w-3.5 h-3.5 fill-[#EED77A]" />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Interactive Partner Selector Tabs */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {VERIFIED_TESTIMONIALS.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSlide(idx)}
                aria-label={`Select testimonial by ${item.author}`}
                className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1C1E20] border-[#C47B52] shadow-[0_10px_25px_-5px_rgba(196,123,82,0.25)]'
                    : 'bg-[#141516]/80 border-white/10 hover:border-white/20 hover:bg-[#181A1B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full overflow-hidden border p-0.5 flex-shrink-0 ${
                      isActive ? 'border-[#EED77A]' : 'border-white/20'
                    }`}
                  >
                    <img
                      src={item.avatar || item.posterImage}
                      alt={item.author}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.posterImage;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-serif text-sm font-medium truncate ${
                        isActive ? 'text-[#EED77A]' : 'text-[#F2EDE5]'
                      }`}
                    >
                      {item.author}
                    </p>
                    <p className="text-[11px] font-mono text-[#A5A7A4] truncate">
                      {item.location || item.organization}
                    </p>
                  </div>
                </div>

                {/* Active Underline Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeTestimonialPill"
                    className="absolute -bottom-px left-4 right-4 h-[2px] bg-gradient-to-r from-[#C47B52] to-[#EED77A]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Inspection Modal */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.videoLabel}
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-[#0E0F10]/95 backdrop-blur-2xl text-[#F2EDE5] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="max-w-4xl w-full bg-[#181A1B] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#C47B52]">
                  {current.category} · {current.location}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1">
                  {current.videoLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                aria-label="Close walkthrough reel modal"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:bg-[#C47B52] hover:border-[#C47B52] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative border border-white/10">
              {current.videoUrl ? (
                <video
                  ref={modalVideoRef}
                  src={current.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={current.posterImage}
                  alt={current.videoLabel}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Transcribed pull-quote & author details */}
            <div className="rounded-2xl bg-black/40 border border-white/10 p-5 space-y-2">
              <blockquote className="font-serif text-lg sm:text-xl text-[#F2EDE5] font-light leading-snug">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                <p className="text-xs font-mono text-[#EED77A]">
                  {current.author} — {current.role}, {current.organization}
                </p>
                {current.metric && (
                  <span className="text-xs font-mono text-emerald-400">
                    Verified Result: {current.metric}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
