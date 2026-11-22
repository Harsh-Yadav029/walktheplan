import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import {
  BUSINESS_CONTACT,
  STUDIO_LOCATIONS,
  buildWhatsAppUrl,
} from '../lib/bookingLogic';
import { CinematicFooter } from './ui/motion-footer';

type LegalDoc = 'privacy' | 'terms' | null;

export function Footer() {
  const [legalModal, setLegalModal] = useState<LegalDoc>(null);
  const { stopScroll, startScroll } = useSmoothScroll();

  useEffect(() => {
    if (legalModal) {
      stopScroll();
    } else {
      startScroll();
    }
    return () => startScroll();
  }, [legalModal, stopScroll, startScroll]);

  const whatsappHref = buildWhatsAppUrl(
    BUSINESS_CONTACT.phoneRaw,
    'Hello Walk The Plan, I would like to inquire about booking a 1:1 scale walkthrough session.'
  );

  return (
    <>
      <CinematicFooter
        giantText="WALK THE PLAN"
        heading="Ready to walk your future home?"
        primaryActionText="Book a 1:1 Studio Session"
        primaryActionHref="#book"
        secondaryActionText={`WhatsApp (${BUSINESS_CONTACT.phoneDisplay})`}
        secondaryActionHref={whatsappHref}
        brandName="Walk The Plan"
      />

      {/* Accessible Legal Notice Dialog */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={legalModal === 'privacy' ? 'Privacy Policy' : 'Studio Terms of Engagement'}
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-[#181A1B]/90 backdrop-blur-sm flex items-center justify-center p-5"
        >
          <div className="max-w-xl w-full bg-[#F5F2EB] text-[#191A18] p-6 md:p-8 space-y-4 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between border-b border-[#191A18]/12 pb-3">
              <h3 className="font-serif text-2xl">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Studio Terms of Engagement'}
              </h3>
              <button
                type="button"
                aria-label="Close legal dialog"
                onClick={() => setLegalModal(null)}
                className="w-9 h-9 inline-flex items-center justify-center hover:text-[#C47B52] cursor-pointer"
              >
                <X className="w-5 h-5" />
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
    </>
  );
}
