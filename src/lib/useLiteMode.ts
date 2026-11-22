import { useState, useEffect } from 'react';

export type PerformanceTier = 'high' | 'balanced' | 'lite';

export interface PerformanceMode {
  tier: PerformanceTier;
  isLite: boolean;
  isBalanced: boolean;
  isHigh: boolean;
  reducedMotion: boolean;
  webglSupported: boolean;
}

export function useLiteMode(): PerformanceMode {
  const [tier, setTier] = useState<PerformanceTier>('high');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // 1. Reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hasReducedMotion = motionQuery.matches;
    setReducedMotion(hasReducedMotion);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', onMotionChange);

    // 2. WebGL support check
    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      hasWebGL = false;
    }
    setWebglSupported(hasWebGL);

    if (!hasWebGL || hasReducedMotion) {
      setTier('lite');
      return () => motionQuery.removeEventListener('change', onMotionChange);
    }

    // 3. Hardware & device capability evaluation
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    const nav = navigator as unknown as {
      hardwareConcurrency?: number;
      deviceMemory?: number;
    };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;

    if (isMobile || cores <= 4 || memory <= 4) {
      setTier('balanced');
    } else {
      setTier('high');
    }

    return () => motionQuery.removeEventListener('change', onMotionChange);
  }, []);

  return {
    tier,
    isLite: tier === 'lite',
    isBalanced: tier === 'balanced',
    isHigh: tier === 'high',
    reducedMotion,
    webglSupported,
  };
}
