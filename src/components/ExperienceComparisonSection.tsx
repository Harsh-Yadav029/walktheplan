"use client";

import { useMemo } from "react";
import { Ruler, Move, DoorOpen, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function ExperienceComparisonSection() {
  const capabilities = useMemo(
    () => [
      {
        number: "01",
        icon: Ruler,
        title: "1:1 CAD Floor Projection",
        tagline: "Laser-calibrated floor vector mapping",
        description:
          "High-lumen overhead projectors cast your exact architectural CAD drawings onto the floor at true 100% life-size scale with millimeter precision.",
        benefits: [
          "Actual wall thickness and column placement",
          "Zero optical distortion or wide-angle warping",
          "True corridor widths and entryway dimensions",
        ],
      },
      {
        number: "02",
        icon: Move,
        title: "Movable Modular Furniture",
        tagline: "Physical mockups rolled into position",
        description:
          "Stage physical, full-size modular sofa sectionals, king beds, dining tables, and kitchen counters directly on your projected room outlines.",
        benefits: [
          "Walk around actual bed frames and nightstands",
          "Test dining chair pull-back clearances",
          "Experience living room circulation and aisle flows",
        ],
      },
      {
        number: "03",
        icon: DoorOpen,
        title: "Door & Clearance Validation",
        tagline: "Test swings, shutters & passage pinching",
        description:
          "Physically swing mockup door panels and wardrobe shutters to catch awkward collisions with beds, bathroom doors, or AC vents before construction.",
        benefits: [
          "Identify wardrobe clashing with bedside tables",
          "Verify powder room and ensuite entry clearances",
          "Ensure comfortable passage for elders and children",
        ],
      },
      {
        number: "04",
        icon: CheckCircle2,
        title: "Live Architect Plan Freeze",
        tagline: "Real-time vector markup in the session",
        description:
          "Our spatial operators adjust wall offsets, electrical switch locations, and plumbing points on the live projection while you and your architect discuss.",
        benefits: [
          "Instant CAD adjustment on the studio floor",
          "Signed-off spatial notes for civil contractors",
          "Single-session plan freeze with zero ambiguity",
        ],
      },
    ],
    []
  );

  return (
    <section
      id="experience"
      className="relative w-full py-10 md:py-14 bg-[#141516] text-[#F2EDE5] border-b border-white/10 overflow-hidden select-none"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A]">
              <Sparkles className="w-3.5 h-3.5 text-[#C47B52]" />
              <span>Studio Experience • Core Capabilities</span>
            </div>
            <h2
              data-motion-text="lines"
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]"
            >
              Step Into Every Dimension Before Masonry Starts
            </h2>
          </div>
          <p
            data-reveal="fade-up"
            data-reveal-delay="0.1"
            className="text-sm sm:text-base text-[#A5A7A4] max-w-md font-light leading-relaxed"
          >
            From your AutoCAD file to our laser-calibrated bay floor, we turn abstract 2D drawings into
            a physical, walkable rehearsal of your future space.
          </p>
        </div>

        {/* 4 Physical Capabilities Cards */}
        <div data-reveal-group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.number}
                data-reveal-item
                className="group relative rounded-2xl bg-[#181A1B] border border-white/10 p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#C47B52]/50 hover:bg-[#1E2021] hover:-translate-y-1 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C47B52]/15 text-[#C47B52] border border-[#C47B52]/30 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-sm text-[#EED77A] font-medium tracking-wider">
                      {cap.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#EED77A] transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#C47B52] mt-1">
                      {cap.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A5A7A4] leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                  {cap.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#E5E0D8]/80">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C47B52] shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Studio Walk Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl sm:text-2xl font-semibold text-white">
              Experience your layout in 1:1 scale before civil work begins
            </h4>
            <p className="text-sm text-[#A5A7A4]">
              Available across our 5 dedicated studios in Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.
            </p>
          </div>
          <a
            href="#book"
            className="inline-flex items-center gap-2 bg-[#C47B52] hover:bg-[#A85E43] text-white px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors shadow-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Book Studio Walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default ExperienceComparisonSection;
