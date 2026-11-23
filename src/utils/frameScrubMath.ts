import type { StoryChapter } from '../config';

/**
 * Formats a 1-based frame index into a zero-padded URL path.
 * Example: formatFrameUrl('/frames/frame_', 1, 3, '.webp') -> '/frames/frame_001.webp'
 */
export function formatFrameUrl(
  basePath: string,
  frameNumber1Based: number,
  padLength = 3,
  extension = '.webp',
): string {
  const clamped = Math.max(1, Math.round(frameNumber1Based));
  return `${basePath}${String(clamped).padStart(padLength, '0')}${extension}`;
}

/**
 * Maps normalized scroll progress (0..1) cleanly to a 0-based frame index (0..totalFrames-1).
 */
export function progressToFrameIndex(progress: number, totalFrames: number): number {
  if (totalFrames <= 1) return 0;
  const clamped = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  return Math.min(totalFrames - 1, Math.round(clamped * (totalFrames - 1)));
}

/**
 * Resolves the active chapter index (0..chapters.length-1) for a 1-based frame number.
 */
export function getActiveChapterIndex(
  frameNumber1Based: number,
  chapters: readonly StoryChapter[],
): number {
  if (chapters.length === 0) return 0;
  const clamped = Math.max(1, frameNumber1Based);
  const idx = chapters.findIndex(
    (ch) => clamped >= ch.startFrame && clamped <= ch.endFrame,
  );
  if (idx !== -1) return idx;
  return clamped < chapters[0].startFrame ? 0 : chapters.length - 1;
}

/**
 * Computes scroll progress (0..1) targeting the visual sweet spot (~20% inside a chapter)
 * when a user clicks a chapter tick in the vertical ProgressRail.
 */
export function getChapterJumpProgress(
  chapterIndex: number,
  chapters: readonly StoryChapter[],
  totalFrames: number,
): number {
  if (chapters.length === 0 || totalFrames <= 1) return 0;
  const safeIdx = Math.max(0, Math.min(chapters.length - 1, chapterIndex));
  const chapter = chapters[safeIdx];
  const targetFrame1Based =
    safeIdx === 0
      ? 1
      : safeIdx === chapters.length - 1
        ? chapter.endFrame
        : Math.round(chapter.startFrame + (chapter.endFrame - chapter.startFrame) * 0.22);
  return Math.max(0, Math.min(1, (targetFrame1Based - 1) / (totalFrames - 1)));
}

/**
 * Computes cinematic 2.35:1 letterbox intensity (0..1) that gently eases in near chapter boundaries
 * and recedes during steady mid-chapter storytelling.
 */
export function getLetterboxFactor(
  frameNumber1Based: number,
  chapters: readonly StoryChapter[],
  transitionRadiusFrames = 4,
): number {
  if (chapters.length < 2) return 0;
  let peak = 0;
  for (let i = 1; i < chapters.length; i++) {
    const boundary = chapters[i].startFrame;
    const dist = Math.abs(frameNumber1Based - boundary);
    if (dist <= transitionRadiusFrames) {
      const weight = 1 - dist / (transitionRadiusFrames + 1);
      if (weight > peak) peak = weight;
    }
  }
  return Number(peak.toFixed(3));
}

export interface CoverDrawRect {
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
}

/**
 * Calculates exact CSS `object-fit: cover` draw coordinates for `<canvas>`,
 * incorporating optional subtle scroll parallax scale (e.g., 1.00 -> 1.06).
 */
export function computeCoverDrawRect(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
  scale = 1,
): CoverDrawRect {
  if (canvasWidth <= 0 || canvasHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    return { dx: 0, dy: 0, dWidth: 0, dHeight: 0 };
  }

  const canvasAspect = canvasWidth / canvasHeight;
  const imageAspect = imageWidth / imageHeight;

  let baseW: number;
  let baseH: number;

  if (canvasAspect > imageAspect) {
    baseW = canvasWidth;
    baseH = canvasWidth / imageAspect;
  } else {
    baseH = canvasHeight;
    baseW = canvasHeight * imageAspect;
  }

  const dWidth = baseW * scale;
  const dHeight = baseH * scale;
  const dx = (canvasWidth - dWidth) / 2;
  const dy = (canvasHeight - dHeight) / 2;

  return { dx, dy, dWidth, dHeight };
}

/**
 * Finds the closest already-loaded frame image if the user scrubs ahead of background preloading.
 */
export function findNearestLoadedFrame(
  frames: ReadonlyArray<HTMLImageElement | null | undefined>,
  targetIndex: number,
): HTMLImageElement | null {
  const direct = frames[targetIndex];
  if (direct && direct.complete && direct.naturalWidth > 0) {
    return direct;
  }
  for (let offset = 1; offset < frames.length; offset++) {
    const prev = frames[targetIndex - offset];
    if (prev && prev.complete && prev.naturalWidth > 0) return prev;
    const next = frames[targetIndex + offset];
    if (next && next.complete && next.naturalWidth > 0) return next;
  }
  return null;
}
