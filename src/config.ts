export interface StoryChapter {
  id: string;
  eyebrow: string;
  railLabel: string;
  title: string;
  /** Explicit headline lines for crisp line-by-line mask reveals */
  headlineLines: string[];
  /** Optional accent word inside the headline that receives the electric-blue glow */
  accentWord?: string;
  sub?: string;
  /** 1-based inclusive frame range (1..180) */
  startFrame: number;
  endFrame: number;
  hasBlueGlow?: boolean;
  hasSparkFlash?: boolean;
  showCtas?: boolean;
}

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  deliverable: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  location: string;
  year: string;
  area: string;
  category: string;
  summary: string;
  /** CSS gradient & architectural blueprint accent tokens */
  gradient: string;
  accentColor: string;
  silhouette: 'cantilever' | 'courtyard' | 'pavilion';
}

export const SITE_CONFIG = {
  brand: {
    name: 'Walk The Plan',
    descriptor: '1:1 Architectural Blueprint Projection Studio · India',
    tagline: 'Experience Your Future Home Before It Exists.',
    email: 'info@walktheplan.in',
    phone: '+91 97110 22075',
    studioAddress: 'Gurugram · Dehradun · Varanasi · Hyderabad · Madurai',
    copyright: '© 2026 Walk The Plan. All rights reserved.',
  },

  frames: {
    totalFrames: 180,
    fps: 12,
    /** Minimum sequential frames loaded before unlocking the hero from the loader */
    minReadyFrames: 30,
    /** 0-based index of static poster frame used when prefers-reduced-motion is active (frame 180) */
    posterFrameIndex: 179,
    basePath: '/frames/frame_',
    padLength: 3,
    extension: '.webp',
    /** Pinned scroll height in viewport-height units */
    desktopPinVh: 500,
    mobilePinVh: 350,
    /** GSAP ScrollTrigger scrub inertia (0.1 for instant tactile Lenis sync) */
    scrubInertia: 0.1,
    /** Canvas scale parallax across full hero scroll */
    scaleFrom: 1.0,
    scaleTo: 1.06,
    /** Native dimensions of the extracted video frames */
    sourceWidth: 1280,
    sourceHeight: 720,
  },

  nav: {
    links: [
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Franchise', href: '/franchise' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Blog', href: '/blog' },
      { label: 'Book Walkthrough', href: '#book' },
    ],
    ctaLabel: 'Book 1:1 Walkthrough',
  },

  chapters: [
    {
      id: 'plan',
      eyebrow: '01 / PLAN',
      railLabel: 'PLAN',
      title: 'THE PLAN',
      headlineLines: ['Every great home', 'begins as a line.'],
      sub: 'We start where you do – with a blank page and a point of view.',
      startFrame: 1,
      endFrame: 30,
    },
    {
      id: 'design',
      eyebrow: '02 / DESIGN',
      railLabel: 'DESIGN',
      title: 'THE SPARK',
      headlineLines: ['Ideas,', 'drawn in light.'],
      accentWord: 'light.',
      sub: 'Data, daylight and detail translated into a living model.',
      startFrame: 31,
      endFrame: 70,
      hasBlueGlow: true,
      hasSparkFlash: true,
    },
    {
      id: 'structure',
      eyebrow: '03 / STRUCTURE',
      railLabel: 'STRUCTURE',
      title: 'THE BUILD',
      headlineLines: ['Precision, before', 'the first stone.'],
      sub: 'Every wall, window and beam is resolved digitally first.',
      startFrame: 71,
      endFrame: 100,
    },
    {
      id: 'interiors',
      eyebrow: '04 / INTERIORS',
      railLabel: 'INTERIORS',
      title: 'THE REVEAL',
      headlineLines: ['Where the drawing', 'becomes a home.'],
      sub: 'Marble, timber and quiet light, exactly as imagined.',
      startFrame: 101,
      endFrame: 135,
    },
    {
      id: 'experience',
      eyebrow: '05 / EXPERIENCE',
      railLabel: 'EXPERIENCE',
      title: 'THE WALKTHROUGH',
      headlineLines: ['Walk through it', 'before it exists.'],
      sub: 'Immersive 1:1 previews so every decision is made with confidence.',
      startFrame: 136,
      endFrame: 165,
    },
    {
      id: 'live',
      eyebrow: '06 / LIVE',
      railLabel: 'LIVE',
      title: 'THE FINAL SHOT',
      headlineLines: ['Designed', 'to be lived in.'],
      startFrame: 166,
      endFrame: 180,
      showCtas: true,
    },
  ] satisfies StoryChapter[],

  ctas: {
    primary: 'Book a 1:1 Walkthrough',
    secondary: 'Explore Experience',
  },

  process: [
    {
      number: '01',
      title: 'Brief',
      summary:
        'We listen to how you live, gather site orientation and sunlight paths, and translate your aspirations into a clear spatial program.',
      deliverable: 'Site Study & Spatial Brief',
    },
    {
      number: '02',
      title: 'Design',
      summary:
        'Your architectural plan is calibrated at 1:1 studio scale and modeled in real-time light so every proportion is felt before sign-off.',
      deliverable: '1:1 Floor Walkthrough & Living Model',
    },
    {
      number: '03',
      title: 'Build',
      summary:
        'Every structural grid, service shaft, marble seam, and millwork joint is coordinated with zero ambiguity before ground is broken.',
      deliverable: 'Coordinated Construction Drawings',
    },
    {
      number: '04',
      title: 'Handover',
      summary:
        'From final lighting scenes to bespoke timber and stone finishes, we walk the completed home with you—faithful to the first line.',
      deliverable: 'Commissioned Residence',
    },
  ] satisfies ProcessStep[],

  projects: [
    {
      id: 'house-of-quiet-water',
      title: 'House of Quiet Water',
      location: 'Alibaug, Maharashtra',
      year: '2026',
      area: '6,800 sq.ft',
      category: 'Coastal Villa',
      summary:
        'Cantilevered charred timber volumes floating over a black basalt lap pool, resolved at 1:1 scale before excavation.',
      gradient:
        'radial-gradient(circle at 72% 28%, rgba(61, 169, 255, 0.24), transparent 46%), linear-gradient(155deg, #101824 0%, #090C11 55%, #191612 100%)',
      accentColor: '#3DA9FF',
      silhouette: 'cantilever',
    },
    {
      id: 'courtyard-monolith',
      title: 'The Courtyard Monolith',
      location: 'Sindhu Bhavan, Ahmedabad',
      year: '2025',
      area: '9,200 sq.ft',
      category: 'Private Residence',
      summary:
        'Double-height travertine gallery framed around a central shaded courtyard where dusk light traces calibrated wall planes.',
      gradient:
        'radial-gradient(circle at 28% 24%, rgba(200, 169, 126, 0.22), transparent 50%), linear-gradient(145deg, #181410 0%, #0B0D11 58%, #0E1520 100%)',
      accentColor: '#C8A97E',
      silhouette: 'courtyard',
    },
    {
      id: 'glass-horizon-pavilion',
      title: 'Glass Horizon Pavilion',
      location: 'Whitefield, Bengaluru',
      year: '2026',
      area: '5,400 sq.ft',
      category: 'Architecture & Interiors',
      summary:
        'Uninterrupted 12-meter glazed living spine connecting bespoke walnut joinery directly to an elevated twilight garden.',
      gradient:
        'radial-gradient(circle at 60% 72%, rgba(61, 169, 255, 0.18), transparent 48%), radial-gradient(circle at 22% 22%, rgba(200, 169, 126, 0.16), transparent 42%), linear-gradient(160deg, #0C131C 0%, #07090C 60%, #141210 100%)',
      accentColor: '#3DA9FF',
      silhouette: 'pavilion',
    },
  ] satisfies ProjectCard[],

  footer: {
    eyebrow: 'PRIVATE STUDIO APPOINTMENTS',
    ctaHeadline: "Experience your future home before it exists.",
    ctaSub:
      'Share your plot, architectural brief, or floor plan to schedule a private walkthrough at our studios across Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.',
    ctaButton: 'Book 1:1 Walkthrough',
  },
} as const;
