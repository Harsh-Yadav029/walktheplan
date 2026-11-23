import { memo, useRef, useState, useEffect } from 'react';
import { useCinematicMotion } from '../lib/cinematicMotion';
import { Hero } from '../components/Hero';
import { Loader } from '../components/Loader';
import { useFramePreloader } from '../hooks/useFramePreloader';
import { useSmoothScroll } from '../components/SmoothScrollProvider';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HomeTestDriveSection } from '../components/HomeTestDriveSection';
import { ExperienceComparisonSection } from '../components/ExperienceComparisonSection';
import { SpatialConfigurator } from '../components/SpatialConfigurator';
import { ServicesSection } from '../components/ServicesSection';
import { AudienceSection } from '../components/AudienceSection';
import { GallerySection } from '../components/GallerySection';
import { ProcessSection } from '../components/ProcessSection';
import { WhyWalkSection } from '../components/WhyWalkSection';
import { StudioLocatorSection } from '../components/StudioLocatorSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BookingSection } from '../components/BookingSection';
import { ConsultationSection } from '../components/ConsultationSection';
import { FaqSection } from '../components/FaqSection';

interface HomePageProps {
  onScrollToSection: (id: string) => void;
  onBookService: (packageId: string) => void;
  onBookStudio: (studioId: string) => void;
  onBookConfigured: (presetName: string) => void;
  selectedStudioId?: string;
  selectedPackageId?: string;
  presetNote?: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export const HomePage = memo(function HomePage({
  onScrollToSection,
  onBookService,
  onBookStudio,
  onBookConfigured,
  selectedStudioId,
  selectedPackageId,
  presetNote,
}: HomePageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useCinematicMotion(containerRef);

  const reducedMotion = usePrefersReducedMotion();
  const preloader = useFramePreloader(reducedMotion);
  const { scrollTo } = useSmoothScroll();

  // Refresh ScrollTrigger once frames unlock and below-hero sections calculate their offsets
  useEffect(() => {
    if (!preloader.isReady) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    const timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(timer);
    };
  }, [preloader.isReady]);

  return (
    <div
      ref={containerRef}
      className="relative w-full luxury-dark-mode bg-[#141516] text-[#F2EDE5] overflow-x-clip selection:bg-[#C47B52] selection:text-white"
    >
      {/* 0. Minimal Quiet-Luxury Preloader */}
      <Loader visible={!preloader.isReady} progressPct={preloader.initialProgressPct} />

      {/* 1. Cinematic 180-Frame Scroll-Scrubbed Architectural Hero */}
      <Hero
        framesRef={preloader.framesRef}
        loadVersion={preloader.loadVersion}
        reducedMotion={reducedMotion}
        onHeroPassedChange={(passed) => {
          window.dispatchEvent(
            new CustomEvent('wtp-hero-passed', { detail: { passed } })
          );
        }}
        onBookWalkthrough={() => onScrollToSection('#book')}
        onViewProjects={() => onScrollToSection('#gallery')}
        onScrollToY={(targetY) => scrollTo(targetY)}
      />

      {/* 2. India's #1 Home Test Drive Video Showcase */}
      <HomeTestDriveSection
        onBookClick={() => onScrollToSection('#book')}
        onExploreGallery={() => onScrollToSection('#gallery')}
      />

      {/* 3. 1:1 Studio Experience vs Paper & 3D Screens */}
      <ExperienceComparisonSection />

      {/* 4. Interactive 3D Spatial Configurator (OrbitControls + PBR Lighting + Camera Presets) */}
      <SpatialConfigurator onBookConfiguredSession={onBookConfigured} />

      {/* 5. Core Studio Services (Residential, Commercial, Developer, VR Sync) */}
      <ServicesSection onSelectService={onBookService} />

      {/* 6. Who It's For (Architects, Homeowners, Interior Designers, Builders) */}
      <AudienceSection onBookClick={() => onScrollToSection('#book')} />

      {/* 7. Real Studio Gallery Showcase */}
      <GallerySection />

      {/* 8. Four-Step Walkthrough Protocol */}
      <ProcessSection />

      {/* 9. Why Walk The Plan (Financial ROI & Zero Regrets) */}
      <WhyWalkSection />

      {/* 10. Pan-India Studio Locator (5 Cities) */}
      <StudioLocatorSection onBookStudio={onBookStudio} />

      {/* 11. Client & Architect Testimonials */}
      <TestimonialsSection />

      {/* 12. Interactive Booking Engine */}
      <BookingSection
        preselectedStudioId={selectedStudioId}
        preselectedPackageId={selectedPackageId}
        presetNote={presetNote}
      />

      {/* 13. VIP Architect Consultation Banner */}
      <ConsultationSection onBookClick={() => onScrollToSection('#book')} />

      {/* 14. Architectural FAQs Accordion */}
      <FaqSection />
    </div>
  );
});
