import React, { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { ElasticGallery, type ElasticItemProps } from '../components/ui/elastic-gallery';
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface StudioVideoItem {
  id: string;
  title: string;
  category: 'Architect' | 'Builders' | 'Enduser';
  description: string;
  poster: string;
  videoUrl: string;
  duration: string;
  location: string;
}

const STUDIO_VIDEO_CLIPS: StudioVideoItem[] = [
  {
    id: 'clip-1',
    title: 'Living Room & Kitchen Scale Review',
    category: 'Enduser',
    description: 'Homeowners walking through the open-concept living area and testing island counter circulation.',
    poster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '0:45',
    location: 'Gurugram Flagship',
  },
  {
    id: 'clip-2',
    title: 'Door Swings & Column Clearance Tested at 1:1',
    category: 'Architect',
    description: 'Lead architect verifying bathroom door collision and main entryway foyer proportions.',
    poster: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '1:12',
    location: 'Dehradun Studio',
  },
  {
    id: 'clip-3',
    title: 'Corridor Widths, Walked Not Guessed',
    category: 'Enduser',
    description: 'Family checking passage clearances with physical mockups to avoid hallway bottlenecks.',
    poster: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '0:58',
    location: 'Hyderabad Studio',
  },
  {
    id: 'clip-4',
    title: 'Modular Furniture Placed on Projected Plan',
    category: 'Enduser',
    description: 'Wheeled 1:1 modular sofa blocks and dining sets arranged to test actual room capacity.',
    poster: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '1:24',
    location: 'Varanasi Studio',
  },
  {
    id: 'clip-5',
    title: 'Architect & Client Consensus Session',
    category: 'Architect',
    description: 'Triple-consensus plan sign-off between interior designer, architect, and homeowner on site.',
    poster: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '1:45',
    location: 'Gurugram Flagship',
  },
  {
    id: 'clip-6',
    title: 'Builder Checks Structure Against Plan',
    category: 'Builders',
    description: 'Structural MEP rough-in validation verifying plumbing drop shafts before slab casting.',
    poster: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    duration: '2:10',
    location: 'Madurai Studio',
  },
  {
    id: 'clip-7',
    title: 'Master Bedroom & Balcony Line Check',
    category: 'Enduser',
    description: 'King-size bed clearance validation ensuring sliding balcony doors have ample walkway.',
    poster: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '0:50',
    location: 'Gurugram Flagship',
  },
  {
    id: 'clip-8',
    title: 'Live CAD Change Inside the Projection Studio',
    category: 'Architect',
    description: 'CAD technician moving an internal partition wall live by 9 inches during the walkthrough.',
    poster: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '1:15',
    location: 'Hyderabad Studio',
  },
  {
    id: 'clip-9',
    title: 'Full Villa Walkthrough Before Construction',
    category: 'Builders',
    description: '3,800 sq.ft luxury villa layout review identifying ₹4.2 Lakhs of civil rework before excavation.',
    poster: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    duration: '2:30',
    location: 'Gurugram Flagship',
  },
];

export function GalleryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Architect' | 'Builders' | 'Enduser'>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Filter video clips
  const filteredClips =
    activeCategory === 'All'
      ? STUDIO_VIDEO_CLIPS
      : STUDIO_VIDEO_CLIPS.filter((clip) => clip.category === activeCategory);

  const activeVideo = activeLightboxIndex !== null ? filteredClips[activeLightboxIndex] : null;

  const handleNextVideo = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredClips.length);
  };

  const handlePrevVideo = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredClips.length) % filteredClips.length);
  };

  // Keyboard navigation for video lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextVideo();
      if (e.key === 'ArrowLeft') handlePrevVideo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredClips.length]);

  return (
    <div className="relative z-10 min-h-screen bg-[#181A1B] text-[#F2EDE5] pt-24 md:pt-32 pb-24 selection:bg-[#C47B52] selection:text-white">
      {/* 1. HERO HEADER */}
      <section className="relative px-4 sm:px-8 max-w-7xl mx-auto text-center mb-12 md:mb-16">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[#C47B52]/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-white max-w-4xl leading-[1.12] mb-6">
            Studio Walkthrough <span className="text-[#C47B52] italic font-normal">Gallery</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#A5A7A4] max-w-2xl mx-auto leading-relaxed">
            Real clients walking real blueprints at 1:1 scale. Explore our interactive project showcase
            and live studio walkthrough recordings across our India studios.
          </p>
        </div>
      </section>

      {/* 2. ELASTIC GALLERY SHOWCASE */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-20 md:mb-28">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif text-white">
            Interactive Project Showcase
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A7A4] mt-2">
            Hover or click any project panel to expand its 1:1 scale architectural walkthrough details.
          </p>
        </div>

        {/* Integrated ElasticGallery Component */}
        <ElasticGallery
          onItemSelect={(item) => {
            // Find corresponding video if available
            const matchIndex = filteredClips.findIndex(
              (c) => c.title.toLowerCase().includes(item.title.toLowerCase().split(' ')[0])
            );
            if (matchIndex !== -1) {
              setActiveLightboxIndex(matchIndex);
            }
          }}
        />
      </section>

      {/* 3. STUDIO VIDEO CLIPS SECTION (From Gallery.jsx) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">
              Studio Walkthrough Video Reels
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A7A4] mt-2 max-w-xl">
              Filmed live inside our Gurugram, Dehradun, Varanasi, and Hyderabad studios. Watch real-time
              CAD edits and furniture circulation testing.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Architect', 'Builders', 'Enduser'] as const).map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#EED77A] text-[#191A18] shadow-md'
                      : 'bg-[#1E2021] text-[#A5A7A4] border border-[#2A2D30] hover:text-white hover:border-[#C47B52]'
                  }`}
                >
                  {cat === 'Enduser' ? 'Homeowners' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Clips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClips.map((clip, idx) => (
            <div
              key={clip.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="group relative rounded-2xl bg-[#1E2021] border border-[#2A2D30] overflow-hidden cursor-pointer hover:border-[#C47B52]/50 transition-all shadow-lg hover:shadow-2xl"
            >
              {/* Media Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={clip.poster}
                  alt={clip.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Category Pill Tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] font-mono uppercase tracking-wider text-[#EED77A] backdrop-blur-md">
                  {clip.category}
                </span>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/90">
                  {clip.duration}
                </span>

                {/* Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#EED77A] text-[#191A18] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-5 h-5 fill-[#191A18] ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5">
                <div className="flex items-center justify-between text-[11px] text-[#A5A7A4] font-mono mb-2">
                  <span>{clip.location}</span>
                  <span className="text-[#C47B52]">1:1 True Scale</span>
                </div>
                <h3 className="text-base font-serif text-white group-hover:text-[#EED77A] transition-colors line-clamp-1 mb-2">
                  {clip.title}
                </h3>
                <p className="text-xs text-[#A5A7A4] line-clamp-2 leading-relaxed">
                  {clip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE VIDEO LIGHTBOX MODAL */}
      {activeVideo && (
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
              handlePrevVideo();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Previous Clip"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Navigation Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextVideo();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Next Clip"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Video Stage Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#141516] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Native Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                key={activeVideo.id}
                src={activeVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Meta Info */}
            <div className="p-6 sm:p-8 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#A5A7A4] font-mono">
                <span className="text-[#EED77A] uppercase">{activeVideo.category}</span>
                <span>
                  Clip {(activeLightboxIndex ?? 0) + 1} of {filteredClips.length} • {activeVideo.location}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-white">{activeVideo.title}</h3>
              <p className="text-sm text-[#A5A7A4] leading-relaxed">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
