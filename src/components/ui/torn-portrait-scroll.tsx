"use client";

import React, { useRef, useState, useId } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Sparkles, Layers, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                               DESIGN TOKENS                                */
/* -------------------------------------------------------------------------- */
const NOIR_TOKENS = {
  colors: {
    primary: "#FF98A2",
    primaryHover: "#FFAFB7",
    secondary: "#EFEEF0",
    tertiary: "#374151",
    neutral: "#000000",
    surface: "#0A0A0A",
    onSurface: "#EFEEF0",
    error: "#FF5C77",
  },
  spacing: {
    xs: "10px",
    sm: "22px",
    md: "40px",
    lg: "74px",
    xl: "86px",
  },
  rounded: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
export interface TornPortraitItem {
  id: string;
  tag: string;
  index: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  // Underneath Layer: Raw CAD blueprint / architectural wireframe
  blueprintImage: string;
  // Top Layer: Finished space / portrait
  finishedImage: string;
  metrics: {
    scale: string;
    clearance: string;
    status: string;
  };
}

export interface TornPortraitScrollProps {
  items?: TornPortraitItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                               DEFAULT DATA                                 */
/* -------------------------------------------------------------------------- */
export const DEFAULT_TORN_ITEMS: TornPortraitItem[] = [
  {
    id: "portrait-01",
    tag: "01 / FOUNDATION & FOUNDER",
    index: "01",
    title: "SPATIAL ARCHITECTURE",
    subtitle: "Parth Khanna & Himanshu Makkar",
    location: "Gurugram Flagship Studio",
    description:
      "Tearing through abstract 2D paper blueprints to reveal living 1:1 human reality. Every corridor, door swing, and furniture walkway verified before masonry.",
    blueprintImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    finishedImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      scale: "1:1 CALIBRATED",
      clearance: "100% VERIFIED",
      status: "DAY-1 FREEZE",
    },
  },
  {
    id: "portrait-02",
    tag: "02 / LIVING PAVILION",
    index: "02",
    title: "BARE-SHELL EXPLORATION",
    subtitle: "Courtyard Villa & Duplex Walkthrough",
    location: "Dehradun Hill Studio",
    description:
      "Real-time bare-shell volumetric review. Step through floor-to-ceiling dining clearance and check morning daylight sightlines live on the projection bay.",
    blueprintImage:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80",
    finishedImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      scale: "1:1 PHYSICAL",
      clearance: "3.2M AISLE",
      status: "NO DEMOLITION",
    },
  },
  {
    id: "portrait-03",
    tag: "03 / MASTER RESIDENCE",
    index: "03",
    title: "3D DESIGN VISUALIZATION",
    subtitle: "Travertine, Teak & Natural Light",
    location: "Hyderabad Regional Studio",
    description:
      "Photorealistic material simulation meets full-scale laser projection. Move rolling furniture blocks over projected boundary lines in real time.",
    blueprintImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    finishedImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      scale: "1:1 LASER",
      clearance: "4.5M SPAN",
      status: "APPROVED",
    },
  },
  {
    id: "portrait-04",
    tag: "04 / CONSENSUS SIGN-OFF",
    index: "04",
    title: "ZERO DEMOLITION REWORK",
    subtitle: "Homeowner, Architect & Builder Alignment",
    location: "Varanasi Experience Center",
    description:
      "Walk the plan with your family and contractor simultaneously. Eliminate mid-construction arguments and save ₹3.5L to ₹15L+ in avoided civil demolition.",
    blueprintImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    finishedImage:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      scale: "TRIPLE CONSENSUS",
      clearance: "ZERO SURPRISES",
      status: "PLAN SIGNED",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                        ORGANIC TORN PAPER SVG EDGE                         */
/* -------------------------------------------------------------------------- */
function TornPaperClipPath({ clipId }: { clipId: string }) {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d="M 0,0 L 0.52,0 C 0.54,0.06 0.49,0.12 0.53,0.18 C 0.56,0.24 0.50,0.31 0.54,0.37 C 0.58,0.44 0.51,0.51 0.55,0.58 C 0.59,0.64 0.52,0.72 0.56,0.79 C 0.60,0.86 0.51,0.93 0.54,1 L 0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                       SINGLE TORN PORTRAIT CARD                            */
/* -------------------------------------------------------------------------- */
function TornPortraitCard({
  item,
  isActive,
  onSelect,
}: {
  item: TornPortraitItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  const [splitPos, setSplitPos] = useState(52); // percentage split
  const [isHovered, setIsHovered] = useState(false);
  const clipId = useId().replace(/:/g, "-") + "-torn-clip";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(25, Math.min(75, (x / rect.width) * 100));
    setSplitPos(pct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSplitPos(52);
  };

  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden cursor-pointer select-none",
        "bg-[#0A0A0A] border transition-all duration-300",
        isActive
          ? "border-[#FF98A2] ring-1 ring-[#FF98A2]/50 shadow-[0_0_30px_rgba(255,152,162,0.15)]"
          : "border-[#374151] hover:border-[#FF98A2]/60"
      )}
      style={{
        borderRadius: NOIR_TOKENS.rounded.md, // 8px card radius per spec
        padding: "16px",
      }}
      layout
    >
      <TornPaperClipPath clipId={clipId} />

      {/* Top Metadata Row: Index, Tag & Location */}
      <div className="flex items-center justify-between pb-3 border-b border-[#374151]/60">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: isActive ? "#FF98A2" : "#374151",
              color: isActive ? "#000000" : "#EFEEF0",
              borderColor: isActive ? "#FF98A2" : "#374151",
            }}
          >
            {item.index}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#EFEEF0]/80">
            {item.location}
          </span>
        </div>

        <span
          className="text-[11px] font-mono tracking-widest uppercase transition-colors"
          style={{ color: isActive ? "#FF98A2" : "#374151" }}
        >
          {item.metrics.status}
        </span>
      </div>

      {/* Main Visual: Dual-Layered Torn Portrait Container */}
      <div className="relative w-full aspect-[4/5] my-4 overflow-hidden rounded-[4px] bg-black">
        {/* Layer 1: Underneath CAD Blueprint Wireframe */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={item.blueprintImage}
            alt={`${item.title} Blueprint`}
            className="w-full h-full object-cover filter contrast-125 grayscale invert"
          />
          {/* Neon Pink Blueprint Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
            style={{
              backgroundImage:
                "linear-gradient(to right, #FF98A2 1px, transparent 1px), linear-gradient(to bottom, #FF98A2 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Blueprint Telemetry Stamp */}
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 border border-[#FF98A2]/40 rounded text-[10px] font-mono text-[#FF98A2]">
            [CAD 1:1 VECTORS ACTIVE]
          </div>
        </div>

        {/* Layer 2: Top Finished Photorealistic Space with Torn Edge Mask */}
        <motion.div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos - 4}% 20%, ${splitPos + 3}% 40%, ${splitPos - 2}% 60%, ${splitPos + 4}% 80%, ${splitPos - 3}% 100%, 0 100%)`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <img
            src={item.finishedImage}
            alt={`${item.title} Reality`}
            className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
          
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 border border-white/20 rounded text-[10px] font-mono text-[#EFEEF0]">
            [REALITY LAYER]
          </div>
        </motion.div>

        {/* Neon Pink Torn Edge Seam Highlighter */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none w-[2px] transition-all duration-75"
          style={{
            left: `${splitPos}%`,
            backgroundColor: "#FF98A2",
            boxShadow: "0 0 12px #FF98A2, 0 0 4px #FFFFFF",
          }}
        />

        {/* Drag / Hover Indicator Pill */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 border border-[#374151] text-[10px] font-mono text-[#EFEEF0] backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity"
        >
          <SlidersHorizontal className="w-3 h-3 text-[#FF98A2]" />
          <span>Slide to Tear</span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="space-y-2 pt-1">
        <h4 className="font-bold text-lg text-[#EFEEF0] tracking-tight group-hover:text-[#FF98A2] transition-colors leading-tight">
          {item.title}
        </h4>
        <p className="text-xs font-mono text-[#FF98A2] tracking-wide">
          {item.subtitle}
        </p>
        <p className="text-xs text-[#EFEEF0]/70 line-clamp-2 leading-relaxed font-sans">
          {item.description}
        </p>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#374151]/50 text-[11px] font-mono">
          <div>
            <span className="text-[#374151] block text-[9px]">SCALE</span>
            <span className="text-[#EFEEF0]">{item.metrics.scale}</span>
          </div>
          <div>
            <span className="text-[#374151] block text-[9px]">CLEARANCE</span>
            <span className="text-[#FF98A2]">{item.metrics.clearance}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                   MAIN TORN PORTRAIT SCROLL COMPONENT                      */
/* -------------------------------------------------------------------------- */
export function TornPortraitScroll({
  items = DEFAULT_TORN_ITEMS,
  eyebrow = "01 / THE EXPERIENTIAL ARCHIVE",
  title = "WHERE VISION TEARS INTO REAL LIVING SCALE.",
  description = "A high-contrast cinematic spatial system pairing pitch-black architectural stages with luminous neon pink laser vectors. Hover and drag across any portrait to tear through abstract 2D drawings into physical 1:1 scale.",
  primaryCtaText = "Book Studio Walkthrough",
  secondaryCtaText = "Explore 1:1 Technology",
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  className,
}: TornPortraitScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Scroll Progress Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const activeItem = items[selectedIndex] || items[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative w-full bg-[#000000] text-[#EFEEF0] overflow-hidden select-none font-sans",
        className
      )}
      style={{
        paddingTop: NOIR_TOKENS.spacing.xl, // 86px per spec
        paddingBottom: NOIR_TOKENS.spacing.xl,
      }}
    >
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(#374151 1px, transparent 1px), linear-gradient(to right, #0A0A0A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* ------------------------------------------------------------------
            1. HEADER SECTION (Following Panchang / Roboto 69px typography rules)
        ------------------------------------------------------------------- */}
        <div className="space-y-4 max-w-4xl">
          {/* Chip pill per spec (tertiary #374151, rounded-full, 8px 12px) */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#374151] border border-[#374151] text-xs font-mono tracking-widest text-[#EFEEF0]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF98A2]" />
            <span>{eyebrow}</span>
          </div>

          {/* Headline Display: 69px 900 heavy weight feel */}
          <h2
            className="font-bold tracking-tight text-[#EFEEF0] leading-[1.05]"
            style={{
              fontSize: "clamp(2.4rem, 4.8vw, 69px)",
            }}
          >
            {title.split(" ").map((word, i) =>
              word.toLowerCase().includes("tears") || word.toLowerCase().includes("scale") ? (
                <span key={i} className="text-[#FF98A2]">
                  {word}{" "}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>

          <p
            className="text-base sm:text-lg text-[#EFEEF0]/80 font-normal leading-relaxed max-w-2xl"
            style={{ marginTop: NOIR_TOKENS.spacing.sm }}
          >
            {description}
          </p>
        </div>

        {/* ------------------------------------------------------------------
            2. TOP CONTROLS & TIMELINE INDICATOR
        ------------------------------------------------------------------- */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#374151] pb-6"
          style={{ marginTop: NOIR_TOKENS.spacing.md }}
        >
          {/* Active Status Display */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-mono font-bold text-[#FF98A2]">
              {activeItem.index} <span className="text-sm text-[#374151]">/ 0{items.length}</span>
            </span>
            <span className="h-4 w-px bg-[#374151]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#EFEEF0]/90">
              {activeItem.title} • {activeItem.location}
            </span>
          </div>

          {/* Prev / Next Kinetic Slider Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-3 rounded-[4px] bg-[#0A0A0A] border border-[#374151] hover:border-[#FF98A2] text-[#EFEEF0] transition-colors cursor-pointer"
              aria-label="Previous Portrait"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-3 rounded-[4px] bg-[#0A0A0A] border border-[#374151] hover:border-[#FF98A2] text-[#EFEEF0] transition-colors cursor-pointer"
              aria-label="Next Portrait"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            3. CAROUSEL / GRID OF TORN PORTRAITS
        ------------------------------------------------------------------- */}
        <div
          ref={scrollTrackRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ marginTop: NOIR_TOKENS.spacing.md }}
        >
          {items.map((item, idx) => (
            <TornPortraitCard
              key={item.id}
              item={item}
              isActive={idx === selectedIndex}
              onSelect={() => setSelectedIndex(idx)}
            />
          ))}
        </div>

        {/* ------------------------------------------------------------------
            4. ACTIVE INSPECTION DETAIL PANEL
        ------------------------------------------------------------------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-[8px] bg-[#0A0A0A] border border-[#374151] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            style={{ marginTop: NOIR_TOKENS.spacing.md }}
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF98A2] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#FF98A2]">
                  {activeItem.tag}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EFEEF0]">
                {activeItem.title}
              </h3>
              <p className="text-sm text-[#EFEEF0]/80 leading-relaxed font-sans">
                {activeItem.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 border-t lg:border-t-0 lg:border-l border-[#374151] pt-4 lg:pt-0 lg:pl-8 text-xs font-mono">
              <div>
                <span className="block text-[#374151] text-[10px] uppercase">Scale Mode</span>
                <span className="text-[#FF98A2] font-semibold text-sm">{activeItem.metrics.scale}</span>
              </div>
              <div>
                <span className="block text-[#374151] text-[10px] uppercase">Corridor Clearance</span>
                <span className="text-[#EFEEF0] font-semibold text-sm">{activeItem.metrics.clearance}</span>
              </div>
              <div>
                <span className="block text-[#374151] text-[10px] uppercase">Civil Protocol</span>
                <span className="text-emerald-400 font-semibold text-sm">{activeItem.metrics.status}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ------------------------------------------------------------------
            5. SIGNATURE LENIS NOIR BUTTONS (EXACT SPECIFICATION)
            - button-primary: bg #FF98A2, text #000000, rounded 16px, h-16, min-w 453px
            - button-secondary: transparent, text #EFEEF0, rounded 4px, border 1px #374151
        ------------------------------------------------------------------- */}
        <div
          className="flex flex-col lg:flex-row items-center justify-center gap-6"
          style={{ marginTop: NOIR_TOKENS.spacing.lg }}
        >
          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={onPrimaryCtaClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-mono text-sm uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-xl hover:-translate-y-0.5"
            style={{
              backgroundColor: NOIR_TOKENS.colors.primary,
              color: NOIR_TOKENS.colors.neutral,
              borderRadius: NOIR_TOKENS.rounded.lg, // 16px
              padding: "24px 33px",
              height: "64px",
              minWidth: "min(100%, 453px)", // 453px minWidth per spec, responsive on small mobile
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = NOIR_TOKENS.colors.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = NOIR_TOKENS.colors.primary)}
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          {/* Secondary CTA Button */}
          <button
            type="button"
            onClick={onSecondaryCtaClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-mono text-base uppercase tracking-wider transition-all duration-200 cursor-pointer hover:border-[#FF98A2] hover:bg-white/5"
            style={{
              backgroundColor: "transparent",
              color: NOIR_TOKENS.colors.onSurface,
              borderRadius: NOIR_TOKENS.rounded.sm, // 4px
              border: `1px solid ${NOIR_TOKENS.colors.tertiary}`,
              padding: "24px 33px",
              height: "64px",
              minWidth: "min(100%, 453px)", // 453px minWidth per spec
            }}
          >
            <Eye className="w-4 h-4 text-[#FF98A2]" />
            <span>{secondaryCtaText}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default TornPortraitScroll;