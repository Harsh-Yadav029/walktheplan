"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowUp, Calendar, MessageCircle, Sparkles } from "lucide-react";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  /* Theme tokens & Fallbacks */
  --foreground: #F5F2EB;
  --background: #181A1B;
  --primary: #C47B52;
  --secondary: #E8E3D9;
  --muted-foreground: #A5A7A4;
  --destructive: #EF4444;

  /* Dynamic Variables using standard shadcn / tailwind tokens */
  --pill-bg-1: color-mix(in oklch, var(--foreground, #F5F2EB) 4%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground, #F5F2EB) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background, #181A1B) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground, #F5F2EB) 12%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background, #181A1B) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground, #F5F2EB) 10%, transparent);
  
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground, #F5F2EB) 10%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground, #F5F2EB) 3%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground, #F5F2EB) 28%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background, #181A1B) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground, #F5F2EB) 25%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
  100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--destructive, #EF4444) 50%, transparent)); }
  15%, 45% { transform: scale(1.22); filter: drop-shadow(0 0 12px color-mix(in oklch, var(--destructive, #EF4444) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in oklch, var(--foreground, #F5F2EB) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground, #F5F2EB) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    color-mix(in oklch, var(--primary, #C47B52) 18%, transparent) 0%, 
    color-mix(in oklch, var(--secondary, #E8E3D9) 12%, transparent) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground, #F5F2EB);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: clamp(4rem, 16vw, 15rem);
  line-height: 0.8;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground, #F5F2EB) 8%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground, #F5F2EB) 12%, transparent) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground, #F5F2EB) 0%, color-mix(in oklch, var(--foreground, #F5F2EB) 45%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 24px color-mix(in oklch, var(--primary, #C47B52) 22%, transparent));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.35,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.35)",
            duration: 1.1,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT (THEME & PROPS CONFIGURABLE)
// -------------------------------------------------------------------------
export interface CinematicFooterProps {
  giantText?: string;
  heading?: string;
  marqueeItems?: string[];
  primaryActionText?: string;
  primaryActionHref?: string;
  onPrimaryClick?: () => void;
  secondaryActionText?: string;
  secondaryActionHref?: string;
  onSecondaryClick?: () => void;
  brandName?: string;
  className?: string;
}

const DEFAULT_MARQUEE = [
  "1:1 Scale True Floor Plan Projection",
  "Zero Post-Excavation Reconstruction Costs",
  "Millimeter Precision Laser Calibration",
  "Real Rolling Modular Furniture Props",
  "Live CAD Line Adjustments In-Studio",
  "5 Active Studios Across India",
  "Gurugram • Dehradun • Varanasi • Hyderabad • Madurai",
];

const MarqueeList = ({ items }: { items: string[] }) => (
  <div className="flex items-center space-x-8 md:space-x-12 px-6">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <span>{item}</span>
        <span className="text-[#C47B52] opacity-80">✦</span>
      </React.Fragment>
    ))}
  </div>
);

export function CinematicFooter({
  giantText = "WALK THE PLAN",
  heading = "Ready to walk your future home?",
  marqueeItems = DEFAULT_MARQUEE,
  primaryActionText = "Book a 1:1 Studio Session",
  primaryActionHref = "#book",
  onPrimaryClick,
  secondaryActionText = "WhatsApp (+91 97110 22075)",
  secondaryActionHref = "https://wa.me/919711022075?text=Hello%20Walk%20The%20Plan%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%201%3A1%20scale%20walkthrough.",
  onSecondaryClick,
  brandName = "Walk The Plan",
  className,
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "8vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal - smooth and reliable across different page heights
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 30, opacity: 0.25 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );
    }, wrapperRef);

    // Refresh ScrollTrigger calculations on route or viewport changes
    const onRouteRefresh = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener("popstate", onRouteRefresh);
    window.addEventListener("resize", onRouteRefresh);

    return () => {
      window.removeEventListener("popstate", onRouteRefresh);
      window.removeEventListener("resize", onRouteRefresh);
      ctx.revert();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSmoothAnchor = (e: React.MouseEvent<HTMLElement>, href?: string) => {
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return;
    }
    e.preventDefault();

    if (href.startsWith("/")) {
      window.history.pushState(null, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        // We are on a subpage and need to navigate to the homepage anchor
        window.history.pushState(null, "", "/" + href);
        window.dispatchEvent(new PopStateEvent("popstate"));
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box.
      */}
      <div
        ref={wrapperRef}
        className={cn("relative min-h-[90vh] md:min-h-screen w-full bg-[#181A1B]", className)}
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex min-h-[90vh] md:min-h-screen w-full flex-col justify-between overflow-hidden bg-[#181A1B] text-[#F5F2EB] cinematic-footer-wrapper">
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[90px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[2vh] md:-bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none text-center"
          >
            {giantText}
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div className="absolute top-8 md:top-12 left-0 w-full overflow-hidden border-y border-white/10 bg-[#181A1B]/75 backdrop-blur-md py-3 md:py-4 z-10 -rotate-1 md:-rotate-2 scale-105 md:scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-[11px] md:text-xs font-semibold tracking-[0.25em] text-[#A5A7A4] uppercase">
              <MarqueeList items={marqueeItems} />
              <MarqueeList items={marqueeItems} />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 md:mt-16 w-full max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C47B52]/30 bg-[#C47B52]/10 text-[#C47B52] text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              1:1 Scale True Architectural Blueprint Projection
            </div>

            <h2
              ref={headingRef}
              className="text-4xl md:text-7xl lg:text-8xl font-black footer-text-glow tracking-tighter mb-8 md:mb-12 max-w-4xl"
            >
              {heading}
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary Call to Actions */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as="a"
                  href={primaryActionHref}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    if (onPrimaryClick) {
                      e.preventDefault();
                      onPrimaryClick();
                    } else {
                      handleSmoothAnchor(e, primaryActionHref);
                    }
                  }}
                  className="footer-glass-pill px-8 md:px-10 py-4 md:py-5 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-3 group border-[#C47B52]/40 bg-[#C47B52]/15 hover:bg-[#C47B52]/25 shadow-[0_0_30px_-5px_rgba(196,123,82,0.4)]"
                >
                  <Calendar className="w-5 h-5 text-[#C47B52] group-hover:scale-110 transition-transform" />
                  {primaryActionText}
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={secondaryActionHref}
                  target={secondaryActionHref.startsWith("http") ? "_blank" : undefined}
                  rel={secondaryActionHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    if (onSecondaryClick) {
                      e.preventDefault();
                      onSecondaryClick();
                    }
                  }}
                  className="footer-glass-pill px-8 md:px-10 py-4 md:py-5 rounded-full text-[#F5F2EB] font-bold text-sm md:text-base flex items-center gap-3 group hover:border-[#25D366]/40"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                  {secondaryActionText}
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 pt-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-[#A5A7A4] text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1 text-center md:text-left">
              © 2026 {brandName}. All rights reserved. • Building 328, Sec 19, Udyog Vihar Ph-4, Gurugram
            </div>

            {/* "Made with Love" Badge */}
            <div className="footer-glass-pill px-6 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/10">
              <span className="text-[#A5A7A4] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                Crafted with
              </span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-red-500">❤</span>
              <span className="text-[#A5A7A4] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                by
              </span>
              <span className="text-white font-black text-xs md:text-sm tracking-normal ml-1">
                {brandName}
              </span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="w-11 h-11 md:w-12 md:h-12 rounded-full footer-glass-pill flex items-center justify-center text-[#A5A7A4] hover:text-white group order-3 border-white/15"
            >
              <ArrowUp className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
