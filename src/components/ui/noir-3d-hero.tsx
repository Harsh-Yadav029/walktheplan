"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Eye,
  Ruler,
  Move,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*                         LENIS NOIR PINK DESIGN TOKENS                      */
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

export interface Noir3DHeroProps {
  onBookClick?: () => void;
  onExploreClick?: () => void;
  className?: string;
}

export function Noir3DHero({
  onBookClick,
  onExploreClick,
  className,
}: Noir3DHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. GSAP ScrollTrigger Pinning: Guarantees EXACT zero-gap flow into next section
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=130%", // Compact 1.3 screen scroll - snappy zoom without dead space
      pin: true,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, self.progress));
        setProgress(p);

        // Notify Navbar of hero state
        window.dispatchEvent(
          new CustomEvent("wtp-hero-progress", {
            detail: { progress: p, active: self.isActive },
          })
        );

        if (p < 0.33) {
          setActiveStage(1);
        } else if (p < 0.66) {
          setActiveStage(2);
        } else {
          setActiveStage(3);
        }
      },
    });

    return () => st.kill();
  }, []);

  // 2. 3D Camera Zoom, Perspective Tilt & Z-Axis Flight
  const cameraScale = 1 + progress * 3.8;
  const cameraZ = progress * 780;
  const cameraRotateX = 40 * (1 - progress);
  const cameraTranslateY = -progress * 160;

  // Layer Opacities derived from progress
  const wallExtrude = Math.min(1, Math.max(0, (progress - 0.15) / 0.4));
  const furnitureDrop = Math.min(1, Math.max(0, (progress - 0.25) / 0.35));
  const realityReveal = Math.min(1, Math.max(0, (progress - 0.6) / 0.35));
  const percentDisplay = Math.round(progress * 100);

  // Subtle Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 6;
    const y = (clientY / innerHeight - 0.5) * -6;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      id="top"
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-screen h-[100dvh] bg-[#000000] text-[#EFEEF0] select-none font-sans overflow-hidden flex items-center justify-center m-0 p-0",
        className
      )}
    >
      {/* Ambient Dark Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,#000000_100%)] opacity-90" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/70" />

      {/* ------------------------------------------------------------------
          TOP TELEMETRY BAR (LENIS NOIR SYSTEM)
      ------------------------------------------------------------------- */}
      <div className="absolute top-8 left-0 right-0 z-30 px-5 sm:px-10 max-w-[1440px] mx-auto flex items-center justify-between pointer-events-none">
        {/* Status Chip pill (Tertiary #374151, rounded-full per spec) */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#374151]/90 backdrop-blur-md border border-[#374151] text-[11px] font-mono uppercase tracking-widest text-[#EFEEF0]">
          <span className="w-2 h-2 rounded-full bg-[#FF98A2] animate-pulse" />
          <span>3D SPATIAL ZOOM ACTIVE</span>
          <span className="text-[#374151]">|</span>
          <span className="text-[#FF98A2]">SCALE 1:1</span>
        </div>

        {/* Telemetry Stage & Coordinates Readout */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-[#EFEEF0]/80 bg-[#0A0A0A]/90 backdrop-blur-md px-4 py-1.5 rounded-[4px] border border-[#374151]">
          <span>CAMERA Z: {Math.round(percentDisplay * 7.8)}MM</span>
          <span className="w-px h-3 bg-[#374151]" />
          <span>STAGE: 0{activeStage} / 03</span>
          <span className="w-px h-3 bg-[#374151]" />
          <span className="text-[#FF98A2] font-semibold">ZOOM: {100 + Math.round(percentDisplay * 3.8)}%</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3D PERSPECTIVE CANVAS STAGE (CSS 3D TRANSFORM ENGINE)
      ------------------------------------------------------------------- */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className="relative w-[900px] h-[640px] sm:w-[1100px] sm:h-[760px] will-change-transform transition-transform duration-75 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${cameraScale}) translate3d(0px, ${cameraTranslateY}px, ${cameraZ}px) rotateX(${cameraRotateX}deg) rotateY(${mousePos.x}deg)`,
          }}
        >
          {/* LAYER 1: PITCH BLACK ARCHITECTURAL BASE & NEON PINK GRID */}
          <div
            className="absolute inset-0 rounded-[8px] bg-[#0A0A0A] border border-[#374151] overflow-hidden"
            style={{
              boxShadow: "0 0 60px rgba(255, 152, 162, 0.08)",
            }}
          >
            {/* Coordinate Grid Lines */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #374151 1px, transparent 1px), linear-gradient(to bottom, #374151 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Laser Projector Floor Crosshairs */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#FF98A2]/30" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#FF98A2]/30" />

            {/* LAYER 2: 2D BLUEPRINT VECTOR BOUNDARIES (STAGE 1) */}
            <svg
              viewBox="0 0 1100 760"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <rect
                x="120"
                y="100"
                width="520"
                height="380"
                fill="none"
                stroke="#FF98A2"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="opacity-90"
              />
              <rect
                x="680"
                y="100"
                width="300"
                height="220"
                fill="none"
                stroke="#FF98A2"
                strokeWidth="2"
              />
              <rect
                x="680"
                y="360"
                width="300"
                height="280"
                fill="none"
                stroke="#FF98A2"
                strokeWidth="2"
              />
              <rect
                x="120"
                y="520"
                width="520"
                height="120"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <path
                d="M 680,220 A 80,80 0 0,0 760,300"
                fill="none"
                stroke="#FF98A2"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M 680,480 A 90,90 0 0,1 770,570"
                fill="none"
                stroke="#FF98A2"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text x="320" y="85" fill="#EFEEF0" fontSize="12" fontFamily="monospace" textAnchor="middle">
                LIVING PAVILION • 26'0" × 19'0"
              </text>
              <text x="830" y="85" fill="#EFEEF0" fontSize="12" fontFamily="monospace" textAnchor="middle">
                OPEN KITCHEN • 15'0" × 11'0"
              </text>
              <text x="830" y="660" fill="#EFEEF0" fontSize="12" fontFamily="monospace" textAnchor="middle">
                MASTER SUITE • 15'0" × 14'0"
              </text>
              <text x="380" y="585" fill="#FF98A2" fontSize="11" fontFamily="monospace" textAnchor="middle">
                [1:1 WALKING CORRIDOR • CLEARANCE 4'6"]
              </text>
            </svg>
          </div>

          {/* LAYER 3: 3D EXTRUDING WALLS & WIREFRAME VOLUMES (STAGE 2) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150"
            style={{
              transformStyle: "preserve-3d",
              opacity: wallExtrude,
            }}
          >
            <div
              className="absolute left-[118px] top-[98px] w-[524px] h-[384px] border-2 border-[#FF98A2] rounded-[4px]"
              style={{
                transform: "translateZ(80px)",
                boxShadow: "0 0 24px rgba(255,152,162,0.3)",
              }}
            >
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#FF98A2] -translate-x-1 -translate-y-1 shadow-[0_0_10px_#FF98A2]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF98A2] translate-x-1 -translate-y-1 shadow-[0_0_10px_#FF98A2]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FF98A2] -translate-x-1 translate-y-1 shadow-[0_0_10px_#FF98A2]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FF98A2] translate-x-1 translate-y-1 shadow-[0_0_10px_#FF98A2]" />

              <div className="absolute top-3 left-3 px-2 py-1 bg-black/90 border border-[#FF98A2] rounded text-[10px] font-mono text-[#FF98A2]">
                [WALL HEIGHT: 3.2M CALIBRATED]
              </div>
            </div>

            <div
              className="absolute left-[678px] top-[98px] w-[304px] h-[544px] border-2 border-[#FF98A2]/80 rounded-[4px]"
              style={{
                transform: "translateZ(80px)",
              }}
            />
          </div>

          {/* LAYER 4: SCALED MODULAR FURNITURE BLOCKS (STAGE 2) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150"
            style={{
              transformStyle: "preserve-3d",
              opacity: furnitureDrop,
            }}
          >
            {/* Modular Sectional Sofa Block */}
            <div
              className="absolute left-[200px] top-[180px] w-[260px] h-[160px] bg-[#0A0A0A]/95 border border-[#374151] rounded-[6px] p-3 flex flex-col justify-between"
              style={{
                transform: "translateZ(40px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.8), 0 0 16px rgba(255,152,162,0.15)",
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#EFEEF0]">
                <span className="text-[#FF98A2]">MODULAR SOFA</span>
                <span>9'6" × 5'8"</span>
              </div>
              <div className="w-full h-1 bg-[#FF98A2]/40 rounded-full" />
              <span className="text-[9px] font-mono text-emerald-400">PASSED: 3.5 FT WALKWAY CLEAR</span>
            </div>

            {/* Dining Island Block */}
            <div
              className="absolute left-[720px] top-[140px] w-[220px] h-[110px] bg-[#0A0A0A]/95 border border-[#374151] rounded-[6px] p-3 flex flex-col justify-between"
              style={{
                transform: "translateZ(40px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.8)",
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#EFEEF0]">
                <span className="text-[#FF98A2]">DINING 6-SEATER</span>
                <span>7'0" × 3'6"</span>
              </div>
              <span className="text-[9px] font-mono text-[#EFEEF0]/70">CHAIR PULL-OUT: VERIFIED</span>
            </div>

            {/* King Bed with Nightstands */}
            <div
              className="absolute left-[720px] top-[420px] w-[220px] h-[180px] bg-[#0A0A0A]/95 border border-[#374151] rounded-[6px] p-3 flex flex-col justify-between"
              style={{
                transform: "translateZ(40px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.8)",
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#EFEEF0]">
                <span className="text-[#FF98A2]">MASTER BED</span>
                <span>6'6" × 6'0"</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">WARDROBE SWING: 100% CLEAR</span>
            </div>
          </div>

          {/* LAYER 5: FINISHED PHOTOREALISTIC 1:1 LIVING REALITY (STAGE 3) */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[8px] transition-opacity duration-200"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(120px)",
              opacity: realityReveal,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
              alt="1:1 Living Reality Walkthrough"
              className="w-full h-full object-cover filter contrast-110 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 border-2 border-[#FF98A2] rounded-[8px] shadow-[0_0_40px_rgba(255,152,162,0.4)]" />

            <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-[#FF98A2] text-xs font-mono text-[#FF98A2] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1:1 LIVING SCALE IMMERSION COMPLETE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          CHOREOGRAPHED EDITORIAL OVERLAYS (STAGES 1, 2, 3)
      ------------------------------------------------------------------- */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8 pointer-events-none">
        <div className="max-w-[1440px] w-full mx-auto">
          {/* STAGE 1: 0% to 33% */}
          {activeStage === 1 && (
            <div className="max-w-xl space-y-4 p-6 sm:p-8 rounded-[8px] bg-[#0A0A0A]/90 border border-[#374151] backdrop-blur-md pointer-events-auto transition-all duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#374151] border border-[#374151] text-[11px] font-mono uppercase tracking-widest text-[#EFEEF0]">
                <Ruler className="w-3.5 h-3.5 text-[#FF98A2]" />
                <span>Stage 01 • Macro 2D Laser Grid</span>
              </div>

              <h1
                data-motion-text="lines"
                className="font-bold tracking-tight text-[#EFEEF0] leading-[1.08]"
                style={{ fontSize: "clamp(2rem, 3.5vw, 53px)" }}
              >
                <span className="motion-line-mask block overflow-hidden">
                  <span className="motion-line inline-block">Precision 2D Vectors Morph to</span>
                </span>
                <span className="motion-line-mask block overflow-hidden">
                  <span className="motion-line inline-block text-[#FF98A2]">1:1 Scale</span>
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#EFEEF0]/80 font-normal leading-relaxed">
                Laser-calibrated architectural lines draw across a dark void. Exact dimensional markers define rooms and circulation paths before physical geometry lifts.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#FF98A2]">
                <span>↓ Scroll down to zoom in &amp; extrude 3D spatial walls</span>
              </div>
            </div>
          )}

          {/* STAGE 2: 33% to 66% */}
          {activeStage === 2 && (
            <div className="max-w-xl space-y-4 p-6 sm:p-8 rounded-[8px] bg-[#0A0A0A]/90 border border-[#374151] backdrop-blur-md pointer-events-auto transition-all duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#374151] border border-[#374151] text-[11px] font-mono uppercase tracking-widest text-[#EFEEF0]">
                <Move className="w-3.5 h-3.5 text-[#FF98A2]" />
                <span>Stage 02 • Spatial Scale &amp; Furniture</span>
              </div>

              <h2
                className="font-bold tracking-tight text-[#EFEEF0] leading-[1.08]"
                style={{ fontSize: "clamp(2rem, 3.5vw, 53px)" }}
              >
                Test Clearances Before{" "}
                <span className="text-[#FF98A2]">Concrete Is Poured</span>
              </h2>

              <p className="text-sm sm:text-base text-[#EFEEF0]/80 font-normal leading-relaxed">
                Roll modular beds, dining tables, and kitchen islands directly onto projected boundary lines. Verify door swings and corridor widths with zero civil demolition risk.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#FF98A2]">
                <span>↓ Scroll further to dive into the eye-level living reality</span>
              </div>
            </div>
          )}

          {/* STAGE 3: 66% to 100% */}
          {activeStage === 3 && (
            <div className="text-center max-w-4xl mx-auto space-y-6 pointer-events-auto p-8 sm:p-12 rounded-[8px] bg-[#000000]/95 border border-[#374151] backdrop-blur-xl transition-all duration-300">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#374151] border border-[#374151] text-xs font-mono tracking-widest uppercase text-[#EFEEF0]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF98A2]" />
                <span>Where Vision Meets Living Scale</span>
              </div>

              <h1
                className="font-black tracking-tight text-[#EFEEF0] leading-[1.05]"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 69px)",
                }}
              >
                DON'T JUST IMAGINE IT.
                <br />
                <span className="text-[#FF98A2]">WALK IT.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#EFEEF0]/80 max-w-2xl mx-auto leading-relaxed font-normal">
                Step inside your future architectural layouts at actual 1:1 scale before construction begins across Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.
              </p>

              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onBookClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-mono text-sm uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-2xl hover:-translate-y-0.5"
                  style={{
                    backgroundColor: NOIR_TOKENS.colors.primary,
                    color: NOIR_TOKENS.colors.neutral,
                    borderRadius: NOIR_TOKENS.rounded.lg,
                    padding: "24px 33px",
                    height: "64px",
                    minWidth: "min(100%, 453px)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = NOIR_TOKENS.colors.primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = NOIR_TOKENS.colors.primary)
                  }
                >
                  <span>Book Studio Walkthrough</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  type="button"
                  onClick={onExploreClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-mono text-base uppercase tracking-wider transition-all duration-200 cursor-pointer hover:border-[#FF98A2] hover:bg-white/5"
                  style={{
                    backgroundColor: "transparent",
                    color: NOIR_TOKENS.colors.onSurface,
                    borderRadius: NOIR_TOKENS.rounded.sm,
                    border: `1px solid ${NOIR_TOKENS.colors.tertiary}`,
                    padding: "24px 33px",
                    height: "64px",
                    minWidth: "min(100%, 453px)",
                  }}
                >
                  <Eye className="w-4 h-4 text-[#FF98A2]" />
                  <span>Explore 1:1 Technology</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------
          BOTTOM SCRUB TIMELINE
      ------------------------------------------------------------------- */}
      <div className="absolute bottom-6 left-5 right-5 sm:left-10 sm:right-10 z-30 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center gap-4 bg-[#0A0A0A]/90 backdrop-blur-md px-5 py-2.5 rounded-[4px] border border-[#374151]">
          <span className="text-[11px] font-mono text-[#EFEEF0]/70 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF98A2]" />
            <span>3D Zoom Track</span>
          </span>
          <div className="flex-1 h-1 bg-[#374151] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF98A2] transition-all duration-75"
              style={{ width: `${percentDisplay}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-[#FF98A2] font-semibold">
            {percentDisplay}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default Noir3DHero;