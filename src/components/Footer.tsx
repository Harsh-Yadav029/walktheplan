import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, X } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import {
  BUSINESS_CONTACT,
  STUDIO_LOCATIONS,
  buildWhatsAppUrl,
} from '../lib/bookingLogic';
import { EDITORIAL_SERVICES } from '../data/siteContent';

gsap.registerPlugin(ScrollTrigger);

type LegalDoc = 'privacy' | 'terms' | null;

export function Footer() {
  const [legalModal, setLegalModal] = useState<LegalDoc>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const { stopScroll, startScroll } = useSmoothScroll();

  useEffect(() => {
    if (legalModal) {
      stopScroll();
    } else {
      startScroll();
    }
    return () => startScroll();
  }, [legalModal, stopScroll, startScroll]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray<HTMLElement>('[data-footer-col]');
      if (cols.length) {
        gsap.fromTo(
          cols,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,willChange',
            scrollTrigger: {
              trigger: footer,
              start: 'top 92%',
              once: true,
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#191A18] text-[#F5F2EB] pt-16 pb-12">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/12">
          {/* Brand Summary */}
          <div data-footer-col className="md:col-span-4 space-y-4">
            <span className="font-serif text-3xl text-white block">Walk The Plan</span>
            <p className="text-sm leading-relaxed text-[#E8E3D9]/75 max-w-sm">
              India&apos;s architectural technology and 1:1 scale blueprint projection studio. Walk
              through your residence, villa, or commercial space before construction begins.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-[#E8E3D9]/80">
              <p>
                <a
                  href={`tel:${BUSINESS_CONTACT.phoneRaw}`}
                  className="hover:text-[#B97856] transition-colors tabular-nums"
                >
                  {BUSINESS_CONTACT.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${BUSINESS_CONTACT.email}`}
                  className="hover:text-[#B97856] transition-colors"
                >
                  {BUSINESS_CONTACT.email}
                </a>
              </p>
              <p className="text-[#E8E3D9]/60">{BUSINESS_CONTACT.hours}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div data-footer-col className="md:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[#B97856] font-medium">
              Navigation
            </p>
            <ul className="space-y-2 text-sm text-[#E8E3D9]/80">
              {[
                { label: 'Home', href: '#top' },
                { label: 'Experience', href: '#experience' },
                { label: '3D Configurator', href: '#configurator' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Process', href: '#process' },
                { label: 'Book a Session', href: '#book' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div data-footer-col className="md:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[#B97856] font-medium">
              Services
            </p>
            <ul className="space-y-2 text-sm text-[#E8E3D9]/80">
              {EDITORIAL_SERVICES.map((srv) => (
                <li key={srv.id}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {srv.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Cities & Direct Channels */}
          <div data-footer-col className="md:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[#B97856] font-medium">
              India Studios
            </p>
            <ul className="space-y-1.5 text-sm text-[#E8E3D9]/80">
              {STUDIO_LOCATIONS.map((s) => (
                <li key={s.id}>
                  <a href="#studios" className="hover:text-white transition-colors">
                    {s.city}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-3 flex flex-wrap gap-4 text-xs">
              <a
                href={buildWhatsAppUrl(
                  BUSINESS_CONTACT.phoneRaw,
                  'Hello Walk The Plan, I would like to connect with your studio team.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#F5F2EB] hover:text-[#B97856] transition-colors"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://walktheplan.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#F5F2EB] hover:text-[#B97856] transition-colors"
              >
                <span>walktheplan.in</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#E8E3D9]/60">
          <p>&copy; {new Date().getFullYear()} Walk The Plan. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Engagement
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Legal Notice Dialog */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Engagement'}
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-[#191A18]/90 flex items-center justify-center p-5"
        >
          <div className="max-w-xl w-full bg-[#F5F2EB] text-[#191A18] p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#191A18]/12 pb-3">
              <h3 className="font-serif text-2xl">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Studio Terms of Engagement'}
              </h3>
              <button
                type="button"
                aria-label="Close legal dialog"
                onClick={() => setLegalModal(null)}
                className="w-9 h-9 inline-flex items-center justify-center hover:text-[#B97856] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {legalModal === 'privacy' ? (
              <p className="text-sm leading-relaxed text-[#77746D]">
                Architectural drawings (DWG, CAD, PDF, or Revit files) and contact details shared
                with Walk The Plan are used exclusively to calibrate your 1:1 studio walkthrough and
                coordinate your appointment. Your intellectual property and floor plans remain
                strictly confidential.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-[#77746D]">
                Studio reservations require submission of scaled floor plans prior to your session
                so calibration can be completed before arrival. Rescheduling requests are handled
                through our studio coordination desk at {BUSINESS_CONTACT.phoneDisplay} or{' '}
                {BUSINESS_CONTACT.email}.
              </p>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
