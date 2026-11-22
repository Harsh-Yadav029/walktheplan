"use client";

import { useState } from "react";
import { ArrowUpRight, Clock, MapPin, Phone, Sparkles } from "lucide-react";
import { STUDIO_LOCATIONS, buildWhatsAppUrl } from "../lib/bookingLogic";
import { WorldMap } from "./ui/world-map";

interface StudioLocatorSectionProps {
  onBookStudio: (studioId: string) => void;
}

export function StudioLocatorSection({ onBookStudio }: StudioLocatorSectionProps) {
  const [activeStudioId, setActiveStudioId] = useState<string>(STUDIO_LOCATIONS[0].id);
  const activeStudio =
    STUDIO_LOCATIONS.find((s) => s.id === activeStudioId) ?? STUDIO_LOCATIONS[0];

  // Dots connecting the National Headquarters in Gurugram to all 4 regional studios
  const networkDots = [
    {
      start: { lat: 28.4595, lng: 77.0266, label: "Gurugram" },
      end: { lat: 30.3165, lng: 78.0322, label: "Dehradun" },
    },
    {
      start: { lat: 28.4595, lng: 77.0266, label: "Gurugram" },
      end: { lat: 25.3176, lng: 82.9739, label: "Varanasi" },
    },
    {
      start: { lat: 28.4595, lng: 77.0266, label: "Gurugram" },
      end: { lat: 17.385, lng: 78.4867, label: "Hyderabad" },
    },
    {
      start: { lat: 17.385, lng: 78.4867, label: "Hyderabad" },
      end: { lat: 9.9252, lng: 78.1198, label: "Madurai" },
    },
  ];

  return (
    <section
      id="studios"
      className="relative w-full py-10 md:py-14 bg-[#141516] text-[#F2EDE5] border-b border-white/10 overflow-hidden select-none"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A]">
              <Sparkles className="w-3.5 h-3.5 text-[#C47B52]" />
              <span>Pan-India Experience Centers</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]">
              Five Spatial Studios Across India
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#A5A7A4] max-w-md font-light leading-relaxed">
            Select a city to view studio specifications, verified street address, operating
            hours, and direct appointment scheduling.
          </p>
        </div>

        {/* City Selection Tabs */}
        <div
          role="tablist"
          aria-label="Select Walk The Plan India studio city"
          className="flex flex-wrap gap-2.5 mb-10"
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
                className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-[#C47B52] text-white border-[#C47B52] font-semibold shadow-lg shadow-[#C47B52]/20"
                    : "bg-[#181A1B] text-[#A5A7A4] border-white/10 hover:border-white/25 hover:text-white"
                }`}
              >
                {studio.city} {studio.id === "gurugram" && "(HQ)"}
              </button>
            );
          })}
        </div>

        {/* Interactive Map + Active Studio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: India-Zoomed Dotted Map Box */}
          <div className="lg:col-span-5 flex">
            <div className="w-full bg-[#181A1B] rounded-2xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-[#A5A7A4] border-b border-white/10 pb-4">
                <span className="uppercase tracking-wider text-[#E5E0D8]">India Studio Network</span>
                <span className="text-[#EED77A] font-semibold">5 Active Locations</span>
              </div>

              {/* India-Only Dotted Vector Map */}
              <div className="relative my-4 flex flex-col items-center justify-center flex-1">
                <div className="w-full max-w-[340px] sm:max-w-[400px] mx-auto p-2">
                  <WorldMap
                    dots={networkDots}
                    countries={["IND"]}
                    lineColor="#C47B52"
                    activeLocationLabel={activeStudio.city}
                    onSelectCity={(cityName) => {
                      const match = STUDIO_LOCATIONS.find(
                        (s) => s.city.toLowerCase() === cityName.toLowerCase()
                      );
                      if (match) setActiveStudioId(match.id);
                    }}
                    className="w-full bg-transparent border-0 rounded-xl"
                  />
                </div>

                {/* Quick City Pin Badges below map */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  {STUDIO_LOCATIONS.map((s) => {
                    const isSelected = s.id === activeStudioId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveStudioId(s.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#C47B52]/20 text-[#EED77A] border border-[#C47B52]/50 font-bold"
                            : "bg-white/5 text-[#A5A7A4] border border-transparent hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? "bg-[#EED77A] animate-pulse" : "bg-[#A5A7A4]"
                          }`}
                        />
                        <span>{s.city}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs font-mono text-[#A5A7A4] text-center pt-3 border-t border-white/10">
                Click any city pin on the map or tab above to inspect studio details.
              </p>
            </div>
          </div>

          {/* Right Column: Active Studio Verified Details Card */}
          <div className="lg:col-span-7 flex">
            <div className="w-full bg-[#181A1B] rounded-2xl border border-white/10 p-6 md:p-10 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <p className="text-xs uppercase font-mono tracking-widest text-[#C47B52] font-medium">
                      {activeStudio.label}
                    </p>
                    <h3 className="mt-1 font-serif text-3xl md:text-4xl font-bold text-white">
                      {activeStudio.city} Studio
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#EED77A] bg-[#C47B52]/15 border border-[#C47B52]/30 px-3 py-1.5 rounded-lg">
                    Up to {activeStudio.baySizeSqFt.toLocaleString("en-IN")} sq.ft. Bay
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-sm text-[#F2EDE5]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#C47B52] shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[#A5A7A4]">{activeStudio.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#C47B52] shrink-0" />
                    <p className="text-[#A5A7A4]">{activeStudio.hours}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C47B52] shrink-0" />
                    <a
                      href={`tel:${activeStudio.phone.replace(/\s+/g, "")}`}
                      className="text-[#EED77A] hover:underline font-mono"
                    >
                      {activeStudio.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-xs uppercase font-mono tracking-wider text-[#A5A7A4] mb-3">
                    Studio Capabilities
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#F2EDE5]">
                    {activeStudio.highlights.map((h) => (
                      <div
                        key={h}
                        className="bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl font-mono text-[11px] text-center"
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-white/10 mt-8">
                <button
                  type="button"
                  onClick={() => onBookStudio(activeStudio.id)}
                  className="bg-[#C47B52] hover:bg-[#A85E43] text-white px-7 py-3.5 text-xs font-mono uppercase tracking-wider transition-colors rounded-xl font-semibold shadow-lg shadow-[#C47B52]/20 cursor-pointer whitespace-nowrap shrink-0"
                >
                  Book {activeStudio.city} Studio
                </button>

                <a
                  href={buildWhatsAppUrl(
                    "919711022075",
                    `Hello Walk The Plan, I would like to schedule a walkthrough at the ${activeStudio.city} studio.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 px-5 py-3.5 text-xs font-mono uppercase tracking-wider text-white transition-colors rounded-xl whitespace-nowrap shrink-0"
                >
                  <span>WhatsApp Coordinator</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudioLocatorSection;
