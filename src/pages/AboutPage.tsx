import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import { StoryDrawer } from '../components/StoryDrawer';
import {
  Sparkles,
  ArrowRight,
  Monitor,
  Layers,
  Eye,
  BookOpen,
  CheckCircle2,
  Quote,
  Compass,
  Building2,
  Hammer,
} from 'lucide-react';

export function AboutPage() {
  const router = useRouter();
  const [isStoryDrawerOpen, setIsStoryDrawerOpen] = useState(false);
  const [selectedDrawerChapter, setSelectedDrawerChapter] = useState(0);

  const openDrawerWithChapter = (chapterIdx: number) => {
    setSelectedDrawerChapter(chapterIdx);
    setIsStoryDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#141516] text-[#F2EDE5] font-sans selection:bg-[#C47B52] selection:text-white">
      {/* 21st.dev Interactive Story Drawer */}
      <StoryDrawer
        open={isStoryDrawerOpen}
        onOpenChange={setIsStoryDrawerOpen}
        defaultChapter={selectedDrawerChapter}
      />

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center bg-gradient-to-b from-[#181A1B] via-[#141516] to-[#101112]">
        {/* Subtle Ambient Blueprint Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(196,123,82,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(196,123,82,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono tracking-widest uppercase text-[#EED77A]">
            <Compass className="w-3.5 h-3.5 text-[#C47B52]" />
            <span>Who We Are • Walk The Plan</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-[#F5F2EB] leading-[1.1]">
            Every Home Deserves <br />
            <span className="text-[#C47B52] italic font-serif">A Scale Test Drive</span>
          </h1>

          <p className="text-base sm:text-lg text-[#A5A7A4] max-w-2xl mx-auto leading-relaxed">
            We started Walk The Plan because we saw a major gap in the Indian home building process:
            families investing their life savings into blueprints and 3D screens they couldn't physically feel.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openDrawerWithChapter(0)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-lg hover:shadow-[#EED77A]/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <BookOpen className="w-4 h-4 text-[#191A18]" />
              <span>Open Interactive Story Drawer</span>
            </button>

            <button
              type="button"
              onClick={() => router.navigate('/#book')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#F2EDE5] bg-[#202223] hover:bg-[#282a2b] border border-white/10 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C47B52]" />
              <span>Book Studio Walkthrough</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5 Editorial Chapters Section */}
      <section className="py-24 border-y border-white/5 bg-[#181A1B]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#C47B52] uppercase tracking-widest">
              The Documentary Narrative
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EB]">
              5 Chapters of Pre-Construction Transformation
            </h2>
            <p className="text-sm text-[#A5A7A4] max-w-xl mx-auto">
              Click any chapter to launch the interactive drawer reader or explore the full story below.
            </p>
          </div>

          <div className="space-y-12">
            {/* Chapter 1 */}
            <article className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 border-l-4 border-l-[#C47B52] space-y-4 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C47B52]">
                  01 / Origin
                </span>
                <button
                  type="button"
                  onClick={() => openDrawerWithChapter(0)}
                  className="text-xs font-mono text-[#EED77A] hover:underline inline-flex items-center gap-1"
                >
                  Read in Drawer <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#F5F2EB]">OUR JOURNEY</h3>
              <h4 className="text-sm font-semibold text-[#EED77A]">
                Reimagining How India Builds Homes, One Walkthrough at a Time.
              </h4>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                A home is one of the biggest investments a person makes in their lifetime. Yet, for decades, homeowners have been expected to make critical decisions based on drawings, floor plans, and digital screens. We believed there had to be a better way.
              </p>
            </article>

            {/* Chapter 2 */}
            <article className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 border-l-4 border-l-[#C47B52] space-y-4 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C47B52]">
                  02 / The Catalyst
                </span>
                <button
                  type="button"
                  onClick={() => openDrawerWithChapter(1)}
                  className="text-xs font-mono text-[#EED77A] hover:underline inline-flex items-center gap-1"
                >
                  Read in Drawer <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#F5F2EB]">THE WHY</h3>
              <h4 className="text-sm font-semibold text-[#EED77A]">
                The Problem We Set Out to Solve
              </h4>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                With over 8 years of experience in the architecture industry, our Founder recognized a common challenge faced by homeowners, architects, builders, and developers alike:
              </p>
              <div className="p-4 rounded-xl bg-[#141516] border border-[#C47B52]/30 text-center font-medium italic text-white text-base">
                "People struggle to truly understand a space before it is built."
              </div>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                No matter how detailed a floor plan or 3D design may be, it is often difficult to fully visualize dimensions, layouts, movement, and the overall feel of a space. This uncertainty leads to confusion, design changes, delays, and costly demolition mistakes during construction.
              </p>
            </article>

            {/* Chapter 3 */}
            <article className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 border-l-4 border-l-[#C47B52] space-y-4 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C47B52]">
                  03 / Breakthrough
                </span>
                <button
                  type="button"
                  onClick={() => openDrawerWithChapter(2)}
                  className="text-xs font-mono text-[#EED77A] hover:underline inline-flex items-center gap-1"
                >
                  Read in Drawer <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#F5F2EB]">THAT INSIGHT SPARKED A VISION</h3>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                A vision to help people experience their future spaces before construction begins, reducing uncertainty, improving decision-making, and creating better outcomes for everyone involved in the building journey.
              </p>
              <p className="text-base font-serif font-bold text-white">
                This vision became Walk The Plan Private Limited.
              </p>
            </article>

            {/* Chapter 4 */}
            <article className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 border-l-4 border-l-[#C47B52] space-y-4 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C47B52]">
                  04 / Today
                </span>
                <button
                  type="button"
                  onClick={() => openDrawerWithChapter(3)}
                  className="text-xs font-mono text-[#EED77A] hover:underline inline-flex items-center gap-1"
                >
                  Read in Drawer <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#F5F2EB]">THE PRESENT</h3>
              <h4 className="text-sm font-semibold text-[#EED77A]">
                Redefining How Spaces Are Understood
              </h4>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                Today, Walk The Plan is pioneering a new category in architectural visualization and pre-construction planning. Through innovative solutions such as AR-Based 1:1 Floor Plan Projection, Real-Time Bare-Shell VR, 3D Walkthroughs, and Design Visualization Services, we enable people to see, understand, and experience their spaces before execution begins.
              </p>
            </article>

            {/* Chapter 5 */}
            <article className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 border-l-4 border-l-[#C47B52] space-y-4 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C47B52]">
                  05 / Destiny
                </span>
                <button
                  type="button"
                  onClick={() => openDrawerWithChapter(4)}
                  className="text-xs font-mono text-[#EED77A] hover:underline inline-flex items-center gap-1"
                >
                  Read in Drawer <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#F5F2EB]">THE FUTURE</h3>
              <h4 className="text-sm font-semibold text-[#EED77A]">
                Creating a New Standard in Home Building
              </h4>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">
                Our vision extends far beyond walkthrough experiences. We are building a future where experiencing a space before construction becomes a natural and essential part of the home-building journey. Inspired by successful concepts adopted across global construction markets, Walk The Plan is bringing this transformative approach to India.
              </p>
              <div className="p-4 rounded-xl bg-[#141516] border-l-2 border-[#EED77A] text-sm text-[#EED77A] font-semibold">
                "Empowering people to see, feel, understand, and refine their spaces before construction starts."
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Leadership Biographies Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-24">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-[#C47B52] uppercase tracking-widest">
            Leadership & Architectural Guidance
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#F5F2EB]">
            The Minds Behind The Blueprint
          </h2>
          <p className="text-sm text-[#A5A7A4] max-w-xl mx-auto">
            Combining architectural design vision, civil execution rigor, and strategic interior mastery.
          </p>
        </div>

        {/* 1. Parth Khanna */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-8 sm:p-10 rounded-3xl bg-[#181A1B] border border-white/5">
          <div className="lg:col-span-4 space-y-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#C47B52] to-[#EED77A] flex items-center justify-center font-serif text-3xl font-bold text-[#141516] shadow-md">
              PK
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Parth <span className="text-[#C47B52]">Khanna</span>
              </h3>
              <p className="text-sm text-[#C47B52] font-medium mt-0.5">Founder & Director</p>
              <p className="text-xs text-[#A5A7A4] font-mono mt-1">B.Arch • 8+ Years Experience</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141516] border-l-2 border-[#C47B52]">
              <p className="text-xs sm:text-sm italic text-white/90">
                "Making it possible to walk through your future home before construction begins."
              </p>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-[#D2D3D0] leading-relaxed">
            <p>
              Every meaningful innovation begins with an observation. As a <strong>Bachelor of Architecture</strong> with over <strong>8 years of professional experience</strong> across residential homes, luxury villas, commercial developments, and a wide range of architectural projects, I wasn't just designing buildings—I was understanding people.
            </p>
            <p className="text-white font-serif font-bold text-base italic border-l-2 border-[#EED77A] pl-4 py-1">
              "Architects could visualize the design. Clients often couldn't."
            </p>
            <p>
              Despite detailed floor plans, elevations, and 3D renders, homeowners still struggled to truly understand how their future home would feel once it was built. This communication gap between architectural imagination and client understanding frequently resulted in uncertainty, design revisions, delayed decisions, and avoidable costs.
            </p>
            <p>
              Walk The Plan has earned the trust of homeowners, architects, builders, and industry leaders who believe that the future of construction begins long before execution. Renowned professionals, including <strong>Sumit Dhawan</strong> and <strong>Ridhi Khosla</strong>, have experienced our platform firsthand, further reinforcing our belief that immersive planning is not just an innovation—it is the future of the construction industry.
            </p>
            <div className="pt-2 font-semibold text-[#EED77A]">
              "The best construction decisions are made before construction begins."
            </div>
          </div>
        </div>

        {/* 2. Himanshu Makkar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-8 sm:p-10 rounded-3xl bg-[#181A1B] border border-white/5">
          <div className="lg:col-span-4 space-y-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#383B3D] to-[#C47B52] flex items-center justify-center font-serif text-3xl font-bold text-[#EED77A] shadow-md">
              HM
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Himanshu <span className="text-[#C47B52]">Makkar</span>
              </h3>
              <p className="text-sm text-[#C47B52] font-medium mt-0.5">Director</p>
              <p className="text-xs text-[#A5A7A4] font-mono mt-1">Civil Execution • 8+ Years Experience</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141516] border-l-2 border-[#C47B52]">
              <p className="text-xs sm:text-sm italic text-white/90">
                "Making every construction journey clearer before the first brick is laid."
              </p>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-[#D2D3D0] leading-relaxed">
            <p>
              Great construction is never defined by beautiful drawings alone. It is defined by what actually gets built on-site. Coming from a family deeply rooted in the construction industry and backed by over <strong>8 years of hands-on experience</strong> in construction execution, I have spent my career where projects truly come to life—on construction sites.
            </p>
            <p className="text-white font-serif font-bold text-base italic border-l-2 border-[#EED77A] pl-4 py-1">
              "Many homeowners approved designs without fully understanding how their spaces would actually look and function after construction."
            </p>
            <p>
              Somewhere between design and execution, expectations often changed. This resulted in unnecessary revisions, additional costs, project delays, material wastage, and avoidable stress. Giving homeowners the opportunity to experience their future spaces before construction begins creates something invaluable: confidence.
            </p>
            <div className="pt-2 font-semibold text-[#EED77A]">
              "Every successful project is built twice—first through thoughtful planning, and then through flawless execution."
            </div>
          </div>
        </div>

        {/* 3. Sanya Chawla Khanna */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-8 sm:p-10 rounded-3xl bg-[#181A1B] border border-white/5">
          <div className="lg:col-span-4 space-y-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#EED77A] to-[#C47B52] flex items-center justify-center font-serif text-3xl font-bold text-[#141516] shadow-md">
              SK
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Sanya Chawla <span className="text-[#C47B52]">Khanna</span>
              </h3>
              <p className="text-sm text-[#C47B52] font-medium mt-0.5">
                Director & Co-Founder, Studio Symmetry
              </p>
              <p className="text-xs text-[#A5A7A4] font-mono mt-1">
                Architect • Strategic Backbone of Walk The Plan
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141516] border-l-2 border-[#C47B52]">
              <p className="text-xs sm:text-sm italic text-white/90">
                "Every great home begins with a vision, and every vision deserves to be experienced before it is built."
              </p>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-[#D2D3D0] leading-relaxed">
            <p>
              Sanya Khanna is a highly accomplished Architect, Interior Design Consultant, and Design Strategist with over <strong>8 years of professional experience</strong>. After completing her Bachelor of Architecture (B.Arch.), she co-founded <strong>Studio Symmetry</strong>, successfully leading residential, commercial, and interior architecture.
            </p>
            <div className="p-4 rounded-2xl bg-[#141516] border border-[#C47B52]/20 italic text-white/95">
              "One experience that continues to inspire her involved a young child joyfully exploring every room of his future home during a walkthrough, while his grandfather—who had waited decades to build his dream house—experienced the overwhelming happiness of seeing that dream come to life before construction had even begun."
            </div>
            <p>
              Driven by innovation, creativity, and a deep commitment to improving the home-building journey, Sanya continues to contribute towards making Walk The Plan a benchmark for excellence in the architecture and construction industry.
            </p>
            <div className="pt-2 font-semibold text-[#EED77A]">
              "Never stop dreaming. Never stop building."
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 border-t border-white/5 bg-[#181A1B]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#C47B52] uppercase tracking-widest">
              Our Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F2EB]">
              Core Technologies We Deploy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 space-y-4 hover:border-[#C47B52]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#C47B52]/20 flex items-center justify-center text-[#EED77A]">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">📐 Floor Projections</h3>
              <p className="text-xs text-[#A5A7A4] leading-relaxed">
                We convert your CAD file into high-intensity projection maps overlaying our studio floor at 1:1 scale. Walk bedroom outlines and test walkway flow using physical furniture pieces.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 space-y-4 hover:border-[#C47B52]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">🥽 Augmented Reality</h3>
              <p className="text-xs text-[#A5A7A4] leading-relaxed">
                Experience architectural models overlaid on real-world space in our studio. See door structures, wall partitions, and window sightlines float in front of you.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1E2021] border border-white/5 space-y-4 hover:border-[#C47B52]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#EED77A]/20 flex items-center justify-center text-[#EED77A]">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">🌐 Immersive Virtual Reality</h3>
              <p className="text-xs text-[#A5A7A4] leading-relaxed">
                Step into a complete 3D environment mapping your home finishes. Change flooring tile materials, wall paints, and light fixtures dynamically during your session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#1E2021] to-[#141516] border border-[#C47B52]/30 text-center space-y-6 shadow-2xl">
          <Sparkles className="w-10 h-10 text-[#C47B52] mx-auto opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Ready to Walk Your Future Home?
          </h2>
          <p className="text-sm text-[#A5A7A4] max-w-lg mx-auto leading-relaxed">
            Send us your floor plan today. We will set up your projection experience inside our Gurugram studio in just 2 to 3 days.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.navigate('/#book')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-lg hover:shadow-[#EED77A]/25"
            >
              <span>Book Your Session Now</span>
              <ArrowRight className="w-4 h-4 text-[#191A18]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
