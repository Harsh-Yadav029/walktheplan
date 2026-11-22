import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import {
  Wallet,
  Settings,
  Award,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { STUDIO_LOCATIONS, buildWhatsAppUrl, BUSINESS_CONTACT } from '../lib/bookingLogic';

interface FranchiseModelDetails {
  modelKey: 'FOFO' | 'FOCO' | 'COLLABORATION';
  title: string;
  badge: string;
  charges: string;
  investmentRange: string;
  payback: string;
  spaceRequired: string;
  summary: string;
  tc: string[];
}

const FRANCHISE_MODELS: Record<'FOFO' | 'FOCO' | 'COLLABORATION', FranchiseModelDetails> = {
  FOFO: {
    modelKey: 'FOFO',
    title: 'FOFO (Franchisee Owned, Franchisee Operated)',
    badge: 'High Autonomy & Margins',
    charges: '₹15 Lakhs One-Time Franchise Fee + 8% Royalty on Sales',
    investmentRange: '₹35 – ₹45 Lakhs Total Initial Capital',
    payback: '10 – 14 Months Expected Payback',
    spaceRequired: '1,800 to 3,000 sq ft (14-ft clear ceiling height)',
    summary:
      'Ideal for active entrepreneurs and architecture studio owners seeking maximum operating margin and full local management control.',
    tc: [
      'Franchisee is responsible for complete space acquisition, interior setup cost, and day-to-day studio operations.',
      'Must arrange 1,800 to 3,000 sq ft carpet area with minimum 14-foot unobstructed ceiling height.',
      'Comprehensive staff training, operational standard operating procedures (SOPs), and brand guidelines provided by Walk The Plan.',
      'Initial projector array hardware, optical calibration sensors, and furniture suite purchased through approved certified vendors.',
      'Dedicated marketing playbook, local PR collateral, and national leads routed directly from the walktheplan.in platform.',
    ],
  },
  FOCO: {
    modelKey: 'FOCO',
    title: 'FOCO (Franchisee Owned, Company Operated)',
    badge: 'Passive Investor Favorite',
    charges: '₹25 Lakhs Initial Capital + 50/50 Revenue Split on Profit Margins',
    investmentRange: '₹55 – ₹70 Lakhs Complete Turnkey Investment',
    payback: '12 – 16 Months Expected Payback',
    spaceRequired: '2,200 to 3,500 sq ft (14-ft clear ceiling height)',
    summary:
      'Designed for passive investors and real estate property owners. Walk The Plan corporate team manages daily staffing, tech ops, and bookings.',
    tc: [
      'Franchisee owns the physical leasehold/property and hardware assets; Walk The Plan deploys and manages all daily operations and host staff.',
      'Monthly transparent audit reporting, CAD queue management, and customer walkthrough logistics managed directly by corporate team.',
      'Walk The Plan covers all proprietary software engine updates, cloud rendering pipelines, and preventative hardware maintenance.',
      'Corporate manages digital customer acquisition, corporate developer tie-ups, and architect partner network in the city.',
      'Minimum standard lock-in period of 3 years applies to ensure sustainable market penetration and asset maturation.',
    ],
  },
  COLLABORATION: {
    modelKey: 'COLLABORATION',
    title: 'Strategic Institutional & Design Hub Model',
    badge: 'Co-Branded Synergy',
    charges: 'Custom Profit Share Model based on Location & Contribution',
    investmentRange: 'Tailored Hybrid Capital Model',
    payback: 'Variable / Immediate Value Add',
    spaceRequired: 'Flexible (Dedicated wing inside existing architecture/design center)',
    summary:
      'Available for established architectural institutes, design academies, premier builder experience centers, or prominent co-working hubs.',
    tc: [
      'Available for reputable architectural colleges, large builder sales galleries, and multi-disciplinary design studios.',
      'Shared setup infrastructure costs and customized dual-purpose projection and lecture/seminar arrays.',
      'Co-branded annual marketing calendar, student research projects, and high-visibility industry events support.',
      'Dedicated licensing of the Walk The Plan 1:1 floor plan simulation software with multi-user enterprise access.',
      'Subject to formal location inspection and strategic approval by the Walk The Plan Board of Directors.',
    ],
  },
};

export function FranchisePage() {
  const router = useRouter();

  // Active Franchise Business Model Tab
  const [activeModel, setActiveModel] = useState<'FOFO' | 'FOCO' | 'COLLABORATION'>('FOFO');

  // Active Operating Studio Locator Tab
  const [activeStudioId, setActiveStudioId] = useState<string>(STUDIO_LOCATIONS[0].id);
  const activeStudio =
    STUDIO_LOCATIONS.find((s) => s.id === activeStudioId) ?? STUDIO_LOCATIONS[0];

  // Franchise Application Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [applicantRole, setApplicantRole] = useState('Franchise Investor');
  const [targetCity, setTargetCity] = useState('Bengaluru');
  const [preferredModel, setPreferredModel] = useState<'FOFO' | 'FOCO' | 'COLLABORATION'>('FOFO');
  const [budgetRange, setBudgetRange] = useState('₹35 – ₹60 Lakhs');
  const [spaceAvailable, setSpaceAvailable] = useState('2,000 – 3,000 Sq.Ft');
  const [timeline, setTimeline] = useState('Within 1–2 Months');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Mock network submission with 400ms delay
      await new Promise((resolve) => setTimeout(resolve, 400));
      const refId = `WTP-FRN-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedAppId(refId);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToProposal = (model?: 'FOFO' | 'FOCO' | 'COLLABORATION') => {
    if (model) {
      setPreferredModel(model);
    }
    const el = document.getElementById('franchise-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#181A1B] text-[#F2EDE5] pt-24 md:pt-32 pb-16 selection:bg-[#C47B52] selection:text-white">
      {/* 1. HERO HEADER */}
      <section className="relative px-4 sm:px-8 max-w-7xl mx-auto text-center mb-16 md:mb-24">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-[#C47B52]/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-white max-w-4xl leading-[1.12] mb-6">
            Studio Franchise <span className="text-[#C47B52] italic font-normal">Opportunities</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#A5A7A4] max-w-2xl mx-auto leading-relaxed">
            Bring the life-size blueprint walkthrough revolution to your city. Open a fully-equipped
            Walk The Plan projection studio and capitalize on India's booming architectural proptech market.
          </p>
        </div>
      </section>

      {/* 2. HIGHLIGHTS GRID (3 CARDS) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-20 md:mb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-[#1E2021] border border-[#2A2D30] flex flex-col justify-between hover:border-[#C47B52]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#C47B52]/10 border border-[#C47B52]/25 flex items-center justify-center text-[#EED77A] mb-6 group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#EED77A] block mb-2">
                Proven Financials
              </span>
              <h3 className="text-xl font-serif text-white mb-3">High ROI & Quick Payback</h3>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                Low operational overhead, lean studio staffing, and healthy gross margins per session.
                Recoup your startup capital within 10 to 14 months of studio launch.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-[#1E2021] border border-[#2A2D30] flex flex-col justify-between hover:border-[#C47B52]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#C47B52]/10 border border-[#C47B52]/25 flex items-center justify-center text-[#EED77A] mb-6 group-hover:scale-105 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#EED77A] block mb-2">
                Turnkey Architecture
              </span>
              <h3 className="text-xl font-serif text-white mb-3">Full Turnkey Tech Support</h3>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                We provide complete hardware array schematics, optical calibration sensors, vector
                mapping engines, furniture suite manufacturing, and centralized cloud booking software.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-[#1E2021] border border-[#2A2D30] flex flex-col justify-between hover:border-[#C47B52]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#C47B52]/10 border border-[#C47B52]/25 flex items-center justify-center text-[#EED77A] mb-6 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#EED77A] block mb-2">
                Protected Monopoly
              </span>
              <h3 className="text-xl font-serif text-white mb-3">Exclusive Territory Rights</h3>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                Secure exclusive geographic boundary rights. Guarantee that your team is the sole licensed
                provider of Walk The Plan 1:1 architectural projections in your designated city district.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS MODELS TAB SWITCHER (FOFO, FOCO, COLLABORATION) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
            Studio Franchise Models
          </h2>
          <p className="text-sm sm:text-base text-[#A5A7A4] max-w-2xl mx-auto">
            Choose from fully autonomous franchise management, turnkey corporate-operated equity, or
            institutional design center collaboration.
          </p>
        </div>

        {/* Tab Buttons Bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-[#141516] border border-[#2A2D30] gap-1.5 max-w-full overflow-x-auto">
            {(['FOFO', 'FOCO', 'COLLABORATION'] as const).map((modelKey) => {
              const isActive = activeModel === modelKey;
              return (
                <button
                  key={modelKey}
                  type="button"
                  onClick={() => setActiveModel(modelKey)}
                  className={`px-6 sm:px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#EED77A] text-[#191A18] shadow-md'
                      : 'text-[#A5A7A4] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {modelKey === 'COLLABORATION' ? 'Collaboration' : modelKey}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Model Display Card */}
        {(() => {
          const model = FRANCHISE_MODELS[activeModel];
          return (
            <div className="rounded-3xl bg-[#1E2021] border border-[#2A2D30] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 7 Columns: Details & Terms */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/15 text-[#EED77A] text-[11px] font-mono uppercase tracking-wider mb-4">
                      {model.badge}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">{model.title}</h3>

                    <p className="text-sm sm:text-base text-[#A5A7A4] leading-relaxed mb-8">
                      {model.summary}
                    </p>

                    {/* Terms Checklist */}
                    <div className="space-y-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#A5A7A4] block">
                        Model Terms & Operational Obligations:
                      </span>
                      {model.tc.map((term, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#EED77A] mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm text-[#F2EDE5]/90 leading-relaxed">
                            {term}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => scrollToProposal(model.modelKey)}
                      className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer flex items-center gap-2 shadow-md"
                    >
                      <span>Apply For {model.modelKey} Territory</span>
                      <ArrowRight className="w-4 h-4 text-[#191A18]" />
                    </button>
                    <span className="text-xs text-[#A5A7A4]">
                      Fast-track review within 48 hours
                    </span>
                  </div>
                </div>

                {/* Right 5 Columns: Charges & Financial Specs Card */}
                <div className="lg:col-span-5 bg-[#141516] rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#EED77A] block mb-2">
                      Investment Structure
                    </span>
                    <h4 className="text-lg font-serif text-white mb-6">Financial Overview</h4>

                    <div className="space-y-5">
                      <div className="pb-4 border-b border-white/5">
                        <span className="text-[11px] text-[#A5A7A4] uppercase font-mono block">
                          Franchise Fee / Commercial Charge
                        </span>
                        <p className="text-base sm:text-lg font-bold text-[#EED77A] mt-1">
                          {model.charges}
                        </p>
                      </div>

                      <div className="pb-4 border-b border-white/5">
                        <span className="text-[11px] text-[#A5A7A4] uppercase font-mono block">
                          Total Setup Capital
                        </span>
                        <p className="text-sm font-semibold text-white mt-1">
                          {model.investmentRange}
                        </p>
                      </div>

                      <div className="pb-4 border-b border-white/5">
                        <span className="text-[11px] text-[#A5A7A4] uppercase font-mono block">
                          Estimated Break-Even
                        </span>
                        <p className="text-sm font-semibold text-emerald-400 mt-1">{model.payback}</p>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#A5A7A4] uppercase font-mono block">
                          Physical Real Estate Specification
                        </span>
                        <p className="text-sm font-semibold text-white mt-1">{model.spaceRequired}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1E2021] border border-white/5 text-[11px] text-[#A5A7A4] leading-relaxed flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#C47B52] shrink-0 mt-0.5" />
                    <span>
                      All hardware specifications include factory-calibrated Christie & Barco laser projection
                      arrays with 3-year OEM warranties.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 4. STUDIO LOCATOR / NATIONAL FOOTPRINT SECTION (From User's Screenshot 1) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono uppercase tracking-widest text-[#EED77A] block mb-2">
              Pan-India Studio Network
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white">
              Five Spatial Studios Across India
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#A5A7A4] leading-relaxed">
              Explore our operating network of life-size architectural walkthrough centers. Visit an
              active facility to experience the projection clarity and live customer flow firsthand.
            </p>
          </div>
        </div>

        {/* City Selection Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STUDIO_LOCATIONS.map((studio) => {
            const isSelected = studio.id === activeStudioId;
            return (
              <button
                key={studio.id}
                type="button"
                onClick={() => setActiveStudioId(studio.id)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-lg ${
                  isSelected
                    ? 'bg-[#EED77A] text-[#191A18] border-[#EED77A] shadow-md'
                    : 'bg-[#1E2021] text-[#A5A7A4] border-[#2A2D30] hover:text-white hover:border-[#C47B52]'
                }`}
              >
                {studio.city}
              </button>
            );
          })}
        </div>

        {/* Interactive India Map & Active Studio Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Architectural SVG Map of India (5 Columns) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#141516] border border-[#2A2D30] p-6 sm:p-8 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between text-xs text-[#A5A7A4] border-b border-white/10 pb-3 font-mono">
              <span>India Studio Network</span>
              <span className="text-[#EED77A]">5 Active Locations</span>
            </div>

            <div className="relative my-6 flex items-center justify-center flex-1">
              <svg
                viewBox="0 0 100 100"
                className="w-full max-w-[280px] h-auto drop-shadow-2xl"
                aria-label="Interactive map of Walk The Plan India studio cities"
              >
                {/* Stylized minimal architectural India silhouette */}
                <path
                  d="M42,8 L48,14 L46,20 L55,26 L67,31 L78,34 L82,38 L74,44 L67,44 L63,52 L56,60 L49,73 L45,87 L41,92 L36,83 L33,70 L28,57 L20,48 L18,40 L26,35 L29,26 L36,16 Z"
                  fill="#1E2021"
                  stroke="#C47B52"
                  strokeOpacity="0.4"
                  strokeWidth="0.8"
                />

                {/* Subtle architectural grid lines */}
                <line x1="15" y1="50" x2="85" y2="50" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="0.4" />
                <line x1="50" y1="10" x2="50" y2="92" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="0.4" />

                {/* Studio City Pins */}
                {STUDIO_LOCATIONS.map((studio) => {
                  const isSelected = studio.id === activeStudioId;
                  return (
                    <g
                      key={studio.id}
                      className="cursor-pointer"
                      onClick={() => setActiveStudioId(studio.id)}
                    >
                      {/* Pulse Ring for Selected Pin */}
                      {isSelected && (
                        <circle
                          cx={studio.mapCoords.x}
                          cy={studio.mapCoords.y}
                          r="5.5"
                          fill="none"
                          stroke="#EED77A"
                          strokeWidth="0.75"
                          opacity="0.8"
                          className="animate-ping"
                        />
                      )}
                      {/* Pin Circle */}
                      <circle
                        cx={studio.mapCoords.x}
                        cy={studio.mapCoords.y}
                        r={isSelected ? 3.2 : 2.2}
                        fill={isSelected ? '#EED77A' : '#C47B52'}
                        stroke="#181A1B"
                        strokeWidth="1"
                      />
                      {/* City Label */}
                      <text
                        x={studio.mapCoords.x + 4.5}
                        y={studio.mapCoords.y + 1.2}
                        fill={isSelected ? '#FFFFFF' : '#A5A7A4'}
                        fontSize="3.2"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {studio.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-[11px] text-[#A5A7A4] text-center font-mono">
              Click any city pin on the map or tab above to inspect studio specifications.
            </p>
          </div>

          {/* Active Studio Card (7 Columns) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#1E2021] border border-[#2A2D30] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs uppercase font-mono tracking-widest text-[#EED77A]">
                  {activeStudio.label}
                </span>
                <span className="text-xs text-[#A5A7A4] font-mono">
                  Up to {activeStudio.baySizeSqFt.toLocaleString()} sq.ft. Bay
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-white mb-6">
                {activeStudio.city} Studio
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C47B52] mt-1 shrink-0" />
                  <span className="text-sm text-[#F2EDE5]/90 leading-relaxed">
                    {activeStudio.address}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#C47B52] shrink-0" />
                  <span className="text-sm text-[#A5A7A4]">{activeStudio.hours}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C47B52] shrink-0" />
                  <span className="text-sm text-white font-mono">{activeStudio.phone}</span>
                </div>
              </div>

              {/* Studio Capabilities */}
              <div className="mb-8">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#A5A7A4] block mb-3">
                  Studio Capabilities & Amenities
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStudio.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-[#141516] border border-white/10 text-xs text-[#F2EDE5]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => router.navigate('/services')}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-md"
              >
                Book {activeStudio.city} Studio
              </button>

              <a
                href={buildWhatsAppUrl(
                  BUSINESS_CONTACT.phoneRaw,
                  `Hello Walk The Plan coordinator, I would like to visit the ${activeStudio.city} Studio to assess franchise feasibility.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <span>WhatsApp Coordinator</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C47B52]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FRANCHISE PROPOSAL & TERRITORY QUALIFICATION FORM (From User's Screenshot 2) */}
      <section id="franchise-form" className="px-4 sm:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Narrative Column (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#EED77A] block mb-2">
                Franchise Application & Qualification
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                Bring Walk The Plan to Your City.
              </h2>
              <p className="text-sm sm:text-base text-[#A5A7A4] leading-relaxed mb-6">
                Share your proposed territory, commercial property availability, and investment timeline.
                Our Franchise Development Director will assess catchment demographics and arrange a
                personalized briefing session.
              </p>
            </div>

            <div className="space-y-5 p-6 rounded-2xl bg-[#1E2021] border border-[#2A2D30]">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C47B52] mt-1 shrink-0" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A7A4] block">
                    Direct Phone & WhatsApp
                  </span>
                  <a
                    href="tel:+919711022075"
                    className="text-sm font-semibold text-white hover:text-[#EED77A] transition-colors"
                  >
                    +91 97110 22075
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-4 h-4 text-[#C47B52] mt-1 shrink-0" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A7A4] block">
                    Corporate Email
                  </span>
                  <a
                    href="mailto:info@walktheplan.in"
                    className="text-sm font-semibold text-white hover:text-[#EED77A] transition-colors"
                  >
                    info@walktheplan.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C47B52] mt-1 shrink-0" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#A5A7A4] block">
                    Operating Hours
                  </span>
                  <span className="text-sm text-white">Monday – Sunday, 10:00 AM – 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column (7 Columns) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#1E2021] border border-[#2A2D30] p-6 sm:p-10 shadow-2xl">
            {submittedAppId ? (
              /* Success Receipt Confirmation */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">
                  Application Logged Successfully
                </span>

                <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">
                  Franchise Inquiry Received
                </h3>

                <p className="text-sm text-[#A5A7A4] max-w-md mx-auto mb-6">
                  Thank you, <strong className="text-white">{fullName}</strong>! Your territory application
                  for <strong className="text-white">{targetCity}</strong> has been assigned to our
                  Franchise Development Director.
                </p>

                <div className="inline-block p-4 rounded-xl bg-[#141516] border border-white/10 mb-8 font-mono text-xs text-left">
                  <div className="text-[#A5A7A4] mb-1">Application Reference:</div>
                  <div className="text-base font-bold text-[#EED77A]">{submittedAppId}</div>
                  <div className="text-[11px] text-[#A5A7A4] mt-2">
                    Model Selected: <span className="text-white">{preferredModel}</span> • Budget: <span className="text-white">{budgetRange}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={buildWhatsAppUrl(
                      BUSINESS_CONTACT.phoneRaw,
                      `Hello Walk The Plan franchise team, I just submitted application ${submittedAppId} for ${targetCity}. Please connect with me.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <span>Instant WhatsApp Follow-up</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedAppId(null);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              /* Proposal Form */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h3 className="text-xl font-serif text-white">Franchise Territory Inquiry</h3>
                  <p className="text-xs text-[#A5A7A4] mt-1">
                    Fill out the parameters below to verify location feasibility and terms.
                  </p>
                </div>

                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Singhania"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address & Applicant Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@proptechholdings.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Applicant Profile / Role
                    </label>
                    <select
                      value={applicantRole}
                      onChange={(e) => setApplicantRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C47B52] transition-colors"
                    >
                      <option value="Franchise Investor">Individual / Group Investor</option>
                      <option value="Architect / Interior Designer">Architect / Design Firm Owner</option>
                      <option value="Real Estate Developer">Real Estate Developer / Builder</option>
                      <option value="Commercial Landlord">Commercial Space / Landlord</option>
                      <option value="Design Institute">Architecture / Design Institution</option>
                    </select>
                  </div>
                </div>

                {/* Target City & Preferred Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Proposed City / Territory *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru / Pune / Mumbai"
                      value={targetCity}
                      onChange={(e) => setTargetCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Preferred Franchise Model
                    </label>
                    <select
                      value={preferredModel}
                      onChange={(e) =>
                        setPreferredModel(e.target.value as 'FOFO' | 'FOCO' | 'COLLABORATION')
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C47B52] transition-colors"
                    >
                      <option value="FOFO">FOFO (Franchisee Owned & Operated)</option>
                      <option value="FOCO">FOCO (Franchisee Owned, Company Operated)</option>
                      <option value="COLLABORATION">Institutional / Collaboration Model</option>
                    </select>
                  </div>
                </div>

                {/* Investment Budget & Carpet Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Planned Investment Budget
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C47B52] transition-colors"
                    >
                      <option value="₹25 – ₹35 Lakhs">₹25 – ₹35 Lakhs</option>
                      <option value="₹35 – ₹60 Lakhs">₹35 – ₹60 Lakhs (Recommended)</option>
                      <option value="₹60 Lakhs – ₹1 Crore">₹60 Lakhs – ₹1 Crore</option>
                      <option value="₹1 Crore+">₹1 Crore+ (Multi-Unit Area Developer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                      Carpet Area Available (Sq.Ft.)
                    </label>
                    <select
                      value={spaceAvailable}
                      onChange={(e) => setSpaceAvailable(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C47B52] transition-colors"
                    >
                      <option value="1,800 – 2,500 Sq.Ft">1,800 – 2,500 Sq.Ft</option>
                      <option value="2,500 – 3,500 Sq.Ft">2,500 – 3,500 Sq.Ft</option>
                      <option value="3,500+ Sq.Ft">3,500+ Sq.Ft</option>
                      <option value="Currently Sourcing Space">Currently Sourcing Space</option>
                    </select>
                  </div>
                </div>

                {/* Additional Scope / Background Notes */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A7A4] mb-2">
                    Real Estate Background & Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your background, existing design business, or location specifics..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#141516] border border-white/10 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-[#C47B52] transition-colors"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-lg hover:shadow-[#EED77A]/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Validating Territory Availability...</span>
                    ) : (
                      <>
                        <span>Submit Franchise Application</span>
                        <ArrowRight className="w-4 h-4 text-[#191A18]" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-[#A5A7A4] text-center mt-3">
                    By submitting, your data is protected under non-disclosure confidentiality.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
