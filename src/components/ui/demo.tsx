"use client";

import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from "@/components/blocks/animated-slideshow";
import { LayoutGrid } from "@/components/ui/layout-grid";
import { HowItWorks } from "@/components/ui/how-it-works";
import { Pricing } from "@/components/blocks/pricing";
import CompareUILib, { type ComparisonData } from "@/components/ui/shadcn-studio-compare-07";
import { WorldMap } from "@/components/ui/world-map";
import TailwindImageAccordion from "@/components/ui/tailwind-image-accordion";
import { motion } from "framer-motion";

export function WorldMapDemo() {
  return (
    <div className="py-20 bg-[#141516] text-[#F2EDE5] w-full">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <p className="font-bold text-xl md:text-4xl text-white">
          Remote{" "}
          <span className="text-neutral-400">
            {"Connectivity".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-400 max-w-2xl mx-auto py-4">
          Break free from traditional boundaries. Pan-India studio projection network.
        </p>
      </div>
      <WorldMap
        lineColor="#C47B52"
        dots={[
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
        ]}
      />
    </div>
  );
}

const comparisonDemoData: ComparisonData = {
  column1Header: {
    icon: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=120&q=80",
    title: "Notion ai",
  },
  column2Header: {
    icon: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=120&q=80",
    title: "Jasper",
  },
  column3Header: "What this means for you",
  features: [
    {
      name: "Pricing",
      column1: "Included inside Notion workspace, affordable add-on",
      column2: "Subscription-based, higher pricing tiers",
      column3: "Choose based on your budget and team size",
    },
    {
      name: "Best for",
      column1: "Best for writers who want AI inside their workspace",
      column2: "Best for marketing teams & brand-heavy content",
      column3: "Pick the tool that matches your workflow and goals",
    },
  ],
};

export function CompareUILibDemo() {
  return (
    <div className="bg-[#141516] text-[#F2EDE5] min-h-screen py-16 px-4">
      <CompareUILib data={comparisonDemoData} />
    </div>
  );
}

/**
 * A demo component to showcase the HowItWorks section.
 */
export function HowItWorksDemo() {
  return (
    <div className="bg-[#141516] text-[#F2EDE5] min-h-screen">
      <HowItWorks />
    </div>
  );
}

const SKELETON_CARDS = [
  {
    id: 1,
    content: (
      <div>
        <p className="font-bold md:text-3xl text-xl text-white">
          1:1 Scale CAD Floor Projection
        </p>
        <p className="font-normal text-sm my-3 max-w-lg text-[#F2EDE5]/90">
          Overhead truss array projecting full-scale residential footprints onto the studio floor with laser calibration.
        </p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    content: (
      <div>
        <p className="font-bold md:text-3xl text-xl text-white">
          Movable Furniture Calibration
        </p>
        <p className="font-normal text-sm my-3 max-w-lg text-[#F2EDE5]/90">
          Place full-size modular sofas, beds, and dining islands directly onto your projected layout.
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    content: (
      <div>
        <p className="font-bold md:text-3xl text-xl text-white">
          Untethered Bare-Shell VR
        </p>
        <p className="font-normal text-sm my-3 max-w-lg text-[#F2EDE5]/90">
          Simultaneous headset walkthrough and monitor review for vertical height and daylight verification.
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    content: (
      <div>
        <p className="font-bold md:text-3xl text-xl text-white">
          3D Material & Lighting Studio
        </p>
        <p className="font-normal text-sm my-3 max-w-lg text-[#F2EDE5]/90">
          High-fidelity interior visualization pairing natural sunlight angles with verified spatial geometry.
        </p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  },
];

export function LayoutGridDemo() {
  return (
    <div className="min-h-screen py-20 w-full bg-[#141516] p-6">
      <LayoutGrid cards={SKELETON_CARDS} />
    </div>
  );
}

const SLIDES = [
  {
    id: "slide-1",
    title: "1:1 Floor Projection",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "slide-2",
    title: "VR Spatial Walkthrough",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "slide-3",
    title: "3D Visualisation",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "slide-4",
    title: "Design Validation",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  },
];

export function TailwindImageAccordionDemo() {
  return (
    <div className="w-full py-10 bg-[#141516]">
      <TailwindImageAccordion />
    </div>
  );
}

export function HoverSliderDemo() {
  return (
    <HoverSlider className="min-h-svh place-content-center p-6 md:px-12 bg-[#141516] text-[#F2EDE5]">
      <h3 className="mb-6 text-xs font-mono uppercase tracking-widest text-[#C47B52]">
        / our services
      </h3>
      <div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
        <div className="flex flex-col space-y-2 md:space-y-4">
          {SLIDES.map((slide, index) => (
            <TextStaggerHover
              key={slide.title}
              index={index}
              className="cursor-pointer text-4xl font-bold uppercase tracking-tighter"
              text={slide.title}
            />
          ))}
        </div>
        <HoverSliderImageWrap className="w-80 h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="w-full h-full">
              <HoverSliderImage
                index={index}
                imageUrl={slide.imageUrl}
                src={slide.imageUrl}
                alt={slide.title}
                className="size-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
        </HoverSliderImageWrap>
      </div>
    </HoverSlider>
  );
}

export default HowItWorksDemo;
