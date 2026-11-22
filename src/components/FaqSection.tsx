"use client";

import { FaqAccordion, type FaqItem } from "./ui/faq-accordion";

// Exhaustive Walk The Plan 1:1 Architectural Studio Questions & Answers
const WTP_FAQ_ITEMS: FaqItem[] = [
  {
    id: "wtp-1",
    question: "What is Walk The Plan and how does 1:1 blueprint projection work?",
    answer:
      "Walk The Plan is India's premier full-scale 1:1 architectural blueprint projection studio. We project real 2D architectural CAD (.dwg/.dxf) floor plans onto large physical studio floors at 100% life-size scale using sub-millimeter calibrated laser projectors. Homeowners, architects, and builders physically walk through their future rooms, test door swings, and move real modular mock furniture before excavation or construction begins.",
  },
  {
    id: "wtp-2",
    question: "How does 1:1 blueprint projection compare to 3D computer renders and VR?",
    answer:
      "3D computer renders use wide-angle distortion lenses that make rooms appear up to 30% larger than reality, while VR headsets lack tactile physical movement, cause disequilibrium, and isolate family members. Walk The Plan delivers 100% physical scale where families, architects, and contractors walk together physically, touch real furniture, and verify true hallway clearances with zero distortion.",
  },
  {
    id: "wtp-3",
    question: "What file formats are required to book a studio walkthrough session?",
    answer:
      "We accept standard 2D architectural drawings: AutoCAD files (.dwg, .dxf), high-resolution vector architectural PDFs, and Revit 2D exports. Our technical engineering team extracts wall vectors, cleans non-spatial layers, sets precision scale markers, and calibrates multi-projector laser blending within 48 to 72 hours prior to your scheduled session.",
  },
  {
    id: "wtp-4",
    question: "Can I bring my principal architect, interior designer, and family?",
    answer:
      "Yes! Over 70% of our studio sessions host homeowners, their principal architects, and interior designers simultaneously. This creates 'Triple Consensus'—ensuring design aesthetics, family lifestyle expectations, and structural feasibility are fully aligned with zero ambiguity before construction.",
  },
  {
    id: "wtp-5",
    question: "Can we physically move real furniture during the projection session?",
    answer:
      "Every studio is equipped with real-dimension modular furniture props mounted on smooth rolling wheels: Master beds (King and Queen sizes with side tables), 6-seater and 8-seater dining tables, living room modular sofas, and movable kitchen counter islands. You can roll them into projected spaces to verify real ergonomic flow and passage widths.",
  },
  {
    id: "wtp-6",
    question: "Can live CAD changes and layout tweaks be made during the session?",
    answer:
      "Yes. Each studio features an on-site spatial consultant and active CAD workstation. If you discover that a bathroom door collides with a vanity counter or a bedroom hallway is too tight, our technician amends the vector lines in real time and re-projects the corrected layout in seconds.",
  },
  {
    id: "wtp-7",
    question: "What is the typical Return on Investment (ROI) and cost savings?",
    answer:
      "The average luxury home build in India costs between ₹1.5 Crore to ₹8+ Crores. Layout flaws discovered after pouring concrete typically cost ₹3.5 Lakh to ₹15+ Lakh in demolition, rework labor, and material waste. Catching these errors on paper during a Walk The Plan session costs a tiny fraction of that amount, delivering an average 10x to 25x financial ROI.",
  },
  {
    id: "wtp-8",
    question: "What are the service packages, transparent pricing, and booking process?",
    answer:
      "We offer three transparent tiers: (1) 1-Hour Test Drive (₹30,000) for 2BHK/3BHK apartments; (2) 2-Hour Deep Dive (₹40,000) for villas, duplexes, and multi-floor layouts with live CAD tweaks; and (3) 3-5 Hour Master Workshop (₹50,000) for architects and developers. Slots can be reserved with an advance token deposit of ₹5,000 online or via WhatsApp (+91 97110 22075).",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="w-full bg-[#181A1B] text-[#F5F2EB] py-24 md:py-32 px-4 sm:px-6 relative z-10 border-t border-white/5"
    >
      {/* Background copper aurora glow matching the footer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#C47B52]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Centered Heading matching screenshot */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F5F2EB] text-center tracking-tight leading-[1.12] mb-12 md:mb-16 font-sans">
          Frequently Asked
          <br />
          Questions
        </h2>

        {/* Pure Walk The Plan Accordion Component */}
        <FaqAccordion items={WTP_FAQ_ITEMS} allowMultiple={false} />
      </div>
    </section>
  );
}
