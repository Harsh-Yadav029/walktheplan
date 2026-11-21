import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAvailableSlots,
  computeSpatialMetrics,
  formatINR,
  getMinimumBookableDate,
  validateBookingInput,
  validateConsultationInput,
} from './bookingLogic';

test('formatINR formats Indian Rupee figures cleanly', () => {
  assert.equal(formatINR(30000), '₹30,000');
  assert.equal(formatINR(40000), '₹40,000');
  assert.equal(formatINR(50000), '₹50,000');
});

test('computeAvailableSlots blocks overlapping bookings and closing-hour overflows', () => {
  const slots = computeAvailableSlots('gurugram', '2026-12-01', 'interior-exterior-3d-6hr', [
    {
      studioId: 'gurugram',
      date: '2026-12-01',
      slotId: 'slot-1000',
      packageId: 'bare-shell-3d-2hr',
    },
  ]);

  const s10 = slots.find((s) => s.id === 'slot-1000');
  const s1130 = slots.find((s) => s.id === 'slot-1130');
  const s1300 = slots.find((s) => s.id === 'slot-1300');
  const s1700 = slots.find((s) => s.id === 'slot-1700');

  assert.equal(s10?.available, false);
  assert.equal(s1130?.available, false);
  assert.equal(s1300?.available, true);
  assert.equal(s1700?.available, false);
});

test('validateBookingInput rejects missing fields and past dates', () => {
  const refDate = new Date('2026-11-19T10:00:00Z');
  const invalid = validateBookingInput(
    {
      studioId: 'gurugram',
      packageId: 'ar-projection-1hr',
      date: '2026-11-18',
      slotId: 'slot-1000',
      customerName: 'A',
      customerEmail: 'bad-email',
      customerPhone: '123',
      projectAreaSqFt: 100,
    },
    refDate
  );

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.date);
  assert.ok(invalid.errors.customerName);
  assert.ok(invalid.errors.customerEmail);
  assert.ok(invalid.errors.customerPhone);
  assert.ok(invalid.errors.projectAreaSqFt);

  const valid = validateBookingInput(
    {
      studioId: 'hyderabad',
      packageId: 'bare-shell-3d-2hr',
      date: getMinimumBookableDate(refDate),
      slotId: 'slot-1130',
      customerName: 'Aarav Mehta',
      customerEmail: 'aarav@example.com',
      customerPhone: '+91 98110 12345',
      customerRole: 'Homeowner',
      blueprintFormat: 'DWG / AutoCAD',
      projectAreaSqFt: 2400,
    },
    refDate
  );

  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('validateConsultationInput validates consultation lead fields', () => {
  const bad = validateConsultationInput({
    fullName: '',
    email: 'nope',
    phone: '99',
    cityId: 'unknown',
    areaSqFt: 50,
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.fullName);
  assert.ok(bad.errors.email);
  assert.ok(bad.errors.phone);
  assert.ok(bad.errors.cityId);
  assert.ok(bad.errors.areaSqFt);

  const good = validateConsultationInput({
    fullName: 'Riya Kapoor',
    email: 'riya@studio.in',
    phone: '9876543210',
    cityId: 'gurugram',
    role: 'Architect',
    projectStage: 'Pre-Construction Validation',
    areaSqFt: 3200,
    timeline: 'Within 1 Month',
  });
  assert.equal(good.valid, true);
});

test('computeSpatialMetrics calculates realistic sq.ft. and clearance', () => {
  const base = computeSpatialMetrics('residence-3bhk', 1);
  const scaled = computeSpatialMetrics('courtyard-villa', 1.2);
  assert.ok(base.totalAreaSqFt > 1700 && base.totalAreaSqFt < 2000);
  assert.ok(base.circulationClearancePct > 50 && base.circulationClearancePct < 90);
  assert.equal(scaled.recommendedStudio, 'Hyderabad or Gurugram Flagship Bay');
});
