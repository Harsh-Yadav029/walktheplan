import React, { useState, useMemo } from 'react';
import { useRouter } from '../lib/router';
import { FaqSection } from '../components/FaqSection';
import { Pricing, type PricingPlan } from '../components/ui/pricing';
import {
  Layers,
  ShieldCheck,
  ArrowRight,
  X,
  Printer,
  Check,
  CheckCircle2,
} from 'lucide-react';

interface ServiceTier {
  id: string;
  title: string;
  tagline: string;
  price: number;
  duration: string;
  token: number;
  popular?: boolean;
  specs: string[];
  features: string[];
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: '1-hour-projection',
    title: '1 Hour Projection',
    tagline: 'AR-based 1:1 floor plan projection for flats, apartments, and single-floor layouts.',
    price: 30000,
    duration: '1 Hour',
    token: 5000,
    popular: false,
    specs: [
      'Up to 1,500 sq.ft floor plate coverage',
      '1:1 Scale precision laser projection',
      'Basic modular rolling furniture suite',
    ],
    features: [
      'Experience actual room dimensions before excavation',
      'Understand furniture circulation and walkways',
      'Identify critical design modifications early',
      'Sub-millimeter calibrated laser projection report',
    ],
  },
  {
    id: '2-hour-projection',
    title: '2 Hour Projection',
    tagline: 'Real-time bare-shell 3D walkthrough for duplexes and luxury villas with live CAD line tweaks.',
    price: 40000,
    duration: '2 Hours',
    token: 5000,
    popular: true,
    specs: [
      'Up to 3,500 sq.ft duplex/villa coverage',
      'Bare-shell 3D VR simulation suite',
      'Live CAD engineer on-site in studio',
    ],
    features: [
      'Interactive bare-shell volumetric exploration',
      'Real-time wall partition shifts & door swing checks',
      'Full master bedroom & kitchen modular furniture',
      'Triple-consensus sign-off with architect & designer',
    ],
  },
  {
    id: '3-5-hour-projection',
    title: '3–5 Hour Projection',
    tagline: 'Full architectural design visualization, lighting, and estate layout reviews for builders & architects.',
    price: 50000,
    duration: '3–5 Hours',
    token: 5000,
    popular: false,
    specs: [
      'Up to 7,500+ sq.ft multi-level luxury estate',
      'Comprehensive master workshop session',
      'Developer multi-unit floor plate switching',
    ],
    features: [
      'Photorealistic interior/exterior lighting & finishes',
      'Multi-floor vertical elevation mapping & beam analysis',
      'Complete contractor & site execution video record',
      'Dedicated Senior Architectural Spatial Director',
    ],
  },
];

export function ServicesPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);

  // 4-Stage Wizard Modal State
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
  const [paymentOption, setPaymentOption] = useState<'token' | 'pay_later'>('token');
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    areaSqFt: '',
    notes: '',
  });
  const [generatedTicketId, setGeneratedTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const openBookingWizard = (tier: ServiceTier) => {
    setSelectedTier(tier);
    setCheckoutStep(1);
    setPaymentOption('token');
    setErrorMsg('');
  };

  const closeBookingWizard = () => {
    if (checkoutStep === 3) return;
    setSelectedTier(null);
    setCheckoutStep(1);
    setErrorMsg('');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.preferredDate) {
      setErrorMsg('Please provide your name, phone number, and preferred date.');
      return;
    }
    setErrorMsg('');
    setCheckoutStep(2);
  };

  const handleConfirmReservation = () => {
    setCheckoutStep(3); // Stage 3: Processing

    setTimeout(() => {
      if (paymentOption === 'token') {
        const rzpId = 'pay_rzp_' + Math.random().toString(36).substring(2, 9).toUpperCase();
        setGeneratedTicketId(rzpId);
      } else {
        const payLaterId = 'PAY-LATER-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedTicketId(payLaterId);
      }
      setCheckoutStep(4); // Stage 4: Virtual Ticket Receipt
    }, 1200);
  };

  const formatPrice = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const pricingPlans: PricingPlan[] = useMemo(() => {
    return SERVICE_TIERS.map((tier) => ({
      tierId: tier.id,
      name: tier.title.toUpperCase(),
      price: String(tier.price),
      yearlyPrice: String(Math.round(tier.price * 0.8)),
      period: tier.duration,
      features: [...tier.specs, ...tier.features.slice(0, 3)],
      description: tier.tagline,
      buttonText: 'Book this package',
      href: '#book',
      isPopular: Boolean(tier.popular),
    }));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#181A1B] text-[#F2EDE5] font-sans selection:bg-[#C47B52] selection:text-white">
      {/* Interactive 3D Pricing Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <Pricing
          plans={pricingPlans}
          title="Plans that work best for your Blueprint"
          description={`Transparent 1:1 scale architectural blueprint walkthrough packages in India.\nSecure your priority studio session with flexible token payment or reserve your slot now.`}
          currencySymbol="₹"
          currency="INR"
          billingToggleText="Annual Architect / Builder Partner Rate"
          onPlanSelect={(plan) => {
            const tier = SERVICE_TIERS.find((t) => t.id === plan.tierId);
            if (tier) openBookingWizard(tier);
          }}
        />
      </section>

      {/* 4-STAGE MULTI-STEP CHECKOUT MODAL WIZARD */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#181A1B] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2EDE5] relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#EED77A]">
                  Step {checkoutStep} of 4 • {checkoutStep === 4 ? 'Receipt Confirmation' : 'Session Checkout'}
                </div>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  {checkoutStep === 4 ? 'Studio Walkthrough Pass' : `Book ${selectedTier.title}`}
                </h3>
              </div>
              {checkoutStep !== 3 && (
                <button
                  type="button"
                  onClick={closeBookingWizard}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#A5A7A4] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            {/* STAGE 1: Customer Details & Dual Payment Option Selector */}
            {checkoutStep === 1 && (
              <form onSubmit={handleStep1Submit} className="mt-6 space-y-5">
                <div className="p-4 rounded-xl bg-[#141516] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#A5A7A4]">Selected Plan</span>
                    <div className="font-bold text-white text-sm">{selectedTier.title} ({selectedTier.duration})</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-[#A5A7A4]">Package Price</span>
                    <div className="font-bold text-[#EED77A] text-base">{formatPrice(selectedTier.price)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#A5A7A4] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sharma"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#202223] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A5A7A4] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#202223] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#A5A7A4] mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#202223] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A5A7A4] mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={customer.preferredDate}
                      onChange={(e) => setCustomer({ ...customer, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#202223] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52]"
                    />
                  </div>
                </div>

                {/* DUAL PAYMENT OPTIONS SELECTOR */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#EED77A]">
                    Select Payment / Reservation Mode:
                  </label>

                  {/* Option 1: ₹5,000 Token Deposit */}
                  <div
                    onClick={() => setPaymentOption('token')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentOption === 'token'
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'border-white/10 bg-[#141516] hover:border-white/20'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentOption === 'token' ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'}`}>
                        {paymentOption === 'token' && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Option 1: Pay ₹5,000 Advance Token (Primary)</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A5A7A4] mt-1 leading-relaxed">
                        Pay ₹5,000 advance token via Razorpay gateway to lock in your preferred projection slot. Refundable & adjustable against the balance payable at the studio.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Reserve My Slot (Pay Later) */}
                  <div
                    onClick={() => setPaymentOption('pay_later')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentOption === 'pay_later'
                        ? 'border-[#C47B52] bg-[#C47B52]/10 shadow-[0_0_15px_rgba(196,123,82,0.15)]'
                        : 'border-white/10 bg-[#141516] hover:border-white/20'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentOption === 'pay_later' ? 'border-[#C47B52] bg-[#C47B52]' : 'border-white/30'}`}>
                        {paymentOption === 'pay_later' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Option 2: Reserve My Slot (Pay Later)</span>
                        <span className="text-[10px] font-bold text-[#EED77A] bg-[#C47B52]/20 px-2 py-0.5 rounded-full">
                          Zero Upfront
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A5A7A4] mt-1 leading-relaxed">
                        Zero upfront payment. Our architectural coordination team will contact you within 24 hours to confirm your floor plan CAD file and calibrate the studio.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STAGE 2: Review & Confirmation */}
            {checkoutStep === 2 && (
              <div className="mt-6 space-y-6">
                <div className="p-5 rounded-2xl bg-[#141516] border border-white/10 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A5A7A4]">Client:</span>
                    <span className="font-semibold text-white">{customer.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A5A7A4]">Contact:</span>
                    <span className="font-semibold text-white">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A5A7A4]">Scheduled Date:</span>
                    <span className="font-semibold text-white">{customer.preferredDate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A5A7A4]">Selected Studio:</span>
                    <span className="font-semibold text-white">Gurugram Flagship Studio (Udyog Vihar Ph-4)</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm">
                    <span className="text-[#A5A7A4]">Amount Due Now:</span>
                    <span className="text-lg font-bold text-[#EED77A]">
                      {paymentOption === 'token' ? '₹5,000 (Advance Token)' : '₹0 (Pay Later at Studio)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-[#A5A7A4] hover:text-white transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReservation}
                    className="flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <span>{paymentOption === 'token' ? 'Pay ₹5,000 & Confirm Slot' : 'Confirm Slot Reservation'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: Processing Loader */}
            {checkoutStep === 3 && (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full border-4 border-[#C47B52] border-t-transparent animate-spin mx-auto" />
                <h4 className="text-lg font-serif font-bold text-white">
                  Calibrating Studio Coordinates...
                </h4>
                <p className="text-xs text-[#A5A7A4] max-w-sm mx-auto">
                  Generating your secure reference pass and synchronizing with Walk The Plan Gurugram projection calendars.
                </p>
              </div>
            )}

            {/* STAGE 4: Virtual Ticket Receipt Card */}
            {checkoutStep === 4 && (
              <div className="mt-6 space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E2021] to-[#141516] border border-[#C47B52]/40 space-y-4 shadow-xl">
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#EED77A]">
                        Walk The Plan • Official Studio Pass
                      </span>
                      <h4 className="text-lg font-bold text-white mt-0.5">{selectedTier.title}</h4>
                      <p className="text-[11px] text-[#A5A7A4]">{selectedTier.duration} Calibrated Session</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#C47B52]/20 text-[#EED77A] border border-[#C47B52]/40">
                        {generatedTicketId}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#A5A7A4] text-[10px] uppercase font-mono block">Guest Name</span>
                      <span className="font-semibold text-white">{customer.name}</span>
                    </div>
                    <div>
                      <span className="text-[#A5A7A4] text-[10px] uppercase font-mono block">Contact</span>
                      <span className="font-semibold text-white">{customer.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#A5A7A4] text-[10px] uppercase font-mono block">Scheduled Date</span>
                      <span className="font-semibold text-[#EED77A]">{customer.preferredDate}</span>
                    </div>
                    <div>
                      <span className="text-[#A5A7A4] text-[10px] uppercase font-mono block">Payment Status</span>
                      <span className="font-semibold text-emerald-400">
                        {paymentOption === 'token' ? 'Advance Token (₹5,000 Paid)' : 'Reserved (Pay Later at Studio)'}
                      </span>
                    </div>
                  </div>

                  {/* Studio Address */}
                  <div className="pt-3 border-t border-white/10 text-[11px] text-[#A5A7A4]">
                    <strong className="text-white block">Studio Location:</strong>
                    Building 328, Sec 19, Udyog Vihar Phase 4, Gurugram, Haryana 122016
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-white/15 text-xs font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-[#A5A7A4]" />
                    <span>Print / Save Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeBookingWizard}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-md text-center"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQ Section matching the exact Dark Theme */}
      <section className="border-t border-white/5 bg-[#181A1B]">
        <FaqSection />
      </section>
    </div>
  );
}
