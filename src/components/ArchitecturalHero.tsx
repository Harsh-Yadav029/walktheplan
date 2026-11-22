import { useState, useRef, useCallback } from 'react';
import { ArrowRight, ChevronRight, Volume2, VolumeX, Compass } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useTransitionTo } from './PageTransition';
import './cinematic.css';

interface ArchitecturalHeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export function ArchitecturalHero({ onBookClick, onExploreClick }: ArchitecturalHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const { scrollTo } = useSmoothScroll();
  const transitionTo = useTransitionTo();

  const handleBook = useCallback(() => {
    scrollTo('#book');
    onBookClick();
  }, [scrollTo, onBookClick]);

  const handleExplore = useCallback(() => {
    transitionTo('#experience');
    onExploreClick();
  }, [transitionTo, onExploreClick]);

  const toggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
        if (!next) {
          videoRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-[92vh] md:min-h-screen w-full max-w-full bg-[#141516] text-[#F2EDE5] overflow-hidden flex flex-col justify-between pt-28 pb-16 px-5 sm:px-8 lg:px-12 select-none"
    >
      {/* 1. Cinematic Background Video Layer (Autoplay, muted/unmuted toggle, loop) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.15]"
          src="/videos/hero-cinematic.mp4"
        />
        {/* Cinematic dark luxury gradient scrim for perfect contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141516] via-[#141516]/40 to-[#141516]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141516]/80 via-transparent to-[#141516]/80 pointer-events-none" />
      </div>

      {/* 2. Top Status & Audio Toggle Bar */}
      <div className="relative z-10 mx-auto max-w-[1360px] w-full flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-mono uppercase tracking-widest text-[#EED77A]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Pan-India 1:1 Experience Centers</span>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/15 text-[#F2EDE5] hover:text-[#C47B52] transition-all cursor-pointer shadow-lg"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="text-xs font-mono">Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#C47B52]" />
              <span className="text-xs font-mono text-[#EED77A]">Audio On</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Hero Centerpiece Typography & CTAs */}
      <div className="relative z-10 mx-auto max-w-4xl w-full text-center my-auto py-12 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono tracking-widest uppercase text-[#EED77A]">
          <Compass className="w-3.5 h-3.5 text-[#C47B52]" />
          <span>Spatial Reality Over Paper Guesswork</span>
        </div>

        <h1 className="font-sora text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-[#F2EDE5] leading-[1.06]">
          Don't just imagine it.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C47B52] via-[#E09067] to-[#EED77A]">
            Walk it.
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl font-light text-[#A5A7A4] max-w-2xl mx-auto leading-relaxed">
          Step inside your future architectural layouts at actual 1:1 scale before construction begins across Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.
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

      {/* 4. Telemetry / Metric Pillars */}
      <div className="relative z-10 mx-auto max-w-[1360px] w-full pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div>
            <p className="font-mono text-2xl font-bold text-[#EED77A]">1:1 Scale</p>
            <p className="text-xs text-[#A5A7A4] mt-0.5">True Physical Floor Projection</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-[#F2EDE5]">5 Studios</p>
            <p className="text-xs text-[#A5A7A4] mt-0.5">Gurugram, Dehradun, Varanasi, Hyd, Madurai</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-[#C47B52]">100% Certainty</p>
            <p className="text-xs text-[#A5A7A4] mt-0.5">Eliminates Post-Build Layout Regrets</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-[#F2EDE5]">Day 1 Freeze</p>
            <p className="text-xs text-[#A5A7A4] mt-0.5">Fast Stakeholder & Architect Consensus</p>
          </div>
        </div>
      </div>
    </section>
  );
}
