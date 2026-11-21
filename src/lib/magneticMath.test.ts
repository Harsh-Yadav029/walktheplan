import test from 'node:test';
import assert from 'node:assert/strict';
import { computeMagneticOffset } from './magneticMath';

test('returns zero offset when cursor is at element center', () => {
  const result = computeMagneticOffset({
    clientX: 200,
    clientY: 150,
    rectLeft: 100,
    rectTop: 125,
    rectWidth: 200,
    rectHeight: 50,
  });
  assert.deepEqual(result, { x: 0, y: 0 });
});

test('computes proportional offset and compensates for active GSAP transform', () => {
  // Element resting center is (200, 150), currently translated by (+8, +4)
  // so bounding rect shifted to left=108, top=129
  const result = computeMagneticOffset({
    clientX: 240,
    clientY: 165,
    rectLeft: 108,
    rectTop: 129,
    rectWidth: 200,
    rectHeight: 50,
    currentX: 8,
    currentY: 4,
    strength: 0.25,
    maxOffset: 14,
  });
  assert.deepEqual(result, { x: 10, y: 3.75 });
});

test('clamps displacement within maxOffset bounds', () => {
  const result = computeMagneticOffset({
    clientX: 500,
    clientY: -100,
    rectLeft: 100,
    rectTop: 100,
    rectWidth: 120,
    rectHeight: 44,
    strength: 0.5,
    maxOffset: 12,
  });
  assert.deepEqual(result, { x: 12, y: -12 });
});
