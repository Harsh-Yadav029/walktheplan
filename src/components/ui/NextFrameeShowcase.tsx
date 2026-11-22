import React, { useState } from 'react';
import {
  NfButton,
  NfCard,
  NfInput,
  NfChip,
  NfEyebrow,
} from './nextframee';

export function NextFrameeShowcase() {
  const [inputValue, setInputValue] = useState('');

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 bg-[#000000] text-white overflow-hidden">
      {/* Atmospheric Glow Highlights */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[300px] bg-[#9CCBFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[300px] bg-[#AF46FF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* Header Display */}
        <div className="text-center space-y-4">
          <NfEyebrow>NEXTFRAMEE • DESIGN SYSTEM</NfEyebrow>
          <h1 className="nf-headline-display text-white">
            Cinematic <span className="text-[#9CCBFF]">Future</span>
          </h1>
          <p className="nf-body-lg text-white/70 max-w-2xl mx-auto">
            A dark, cinematic landing-page system with stark contrast, mono copy, and neon-inflected accents.
          </p>
        </div>

        {/* Component Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Buttons & Chips */}
          <NfCard className="space-y-8">
            <div>
              <NfEyebrow>INTERACTIVE CONTROLS</NfEyebrow>
              <h3 className="nf-headline-md mb-2">Pill Action Geometry</h3>
              <p className="nf-body-sm text-white/60 mb-6">
                All-caps or label-lg Arial with full 9999px pill rounding and high-contrast elevation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <NfButton variant="primary">
                Explore Studio ➔
              </NfButton>
              <NfButton variant="secondary">
                Book Session
              </NfButton>
              <NfButton variant="link">
                View Blueprint Spec
              </NfButton>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2.5">
              <NfChip>1:1 LASER MAPPING</NfChip>
              <NfChip>3D PROJECTION</NfChip>
              <NfChip>VR SPATIAL CAD</NfChip>
            </div>
          </NfCard>

          {/* Card 2: Inputs & Typography */}
          <NfCard className="space-y-8">
            <div>
              <NfEyebrow>MONO INPUT & DATA</NfEyebrow>
              <h3 className="nf-headline-md mb-2">Elevated Surface #050505</h3>
              <p className="nf-body-sm text-white/60 mb-6">
                54px pill inputs featuring Geist Mono typography with hairline translucent borders.
              </p>
            </div>

            <div className="space-y-4">
              <NfInput
                placeholder="Enter client email or CAD reference..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="flex justify-between items-center px-2">
                <span className="nf-body-sm text-white/40">Status: System Operational</span>
                <span className="nf-body-sm text-[#9CCBFF]">Ready for Simulation</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1">
              <p className="nf-body-sm text-[#C4A7FF]">
                // NEXTFRAMEE_SPECIFICATION: ALPHA
              </p>
              <p className="nf-body-sm text-white/50">
                Contrast: #FFFFFF vs #000000 | Border: #FFFFFF1A | Radius: 32px
              </p>
            </div>
          </NfCard>
        </div>
      </div>
    </section>
  );
}
