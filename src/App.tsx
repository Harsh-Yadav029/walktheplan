import { useState, useEffect } from 'react';
import { MotionConfig, AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTransitionTo } from './components/PageTransition';
import { useRouter } from './lib/router';
import { Navbar } from './components/Navbar';
import { StoryDrawer } from './components/StoryDrawer';
import { BottomNavBar, type NavItem } from './components/ui/bottom-nav-bar';
import { Home, User, Layers, Trophy, LayoutGrid, FileText } from 'lucide-react';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { FranchisePage } from './pages/FranchisePage';
import { GalleryPage } from './pages/GalleryPage';
import { BlogPage } from './pages/BlogPage';
import { ArchitecturalHero } from './components/ArchitecturalHero';
import { IntroductionSection } from './components/IntroductionSection';
import { ExperienceComparisonSection } from './components/ExperienceComparisonSection';
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
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';

export default function App() {
  const router = useRouter();
  const [selectedStudioId, setSelectedStudioId] = useState<string | undefined>(undefined);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);
  const [presetNote, setPresetNote] = useState<string | undefined>(undefined);
  const [isStoryDrawerOpen, setIsStoryDrawerOpen] = useState(false);
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

  const normalizedPath = router.pathname.replace(/\/$/, '') || '/';
  const isAboutPage = normalizedPath === '/about';
  const isServicesPage = normalizedPath === '/services';
  const isFranchisePage = normalizedPath === '/franchise';
  const isGalleryPage = normalizedPath === '/gallery';
  const isBlogPage = normalizedPath === '/blog';
  const isDarkPage = isAboutPage || isServicesPage || isFranchisePage || isGalleryPage || isBlogPage;

  const mobileNavItems: NavItem[] = [
    { label: 'Home', icon: Home, onClick: () => router.navigate('/') },
    { label: 'About', icon: User, onClick: () => router.navigate('/about') },
    { label: 'Services', icon: Layers, onClick: () => router.navigate('/services') },
    { label: 'Franchise', icon: Trophy, onClick: () => router.navigate('/franchise') },
    { label: 'Gallery', icon: LayoutGrid, onClick: () => router.navigate('/gallery') },
    { label: 'Blog', icon: FileText, onClick: () => router.navigate('/blog') },
  ];

  const activeMobileIndex = isAboutPage
    ? 1
    : isServicesPage
    ? 2
    : isFranchisePage
    ? 3
    : isGalleryPage
    ? 4
    : isBlogPage
    ? 5
    : 0;

  // Refresh ScrollTrigger and scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [normalizedPath]);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen ${isDarkPage ? 'bg-[#181A1B] text-[#F2EDE5]' : 'bg-[#F5F2EB] text-[#191A18]'} overflow-x-hidden w-full max-w-full`}>
        <CustomCursor />
        {!isDarkPage && <ScrollProgress />}
        
        <Navbar
          onBookClick={() => {
            if (isDarkPage) {
              router.navigate('/#book');
            } else {
              scrollToSection('#book');
            }
          }}
          onOpenStoryDrawer={() => setIsStoryDrawerOpen(true)}
        />

        {/* 21st.dev Interactive Story Drawer available across pages */}
        <StoryDrawer
          open={isStoryDrawerOpen}
          onOpenChange={setIsStoryDrawerOpen}
        />

        <main className={`relative z-10 w-full ${isDarkPage ? 'bg-[#181A1B] border-b border-white/10' : 'bg-[#F5F2EB] border-b border-[#191A18]/10'} shadow-[0_20px_50px_rgba(0,0,0,0.8)]`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={normalizedPath}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {isAboutPage ? (
                <AboutPage />
              ) : isServicesPage ? (
                <ServicesPage />
              ) : isFranchisePage ? (
                <FranchisePage />
              ) : isGalleryPage ? (
                <GalleryPage />
              ) : isBlogPage ? (
                <BlogPage />
              ) : (
                <>
                  {/* World-Class Cinematic 3D Hero (Graphite & Copper) */}
                  <ArchitecturalHero
                    onBookClick={() => scrollToSection('#book')}
                    onExploreClick={() => scrollToSection('#experience')}
                  />

                  <IntroductionSection />

                  <ExperienceComparisonSection />

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

                  <FaqSection />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />

        {/* Floating Animated Bottom Nav Bar for Mobile / Tablet Viewports */}
        <div className="md:hidden">
          <BottomNavBar
            items={mobileNavItems}
            activeIndex={activeMobileIndex}
            stickyBottom
          />
        </div>
      </div>
    </MotionConfig>
  );
}

