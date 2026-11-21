import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useTransitionTo } from './PageTransition';
import { BUSINESS_CONTACT, buildWhatsAppUrl } from '../lib/bookingLogic';

interface NavbarProps {
  onBookClick: () => void;
}

const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Services', href: '#services' },
  { label: '3D Studio', href: '#configurator' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Studios', href: '#studios' },
];

export function Navbar({ onBookClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { stopScroll, startScroll } = useSmoothScroll();
  const scrollTo = useTransitionTo();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
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
  }, [mobileOpen, stopScroll, startScroll]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled
            ? 'bg-[#F5F2EB]/95 text-[#191A18] border-b border-[#191A18]/10'
            : 'bg-gradient-to-b from-[#191A18]/75 via-[#191A18]/35 to-transparent text-white'
        }`}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[1360px] items-center justify-between gap-8 px-5 md:px-10">
          {/* Zone 1: Single text element Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#top');
            }}
            className="font-serif text-xl md:text-2xl font-medium tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B97856]"
          >
            Walk The Plan
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#B97856] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B97856] ${
                  scrolled ? 'text-[#191A18]/85' : 'text-white/90'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single primary CTA + Mobile Drawer Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBookClick}
              className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B97856] ${
                scrolled
                  ? 'bg-[#191A18] text-[#F5F2EB] hover:bg-[#B97856]'
                  : 'bg-[#F5F2EB] text-[#191A18] hover:bg-[#B97856] hover:text-white'
              }`}
            >
              <span>Book a Session</span>
            </button>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B97856]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Animated Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-lenis-prevent
            className="fixed inset-0 z-50 bg-[#191A18] text-[#F5F2EB] flex flex-col justify-between p-6 md:p-10 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-medium tracking-tight">Walk The Plan</span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center w-11 h-11 text-[#F5F2EB] hover:text-[#B97856] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex flex-col gap-4 my-auto py-8">
              {[
                { label: 'Home', href: '#top' },
                ...NAV_LINKS,
                { label: 'Process', href: '#process' },
                { label: 'Contact & Consultation', href: '#contact' },
              ].map((item, idx) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.href === '#top') {
                      setMobileOpen(false);
                      scrollTo('#top');
                    } else {
                      handleNavClick(item.href);
                    }
                  }}
                  className="group flex items-baseline justify-between border-b border-white/10 pb-3 font-serif text-3xl text-[#F5F2EB] hover:text-[#B97856] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="font-sans text-xs text-[#77746D] tabular-nums">
                    0{idx + 1}
                  </span>
                </a>
              ))}
            </nav>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onBookClick();
                }}
                className="w-full py-3.5 px-6 bg-[#B97856] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#a66847] transition-colors cursor-pointer"
              >
                Book Your Walkthrough
              </button>
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#F5F2EB]/70">
                <a href={`tel:${BUSINESS_CONTACT.phoneRaw}`} className="hover:text-white">
                  {BUSINESS_CONTACT.phoneDisplay}
                </a>
                <a
                  href={buildWhatsAppUrl(
                    BUSINESS_CONTACT.phoneRaw,
                    'Hello Walk The Plan team, I would like to inquire about a 1:1 studio walkthrough.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <span>WhatsApp Studio Team</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
