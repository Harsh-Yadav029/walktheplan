"use client";

import { useMemo } from "react";
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from "./ui/animated-slideshow";
import { EDITORIAL_SERVICES } from "../data/siteContent";

interface ServicesSectionProps {
  onSelectService: (packageId: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const services = useMemo(() => EDITORIAL_SERVICES, []);

  return (
    <section
      id="services"
      className="relative w-full py-10 md:py-14 bg-[#141516] text-[#F2EDE5] border-b border-white/10 overflow-hidden select-none"
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        <HoverSlider className="w-full">
          {/* Eyebrow Label matching design */}
          <h3 className="mb-8 md:mb-12 text-[#C47B52] text-xs font-mono font-medium uppercase tracking-[0.2em]">
            / our services
          </h3>

          {/* Symmetrical Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Interactive Staggered Service Titles */}
            <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => onSelectService(service.packageId)}
                  className="cursor-pointer group inline-block w-fit"
                >
                  <TextStaggerHover
                    index={index}
                    text={service.title}
                    className="cursor-pointer text-3xl sm:text-5xl lg:text-6xl font-serif font-bold uppercase tracking-tight text-white hover:text-[#EED77A] transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Right: Curtain-Reveal Image Frame */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <HoverSliderImageWrap className="w-full max-w-lg aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl">
                {services.map((service, index) => (
                  <div key={service.id} className="size-full">
                    <HoverSliderImage
                      index={index}
                      imageUrl={service.image}
                      src={service.image}
                      alt={service.title}
                      className="size-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                ))}
              </HoverSliderImageWrap>
            </div>
          </div>
        </HoverSlider>
      </div>
    </section>
  );
}

export default ServicesSection;
