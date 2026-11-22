import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {
  BUSINESS_CONTACT,
  SERVICE_PACKAGES,
  STUDIO_LOCATIONS,
  computeAvailableSlots,
  validateBookingInput,
  validateConsultationInput,
  type BookingInput,
  type BookingRecord,
  type ConsultationInput,
} from './src/lib/bookingLogic.ts';
import { STUDIO_GALLERY_ITEMS } from './src/data/galleryContent.ts';

interface ConsultationRecord extends ConsultationInput {
  id: string;
  createdAt: string;
}

interface PersistedStore {
  bookings: BookingRecord[];
  consultations: ConsultationRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'walktheplan.json');

function loadStore(): PersistedStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<PersistedStore>;
      return {
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
        consultations: Array.isArray(parsed.consultations) ? parsed.consultations : [],
      };
    }
  } catch (err) {
    console.warn('Failed to load persisted store, initializing clean store:', err);
  }
  return { bookings: [], consultations: [] };
}

function saveStore(store: PersistedStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store:', err);
  }
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT ?? 3000);
  const store = loadStore();

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'walktheplan-api' });
  });

  app.get('/api/config', (_req, res) => {
    res.json({
      contact: BUSINESS_CONTACT,
      studios: STUDIO_LOCATIONS,
      packages: SERVICE_PACKAGES,
    });
  });

  app.get('/api/gallery', (_req, res) => {
    res.json(STUDIO_GALLERY_ITEMS);
  });

  app.get('/api/availability', (req, res) => {
    const studioId = String(req.query.studioId ?? 'gurugram');
    const date = String(req.query.date ?? '');
    const packageId = String(req.query.packageId ?? 'bare-shell-3d-2hr');

    if (!STUDIO_LOCATIONS.some((s) => s.id === studioId)) {
      return res.status(400).json({ error: 'Unknown studio location.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Valid YYYY-MM-DD date is required.' });
    }

    const slots = computeAvailableSlots(studioId, date, packageId, store.bookings);
    return res.json({ studioId, date, packageId, slots });
  });

  app.get('/api/bookings', (_req, res) => {
    res.json({
      count: store.bookings.length,
      bookings: store.bookings.map((b) => ({
        referenceId: b.referenceId,
        studioId: b.studioId,
        packageId: b.packageId,
        date: b.date,
        slotId: b.slotId,
        createdAt: b.createdAt,
      })),
    });
  });

  app.post('/api/bookings', (req, res) => {
    const payload = req.body as Partial<BookingInput>;
    const validation = validateBookingInput(payload);

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Please check the highlighted booking fields.',
        errors: validation.errors,
      });
    }

    const slots = computeAvailableSlots(
      payload.studioId!,
      payload.date!,
      payload.packageId!,
      store.bookings
    );
    const chosenSlot = slots.find((s) => s.id === payload.slotId);
    if (!chosenSlot || !chosenSlot.available) {
      return res.status(409).json({
        error: 'The selected time slot is no longer available. Please choose another slot.',
        errors: { slotId: chosenSlot?.reason ?? 'Slot unavailable' },
      });
    }

    const pkg = SERVICE_PACKAGES.find((p) => p.id === payload.packageId)!;
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const dateCompact = payload.date!.replace(/-/g, '');
    const referenceId = `WTP-${dateCompact}-${suffix}`;

    const record: BookingRecord = {
      referenceId,
      studioId: payload.studioId!,
      packageId: payload.packageId!,
      date: payload.date!,
      slotId: payload.slotId!,
      customerName: payload.customerName!.trim(),
      customerEmail: payload.customerEmail!.trim(),
      customerPhone: payload.customerPhone!.trim(),
      customerRole: payload.customerRole ?? 'Homeowner',
      blueprintFormat: payload.blueprintFormat ?? 'DWG / AutoCAD',
      projectAreaSqFt: Number(payload.projectAreaSqFt),
      notes: payload.notes?.trim() || undefined,
      totalPriceInr: pkg.priceInr,
      advanceAmountInr: pkg.advanceInr,
      createdAt: new Date().toISOString(),
    };

    store.bookings.push(record);
    saveStore(store);

    return res.status(201).json({
      booking: record,
      studio: STUDIO_LOCATIONS.find((s) => s.id === record.studioId),
      package: pkg,
    });
  });

  app.post('/api/consultations', (req, res) => {
    const payload = req.body as Partial<ConsultationInput>;
    const validation = validateConsultationInput(payload);

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Please check the consultation form fields.',
        errors: validation.errors,
      });
    }

    const id = `CNS-${Date.now().toString(36).toUpperCase()}`;
    const record: ConsultationRecord = {
      id,
      fullName: payload.fullName!.trim(),
      email: payload.email!.trim(),
      phone: payload.phone!.trim(),
      role: payload.role ?? 'Homeowner',
      cityId: payload.cityId!,
      projectStage: payload.projectStage ?? 'Pre-Construction Validation',
      areaSqFt: Number(payload.areaSqFt),
      timeline: payload.timeline ?? 'Within 1 Month',
      message: payload.message?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    store.consultations.push(record);
    saveStore(store);

    return res.status(201).json({
      consultation: record,
      studio: STUDIO_LOCATIONS.find((s) => s.id === record.cityId),
    });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Walk The Plan server listening on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
