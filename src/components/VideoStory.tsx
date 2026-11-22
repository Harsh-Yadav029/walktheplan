import { useState } from 'react';
import { ArrowRight, ChevronRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { ASSETS } from '../data/siteContent';
import './cinematic.css';

interface VideoStoryProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

interface StoryChapter {
  id: number;
  number: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  technicalData: {
    scale: string;
    cadLayer: string;
    fov: string;
  };
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    number: '01',
    title: 'Blueprint Awakening',
    kicker: 'CAD Precision Vectors',
    description:
      'Your floor plan originates as pure 2D digital vectors. High-precision laser calibration maps every wall, partition, and door swing across our physical studio bays.',
    image: ASSETS.introBlueprint,
    technicalData: { scale: '1:100 CAD Input', cadLayer: 'DWG / DXF Polylines', fov: 'Ortho Top-Down' },
  },
  {
    id: 2,
    number: '02',
    title: 'Architectural Extrusion',
    kicker: 'True 1:1 Scale Volumes',
    description:
      'Lines lift into spatial dimensions. Verify true ceiling heights, lintel clearances, and volumetric proportions before concrete is poured.',
    image: ASSETS.interiorRender,
    technicalData: { scale: '1:1 True Height', cadLayer: 'Volumetric Partitions', fov: '45° Isometric' },
  },
  {
    id: 3,
    number: '03',
    title: 'Spatial Visualization',
    kicker: 'Tactile Material Realism',
    description:
      'Realistic architectural textures, chevron woods, honed travertine, and daylight exposure reveal the emotional weight of your finished rooms.',
    image: ASSETS.interiorRender,
    technicalData: { scale: 'PBR Photometric', cadLayer: 'Interior Fixtures & Joinery', fov: '52° Eye-Level' },
  },
  {
    id: 4,
    number: '04',
    title: 'Real Scale Projection',
    kicker: 'Studio Floor Laser Mapping',
    description:
      'Overhead laser projectors cast your entire floor layout across our massive studio floor. Walk through actual corridors and doorways with movable furniture blocks.',
    image: ASSETS.heroStudio,
    technicalData: { scale: '1:1 Physical Projection', cadLayer: 'Overhead Projector Grid', fov: 'Studio High-Angle' },
  },
  {
    id: 5,
    number: '05',
    title: "Don't just imagine it. Walk it.",
    kicker: 'The Definitive Pre-Build Reality',
    description:
      'Zero layout regrets. Align your family, architect, and interior designers physically inside your unbuilt home with absolute operational certainty.',
    image: ASSETS.vrWalkthrough,
    technicalData: { scale: '1:1 Physical + VR', cadLayer: 'Live Client Walkthrough', fov: 'Human Walking Horizon' },
  },
];

export function VideoStory({ onBookClick, onExploreClick }: VideoStoryProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  const active = STORY_CHAPTERS[activeChapterIndex];

  return (
    <section
      id="video-story"
      className="relative min-h-screen w-full bg-[var(--color-graphite-900)] text-[var(--color-cream-100)] py-16 md:py-24 px-5 md:px-10 overflow-hidden flex flex-col justify-between"
    >
      {/* Background Graphic Asset with Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={active.image}
          alt={active.title}
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1] transition-opacity duration-700"
        />
        <div className="absolute inset-0 wtp-cinematic-vignette" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-graphite-900)] via-transparent to-[var(--color-graphite-900)]/80" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 mx-auto max-w-[1360px] w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-tech text-xs uppercase tracking-[0.2em] text-[var(--color-copper-500)]">
            WALK THE PLAN
          </span>
          <span className="w-px h-4 bg-[var(--color-silver-400)]/30" />
          <span className="font-tech text-[11px] uppercase tracking-[0.12em] text-[var(--color-silver-400)]/80">
            CINEMATIC STORY · LITE MODE
          </span>
        </div>

        <button
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full wtp-hud-glass text-[11px] font-tech text-[var(--color-silver-400)] hover:text-white transition-colors"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--color-copper-500)]" />}
          <span>{muted ? 'MUTED' : 'AMBIENT ON'}</span>
        </button>
      </div>

      {/* Main Chapter Presentation */}
      <div className="relative z-10 mx-auto max-w-[1360px] w-full my-auto py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full wtp-hud-glass-copper mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-copper-400)]" />
            <span className="font-tech text-[11px] uppercase tracking-[0.15em] text-[var(--color-copper-400)]">
              CHAPTER {active.number} — {active.kicker}
            </span>
          </div>

          <h2 className="font-sora text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--color-cream-100)] leading-[1.08] mb-6">
            {active.title}
          </h2>

          <p className="text-base sm:text-lg text-[var(--color-silver-400)] font-light leading-relaxed mb-8 max-w-2xl">
            {active.description}
          </p>

          {/* Technical Telemetry Metadata */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mb-10 p-4 rounded-lg wtp-hud-glass border border-[var(--color-copper-500)]/20">
            <div>
              <span className="block font-tech text-[10px] uppercase tracking-[0.14em] text-[var(--color-silver-400)]/70">
                PROJECTION
              </span>
              <span className="font-tech text-xs sm:text-sm text-[var(--color-cream-100)] font-medium">
                {active.technicalData.scale}
              </span>
            </div>
            <div>
              <span className="block font-tech text-[10px] uppercase tracking-[0.14em] text-[var(--color-silver-400)]/70">
                CAD LAYER
              </span>
              <span className="font-tech text-xs sm:text-sm text-[var(--color-cream-100)] font-medium">
                {active.technicalData.cadLayer}
              </span>
            </div>
            <div>
              <span className="block font-tech text-[10px] uppercase tracking-[0.14em] text-[var(--color-silver-400)]/70">
                CAMERA HORIZON
              </span>
              <span className="font-tech text-xs sm:text-sm text-[var(--color-copper-400)] font-medium">
                {active.technicalData.fov}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-3 bg-[var(--color-copper-500)] hover:bg-[var(--color-copper-600)] px-7 py-3.5 text-xs font-tech font-semibold uppercase tracking-[0.16em] text-white transition-all wtp-copper-glow-sm cursor-pointer"
            >
              <span>Book Your Experience</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 border border-[var(--color-cream-100)]/30 hover:border-[var(--color-copper-500)] px-6 py-3.5 text-xs font-tech uppercase tracking-[0.16em] text-[var(--color-cream-100)] transition-colors cursor-pointer"
            >
              <span>Explore Our Technology</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Chapter Switcher */}
      <div className="relative z-10 mx-auto max-w-[1360px] w-full pt-6 border-t border-[var(--color-silver-400)]/20">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STORY_CHAPTERS.map((ch, index) => {
            const isSelected = index === activeChapterIndex;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapterIndex(index)}
                className={`text-left p-3 rounded transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-graphite-800)] border border-[var(--color-copper-500)]'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-tech text-[10px] text-[var(--color-copper-400)]">
                    CH {ch.number}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-copper-400)] animate-pulse" />}
                </div>
                <p className="font-sora text-xs font-medium text-[var(--color-cream-100)] line-clamp-1">
                  {ch.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
