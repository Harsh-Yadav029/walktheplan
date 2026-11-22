"use client";

import { useMemo } from "react";
import { UploadCloud, Compass, Footprints, ShieldCheck } from "lucide-react";
import { HowItWorks, type StepItem } from "./ui/how-it-works";
import { BUSINESS_CONTACT } from "../lib/bookingLogic";

export function ProcessSection() {
  const steps: StepItem[] = useMemo(
    () => [
      {
        icon: <UploadCloud className="h-6 w-6 text-[#C47B52]" />,
        title: "Share Your Plan",
        description:
          "Submit your architectural floor plan in PDF, CAD, or DWG format 48–72 hours ahead of your appointment so our engineers can inspect scale calibration.",
        benefits: [
          "Direct upload of DWG, DXF, PDF, or Revit drawings",
          "Pre-calibration scale validation by studio architects",
          "Zero proprietary software required on your side",
        ],
      },
      {
        icon: <Compass className="h-6 w-6 text-[#C47B52]" />,
        title: "We Prepare The Studio",
        description:
          "Our spatial engineering team maps your exact vectors onto our studio floor and readies modular furniture mockups and synchronized 3D models.",
        benefits: [
          "Laser-calibrated 1:1 scale alignment on open bays",
          "Modular sofas, beds, and dining islands staged",
          "48–72 hour precision pre-calibration protocol",
        ],
      },
      {
        icon: <Footprints className="h-6 w-6 text-[#C47B52]" />,
        title: "Walk Your Space",
        description:
          "Visit your studio with your family, architect, or contractor to step inside every room, hallway, and balcony at actual 1:1 scale.",
        benefits: [
          "Step inside real spatial dimensions underfoot",
          "Test door swings, wardrobe clearances, and aisles",
          "Real-time CAD adjustments live on the projector floor",
        ],
      },
      {
        icon: <ShieldCheck className="h-6 w-6 text-[#C47B52]" />,
        title: "Build With Confidence",
        description:
          "Leave with clear layout refinements, an actionable Catch List, and Day-1 Plan Freeze to give your civil contractors before excavation begins.",
        benefits: [
          "Certified Catch List saving ₹3.5L to ₹15L+ in avoided rework",
          "Unified consensus between homeowner, architect & contractor",
          "Eliminates mid-construction demolition and disputes",
        ],
      },
    ],
    []
  );

  return (
    <div id="process">
      <HowItWorks
        eyebrow="Four-Step Workflow"
        title="From Blueprint Submission to Day-1 Plan Freeze"
        description={BUSINESS_CONTACT.turnaroundSummary}
        steps={steps}
      />
    </div>
  );
}

export default ProcessSection;
