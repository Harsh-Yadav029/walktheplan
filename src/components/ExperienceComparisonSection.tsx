import { useState } from 'react';
import { Reveal } from './MotionPrimitives';
import { COMPARISON_MODES, type ComparisonMode } from '../data/siteContent';
import { Check, Move, DoorOpen, Ruler } from 'lucide-react';

export function ExperienceComparisonSection() {
  const [activeMode, setActiveMode] = useState<ComparisonMode['id']>('1to1');
  const current = COMPARISON_MODES.find((m) => m.id === activeMode) ?? COMPARISON_MODES[2];

  return (
    <section
      id="experience"
      className="bg-[#E8E3D9] text-[#191A18] py-20 md:py-28 border-b border-[#191A18]/10"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        {/* Header & Spatial Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pb-12 border-b border-[#191A18]/12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                How The Experience Works
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
                Step Into Every Dimension Before Masonry Starts.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <p className="text-sm md:text-base text-[#191A18]/75 leading-relaxed">
                From your AutoCAD file to our laser-calibrated bay floor, we turn abstract
                architectural drawings into a full-scale walkable spatial rehearsal.
              </p>
            </Reveal>
          </div>
        </div>

        {/* 4 Physical Studio Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-[#191A18]/12">
          {[
            {
              icon: Ruler,
              title: 'CAD Floor Projection',
              text: 'Overhead projectors map walls, columns, windows, and room proportions onto the floor at exact 1:1 scale.',
            },
            {
              icon: Move,
              title: 'Movable Furniture Blocks',
              text: 'Place full-size modular sofas, dining tables, beds, and kitchen islands directly onto your projected rooms.',
            },
            {
              icon: DoorOpen,
              title: 'Door & Passage Clearance',
              text: 'Physically test corridor widths, wardrobe shutter swings, and dining chair pull-back tolerances.',
            },
            {
              icon: Check,
              title: 'Live Architect Iteration',
              text: 'Adjust partition offsets and electrical zones in real time with your architect and family standing on site.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={idx * 0.05} className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 border border-[#191A18]/20 text-[#B97856]">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-2xl text-[#191A18]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#77746D]">{item.text}</p>
              </Reveal>
            );
          })}
        </div>

        {/* Interactive Visual Comparison Switcher */}
        <div className="pt-14">
          <Reveal yOffset={24}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#77746D]">
                  Interactive Spatial Comparison
                </p>
                <h3 className="font-serif text-2xl md:text-3xl mt-1">
                  Why 1:1 Scale Outperforms Screens &amp; Paper
                </h3>
              </div>

              <div
                role="tablist"
                aria-label="Architectural visualization comparison modes"
                className="inline-flex flex-wrap gap-1.5 bg-[#F5F2EB] p-1.5 border border-[#191A18]/10"
              >
                {COMPARISON_MODES.map((mode) => {
                  const selected = mode.id === activeMode;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveMode(mode.id)}
                      className={`px-4 py-2 text-xs font-medium tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        selected
                          ? 'bg-[#191A18] text-[#F5F2EB]'
                          : 'text-[#191A18]/70 hover:text-[#191A18]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} yOffset={32}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#F5F2EB] border border-[#191A18]/10 p-6 md:p-10">
            {/* Architectural SVG Comparison Diagram */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-[#191A18] text-[#F5F2EB] p-6 md:p-8 min-h-[320px]">
              <div className="flex items-center justify-between text-xs text-[#E8E3D9]/70 border-b border-white/10 pb-3">
                <span>{current.label}</span>
                <span className="tabular-nums">
                  {activeMode === '2d'
                    ? 'Scale 1:100 Sheet'
                    : activeMode === '3d'
                      ? 'FOV 75° Screen View'
                      : 'Scale 1:1 Studio Floor'}
                </span>
              </div>

              <div className="my-6 flex items-center justify-center flex-1">
                {activeMode === '2d' && (
                  <svg
                    viewBox="0 0 420 220"
                    className="w-full max-w-md h-auto"
                    aria-label="2D paper blueprint schematic"
                  >
                    <rect
                      x="30"
                      y="25"
                      width="360"
                      height="170"
                      fill="none"
                      stroke="#E8E3D9"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="190"
                      y1="25"
                      x2="190"
                      y2="145"
                      stroke="#E8E3D9"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="30"
                      y1="145"
                      x2="390"
                      y2="145"
                      stroke="#E8E3D9"
                      strokeOpacity="0.3"
                      strokeDasharray="4 4"
                    />
                    <rect
                      x="65"
                      y="60"
                      width="90"
                      height="50"
                      fill="none"
                      stroke="#77746D"
                      strokeWidth="1"
                    />
                    <text x="110" y="90" textAnchor="middle" fill="#77746D" fontSize="11">
                      14&apos; × 11&apos;
                    </text>
                    <text x="290" y="90" textAnchor="middle" fill="#77746D" fontSize="11">
                      DINING ?
                    </text>
                    <text x="210" y="176" textAnchor="middle" fill="#E8E3D9" fontSize="10" opacity="0.65">
                      Flat dimensions require mental guesswork
                    </text>
                  </svg>
                )}

                {activeMode === '3d' && (
                  <svg
                    viewBox="0 0 420 220"
                    className="w-full max-w-md h-auto"
                    aria-label="Screen-based 3D perspective render schematic"
                  >
                    <rect
                      x="55"
                      y="25"
                      width="310"
                      height="160"
                      rx="2"
                      fill="#232421"
                      stroke="#E8E3D9"
                      strokeOpacity="0.45"
                    />
                    <polygon
                      points="75,165 160,95 260,95 345,165"
                      fill="none"
                      stroke="#B97856"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points="160,95 160,55 260,55 260,95"
                      fill="none"
                      stroke="#E8E3D9"
                      strokeOpacity="0.55"
                    />
                    <line x1="75" y1="45" x2="160" y2="55" stroke="#E8E3D9" strokeOpacity="0.4" />
                    <line x1="345" y1="45" x2="260" y2="55" stroke="#E8E3D9" strokeOpacity="0.4" />
                    <text x="210" y="205" textAnchor="middle" fill="#E8E3D9" fontSize="10" opacity="0.7">
                      Bounded by screen size and camera focal length
                    </text>
                  </svg>
                )}

                {activeMode === '1to1' && (
                  <svg
                    viewBox="0 0 420 220"
                    className="w-full max-w-md h-auto"
                    aria-label="Walk The Plan 1:1 true-scale floor projection schematic"
                  >
                    <rect
                      x="25"
                      y="20"
                      width="370"
                      height="180"
                      fill="#141513"
                      stroke="#B97856"
                      strokeWidth="2"
                    />
                    {/* Illuminated 1:1 walls */}
                    <path
                      d="M45 40 H375 V180 H45 Z M215 40 V120 M45 135 H140"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    {/* Door swing arc */}
                    <path
                      d="M215 120 L255 120 A40 40 0 0 1 215 160"
                      fill="none"
                      stroke="#B97856"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    {/* Real-scale furniture blocks */}
                    <rect x="70" y="60" width="95" height="45" fill="#B97856" fillOpacity="0.28" stroke="#B97856" />
                    <rect x="255" y="65" width="85" height="48" fill="#B97856" fillOpacity="0.28" stroke="#B97856" />
                    {/* Human scale markers */}
                    <circle cx="192" cy="110" r="6" fill="#F5F2EB" />
                    <circle cx="242" cy="145" r="6" fill="#F5F2EB" />
                    <text x="117" y="86" textAnchor="middle" fill="#F5F2EB" fontSize="10">
                      REAL SOFA
                    </text>
                    <text x="297" y="93" textAnchor="middle" fill="#F5F2EB" fontSize="10">
                      DINING 6P
                    </text>
                    <text x="210" y="194" textAnchor="middle" fill="#E8E3D9" fontSize="10">
                      Walkable 1:1 projection with physical clearances
                    </text>
                  </svg>
                )}
              </div>

              <p className="text-xs text-[#E8E3D9]/70">
                {activeMode === '1to1'
                  ? 'Calibrated overhead projection bay · Real furniture props · Multi-person walkthrough'
                  : 'Compare with Walk The Plan 1:1 Projection using the tabs above'}
              </p>
            </div>

            {/* Editorial Breakdown */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div>
                <h4 className="font-serif text-2xl md:text-3xl leading-snug text-[#191A18]">
                  {current.headline}
                </h4>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-[#77746D]">
                  {current.summary}
                </p>
              </div>

              <div className="space-y-4 border-t border-[#191A18]/12 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#B97856] font-medium">
                    Scale Perception
                  </p>
                  <p className="mt-1 text-sm text-[#191A18]">{current.scalePerception}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#B97856] font-medium">
                    Clearance & Ergonomics
                  </p>
                  <p className="mt-1 text-sm text-[#191A18]">{current.clearanceCheck}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#B97856] font-medium">
                    Stakeholder Alignment
                  </p>
                  <p className="mt-1 text-sm text-[#191A18]">{current.stakeholderAlignment}</p>
                </div>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
