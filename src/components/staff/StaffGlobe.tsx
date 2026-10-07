import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface RoutePoint {
  name: string;
  code: string;
  lat: number;
  lng: number;
}

const HUBS: RoutePoint[] = [
  { name: 'Chennai', code: 'MAA', lat: 13.0827, lng: 80.2707 },
  { name: 'Trichy', code: 'TRZ', lat: 10.7905, lng: 78.7047 },
  { name: 'Madurai', code: 'IXM', lat: 9.8345, lng: 78.0934 },
  { name: 'Dubai', code: 'DXB', lat: 25.2532, lng: 55.3657 },
  { name: 'Sharjah', code: 'SHJ', lat: 25.3286, lng: 55.5172 },
  { name: 'Doha', code: 'DOH', lat: 25.2731, lng: 51.6081 },
  { name: 'Singapore', code: 'SIN', lat: 1.3502, lng: 103.9944 },
  { name: 'Kuala Lumpur', code: 'KUL', lat: 2.7456, lng: 101.7072 },
  { name: 'Colombo', code: 'CMB', lat: 6.9271, lng: 79.8612 },
  { name: 'Bangkok', code: 'BKK', lat: 13.6900, lng: 100.7501 }
];

const FLIGHT_ROUTES = [
  { from: 'MAA', to: 'DXB', airline: 'EK / 6E', color: 0x38bdf8 },
  { from: 'TRZ', to: 'DXB', airline: 'IndiGo 6E', color: 0x60a5fa },
  { from: 'TRZ', to: 'SHJ', airline: 'Air India Express', color: 0xf59e0b },
  { from: 'MAA', to: 'SIN', airline: 'Singapore Air', color: 0x34d399 },
  { from: 'TRZ', to: 'SIN', airline: 'Scoot TR', color: 0x38bdf8 },
  { from: 'MAA', to: 'KUL', airline: 'Malaysia Airlines', color: 0xa78bfa },
  { from: 'IXM', to: 'CMB', airline: 'FitsAir / SriLankan', color: 0xec4899 },
  { from: 'MAA', to: 'DOH', airline: 'Qatar Airways', color: 0xf43f5e }
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const StaffGlobe: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoute, setActiveRoute] = useState<string>('TRZ → DXB (IndiGo)');
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsLowPower(true);
    }

    const container = containerRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    container.appendChild(renderer.domElement);

    const globeRadius = 75;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Focus camera initially onto South Asia & Gulf
    globeGroup.rotation.y = -1.4;
    globeGroup.rotation.x = 0.28;

    // 1. Globe Sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: isDark ? 0x071126 : 0x0a193d,
      emissive: isDark ? 0x040a18 : 0x051329,
      specular: 0x1e3a8a,
      shininess: 25,
      transparent: true,
      opacity: 0.95
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // 2. Subtle Wireframe Latitude/Longitude Grid
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius * 1.002, 24, 18));
    const wireMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x1e3a8a : 0x38bdf8,
      transparent: true,
      opacity: isDark ? 0.2 : 0.25
    });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    globeGroup.add(wireLines);

    // 3. Atmosphere Outer Glow
    const haloGeo = new THREE.SphereGeometry(globeRadius * 1.08, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    dirLight.position.set(120, 100, 150);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2, 200);
    rimLight.position.set(-100, -80, -50);
    scene.add(rimLight);

    // 5. Hub Pins
    const hubMap = new Map<string, THREE.Vector3>();
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    HUBS.forEach((hub) => {
      const pos = latLngToVector3(hub.lat, hub.lng, globeRadius);
      hubMap.set(hub.code, pos);

      // Dot
      const dotGeo = new THREE.SphereGeometry(1.6, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({
        color: hub.code === 'TRZ' || hub.code === 'MAA' ? 0xf59e0b : 0x38bdf8
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      pinGroup.add(dot);

      // Subtle pulse ring
      const ringGeo = new THREE.RingGeometry(2.0, 2.6, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.008));
      ring.lookAt(pos.clone().multiplyScalar(2));
      pinGroup.add(ring);
    });

    // 6. Arcs and Moving Aircraft
    interface AnimatedFlight {
      curve: THREE.CubicBezierCurve3;
      planeMesh: THREE.Mesh;
      progress: number;
      speed: number;
      routeLabel: string;
    }

    const flights: AnimatedFlight[] = [];

    FLIGHT_ROUTES.forEach((route, idx) => {
      const p1 = hubMap.get(route.from);
      const p2 = hubMap.get(route.to);
      if (!p1 || !p2) return;

      const distance = p1.distanceTo(p2);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      // Elevation proportional to distance
      const elevation = globeRadius + Math.min(distance * 0.38, 28);
      mid.normalize().multiplyScalar(elevation);

      // Control points for smooth bezier curve
      const cp1 = p1.clone().lerp(mid, 0.6).normalize().multiplyScalar(elevation * 0.96);
      const cp2 = p2.clone().lerp(mid, 0.6).normalize().multiplyScalar(elevation * 0.96);

      const curve = new THREE.CubicBezierCurve3(p1, cp1, cp2, p2);
      const points = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: route.color,
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      globeGroup.add(lineMesh);

      // Aircraft marker (Cone representing plane with directional heading)
      const planeGeo = new THREE.ConeGeometry(1.6, 4.2, 6);
      planeGeo.rotateX(Math.PI / 2);
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      globeGroup.add(planeMesh);

      flights.push({
        curve,
        planeMesh,
        progress: (idx * 0.22) % 1.0,
        speed: 0.0018 + (idx % 3) * 0.0006,
        routeLabel: `${route.from} → ${route.to} (${route.airline})`
      });
    });

    // 7. Mouse Interaction (Gentle drag to rotate)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.006;
      globeGroup.rotation.x += deltaY * 0.006;
      // Clamp x
      globeGroup.rotation.x = Math.max(-0.6, Math.min(0.8, globeGroup.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop with Visibility Optimization
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      // Slow drift if not dragging
      if (!isDragging) {
        globeGroup.rotation.y += 0.0008;
      }

      // Update planes along routes
      flights.forEach((f, idx) => {
        f.progress += f.speed;
        if (f.progress >= 1.0) {
          f.progress = 0;
          if (idx === 0) {
            setActiveRoute(f.routeLabel);
          }
        }

        const currentPos = f.curve.getPointAt(f.progress);
        f.planeMesh.position.copy(currentPos);

        // Orient toward tangent
        const tangent = f.curve.getTangentAt(f.progress).normalize();
        f.planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
    };
  }, [isDark]);

  return (
    <div className="relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden flex flex-col items-center justify-center select-none group">
      {/* 3D Canvas Mount */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center" 
        title="Interactive 3D Operations Globe (Drag to rotate)"
      />

      {/* Subtle HUD Overlay */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] pointer-events-none">
        <div className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-mono">{activeRoute}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
          <span>South Asia • Gulf • ASEAN Corridor</span>
        </div>
      </div>
    </div>
  );
};
