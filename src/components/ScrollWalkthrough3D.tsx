import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned, scroll-scrubbed 3D scene.
 * Lenis drives the scroll position, GSAP ScrollTrigger turns it into a 0..1
 * progress value, and Three.js renders the plan rising into a room while the
 * camera descends from a top-down plan view to eye level and walks inside.
 */

const CAPTIONS = [
  { range: [0, 0.3], kicker: '01 · The Plan', title: 'Lines on paper.', text: 'Your CAD drawing, exactly as your architect drew it.' },
  { range: [0.3, 0.65], kicker: '02 · The Volume', title: 'Walls rise to scale.', text: 'Every wall, door and opening lifted to true 1:1 height.' },
  { range: [0.65, 1.01], kicker: '03 · The Walk', title: 'Now step inside.', text: 'Furniture placed, circulation tested, before masonry starts.' },
] as const;

// Wall segments on the XZ plane: [x1, z1, x2, z2]
const WALLS: [number, number, number, number][] = [
  [-6, -4, 6, -4],
  [6, -4, 6, 4],
  [6, 4, -6, 4],
  [-6, 4, -6, -4],
  [0, -4, 0, -0.9], // interior wall, door gap between z=-0.9 and z=0.9
  [0, 0.9, 0, 4],
];

// Furniture blocks: [x, z, w, d, h, colorHex]
const BLOCKS: [number, number, number, number, number, number][] = [
  [-3.6, 2.6, 2.6, 1, 0.8, 0xb97856], // sofa
  [-3, -0.4, 1.6, 1, 0.45, 0x8d887e], // coffee table
  [3.6, -2.4, 2.2, 2.4, 0.55, 0xe8e3d9], // bed
  [3.4, 3, 2.8, 0.9, 0.9, 0x77746d], // kitchen island
  [-5.2, -2.6, 0.7, 2.6, 1.9, 0x5b574f], // wardrobe
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function ScrollWalkthrough3D() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const host = canvasHostRef.current;
    if (!section || !host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      host.dataset.fallback = 'true';
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#191A18');
    scene.fog = new THREE.Fog('#191A18', 16, 38);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);

    scene.add(new THREE.HemisphereLight(0xdfe6ee, 0x3a342c, 0.7));
    const key = new THREE.DirectionalLight(0xfff0d8, 1.6);
    key.position.set(8, 14, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    scene.add(key);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    // Floor
    const floorMat = track(new THREE.MeshStandardMaterial({ color: 0x2a2b28, roughness: 0.9 }));
    const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(60, 60)), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(60, 60, 0x4a4943, 0x33332f);
    grid.position.y = 0.002;
    scene.add(grid);
    track(grid.geometry as THREE.BufferGeometry);
    track(grid.material as THREE.Material);

    // Blueprint outline (always visible, the "lines on paper" stage)
    const lineMat = track(new THREE.LineBasicMaterial({ color: 0xb97856 }));
    const outline = new THREE.Group();
    WALLS.forEach(([x1, z1, x2, z2]) => {
      const g = track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, 0.02, z1), new THREE.Vector3(x2, 0.02, z2)]));
      outline.add(new THREE.Line(g, lineMat));
    });
    scene.add(outline);

    // Walls, scaled in Y from 0 to full height
    const WALL_H = 3;
    const wallMat = track(new THREE.MeshStandardMaterial({ color: 0xe8e3d9, roughness: 0.85 }));
    const walls: THREE.Mesh[] = [];
    WALLS.forEach(([x1, z1, x2, z2]) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const geo = track(new THREE.BoxGeometry(len, WALL_H, 0.18));
      geo.translate(0, WALL_H / 2, 0); // pivot at the base so scale.y grows upward
      const m = new THREE.Mesh(geo, wallMat);
      m.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
      m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      m.castShadow = true;
      m.receiveShadow = true;
      m.scale.y = 0.001;
      scene.add(m);
      walls.push(m);
    });

    // Furniture, drops in with a small stagger
    const blocks: THREE.Mesh[] = BLOCKS.map(([x, z, w, d, h, color]) => {
      const geo = track(new THREE.BoxGeometry(w, h, d));
      geo.translate(0, h / 2, 0);
      const mat = track(new THREE.MeshStandardMaterial({ color, roughness: 0.7 }));
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, 0, z);
      m.castShadow = true;
      m.receiveShadow = true;
      m.visible = false;
      scene.add(m);
      return m;
    });

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      // Pull the plan view back on narrow screens so the whole plan stays in frame
      camera.userData.portrait = w / h < 0.9;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const lookAt = new THREE.Vector3();
    const state = { target: reduced ? 0.7 : 0, current: reduced ? 0.7 : 0 };

    const apply = (p: number) => {
      // Stage 1 to 2: walls rise
      walls.forEach((w, i) => {
        const local = smooth(0.18 + i * 0.03, 0.55, p);
        w.scale.y = Math.max(0.001, local);
      });
      // Stage 2 to 3: furniture drops in
      blocks.forEach((b, i) => {
        const t = smooth(0.5 + i * 0.05, 0.72 + i * 0.05, p);
        b.visible = t > 0.001;
        b.scale.y = Math.max(0.001, t);
        b.position.y = (1 - t) * 1.4;
      });

      // Camera path: top-down plan, then tilt and descend, then walk through the door gap
      const portraitPull = camera.userData.portrait ? 1.7 : 1;
      const top = new THREE.Vector3(0, 19 * portraitPull, 0.01);
      const iso = new THREE.Vector3(10, 9, 12);
      const eyeStart = new THREE.Vector3(-4.8, 1.65, 3.2);
      const eyeEnd = new THREE.Vector3(2.4, 1.65, 0.4);

      const a = smooth(0.12, 0.5, p);
      const b = smooth(0.62, 1, p);
      const pos = top.clone().lerp(iso, a).lerp(eyeStart, smooth(0.5, 0.7, p)).lerp(eyeEnd, b);
      camera.position.copy(pos);

      const planTarget = new THREE.Vector3(0, 0, 0);
      const eyeTarget = new THREE.Vector3(3.2, 1.2, -1.2).lerp(new THREE.Vector3(5, 1.1, -2.2), b);
      lookAt.copy(planTarget).lerp(eyeTarget, smooth(0.5, 0.7, p));
      camera.lookAt(lookAt);
      camera.fov = 42 + smooth(0.5, 0.8, p) * 18;
      camera.updateProjectionMatrix();

      // Hide ceiling-side clutter of the far wall in iso so the interior reads
      walls[2].visible = !(p > 0.3 && p < 0.65);

      // Captions
      CAPTIONS.forEach((c, i) => {
        const el = captionRefs.current[i];
        if (!el) return;
        const [s, e] = c.range;
        const on = p >= s && p < e;
        el.style.opacity = on ? '1' : '0';
        el.style.transform = on ? 'translateY(0)' : 'translateY(14px)';
      });
      if (barRef.current) barRef.current.style.transform = `scaleX(${clamp01(p)})`;
    };

    apply(state.current);
    renderer.render(scene, camera);

    let st: ScrollTrigger | undefined;
    if (!reduced) {
      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          state.target = self.progress;
        },
      });
    }

    // Render only while the section is on screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(section);

    const tick = () => {
      if (!visible) return;
      // Ease the scene toward the scroll progress so it feels weighty on top of Lenis
      state.current += (state.target - state.current) * 0.12;
      if (Math.abs(state.target - state.current) < 0.0002) state.current = state.target;
      apply(state.current);
      renderer.render(scene, camera);
    };
    if (!reduced) gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st?.kill();
      io.disconnect();
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="walkthrough"
      aria-label="Scroll-driven 3D walkthrough of a floor plan becoming a room"
      className="relative h-screen w-full overflow-hidden bg-[#191A18] text-white"
    >
      <div ref={canvasHostRef} className="absolute inset-0" data-cursor="drag" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#191A18]/80 via-transparent to-[#191A18]/40" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[1360px] px-5 pb-14 md:px-10 md:pb-20">
        <div className="relative h-44 md:h-40">
          {CAPTIONS.map((c, i) => (
            <div
              key={c.kicker}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="absolute inset-x-0 bottom-0 max-w-xl transition-[opacity,transform] duration-500 ease-out"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#B97856]">{c.kicker}</p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em]">{c.title}</h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-[#E8E3D9]/85 md:text-base">{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[2px] bg-white/10" aria-hidden="true">
        <div ref={barRef} className="h-full w-full origin-left bg-[#B97856]" style={{ transform: 'scaleX(0)' }} />
      </div>
    </section>
  );
}
