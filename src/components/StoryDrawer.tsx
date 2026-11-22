import { useState } from 'react';
import { Drawer } from './ui/drawer';
import { useRouter } from '../lib/router';
import { Sparkles, ArrowRight, BookOpen, User, CheckCircle2, Award } from 'lucide-react';

interface StoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultChapter?: number;
}

const CHAPTERS = [
  {
    number: '01',
    tag: 'Origin',
    title: 'Our Journey',
    subtitle: 'Reimagining How India Builds Homes, One Walkthrough at a Time.',
    content:
      'A home is one of the biggest investments a person makes in their lifetime. Yet, for decades, homeowners have been expected to make critical decisions based on drawings, floor plans, and digital screens. We believed there had to be a better way.',
    takeaway: 'Overcoming decades of building homes blindly on paper lines.',
  },
  {
    number: '02',
    tag: 'The Catalyst',
    title: 'The Why',
    subtitle: 'The Problem We Set Out to Solve',
    content:
      'With over 8 years of experience in the architecture industry, our Founder recognized a common challenge faced by homeowners, architects, builders, and developers alike: "People struggle to truly understand a space before it is built." No matter how detailed a floor plan or 3D design may be, it is often difficult to fully visualize dimensions, layouts, movement, and the overall feel of a space.',
    quote: '"People struggle to truly understand a space before it is built."',
    takeaway: 'Uncertainty leads to post-construction demolition and costly revisions.',
  },
  {
    number: '03',
    tag: 'Breakthrough',
    title: 'That Insight Sparked A Vision',
    subtitle: 'From Architectural Frustration to True Spatial Innovation',
    content:
      'A vision to help people experience their future spaces before construction begins, reducing uncertainty, improving decision-making, and creating better outcomes for everyone involved in the building journey. This vision became Walk The Plan Private Limited.',
    takeaway: 'Bridging international pre-construction validation standards to India.',
  },
  {
    number: '04',
    tag: 'Today',
    title: 'The Present',
    subtitle: 'Redefining How Spaces Are Understood',
    content:
      'Today, Walk The Plan is pioneering a new category in architectural visualization and pre-construction planning. Through innovative solutions such as AR-Based 1:1 Floor Plan Projection, Real-Time Bare-Shell VR, 3D Walkthroughs, and Design Visualization Services, we enable people to see, understand, and experience their spaces before execution begins.',
    takeaway: 'Dynamic in-studio CAD modification with modular physical furniture.',
  },
  {
    number: '05',
    tag: 'Destiny',
    title: 'The Future',
    subtitle: 'Creating a New Standard in Home Building',
    content:
      'Our vision extends far beyond walkthrough experiences. We are building a future where experiencing a space before construction becomes a natural and essential part of the home-building journey. Just as a test drive helps people make confident decisions before purchasing a vehicle, we believe every homeowner should have the opportunity to experience their future home before it is built.',
    quote: '"Empowering people to see, feel, understand, and refine their spaces before construction starts."',
    takeaway: 'Making Walk The Plan an integral step before every construction project begins.',
  },
];

const LEADERSHIP = [
  {
    name: 'Parth Khanna',
    role: 'Founder & Director',
    credentials: 'B.Arch • 8+ Years Architectural Experience',
    quote: '"Making it possible to walk through your future home before construction begins."',
    summary:
      'Observed that architects could easily visualize blueprints while clients struggled to feel the spaces, resulting in avoidable demolition mistakes. Inspired by global visualization innovations, founded Walk The Plan to protect homeowners’ largest lifetime investment.',
  },
  {
    name: 'Himanshu Makkar',
    role: 'Director',
    credentials: 'Civil Execution Expert • 8+ Years Site Experience',
    quote: '"Making every construction journey clearer before the first brick is laid."',
    summary:
      'With deep construction family roots, focuses on flawless execution, site coordination, and structural quality control. Champion of the philosophy: "Every successful project is built twice—first through thoughtful planning, and then through flawless execution."',
  },
  {
    name: 'Sanya Chawla Khanna',
    role: 'Director & Co-Founder, Studio Symmetry | Strategic Backbone',
    credentials: 'B.Arch • Interior Design Consultant & Strategist',
    quote: '"Every great home begins with a vision, and every vision deserves to be experienced before it is built."',
    summary:
      'Leads client experience and long-term design innovation. Driven by the emotional moment of seeing a young child joyfully explore his future bedroom while his grandfather experienced his lifelong dream home in 1:1 scale before construction started.',
  },
];

export function StoryDrawer({ open, onOpenChange, defaultChapter = 0 }: StoryDrawerProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'leadership'>('chapters');
  const [activeChapterIndex, setActiveChapterIndex] = useState(defaultChapter);
  const router = useRouter();

  const handleBook = () => {
    onOpenChange(false);
    if (router.pathname !== '/') {
      router.navigate('/#book');
    } else {
      router.navigate('#book');
    }
  };

  const currentChapter = CHAPTERS[activeChapterIndex];

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      width={560}
      title="The Walk The Plan Documentary"
      description="Interactive Story & Architectural Philosophy"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[#A5A7A4]">
            {activeTab === 'chapters'
              ? `Chapter ${activeChapterIndex + 1} of ${CHAPTERS.length}`
              : 'Leadership Biographies'}
          </div>
          <button
            type="button"
            onClick={handleBook}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#191A18] bg-[#EED77A] hover:bg-[#F4DF8E] transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#191A18]" />
            <span>Book Studio Session</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#191A18]" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#202223] border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'chapters'
                ? 'bg-[#C47B52] text-white shadow-sm font-semibold'
                : 'text-[#A5A7A4] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>5 Story Chapters</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leadership')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'leadership'
                ? 'bg-[#C47B52] text-white shadow-sm font-semibold'
                : 'text-[#A5A7A4] hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Founders & Leadership</span>
          </button>
        </div>

        {activeTab === 'chapters' ? (
          <div className="space-y-5">
            {/* Chapter Badges Selector */}
            <div className="grid grid-cols-5 gap-1.5">
              {CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.number}
                  type="button"
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    activeChapterIndex === idx
                      ? 'border-[#C47B52] bg-[#C47B52]/20 text-[#EED77A] font-bold'
                      : 'border-white/10 bg-[#1F2122] text-[#A5A7A4] hover:border-white/30'
                  }`}
                >
                  <div className="text-[10px] opacity-70">CH</div>
                  <div className="text-sm font-semibold">{ch.number}</div>
                </button>
              ))}
            </div>

            {/* Active Chapter Card */}
            <article className="p-5 rounded-2xl bg-[#202223] border border-[#C47B52]/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#C47B52]/20 text-[#EED77A] border border-[#C47B52]/40">
                  {currentChapter.number} / {currentChapter.tag}
                </span>
                <span className="text-xs text-[#A5A7A4]">Walk The Plan Narrative</span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-[#F2EDE5] mb-1">
                  {currentChapter.title}
                </h3>
                <p className="text-xs text-[#EED77A] font-medium">
                  {currentChapter.subtitle}
                </p>
              </div>

              {currentChapter.quote && (
                <div className="p-3.5 rounded-xl bg-[#141516] border-l-4 border-[#C47B52] text-sm italic text-white/95">
                  {currentChapter.quote}
                </div>
              )}

              <p className="text-xs leading-relaxed text-[#D2D3D0]">
                {currentChapter.content}
              </p>

              <div className="pt-3 border-t border-white/5 flex items-start gap-2 text-xs text-[#A5A7A4]">
                <CheckCircle2 className="w-4 h-4 text-[#C47B52] shrink-0 mt-0.5" />
                <span>{currentChapter.takeaway}</span>
              </div>
            </article>

            {/* Chapter Stepper Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={activeChapterIndex === 0}
                onClick={() => setActiveChapterIndex((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#A5A7A4] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                ← Previous
              </button>
              <button
                type="button"
                disabled={activeChapterIndex === CHAPTERS.length - 1}
                onClick={() => setActiveChapterIndex((p) => Math.min(CHAPTERS.length - 1, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#A5A7A4] hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Next Chapter →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="p-5 rounded-2xl bg-[#202223] border border-white/10 space-y-3 hover:border-[#C47B52]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">
                      {leader.name}
                    </h4>
                    <p className="text-xs text-[#C47B52] font-medium">{leader.role}</p>
                    <p className="text-[11px] text-[#A5A7A4] font-mono mt-0.5">{leader.credentials}</p>
                  </div>
                  <Award className="w-5 h-5 text-[#EED77A] shrink-0 opacity-70" />
                </div>

                <div className="p-3 rounded-xl bg-[#141516] border-l-2 border-[#EED77A] text-xs italic text-[#F2EDE5]">
                  {leader.quote}
                </div>

                <p className="text-xs text-[#A5A7A4] leading-relaxed">
                  {leader.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
