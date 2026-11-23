"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export interface AccordionItem {
  id: string;
  url: string;
  title: string;
  description: string;
  credentials?: string;
  tags: string[];
  quote?: string;
  keyQuote?: string;
  bio?: string[];
  badge?: string;
  objectPosition?: string;
}

export const LEADERSHIP_ITEMS: AccordionItem[] = [
  {
    id: "himanshu-makkar",
    url: "/images/studio/himanshu_makkar.png",
    title: "Himanshu Makkar",
    description: "Director",
    credentials: "Civil Execution • 8+ Years Experience",
    tags: ["Civil Execution", "Site Rigor", "Zero Demolition", "Director", "Plan Freeze"],
    quote:
      "Making every construction journey clearer before the first brick is laid.",
    keyQuote:
      "Every successful project is built twice—first through thoughtful planning, and then through flawless execution.",
    badge: "Execution Rigor",
    objectPosition: "center top",
    bio: [
      "Great construction is never defined by beautiful drawings alone. It is defined by what actually gets built on-site. Coming from a family deeply rooted in the construction industry and backed by over 8 years of hands-on experience in construction execution, I have spent my career where projects truly come to life—on construction sites.",
      "Many homeowners approved designs without fully understanding how their spaces would actually look and function after construction. Somewhere between design and execution, expectations often changed.",
      "This resulted in unnecessary revisions, additional costs, project delays, material wastage, and avoidable stress. Giving homeowners the opportunity to experience their future spaces before construction begins creates something invaluable: confidence.",
    ],
  },
  {
    id: "parth-khanna",
    url: "/images/studio/parth_khanna.png",
    title: "Parth Khanna",
    description: "Founder & Director",
    credentials: "B.Arch • 8+ Years Experience",
    tags: ["B.Arch", "Scale Perception", "Founder", "Innovation", "8+ Yrs Exp"],
    quote:
      "Making it possible to walk through your future home before construction begins.",
    keyQuote:
      "The best construction decisions are made before construction begins.",
    badge: "Architectural Visionary",
    objectPosition: "center top",
    bio: [
      "Every meaningful innovation begins with an observation. As a Bachelor of Architecture with over 8 years of professional experience across residential homes, luxury villas, commercial developments, and a wide range of architectural projects, I wasn't just designing buildings—I was understanding people.",
      "Architects could visualize the design. Clients often couldn't. Despite detailed floor plans, elevations, and 3D renders, homeowners still struggled to truly understand how their future home would feel once it was built.",
      "Walk The Plan has earned the trust of homeowners, architects, builders, and industry leaders. Renowned professionals, including Sumit Dhawan and Ridhi Khosla, have experienced our platform firsthand, reinforcing that immersive planning is the future of construction.",
    ],
  },
  {
    id: "sanya-khanna",
    url: "/images/studio/sanya_khanna.jpg",
    title: "Sanya Chawla Khanna",
    description: "Director & Co-Founder, Studio Symmetry",
    credentials: "Architect • Strategic Backbone of Walk The Plan",
    tags: ["Architect", "Interior Design", "Studio Symmetry", "Strategic Backbone", "Empathy"],
    quote:
      "Every great home begins with a vision, and every vision deserves to be experienced before it is built.",
    keyQuote: "Never stop dreaming. Never stop building.",
    badge: "Design Strategy",
    objectPosition: "center top",
    bio: [
      "Sanya Khanna is a highly accomplished Architect, Interior Design Consultant, and Design Strategist with over 8 years of professional experience. After completing her Bachelor of Architecture (B.Arch.), she co-founded Studio Symmetry, successfully leading residential, commercial, and interior architecture.",
      "One experience that continues to inspire her involved a young child joyfully exploring every room of his future home during a walkthrough, while his grandfather—who had waited decades to build his dream house—experienced the overwhelming happiness of seeing that dream come to life before construction had even begun.",
      "Driven by innovation, creativity, and a deep commitment to improving the home-building journey, Sanya continues to contribute towards making Walk The Plan a benchmark for excellence in the architecture and construction industry.",
    ],
  },
];

export interface TailwindImageAccordionProps {
  items?: AccordionItem[];
  activeId?: string;
  onSelect?: (item: AccordionItem) => void;
  className?: string;
}

export function TailwindImageAccordion({
  items = LEADERSHIP_ITEMS,
  activeId = "parth-khanna",
  onSelect,
  className = "",
}: TailwindImageAccordionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={`w-full ${className}`}>
      <div className="group flex max-md:flex-col justify-center gap-3 md:gap-4 w-full mx-auto my-4">
        {items.map((item) => {
          const isSelected = activeId === item.id;

          return (
            <article
              key={item.id}
              tabIndex={0}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect?.(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(item);
                }
              }}
              className={`group/article relative w-full rounded-2xl overflow-hidden cursor-pointer border transition-all duration-500 ease-[cubic-bezier(.5,.85,.25,1.15)] 
                ${isSelected ? "border-[#C47B52] shadow-[0_15px_35px_-10px_rgba(196,123,82,0.35)]" : "border-white/10 hover:border-white/25"}
                md:not-[&:hover]:group-hover:w-[20%] 
                md:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[20%] 
                before:absolute before:inset-x-0 before:bottom-0 before:h-2/3 before:bg-gradient-to-t before:from-black/95 before:via-black/55 before:to-transparent before:transition-opacity 
                md:before:opacity-75 md:hover:before:opacity-95 focus-within:before:opacity-95 
                after:opacity-0 md:not-[&:hover]:group-hover:after:opacity-100 md:[&:not(:focus-within):not(:hover)]:group-focus-within:after:opacity-100 
                after:absolute after:inset-0 after:bg-black/35 after:backdrop-blur-[1px] after:transition-all 
                focus-within:ring-2 focus-within:ring-[#C47B52] outline-none select-none`}
            >
              {/* Content Overlay */}
              <div className="absolute inset-0 text-white z-10 p-5 sm:p-6 flex flex-col justify-between pointer-events-none">
                {/* Top Badge & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {item.badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider text-[#EED77A]">
                      <Sparkles className="w-3 h-3 text-[#C47B52]" />
                      <span>{item.badge}</span>
                    </span>
                  )}
                  {isSelected && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C47B52] text-[10px] font-mono text-white font-bold tracking-wider">
                      ACTIVE STORY
                    </span>
                  )}
                </div>

                {/* Bottom Details */}
                <div className="space-y-2">
                  {/* Credentials / Subtitle */}
                  {item.credentials && (
                    <p className="text-xs font-mono text-[#C47B52] tracking-wider uppercase transition duration-300 md:opacity-80 group-hover/article:opacity-100 group-focus-within/article:opacity-100">
                      {item.credentials}
                    </p>
                  )}

                  {/* Title / Name */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight md:whitespace-nowrap md:truncate md:opacity-90 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-1 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)]">
                    {item.title}
                  </h3>

                  {/* Description / Role */}
                  <p className="font-sans text-sm text-[#F2EDE5]/90 md:whitespace-nowrap md:truncate md:opacity-75 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-1 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-150 group-focus-within/article:delay-150">
                    {item.description}
                  </p>

                  {/* Tags Pill Bar (visible on expansion) */}
                  <div className="pt-2 flex flex-wrap gap-1.5 md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 transition-opacity duration-300 group-hover/article:delay-300 group-focus-within/article:delay-300">
                    {item.tags.slice(0, 4).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-[10px] font-mono text-[#A5A7A4]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* The Leader Portrait Image - Anchored to top to show face without over-zooming */}
              <Image
                className="object-cover object-top h-96 sm:h-[480px] md:h-[540px] w-full transition-all duration-500 ease-out"
                style={{ objectPosition: item.objectPosition || "center top" }}
                src={item.url}
                width="960"
                height="640"
                alt={item.title}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default TailwindImageAccordion;
