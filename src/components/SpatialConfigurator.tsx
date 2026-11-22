import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Eye, Layers, Maximize2, RotateCcw } from 'lucide-react';
import { Reveal } from './MotionPrimitives';

gsap.registerPlugin(ScrollTrigger);
import {
  SPATIAL_PRESETS,
  computeSpatialMetrics,
  type SpatialPresetConfig,
} from '../lib/bookingLogic';

type ViewMode = 'projection' | 'bareshell' | 'interior';
type CameraPreset = 'isometric' | 'topdown' | 'eyelevel';
type FinishPaletteId = 'travertine' | 'charcoal' | 'limestone';

interface FinishPalette {
  id: FinishPaletteId;
  label: string;
  swatch: string;
  floorHex: string;
  wallHex: string;
  woodHex: string;
  fabricHex: string;
}

const FINISH_PALETTES: FinishPalette[] = [
  {
    id: 'travertine',
    label: 'Travertine & Teak',
    swatch: '#C9B99F',
    floorHex: '#CFC3AF',
    wallHex: '#EAE4D8',
    woodHex: '#7A4C2C',
    fabricHex: '#D8CFC2',
  },
  {
    id: 'charcoal',
    label: 'Charcoal & Oak',
    swatch: '#2D2E2B',
    floorHex: '#2B2D2A',
    wallHex: '#DCD7CC',
    woodHex: '#6A4E36',
    fabricHex: '#BEB8AA',
  },
  {
    id: 'limestone',
    label: 'Alabaster & Walnut',
    swatch: '#DDD5C7',
    floorHex: '#DDD6C9',
    wallHex: '#F3EFE7',
    woodHex: '#523421',
    fabricHex: '#CFC7B9',
  },
];

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: {
    label: 'Isometric',
    pos: [12.5, 9.6, 12.5],
    target: [0, -0.45, 0],
  },
  topdown: {
    label: '1:1 Top Plan',
    pos: [0.01, 17.8, 0.01],
    target: [0, 0, 0],
  },
  eyelevel: {
    label: 'Walkthrough',
    pos: [-4.4, 2.0, 5.2],
    target: [1.4, 0.9, -1.0],
  },
};

interface SpatialConfiguratorProps {
  onBookConfiguredSession: (presetName: string) => void;
}

function createBlueprintFloorTexture(
  palette: FinishPalette,
  mode: ViewMode,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const isProjection = mode === 'projection';
  ctx.fillStyle = isProjection ? '#191A18' : palette.floorHex;
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle architectural grid
  const majorStep = 128;
  const minorStep = 32;

  ctx.strokeStyle = isProjection ? 'rgba(255,255,255,0.1)' : 'rgba(25,26,24,0.09)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 1024; i += minorStep) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  ctx.strokeStyle = isProjection ? 'rgba(185,120,86,0.52)' : 'rgba(25,26,24,0.18)';
  ctx.lineWidth = isProjection ? 2.2 : 1.5;
  for (let i = 0; i <= 1024; i += majorStep) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Projection laser border
  if (isProjection) {
    ctx.strokeStyle = 'rgba(255,255,255,0.72)';
    ctx.lineWidth = 5;
    ctx.strokeRect(48, 48, 928, 928);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function SpatialConfigurator({ onBookConfiguredSession }: SpatialConfiguratorProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportWrapRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [presetId, setPresetId] = useState<SpatialPresetConfig['id']>('residence-3bhk');
  const [viewMode, setViewMode] = useState<ViewMode>('interior');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [paletteId, setPaletteId] = useState<FinishPaletteId>('travertine');
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1.0);
  const [showClearance, setShowClearance] = useState<boolean>(true);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [webglUnavailable, setWebglUnavailable] = useState<boolean>(false);

  const activePreset = useMemo(
    () => SPATIAL_PRESETS.find((p) => p.id === presetId) ?? SPATIAL_PRESETS[0],
    [presetId]
  );

  const metrics = useMemo(
    () => computeSpatialMetrics(presetId, scaleMultiplier),
    [presetId, scaleMultiplier]
  );

  // Refs bridging React state into the mounted Three.js scene
  const sceneCtrlRef = useRef<{
    applyConfig: (cfg: {
      presetId: SpatialPresetConfig['id'];
      viewMode: ViewMode;
      paletteId: FinishPaletteId;
      scaleMultiplier: number;
      showClearance: boolean;
    }) => void;
    animateToCamera: (preset: CameraPreset) => void;
    setScrollParallax: (progress: number) => void;
    resetView: () => void;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per threejs skill
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const handleContextRestored = () => {
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#E8E3D9');
    scene.fog = new THREE.Fog('#E8E3D9', 26, 60);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    camera.position.set(...CAMERA_PRESETS.isometric.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 5;
    controls.maxDistance = 32;
    controls.maxPolarAngle = Math.PI / 2.08;
    controls.target.set(...CAMERA_PRESETS.isometric.target);
    controls.update();

    // Lighting rig: calibrated warm key + cool hemisphere + subtle rim
    const hemiLight = new THREE.HemisphereLight(0xd2dde8, 0x5c5042, 0.48);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff0d8, 1.18);
    keyLight.position.set(11, 16, 9);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 45;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdce4f0, 0.42);
    rimLight.position.set(-10, 8, -10);
    scene.add(rimLight);

    // Studio Ground Base
    const studioBaseMat = new THREE.MeshStandardMaterial({
      color: 0xd0c9bc,
      roughness: 0.94,
      metalness: 0.02,
    });
    const studioBase = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), studioBaseMat);
    studioBase.rotation.x = -Math.PI / 2;
    studioBase.position.y = -0.14;
    studioBase.receiveShadow = true;
    scene.add(studioBase);

    // Root architectural group scaled dynamically
    const archGroup = new THREE.Group();
    scene.add(archGroup);

    // Architectural dark plinth beneath the floor slab
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x191a18,
      roughness: 0.85,
      metalness: 0.05,
    });
    const plinthMesh = new THREE.Mesh(new THREE.BoxGeometry(14.9, 0.14, 12.2), plinthMat);
    plinthMesh.position.y = -0.09;
    archGroup.add(plinthMesh);

    // Materials updated dynamically
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    let currentFloorTex = createBlueprintFloorTexture(FINISH_PALETTES[0], 'interior', maxAniso);

    const floorMat = new THREE.MeshStandardMaterial({
      map: currentFloorTex,
      roughness: 0.68,
      metalness: 0.04,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf3efe7,
      roughness: 0.82,
      metalness: 0.02,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x8e5e3b,
      roughness: 0.55,
      metalness: 0.05,
    });
    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0xefece6,
      roughness: 0.88,
      metalness: 0.0,
    });
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xdccfc0,
      roughness: 0.42,
      metalness: 0.08,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8dce2,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: isSoftwareGl ? 0.35 : 0.48,
      transmission: isSoftwareGl ? 0 : 0.72,
      ior: 1.5,
      depthWrite: false,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xb97856,
      roughness: 0.45,
      metalness: 0.15,
    });
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wallEdgeMat = new THREE.LineBasicMaterial({
      color: 0x191a18,
      transparent: true,
      opacity: 0.24,
    });
    const clearanceMat = new THREE.MeshBasicMaterial({
      color: 0xb97856,
      transparent: true,
      opacity: 0.36,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Sub-groups for structured 1:1 Floor vs 3D Wall Height transitions
    const floorSlab = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.08, 11.8), floorMat);
    floorSlab.position.y = 0.0;
    floorSlab.receiveShadow = true;
    archGroup.add(floorSlab);

    const wallsGroup = new THREE.Group();
    archGroup.add(wallsGroup);

    const blueprintOutlineGroup = new THREE.Group();
    blueprintOutlineGroup.position.y = 0.05;
    archGroup.add(blueprintOutlineGroup);

    const furnitureGroup = new THREE.Group();
    furnitureGroup.position.y = 0.04;
    archGroup.add(furnitureGroup);

    const clearanceGroup = new THREE.Group();
    clearanceGroup.position.y = 0.055;
    archGroup.add(clearanceGroup);

    function addWall(x: number, z: number, w: number, d: number, h = 2.8) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(x, h / 2 + 0.04, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const wallOutline = new THREE.LineSegments(new THREE.EdgesGeometry(geo), wallEdgeMat);
      mesh.add(wallOutline);
      wallsGroup.add(mesh);

      // Corresponding floor CAD footprint ring
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, 0.01, d));
      const line = new THREE.LineSegments(edges, lineMat);
      line.position.set(x, 0.0, z);
      blueprintOutlineGroup.add(line);
    }

    function addWindowWall(x: number, z: number, w: number, d: number) {
      const sill = new THREE.Mesh(new THREE.BoxGeometry(w, 0.65, d), wallMat);
      sill.position.set(x, 0.365, z);
      sill.castShadow = true;
      wallsGroup.add(sill);

      const pane = new THREE.Mesh(
        new THREE.BoxGeometry(Math.max(0.05, w - 0.1), 1.85, Math.max(0.05, d - 0.1)),
        glassMat
      );
      pane.position.set(x, 1.62, z);
      wallsGroup.add(pane);

      const header = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, d), wallMat);
      header.position.set(x, 2.68, z);
      wallsGroup.add(header);
    }

    // Perimeter & Interior Partitions (centered around 0,0)
    addWall(0, -5.8, 14.5, 0.22); // North wall
    addWindowWall(-7.15, 0, 0.22, 11.4); // West glazed facade
    addWall(7.15, 0, 0.22, 11.4); // East wall
    addWall(-3.6, 5.8, 7.3, 0.22); // South-west wall
    addWindowWall(3.6, 5.8, 7.1, 0.22); // South-east patio glazing

    // Interior room partitions
    addWall(0.6, -2.5, 0.18, 6.4); // Living/Bedroom divider
    addWall(3.9, -0.4, 6.4, 0.18); // Primary suite / Kitchen divider
    addWall(-3.6, -1.6, 4.8, 0.18); // Entry foyer partition

    // Composite Furniture 1: Living Sectional Sofa + Rug + Coffee Table
    const livingSet = new THREE.Group();
    livingSet.position.set(-3.6, 0, 2.3);
    const rug = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.02, 3.2), stoneMat);
    rug.position.set(0, 0.01, 0);
    rug.receiveShadow = true;
    livingSet.add(rug);

    const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.42, 1.05), fabricMat);
    sofaMain.position.set(0, 0.24, 1.0);
    sofaMain.castShadow = true;
    livingSet.add(sofaMain);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.46, 0.24), fabricMat);
    sofaBack.position.set(0, 0.56, 1.42);
    sofaBack.castShadow = true;
    livingSet.add(sofaBack);

    const sofaChaise = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.42, 2.1), fabricMat);
    sofaChaise.position.set(-1.08, 0.24, 0.45);
    sofaChaise.castShadow = true;
    livingSet.add(sofaChaise);

    const coffeeTableTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.85), woodMat);
    coffeeTableTop.position.set(0.35, 0.36, -0.15);
    coffeeTableTop.castShadow = true;
    livingSet.add(coffeeTableTop);

    const coffeeTableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.32, 18), stoneMat);
    coffeeTableBase.position.set(0.35, 0.16, -0.15);
    livingSet.add(coffeeTableBase);
    furnitureGroup.add(livingSet);

    // Composite Furniture 2: 6-Seater Dining Table + Chairs
    const diningSet = new THREE.Group();
    diningSet.position.set(-2.5, 0, -3.9);
    const diningTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.09, 1.15), stoneMat);
    diningTop.position.set(0, 0.74, 0);
    diningTop.castShadow = true;
    diningSet.add(diningTop);

    const pedestalL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.7, 16), woodMat);
    pedestalL.position.set(-0.75, 0.35, 0);
    const pedestalR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.7, 16), woodMat);
    pedestalR.position.set(0.75, 0.35, 0);
    diningSet.add(pedestalL, pedestalR);

    for (let i = -1; i <= 1; i++) {
      for (const side of [-1, 1]) {
        const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.46), fabricMat);
        chairSeat.position.set(i * 0.75, 0.44, side * 0.78);
        chairSeat.castShadow = true;
        const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.4, 0.08), woodMat);
        chairBack.position.set(i * 0.75, 0.66, side * 0.98);
        diningSet.add(chairSeat, chairBack);
      }
    }
    furnitureGroup.add(diningSet);

    // Composite Furniture 3: Kitchen Island + Barstools
    const kitchenSet = new THREE.Group();
    kitchenSet.position.set(3.8, 0, -3.2);
    const islandBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.88, 1.05), woodMat);
    islandBody.position.set(0, 0.44, 0);
    islandBody.castShadow = true;
    const islandTop = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.08, 1.16), stoneMat);
    islandTop.position.set(0, 0.92, 0);
    islandTop.castShadow = true;
    kitchenSet.add(islandBody, islandTop);

    for (let i = -1; i <= 1; i++) {
      const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 14), fabricMat);
      stoolSeat.position.set(i * 0.9, 0.66, 0.85);
      const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.64, 10), accentMat);
      stoolLeg.position.set(i * 0.9, 0.32, 0.85);
      kitchenSet.add(stoolSeat, stoolLeg);
    }
    furnitureGroup.add(kitchenSet);

    // Composite Furniture 4: Primary Suite King Bed + Nightstands
    const bedSet = new THREE.Group();
    bedSet.position.set(4.1, 0, 2.7);
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.28, 2.3), woodMat);
    bedFrame.position.set(0, 0.14, 0);
    bedFrame.castShadow = true;
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.26, 2.1), fabricMat);
    mattress.position.set(0, 0.39, -0.05);
    mattress.castShadow = true;
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.05, 0.14), woodMat);
    headboard.position.set(0, 0.56, 1.12);
    headboard.castShadow = true;
    const nightL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.46, 0.46), stoneMat);
    nightL.position.set(-1.45, 0.23, 0.92);
    const nightR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.46, 0.46), stoneMat);
    nightR.position.set(1.45, 0.23, 0.92);
    bedSet.add(bedFrame, mattress, headboard, nightL, nightR);
    furnitureGroup.add(bedSet);

    // Door swing clearance arcs (90-degree quarter discs)
    const swingGeo = new THREE.CircleGeometry(1.05, 24, 0, Math.PI / 2);
    const swing1 = new THREE.Mesh(swingGeo, clearanceMat);
    swing1.rotation.x = -Math.PI / 2;
    swing1.position.set(0.6, 0.01, 1.2);
    const swing2 = new THREE.Mesh(swingGeo, clearanceMat);
    swing2.rotation.x = -Math.PI / 2;
    swing2.rotation.z = Math.PI / 2;
    swing2.position.set(-1.2, 0.01, -1.6);
    const swing3 = new THREE.Mesh(swingGeo, clearanceMat);
    swing3.rotation.x = -Math.PI / 2;
    swing3.rotation.z = -Math.PI / 2;
    swing3.position.set(1.8, 0.01, -0.4);
    clearanceGroup.add(swing1, swing2, swing3);

    // Smooth animation & coalesced on-demand rendering
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let wallScaleTarget = 1;
    let wallScaleCurrent = 1;
    let camTransitionActive = false;
    const camTargetPos = new THREE.Vector3(...CAMERA_PRESETS.isometric.pos);
    const camTargetLook = new THREE.Vector3(...CAMERA_PRESETS.isometric.target);
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 16);
        return;
      }
      gl.flush();
      const started = performance.now();
      const poll = () => {
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED && performance.now() - started < 120) {
          frameId = window.setTimeout(poll, 8);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 16);
        }
      };
      frameId = window.setTimeout(poll, 8);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        renderDirty = false;
        const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        let needsMoreFrames = false;

        // Exponential damping for wall height (1:1 projection vs 3D walls)
        if (Math.abs(wallScaleCurrent - wallScaleTarget) > 0.004) {
          wallScaleCurrent = THREE.MathUtils.damp(wallScaleCurrent, wallScaleTarget, 10, dt);
          wallsGroup.scale.y = Math.max(0.02, wallScaleCurrent);
          needsMoreFrames = true;
        } else {
          wallScaleCurrent = wallScaleTarget;
          wallsGroup.scale.y = Math.max(0.02, wallScaleCurrent);
        }

        // Exponential damping for camera presets
        if (camTransitionActive) {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, camTargetPos.x, 7, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, camTargetPos.y, 7, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, camTargetPos.z, 7, dt);

          controls.target.x = THREE.MathUtils.damp(controls.target.x, camTargetLook.x, 7, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, camTargetLook.y, 7, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, camTargetLook.z, 7, dt);

          if (
            camera.position.distanceTo(camTargetPos) < 0.05 &&
            controls.target.distanceTo(camTargetLook) < 0.05
          ) {
            camera.position.copy(camTargetPos);
            controls.target.copy(camTargetLook);
            camTransitionActive = false;
          } else {
            needsMoreFrames = true;
          }
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsMoreFrames) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    let userInteractedWithOrbit = false;

    const onControlStart = () => {
      camTransitionActive = false;
      userInteractedWithOrbit = true;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // ResizeObserver for crisp layout scaling
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(300, entry.contentRect.width);
      const h = Math.max(300, entry.contentRect.height);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    resizeObserver.observe(container);

    sceneCtrlRef.current = {
      applyConfig: ({ presetId: pId, viewMode: vm, paletteId: palId, scaleMultiplier: sc, showClearance: cl }) => {
        const pal = FINISH_PALETTES.find((p) => p.id === palId) ?? FINISH_PALETTES[0];
        const preset = SPATIAL_PRESETS.find((p) => p.id === pId) ?? SPATIAL_PRESETS[0];

        // Scale root blueprint footprint proportionally to preset
        const xScale = (preset.widthMeters / 14.5) * sc;
        const zScale = (preset.depthMeters / 11.8) * sc;
        archGroup.scale.set(xScale, 1, zScale);

        const isProjection = vm === 'projection';
        const isBareShell = vm === 'bareshell';

        wallScaleTarget = isProjection ? 0.02 : 1.0;
        if (isSoftwareGl) {
          wallScaleCurrent = wallScaleTarget;
          wallsGroup.scale.y = Math.max(0.02, wallScaleCurrent);
        }

        // Update materials
        currentFloorTex.dispose();
        currentFloorTex = createBlueprintFloorTexture(pal, vm, maxAniso);
        floorMat.map = currentFloorTex;
        floorMat.needsUpdate = true;

        if (isBareShell) {
          wallMat.color.set('#EAE7DF');
          woodMat.color.set('#CBC6BC');
          fabricMat.color.set('#D8D4CB');
          stoneMat.color.set('#C9C4BA');
        } else if (isProjection) {
          wallMat.color.set('#FFFFFF');
          woodMat.color.set('#B97856');
          fabricMat.color.set('#3A3B38');
          stoneMat.color.set('#4D4E49');
        } else {
          wallMat.color.set(pal.wallHex);
          woodMat.color.set(pal.woodHex);
          fabricMat.color.set(pal.fabricHex);
          stoneMat.color.set('#DCCFC0');
        }

        scene.background = new THREE.Color(isProjection ? '#191A18' : '#E8E3D9');
        scene.fog = new THREE.Fog(isProjection ? '#191A18' : '#E8E3D9', 26, 60);
        studioBaseMat.color.set(isProjection ? '#141513' : '#DAD4C8');

        blueprintOutlineGroup.visible = isProjection || cl;
        clearanceGroup.visible = cl;
        furnitureGroup.scale.y = isProjection ? 0.25 : 1.0;

        requestRender();
      },
      animateToCamera: (preset) => {
        const targetCfg = CAMERA_PRESETS[preset];
        camTargetPos.set(...targetCfg.pos);
        camTargetLook.set(...targetCfg.target);
        if (isSoftwareGl) {
          camera.position.copy(camTargetPos);
          controls.target.copy(camTargetLook);
          camTransitionActive = false;
        } else {
          camTransitionActive = true;
        }
        requestRender();
      },
      setScrollParallax: (progress: number) => {
        if (userInteractedWithOrbit) return;
        const clamped = Math.min(1, Math.max(0, progress));
        archGroup.rotation.y = (clamped - 0.5) * 0.34;
        archGroup.position.y = Math.sin(clamped * Math.PI) * 0.14;
        requestRender();
      },
      resetView: () => {
        userInteractedWithOrbit = false;
        archGroup.rotation.y = 0;
        archGroup.position.y = 0;
        camTargetPos.set(...CAMERA_PRESETS.isometric.pos);
        camTargetLook.set(...CAMERA_PRESETS.isometric.target);
        camTransitionActive = !isSoftwareGl;
        if (isSoftwareGl) {
          camera.position.copy(camTargetPos);
          controls.target.copy(camTargetLook);
        }
        requestRender();
      },
    };

    // Initial render
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      currentFloorTex.dispose();
      envTarget.dispose();
      renderer.dispose();
      sceneCtrlRef.current = null;
    };
  }, []);

  // Push configuration changes to mounted Three.js scene
  useEffect(() => {
    sceneCtrlRef.current?.applyConfig({
      presetId,
      viewMode,
      paletteId,
      scaleMultiplier,
      showClearance,
    });
  }, [presetId, viewMode, paletteId, scaleMultiplier, showClearance]);

  // Lenis + GSAP ScrollTrigger 3D spatial depth & architectural rotation on scroll
  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportWrapRef.current;
    if (!section || !viewport) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        viewport,
        { transformPerspective: 1400, rotateX: 2.2, y: 26 },
        {
          rotateX: -1.4,
          y: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
              sceneCtrlRef.current?.setScrollParallax(self.progress);
            },
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    sceneCtrlRef.current?.animateToCamera(preset);
  };

  return (
    <section
      ref={sectionRef}
      id="configurator"
      className="bg-[#F5F2EB] text-[#191A18] py-10 md:py-14 border-b border-[#191A18]/10 overflow-x-clip"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                Interactive 3D Spatial Configurator
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
                Preview Your Floor Plan Transformation in Real Time.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
              <p className="text-sm text-[#77746D] lg:text-right max-w-md">
                Orbit freely, switch between our 1:1 floor projection grid, bare-shell 3D volume,
                and interior materiality, and inspect live spatial clearances.
              </p>
              <button
                type="button"
                onClick={() => onBookConfiguredSession(activePreset.name)}
                className="inline-flex items-center gap-2 bg-[#191A18] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#F5F2EB] hover:bg-[#B97856] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book {activePreset.name} Walkthrough</span>
              </button>
            </Reveal>
          </div>
        </div>

        {/* Unobstructed 3D Viewport Container */}
        <Reveal delay={0.12} yOffset={24}>
        <div
          ref={viewportWrapRef}
          className="relative w-full h-[580px] md:h-[660px] border border-[#191A18]/15 overflow-hidden bg-[#E8E3D9] will-change-transform"
          data-testid="spatial-3d-viewport"
          data-view-mode={viewMode}
          data-preset={presetId}
        >
          {/* Dedicated isolated Three.js canvas mount */}
          <div ref={mountRef} data-cursor="Explore" className="absolute inset-0 w-full h-full" />

          {webglUnavailable && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-[#E8E3D9] text-[#191A18]">
              <p className="font-serif text-2xl">Interactive 3D Preview Unavailable</p>
              <p className="mt-2 text-sm text-[#77746D] max-w-md">
                Hardware or software WebGL acceleration is disabled in this browser. Book a live
                studio session to experience full 1:1 projection and VR walkthroughs in person.
              </p>
            </div>
          )}

          {/* Top-Left Minimal Spec Strip (Solid rgba surface, no backdrop-blur over WebGL) */}
          <div className="pointer-events-none absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="pointer-events-auto bg-[#F5F2EB]/95 border border-[#191A18]/15 px-4 py-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#191A18]">
                <span className="font-semibold">{activePreset.name}</span>
                <span aria-hidden="true" className="text-[#77746D]">·</span>
                <span className="tabular-nums font-medium">
                  {metrics.totalAreaSqFt.toLocaleString('en-IN')} sq.ft.
                </span>
                <span aria-hidden="true" className="text-[#77746D]">·</span>
                <span className="tabular-nums text-[#77746D]">
                  {metrics.widthFeet}&apos; × {metrics.depthFeet}&apos;
                </span>
                <span aria-hidden="true" className="text-[#77746D]">·</span>
                <span className="tabular-nums text-[#B97856] font-medium">
                  {metrics.circulationClearancePct}% Circulation Clearance
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCameraPreset('isometric');
                sceneCtrlRef.current?.resetView();
              }}
              aria-label="Reset 3D camera view"
              className="pointer-events-auto inline-flex items-center gap-1.5 bg-[#F5F2EB]/95 border border-[#191A18]/15 px-3 py-2 text-xs font-medium text-[#191A18] hover:border-[#B97856] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Orbit</span>
            </button>
          </div>

          {/* Collapsible Bottom Control Dock (Zero Center Occlusion) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[min(1040px,calc(100%-2rem))] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setControlsCollapsed((prev) => !prev)}
              className="inline-flex items-center gap-1.5 bg-[#191A18] text-[#F5F2EB] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] cursor-pointer hover:bg-[#B97856] transition-colors"
            >
              {controlsCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Show Controls</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Hide Controls</span>
                </>
              )}
            </button>

            {!controlsCollapsed && (
              <div className="w-full bg-[#F5F2EB]/96 border border-[#191A18]/18 p-3.5 md:p-4 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Layout Presets */}
                  <div className="md:col-span-5">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#77746D] mb-1.5 flex items-center gap-1.5">
                      <Maximize2 className="w-3 h-3" />
                      <span>Architectural Layout</span>
                    </p>
                    <div className="flex flex-wrap md:flex-nowrap gap-1">
                      {SPATIAL_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPresetId(p.id)}
                          className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            presetId === p.id
                              ? 'bg-[#191A18] text-[#F5F2EB]'
                              : 'bg-[#E8E3D9] text-[#191A18] hover:bg-[#ded7c9]'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visualization Layer */}
                  <div className="md:col-span-4">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#77746D] mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3 h-3" />
                      <span>Spatial Layer</span>
                    </p>
                    <div className="flex flex-wrap md:flex-nowrap gap-1">
                      {(
                        [
                          { id: 'projection', label: '1:1 Projection' },
                          { id: 'bareshell', label: 'Bare-Shell 3D' },
                          { id: 'interior', label: 'Interior 3D' },
                        ] as const
                      ).map((layer) => (
                        <button
                          key={layer.id}
                          type="button"
                          onClick={() => setViewMode(layer.id)}
                          className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            viewMode === layer.id
                              ? 'bg-[#B97856] text-white'
                              : 'bg-[#E8E3D9] text-[#191A18] hover:bg-[#ded7c9]'
                          }`}
                        >
                          {layer.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Camera Angle */}
                  <div className="md:col-span-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#77746D] mb-1.5 flex items-center gap-1.5">
                      <Eye className="w-3 h-3" />
                      <span>Camera View</span>
                    </p>
                    <div className="flex flex-wrap md:flex-nowrap gap-1">
                      {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((camKey) => (
                        <button
                          key={camKey}
                          type="button"
                          onClick={() => handleCameraPreset(camKey)}
                          className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            cameraPreset === camKey
                              ? 'bg-[#191A18] text-[#F5F2EB]'
                              : 'bg-[#E8E3D9] text-[#191A18] hover:bg-[#ded7c9]'
                          }`}
                        >
                          {CAMERA_PRESETS[camKey].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Second Slim Row: Finish Palette, Scale Adjuster & Clearance Toggle */}
                <div className="mt-3 pt-3 border-t border-[#191A18]/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-[#77746D]">
                      Palette:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {FINISH_PALETTES.map((pal) => (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => setPaletteId(pal.id)}
                          aria-label={`Select ${pal.label} finish`}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            paletteId === pal.id
                              ? 'border-[#191A18] bg-white text-[#191A18]'
                              : 'border-transparent text-[#77746D] hover:text-[#191A18]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-[#191A18]/20"
                            style={{ backgroundColor: pal.swatch }}
                          />
                          <span className="hidden sm:inline">{pal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-xs text-[#191A18]">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-[#77746D]">
                        Bay Scale:
                      </span>
                      <input
                        type="range"
                        min={0.85}
                        max={1.2}
                        step={0.05}
                        value={scaleMultiplier}
                        onChange={(e) => setScaleMultiplier(Number(e.target.value))}
                        className="w-20 accent-[#B97856] cursor-pointer"
                      />
                      <span className="tabular-nums font-medium w-10">
                        {Math.round(scaleMultiplier * 100)}%
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowClearance((prev) => !prev)}
                      className={`px-3 py-1 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        showClearance
                          ? 'bg-[#B97856]/15 border-[#B97856] text-[#191A18]'
                          : 'bg-transparent border-[#191A18]/20 text-[#77746D]'
                      }`}
                    >
                      Door Swings {showClearance ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
