export const ASSETS = {
  heroStudio: '/src/assets/images/hero_studio_projection_1795129729229.jpg',
  introBlueprint: '/src/assets/images/intro_spatial_blueprint_1795129728965.jpg',
  vrWalkthrough: '/src/assets/images/service_vr_walkthrough_1795129729418.jpg',
  interiorRender: '/src/assets/images/service_3d_interior_1795129729329.jpg',
  galleryWarehouse: '/src/assets/images/gallery_studio_space_1795129728944.jpg',
} as const;

export interface EditorialService {
  number: string;
  id: string;
  packageId: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
}

export const EDITORIAL_SERVICES: EditorialService[] = [
  {
    number: '01',
    id: 'floor-projection',
    packageId: 'ar-projection-1hr',
    title: 'AR-Based 1:1 Floor Plan Projection',
    subtitle: 'Physical Full-Scale Blueprint Walking',
    description:
      'Experience your floor plan projected at a true 1:1 scale, allowing you to physically walk through every room, passage, and space with real modular furniture props before construction begins.',
    highlights: [
      'Experience actual room dimensions before excavation',
      'Understand furniture circulation and passage flow',
      'Identify design modifications and door swings early',
      'Sub-millimeter calibrated laser projection report',
    ],
    image: ASSETS.heroStudio,
    imageAlt: 'Overhead precision laser projectors casting a 1:1 architectural floor plan onto the Walk The Plan studio floor',
  },
  {
    number: '02',
    id: 'vr-walkthrough',
    packageId: 'bare-shell-3d-2hr',
    title: 'Real-Time Bare-Shell 3D Walkthrough',
    subtitle: 'Immersive Volumetric Spatial Exploration',
    description:
      'Our Real-Time Bare-Shell Virtual Reality experience enables homeowners and architects to explore their future property in an immersive virtual environment from true eye level.',
    highlights: [
      'Interactive volumetric virtual spatial exploration',
      'Evaluate ceiling heights, window sill depths & sightlines',
      'Synchronized live studio monitor for family & architects',
      'Reduced uncertainty and triple consensus before construction',
    ],
    image: ASSETS.vrWalkthrough,
    imageAlt: 'Architect guiding a client through a VR spatial walkthrough beside a calibrated architectural display',
  },
  {
    number: '03',
    id: '3d-visualization',
    packageId: 'interior-exterior-3d-6hr',
    title: 'Interior & Exterior 3D Design Visualization',
    subtitle: 'Aesthetic, Material & Lighting Clarity',
    description:
      'Bring your ideas to life through photorealistic 3D walkthroughs and realistic visualizations to understand design intent, aesthetics, finishes, natural daylight angles, and artificial lighting.',
    highlights: [
      'Photorealistic project and facade lighting studies',
      'Travertine, teak, marble, and joinery proportion review',
      'Realistic material simulation for confident procurement',
      'Unified visual clarity for fast-track client approvals',
    ],
    image: ASSETS.interiorRender,
    imageAlt: 'Photorealistic travertine and teak contemporary living and dining visualization with natural daylight',
  },
  {
    number: '04',
    id: 'design-validation',
    packageId: 'bare-shell-3d-2hr',
    title: 'Collaborative Stakeholder Plan Freeze',
    subtitle: 'Zero Ambiguity On-Floor Sign-Off',
    description:
      'Bring homeowners, architects, interior designers, and execution contractors into one calibrated studio environment. Resolve ambiguities in a single working session so construction starts with total alignment.',
    highlights: [
      'Collaborative multi-stakeholder walkthrough sessions',
      'Live markup of wall shifts, electrical points, and clearances',
      'Certified Catch List saving ₹3.5L to ₹15L+ in civil demolition',
    ],
    image: ASSETS.introBlueprint,
    imageAlt: 'Architect and homeowner examining stone and oak material samples over a projected 1:1 floor plan',
  },
];

export interface ComparisonMode {
  id: '2d' | '3d' | '1to1';
  label: string;
  headline: string;
  scalePerception: string;
  clearanceCheck: string;
  stakeholderAlignment: string;
  summary: string;
}

export const COMPARISON_MODES: ComparisonMode[] = [
  {
    id: '2d',
    label: 'Traditional 2D Blueprint',
    headline: 'Flat lines on paper or a screen leave true scale to guesswork.',
    scalePerception: 'Abstract numbers (12 ft × 14 ft) require mental translation.',
    clearanceCheck: 'Tight passages around dining chairs or door swings often go unnoticed.',
    stakeholderAlignment: 'Homeowners and family members interpret drawings differently.',
    summary:
      'Paper plans are essential engineering documents, yet many clients struggle to judge whether a corridor feels generous or cramped until brick walls are already built.',
  },
  {
    id: '3d',
    label: '3D Virtual Render',
    headline: 'Wide-angle camera lenses can distort perceived room proportions.',
    scalePerception: 'Viewed through a rectangular monitor with artificial camera FOV.',
    clearanceCheck: 'Visually appealing, but lacks physical body-scale movement.',
    stakeholderAlignment: 'Helps aesthetic taste, though spatial ergonomics remain virtual.',
    summary:
      'Static renders and flythrough videos showcase mood and finishes well, yet a wide-angle lens frequently makes compact bedrooms appear larger than they feel in person.',
  },
  {
    id: '1to1',
    label: 'Walk The Plan 1:1 Projection',
    headline: 'True physical scale you can step into, measure, and rearrange.',
    scalePerception: 'Actual 1:1 human scale underfoot across our open studio bay.',
    clearanceCheck: 'Walk around real-scale sofa, bed, and dining island mockups.',
    stakeholderAlignment: 'Everyone sees the exact same room together and agrees on Day 1.',
    summary:
      'By projecting your CAD plan at 1:1 scale and placing movable full-size furniture blocks on the floor, you feel every corridor width, kitchen triangle, and sightline physically.',
  },
];

export interface AudienceSolution {
  id: string;
  audience: string;
  headline: string;
  description: string;
  outcomes: string[];
  image: string;
  imageAlt: string;
}

export const AUDIENCE_SOLUTIONS: AudienceSolution[] = [
  {
    id: 'homeowners',
    audience: 'Homeowners',
    headline: 'Understand your future home before a single brick is laid.',
    description:
      'Walk through your residence with your family before construction begins. Feel whether the living-dining flow fits your gatherings, verify master wardrobe clearances, and make confident decisions together.',
    outcomes: [
      'Ensure family consensus before masonry and MEP rough-ins begin',
      'Test bed sizes, dining seating, and kitchen work-aisle comfort',
      'Eliminate mid-construction surprises and stressful civil rework',
    ],
    image: ASSETS.introBlueprint,
    imageAlt: 'Homeowner reviewing a full-scale projected residence layout with an architect',
  },
  {
    id: 'architects',
    audience: 'Architects & Interior Designers',
    headline: 'Accelerate client clarity and protect your design intent.',
    description:
      'Bridge the gap between technical CAD drawings and how clients perceive three-dimensional space. Present your layouts at 1:1 scale to secure decisive client approvals without endless revision cycles.',
    outcomes: [
      'Achieve faster plan freeze with fewer post-drawings disputes',
      'Demonstrate subtle spatial proportions clients miss on 2D sheets',
      'Review furniture layouts, partitions, and door swings live on site',
    ],
    image: ASSETS.vrWalkthrough,
    imageAlt: 'Design team presenting an immersive spatial walkthrough to a residential client',
  },
  {
    id: 'builders',
    audience: 'Builders & Real Estate Developers',
    headline: 'Present upcoming developments with unforgettable spatial conviction.',
    description:
      'Transform flat floor brochures into physical walkthrough experiences for flagship residences, penthouses, and commercial layouts before physical sample flats are ready.',
    outcomes: [
      'Validate typical unit layouts and lobby circulation before casting',
      'Give prospective buyers tangible confidence in carpet area usability',
      'Optimize commercial, retail, and hospitality footfall flow early',
    ],
    image: ASSETS.galleryWarehouse,
    imageAlt: 'Wide architectural warehouse bay projecting a multi-room residential floor plan at 1:1 scale',
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  category: '1:1 Projection Studio' | 'VR Walkthroughs' | '3D Visualization';
  aspect: 'wide' | 'tall' | 'standard';
  caption: string;
  location: string;
  image: string;
  alt: string;
  video?: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Gurugram Flagship 1:1 Studio Bay',
    category: '1:1 Projection Studio',
    aspect: 'wide',
    caption: 'Overhead precision truss array projecting full-scale living, dining, and kitchen CAD footprints onto the studio floor.',
    location: 'Gurugram Flagship',
    image: '/images/studio/gurgaon_studio.png',
    alt: 'Walk The Plan Gurugram Flagship 1:1 floor projection bay with full-scale CAD lines',
  },
  {
    id: 'gal-2',
    title: 'Dehradun Hillside Villa Calibration',
    category: '1:1 Projection Studio',
    aspect: 'tall',
    caption: 'Architects and homeowners verifying partition placement, door swings, and mountain sightlines live on site.',
    location: 'Dehradun Studio',
    image: '/images/studio/dehradun_studio.png',
    alt: 'Walk The Plan Dehradun Studio spatial review session',
  },
  {
    id: 'gal-3',
    title: '2026 Stage 01 Laser Grid Experience',
    category: '1:1 Projection Studio',
    aspect: 'standard',
    caption: 'Precision 2D CAD vectors morphing to 1:1 scale with physical modular furniture props placed on laser boundary lines.',
    location: 'Innovation Lab',
    image: '/images/studio/2026_stage01_poster.png',
    video: '/videos/studio/20261120_212746_0000.mp4',
    alt: 'Walk The Plan 2026 Stage 01 Laser Grid Experience video',
  },
  {
    id: 'gal-4',
    title: 'Hyderabad Tech Hub Layout Review',
    category: 'VR Walkthroughs',
    aspect: 'standard',
    caption: 'Untethered bare-shell walkthroughs and high-rise apartment floor review before civil slab casting.',
    location: 'Hyderabad Studio',
    image: '/images/studio/hyderabad_studio.png',
    alt: 'Walk The Plan Hyderabad Studio review session',
  },
  {
    id: 'gal-5',
    title: 'Varanasi Architectural Consensus Studio',
    category: '3D Visualization',
    aspect: 'wide',
    caption: 'Multi-stakeholder plan freeze session with builders, architects, and families resolving spatial conflicts on Day 1.',
    location: 'Varanasi Studio',
    image: '/images/studio/varanasi_studio.png',
    alt: 'Walk The Plan Varanasi Studio layout freeze session',
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Share Your Plan',
    subtitle: 'PDF, AutoCAD, or DWG Upload',
    description:
      'Submit your architectural floor plan in PDF, CAD, or DWG format 48–72 hours ahead of your scheduled appointment so our engineers can calibrate your vectors.',
  },
  {
    step: '02',
    title: 'We Prepare Your Experience',
    subtitle: 'Pre-Calibrated Before Arrival',
    description:
      'Our spatial team loads your exact drawings onto our overhead projection grid and readies matching bare-shell 3D volumes and real-scale furniture blocks.',
  },
  {
    step: '03',
    title: 'Walk Your Space',
    subtitle: 'Live 1:1 Studio Walkthrough',
    description:
      'Visit your chosen studio in Gurugram, Dehradun, Varanasi, Hyderabad, or Madurai with your family, architect, or contractor to test every room physically.',
  },
  {
    step: '04',
    title: 'Build With Confidence',
    subtitle: 'Day-1 Plan Freeze',
    description:
      'Leave with verified spatial notes, an actionable Catch List, and clear layout refinements to share with your execution team before construction begins.',
  },
];

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  category: string;
  highlight: string;
  videoLabel: string;
  posterImage: string;
}

export const VERIFIED_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'ansa-sapna',
    quote:
      'Walking a residence at 1:1 scale bridges the hardest gap in residential architecture—translating flat 2D technical sheets into unmistakable human-scale perception for our clients.',
    author: 'Sapna Aggarwal',
    role: 'Creative Director',
    organization: 'ANSA Interiors & Architecture',
    category: 'Architectural Collaboration',
    highlight: 'Bridging 2D drawings & real-life perception',
    videoLabel: 'Featured Studio Collaboration Highlight',
    posterImage: ASSETS.introBlueprint,
  },
  {
    id: 'plan-freeze',
    quote:
      'Once families step inside the projected dining and kitchen clearances and move full-scale blocks around, layout questions settle in minutes instead of weeks of drawing revisions.',
    author: 'Walk The Plan Studio Methodology',
    role: 'Pre-Construction Spatial Review',
    organization: 'Residential & Villa Validations',
    category: 'Homeowner & Architect Alignment',
    highlight: 'Plan Freeze on Day 1',
    videoLabel: '1:1 Studio Walkthrough Overview',
    posterImage: ASSETS.heroStudio,
  },
  {
    id: 'commercial-validation',
    quote:
      'Seeing true corridor widths, point-of-sale sightlines, and furniture spacing at full 1:1 scale gives development and design teams clear operational certainty before civil execution.',
    author: 'Walk The Plan Commercial Practice',
    role: 'Retail, Hospitality & Developer Layouts',
    organization: 'Pan-India Studio Network',
    category: 'Commercial & Developer Planning',
    highlight: 'Validated Spatial Circulation',
    videoLabel: 'Commercial Projection Session Preview',
    posterImage: ASSETS.galleryWarehouse,
  },
];
