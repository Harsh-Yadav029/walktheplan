import { memo } from 'react';
import { ArchitecturalHero } from '../components/ArchitecturalHero';
import { IntroductionSection } from '../components/IntroductionSection';
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

export const HomePage = memo(function HomePage({
  onScrollToSection,
  onBookService,
  onBookStudio,
  onBookConfigured,
  selectedStudioId,
  selectedPackageId,
  presetNote,
}: HomePageProps) {
  return (
    <div className="relative w-full luxury-dark-mode bg-[#141516] text-[#F2EDE5] overflow-hidden selection:bg-[#C47B52] selection:text-white">
      {/* 1. Cinematic Video Hero */}
      <ArchitecturalHero
        onBookClick={() => onScrollToSection('#book')}
        onExploreClick={() => onScrollToSection('#experience')}
      />

      {/* 2. Spatial Reality Over Paper Guesswork (Intro & 1:1 Scale Metrics) */}
      <IntroductionSection />

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
