import { useState } from 'react';
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react';
import { Reveal } from './MotionPrimitives';
import { STUDIO_LOCATIONS, buildWhatsAppUrl } from '../lib/bookingLogic';

interface StudioLocatorSectionProps {
  onBookStudio: (studioId: string) => void;
}

export function StudioLocatorSection({ onBookStudio }: StudioLocatorSectionProps) {
  const [activeStudioId, setActiveStudioId] = useState<string>(STUDIO_LOCATIONS[0].id);
  const activeStudio =
    STUDIO_LOCATIONS.find((s) => s.id === activeStudioId) ?? STUDIO_LOCATIONS[0];

  return (
    <section
      id="studios"
      className="bg-[#F5F2EB] text-[#191A18] py-20 md:py-28 border-b border-[#191A18]/10"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                Pan-India Experience Centers
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
                Five Spatial Studios Across India.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <p className="text-sm md:text-base text-[#77746D] leading-relaxed">
                Select a city to view studio specifications, verified street address, operating
                hours, and direct appointment scheduling.
              </p>
            </Reveal>
          </div>
        </div>

        {/* City Selection Bar */}
        <Reveal delay={0.06} yOffset={20}>
          <div
            role="tablist"
            aria-label="Select Walk The Plan India studio city"
            className="flex flex-wrap gap-2 mb-10"
          >
            {STUDIO_LOCATIONS.map((studio) => {
              const isSelected = studio.id === activeStudioId;
              return (
                <button
                  key={studio.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStudioId(studio.id)}
                  className={`px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#191A18] text-[#F5F2EB] border-[#191A18]'
                      : 'bg-white text-[#191A18] border-[#191A18]/15 hover:border-[#B97856]'
                  }`}
                >
                  {studio.city}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Interactive Map + Active Studio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Architectural Map of India */}
          <Reveal delay={0.08} className="lg:col-span-5 flex">
          <div className="w-full bg-[#191A18] text-[#F5F2EB] p-6 md:p-8 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between text-xs text-[#E8E3D9]/70 border-b border-white/10 pb-3">
              <span>India Studio Network</span>
              <span className="tabular-nums">5 Active Locations</span>
            </div>

            <div className="relative my-6 flex items-center justify-center flex-1">
              <svg
                viewBox="0 0 100 100"
                className="w-full max-w-[300px] h-auto"
                aria-label="Interactive map of Walk The Plan India studio cities"
              >
                {/* Stylized minimal architectural India silhouette */}
                <path
                  d="M42,8 L48,14 L46,20 L55,26 L67,31 L78,34 L82,38 L74,44 L67,44 L63,52 L56,60 L49,73 L45,87 L41,92 L36,83 L33,70 L28,57 L20,48 L18,40 L26,35 L29,26 L36,16 Z"
                  fill="#232421"
                  stroke="#E8E3D9"
                  strokeOpacity="0.28"
                  strokeWidth="0.9"
                />

                {/* Subtle grid lines */}
                <line x1="15" y1="50" x2="85" y2="50" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="0.4" />
                <line x1="50" y1="10" x2="50" y2="92" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="0.4" />

                {/* Studio City Pins */}
                {STUDIO_LOCATIONS.map((studio) => {
                  const active = studio.id === activeStudioId;
                  return (
                    <g
                      key={studio.id}
                      onClick={() => setActiveStudioId(studio.id)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${studio.city} studio`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveStudioId(studio.id);
                        }
                      }}
                    >
                      {active && (
                        <circle
                          cx={studio.mapCoords.x}
                          cy={studio.mapCoords.y}
                          r="5.5"
                          fill="#B97856"
                          fillOpacity="0.28"
                        />
                      )}
                      <circle
                        cx={studio.mapCoords.x}
                        cy={studio.mapCoords.y}
                        r={active ? 2.6 : 1.8}
                        fill={active ? '#B97856' : '#F5F2EB'}
                      />
                      <text
                        x={studio.mapCoords.x + 4.2}
                        y={studio.mapCoords.y + 1.2}
                        fill={active ? '#FFFFFF' : '#E8E3D9'}
                        fillOpacity={active ? 1 : 0.65}
                        fontSize={active ? '4.2' : '3.5'}
                        fontWeight={active ? '600' : '400'}
                      >
                        {studio.city}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-xs text-[#E8E3D9]/70">
              Click any city pin on the map or tab above to inspect studio details.
            </p>
          </div>
          </Reveal>

          {/* Active Studio Verified Details */}
          <Reveal delay={0.16} className="lg:col-span-7 flex">
          <div className="w-full bg-white border border-[#191A18]/12 p-6 md:p-10 flex flex-col justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#191A18]/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#B97856] font-medium">
                    {activeStudio.label}
                  </p>
                  <h3 className="mt-1 font-serif text-3xl md:text-4xl text-[#191A18]">
                    {activeStudio.city} Studio
                  </h3>
                </div>
                <span className="text-xs text-[#77746D] tabular-nums">
                  Up to {activeStudio.baySizeSqFt.toLocaleString('en-IN')} sq.ft. Bay
                </span>
              </div>

              <div className="mt-6 space-y-4 text-sm text-[#191A18]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B97856] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{activeStudio.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#B97856] shrink-0" />
                  <p>{activeStudio.hours}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#B97856] shrink-0" />
                  <a
                    href={`tel:${activeStudio.phone.replace(/\s+/g, '')}`}
                    className="hover:text-[#B97856] transition-colors tabular-nums"
                  >
                    {activeStudio.phone}
                  </a>
                </div>
              </div>

              <div className="mt-8 border-t border-[#191A18]/10 pt-6">
                <p className="text-xs uppercase tracking-[0.14em] text-[#77746D] mb-3">
                  Studio Capabilities
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#191A18]">
                  {activeStudio.highlights.map((h) => (
                    <div key={h} className="bg-[#F5F2EB] px-3.5 py-2.5 border border-[#191A18]/8">
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onBookStudio(activeStudio.id)}
                className="bg-[#191A18] text-[#F5F2EB] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#B97856] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Book {activeStudio.city} Studio
              </button>

              <a
                href={buildWhatsAppUrl(
                  '919711022075',
                  `Hello Walk The Plan, I would like to schedule a walkthrough at the ${activeStudio.city} studio.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-[#191A18]/25 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#191A18] hover:border-[#191A18] transition-colors whitespace-nowrap shrink-0"
              >
                <span>WhatsApp Coordinator</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
