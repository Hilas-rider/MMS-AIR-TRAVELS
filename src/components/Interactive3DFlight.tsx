import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Plane, 
  Globe, 
  Sparkles, 
  Play, 
  Pause, 
  Navigation,
  Wind,
  Eye,
  Compass,
  Maximize2
} from 'lucide-react';

interface Interactive3DFlightProps {
  className?: string;
  onExploreFlight?: () => void;
}

export const Interactive3DFlight: React.FC<Interactive3DFlightProps> = ({
  className = '',
  onExploreFlight
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMode, setActiveMode] = useState<'aircraft' | 'globe'>('aircraft');
  const [cameraView, setCameraView] = useState<'chase' | 'wing' | 'front'>('chase');
  const [isPaused, setIsPaused] = useState(false);
  const [flightSpeed, setFlightSpeed] = useState<'cruise' | 'supersonic'>('cruise');
  const [selectedRoute, setSelectedRoute] = useState<'trichy-dubai' | 'chennai-doha' | 'madurai-singapore'>('trichy-dubai');

  // Mutable fast refs for 60fps loop
  const activeModeRef = useRef(activeMode);
  const cameraViewRef = useRef(cameraView);
  const isPausedRef = useRef(isPaused);
  const flightSpeedRef = useRef(flightSpeed);

  useEffect(() => { activeModeRef.current = activeMode; }, [activeMode]);
  useEffect(() => { cameraViewRef.current = cameraView; }, [cameraView]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { flightSpeedRef.current = flightSpeed; }, [flightSpeed]);

  const routesInfo = {
    'trichy-dubai': { from: 'Trichy (TRZ)', to: 'Dubai (DXB)', distance: '2,948 km', status: 'Cruising • FL380', flightNo: '6E 1475', mach: 'Mach 0.82', alt: '38,000 FT' },
    'chennai-doha': { from: 'Chennai (MAA)', to: 'Doha (DOH)', distance: '3,780 km', status: 'Climbing • FL400', flightNo: 'QR 529', mach: 'Mach 0.84', alt: '40,000 FT' },
    'madurai-singapore': { from: 'Madurai (IXM)', to: 'Singapore (SIN)', distance: '3,015 km', status: 'Cruising • FL360', flightNo: 'TR 563', mach: 'Mach 0.80', alt: '36,000 FT' }
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 460;

    // --- 1. Scene, Camera, High-Performance WebGL Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x061838, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 15);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // --- 2. Photorealistic Lighting & Sky Environment ---
    // Warm Sun directional light
    const sunLight = new THREE.DirectionalLight(0xfff3d6, 3.2);
    sunLight.position.set(15, 20, 12);
    scene.add(sunLight);

    // Sky dome ambient
    const skyAmbient = new THREE.HemisphereLight(0x38bdf8, 0x0c214d, 1.4);
    scene.add(skyAmbient);

    // Cyan Stratospheric fill light
    const stratFill = new THREE.DirectionalLight(0x0284c7, 1.8);
    stratFill.position.set(-15, -6, -10);
    scene.add(stratFill);

    // Golden Sunset Wing Rim Light
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
    rimLight.position.set(-18, 12, 10);
    scene.add(rimLight);

    // --- 3. Ultra-Realistic Boeing/Airbus Style 3D Airliner Model ---
    const aircraftRoot = new THREE.Group();

    // Fuselage PBR Material (Sleek gloss white with subtle specular reflection)
    const fuselageMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.18,
      metalness: 0.35,
      envMapIntensity: 1.2
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.1,
      metalness: 0.95
    });

    const royalBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.25,
      metalness: 0.4
    });

    const mmsRedMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.2,
      metalness: 0.3
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.6
    });

    // A. Main Fuselage Body
    const fuselageBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.52, 7.8, 32),
      fuselageMat
    );
    fuselageBody.rotation.x = Math.PI / 2;
    aircraftRoot.add(fuselageBody);

    // B. Aerodynamic Radome (Nose Cone)
    const noseGeo = new THREE.ConeGeometry(0.62, 2.0, 32);
    noseGeo.rotateX(-Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, fuselageMat);
    noseMesh.position.z = 4.9;
    aircraftRoot.add(noseMesh);

    // C. Cockpit Windshield (Multi-panel dark glass with reflections)
    const cockpitGlassMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.05,
      metalness: 0.98
    });
    const cockpitCenter = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.36, 1.1),
      cockpitGlassMat
    );
    cockpitCenter.rotation.x = 0.26;
    cockpitCenter.position.set(0, 0.48, 4.0);
    aircraftRoot.add(cockpitCenter);

    // Cockpit Window Silver Frames
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.04, 1.12),
      chromeMat
    );
    windowFrame.rotation.x = 0.26;
    windowFrame.position.set(0, 0.48, 4.0);
    aircraftRoot.add(windowFrame);

    // D. MMS Livery Golden & Blue Speed Stripes along Fuselage
    const stripeBlue = new THREE.Mesh(
      new THREE.CylinderGeometry(0.63, 0.53, 5.8, 32, 1, true),
      royalBlueMat
    );
    stripeBlue.rotation.x = Math.PI / 2;
    stripeBlue.position.set(0, 0.08, 0.4);
    aircraftRoot.add(stripeBlue);

    const stripeGold = new THREE.Mesh(
      new THREE.CylinderGeometry(0.632, 0.532, 4.6, 32, 1, true),
      goldAccentMat
    );
    stripeGold.rotation.x = Math.PI / 2;
    stripeGold.position.set(0, -0.04, 0.2);
    aircraftRoot.add(stripeGold);

    // E. Passenger Windows Strip (Row of illuminated cabin windows)
    const cabinWindowsMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const windowGeo = new THREE.BoxGeometry(0.06, 0.1, 0.16);
    for (let side of [-1, 1]) {
      for (let i = 0; i < 16; i++) {
        const win = new THREE.Mesh(windowGeo, cabinWindowsMat);
        win.position.set(side * 0.62, 0.18, 2.6 - i * 0.38);
        aircraftRoot.add(win);
      }
    }

    // F. Aerodynamic Swept Wings with Airfoil & Dihedral
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(5.8, -2.4);
    wingShape.lineTo(5.6, -3.1);
    wingShape.lineTo(0.2, -1.8);
    wingShape.closePath();

    const wingExtrude = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    wingExtrude.rotateX(-Math.PI / 2);

    const rightWing = new THREE.Mesh(wingExtrude, fuselageMat);
    rightWing.position.set(0.3, -0.08, 1.2);
    rightWing.rotation.z = 0.04; // subtle dihedral
    aircraftRoot.add(rightWing);

    const leftWing = rightWing.clone();
    leftWing.scale.set(-1, 1, 1);
    leftWing.position.set(-0.3, -0.08, 1.2);
    leftWing.rotation.z = -0.04;
    aircraftRoot.add(leftWing);

    // Silver Leading Edge Wing Slats
    const slatGeo = new THREE.CylinderGeometry(0.06, 0.06, 6.0, 16);
    slatGeo.rotateZ(Math.PI / 2);
    const rightSlat = new THREE.Mesh(slatGeo, chromeMat);
    rightSlat.position.set(3.1, -0.05, 0.05);
    rightSlat.rotation.y = -0.38;
    aircraftRoot.add(rightSlat);

    const leftSlat = rightSlat.clone();
    leftSlat.scale.set(-1, 1, 1);
    leftSlat.position.set(-3.1, -0.05, 0.05);
    leftSlat.rotation.y = 0.38;
    aircraftRoot.add(leftSlat);

    // G. Modern Aerodynamic Blended Winglets (MMS Red)
    const wingletShape = new THREE.Shape();
    wingletShape.moveTo(0, 0);
    wingletShape.lineTo(0.1, 0.85);
    wingletShape.lineTo(-0.35, 0.75);
    wingletShape.lineTo(-0.45, 0);
    wingletShape.closePath();

    const wingletGeo = new THREE.ExtrudeGeometry(wingletShape, { depth: 0.04, bevelEnabled: false });
    const rightWinglet = new THREE.Mesh(wingletGeo, mmsRedMat);
    rightWinglet.position.set(5.75, 0.05, -1.5);
    rightWinglet.rotation.z = 0.35;
    aircraftRoot.add(rightWinglet);

    const leftWinglet = rightWinglet.clone();
    leftWinglet.scale.set(-1, 1, 1);
    leftWinglet.position.set(-5.75, 0.05, -1.5);
    leftWinglet.rotation.z = -0.35;
    aircraftRoot.add(leftWinglet);

    // H. High-Bypass Turbofan Jet Engines
    const engineNacelleGeo = new THREE.CylinderGeometry(0.44, 0.38, 1.9, 24);
    engineNacelleGeo.rotateX(Math.PI / 2);

    const rightEngineNacelle = new THREE.Mesh(engineNacelleGeo, fuselageMat);
    rightEngineNacelle.position.set(2.2, -0.65, 0.4);
    aircraftRoot.add(rightEngineNacelle);

    // Chrome Intake Lip
    const intakeLipGeo = new THREE.TorusGeometry(0.44, 0.04, 16, 32);
    const rightIntake = new THREE.Mesh(intakeLipGeo, chromeMat);
    rightIntake.position.set(2.2, -0.65, 1.35);
    aircraftRoot.add(rightIntake);

    // Spinning Turbofan Blades
    const fanBladeGroup = new THREE.Group();
    const fanHub = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 16), chromeMat);
    fanHub.rotateX(Math.PI / 2);
    fanBladeGroup.add(fanHub);

    for (let b = 0; b < 16; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.34, 0.08), darkTrimMat);
      blade.rotation.z = (b / 16) * Math.PI * 2;
      blade.position.set(
        Math.cos((b / 16) * Math.PI * 2) * 0.22,
        Math.sin((b / 16) * Math.PI * 2) * 0.22,
        0
      );
      blade.rotation.x = 0.4;
      fanBladeGroup.add(blade);
    }
    fanBladeGroup.position.set(2.2, -0.65, 1.15);
    aircraftRoot.add(fanBladeGroup);

    // Engine Exhaust Cone & Core Glow
    const exhaustMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const rightExhaust = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), exhaustMat);
    rightExhaust.position.set(2.2, -0.65, -0.56);
    rightExhaust.rotateY(Math.PI);
    aircraftRoot.add(rightExhaust);

    // Clone for Left Engine
    const leftEngineNacelle = rightEngineNacelle.clone();
    leftEngineNacelle.position.set(-2.2, -0.65, 0.4);
    aircraftRoot.add(leftEngineNacelle);

    const leftIntake = rightIntake.clone();
    leftIntake.position.set(-2.2, -0.65, 1.35);
    aircraftRoot.add(leftIntake);

    const leftFanBladeGroup = fanBladeGroup.clone();
    leftFanBladeGroup.position.set(-2.2, -0.65, 1.15);
    aircraftRoot.add(leftFanBladeGroup);

    const leftExhaust = rightExhaust.clone();
    leftExhaust.position.set(-2.2, -0.65, -0.56);
    aircraftRoot.add(leftExhaust);

    // I. Vertical Stabilizer (Tail Fin with Royal Blue & MMS Golden Crest)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0, 2.3);
    finShape.lineTo(-1.3, 2.15);
    finShape.lineTo(-2.2, 0);
    finShape.closePath();

    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.1, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.02, bevelThickness: 0.02 });
    finGeo.rotateY(Math.PI / 2);
    const tailFin = new THREE.Mesh(finGeo, royalBlueMat);
    tailFin.position.set(0, 0.5, -2.6);
    aircraftRoot.add(tailFin);

    // Tail Fin Gold Flash
    const tailStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 1.4), goldAccentMat);
    tailStripe.position.set(0, 2.2, -3.2);
    tailStripe.rotation.x = -0.3;
    aircraftRoot.add(tailStripe);

    // J. Horizontal Stabilizers
    const hTailShape = new THREE.Shape();
    hTailShape.moveTo(0, 0);
    hTailShape.lineTo(2.2, -1.0);
    hTailShape.lineTo(2.0, -1.4);
    hTailShape.lineTo(0, -0.8);
    hTailShape.closePath();

    const hTailGeo = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.06, bevelEnabled: false });
    hTailGeo.rotateX(-Math.PI / 2);

    const rightHTail = new THREE.Mesh(hTailGeo, fuselageMat);
    rightHTail.position.set(0.25, 0.25, -3.4);
    aircraftRoot.add(rightHTail);

    const leftHTail = rightHTail.clone();
    leftHTail.scale.set(-1, 1, 1);
    leftHTail.position.set(-0.25, 0.25, -3.4);
    aircraftRoot.add(leftHTail);

    // K. Realistic Pulsing Navigation & Beacon Lights
    const redLightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const greenLightMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const strobeLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const portNavLight = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), redLightMat);
    portNavLight.position.set(-5.75, 0.1, -1.4);
    aircraftRoot.add(portNavLight);

    const stbdNavLight = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), greenLightMat);
    stbdNavLight.position.set(5.75, 0.1, -1.4);
    aircraftRoot.add(stbdNavLight);

    const tailStrobe = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), strobeLightMat);
    tailStrobe.position.set(0, 2.65, -3.3);
    aircraftRoot.add(tailStrobe);

    const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), redLightMat);
    beaconLight.position.set(0, 0.72, 0.5);
    aircraftRoot.add(beaconLight);

    aircraftRoot.position.set(0, -3.0, 10); // Start below for majestic opening climb
    scene.add(aircraftRoot);

    // --- 4. High-Fidelity Vapor Contrails & Heat Haze Stream ---
    const contrailCount = 220;
    const contrailGeo = new THREE.BufferGeometry();
    const contrailPos = new Float32Array(contrailCount * 3);
    const contrailSizes = new Float32Array(contrailCount);

    for (let i = 0; i < contrailCount; i++) {
      const side = i % 2 === 0 ? 2.2 : -2.2;
      const progress = i / contrailCount;
      contrailPos[i * 3] = side + (Math.random() - 0.5) * (0.2 + progress * 0.8);
      contrailPos[i * 3 + 1] = -0.65 + (Math.random() - 0.5) * (0.2 + progress * 0.6);
      contrailPos[i * 3 + 2] = -0.6 - progress * 24;
      contrailSizes[i] = 0.3 + progress * 1.8;
    }
    contrailGeo.setAttribute('position', new THREE.BufferAttribute(contrailPos, 3));
    contrailGeo.setAttribute('size', new THREE.BufferAttribute(contrailSizes, 1));

    const contrailMat = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const contrailSystem = new THREE.Points(contrailGeo, contrailMat);
    aircraftRoot.add(contrailSystem);

    // --- 5. Volumetric Stratospheric 3D Cloud Layers ---
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.38
    });

    const cloudsList: THREE.Mesh[] = [];
    for (let c = 0; c < 34; c++) {
      const cloudPuffGeo = new THREE.DodecahedronGeometry(1.6, 1);
      const cloud = new THREE.Mesh(cloudPuffGeo, cloudMat);
      const scale = 1.0 + Math.random() * 3.2;
      cloud.scale.set(scale * 1.8, scale * 0.5, scale * 1.2);
      cloud.position.set(
        (Math.random() - 0.5) * 55,
        -4.0 - Math.random() * 5.0,
        (Math.random() - 0.5) * 70
      );
      cloudsGroup.add(cloud);
      cloudsList.push(cloud);
    }
    scene.add(cloudsGroup);

    // --- 6. 3D Global Radar Mode (Detailed Glowing Earth) ---
    const globeGroup = new THREE.Group();

    const earthGeo = new THREE.SphereGeometry(3.8, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0a1e3f,
      roughness: 0.5,
      metalness: 0.3
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Glowing Wireframe Continents Grid
    const wireGeo = new THREE.SphereGeometry(3.83, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const earthWire = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(earthWire);

    // Outer Atmosphere Halo
    const atmosGeo = new THREE.SphereGeometry(4.2, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Curved Flight Arcs
    const createArc = (p1: THREE.Vector3, p2: THREE.Vector3, color: number) => {
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(4.85);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const pts = curve.getPoints(50);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color, linewidth: 2, transparent: true, opacity: 0.9 });
      return new THREE.Line(geo, mat);
    };

    const hubTRZ = new THREE.Vector3(2.7, 0.7, 2.5).normalize().multiplyScalar(3.84);
    const hubDXB = new THREE.Vector3(1.9, 1.6, 2.8).normalize().multiplyScalar(3.84);
    const hubDOH = new THREE.Vector3(1.6, 1.7, 2.9).normalize().multiplyScalar(3.84);
    const hubSIN = new THREE.Vector3(3.3, 0.1, 1.8).normalize().multiplyScalar(3.84);

    globeGroup.add(createArc(hubTRZ, hubDXB, 0xf59e0b)); // Gold
    globeGroup.add(createArc(hubTRZ, hubDOH, 0xdc2626));  // Red
    globeGroup.add(createArc(hubTRZ, hubSIN, 0x10b981)); // Emerald

    // Airport Pulse Markers
    const markerGeo = new THREE.SphereGeometry(0.12, 16, 16);
    [hubTRZ, hubDXB, hubDOH, hubSIN].forEach((pos, i) => {
      const marker = new THREE.Mesh(
        markerGeo,
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xf59e0b : 0x38bdf8 })
      );
      marker.position.copy(pos);
      globeGroup.add(marker);
    });

    globeGroup.visible = false;
    scene.add(globeGroup);

    // --- 7. Mouse Steering & Aerodynamic Physics ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.75;
      targetRotationX = y * 0.45;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // --- 8. Animation & Opening Takeoff Sequence ---
    let lastTime = performance.now();
    const startTime = performance.now();
    let openingTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      openingTime += delta;

      const speedMult = flightSpeedRef.current === 'supersonic' ? 2.4 : 1.0;
      const isAircraftMode = activeModeRef.current === 'aircraft';

      aircraftRoot.visible = isAircraftMode;
      cloudsGroup.visible = isAircraftMode;
      globeGroup.visible = !isAircraftMode;

      if (!isPausedRef.current) {
        // Fast spinning turbine blades
        fanBladeGroup.rotation.z += 0.8 * speedMult;
        leftFanBladeGroup.rotation.z += 0.8 * speedMult;

        if (isAircraftMode) {
          // Opening Cinematic Climb Sequence (From 0s to 3s, plane ascends into position)
          if (openingTime < 3.0) {
            const t = Math.min(openingTime / 3.0, 1.0);
            const easeOut = 1 - Math.pow(1 - t, 3);
            aircraftRoot.position.y = -3.0 + easeOut * 3.0;
            aircraftRoot.position.z = 10 - easeOut * 10;
            aircraftRoot.rotation.x = -0.15 * (1 - easeOut);
          } else {
            // Smooth Flight Dynamics
            currentRotationX += (targetRotationX - currentRotationX) * 0.06;
            currentRotationY += (targetRotationY - currentRotationY) * 0.06;

            const oscillation = Math.sin(elapsed * 1.6 * speedMult) * 0.1;
            const bankingRoll = -currentRotationY * 0.95 + Math.cos(elapsed * 1.3) * 0.04;

            aircraftRoot.rotation.x = -currentRotationX * 0.5 + oscillation * 0.2;
            aircraftRoot.rotation.y = currentRotationY * 0.85;
            aircraftRoot.rotation.z = bankingRoll;
            aircraftRoot.position.y = Math.sin(elapsed * 2.2 * speedMult) * 0.22;
          }

          // Dynamic Camera Angles
          const currentCamView = cameraViewRef.current;
          if (currentCamView === 'chase') {
            camera.position.set(0, 3.2, 13.5);
            camera.lookAt(0, 0.4, 0);
          } else if (currentCamView === 'wing') {
            camera.position.set(2.8, 1.1, 4.2);
            camera.lookAt(1.2, -0.3, -2.0);
          } else if (currentCamView === 'front') {
            camera.position.set(0, 1.2, -12);
            camera.lookAt(0, 0, 0);
          }

          // Contrails streaming
          const posAttr = contrailGeo.attributes.position as THREE.BufferAttribute;
          const posArr = posAttr.array as Float32Array;
          for (let i = 0; i < contrailCount; i++) {
            posArr[i * 3 + 2] -= 0.42 * speedMult;
            if (posArr[i * 3 + 2] < -24) {
              posArr[i * 3 + 2] = -0.6;
            }
          }
          posAttr.needsUpdate = true;

          // Clouds streaming backward
          cloudsList.forEach((cloud) => {
            cloud.position.z += 0.35 * speedMult;
            if (cloud.position.z > 20) {
              cloud.position.z = -50;
              cloud.position.x = (Math.random() - 0.5) * 55;
            }
          });
        } else {
          // Globe Radar Mode
          camera.position.set(0, 1.4, 11.2);
          camera.lookAt(0, 0, 0);
          globeGroup.rotation.y += 0.007 * speedMult;
          globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, targetRotationX * 0.5, 0.05);
        }

        // Strobe and Nav Flash
        const strobePulse = Math.sin(elapsed * 8) > 0.7 ? 2.0 : 0.4;
        tailStrobe.scale.setScalar(strobePulse);
        beaconLight.scale.setScalar(strobePulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
      fuselageMat.dispose();
      darkTrimMat.dispose();
      chromeMat.dispose();
      royalBlueMat.dispose();
      mmsRedMat.dispose();
      goldAccentMat.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-[#071630] to-[#020b1a] border-2 border-blue-500/50 shadow-2xl ${className}`}>
      
      {/* Visual Stage Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 py-3 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent flex flex-wrap items-center justify-between gap-3 border-b border-white/10 backdrop-blur-xs">
        
        {/* Title & Live Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
              REALISTIC 3D FLIGHT SIM
            </span>
            <h3 className="text-xs sm:text-sm font-black text-white tracking-wide flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-amber-400 transform -rotate-45" />
              {activeMode === 'aircraft' ? 'MMS 3D Commercial Airliner Simulation' : 'MMS 3D Global Radar Flight Grid'}
            </h3>
          </div>
        </div>

        {/* View & Mode Controls */}
        <div className="flex items-center gap-2">
          
          {/* Camera Angles (When in aircraft mode) */}
          {activeMode === 'aircraft' && (
            <div className="hidden sm:flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700 text-xs">
              {(['chase', 'wing', 'front'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCameraView(mode)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    cameraView === mode ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}

          {/* Mode Switcher */}
          <button
            onClick={() => setActiveMode(activeMode === 'aircraft' ? 'globe' : 'aircraft')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-900/80 hover:bg-blue-800 text-blue-100 border border-blue-600/60 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {activeMode === 'aircraft' ? (
              <>
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">3D Globe Radar</span>
                <span className="sm:hidden">Globe</span>
              </>
            ) : (
              <>
                <Plane className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">3D Jet Simulation</span>
                <span className="sm:hidden">Aircraft</span>
              </>
            )}
          </button>

          {/* Speed Boost */}
          <button
            onClick={() => setFlightSpeed(flightSpeed === 'cruise' ? 'supersonic' : 'cruise')}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              flightSpeed === 'supersonic'
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Engine Speed"
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{flightSpeed === 'supersonic' ? '2.4x Boost' : 'Cruise'}</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer active:scale-95"
            title={isPaused ? 'Resume 3D flight' : 'Pause flight'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D Viewport */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[360px] sm:h-[430px] lg:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Dynamic Flight Data HUD */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white shadow-2xl">
          
          {/* Active Flight Telemetry */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 border border-blue-400/40 flex items-center justify-center text-amber-300 shadow-md shrink-0">
              <Navigation className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-amber-300">
                  {routesInfo[selectedRoute].flightNo}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800">
                  {routesInfo[selectedRoute].status}
                </span>
                <span className="text-[10px] text-sky-300 font-mono hidden md:inline">
                  {routesInfo[selectedRoute].alt} • {routesInfo[selectedRoute].mach}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-white">
                {routesInfo[selectedRoute].from} ✈ {routesInfo[selectedRoute].to}
              </p>
            </div>
          </div>

          {/* Route selector buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['trichy-dubai', 'chennai-doha', 'madurai-singapore'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoute(r)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer active:scale-95 ${
                  selectedRoute === r
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {r === 'trichy-dubai' ? 'TRZ ➔ DXB' : r === 'chennai-doha' ? 'MAA ➔ DOH' : 'IXM ➔ SIN'}
              </button>
            ))}

            {onExploreFlight && (
              <button
                onClick={onExploreFlight}
                className="ml-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-[11px] transition-all cursor-pointer shadow-md active:scale-95"
              >
                Book This Route
              </button>
            )}
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute top-16 left-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-slate-950/70 px-3.5 py-1.5 rounded-full border border-white/15 pointer-events-none backdrop-blur-xs shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Move cursor to steer & bank the 3D airliner with realistic physics</span>
        </div>
      </div>

    </div>
  );
};
