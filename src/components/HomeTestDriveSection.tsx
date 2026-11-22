import { useState, useRef } from 'react';
import { ArrowRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useRouter } from '../lib/router';

interface HomeTestDriveSectionProps {
  onBookClick?: () => void;
  onExploreGallery?: () => void;
}

export function HomeTestDriveSection({
  onBookClick,
  onExploreGallery,
}: HomeTestDriveSectionProps) {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleAudio = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section
      id="test-drive"
      className="relative w-full py-12 md:py-20 bg-[#141516] text-[#F2EDE5] border-b border-white/10 overflow-hidden select-none"
    >
      {/* Subtle Warm Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[450px] bg-[#C47B52]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#EED77A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: SaaS-Grade Architectural Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center">
            {/* Script Kicker */}
            <p className="font-calligraphy text-3xl sm:text-4xl text-[#EED77A] tracking-wide mb-2 select-none">
              The Blueprint Revolution
            </p>

            {/* National Capsule Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EED77A]/10 border border-[#EED77A]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A] mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#EED77A]" />
              <span>✦ INDIA'S 1:1 HOME EXPERIENCE</span>
            </div>

            {/* Editorial Heading */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F2EDE5] leading-[1.1] mb-5">
              INDIA'S #1 HOME<br />
              <span className="font-calligraphy text-5xl sm:text-6xl lg:text-7xl font-normal text-[#EED77A] inline-block mt-1">
                Test Drive.
              </span>
            </h2>

            {/* Subheading */}
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-tight mb-4">
              Don't Just Imagine Your Home. Walk Into It.
            </h3>

            {/* Narrative Paragraph */}
            <p className="text-base sm:text-lg text-[#A5A7A4] font-light leading-relaxed max-w-xl mb-8">
              Your floor plan is more than lines on paper. At Walk The Plan, experience your future home at actual{' '}
              <strong className="text-white font-medium">1:1 scale</strong>. Explore every room, feel the proportions, discover design conflicts and make every decision with confidence — before construction begins.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#EED77A] to-[#D8BA58] hover:from-[#F5E296] hover:to-[#EED77A] text-[#191A18] font-bold px-7 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(238,215,122,0.35)] hover:shadow-[0_0_40px_rgba(238,215,122,0.55)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>RESERVE YOUR EXPERIENCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onExploreGallery) {
                    onExploreGallery();
                  } else {
                    router.navigate('/gallery');
                  }
                }}
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[#F2EDE5] border border-white/15 hover:border-[#C47B52] px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>EXPLORE THE STUDIO</span>
              </button>
            </div>

            {/* SaaS Micro-Tagline */}
            <div className="pt-6 mt-8 border-t border-white/10 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EED77A] animate-pulse" />
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#A5A7A4] font-medium">
                DESIGNED TO BE EXPERIENCED. BUILT TO BE PERFECTED.
              </p>
            </div>
          </div>

          {/* Right Column: 9:16 Vertical Video Reel Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative aspect-[9/16] w-full max-w-[280px] sm:max-w-[320px] rounded-3xl overflow-hidden border border-white/15 bg-black/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 group">
              
              {/* Native Video Player */}
              <video
                ref={videoRef}
                src="/videos/studio/file-1795272408152-290883819.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fall back to studio video 8 if needed
                  e.currentTarget.src = '/videos/studio/8.mp4';
                }}
              />

              {/* Top-Right Interactive Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleAudio}
                title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
                aria-label={isMuted ? 'Turn Sound On' : 'Mute Sound'}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/25 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/85 hover:border-[#EED77A] transition-all shadow-lg cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/80" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#EED77A]" />
                )}
              </button>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none">
                <p className="text-xs sm:text-sm font-mono text-white/95 tracking-wide font-medium leading-tight">
                  1:1 Floor Projection walkthrough in action
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HomeTestDriveSection;
