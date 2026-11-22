import { useEffect, useState } from 'react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useTransitionTo } from './PageTransition';
import { useRouter } from '../lib/router';
import { InteractiveHoverLinks } from './ui/interactive-hover-links';
import { BottomNavBar, type NavItem } from './ui/bottom-nav-bar';
import { Home, User, Layers, Trophy, LayoutGrid, FileText, MessageCircle } from 'lucide-react';
import './ui/kinetic-nav.css';

interface NavbarProps {
  onBookClick: () => void;
  onOpenStoryDrawer?: () => void;
}

const WHATSAPP_URL =
  'https://wa.me/919711022075?text=' +
  encodeURIComponent('Hello Walk The Plan, I would like to inquire about a 1:1 scale architectural walkthrough session.');

// Menu drawer interactive links matching the design specification
const MENU_INTERACTIVE_LINKS = [
  {
    heading: 'About',
    subheading: 'Our origin story, leadership philosophies & 1:1 scale mission',
    imgSrc:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    href: '/about',
  },
  {
    heading: 'Services',
    subheading: '1:1 Laser Projection, 3D Wall Extrusion & Spatial Validation',
    imgSrc:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    href: '/services',
  },
  {
    heading: 'Franchise',
    subheading: 'Partner with Walk The Plan — Studio expansion across India',
    imgSrc:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    href: '/franchise',
  },
  {
    heading: 'Gallery',
    subheading: 'Browse real-scale architectural walkthrough projects',
    imgSrc:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    href: '/gallery',
  },
  {
    heading: 'Blog',
    subheading: 'Architectural guides, floor plan mistake checklists & cost insights',
    imgSrc:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    href: '/blog',
  },
  {
    heading: 'WhatsApp',
    subheading: 'Connect directly with our spatial architects via chat',
    imgSrc:
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    href: WHATSAPP_URL,
  },
  {
    heading: 'Book Your Appointment',
    subheading: 'Schedule your dedicated 1:1 blueprint walkthrough session',
    imgSrc:
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    href: '#book',
  },
];

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function SparkleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

export function Navbar({ onBookClick, onOpenStoryDrawer }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [inHero, setInHero] = useState(true);

  const { stopScroll, startScroll } = useSmoothScroll();
  const scrollTo = useTransitionTo();
  const router = useRouter();

  const normalizedPath = router.pathname.replace(/\/$/, '') || '/';
  const isHomePage = normalizedPath === '/';
  const isAboutPage = normalizedPath === '/about';
  const isServicesPage = normalizedPath === '/services';
  const isFranchisePage = normalizedPath === '/franchise';
  const isGalleryPage = normalizedPath === '/gallery';
  const isBlogPage = normalizedPath === '/blog';
  const isDarkPage = isAboutPage || isServicesPage || isFranchisePage || isGalleryPage || isBlogPage;

  const navBarItems: NavItem[] = [
    { label: 'Home', icon: Home, onClick: () => router.navigate('/') },
    { label: 'About', icon: User, onClick: () => router.navigate('/about') },
    { label: 'Services', icon: Layers, onClick: () => router.navigate('/services') },
    { label: 'Franchise', icon: Trophy, onClick: () => router.navigate('/franchise') },
    { label: 'Gallery', icon: LayoutGrid, onClick: () => router.navigate('/gallery') },
    { label: 'Blog', icon: FileText, onClick: () => router.navigate('/blog') },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      onClick: () => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer'),
    },
  ];

  const activeNavIndex = isHomePage
    ? 0
    : isAboutPage
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

  // Pause smooth scroll when menu is active
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      stopScroll();
    } else {
      document.body.style.overflow = '';
      startScroll();
    }
    return () => {
      document.body.style.overflow = '';
      startScroll();
    };
  }, [isMenuOpen, stopScroll, startScroll]);

  // Escape key closes menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  // Synchronize with 3D Hero walkthrough timeline
  useEffect(() => {
    if (isDarkPage) {
      setInHero(false);
      return;
    }

    const onHeroScroll = (e: Event) => {
      const customEvent = e as CustomEvent<{ progress: number; active: boolean }>;
      if (customEvent.detail) {
        setHeroProgress(customEvent.detail.progress);
        setInHero(customEvent.detail.active && customEvent.detail.progress < 0.999);
      }
    };

    window.addEventListener('wtp-hero-progress', onHeroScroll);

    const handleScroll = () => {
      const y = window.scrollY;
      const heroHeight = window.innerHeight * 4.5;
      if (y >= heroHeight) {
        setInHero(false);
      } else if (y < 48) {
        setInHero(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wtp-hero-progress', onHeroScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDarkPage]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (href: string) => {
    closeMenu();
    if (href.startsWith('https://wa.me')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (href === '#book') {
      if (isDarkPage) {
        router.navigate('/#book');
      } else {
        onBookClick();
      }
      return;
    }
    if (href.startsWith('/')) {
      router.navigate(href);
      return;
    }
    if (isDarkPage) {
      router.navigate('/' + href);
      return;
    }
    scrollTo(href);
  };

  return (
    <div>
      {/* Sticky/Fixed Header Bar: 100% Transparent during Hero, Sticky Glass when Scrolled Past Hero */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          inHero && !isDarkPage
            ? 'bg-transparent border-b border-transparent shadow-none text-[#F2EDE5]'
            : 'bg-[#181A1B]/85 backdrop-blur-md border-b border-[#C47B52]/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-[#F2EDE5]'
        }`}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8 md:px-10">
          {/* Brand Wordmark */}
          <div className="flex items-center shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                router.navigate('/');
              }}
              className="font-serif text-xl md:text-2xl font-medium tracking-tight text-[#F2EDE5] hover:text-[#C47B52] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#C47B52]"
            >
              Walk The Plan
            </a>
          </div>

          {/* Desktop & Responsive Animated Pill Navigation Bar (Perfect Center Alignment) */}
          <div className="hidden md:flex flex-1 justify-center items-center px-4">
            <BottomNavBar
              items={navBarItems}
              activeIndex={activeNavIndex}
              className="bg-[#1E2021]/80 border-white/10 h-11 px-2 shadow-lg min-w-0"
            />
          </div>

          {/* Right Controls: BOOK YOUR APPOINTMENT Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* BOOK YOUR APPOINTMENT Gold/Yellow Pill Button */}
            <button
              type="button"
              onClick={onBookClick}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EED77A]"
            >
              <SparkleIcon className="w-3.5 h-3.5 text-[#191A18]" />
              <span className="whitespace-nowrap">BOOK YOUR APPOINTMENT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Kinetic Drawer with Interactive Hover Links Animation */}
      <section
        className={`fullscreen-menu-container ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          visibility: isMenuOpen ? 'visible' : 'hidden',
          overflow: 'hidden',
        }}
      >
        <div
          data-nav={isMenuOpen ? 'open' : 'closed'}
          className={`nav-overlay-wrapper ${isMenuOpen ? 'is-open' : ''}`}
          style={{
            display: isMenuOpen ? 'block' : 'none',
            overflow: 'hidden',
          }}
        >
          {/* Backdrop Blur Overlay */}
          <div
            className="overlay"
            onClick={closeMenu}
            style={{ opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? 'auto' : 'none' }}
          />

          {/* Drawer Slide Panel */}
          <nav
            className="menu-content"
            style={{
              transform: isMenuOpen ? 'translateX(0%)' : 'translateX(100%)',
              pointerEvents: isMenuOpen ? 'auto' : 'none',
            }}
          >
            {/* Background Graphic Layers */}
            <div className="menu-bg">
              <div className="backdrop-layer first" />
              <div className="backdrop-layer second" />
              <div className="backdrop-layer" />
            </div>

            {/* Menu Content Wrapper with Interactive Hover Links */}
            <div className="menu-content-wrapper">
              {/* Header inside drawer */}
              <div className="mb-4 pb-3 border-b border-[#C47B52]/25 flex items-center justify-end">
                <button
                  type="button"
                  onClick={closeMenu}
                  className="px-3 py-1 rounded-full border border-white/20 text-[11px] font-mono tracking-wider uppercase text-[#F2EDE5] hover:border-[#C47B52] hover:text-[#C47B52] transition-colors cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Interactive Hover Links with Spring Letters, Mouse Float Tilt & Arrows */}
              <InteractiveHoverLinks
                links={MENU_INTERACTIVE_LINKS}
                onItemClick={handleNavClick}
              />

              {/* Footer inside menu */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A5A7A4]">
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline"
                  >
                    Direct Architect Consultation via WhatsApp
                  </a>
                </div>
                <div className="font-mono text-[11px] text-[#F2EDE5]/60">
                  Gurugram · Dehradun · Hyderabad · Madurai
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
