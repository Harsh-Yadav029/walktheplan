export interface StudioLocation {
  id: string;
  city: string;
  label: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapCoords: { x: number; y: number };
  baySizeSqFt: number;
  highlights: string[];
}

export interface ServicePackage {
  id: string;
  code: string;
  name: string;
  shortTitle: string;
  durationLabel: string;
  durationHours: number;
  priceInr: number;
  advanceInr: number;
  isPopular?: boolean;
  summary: string;
  deliverables: string[];
}

export interface TimeSlot {
  id: string;
  startHour: number;
  label: string;
}

export interface BookingRecord {
  referenceId: string;
  studioId: string;
  packageId: string;
  date: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerRole: 'Homeowner' | 'Architect' | 'Interior Designer' | 'Builder / Developer';
  blueprintFormat: 'DWG / AutoCAD' | 'PDF Floor Plan' | 'Revit / BIM' | 'Need Design Assistance';
  projectAreaSqFt: number;
  notes?: string;
  totalPriceInr: number;
  advanceAmountInr: number;
  createdAt: string;
}

export interface BookingInput {
  studioId: string;
  packageId: string;
  date: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerRole: BookingRecord['customerRole'];
  blueprintFormat: BookingRecord['blueprintFormat'];
  projectAreaSqFt: number;
  notes?: string;
}

export interface ConsultationInput {
  fullName: string;
  email: string;
  phone: string;
  role: 'Homeowner' | 'Architect' | 'Interior Designer' | 'Builder / Developer';
  cityId: string;
  projectStage: 'Concept / Floor Plan Draft' | 'Pre-Construction Validation' | 'Interior Fit-Out' | 'Commercial / Real Estate Launch';
  areaSqFt: number;
  timeline: 'Within 2 Weeks' | 'Within 1 Month' | '1–3 Months' | 'Exploratory';
  message?: string;
}

export interface SpatialPresetConfig {
  id: 'residence-3bhk' | 'courtyard-villa' | 'studio-penthouse';
  name: string;
  subtitle: string;
  widthMeters: number;
  depthMeters: number;
  wallHeightMeters: number;
  roomCount: number;
  furnitureFootprintSqFt: number;
}

export const BUSINESS_CONTACT = {
  brand: 'Walk The Plan',
  website: 'https://walktheplan.in/',
  phoneDisplay: '+91 97110 22075',
  phoneRaw: '919711022075',
  email: 'info@walktheplan.in',
  hours: 'Monday – Sunday, 10:00 AM – 7:00 PM',
  turnaroundSummary: 'Submit PDF, CAD, or DWG plans ahead of your session for calibrated 1:1 projection readiness.',
};

export const STUDIO_LOCATIONS: StudioLocation[] = [
  {
    id: 'gurugram',
    city: 'Gurugram',
    label: 'National Flagship & Headquarters',
    address: 'Building 328, Sector 19, Udyog Vihar Phase-4, Gurugram, Haryana – 122015',
    phone: '+91 97110 22075',
    email: 'info@walktheplan.in',
    hours: 'Mon – Sun · 10:00 AM – 7:00 PM',
    mapCoords: { x: 37, y: 27 },
    baySizeSqFt: 4500,
    highlights: ['1:1 Laser Projection Bay', 'Real-Scale Modular Furniture Library', 'VR & 3D Review Lounge'],
  },
  {
    id: 'dehradun',
    city: 'Dehradun',
    label: 'Uttarakhand Spatial Studio',
    address: 'Building No. 752, GMS Road, Gram Hari Pur Kanwali, Dehradun, Uttarakhand – 248001',
    phone: '+91 97110 22075',
    email: 'info@walktheplan.in',
    hours: 'Mon – Sun · 10:00 AM – 7:00 PM',
    mapCoords: { x: 42, y: 19 },
    baySizeSqFt: 3200,
    highlights: ['1:1 Floor Plan Projection', 'Hill-Residence Contour Briefing', 'Movable Partition Blocks'],
  },
  {
    id: 'varanasi',
    city: 'Varanasi',
    label: 'Uttar Pradesh Experience Center',
    address: 'Bhairavi Windows, Sarkaripura, Manduadih, Varanasi, Uttar Pradesh – 221103',
    phone: '+91 97110 22075',
    email: 'info@walktheplan.in',
    hours: 'Mon – Sun · 10:00 AM – 7:00 PM',
    mapCoords: { x: 61, y: 36 },
    baySizeSqFt: 3000,
    highlights: ['True-Scale Blueprint Floor', 'Family Design Alignment Room', 'Circulation & Clearance Props'],
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    label: 'Telangana Regional Studio',
    address: 'Krishnareddy Warehouses, Warehouse #2, Rallaguda Road, Shamshabad, Hyderabad, Telangana – 501218',
    phone: '+91 97110 22075',
    email: 'info@walktheplan.in',
    hours: 'Mon – Sun · 10:00 AM – 7:00 PM',
    mapCoords: { x: 43, y: 65 },
    baySizeSqFt: 4800,
    highlights: ['Large-Span Villa Projection', 'Developer Show-Unit Simulation', 'Real-Time Bare-Shell 3D'],
  },
  {
    id: 'madurai',
    city: 'Madurai',
    label: 'Tamil Nadu Studio',
    address: '2-165, AMR Villa 59.T, Kodimangalam, New Natham Road, Thirumalpuram Post, Madurai, Tamil Nadu – 625014',
    phone: '+91 97110 22075',
    email: 'info@walktheplan.in',
    hours: 'Mon – Sun · 10:00 AM – 7:00 PM',
    mapCoords: { x: 42, y: 86 },
    baySizeSqFt: 3400,
    highlights: ['1:1 Floor Plan Projection', 'Door Swing & Passage Testing', 'Architect Client Review Suite'],
  },
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'ar-projection-1hr',
    code: '01',
    name: '1 Hour Projection',
    shortTitle: 'AR-Based 1:1 Floor Plan Projection',
    durationLabel: '1 Hour Studio Session',
    durationHours: 1,
    priceInr: 30000,
    advanceInr: 10000,
    summary:
      'True 1:1 scale floor plan projection where you physically walk through rooms, verify circulation corridors, test furniture footprints, and mark layout changes before masonry begins.',
    deliverables: [
      'Full 1:1 laser-calibrated floor plan projection',
      'Physical placement of real-scale furniture props',
      'Door swing & corridor clearance validation',
      'Annotated layout change summary for your architect',
    ],
  },
  {
    id: 'bare-shell-3d-2hr',
    code: '02',
    name: '2 Hour Projection',
    shortTitle: 'Real-Time Bare-Shell 3D Walkthrough',
    durationLabel: '2 Hour Studio Session',
    durationHours: 2,
    priceInr: 40000,
    advanceInr: 15000,
    isPopular: true,
    summary:
      'Combines full-scale 1:1 floor walking with interactive real-time bare-shell 3D volume exploration so families, architects, and contractors achieve alignment and Day-1 Plan Freeze.',
    deliverables: [
      'Everything in the 1 Hour 1:1 Floor Projection',
      'Real-time interactive bare-shell 3D spatial walkthrough',
      'Ceiling height, window sill & sightline validation',
      'Live multi-stakeholder layout revision review',
    ],
  },
  {
    id: 'interior-exterior-3d-6hr',
    code: '03',
    name: '3–6 Hour Projection',
    shortTitle: 'Interior & Exterior 3D Design Visualization',
    durationLabel: '3–6 Hour Comprehensive Session',
    durationHours: 4,
    priceInr: 50000,
    advanceInr: 20000,
    summary:
      'Comprehensive architectural design validation uniting 1:1 floor projection with photorealistic interior and exterior 3D visualization, lighting mood studies, and material verification.',
    deliverables: [
      'Full 1:1 projection across multi-floor or villa plans',
      'High-detail interior & exterior 3D visualization',
      'Material, daylight & artificial lighting simulation',
      'Complete design freeze dossier for execution teams',
    ],
  },
];

export const STUDIO_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-1000', startHour: 10, label: '10:00 AM' },
  { id: 'slot-1130', startHour: 11.5, label: '11:30 AM' },
  { id: 'slot-1300', startHour: 13, label: '01:00 PM' },
  { id: 'slot-1500', startHour: 15, label: '03:00 PM' },
  { id: 'slot-1700', startHour: 17, label: '05:00 PM' },
];

export const SPATIAL_PRESETS: SpatialPresetConfig[] = [
  {
    id: 'residence-3bhk',
    name: '3BHK Residence',
    subtitle: 'Living, Dining, Kitchen & Primary Suite',
    widthMeters: 14.5,
    depthMeters: 11.8,
    wallHeightMeters: 3.1,
    roomCount: 6,
    furnitureFootprintSqFt: 520,
  },
  {
    id: 'courtyard-villa',
    name: 'Courtyard Villa',
    subtitle: 'Double-Height Pavilion, Dining & Master Wing',
    widthMeters: 18.2,
    depthMeters: 15.6,
    wallHeightMeters: 3.6,
    roomCount: 8,
    furnitureFootprintSqFt: 840,
  },
  {
    id: 'studio-penthouse',
    name: 'Urban Penthouse',
    subtitle: 'Open-Plan Entertaining, Island & Terrace',
    widthMeters: 12.0,
    depthMeters: 9.6,
    wallHeightMeters: 3.3,
    roomCount: 4,
    furnitureFootprintSqFt: 380,
  },
];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppUrl(phoneRaw: string, message: string): string {
  return `https://wa.me/${phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function getMinimumBookableDate(referenceDate: Date = new Date()): string {
  const next = new Date(referenceDate);
  next.setDate(next.getDate() + 1);
  const year = next.getFullYear();
  const month = String(next.getMonth() + 1).padStart(2, '0');
  const day = String(next.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function computeAvailableSlots(
  studioId: string,
  date: string,
  packageId: string,
  existingBookings: Pick<BookingRecord, 'studioId' | 'date' | 'slotId' | 'packageId'>[]
): Array<TimeSlot & { available: boolean; reason?: string }> {
  const pkg = SERVICE_PACKAGES.find((p) => p.id === packageId) ?? SERVICE_PACKAGES[0];
  const closingHour = 19; // 7:00 PM

  const dayBookings = existingBookings.filter(
    (b) => b.studioId === studioId && b.date === date
  );

  return STUDIO_TIME_SLOTS.map((slot) => {
    const endsAfterClose = slot.startHour + pkg.durationHours > closingHour;
    if (endsAfterClose) {
      return {
        ...slot,
        available: false,
        reason: 'Exceeds 7:00 PM closing hours',
      };
    }

    const overlapsExisting = dayBookings.some((b) => {
      const bookedSlot = STUDIO_TIME_SLOTS.find((s) => s.id === b.slotId);
      const bookedPkg = SERVICE_PACKAGES.find((p) => p.id === b.packageId);
      if (!bookedSlot || !bookedPkg) return b.slotId === slot.id;
      const bStart = bookedSlot.startHour;
      const bEnd = bStart + bookedPkg.durationHours;
      const sStart = slot.startHour;
      const sEnd = sStart + pkg.durationHours;
      return sStart < bEnd && sEnd > bStart;
    });

    if (overlapsExisting) {
      return {
        ...slot,
        available: false,
        reason: 'Reserved',
      };
    }

    return {
      ...slot,
      available: true,
    };
  });
}

export function validateBookingInput(
  input: Partial<BookingInput>,
  referenceDate: Date = new Date()
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.studioId || !STUDIO_LOCATIONS.some((s) => s.id === input.studioId)) {
    errors.studioId = 'Please select a verified studio city.';
  }
  if (!input.packageId || !SERVICE_PACKAGES.some((p) => p.id === input.packageId)) {
    errors.packageId = 'Please select a studio session package.';
  }
  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    errors.date = 'Please choose a valid session date.';
  } else {
    const minDate = getMinimumBookableDate(referenceDate);
    if (input.date < minDate) {
      errors.date = `Sessions must be scheduled on or after ${minDate}.`;
    }
  }
  if (!input.slotId || !STUDIO_TIME_SLOTS.some((s) => s.id === input.slotId)) {
    errors.slotId = 'Please choose an available time slot.';
  }
  if (!input.customerName || input.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name.';
  }
  if (!input.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail.trim())) {
    errors.customerEmail = 'Please enter a valid email address.';
  }
  const digits = (input.customerPhone ?? '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.customerPhone = 'Please enter a valid 10–15 digit phone or WhatsApp number.';
  }
  if (!input.projectAreaSqFt || Number(input.projectAreaSqFt) < 300 || Number(input.projectAreaSqFt) > 50000) {
    errors.projectAreaSqFt = 'Enter an approximate project area between 300 and 50,000 sq.ft.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateConsultationInput(
  input: Partial<ConsultationInput>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please provide your name.';
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }
  const digits = (input.phone ?? '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = 'Please provide a valid phone or WhatsApp number.';
  }
  if (!input.cityId || !STUDIO_LOCATIONS.some((s) => s.id === input.cityId)) {
    errors.cityId = 'Please choose your nearest studio city.';
  }
  if (!input.areaSqFt || Number(input.areaSqFt) < 250 || Number(input.areaSqFt) > 100000) {
    errors.areaSqFt = 'Enter project size between 250 and 100,000 sq.ft.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function computeSpatialMetrics(
  presetId: SpatialPresetConfig['id'],
  scaleMultiplier: number = 1
): {
  totalAreaSqFt: number;
  widthFeet: number;
  depthFeet: number;
  circulationClearancePct: number;
  recommendedStudio: string;
} {
  const preset = SPATIAL_PRESETS.find((p) => p.id === presetId) ?? SPATIAL_PRESETS[0];
  const clampedScale = Math.min(1.25, Math.max(0.8, scaleMultiplier));
  const widthM = preset.widthMeters * clampedScale;
  const depthM = preset.depthMeters * clampedScale;
  const sqMeters = widthM * depthM;
  const totalAreaSqFt = Math.round(sqMeters * 10.7639);
  const widthFeet = Math.round(widthM * 3.28084);
  const depthFeet = Math.round(depthM * 3.28084);
  const freeFloor = Math.max(0, totalAreaSqFt - preset.furnitureFootprintSqFt);
  const circulationClearancePct = Math.round((freeFloor / totalAreaSqFt) * 100);
  const recommendedStudio = totalAreaSqFt > 3300 ? 'Hyderabad or Gurugram Flagship Bay' : 'All 5 India Studios';

  return {
    totalAreaSqFt,
    widthFeet,
    depthFeet,
    circulationClearancePct,
    recommendedStudio,
  };
}
