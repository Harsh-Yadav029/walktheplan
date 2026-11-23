import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { SITE_CONFIG } from '../config';
import { computeCoverDrawRect, findNearestLoadedFrame } from '../utils/frameScrubMath';

export interface FrameCanvasHandle {
  renderFrame: (force?: boolean) => void;
}

interface FrameCanvasProps {
  framesRef: React.MutableRefObject<Array<HTMLImageElement | null>>;
  /** Imperative ref holding current target frame index (0..179) */
  frameIndexRef: React.MutableRefObject<number>;
  /** Imperative ref holding current normalized scroll progress (0..1) for subtle 1.00 -> 1.06 scale */
  progressRef: React.MutableRefObject<number>;
  /** Reactive trigger whenever newly loaded frame batches arrive from background preloading */
  renderSignal?: number;
  /** Accessible description of the active chapter visual */
  ariaLabel: string;
}

/**
 * Full-viewport DPR-aware `<canvas>` (capped at 2x) rendering sequential WebP frames
 * with exact `object-fit: cover` geometry and subtle 1.00 -> 1.06 scroll parallax.
 *
 * Performance-optimized:
 * - Canvas context and resize listeners are initialized ONCE.
 * - Frame rendering is triggered directly via imperative `renderFrame()` without React re-renders.
 */
export const FrameCanvas = forwardRef<FrameCanvasHandle, FrameCanvasProps>(
  function FrameCanvas(
    { framesRef, frameIndexRef, progressRef, renderSignal, ariaLabel },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastDrawnKeyRef = useRef<string>('');
    const rafIdRef = useRef<number | null>(null);

    const drawCurrentFrame = useCallback((force = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;
      const pixelW = Math.max(1, Math.round(cssW * dpr));
      const pixelH = Math.max(1, Math.round(cssH * dpr));

      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
        force = true;
      }

      const targetIndex = frameIndexRef.current;
      const progress = progressRef.current;
      const scale =
        SITE_CONFIG.frames.scaleFrom +
        (SITE_CONFIG.frames.scaleTo - SITE_CONFIG.frames.scaleFrom) * progress;

      const frameImg = findNearestLoadedFrame(framesRef.current, targetIndex);
      const drawKey = `${targetIndex}:${frameImg?.src ?? 'none'}:${pixelW}x${pixelH}:${scale.toFixed(3)}`;

      if (!force && drawKey === lastDrawnKeyRef.current) {
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#07090C';
      ctx.fillRect(0, 0, cssW, cssH);

      if (frameImg) {
        const imgW = frameImg.naturalWidth || SITE_CONFIG.frames.sourceWidth;
        const imgH = frameImg.naturalHeight || SITE_CONFIG.frames.sourceHeight;
        const rect = computeCoverDrawRect(cssW, cssH, imgW, imgH, scale);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(frameImg, rect.dx, rect.dy, rect.dWidth, rect.dHeight);
        lastDrawnKeyRef.current = drawKey;
      }

      ctx.restore();
    }, [framesRef, frameIndexRef, progressRef]);

    useImperativeHandle(
      ref,
      () => ({
        renderFrame: (force = false) => {
          drawCurrentFrame(force);
        },
      }),
      [drawCurrentFrame]
    );

    // Initial draw and window resize setup (runs once)
    useEffect(() => {
      const scheduleDraw = (force = false) => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          drawCurrentFrame(force);
        });
      };

      scheduleDraw(true);

      const onResize = () => scheduleDraw(true);
      window.addEventListener('resize', onResize, { passive: true });

      return () => {
        window.removeEventListener('resize', onResize);
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, [drawCurrentFrame]);

    // Repaint when background frame preloading delivers newly decoded frames
    useEffect(() => {
      drawCurrentFrame(true);
    }, [renderSignal, drawCurrentFrame]);

    return (
      <div className="absolute inset-0 overflow-hidden bg-[#07090C]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={ariaLabel}
          data-testid="hero-frame-canvas"
          className="block h-full w-full"
        />

        {/* Subtle dark vignette + bottom editorial gradient for crisp typography readability */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 54% 44%, rgba(7, 9, 12, 0.04) 24%, rgba(7, 9, 12, 0.62) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#07090C]/92 via-[#07090C]/48 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07090C]/65 to-transparent"
        />
      </div>
    );
  }
);
