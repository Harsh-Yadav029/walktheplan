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
    title: '1:1 Floor Plan Projection',
    subtitle: 'Physical Full-Scale Blueprint Walking',
    description:
      'Your CAD or PDF blueprint is projected onto our studio floor at exact 1:1 architectural scale. Walk through every doorway, bedroom, kitchen island, and balcony with movable full-size props before a single foundation trench is excavated.',
    highlights: [
      'Laser-calibrated 1:1 projection across spacious studio bays',
      'Movable full-scale furniture blocks and partition markers',
      'Immediate testing of door swings and circulation clearances',
    ],
    image: ASSETS.heroStudio,
    imageAlt: 'Overhead precision projectors casting a 1:1 architectural floor plan onto the Walk The Plan studio floor',
  },
  {
    number: '02',
    id: 'vr-walkthrough',
    packageId: 'bare-shell-3d-2hr',
    title: 'Virtual Reality Walkthrough',
    subtitle: 'Immersive Volumetric Spatial Exploration',
    description:
      'Pair the physical floor footprint with untethered real-time VR exploration. Step inside bare-shell volumes to evaluate ceiling heights, staircase proportions, window sill depths, and room-to-room sightlines from human eye level.',
    highlights: [
      'Real-time 1:1 eye-level volumetric spatial inspection',
      'Synchronized live studio monitor for family and architects',
      'Early detection of vertical proportions and beam drops',
    ],
    image: ASSETS.vrWalkthrough,
    imageAlt: 'Architect guiding a client through a VR spatial walkthrough beside a calibrated architectural display',
  },
  {
    number: '03',
    id: '3d-visualization',
    packageId: 'interior-exterior-3d-6hr',
    title: '3D Architectural Visualization',
    subtitle: 'Interior & Exterior Design Clarity',
    description:
      'Visualize materiality, natural daylight angles, and custom millwork with photorealistic 3D interior and exterior walkthroughs. Validate marble, wood, and lighting choices alongside your spatial plan before procurement.',
    highlights: [
      'Photorealistic interior and facade lighting studies',
      'Material, texture, and joinery proportion review',
      'Unified visual clarity for fast-track client sign-off',
    ],
    image: ASSETS.interiorRender,
    imageAlt: 'Photorealistic travertine and teak contemporary living and dining visualization with natural daylight',
  },
  {
    number: '04',
    id: 'design-validation',
    packageId: 'bare-shell-3d-2hr',
    title: 'Architectural Design Validation',
    subtitle: 'Collaborative Stakeholder Plan Freeze',
    description:
      'Bring homeowners, architects, interior designers, and execution contractors into one calibrated studio environment. Resolve ambiguities in a single working session so construction starts with total alignment.',
    highlights: [
      'Collaborative multi-stakeholder walkthrough sessions',
      'Live markup of wall shifts, electrical points, and clearances',
      'Actionable spatial review summary for execution teams',
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
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Flagship Laser-Calibrated Studio Bay',
    category: '1:1 Projection Studio',
    aspect: 'wide',
    caption: 'Overhead truss array projecting full-scale living, dining, and kitchen CAD footprints onto the studio floor.',
    location: 'Gurugram Flagship',
    image: ASSETS.galleryWarehouse,
    alt: 'Walk The Plan 1:1 floor projection bay showing full-scale kitchen island and sectional sofa arrangement',
  },
  {
    id: 'gal-2',
    title: 'Real-Scale Furniture & Wall Block Calibration',
    category: '1:1 Projection Studio',
    aspect: 'tall',
    caption: 'Architect and homeowner testing partition placement and stone sample pairings directly on projected floor dimensions.',
    location: 'Studio Validation Session',
    image: ASSETS.introBlueprint,
    alt: 'Architect and client standing on projected floor plan comparing travertine and oak samples',
  },
  {
    id: 'gal-3',
    title: 'Dining & Circulation Clearance Check',
    category: '1:1 Projection Studio',
    aspect: 'standard',
    caption: 'Full-size oak dining table and chairs positioned inside projected boundary lines to verify walkway widths.',
    location: '1:1 Spatial Bay',
    image: ASSETS.heroStudio,
    alt: 'Full-size oak dining table and armchairs aligned over luminous 1:1 architectural blueprint lines',
  },
  {
    id: 'gal-4',
    title: 'Untethered Bare-Shell & Interior VR',
    category: 'VR Walkthroughs',
    aspect: 'standard',
    caption: 'Simultaneous headset walkthrough and calibrated display review for vertical height and daylight verification.',
    location: 'VR Review Lounge',
    image: ASSETS.vrWalkthrough,
    alt: 'Client wearing VR headset reviewing an architectural space with a designer',
  },
  {
    id: 'gal-5',
    title: 'Travertine & Teak Interior Visualization',
    category: '3D Visualization',
    aspect: 'wide',
    caption: 'High-fidelity architectural interior visualization pairing warm natural light with verified spatial geometry.',
    location: '3D Visualization Studio',
    image: ASSETS.interiorRender,
    alt: 'Photorealistic living and dining pavilion interior render with travertine floor and teak paneling',
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
      'Submit your architectural floor plan in PDF, CAD, or DWG format ahead of your scheduled appointment so our engineers can inspect scale calibration.',
  },
  {
    step: '02',
    title: 'We Prepare Your Experience',
    subtitle: 'Pre-Calibrated Before Arrival',
    description:
      'Our spatial team loads your exact drawings onto our overhead projection grid and prepares matching bare-shell 3D volumes and real-scale furniture blocks.',
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
      'Leave with verified spatial notes and clear layout refinements to share with your architect before execution begins on site.',
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
