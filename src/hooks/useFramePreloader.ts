import { useEffect, useRef, useState } from 'react';
import { SITE_CONFIG } from '../config';
import { formatFrameUrl } from '../utils/frameScrubMath';

export interface FramePreloaderState {
  /** Ref holding all 180 HTMLImageElement slots (0-based 0..179) */
  framesRef: React.MutableRefObject<Array<HTMLImageElement | null>>;
  /** Number of frames successfully loaded so far */
  loadedCount: number;
  /** Total configured frames */
  totalFrames: number;
  /** 0..100 percentage toward initial unlock (minReadyFrames) */
  initialProgressPct: number;
  /** 0..100 percentage across the full sequence */
  totalProgressPct: number;
  /** True once >= minReadyFrames (30) have loaded (or poster frame in reduced-motion) */
  isReady: boolean;
  /** Increments on each newly decoded batch so FrameCanvas can repaint if waiting on a frame */
  loadVersion: number;
}

/**
 * Progressively preloads sequential WebP frames into an array of Image objects.
 * Unlocks the experience as soon as >= 30 priority frames are decoded, then streams
 * the remaining frames in polite concurrent batches so the main thread stays at 60fps.
 */
export function useFramePreloader(reducedMotion: boolean): FramePreloaderState {
  const totalFrames: number = SITE_CONFIG.frames.totalFrames;
  const minReadyFrames: number = SITE_CONFIG.frames.minReadyFrames;
  const posterFrameIndex: number = SITE_CONFIG.frames.posterFrameIndex;
  const { basePath, padLength, extension } = SITE_CONFIG.frames;

  const framesRef = useRef<Array<HTMLImageElement | null>>(
    Array.from({ length: totalFrames }, () => null),
  );

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let decodedCount = 0;
    let readyTriggered = false;

    const loadSingleFrame = (zeroIndex: number): Promise<void> =>
      new Promise((resolve) => {
        if (cancelled) {
          resolve();
          return;
        }
        const existing = framesRef.current[zeroIndex];
        if (existing && existing.complete && existing.naturalWidth > 0) {
          resolve();
          return;
        }

        const img = new Image();
        img.decoding = 'async';
        img.src = formatFrameUrl(basePath, zeroIndex + 1, padLength, extension);

        const finalize = (success: boolean) => {
          if (cancelled) {
            resolve();
            return;
          }
          if (success) {
            framesRef.current[zeroIndex] = img;
          }
          decodedCount += 1;
          setLoadedCount(decodedCount);

          const unlockTarget = reducedMotion ? 1 : Math.min(minReadyFrames, totalFrames);
          if (!readyTriggered && decodedCount >= unlockTarget) {
            readyTriggered = true;
            setIsReady(true);
            setLoadVersion((v) => v + 1);
          } else if (decodedCount % 12 === 0 || decodedCount === totalFrames) {
            setLoadVersion((v) => v + 1);
          }
          resolve();
        };

        img.onload = () => finalize(true);
        img.onerror = () => finalize(false);
      });

    const runQueue = async (indices: number[], concurrency: number) => {
      let cursor = 0;
      const worker = async () => {
        while (!cancelled && cursor < indices.length) {
          const idx = indices[cursor];
          cursor += 1;
          await loadSingleFrame(idx);
        }
      };
      await Promise.all(Array.from({ length: concurrency }, () => worker()));
    };

    const start = async () => {
      if (reducedMotion) {
        await loadSingleFrame(posterFrameIndex);
        if (!cancelled) {
          setIsReady(true);
          setLoadVersion((v) => v + 1);
        }
        return;
      }

      // Priority Phase 1: First 30 frames (0..29) + final poster frame (179) so opening & fallback are crisp
      const priorityIndices: number[] = [];
      for (let i = 0; i < Math.min(minReadyFrames, totalFrames); i++) {
        priorityIndices.push(i);
      }
      if (posterFrameIndex >= minReadyFrames && posterFrameIndex < totalFrames) {
        priorityIndices.push(posterFrameIndex);
      }

      await runQueue(priorityIndices, 6);

      if (!cancelled && !readyTriggered) {
        readyTriggered = true;
        setIsReady(true);
        setLoadVersion((v) => v + 1);
      }

      // Background Phase 2: Stream remaining frames sequentially so scrubbing stays ahead of scroll
      const remainingIndices: number[] = [];
      for (let i = minReadyFrames; i < totalFrames; i++) {
        if (i !== posterFrameIndex) {
          remainingIndices.push(i);
        }
      }

      await runQueue(remainingIndices, 4);
    };

    start();

    return () => {
      cancelled = true;
    };
  }, [reducedMotion, totalFrames, minReadyFrames, posterFrameIndex, basePath, padLength, extension]);

  const initialTarget = reducedMotion ? 1 : Math.min(minReadyFrames, totalFrames);
  const initialProgressPct = Math.min(100, Math.round((loadedCount / initialTarget) * 100));
  const totalProgressPct = Math.min(100, Math.round((loadedCount / totalFrames) * 100));

  return {
    framesRef,
    loadedCount,
    totalFrames,
    initialProgressPct,
    totalProgressPct,
    isReady,
    loadVersion,
  };
}
