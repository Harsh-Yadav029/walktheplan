"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Layers, Search, Zap } from "lucide-react";

// The props for a single step card
export interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  stepNumber?: number | string;
}

/**
 * A single step card within the "How It Works" section.
 * It displays an icon, title, description, and a list of benefits.
 */
export const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
  stepNumber,
}) => (
  <div
    className={cn(
      "relative rounded-2xl border border-white/10 bg-[#181A1B] p-6 sm:p-7 text-[#F2EDE5] transition-all duration-300 ease-in-out flex flex-col justify-between group",
      "hover:scale-[1.02] hover:shadow-[0_15px_35px_-10px_rgba(196,123,82,0.25)] hover:border-[#C47B52]/50 hover:bg-[#1E2021]"
    )}
  >
    <div>
      {/* Top Header: Icon & Step Number */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C47B52]/15 text-[#EED77A] border border-[#C47B52]/30 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {stepNumber && (
          <span className="font-mono text-xs font-bold text-[#A5A7A4] group-hover:text-[#EED77A] transition-colors">
            {typeof stepNumber === "number" ? String(stepNumber).padStart(2, "0") : stepNumber}
          </span>
        )}
      </div>

      {/* Title and Description */}
      <h3 className="mb-2.5 font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#F2EDE5] transition-colors">
        {title}
      </h3>
      <p className="mb-6 text-sm text-[#A5A7A4] leading-relaxed font-light">
        {description}
      </p>
    </div>

    {/* Benefits List */}
    <ul className="space-y-3 pt-4 border-t border-white/10">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#F2EDE5]/90">
          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#C47B52]/20 mt-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#C47B52]" />
          </div>
          <span className="text-[#A5A7A4] leading-snug">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

export interface StepItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

// The main props for the HowItWorks component
export interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {
  steps?: StepItem[];
  title?: string;
  description?: string;
  eyebrow?: string;
}

const DEFAULT_STEPS: StepItem[] = [
  {
    icon: <Search className="h-6 w-6 text-[#C47B52]" />,
    title: "Enter your query",
    description:
      "Enter part name or article number, and we'll instantly check availability across thousands of stores.",
    benefits: [
      "Smart search understands even imprecise queries",
      "Automatic city detection",
      "Search history for quick access",
    ],
  },
  {
    icon: <Layers className="h-6 w-6 text-[#C47B52]" />,
    title: "Choose the best offer",
    description:
      "Compare prices, location and availability, choose the optimal option.",
    benefits: [
      "Sort by price, distance and rating",
      "Filter by availability and manufacturer",
      "Detailed information about each offer",
    ],
  },
  {
    icon: <Zap className="h-6 w-6 text-[#C47B52]" />,
    title: "Contact the store",
    description:
      "Call the store directly or request a callback through our service.",
    benefits: [
      "Direct contact without intermediaries",
      "Parts reservation capability",
      "Route building to store",
    ],
  },
];

/**
 * A responsive "How It Works" section that displays a multi-step process.
 * Styled with dark luxury theme variables and adaptable for 3 or 4 step workflows.
 */
export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  steps = DEFAULT_STEPS,
  title = "How it works",
  description = "Our service uses advanced technologies for instant auto parts search across thousands of stores in your city",
  eyebrow,
  ...props
}) => {
  const stepsCount = steps.length;
  const isFourSteps = stepsCount === 4;

  return (
    <section
      id="how-it-works"
      className={cn("w-full py-10 md:py-14 bg-[#141516] text-[#F2EDE5] border-b border-white/10 select-none", className)}
      {...props}
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 md:px-10">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-4xl text-center space-y-3">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A] mb-2">
              <span>{eyebrow}</span>
            </div>
          )}
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A5A7A4] max-w-2xl mx-auto font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-10 w-full max-w-5xl hidden sm:block">
          <div
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-[#C47B52]/40 via-[#EED77A]/40 to-[#C47B52]/40",
              isFourSteps ? "left-[12.5%] w-[75%]" : "left-[16.6667%] w-[66.6667%]"
            )}
          />
          {/* Grid aligning numbers with the card grid below */}
          <div
            className={cn(
              "relative grid",
              isFourSteps ? "grid-cols-4" : "grid-cols-3"
            )}
          >
            {steps.map((_, index) => (
              <div
                key={index}
                className="flex h-9 w-9 items-center justify-center justify-self-center rounded-full bg-[#1c1e1f] border border-[#C47B52]/50 font-mono text-xs font-bold text-[#EED77A] ring-4 ring-[#141516] shadow-md"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div
          className={cn(
            "mx-auto grid gap-6 lg:gap-8",
            isFourSteps
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[1360px]"
              : "grid-cols-1 md:grid-cols-3 max-w-5xl"
          )}
        >
          {steps.map((step, index) => (
            <StepCard
              key={index}
              stepNumber={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
