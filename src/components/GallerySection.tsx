"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { LayoutGrid, type Card } from "./ui/layout-grid";
import { GALLERY_ITEMS, type GalleryItem } from "../data/siteContent";

type GalleryFilter = "All" | GalleryItem["category"];

const FILTERS: GalleryFilter[] = [
  "All",
  "1:1 Projection Studio",
  "VR Walkthroughs",
  "3D Visualization",
];

export function GallerySection() {
  const [filter, setFilter] = useState<GalleryFilter>("All");

  const visibleItems =
    filter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter);

  const cards: Card[] = visibleItems.map((item, idx) => ({
    id: idx + 1,
    title: item.title,
    category: item.category,
    location: item.location,
    thumbnail: item.image,
    className:
      idx === 0
        ? "md:col-span-2"
        : idx === 1
        ? "col-span-1"
        : idx === 2
        ? "col-span-1"
        : idx === 3
        ? "md:col-span-2"
        : "col-span-1 md:col-span-3",
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#EED77A] uppercase tracking-widest">
          <span>{item.category}</span>
          <span>•</span>
          <span>{item.location}</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
          {item.title}
        </h3>
        <p className="text-sm sm:text-base text-[#F2EDE5]/90 font-light leading-relaxed max-w-xl">
          {item.caption}
        </p>
        <div className="pt-2 flex items-center gap-4">
          <a
            href="#book"
            className="inline-flex items-center gap-2 bg-[#C47B52] hover:bg-[#A85E43] text-white px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            <span>Book Studio Walkthrough</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    ),
  }));

  return (
    <section
      id="gallery"
      className="relative w-full py-10 md:py-14 bg-[#141516] text-[#F2EDE5] border-b border-white/10 overflow-hidden select-none"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A]">
              <Sparkles className="w-3.5 h-3.5 text-[#C47B52]" />
              <span>Studio &amp; Spatial Gallery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]">
              Inside Walk The Plan Studios
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div
            role="tablist"
            aria-label="Filter gallery by studio discipline"
            className="flex flex-wrap gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 self-start lg:self-auto backdrop-blur-sm"
          >
            {FILTERS.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-[#C47B52] text-white shadow-md font-semibold"
                      : "text-[#A5A7A4] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Animated Expanding LayoutGrid */}
        <LayoutGrid cards={cards} />
      </div>
    </section>
  );
}

export default GallerySection;
