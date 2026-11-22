"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ElasticItemProps {
  id: string;
  title: string;
  category: string;
  src: string;
  alt: string;
  videoSrc?: string;
  description?: string;
}

interface ElasticGalleryProps {
  items?: ElasticItemProps[];
  onItemSelect?: (item: ElasticItemProps) => void;
}

const DEFAULT_ITEMS: ElasticItemProps[] = [
  {
    id: "01",
    title: "1:1 Laser Projection",
    category: "Floor Projection",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alt: "Laser blueprint projection on studio floor",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Living room and kitchen scale review projected at actual human scale.",
  },
  {
    id: "02",
    title: "Urban Penthouse CAD",
    category: "Architecture",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern duplex architectural blueprint",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Door swings, corridor clearances, and wall partition adjustments tested live.",
  },
  {
    id: "03",
    title: "Real-Scale Furniture",
    category: "Modular Props",
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    alt: "Full-scale modular rolling furniture placed on floor plan",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Dining table, sofa arrangement, and kitchen work-triangle spatial verification.",
  },
  {
    id: "04",
    title: "Volumetric VR Tour",
    category: "Virtual Reality",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    alt: "Untethered VR bare-shell exploration",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Eye-level 3D bare-shell exploration checking beam heights and window sightlines.",
  },
  {
    id: "05",
    title: "Villa Estate Footprint",
    category: "Pre-Construction",
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    alt: "Luxury estate floor plan visualization",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Architect and developer multi-unit consensus walk before foundation excavation.",
  },
];

function ElasticGallery({ items = DEFAULT_ITEMS, onItemSelect }: ElasticGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>("03");

  const handleCardClick = (item: ElasticItemProps) => {
    setActiveId(item.id);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  return (
    <div className="w-full py-8 md:py-16">
      {/* Container: Fixed height on mobile/desktop to ensure animation stability */}
      <div className="mx-auto flex h-[480px] w-full max-w-6xl flex-col gap-2 px-4 md:h-[580px] md:flex-row md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => handleCardClick(item)} // Touch & Click support
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#1E2021]",
              // Layout & Flex Transition
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              // Flex Logic:
              // If active, take up 4 parts of space. If inactive, take 1 part.
              // This creates the "accordion" effect relative to siblings.
              activeId === item.id ? "flex-[4]" : "flex-[1]",
              // Brightness logic for focus
              activeId === item.id
                ? "brightness-100 ring-1 ring-[#C47B52]/40 shadow-2xl"
                : "brightness-50 hover:brightness-75"
            )}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className={cn(
                  "object-cover transition-transform duration-1000",
                  // Subtle zoom on active
                  activeId === item.id ? "scale-100" : "scale-110"
                )}
              />
              {/* Gradient Overlay for Text Readability */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500",
                  activeId === item.id ? "opacity-100" : "opacity-40"
                )}
              />
            </div>

            {/* Video Play Badge Indicator (Space for Video Clips) */}
            {item.videoSrc && (
              <div
                className={cn(
                  "absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-mono text-[#EED77A] backdrop-blur-md transition-all duration-300",
                  activeId === item.id ? "opacity-100 scale-100" : "opacity-0 scale-75"
                )}
              >
                <Play className="h-3 w-3 fill-[#EED77A]" />
                <span>Video Reel</span>
              </div>
            )}

            {/* --- Content Container --- */}
            <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-4 md:p-8 z-10">
              {/* Active Content: Title & Button */}
              <div
                className={cn(
                  "flex flex-col gap-2 transition-all duration-500",
                  // Hide/Show based on active state with translation for smooth entry
                  activeId === item.id
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-12 opacity-0"
                )}
              >
                {/* Category Tag */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#C47B52]/40 bg-[#C47B52]/20 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#EED77A] backdrop-blur-md md:px-3 md:text-xs">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif font-medium leading-none text-white md:text-4xl">
                  {item.title}
                </h3>

                {/* Description if provided */}
                {item.description && (
                  <p className="text-xs text-[#A5A7A4] md:text-sm line-clamp-2 max-w-lg mt-1">
                    {item.description}
                  </p>
                )}

                {/* Call to Action */}
                <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#EED77A] md:mt-4 md:text-sm hover:underline">
                  <span>{item.videoSrc ? "Watch Studio Clip" : "Inspect Project"}</span>
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                </div>
              </div>

              {/* Inactive Content: Vertical Text (Desktop) / Short Label (Mobile) */}
              <div
                className={cn(
                  "absolute transition-all duration-500",
                  // Position logic
                  "bottom-4 left-1/2 -translate-x-1/2 md:bottom-8",
                  // Hide when active
                  activeId === item.id
                    ? "opacity-0 scale-50"
                    : "opacity-100 delay-500"
                )}
              >
                {/* Desktop: Vertical Text */}
                <span className="hidden whitespace-nowrap text-lg font-bold uppercase tracking-widest text-white/90 [writing-mode:vertical-rl] md:block font-serif">
                  {item.title}
                </span>

                {/* Mobile: Horizontal ID/Label */}
                <span className="block text-xs font-bold text-white md:hidden font-mono">
                  {item.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { ElasticGallery };
