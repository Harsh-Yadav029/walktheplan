import test from 'node:test';
import assert from 'node:assert/strict';
import { computeFrameAlpha, lerpValue, resolveCursorMode } from './cursorLerp';

test('lerpValue smoothly interpolates toward target', () => {
  assert.equal(lerpValue(0, 100, 0.2), 20);
  assert.equal(lerpValue(20, 100, 0.2), 36);
});

test('computeFrameAlpha scales consistently with frame delta ratio', () => {
  const sixtyFps = computeFrameAlpha(0.15, 1);
  const thirtyFps = computeFrameAlpha(0.15, 2);
  assert.ok(Math.abs(sixtyFps - 0.15) < 1e-9);
  assert.ok(thirtyFps > sixtyFps && thirtyFps < 0.3);
});

test('resolveCursorMode prioritizes explicit View/Explore attributes and interactive tags', () => {
  assert.equal(resolveCursorMode({ explicitCursor: 'View', tagName: 'DIV' }), 'View');
  assert.equal(resolveCursorMode({ explicitCursor: 'Explore', tagName: 'CANVAS' }), 'Explore');
  assert.equal(resolveCursorMode({ tagName: 'INPUT' }), 'muted');
  assert.equal(resolveCursorMode({ tagName: 'SELECT' }), 'muted');
  assert.equal(resolveCursorMode({ tagName: 'BUTTON' }), 'Explore');
  assert.equal(resolveCursorMode({ tagName: 'A' }), 'Explore');
  assert.equal(resolveCursorMode({ tagName: 'DIV', role: 'tab' }), 'Explore');
  assert.equal(resolveCursorMode({ tagName: 'SECTION' }), 'default');
});
