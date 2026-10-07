import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroAircraftScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x41c9e2, 2.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const blueRimLight = new THREE.PointLight(0x008dda, 3, 50);
    blueRimLight.position.set(-10, -5, 5);
    scene.add(blueRimLight);

    // Airplane Group
    const planeGroup = new THREE.Group();

    // Fuselage & Materials
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0xf8fafc,
      specular: 0x41c9e2,
      shininess: 90
    });
    const accentMat = new THREE.MeshPhongMaterial({
      color: 0x008dda,
      specular: 0xffffff,
      shininess: 100
    });
    const cockpitMat = new THREE.MeshPhongMaterial({
      color: 0x0b192c,
      shininess: 120,
      reflectivity: 0.9
    });

    // Main Cabin Body
    const fuselageGeo = new THREE.CylinderGeometry(0.55, 0.5, 4.8, 32);
    const fuselage = new THREE.Mesh(fuselageGeo, bodyMat);
    fuselage.rotation.x = Math.PI / 2;
    planeGroup.add(fuselage);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.55, 1.4, 32);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 3.1;
    planeGroup.add(nose);

    // Cockpit Glass
    const cockpitGeo = new THREE.SphereGeometry(0.38, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.35, 2.3);
    cockpit.scale.set(0.9, 0.7, 1.5);
    planeGroup.add(cockpit);

    // Tail Cone
    const tailConeGeo = new THREE.ConeGeometry(0.5, 1.6, 32);
    const tailCone = new THREE.Mesh(tailConeGeo, bodyMat);
    tailCone.rotation.x = Math.PI / 2;
    tailCone.position.z = -3.2;
    planeGroup.add(tailCone);

    // Main Wings (Extruded Airfoil Shape)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(4.8, -1.8);
    wingShape.lineTo(4.4, -2.4);
    wingShape.lineTo(0, -0.9);
    wingShape.closePath();

    const wingExtrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);

    // Right Wing
    const rightWing = new THREE.Mesh(wingGeo, accentMat);
    rightWing.rotation.x = Math.PI / 2;
    rightWing.position.set(0.2, 0, 0.6);
    planeGroup.add(rightWing);

    // Left Wing
    const leftWing = new THREE.Mesh(wingGeo, accentMat);
    leftWing.rotation.x = Math.PI / 2;
    leftWing.scale.x = -1;
    leftWing.position.set(-0.2, 0, 0.6);
    planeGroup.add(leftWing);

    // Vertical Stabilizer (Tail Fin)
    const tailFinShape = new THREE.Shape();
    tailFinShape.moveTo(0, 0);
    tailFinShape.lineTo(0, 1.8);
    tailFinShape.lineTo(1.1, 1.7);
    tailFinShape.lineTo(1.6, 0);
    tailFinShape.closePath();
    const tailFinGeo = new THREE.ExtrudeGeometry(tailFinShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02
    });
    const tailFin = new THREE.Mesh(tailFinGeo, accentMat);
    tailFin.rotation.y = -Math.PI / 2;
    tailFin.position.set(0.03, 0.45, -3.4);
    planeGroup.add(tailFin);

    // Horizontal Stabilizers
    const horizTailGeo = new THREE.BoxGeometry(2.4, 0.06, 0.7);
    const horizTail = new THREE.Mesh(horizTailGeo, bodyMat);
    horizTail.position.set(0, 0.3, -3.2);
    planeGroup.add(horizTail);

    // Jet Engines (under wings)
    const engineGeo = new THREE.CylinderGeometry(0.24, 0.22, 1.1, 24);
    const engineMat = new THREE.MeshPhongMaterial({ color: 0x334155, shininess: 80 });

    const rightEngine = new THREE.Mesh(engineGeo, engineMat);
    rightEngine.rotation.x = Math.PI / 2;
    rightEngine.position.set(1.6, -0.4, 0.3);
    planeGroup.add(rightEngine);

    const leftEngine = new THREE.Mesh(engineGeo, engineMat);
    leftEngine.rotation.x = Math.PI / 2;
    leftEngine.position.set(-1.6, -0.4, 0.3);
    planeGroup.add(leftEngine);

    // Jet glow cones
    const glowGeo = new THREE.ConeGeometry(0.18, 0.9, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
    const rGlow = new THREE.Mesh(glowGeo, glowMat);
    rGlow.rotation.x = -Math.PI / 2;
    rGlow.position.set(1.6, -0.4, -0.7);
    planeGroup.add(rGlow);

    const lGlow = new THREE.Mesh(glowGeo, glowMat);
    lGlow.rotation.x = -Math.PI / 2;
    lGlow.position.set(-1.6, -0.4, -0.7);
    planeGroup.add(lGlow);

    scene.add(planeGroup);

    // Stylized Orbit Flight Rings
    const ringGeo = new THREE.TorusGeometry(6.5, 0.04, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x008dda, transparent: true, opacity: 0.4 });
    const orbitRing1 = new THREE.Mesh(ringGeo, ringMat);
    orbitRing1.rotation.x = 1.1;
    orbitRing1.rotation.y = 0.4;
    scene.add(orbitRing1);

    const ringGeo2 = new THREE.TorusGeometry(8.0, 0.03, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x41c9e2, transparent: true, opacity: 0.25 });
    const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    orbitRing2.rotation.x = -0.9;
    orbitRing2.rotation.y = -0.6;
    scene.add(orbitRing2);

    // Ambient floating particles (stars / stratospheric crystals)
    const particlesCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 30;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x008dda,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    // Interactive mouse controls
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const startTime = performance.now();
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Gentle banking and floating motion
      planeGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.4 + (-targetY * 1.2);
      planeGroup.position.x = Math.cos(elapsedTime * 1.0) * 0.3 + (targetX * 2.0);

      // Plane yaw, roll, and pitch response
      planeGroup.rotation.y = Math.PI * 0.85 + (targetX * 0.6) + Math.sin(elapsedTime * 0.8) * 0.1;
      planeGroup.rotation.z = (-targetX * 0.45) + Math.sin(elapsedTime * 1.5) * 0.08;
      planeGroup.rotation.x = 0.2 + (targetY * 0.35) + Math.cos(elapsedTime * 1.2) * 0.05;

      orbitRing1.rotation.z += 0.003;
      orbitRing2.rotation.z -= 0.002;
      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full min-h-[580px] pointer-events-auto z-10"
      style={{ display: 'block' }}
    />
  );
};
