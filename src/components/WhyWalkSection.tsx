"use client";

import { useMemo } from "react";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { CompareUILib, type ComparisonData } from "./ui/shadcn-studio-compare-07";

export function WhyWalkSection() {
  const comparisonData: ComparisonData = useMemo(
    () => ({
      column1Header: {
        title: "TRADITIONAL 2D BLUEPRINTS",
      },
      column2Header: {
        title: "3D VIRTUAL RENDERS & VR",
      },
      column3Header: "✨ WALK THE PLAN (1:1 SCALE)",
      features: [
        {
          name: "True Spatial Depth & Walkway Feel",
          column1: (
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="text-sm">❌</span>
              <span>0% (Abstract flat lines)</span>
            </span>
          ),
          column2: (
            <span className="inline-flex items-center gap-2 text-amber-400 font-medium">
              <span className="text-sm">⚠️</span>
              <span>Warped wide-angle lens (looks 30% larger)</span>
            </span>
          ),
          column3: (
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="text-sm">✅</span>
              <span>100% True Physical Footprint</span>
            </span>
          ),
        },
        {
          name: "Physical Movable Furniture Testing",
          column1: (
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="text-sm">❌</span>
              <span>Impossible</span>
            </span>
          ),
          column2: (
            <span className="inline-flex items-center gap-2 text-amber-400 font-medium">
              <span className="text-sm">⚠️</span>
              <span>Virtual only, no physical touch</span>
            </span>
          ),
          column3: (
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="text-sm">✅</span>
              <span>Real beds, tables & counters rolled on lines</span>
            </span>
          ),
        },
        {
          name: "Door Swing & Passage Clearance Check",
          column1: (
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="text-sm">❌</span>
              <span>Hidden until walls are erected</span>
            </span>
          ),
          column2: (
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="text-sm">❌</span>
              <span>Collisions routinely missed</span>
            </span>
          ),
          column3: (
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="text-sm">✅</span>
              <span>Physical door swings & hallway clearance</span>
            </span>
          ),
        },
        {
          name: "Live On-Site CAD / Vector Adjustment",
          column1: (
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="text-sm">❌</span>
              <span>Days of redraws and back-and-forth</span>
            </span>
          ),
          column2: (
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="text-sm">❌</span>
              <span>Weeks of expensive re-rendering</span>
            </span>
          ),
          column3: (
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="text-sm">✅</span>
              <span>Real-time CAD tweaking live on projector</span>
            </span>
          ),
        },
        {
          name: "Stakeholder Consensus (Owner + Architect + Contractor)",
          column1: (
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="text-sm">❌</span>
              <span>Frequent site arguments & blame games</span>
            </span>
          ),
          column2: (
            <span className="inline-flex items-center gap-2 text-amber-400 font-medium">
              <span className="text-sm">⚠️</span>
              <span>Solitary headset view</span>
            </span>
          ),
          column3: (
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="text-sm">✅</span>
              <span>All 3 parties walk and agree in 60 mins</span>
            </span>
          ),
        },
        {
          name: "Average Cost Saved on Demolition Rework",
          column1: (
            <div className="space-y-0.5">
              <span className="text-red-400 font-semibold">₹0</span>
              <span className="block text-xs text-[#A5A7A4]">(Costs ₹3L–₹15L in change orders)</span>
            </div>
          ),
          column2: (
            <span className="text-amber-400 font-medium">
              Minimal rework reduction
            </span>
          ),
          column3: (
            <div className="inline-flex items-center gap-2 text-[#EED77A] font-bold text-base">
              <span>🏆</span>
              <span>₹3.5 Lakh – ₹15+ Lakh Saved</span>
            </div>
          ),
        },
      ],
    }),
    []
  );

  return (
    <section
      id="why-walk"
      className="relative w-full py-10 md:py-14 bg-[#141516] text-[#F2EDE5] border-b border-white/10 overflow-hidden select-none"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C47B52]" />
            <span>Why Walk The Plan • Proven Spatial ROI</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08] max-w-4xl">
            Better Decisions Begin Before Construction
          </h2>
          <p className="mt-4 text-[#A5A7A4] max-w-3xl text-sm sm:text-base md:text-lg font-light leading-relaxed">
            Changes on a projected floor take minutes. Modifying brick walls, plumbing lines, or
            structural openings on site costs months and compromises your living experience.
          </p>
        </div>

        {/* Comparison Table Component */}
        <CompareUILib
          data={comparisonData}
          featuresLabel="FEATURE / CAPABILITY"
        />

        {/* 3 Metric Cards for Financial & Operational ROI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-3 text-[#C47B52]">
              <TrendingUp className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#A5A7A4]">
                Financial ROI
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
              ₹3.5L – ₹15L+
            </p>
            <p className="text-xs sm:text-sm text-[#A5A7A4] leading-relaxed">
              Average civil demolition, plumbing rerouting, and wall reconstruction costs saved per project.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-3 text-[#EED77A]">
              <Users className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#A5A7A4]">
                Stakeholder Clarity
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
              100% Alignment
            </p>
            <p className="text-xs sm:text-sm text-[#A5A7A4] leading-relaxed">
              Owner, family members, architect, and site contractor align on every room layout in a single 60-minute session.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-3 text-[#C47B52]">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#A5A7A4]">
                Construction Confidence
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Zero Regrets
            </p>
            <p className="text-xs sm:text-sm text-[#A5A7A4] leading-relaxed">
              Eliminates the anxiety of moving in and realizing your dining island or wardrobe door doesn&apos;t fit.
            </p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.04] to-[#C47B52]/10 border border-[#C47B52]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl sm:text-2xl font-semibold text-white">
              Ready to freeze your plan before breaking ground?
            </h4>
            <p className="text-sm text-[#A5A7A4]">
              Walk your CAD blueprint at 1:1 scale at any of our 5 studio locations across India.
            </p>
          </div>
          <a
            href="#book"
            className="inline-flex items-center gap-2 bg-[#C47B52] hover:bg-[#A85E43] text-white px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[#C47B52]/30 shrink-0 cursor-pointer"
          >
            <span>Book A Studio Session</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default WhyWalkSection;
