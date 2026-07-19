import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function SpaceExplorer() {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [layerLabel, setLayerLabel] = useState('Solar System');
  const labelRef = useRef('Solar System'); // For fast access in requestAnimationFrame

  useEffect(() => {
    if (!containerRef.current || !isPlaying) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030303");

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      5000000 // 5 million units for Multiverse
    );
    camera.position.set(0, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 2500000;
    controls.enabled = isPlaying;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 0, 0); // No decay
    scene.add(pointLight);

    // --- Layer Groups ---
    const solarGroup = new THREE.Group();
    const milkyWayGroup = new THREE.Group();
    const virgoGroup = new THREE.Group();
    const laniakeaGroup = new THREE.Group();
    const observableGroup = new THREE.Group();
    const multiverseGroup = new THREE.Group();

    scene.add(solarGroup);
    scene.add(milkyWayGroup);
    scene.add(virgoGroup);
    scene.add(laniakeaGroup);
    scene.add(observableGroup);
    scene.add(multiverseGroup);

    // ==========================================
    // 1. SOLAR SYSTEM (0 - 1,000)
    // ==========================================
    const sunGeo = new THREE.SphereGeometry(8, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    solarGroup.add(sun);

    const planets = [];
    const planetData = [
      { color: 0x888888, size: 1.5, dist: 15, speed: 0.04 }, // Mercury
      { color: 0xe3bb76, size: 2.5, dist: 25, speed: 0.015 }, // Venus
      { color: 0x2b82c9, size: 3, dist: 35, speed: 0.01 }, // Earth
      { color: 0xc1440e, size: 2, dist: 45, speed: 0.008 }, // Mars
      { color: 0xd8ca9d, size: 6, dist: 65, speed: 0.002 }, // Jupiter
      { color: 0xead6b8, size: 5, dist: 85, speed: 0.0015 }, // Saturn
    ];

    planetData.forEach((data) => {
      const orbitGeo = new THREE.RingGeometry(data.dist - 0.1, data.dist + 0.1, 64);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
      const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
      orbitRing.rotation.x = Math.PI / 2;
      solarGroup.add(orbitRing);

      const group = new THREE.Group();
      solarGroup.add(group);
      
      const geo = new THREE.SphereGeometry(data.size, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.8, metalness: 0.2 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = data.dist;

      if (data.size === 5) { // Saturn Ring
        const ringGeo = new THREE.RingGeometry(6, 10, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xa9a59c, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2 + 0.2;
        mesh.add(ring);
      }
      group.add(mesh);
      planets.push({ group, speed: data.speed, mesh });
    });

    // Local Stars for Solar System
    const localStarsGeo = new THREE.BufferGeometry();
    const localStarsPos = new Float32Array(500 * 3);
    for (let i = 0; i < 500 * 3; i++) localStarsPos[i] = (Math.random() - 0.5) * 800;
    localStarsGeo.setAttribute("position", new THREE.BufferAttribute(localStarsPos, 3));
    const localStarsMat = new THREE.PointsMaterial({ size: 0.5, color: 0xffffff, transparent: true, opacity: 1 });
    const localStars = new THREE.Points(localStarsGeo, localStarsMat);
    solarGroup.add(localStars);


    // ==========================================
    // 2. THE MILKY WAY (1,000 - 10,000)
    // ==========================================
    const mwGeo = new THREE.BufferGeometry();
    const mwCount = 15000;
    const mwPos = new Float32Array(mwCount * 3);
    const mwColors = new Float32Array(mwCount * 3);
    for (let i = 0; i < mwCount; i++) {
      const radius = Math.random() * 4000 + 100;
      const angle = (radius * 0.001) + (Math.random() * Math.PI * 2);
      mwPos[i*3] = Math.cos(angle) * radius;
      mwPos[i*3+1] = (Math.random() - 0.5) * (100000 / radius);
      mwPos[i*3+2] = Math.sin(angle) * radius;
      
      const mix = Math.min(radius / 4000, 1);
      mwColors[i*3] = 0.5 + mix * 0.5;
      mwColors[i*3+1] = 0.5 - mix * 0.2;
      mwColors[i*3+2] = 1.0 - mix * 0.5;
    }
    mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
    mwGeo.setAttribute('color', new THREE.BufferAttribute(mwColors, 3));
    // The "other dots"
    const mwMat = new THREE.PointsMaterial({ size: 10, vertexColors: true, transparent: true, opacity: 0, depthWrite: false });
    const milkyWay = new THREE.Points(mwGeo, mwMat);
    milkyWayGroup.add(milkyWay);


    // ==========================================
    // 3. VIRGO SUPERCLUSTER (10,000 - 50,000)
    // ==========================================
    const virgoGeo = new THREE.BufferGeometry();
    const virgoCount = 5000;
    const virgoPos = new Float32Array(virgoCount * 3);
    for (let i = 0; i < virgoCount * 3; i++) virgoPos[i] = (Math.random() - 0.5) * 40000;
    virgoGeo.setAttribute('position', new THREE.BufferAttribute(virgoPos, 3));
    const virgoMat = new THREE.PointsMaterial({ size: 100, color: 0x48cae4, transparent: true, opacity: 0, depthWrite: false });
    const virgoCluster = new THREE.Points(virgoGeo, virgoMat);
    virgoGroup.add(virgoCluster);


    // ==========================================
    // 4. LANIAKEA SUPERCLUSTER (50,000 - 200,000)
    // ==========================================
    const laniakeaGeo = new THREE.BufferGeometry();
    const laniakeaCount = 8000;
    const laniakeaPos = new Float32Array(laniakeaCount * 3);
    for (let i = 0; i < laniakeaCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 150000;
      
      // clump towards axes to form a rough web
      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta);
      let z = r * Math.cos(phi);
      if (Math.random() > 0.5) x *= 0.1;
      else if (Math.random() > 0.5) y *= 0.1;
      else z *= 0.1;

      laniakeaPos[i*3] = x;
      laniakeaPos[i*3+1] = y;
      laniakeaPos[i*3+2] = z;
    }
    laniakeaGeo.setAttribute('position', new THREE.BufferAttribute(laniakeaPos, 3));
    const laniakeaMat = new THREE.PointsMaterial({ size: 400, color: 0xffb703, transparent: true, opacity: 0, depthWrite: false });
    const laniakea = new THREE.Points(laniakeaGeo, laniakeaMat);
    laniakeaGroup.add(laniakea);


    // ==========================================
    // 5. OBSERVABLE UNIVERSE (200,000 - 1,000,000)
    // ==========================================
    const obsGeo = new THREE.BufferGeometry();
    const obsCount = 20000;
    const obsPos = new Float32Array(obsCount * 3);
    const obsColors = new Float32Array(obsCount * 3);
    for (let i = 0; i < obsCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 300000 + (Math.random() * 5000 - 2500); // slight depth variation
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      obsPos[i*3] = x;
      obsPos[i*3+1] = y;
      obsPos[i*3+2] = z;

      // Color splotches based on sine waves mimicking heat map (red, orange, yellow, blue)
      const noise = Math.sin(x / 30000) * Math.cos(y / 30000) * Math.sin(z / 30000);
      let rC, gC, bC;
      if (noise > 0.5) { // Red/Orange (hot)
        rC = 1.0; gC = 0.3; bC = 0.1;
      } else if (noise > 0) { // Yellow (warm)
        rC = 1.0; gC = 0.8; bC = 0.2;
      } else if (noise > -0.5) { // Cyan (cool)
        rC = 0.2; gC = 0.8; bC = 0.8;
      } else { // Dark Blue (cold)
        rC = 0.1; gC = 0.2; bC = 0.6;
      }
      
      obsColors[i*3] = rC;
      obsColors[i*3+1] = gC;
      obsColors[i*3+2] = bC;
    }
    obsGeo.setAttribute('position', new THREE.BufferAttribute(obsPos, 3));
    obsGeo.setAttribute('color', new THREE.BufferAttribute(obsColors, 3));
    const obsMat = new THREE.PointsMaterial({ size: 3000, vertexColors: true, transparent: true, opacity: 0, depthWrite: false });
    const obsUniverse = new THREE.Points(obsGeo, obsMat);
    observableGroup.add(obsUniverse);


    // ==========================================
    // 6. THE MULTIVERSE (1,000,000+)
    // ==========================================
    // Bubble-like floating spheres containing distinct colors
    const multiCount = 100;
    const bubbles = [];
    const multiColors = [0xff0044, 0x00ff88, 0x0088ff, 0xff8800, 0xbb00ff];
    for (let i = 0; i < multiCount; i++) {
      const bGeo = new THREE.SphereGeometry(20000 + Math.random() * 30000, 32, 32);
      const bColor = multiColors[Math.floor(Math.random() * multiColors.length)];
      const bMat = new THREE.MeshBasicMaterial({
        color: bColor,
        transparent: true,
        opacity: 0,
        wireframe: Math.random() > 0.7,
        blending: THREE.AdditiveBlending
      });
      const bubble = new THREE.Mesh(bGeo, bMat);
      
      const dist = 1200000 + Math.random() * 1000000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bubble.position.x = dist * Math.sin(phi) * Math.cos(theta);
      bubble.position.y = dist * Math.sin(phi) * Math.sin(theta);
      bubble.position.z = dist * Math.cos(phi);
      
      multiverseGroup.add(bubble);
      bubbles.push(bubble);
    }


    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation & LOD Loop ---
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (controls.enabled) controls.update();

      // Rotate planets
      planets.forEach((p) => {
        p.group.rotation.y += p.speed;
        p.mesh.rotation.y += 0.01;
      });
      
      // Rotate galaxies slowly
      milkyWayGroup.rotation.y += 0.0005;
      laniakeaGroup.rotation.z += 0.0001;

      // === OPACITY & LOD LOGIC BASED ON DISTANCE ===
      const dist = camera.position.length();
      
      let currentLabel = 'Solar System';

      // 1. Solar System (Fades out past 2000)
      const solarOp = Math.max(0, 1 - (dist / 2000));
      solarGroup.children.forEach(c => {
        if (c.material) c.material.opacity = (c === sun ? solarOp : solarOp * 0.2); 
        if (c === localStars) c.material.opacity = solarOp;
      });

      // 2. Milky Way (Fades in 1000-3000, Fades out 10000-15000)
      if (dist > 1000) currentLabel = 'The Milky Way';
      let mwOp = 0;
      if (dist > 1000 && dist < 15000) {
        if (dist < 3000) mwOp = (dist - 1000) / 2000;
        else if (dist > 10000) mwOp = 1 - ((dist - 10000) / 5000);
        else mwOp = 1;
      }
      mwMat.opacity = mwOp * 0.8;

      // 3. Virgo Supercluster (Fades in 10000-20000, Fades out 40000-60000)
      if (dist > 15000) currentLabel = 'Virgo Supercluster';
      let virgoOp = 0;
      if (dist > 10000 && dist < 60000) {
        if (dist < 20000) virgoOp = (dist - 10000) / 10000;
        else if (dist > 40000) virgoOp = 1 - ((dist - 40000) / 20000);
        else virgoOp = 1;
      }
      virgoMat.opacity = virgoOp * 0.6;

      // 4. Laniakea (Fades in 40000-60000, Fades out 150000-250000)
      if (dist > 60000) currentLabel = 'Laniakea Supercluster';
      let lanOp = 0;
      if (dist > 40000 && dist < 250000) {
        if (dist < 60000) lanOp = (dist - 40000) / 20000;
        else if (dist > 150000) lanOp = 1 - ((dist - 150000) / 100000);
        else lanOp = 1;
      }
      laniakeaMat.opacity = lanOp * 0.5;

      // 5. Observable Universe (Fades in 150000-300000, Fades out 800000-1000000)
      if (dist > 250000) currentLabel = 'Observable Universe';
      let obsOp = 0;
      if (dist > 150000 && dist < 1200000) {
        if (dist < 300000) obsOp = (dist - 150000) / 150000;
        else if (dist > 800000) obsOp = 1 - ((dist - 800000) / 400000);
        else obsOp = 1;
      }
      obsMat.opacity = obsOp * 0.15; // Keep wireframe faint

      // 6. The Multiverse (Fades in 800000+)
      if (dist > 1000000) currentLabel = 'The Multiverse';
      let multiOp = 0;
      if (dist > 800000) {
        multiOp = Math.min(1, (dist - 800000) / 400000);
      }
      bubbles.forEach((b, i) => {
        // Pulse bubbles
        b.material.opacity = multiOp * (0.3 + 0.2 * Math.sin(Date.now() * 0.001 + i));
        b.rotation.y += 0.005;
      });

      // Update Label UI if changed
      if (labelRef.current !== currentLabel) {
        labelRef.current = currentLabel;
        setLayerLabel(currentLabel);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isPlaying]);

  return (
    <div 
      id="gameContainer"
      className="flex-1 w-full relative flex items-center justify-center cursor-pointer overflow-hidden p-0 touch-none bg-[#030303]"
      onClick={() => { if (!isPlaying) setIsPlaying(true) }}
    >
      <div ref={containerRef} className="w-full h-full absolute inset-0"></div>
      
      {/* Dynamic Scale Label */}
      {isPlaying && (
         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-brand/30 text-white px-6 py-2 rounded-full font-mono text-xs tracking-widest uppercase z-20 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all pointer-events-none">
           {layerLabel}
         </div>
      )}

      {/* Start Overlay */}
      {!isPlaying && (
        <div id="gameOverlay" className="absolute inset-0 bg-pure-black/80 flex flex-col items-center justify-center text-brand font-mono transition-opacity backdrop-blur-sm z-10">
          <i className="fas fa-rocket text-4xl mb-3 animate-pulse"></i>
          <span className="text-lg font-bold">Space Explorer</span>
          <span className="text-xs text-brand/60 mt-2 tracking-widest uppercase">Click to Launch</span>
          <span className="text-[10px] text-gray-500 mt-6 max-w-xs text-center leading-relaxed hidden sm:block">Use scroll/pinch to zoom from the Solar System to The Multiverse</span>
        </div>
      )}
    </div>
  );
}
