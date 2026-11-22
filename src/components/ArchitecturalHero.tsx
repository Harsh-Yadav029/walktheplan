import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useTransitionTo } from './PageTransition';
import { useLiteMode } from '../lib/useLiteMode';
import { VideoStory } from './VideoStory';
import './cinematic.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// DESIGN SYSTEM TOKENS (Graphite & Copper)
// ============================================
const PALETTE = {
  graphite950: '#121314',
  graphite900: '#181A1B',
  graphite800: '#202223',
  graphite700: '#2A2D2E',
  graphite600: '#303332',
  copper500: '#C47B52',
  copper600: '#A85E43',
  terracotta: '#A85E43',
  cream: '#F2EDE5',
  silver: '#A5A7A4',
  silverMuted: '#6B6E6D',
};

// ============================================
// CHAPTER SPECIFICATIONS
// ============================================
interface ChapterData {
  id: number;
  number: string;
  range: [number, number];
  title: string;
  tagline: string;
  description: string;
  kicker: string;
  techTelemetry: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    number: '01',
    range: [0, 0.18],
    title: 'Blueprint Awakening',
    tagline: 'Precision 2D CAD Vectors',
    description:
      'Laser-calibrated architectural lines draw across a dark graphite void. Exact dimensional markers define the perimeter before physical geometry emerges.',
    kicker: 'CHAPTER 01 · 2D VECTOR GENERATION',
    techTelemetry: 'LAYER: DWG_BASE · SCALE: 1:100 · PROJECTION: ORTHO',
  },
  {
    id: 2,
    number: '02',
    range: [0.18, 0.38],
    title: 'Architectural Extrusion',
    tagline: 'True 1:1 Scale Volumetric Rise',
    description:
      'Walls rise smoothly to 3.2m true ceiling height. Luminous copper edge chamfers highlight structural boundaries, door lintels, and room partitions.',
    kicker: 'CHAPTER 02 · VOLUMETRIC EXTRUSION',
    techTelemetry: 'WALL_HEIGHT: 3.20M · EDGES: COPPER_EMISSIVE · CAM: 45° ISO',
  },
  {
    id: 3,
    number: '03',
    range: [0.38, 0.65],
    title: 'Spatial Visualization',
    tagline: 'Tactile Materials & Human Eye Level',
    description:
      'White oak timber flooring, fluted travertine island, and warm directional daylight populate the space. The camera glides down to natural eye level.',
    kicker: 'CHAPTER 03 · TACTILE PHOTOMETRICS',
    techTelemetry: 'PBR: HONED_TRAVERTINE + OAK · IOR: 1.52 · CAM: 1.70M EYE',
  },
  {
    id: 4,
    number: '04',
    range: [0.65, 0.85],
    title: 'Real Scale Projection',
    tagline: '1:1 Studio Floor Laser Simulation',
    description:
      'The architecture translates directly onto our physical studio floor. Overhead projector light cones cast the 1:1 floor plan around a 1:1 human scale figure.',
    kicker: 'CHAPTER 04 · PHYSICAL STUDIO SIMULATION',
    techTelemetry: 'BAY: GURUGRAM_STUDIO_A · PROJECTORS: 4X VOLUMETRIC · HUMAN: 1.75M',
  },
  {
    id: 5,
    number: '05',
    range: [0.85, 1.0],
    title: "Don't just imagine it. Walk it.",
    tagline: 'Absolute Certainty Before Construction',
    description:
      'Step inside your future architectural layouts at actual 1:1 scale before construction begins across Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.',
    kicker: 'CHAPTER 05 · THE DEFINITIVE WALKTHROUGH',
    techTelemetry: 'STATUS: READY FOR LIVE SESSION · SCALE: 1:1 VERIFIED',
    ctaPrimary: 'Book Your Experience',
    ctaSecondary: 'Explore Our Technology',
  },
];

// ============================================
// CAMERA KEYFRAME TRACKS
// ============================================
interface CameraTrackKey {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}

const CAMERA_TRACKS: Record<number, CameraTrackKey> = {
  0: { pos: [0, 24, 0.01], target: [0, 0, 0], fov: 42 },
  1: { pos: [14, 15, 14], target: [0, 1.2, 0], fov: 44 },
  2: { pos: [-3.8, 1.72, 4.2], target: [2.2, 1.2, -1.2], fov: 52 },
  3: { pos: [0, 18, 12], target: [0, 0.2, -1], fov: 42 },
  4: { pos: [0, 1.7, 5.5], target: [0, 1.3, -3], fov: 55 },
};

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// CAD Wall Data: [x1, z1, x2, z2]
interface CadSegment {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  thickness: number;
  height: number;
}

const CAD_WALLS: CadSegment[] = [
  // Outer perimeter
  { x1: -7, z1: -4.5, x2: 7, z2: -4.5, thickness: 0.22, height: 3.2 },
  { x1: 7, z1: -4.5, x2: 7, z2: 4.5, thickness: 0.22, height: 3.2 },
  { x1: 7, z1: 4.5, x2: -7, z2: 4.5, thickness: 0.22, height: 3.2 },
  { x1: -7, z1: 4.5, x2: -7, z2: -4.5, thickness: 0.22, height: 3.2 },
  // Interior partitions
  { x1: 0, z1: -4.5, x2: 0, z2: -1.0, thickness: 0.18, height: 3.2 },
  { x1: 0, z1: 1.0, x2: 0, z2: 4.5, thickness: 0.18, height: 3.2 },
  { x1: -4.2, z1: -2.5, x2: -4.2, z2: 1.8, thickness: 0.18, height: 3.2 },
  { x1: 4.0, z1: -0.5, x2: 4.0, z2: 3.8, thickness: 0.18, height: 3.2 },
];

function createCadLine(p1: [number, number, number], p2: [number, number, number], color: string, opacity: number) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(...p1),
    new THREE.Vector3(...p2),
  ]);
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    toneMapped: false,
  });
  return new THREE.Line(geo, mat);
}

// ============================================
// 3D SCENE COMPONENT (R3F)
// ============================================
interface SceneProps {
  progressRef: React.MutableRefObject<number>;
  tier: 'high' | 'balanced' | 'lite';
}

function ArchitecturalScene({ progressRef, tier }: SceneProps) {
  const { scene, camera, size } = useThree();
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentFov = useRef(42);

  // Group references
  const blueprintGroup = useRef<THREE.Group>(null!);
  const wallsGroup = useRef<THREE.Group>(null!);
  const materialsGroup = useRef<THREE.Group>(null!);
  const studioGroup = useRef<THREE.Group>(null!);
  const finalInteriorGroup = useRef<THREE.Group>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const projectorConesRef = useRef<THREE.Group>(null!);
  const humanRef = useRef<THREE.Group>(null!);

  const isHigh = tier === 'high';

  useEffect(() => {
    // ----------------------------------------
    // A. CHAPTER 1: Blueprint CAD lines & Dimensions
    // ----------------------------------------
    const bpGroup = new THREE.Group();
    blueprintGroup.current = bpGroup;
    scene.add(bpGroup);

    // Grid baseline
    const gridHelper = new THREE.GridHelper(30, 60, PALETTE.copper500, PALETTE.graphite700);
    gridHelper.position.y = 0.01;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    bpGroup.add(gridHelper);

    // Wall blueprint outlines
    CAD_WALLS.forEach((w) => {
      const line = createCadLine([w.x1, 0.03, w.z1], [w.x2, 0.03, w.z2], PALETTE.copper500, 0.95);
      bpGroup.add(line);
    });

    // Dimension lines & tick marks
    const dimLines: [[number, number, number], [number, number, number]][] = [
      [[-7, 0.04, -5.3], [7, 0.04, -5.3]], // Width: 14.00m
      [[7.8, 0.04, -4.5], [7.8, 0.04, 4.5]], // Length: 9.00m
      [[-7.8, 0.04, -4.5], [-7.8, 0.04, 4.5]],
    ];

    dimLines.forEach(([p1, p2]) => {
      const line = createCadLine(p1, p2, PALETTE.copper500, 0.7);
      bpGroup.add(line);

      // Ticks at ends
      const tick1 = createCadLine(
        [p1[0], 0.04, p1[2] - 0.25],
        [p1[0], 0.04, p1[2] + 0.25],
        PALETTE.copper500,
        0.85
      );
      const tick2 = createCadLine(
        [p2[0], 0.04, p2[2] - 0.25],
        [p2[0], 0.04, p2[2] + 0.25],
        PALETTE.copper500,
        0.85
      );
      bpGroup.add(tick1);
      bpGroup.add(tick2);
    });

    // Floating subtle particles
    const particleCount = isHigh ? 750 : 350;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 12 * Math.sqrt(Math.random());
      const th = Math.random() * Math.PI * 2;
      pPos[i * 3] = r * Math.cos(th);
      pPos[i * 3 + 1] = 0.5 + Math.random() * 6.5;
      pPos[i * 3 + 2] = r * Math.sin(th);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(PALETTE.copper500),
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    particlesRef.current = particles;
    scene.add(particles);

    // ----------------------------------------
    // B. CHAPTER 2: Architectural Extruded Walls
    // ----------------------------------------
    const wGroup = new THREE.Group();
    wallsGroup.current = wGroup;
    scene.add(wGroup);

    const wallPbrMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.cream),
      roughness: 0.88,
      metalness: 0.02,
    });

    const copperEdgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(PALETTE.copper500),
      transparent: true,
      opacity: 0.85,
    });

    CAD_WALLS.forEach((w) => {
      const len = Math.hypot(w.x2 - w.x1, w.z2 - w.z1);
      const cx = (w.x1 + w.x2) / 2;
      const cz = (w.z1 + w.z2) / 2;
      const angle = -Math.atan2(w.z2 - w.z1, w.x2 - w.x1);

      const bGeo = new THREE.BoxGeometry(len, w.height, w.thickness);
      bGeo.translate(0, w.height / 2, 0);

      const wallMesh = new THREE.Mesh(bGeo, wallPbrMat);
      wallMesh.position.set(cx, 0, cz);
      wallMesh.rotation.y = angle;
      wallMesh.castShadow = isHigh;
      wallMesh.receiveShadow = isHigh;
      wallMesh.scale.y = 0.001;
      wGroup.add(wallMesh);

      const eGeo = new THREE.EdgesGeometry(bGeo);
      const edgeMesh = new THREE.LineSegments(eGeo, copperEdgeMat);
      edgeMesh.position.set(cx, 0, cz);
      edgeMesh.rotation.y = angle;
      edgeMesh.scale.y = 0.001;
      wGroup.add(edgeMesh);
    });

    // ----------------------------------------
    // C. CHAPTER 3: Materials & Furniture
    // ----------------------------------------
    const matGroup = new THREE.Group();
    matGroup.visible = false;
    materialsGroup.current = matGroup;
    scene.add(matGroup);

    // Chevron Wood Parquet Floor
    const floorGeo = new THREE.PlaneGeometry(14, 9);
    floorGeo.rotateX(-Math.PI / 2);
    const floorPbr = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D9C3A5'),
      roughness: 0.42,
      metalness: 0.08,
    });
    const woodFloor = new THREE.Mesh(floorGeo, floorPbr);
    woodFloor.position.set(0, 0.015, 0);
    woodFloor.receiveShadow = true;
    matGroup.add(woodFloor);

    // Sectional Bouclé Sofa
    const sofaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D8D3CB'),
      roughness: 0.9,
      metalness: 0.02,
    });
    const sofaBaseGeo = new THREE.BoxGeometry(3.4, 0.45, 1.1);
    sofaBaseGeo.translate(0, 0.225, 0);
    const sofaBase = new THREE.Mesh(sofaBaseGeo, sofaMat);
    sofaBase.position.set(-3.2, 0, 2.2);
    sofaBase.castShadow = true;
    matGroup.add(sofaBase);

    const sofaBackGeo = new THREE.BoxGeometry(3.4, 0.4, 0.3);
    sofaBackGeo.translate(0, 0.6, 0);
    const sofaBack = new THREE.Mesh(sofaBackGeo, sofaMat);
    sofaBack.position.set(-3.2, 0, 2.6);
    sofaBack.castShadow = true;
    matGroup.add(sofaBack);

    // Fluted Travertine Island
    const islandGeo = new THREE.BoxGeometry(3.0, 0.92, 1.2);
    islandGeo.translate(0, 0.46, 0);
    const islandMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E3DACD'),
      roughness: 0.38,
      metalness: 0.12,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.set(3.4, 0, 1.8);
    island.castShadow = true;
    matGroup.add(island);

    // Architectural Coffee Table
    const tableMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.copper500),
      roughness: 0.3,
      metalness: 0.65,
    });
    const tableGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.38, 32);
    tableGeo.translate(0, 0.19, 0);
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(-3.2, 0, 0.6);
    table.castShadow = true;
    matGroup.add(table);

    // Minimal Copper Floor Lamp
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.9, 16),
      new THREE.MeshStandardMaterial({ color: PALETTE.copper500, metalness: 0.8, roughness: 0.2 })
    );
    lampStem.position.set(-5.4, 0.95, 2.2);
    matGroup.add(lampStem);

    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.28, 24, 1, true),
      new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: 0.5 })
    );
    lampShade.position.set(-5.4, 1.85, 2.2);
    matGroup.add(lampShade);

    // ----------------------------------------
    // D. CHAPTER 4: 1:1 Studio Floor & Light Cones
    // ----------------------------------------
    const sGroup = new THREE.Group();
    sGroup.visible = false;
    studioGroup.current = sGroup;
    scene.add(sGroup);

    // Studio dark reflective floor
    const studioFloorGeo = new THREE.PlaneGeometry(38, 38);
    studioFloorGeo.rotateX(-Math.PI / 2);
    const studioFloorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PALETTE.graphite800),
      roughness: 0.45,
      metalness: 0.25,
    });
    const studioFloor = new THREE.Mesh(studioFloorGeo, studioFloorMat);
    studioFloor.position.y = 0;
    studioFloor.receiveShadow = true;
    sGroup.add(studioFloor);

    // 1:1 Projected Floor Plan (Emissive copper lines on the floor)
    CAD_WALLS.forEach((w) => {
      const line = createCadLine([w.x1, 0.02, w.z1], [w.x2, 0.02, w.z2], PALETTE.copper500, 0.95);
      sGroup.add(line);
    });

    // 4 Projector Volumetric Light Cones
    const pCones = new THREE.Group();
    projectorConesRef.current = pCones;
    sGroup.add(pCones);

    const coneMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(PALETTE.copper500),
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const projectorCoords: [number, number, number][] = [
      [-6, 6.5, -4],
      [6, 6.5, -4],
      [6, 6.5, 4],
      [-6, 6.5, 4],
    ];

    projectorCoords.forEach(([px, py, pz]) => {
      const cGeo = new THREE.ConeGeometry(4.5, py, 24, 1, true);
      cGeo.translate(0, -py / 2, 0);
      const cone = new THREE.Mesh(cGeo, coneMat);
      cone.position.set(px, py, pz);
      pCones.add(cone);

      const housing = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.35, 0.8),
        new THREE.MeshStandardMaterial({ color: PALETTE.graphite950, metalness: 0.8, roughness: 0.3 })
      );
      housing.position.set(px, py, pz);
      pCones.add(housing);
    });

    // 1:1 Scale Human Silhouette Figure (1.75m tall)
    const hGroup = new THREE.Group();
    humanRef.current = hGroup;
    hGroup.position.set(0, 0, -0.6);
    sGroup.add(hGroup);

    const humanMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(PALETTE.copper500),
      transparent: true,
      opacity: 0.85,
    });

    const hHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), humanMat);
    hHead.position.set(0, 1.63, 0);
    hGroup.add(hHead);

    const hTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.58, 16), humanMat);
    hTorso.position.set(0, 1.15, 0);
    hGroup.add(hTorso);

    const hLegGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.85, 12);
    const hLeg1 = new THREE.Mesh(hLegGeo, humanMat);
    hLeg1.position.set(-0.09, 0.43, 0);
    const hLeg2 = new THREE.Mesh(hLegGeo, humanMat);
    hLeg2.position.set(0.09, 0.43, 0);
    hGroup.add(hLeg1);
    hGroup.add(hLeg2);

    // ----------------------------------------
    // E. CHAPTER 5: Final Luxury Interior Finish
    // ----------------------------------------
    const fGroup = new THREE.Group();
    fGroup.visible = false;
    finalInteriorGroup.current = fGroup;
    scene.add(fGroup);

    // Glass curtain wall with realistic transmission
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D8EEF8'),
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.2,
      depthWrite: false,
    });
    const glassWindow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.2, 8.8), glassMat);
    glassWindow.position.set(7.0, 1.6, 0);
    fGroup.add(glassWindow);

    // ----------------------------------------
    // F. Architectural Lighting Rig
    // ----------------------------------------
    const hemiLight = new THREE.HemisphereLight(0xF5E6D3, 0x181A1B, 0.7);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFE5C8, 2.2);
    sunLight.position.set(12, 18, 9);
    sunLight.castShadow = isHigh;
    if (isHigh) {
      sunLight.shadow.mapSize.set(2048, 2048);
      sunLight.shadow.bias = -0.0006;
      sunLight.shadow.camera.left = -12;
      sunLight.shadow.camera.right = 12;
      sunLight.shadow.camera.top = 12;
      sunLight.shadow.camera.bottom = -12;
      sunLight.shadow.camera.near = 2;
      sunLight.shadow.camera.far = 45;
    }
    scene.add(sunLight);

    const interiorWarmLight = new THREE.PointLight(0xFFB070, 1.6, 12);
    interiorWarmLight.position.set(-3.2, 2.7, 1.5);
    scene.add(interiorWarmLight);

    const ambientLight = new THREE.AmbientLight(0x2A2D2E, 0.4);
    scene.add(ambientLight);

    scene.fog = new THREE.Fog(PALETTE.graphite900, 14, 48);
    scene.background = new THREE.Color(PALETTE.graphite900);

    return () => {
      scene.remove(bpGroup);
      scene.remove(wGroup);
      scene.remove(matGroup);
      scene.remove(sGroup);
      scene.remove(fGroup);
      scene.remove(particles);
      scene.remove(hemiLight);
      scene.remove(sunLight);
      scene.remove(interiorWarmLight);
      scene.remove(ambientLight);
    };
  }, [scene, isHigh]);

  // Frame Animation Loop (Ref-driven, 60fps+)
  useFrame((state) => {
    const p = progressRef.current;
    const time = state.clock.getElapsedTime();

    // 1. Floating particles motion
    if (particlesRef.current && p < 0.4) {
      particlesRef.current.rotation.y = time * 0.02;
    }

    // 2. Chapter 1: Blueprint lines reveal (always visible initially at p=0)
    if (blueprintGroup.current) {
      blueprintGroup.current.visible = p < 0.55;
      blueprintGroup.current.children.forEach((child, i) => {
        if (child instanceof THREE.Line) {
          const delay = i * 0.015;
          const factor = Math.max(0.25, smoothstep(delay, 0.16 + delay, p));
          child.scale.x = factor;
          child.scale.z = factor;
        }
      });
    }

    // 3. Chapter 2: Wall Extrusion (0.18 - 0.38)
    if (wallsGroup.current) {
      const inCh2AndBeyond = p >= 0.16;
      wallsGroup.current.visible = inCh2AndBeyond && p < 0.88;
      const wallRise = smoothstep(0.18, 0.38, p);
      wallsGroup.current.children.forEach((child) => {
        child.scale.y = Math.max(0.001, wallRise);
      });
    }

    // 4. Chapter 3: Materials & Furniture (0.38 - 0.65)
    if (materialsGroup.current) {
      const inCh3 = p >= 0.36 && p < 0.72;
      materialsGroup.current.visible = inCh3;
      if (inCh3) {
        const matProgress = smoothstep(0.38, 0.55, p);
        materialsGroup.current.position.y = (1 - matProgress) * 0.5;
      }
    }

    // 5. Chapter 4: Studio Floor & Projector Cones (0.65 - 0.85)
    const inCh4 = p >= 0.62 && p < 0.88;
    if (studioGroup.current) {
      studioGroup.current.visible = inCh4;
      if (inCh4 && projectorConesRef.current) {
        const coneFade = smoothstep(0.65, 0.75, p);
        projectorConesRef.current.children.forEach((c) => {
          if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshBasicMaterial) {
            c.material.opacity = 0.13 * coneFade;
          }
        });
      }
      if (humanRef.current) {
        humanRef.current.position.x = Math.sin(time * 0.8) * 0.08;
      }
    }

    // 6. Chapter 5: Final Luxury Reveal (0.85 - 1.00)
    if (finalInteriorGroup.current) {
      const inCh5 = p >= 0.84;
      finalInteriorGroup.current.visible = inCh5;
    }

    // 7. Filmic Camera Keyframe Interpolation
    let camT = 0;
    let kStart: CameraTrackKey;
    let kEnd: CameraTrackKey;

    if (p < 0.18) {
      camT = smoothstep(0, 0.18, p);
      kStart = CAMERA_TRACKS[0];
      kEnd = CAMERA_TRACKS[1];
    } else if (p < 0.4) {
      camT = smoothstep(0.18, 0.4, p);
      kStart = CAMERA_TRACKS[1];
      kEnd = CAMERA_TRACKS[2];
    } else if (p < 0.65) {
      camT = smoothstep(0.4, 0.65, p);
      kStart = CAMERA_TRACKS[2];
      kEnd = CAMERA_TRACKS[3];
    } else if (p < 0.85) {
      camT = smoothstep(0.65, 0.85, p);
      kStart = CAMERA_TRACKS[3];
      kEnd = CAMERA_TRACKS[4];
    } else {
      camT = smoothstep(0.85, 1.0, p);
      kStart = CAMERA_TRACKS[4];
      kEnd = {
        pos: [0, 1.68, 4.2],
        target: [0, 1.3, -4.5],
        fov: 56,
      };
    }

    // Dynamic Aspect Ratio Compensation:
    // When viewport is narrower than 16:9 (tablets, mobile portrait, narrow windows),
    // adjust camera distance and FOV so the architectural plan is never clipped horizontally.
    const aspect = size.width / Math.max(1, size.height);
    const isPortrait = aspect < 1.0;
    const yMultiplier = isPortrait && p < 0.4 ? 1.25 : 1.0;

    camera.position.x = THREE.MathUtils.lerp(kStart.pos[0], kEnd.pos[0], camT);
    camera.position.y = THREE.MathUtils.lerp(kStart.pos[1], kEnd.pos[1], camT) * yMultiplier;
    camera.position.z = THREE.MathUtils.lerp(kStart.pos[2], kEnd.pos[2], camT);

    targetLook.current.x = THREE.MathUtils.lerp(kStart.target[0], kEnd.target[0], camT);
    targetLook.current.y = THREE.MathUtils.lerp(kStart.target[1], kEnd.target[1], camT);
    targetLook.current.z = THREE.MathUtils.lerp(kStart.target[2], kEnd.target[2], camT);
    camera.lookAt(targetLook.current);

    // Responsive Horizontal Framing:
    // Expand field of view when aspect is narrower than 1.777 (16:9) to keep the full structure in frame
    const baseFov = THREE.MathUtils.lerp(kStart.fov, kEnd.fov, camT);
    const fovScale = aspect < 1.777 ? 1.777 / Math.max(0.55, aspect) : 1.0;
    const responsiveFov = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(baseFov) / 2) * fovScale)
    );
    currentFov.current = THREE.MathUtils.clamp(responsiveFov, 35, 80);

    const persCamera = camera as THREE.PerspectiveCamera;
    persCamera.fov = currentFov.current;
    persCamera.aspect = aspect;
    persCamera.updateProjectionMatrix();

    // Subtle handheld sway
    camera.position.x += Math.sin(time * 0.4) * 0.005;
    camera.position.y += Math.cos(time * 0.35) * 0.003;
  });

  return null;
}

// ============================================
// UI OVERLAY HUD
// ============================================
interface OverlayProps {
  currentChapter: ChapterData;
  onBookClick: () => void;
  onExploreClick: () => void;
}

function CinematicOverlay({
  currentChapter,
  onBookClick,
  onExploreClick,
}: OverlayProps) {
  const isFinalChapter = currentChapter.id === 5;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center px-5 md:px-10">
      <div className="mx-auto max-w-[1360px] w-full pt-16">
        {!isFinalChapter && (
          <div className="max-w-xl transition-all duration-500 transform translate-y-0 opacity-100">
            <h1 className="font-sora text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--color-cream-100)] mb-4 leading-[1.08]">
              {currentChapter.title}
            </h1>
            <p className="text-base sm:text-lg font-light text-[var(--color-silver-400)] leading-relaxed max-w-lg">
              {currentChapter.description}
            </p>
          </div>
        )}

        {isFinalChapter && (
          <div className="text-center max-w-3xl mx-auto pointer-events-auto transition-all duration-700">
            <h1 className="font-sora text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-[var(--color-cream-100)] leading-[1.04] mb-6">
              Don't just imagine it.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-copper-400)] via-[var(--color-copper-500)] to-[#E8A578]">
                Walk it.
              </span>
            </h1>

            <p className="text-base sm:text-lg font-light text-[var(--color-silver-400)] max-w-xl mx-auto mb-10 leading-relaxed">
              Step inside your future architectural layouts at actual 1:1 scale before construction begins across Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[var(--color-copper-500)] hover:bg-[var(--color-copper-600)] px-8 py-4 text-xs font-tech font-semibold uppercase tracking-[0.18em] text-white transition-all wtp-copper-glow cursor-pointer"
              >
                <span>Book Your Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--color-cream-100)]/40 hover:border-[var(--color-copper-500)] bg-transparent hover:bg-white/5 px-7 py-4 text-xs font-tech uppercase tracking-[0.18em] text-[var(--color-cream-100)] transition-all cursor-pointer"
              >
                <span>Explore Our Technology</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT EXPORT
// ============================================
interface ArchitecturalHeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export function ArchitecturalHero({ onBookClick, onExploreClick }: ArchitecturalHeroProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [progressVal, setProgressVal] = useState(0);

  const { tier, isLite, reducedMotion, webglSupported } = useLiteMode();
  const { scrollTo } = useSmoothScroll();
  const transitionTo = useTransitionTo();

  const handleBook = useCallback(() => {
    scrollTo('#book');
    onBookClick();
  }, [scrollTo, onBookClick]);

  const handleExplore = useCallback(() => {
    transitionTo('#experience');
    onExploreClick();
  }, [transitionTo, onExploreClick]);

  // GSAP Pinned Scroll Scrubbing (400vh virtual scroll track)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isLite || reducedMotion) return;

    let lastChapter = 0;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=400%',
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;
        setProgressVal(p);

        // Synchronize live scroll progress with Navbar
        window.dispatchEvent(
          new CustomEvent('wtp-hero-progress', {
            detail: { progress: p, active: self.isActive },
          })
        );

        let newIdx = 0;
        for (let i = 0; i < CHAPTERS.length; i++) {
          if (p >= CHAPTERS[i].range[0] && p <= CHAPTERS[i].range[1]) {
            newIdx = i;
            break;
          }
        }
        if (newIdx !== lastChapter) {
          lastChapter = newIdx;
          setActiveChapterIndex(newIdx);
        }
      },
    });

    return () => st.kill();
  }, [isLite, reducedMotion]);

  if (isLite || !webglSupported || reducedMotion) {
    return <VideoStory onBookClick={handleBook} onExploreClick={handleExplore} />;
  }

  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-screen h-[100dvh] w-full max-w-full bg-[var(--color-graphite-900)] overflow-hidden select-none"
      style={{ minHeight: '100vh' }}
    >
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 z-10 wtp-cinematic-vignette pointer-events-none" />

      {/* R3F WebGL Canvas Container */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 24, 0.01], fov: 42 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'high' ? 2 : 1.5));
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.shadowMap.enabled = tier === 'high';
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <color attach="background" args={[PALETTE.graphite900]} />
          <ArchitecturalScene progressRef={progressRef} tier={tier} />
        </Canvas>
      </div>

      {/* HUD & Chapter UI */}
      <CinematicOverlay
        currentChapter={currentChapter}
        onBookClick={handleBook}
        onExploreClick={handleExplore}
      />
    </section>
  );
}
