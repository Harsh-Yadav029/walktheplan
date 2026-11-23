import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

// Base Cinematic GSAP Lenis Tokens
export const MOTION_TOKENS = {
  eases: {
    out: 'power3.out',
    editorial: 'power4.out',
    expo: 'expo.out',
  },
  scrub: {
    cinematic: 1.1,
    light: 0.8,
    heavy: 1.4,
  },
  reveals: {
    duration: 0.95,
    minDuration: 0.75,
    maxDuration: 1.1,
  },
  hover: {
    duration: 0.45,
    ease: 'power3.out',
  },
  cursorLag: {
    duration: 0.35,
    ease: 'power3.out',
  },
  stagger: {
    words: 0.055,
    lines: 0.11,
    cards: 0.075,
  },
  trigger: {
    start: 'top 82%',
    anticipatePin: 1,
  },
} as const;

export const revealPresets: Record<
  string,
  { from: gsap.TweenVars; to: gsap.TweenVars }
> = {
  'fade-up': {
    from: { y: 32, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1 },
  },
  'blur-in': {
    from: { y: 18, autoAlpha: 0, filter: 'blur(10px)' },
    to: { y: 0, autoAlpha: 1, filter: 'blur(0px)' },
  },
  scale: {
    from: { scale: 0.96, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1 },
  },
  'slide-left': {
    from: { x: 48, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
  },
  'slide-right': {
    from: { x: -48, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1 },
  },
};

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Split element into individual words wrapped in masks for staggered typography
 */
export function splitWords(element: HTMLElement): void {
  if (element.dataset.motionSplit === 'true') return;

  const text = element.textContent || '';
  const parts = text.split(/(\s+)/);

  element.textContent = '';
  element.setAttribute('aria-label', text.trim());

  let index = 0;
  parts.forEach((part) => {
    if (!part.trim()) {
      element.appendChild(document.createTextNode(part));
      return;
    }

    const mask = document.createElement('span');
    const word = document.createElement('span');

    mask.className = 'motion-word-mask';
    mask.setAttribute('aria-hidden', 'true');
    word.className = 'motion-word';
    word.textContent = part;
    word.style.setProperty('--word-index', String(index));

    mask.appendChild(word);
    element.appendChild(mask);
    index += 1;
  });

  element.dataset.motionSplit = 'true';
}

/**
 * Split element into lines wrapped in masks for editorial headline reveals
 */
export function splitLines(element: HTMLElement): void {
  if (element.dataset.motionLineSplit === 'true') return;
  if (element.querySelector('.motion-line')) return;

  const text = (element.textContent || '').trim();
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return;

  element.textContent = '';
  element.setAttribute('aria-label', text);

  lines.forEach((line) => {
    const mask = document.createElement('span');
    const inner = document.createElement('span');

    mask.className = 'motion-line-mask';
    mask.setAttribute('aria-hidden', 'true');
    inner.className = 'motion-line';
    inner.textContent = line;

    mask.appendChild(inner);
    element.appendChild(mask);
    element.appendChild(document.createTextNode(' '));
  });

  element.dataset.motionLineSplit = 'true';
}

/**
 * Initialize staggered text reveals for data-motion-text="words" and data-motion-text="lines"
 */
export function initTextReveals(scope?: Element | Document): () => void {
  const root = scope || document;
  const reduce = isReducedMotion();

  if (reduce) {
    gsap.set(root.querySelectorAll('[data-motion-text]'), {
      autoAlpha: 1,
      clearProps: 'all',
    });
    return () => {};
  }

  const triggers: ScrollTrigger[] = [];

  // 1. Words
  const wordElements = root.querySelectorAll<HTMLElement>("[data-motion-text='words']");
  wordElements.forEach((element) => {
    splitWords(element);
    const words = element.querySelectorAll('.motion-word');

    gsap.set(element, { autoAlpha: 1 });
    const anim = gsap.fromTo(
      words,
      { yPercent: 110, autoAlpha: 0, filter: 'blur(8px)' },
      {
        yPercent: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: MOTION_TOKENS.reveals.duration,
        ease: MOTION_TOKENS.eases.editorial,
        stagger: MOTION_TOKENS.stagger.words,
        scrollTrigger: {
          trigger: element,
          start: MOTION_TOKENS.trigger.start,
          once: true,
        },
      }
    );
    if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
  });

  // 2. Lines
  const lineElements = root.querySelectorAll<HTMLElement>("[data-motion-text='lines']");
  lineElements.forEach((element) => {
    splitLines(element);
    const lines = element.querySelectorAll('.motion-line');
    const targets = lines.length ? lines : element.children;

    gsap.set(element, { autoAlpha: 1 });
    const anim = gsap.fromTo(
      targets,
      { yPercent: 100, autoAlpha: 0, filter: 'blur(8px)' },
      {
        yPercent: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: MOTION_TOKENS.eases.editorial,
        stagger: MOTION_TOKENS.stagger.lines,
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
          once: true,
        },
      }
    );
    if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
  });

  return () => {
    triggers.forEach((st) => st.kill());
  };
}

/**
 * Initialize scroll reveals for standalone elements and grouped cards
 */
export function initScrollReveals(scope?: Element | Document): () => void {
  const root = scope || document;
  const reduce = isReducedMotion();

  if (reduce) {
    gsap.set(root.querySelectorAll('[data-reveal], [data-reveal-item]'), {
      autoAlpha: 1,
      clearProps: 'all',
    });
    return () => {};
  }

  const triggers: ScrollTrigger[] = [];

  // Reveal Groups (staggered items)
  const groups = root.querySelectorAll<HTMLElement>('[data-reveal-group]');
  groups.forEach((group) => {
    const items = group.querySelectorAll('[data-reveal-item]');
    if (!items.length) return;

    gsap.set(group, { autoAlpha: 1 });
    const anim = gsap.fromTo(
      items,
      { y: 36, autoAlpha: 0, filter: 'blur(8px)' },
      {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: MOTION_TOKENS.reveals.duration,
        ease: MOTION_TOKENS.eases.editorial,
        stagger: MOTION_TOKENS.stagger.cards,
        scrollTrigger: {
          trigger: group,
          start: MOTION_TOKENS.trigger.start,
          once: true,
        },
      }
    );
    if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
  });

  // Standalone Reveals
  const singleReveals = root.querySelectorAll<HTMLElement>(
    '[data-reveal]:not([data-reveal-item])'
  );
  singleReveals.forEach((element) => {
    const presetKey = element.dataset.reveal || 'fade-up';
    const preset = revealPresets[presetKey] || revealPresets['fade-up'];
    const delay = Number(element.dataset.revealDelay || 0);

    gsap.set(element, { autoAlpha: 1 });
    const anim = gsap.fromTo(element, preset.from, {
      ...preset.to,
      duration: MOTION_TOKENS.reveals.duration,
      ease: MOTION_TOKENS.eases.editorial,
      delay,
      scrollTrigger: {
        trigger: element,
        start: 'top 84%',
        once: true,
      },
    });
    if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
  });

  return () => {
    triggers.forEach((st) => st.kill());
  };
}

/**
 * Initialize clip-path image reveals with subtle zoom settling
 */
export function initImageReveals(scope?: Element | Document): () => void {
  const root = scope || document;
  const reduce = isReducedMotion();

  if (reduce) {
    gsap.set(root.querySelectorAll('[data-image-reveal]'), {
      autoAlpha: 1,
      clipPath: 'none',
      clearProps: 'all',
    });
    return () => {};
  }

  const triggers: ScrollTrigger[] = [];

  const figures = root.querySelectorAll<HTMLElement>('[data-image-reveal]');
  figures.forEach((figure) => {
    const media = figure.querySelector<HTMLElement>('img, video');
    gsap.set(figure, { autoAlpha: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: figure,
        start: MOTION_TOKENS.trigger.start,
        once: true,
      },
    });

    tl.fromTo(
      figure,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: MOTION_TOKENS.eases.editorial }
    );

    if (media) {
      tl.fromTo(
        media,
        { scale: 1.08, autoAlpha: 0.75 },
        { scale: 1, autoAlpha: 1, duration: 1.2, ease: MOTION_TOKENS.eases.editorial },
        0
      );
    }

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
  });

  return () => {
    triggers.forEach((st) => st.kill());
  };
}

/**
 * Initialize subtle scrubbed parallax motion on layered elements and backgrounds
 */
export function initParallax(scope?: Element | Document): () => void {
  const root = scope || document;
  if (isReducedMotion()) return () => {};

  const triggers: ScrollTrigger[] = [];

  const layers = root.querySelectorAll<HTMLElement>(
    '[data-parallax-image], [data-parallax-layer]'
  );
  layers.forEach((layer) => {
    const speed = Number(layer.dataset.parallaxSpeed || 0.18);
    const section = layer.closest<HTMLElement>('[data-parallax-section]') || layer;

    const tween = gsap.to(layer, {
      y: () => window.innerHeight * speed * -1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: MOTION_TOKENS.scrub.cinematic,
        invalidateOnRefresh: true,
      },
    });

    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });

  return () => {
    triggers.forEach((st) => st.kill());
  };
}

/**
 * Pinned horizontal gallery track
 */
export function initHorizontalGalleries(scope?: Element | Document): () => void {
  const root = scope || document;
  if (isReducedMotion()) return () => {};

  const triggers: ScrollTrigger[] = [];

  const sections = root.querySelectorAll<HTMLElement>('[data-horizontal-gallery]');
  sections.forEach((section) => {
    const track = section.querySelector<HTMLElement>('[data-horizontal-track]');
    if (!track) return;

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: MOTION_TOKENS.trigger.anticipatePin,
        invalidateOnRefresh: true,
      },
    });

    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });

  return () => {
    triggers.forEach((st) => st.kill());
  };
}

/**
 * Pinned sticky storytelling scene
 */
export function initStoryScenes(scope?: Element | Document): () => void {
  const root = scope || document;
  if (isReducedMotion()) return () => {};

  const triggers: ScrollTrigger[] = [];

  const scenes = root.querySelectorAll<HTMLElement>('[data-story-scene]');
  scenes.forEach((scene) => {
    const panels = scene.querySelectorAll<HTMLElement>('[data-story-panel]');
    if (!panels.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: () => `+=${panels.length * window.innerHeight}`,
        scrub: MOTION_TOKENS.scrub.cinematic,
        pin: true,
        anticipatePin: MOTION_TOKENS.trigger.anticipatePin,
      },
    });

    tl.to(panels, { yPercent: -100 * (panels.length - 1), ease: 'none' });

    const depthElements = scene.querySelectorAll('[data-story-depth]');
    if (depthElements.length) {
      tl.to(depthElements, { yPercent: -16, ease: 'none' }, 0);
    }

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
  });

  return () => {
    triggers.forEach((st) => st.kill());
  };
}

/**
 * Premium Magnetic button and card physics using quickTo
 */
export function initMagnetic(scope?: Element | Document): () => void {
  const root = scope || document;
  if (isReducedMotion() || isTouchDevice()) return () => {};

  const cleanups: (() => void)[] = [];

  const elements = root.querySelectorAll<HTMLElement>('[data-magnetic]');
  elements.forEach((element) => {
    const strength = Number(element.dataset.magnetic || 0.18);
    const xTo = gsap.quickTo(element, 'x', { duration: MOTION_TOKENS.hover.duration, ease: MOTION_TOKENS.hover.ease });
    const yTo = gsap.quickTo(element, 'y', { duration: MOTION_TOKENS.hover.duration, ease: MOTION_TOKENS.hover.ease });

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;

      xTo(x);
      yTo(y);
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerleave', handlePointerLeave);

    cleanups.push(() => {
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerleave', handlePointerLeave);
    });
  });

  return () => {
    cleanups.forEach((c) => c());
  };
}

/**
 * Custom Cursor integration supporting [data-cursor] and [data-cursor-label]
 */
export function initCursor(scope?: Element | Document): () => void {
  const root = scope || document;
  if (isReducedMotion() || isTouchDevice()) return () => {};

  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  if (!cursor) return () => {};

  const label = cursor.querySelector<HTMLElement>('[data-cursor-label]');
  const xTo = gsap.quickTo(cursor, 'x', { duration: MOTION_TOKENS.cursorLag.duration, ease: MOTION_TOKENS.cursorLag.ease });
  const yTo = gsap.quickTo(cursor, 'y', { duration: MOTION_TOKENS.cursorLag.duration, ease: MOTION_TOKENS.cursorLag.ease });

  const handlePointerMove = (event: PointerEvent) => {
    xTo(event.clientX);
    yTo(event.clientY);
  };

  document.addEventListener('pointermove', handlePointerMove);

  const cleanups: (() => void)[] = [
    () => document.removeEventListener('pointermove', handlePointerMove),
  ];

  const targets = root.querySelectorAll<HTMLElement>('[data-cursor-label]');
  targets.forEach((target) => {
    if (cursor.contains(target)) return;

    const handleEnter = () => {
      if (label) label.textContent = target.dataset.cursorLabel || '';
      gsap.to(cursor, { scale: 1.75, duration: MOTION_TOKENS.cursorLag.duration, ease: 'power3.out' });
    };

    const handleLeave = () => {
      if (label) label.textContent = '';
      gsap.to(cursor, { scale: 1, duration: MOTION_TOKENS.cursorLag.duration, ease: 'power3.out' });
    };

    target.addEventListener('pointerenter', handleEnter);
    target.addEventListener('pointerleave', handleLeave);

    cleanups.push(() => {
      target.removeEventListener('pointerenter', handleEnter);
      target.removeEventListener('pointerleave', handleLeave);
    });
  });

  return () => {
    cleanups.forEach((c) => c());
  };
}

/**
 * Subtle pointer-reactive 3D depth movement
 */
export function initMouseParallax(scope?: Element | Document): () => void {
  const root = scope || document;
  if (isReducedMotion() || isTouchDevice()) return () => {};

  const cleanups: (() => void)[] = [];

  const sections = root.querySelectorAll<HTMLElement>('[data-mouse-parallax]');
  sections.forEach((section) => {
    const layers = section.querySelectorAll<HTMLElement>('[data-mouse-depth]');
    const setters = Array.from(layers).map((layer) => ({
      layer,
      depth: Number(layer.dataset.mouseDepth || 0.04),
      xTo: gsap.quickTo(layer, 'x', { duration: 0.8, ease: 'power3.out' }),
      yTo: gsap.quickTo(layer, 'y', { duration: 0.8, ease: 'power3.out' }),
    }));

    const handlePointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      setters.forEach(({ depth, xTo, yTo }) => {
        xTo(x * depth);
        yTo(y * depth);
      });
    };

    const handlePointerLeave = () => {
      setters.forEach(({ xTo, yTo }) => {
        xTo(0);
        yTo(0);
      });
    };

    section.addEventListener('pointermove', handlePointerMove);
    section.addEventListener('pointerleave', handlePointerLeave);

    cleanups.push(() => {
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
    });
  });

  return () => {
    cleanups.forEach((c) => c());
  };
}

/**
 * Master initializer for the Cinematic GSAP Lenis Motion System.
 * Respects init order from specification:
 * 1. Text reveals
 * 2. Scroll reveals
 * 3. Image reveals
 * 4. Parallax
 * 5. Horizontal galleries
 * 6. Story scenes
 * 7. Magnetic interactions
 * 8. Cursor
 * 9. Mouse parallax
 * 10. ScrollTrigger.refresh()
 */
export function initCinematicMotion(scope?: Element | Document | null): () => void {
  if (typeof window === 'undefined') return () => {};

  const root = scope || document;
  if (!isReducedMotion()) {
    document.documentElement.classList.add('has-motion');
  }

  const cleanups: (() => void)[] = [];

  cleanups.push(initTextReveals(root));
  cleanups.push(initScrollReveals(root));
  cleanups.push(initImageReveals(root));
  cleanups.push(initParallax(root));
  cleanups.push(initHorizontalGalleries(root));
  cleanups.push(initStoryScenes(root));
  cleanups.push(initMagnetic(root));
  cleanups.push(initCursor(root));
  cleanups.push(initMouseParallax(root));

  ScrollTrigger.refresh();

  return () => {
    cleanups.forEach((c) => c());
  };
}

/**
 * React Hook for automatically initializing the motion system in a component / page
 * and cleaning it up when unmounted.
 */
export function useCinematicMotion(
  containerRef?: RefObject<HTMLElement | null>,
  deps: unknown[] = []
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const target = containerRef?.current || document;
    let cleanup: (() => void) | undefined;

    // Wrap in gsap.context for complete cleanup
    const ctx = gsap.context(() => {
      cleanup = initCinematicMotion(target);
    }, target as any);

    // Refresh ScrollTrigger after initial DOM/font layout calculations
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 450);
    const timer3 = setTimeout(() => ScrollTrigger.refresh(), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (cleanup) cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
