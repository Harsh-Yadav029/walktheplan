import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useTransitionTo } from './components/PageTransition';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { IntroductionSection } from './components/IntroductionSection';
import { ExperienceComparisonSection } from './components/ExperienceComparisonSection';
import { ScrollWalkthrough3D } from './components/ScrollWalkthrough3D';
import { SpatialConfigurator } from './components/SpatialConfigurator';
import { ServicesSection } from './components/ServicesSection';
import { AudienceSection } from './components/AudienceSection';
import { GallerySection } from './components/GallerySection';
import { ProcessSection } from './components/ProcessSection';
import { WhyWalkSection } from './components/WhyWalkSection';
import { StudioLocatorSection } from './components/StudioLocatorSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingSection } from './components/BookingSection';
import { ConsultationSection } from './components/ConsultationSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';

export default function App() {
  const [selectedStudioId, setSelectedStudioId] = useState<string | undefined>(undefined);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);
  const [presetNote, setPresetNote] = useState<string | undefined>(undefined);
  const transitionTo = useTransitionTo();

  const scrollToSection = (id: string) => {
    transitionTo(id);
  };

  const handleBookService = (packageId: string) => {
    setSelectedPackageId(packageId);
    scrollToSection('#book');
  };

  const handleBookStudio = (studioId: string) => {
    setSelectedStudioId(studioId);
    scrollToSection('#book');
  };

  const handleBookConfigured = (presetName: string) => {
    setPresetNote(`Configured 3D layout inquiry: ${presetName}`);
    scrollToSection('#book');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F5F2EB] text-[#191A18]">
        <CustomCursor />
        <ScrollProgress />
        <Navbar onBookClick={() => scrollToSection('#book')} />

        <main>
          <HeroSection
            onBookClick={() => scrollToSection('#book')}
            onExploreClick={() => scrollToSection('#experience')}
          />

          <IntroductionSection />

          <ExperienceComparisonSection />

          <ScrollWalkthrough3D />

          <SpatialConfigurator onBookConfiguredSession={handleBookConfigured} />

          <ServicesSection onSelectService={handleBookService} />

          <AudienceSection onBookClick={() => scrollToSection('#contact')} />

          <GallerySection />

          <ProcessSection />

          <WhyWalkSection />

          <StudioLocatorSection onBookStudio={handleBookStudio} />

          <TestimonialsSection />

          <BookingSection
            preselectedStudioId={selectedStudioId}
            preselectedPackageId={selectedPackageId}
            presetNote={presetNote}
          />

          <ConsultationSection onBookClick={() => scrollToSection('#book')} />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
