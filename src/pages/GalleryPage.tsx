import React, { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { ElasticGallery, type ElasticItemProps } from '../components/ui/elastic-gallery';
import {
  STUDIO_GALLERY_ITEMS,
  type StudioGalleryItem,
} from '../data/galleryContent';
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  ArrowRight,
  Maximize2,
} from 'lucide-react';

export type { StudioGalleryItem };
export { STUDIO_GALLERY_ITEMS };

const ELASTIC_STUDIO_ITEMS: ElasticItemProps[] = [
  {
    id: '01',
    title: 'Gurugram Flagship Studio',
    category: 'National Flagship',
    src: '/images/studio/gurgaon_studio.png',
    alt: 'Walk The Plan Gurugram Flagship 1:1 Floor Projection Bay',
    videoSrc: '/videos/studio/1.mp4',
    description: 'Overhead precision laser arrays projecting 4,000+ sq.ft residential layouts directly onto the studio bay floor.',
  },
  {
    id: '02',
    title: 'Dehradun Mountain Studio',
    category: 'Regional Studio',
    src: '/images/studio/dehradun_studio.png',
    alt: 'Walk The Plan Dehradun Studio',
    videoSrc: '/videos/studio/2.mp4',
    description: 'Hillside villa layouts and boutique hospitality floor plans validated at 1:1 human scale.',
  },
  {
    id: '03',
    title: '2026 Stage 01 Calibration',
    category: 'True 1:1 Scale',
    src: '/images/studio/2026_stage01_poster.png',
    alt: 'Walk The Plan 2026 Stage 01 Laser Grid Experience',
    videoSrc: '/videos/studio/20261120_212746_0000.mp4',
    description: 'Precision 2D CAD vectors morphing into physical movable walls with calibrated human circulation.',
  },
  {
    id: '04',
    title: 'Varanasi Heritage Bay',
    category: 'Eastern UP Studio',
    src: '/images/studio/varanasi_studio.png',
    alt: 'Walk The Plan Varanasi Studio',
    videoSrc: '/videos/studio/3.mp4',
    description: 'Purvanchal residential homes and commercial complexes checked with full-size furniture blocks.',
  },
  {
    id: '05',
    title: 'Hyderabad Tech Studio',
    category: 'South India Hub',
    src: '/images/studio/hyderabad_studio.png',
    alt: 'Walk The Plan Hyderabad Studio',
    videoSrc: '/videos/studio/4.mp4',
    description: 'High-rise luxury penthouses and gated community villas validated prior to masonry work.',
  },
];

type CategoryFilter = 'All' | 'Builders' | 'Architect' | 'Featured Collaborations' | 'Founder Insights' | 'Enduser';

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'All', label: 'All Media (15)' },
  { id: 'Builders', label: 'Builders' },
  { id: 'Architect', label: 'Architect' },
  { id: 'Featured Collaborations', label: 'Featured Collaborations' },
  { id: 'Founder Insights', label: 'Founder Insights' },
  { id: 'Enduser', label: 'Homeowners' },
];

export function GalleryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Filter items
  const filteredItems =
    activeCategory === 'All'
      ? STUDIO_GALLERY_ITEMS
      : STUDIO_GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const activeItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handleNextItem = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
  };

  const handlePrevItem = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextItem();
      if (e.key === 'ArrowLeft') handlePrevItem();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  return (
    <div className="relative z-10 min-h-screen bg-[#181A1B] text-[#F2EDE5] pt-24 md:pt-32 pb-24 selection:bg-[#C47B52] selection:text-white">
      {/* 1. HERO HEADER */}
      <section className="relative px-4 sm:px-8 max-w-7xl mx-auto text-center mb-12 md:mb-16">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[#C47B52]/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C47B52]/15 border border-[#C47B52]/30 text-xs font-mono uppercase tracking-widest text-[#EED77A] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#C47B52]" />
            <span>Studio &amp; Spatial Video Wall • 15 Verified Media</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-white max-w-4xl leading-[1.12] mb-6">
            Studio Walkthrough <span className="text-[#C47B52] italic font-normal">Gallery</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#A5A7A4] max-w-2xl mx-auto leading-relaxed">
            Real clients walking real blueprints at 1:1 scale. Explore 15 authentic walkthrough recordings,
            architect consensus sessions, and builder validations filmed live across our Indian studios.
          </p>
        </div>
      </section>

      {/* 2. ELASTIC GALLERY SHOWCASE */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-16 md:mb-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif text-white">
            Interactive Studio Bay Showcase
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A7A4] mt-2">
            Hover or click any studio panel to expand its 1:1 scale architectural walkthrough facility.
          </p>
        </div>

        {/* Integrated ElasticGallery Component with real studio assets */}
        <ElasticGallery
          items={ELASTIC_STUDIO_ITEMS}
          onItemSelect={(item) => {
            const matchIndex = filteredItems.findIndex(
              (c) => c.title.toLowerCase().includes(item.title.toLowerCase().split(' ')[0])
            );
            if (matchIndex !== -1) {
              setActiveLightboxIndex(matchIndex);
            }
          }}
        />
      </section>

      {/* 3. STUDIO VIDEO & MEDIA WALL (All 15 Items) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">
              Studio Walkthrough Reels &amp; Media
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A7A4] mt-2 max-w-xl">
              Filmed live inside our Gurugram, Dehradun, Varanasi, and Hyderabad studios. Watch real-time
              CAD edits, physical furniture circulation tests, and stakeholder agreements.
            </p>
          </div>

          {/* 5 Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#EED77A] text-[#191A18] shadow-md'
                      : 'bg-[#1E2021] text-[#A5A7A4] border border-[#2A2D30] hover:text-white hover:border-[#C47B52]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 15 Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="group relative rounded-2xl bg-[#1E2021] border border-[#2A2D30] overflow-hidden cursor-pointer hover:border-[#C47B52]/50 transition-all shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              {/* Media Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = item.localFallback.endsWith('.mp4')
                      ? '/images/studio/gurgaon_studio.png'
                      : item.localFallback;
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

                {/* Category Pill Tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 border border-white/20 text-[10px] font-mono uppercase tracking-wider text-[#EED77A] backdrop-blur-md">
                  {item.category === 'Enduser' ? 'Homeowners' : item.category}
                </span>

                {/* Duration or Type Badge */}
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white/90 border border-white/10">
                  {item.duration}
                </span>

                {/* Action Indicator: Play for Video, Maximize for Photo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.type === 'video' ? (
                    <div className="w-12 h-12 rounded-full bg-[#EED77A] text-[#191A18] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-[#191A18] ml-0.5" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#A5A7A4] font-mono mb-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C47B52]" />
                      {item.location}
                    </span>
                    <span className="text-[#C47B52]">1:1 True Scale</span>
                  </div>
                  <h3 className="text-base font-serif text-white group-hover:text-[#EED77A] transition-colors line-clamp-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#A5A7A4] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#A5A7A4] group-hover:text-[#EED77A] transition-colors">
                  <span>{item.type === 'video' ? 'Watch Walkthrough' : 'Inspect HD Frame'}</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FULLSCREEN INTERACTIVE LIGHTBOX MODAL */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-5 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Navigation Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevItem();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Previous Item"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Navigation Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextItem();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Next Item"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Media Stage */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#141516] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Player Container */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {activeItem.type === 'video' ? (
                <video
                  key={activeItem.id}
                  src={activeItem.mediaUrl}
                  onError={(e) => {
                    // Fall back to local studio video if remote streaming blocked
                    if (activeItem.localFallback) {
                      e.currentTarget.src = activeItem.localFallback;
                    }
                  }}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  key={activeItem.id}
                  src={activeItem.mediaUrl}
                  alt={activeItem.title}
                  onError={(e) => {
                    if (activeItem.localFallback) {
                      e.currentTarget.src = activeItem.localFallback;
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Video / Image Meta Info */}
            <div className="p-6 sm:p-8 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-[#A5A7A4] font-mono">
                <span className="text-[#EED77A] uppercase tracking-wider">
                  {activeItem.category === 'Enduser' ? 'Homeowners' : activeItem.category}
                </span>
                <span>
                  Item {(activeLightboxIndex ?? 0) + 1} of {filteredItems.length} • {activeItem.location}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white">{activeItem.title}</h3>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">{activeItem.description}</p>
              
              <div className="pt-2 flex items-center gap-4">
                <a
                  href="#book"
                  onClick={() => {
                    setActiveLightboxIndex(null);
                    router.navigate('/#book');
                  }}
                  className="inline-flex items-center gap-2 bg-[#C47B52] hover:bg-[#A85E43] text-white px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  <span>Book Walkthrough at {activeItem.location}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
