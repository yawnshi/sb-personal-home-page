import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import "../App.css"; // For the glass-shake animation

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [warningText, setWarningText] = useState("");
  const [warningColor, setWarningColor] = useState("text-red-500");
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    // === Canvas Animation ===

    // --- HTML5 Canvas Network Animation ---
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    let numParticles = 100;

    // Resize canvas
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (window.innerWidth < 768) {
        numParticles = 50;
      } else {
        numParticles = 120;
      }
      initParticles();
    }

    // Mouse interaction
    let mouse = {
      x: null,
      y: null,
      radius: 150,
    };

    window.addEventListener("mousemove", function (event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    window.addEventListener("mouseout", function () {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener("resize", setCanvasSize);

    // Particle Class
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseSize = size;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Check collision/distance from mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          // Slight repel effect and glow
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;

          this.x -= forceDirectionX * force * 2;
          this.y -= forceDirectionY * force * 2;
          this.size = this.baseSize * 2;
        } else {
          this.size = this.baseSize;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < numParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
        let directionX = Math.random() * 1 - 0.5;
        let directionY = Math.random() * 1 - 0.5;
        let color = "rgba(16, 185, 129, 0.4)"; // Brand color

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Draw connections between particles
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance =
            (particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) +
            (particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y);

          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - distance / 20000;
            ctx.strokeStyle = "rgba(16, 185, 129," + opacityValue * 0.3 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesArray.forEach((particle) => {
        particle.update();
      });
      connect();
    }

    // Start animations
    setCanvasSize();
    animate();

    // --- 3D Space Explorer Logic ---
    const spaceContainer = document.getElementById("canvas-container");
    const gameContainer = document.getElementById("gameContainer");
    const gameOverlay = document.getElementById("gameOverlay");

    let spaceScene, spaceCamera, spaceRenderer, orbitControls;
    let planets = [];
    let isSpacePlaying = false;

    function initSpace() {
      spaceScene = new THREE.Scene();
      spaceScene.background = new THREE.Color("#050505");

      spaceCamera = new THREE.PerspectiveCamera(
        45,
        spaceContainer.clientWidth / spaceContainer.clientHeight,
        0.1,
        1000,
      );
      // Position camera to view the system nicely
      spaceCamera.position.set(0, 50, 100);

      spaceRenderer = new THREE.WebGLRenderer({ antialias: true });
      spaceRenderer.setSize(spaceContainer.clientWidth, spaceContainer.clientHeight);
      spaceContainer.appendChild(spaceRenderer.domElement);

      orbitControls = new OrbitControls(spaceCamera, spaceRenderer.domElement);
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.05;
      orbitControls.enabled = false; // Disable until clicked

      // Lights
      const ambientLight = new THREE.AmbientLight(0x333333);
      spaceScene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 2, 300);
      spaceScene.add(pointLight);

      const sunGeo = new THREE.SphereGeometry(8, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      spaceScene.add(sun);

      // Planets Data (Color, Size, Distance, Orbit Speed)
      const planetData = [
        { color: 0x888888, size: 1.5, dist: 15, speed: 0.04 }, // Mercury
        { color: 0xe3bb76, size: 2.5, dist: 25, speed: 0.015 }, // Venus
        { color: 0x2b82c9, size: 3, dist: 35, speed: 0.01 }, // Earth
        { color: 0xc1440e, size: 2, dist: 45, speed: 0.008 }, // Mars
        { color: 0xd8ca9d, size: 6, dist: 65, speed: 0.002 }, // Jupiter
        { color: 0xead6b8, size: 5, dist: 85, speed: 0.0015 }, // Saturn
      ];

      planetData.forEach((data) => {
        // Visual Orbit Ring matching brand color
        const orbitGeo = new THREE.RingGeometry(data.dist - 0.1, data.dist + 0.1, 64);
        const orbitMat = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        });
        const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
        orbitRing.rotation.x = Math.PI / 2;
        spaceScene.add(orbitRing);

        // Planet Group (Used for orbiting around the sun)
        const group = new THREE.Group();
        spaceScene.add(group);

        // Planet Mesh (Used for appearance and rotating on own axis)
        const geo = new THREE.SphereGeometry(data.size, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: data.color,
          roughness: 0.8,
          metalness: 0.2,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = data.dist;

        // Add Saturn's Ring
        if (data.size === 5) {
          const ringGeo = new THREE.RingGeometry(6, 10, 32);
          const ringMat = new THREE.MeshStandardMaterial({
            color: 0xa9a59c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2 + 0.2; // Tilt ring
          mesh.add(ring);
        }

        group.add(mesh);
        planets.push({ group, speed: data.speed, mesh });
      });

      const starsGeo = new THREE.BufferGeometry();
      const starsCount = 500;
      const posArray = new Float32Array(starsCount * 3);
      for (let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 400; // Spread randomly
      }
      starsGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      const starsMat = new THREE.PointsMaterial({ size: 0.5, color: 0xffffff });
      const stars = new THREE.Points(starsGeo, starsMat);
      spaceScene.add(stars);

      // Handle resize events cleanly inside the container
      window.addEventListener("resize", () => {
        if (spaceContainer && spaceCamera && spaceRenderer) {
          spaceCamera.aspect = spaceContainer.clientWidth / spaceContainer.clientHeight;
          spaceCamera.updateProjectionMatrix();
          spaceRenderer.setSize(spaceContainer.clientWidth, spaceContainer.clientHeight);
        }
      });
    }

    let spaceAnimationId;
    function animateSpace() {
      spaceAnimationId = requestAnimationFrame(animateSpace);

      if (isSpacePlaying && orbitControls) {
        orbitControls.update();
      }

      // Rotate planets along their orbits and axes
      planets.forEach((p) => {
        p.group.rotation.y += p.speed;
        p.mesh.rotation.y += 0.01;
      });

      if (spaceRenderer && spaceScene && spaceCamera) {
        spaceRenderer.render(spaceScene, spaceCamera);
      }
    }

    // Initialize 3D Simulation securely on Window Load
    window.addEventListener("load", () => {
      initSpace();
      animateSpace();
    });

    // Bind play button interactions
    gameContainer.addEventListener("click", () => {
      if (!isSpacePlaying) {
        isSpacePlaying = true;
        gameOverlay.classList.add("hidden");
        if (orbitControls) orbitControls.enabled = true;
      }
    });

    // --- Smooth Scrolling & Disable URL Hash ---
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        // Prevent the default jump and URL hash update
        e.preventDefault();

        const targetId = this.getAttribute("href");

        if (targetId === "#") {
          // Scroll to top if href is just "#"
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            // Calculate offset for the fixed navbar
            const navHeight = document.getElementById("navbar").offsetHeight - 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      });
    });

    // === Smooth Scrolling ===
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const navHeight = document.getElementById("navbar").offsetHeight - 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      });
    });

    // === Easter Egg ===

    {
      const btnExit = document.getElementById("btn-exit");
      const btnMin = document.getElementById("btn-minimize");
      const btnMax = document.getElementById("btn-maximize");
      const overlay = document.getElementById("easterEggOverlay");
      const numberEl = document.getElementById("easterEggNumber");
      const textEl = document.getElementById("easterEggText");
      const gameContainer = document.getElementById("gameContainer");
      const terminalHeader = document.getElementById("terminal-header");

      let totalClicks = 0;
      let exitClicks = 0;
      let overlayTimeout = null;

      function showOverlay(number, text) {
        numberEl.textContent = number || "";
        textEl.textContent = text || "";
        overlay.classList.remove("opacity-0");
        overlay.classList.add("opacity-100");

        if (overlayTimeout) clearTimeout(overlayTimeout);
        overlayTimeout = setTimeout(() => {
          overlay.classList.remove("opacity-100");
          overlay.classList.add("opacity-0");
        }, 3000); // Hide after 3s
      }

      function handleButtonClick(e) {
        let text = "";
        let number = "";
        let shouldShow = false;

        if (e.target.id === "btn-exit") {
          exitClicks++;

          if (exitClicks === 3) {
            number = "3";
            text =
              "SYSTEM ALERT: Structural integrity of the viewing portal compromised. Cease interaction immediately!";
            shouldShow = true;
          } else if (exitClicks === 6) {
            number = "2";
            text = "The void stares back. Do not knock on the glass.";
            shouldShow = true;
          } else if (exitClicks === 9) {
            number = "1";
            text = "Ouch! That tickles. Seriously, these buttons are just for show!";
            shouldShow = true;
          } else if (exitClicks === 10) {
            // Trigger final easter egg
            if (terminalHeader) terminalHeader.style.display = "none";
            gameContainer.innerHTML =
              '<iframe src="https://farhanswitch.id" class="w-full h-full border-0 absolute inset-0 z-20"></iframe>';

            // Hide overlay if it's visible
            if (overlayTimeout) clearTimeout(overlayTimeout);
            overlay.classList.remove("opacity-100");
            overlay.classList.add("opacity-0");

            return; // Stop here
          }

          // Shaking effect on container
          gameContainer.classList.remove("animate-glass-shake");
          void gameContainer.offsetWidth; // trigger reflow
          gameContainer.classList.add("animate-glass-shake");

          // Add cracked glass SVG to the container
          let crackSvg = document.getElementById("windowCracks");
          if (!crackSvg) {
            crackSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            crackSvg.id = "windowCracks";
            crackSvg.style.position = "absolute";
            crackSvg.style.inset = "0";
            crackSvg.style.width = "100%";
            crackSvg.style.height = "100%";
            crackSvg.style.pointerEvents = "none";
            crackSvg.style.zIndex = "50";
            gameContainer.appendChild(crackSvg);
          }

          const w = gameContainer.offsetWidth || 500;
          const h = gameContainer.offsetHeight || 300;
          const x = Math.random() * w * 0.8 + w * 0.1;
          const y = Math.random() * h * 0.8 + h * 0.1;
          const numLines = Math.floor(Math.random() * 5) + 4;
          let paths = "";
          for (let i = 0; i < numLines; i++) {
            let currentX = x;
            let currentY = y;
            let d = `M ${currentX} ${currentY}`;
            const segments = Math.floor(Math.random() * 4) + 2;
            let angle = Math.random() * Math.PI * 2;

            for (let j = 0; j < segments; j++) {
              const length = Math.random() * 150 + 50;
              angle += (Math.random() - 0.5) * 1.2;
              currentX += Math.cos(angle) * length;
              currentY += Math.sin(angle) * length;
              d += ` L ${currentX} ${currentY}`;
            }
            paths += `<path d="${d}" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" fill="none" filter="drop-shadow(1px 1px 1px rgba(0,0,0,0.8))" />`;
            let branchX = x + Math.cos(angle) * 40;
            let branchY = y + Math.sin(angle) * 40;
            let branchAngle = angle + (Math.random() > 0.5 ? 1 : -1) * 0.8;
            let branchD = `M ${branchX} ${branchY} L ${branchX + Math.cos(branchAngle) * 80} ${branchY + Math.sin(branchAngle) * 80}`;
            paths += `<path d="${branchD}" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none" />`;
          }
          paths += `<circle cx="${x}" cy="${y}" r="2" fill="rgba(255,255,255,0.9)" />`;
          crackSvg.insertAdjacentHTML("beforeend", `<g class="crack-group">${paths}</g>`);

          if (shouldShow) {
            // Also shake the overlay
            overlay.classList.remove("animate-glass-shake");
            void overlay.offsetWidth;
            overlay.classList.add("animate-glass-shake");

            showOverlay(number, text);
          }
        } else if (e.target.id === "btn-maximize") {
          // Green button: recover completely
          exitClicks = 0;
          let crackSvg = document.getElementById("windowCracks");
          if (crackSvg) {
            crackSvg.innerHTML = "";
          }
        } else if (e.target.id === "btn-minimize") {
          // Yellow button: recover partially
          exitClicks = Math.max(0, exitClicks - 1);
          let crackSvg = document.getElementById("windowCracks");
          if (crackSvg) {
            const groups = crackSvg.querySelectorAll(".crack-group");
            if (groups.length > 0) {
              groups[groups.length - 1].remove();
            }
          }
        }
      }

      if (btnExit) btnExit.addEventListener("click", handleButtonClick);
      if (btnMin) btnMin.addEventListener("click", handleButtonClick);
      if (btnMax) btnMax.addEventListener("click", handleButtonClick);
    }

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      if (animationId) cancelAnimationFrame(animationId);
      if (spaceAnimationId) cancelAnimationFrame(spaceAnimationId);
      
      // Cleanup Three.js memory to prevent leaks
      if (spaceRenderer) spaceRenderer.dispose();
      if (spaceScene) {
        spaceScene.traverse((object) => {
          if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/*  Fixed Canvas for Animation Background on All Sections  */}
      <canvas id="particleCanvas" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"></canvas>

      <nav id="navbar" className="fixed w-full z-50 transition-all duration-300 py-4 glass">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative">
          {/*  Logo  */}
          <a href="#" className="text-2xl font-bold tracking-tighter relative z-10">
            <span className="text-white">SB</span>
            <span className="text-brand">.</span>
          </a>

          {/*  Navigation Links & Contact Button  */}
          <div className="hidden md:flex items-center justify-end space-x-8 relative z-10">
            <a
              href="#about"
              className="text-gray-300 hover:text-brand transition-colors text-sm font-medium uppercase tracking-widest relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-brand after:-bottom-1 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              About
            </a>
            <a
              href="#projects"
              className="text-gray-300 hover:text-brand transition-colors text-sm font-medium uppercase tracking-widest relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-brand after:-bottom-1 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              Projects
            </a>
            <a
              href="#skills"
              className="text-gray-300 hover:text-brand transition-colors text-sm font-medium uppercase tracking-widest relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-brand after:-bottom-1 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              Skills
            </a>
            <a
              href="#contact"
              className="inline-block text-brand border border-brand hover:bg-brand hover:text-pure-black px-5 py-2 rounded-full transition-all text-sm font-medium uppercase tracking-widest whitespace-nowrap"
            >
              Contact
            </a>
          </div>

          {/*  Mobile Menu Button  */}
          <div className="flex md:hidden items-center relative z-10">
            <button className="text-white focus:outline-none ml-4">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden z-10 py-24">
        <div className="text-center max-w-4xl mx-auto px-6 mt-16 pointer-events-none">
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Syamsul
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-dark">
              Bahtiar
            </span>
          </h1>
          <p
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            Web developer that specializes in building better digital experiences
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up pointer-events-auto"
            style={{ animationDelay: "0.8s" }}
          >
            <a
              href="#about"
              className="border border-gray-600 text-white font-bold px-8 py-4 rounded-full hover:border-brand hover:text-brand transition-all"
            >
              About Me
            </a>
            <a
              href="#projects"
              className="bg-brand text-pure-black font-bold px-8 py-4 rounded-full hover:bg-brand-light transition-all transform hover:scale-105"
            >
              View My Work
            </a>
          </div>
        </div>

        {/*  Scroll indicator  */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce pointer-events-none">
          <i className="fas fa-chevron-down text-brand-light text-xl"></i>
        </div>
      </section>

      <section id="about" className="relative min-h-screen flex items-center justify-center py-24 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="bg-off-black/80 backdrop-blur-md border border-brand/20 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.05)] flex flex-col md:flex-row items-center gap-16">
            {/*  Interactive Game Side  */}
            <div className="w-full md:w-1/2 relative group">
              {/*  Glow effect behind terminal  */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-dark to-brand rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-[#0d1117] rounded-xl border border-gray-800 shadow-2xl overflow-hidden h-full flex flex-col min-h-[445px]">
                {/*  Terminal Header  */}
                <div id="terminal-header" className="flex items-center px-4 py-3 bg-[#161b22] border-b border-gray-800">
                  <div className="flex space-x-2">
                    <div
                      id="btn-exit"
                      className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500 transition-colors relative z-20"
                    ></div>
                    <div
                      id="btn-minimize"
                      className="w-3 h-3 rounded-full bg-yellow-500/80 cursor-pointer hover:bg-yellow-500 transition-colors relative z-20"
                    ></div>
                    <div
                      id="btn-maximize"
                      className="w-3 h-3 rounded-full bg-green-500/80 cursor-pointer hover:bg-green-500 transition-colors relative z-20"
                    ></div>
                  </div>
                  <div className="mx-auto text-xs text-gray-400 font-mono tracking-wider">Space Explorer</div>
                  <div className="w-11"></div>
                  {/*  Spacer for centering  */}
                </div>

                {/*  Terminal Body / Game Container  */}
                <div
                  id="gameContainer"
                  className="flex-1 bg-pure-black relative flex items-center justify-center cursor-pointer overflow-hidden p-0 touch-none"
                >
                  {/*  Three.js Canvas Container  */}
                  <div id="canvas-container" className="w-full h-full absolute inset-0"></div>

                  {/*  Overlay: Start Screen  */}
                  <div
                    id="gameOverlay"
                    className="absolute inset-0 bg-pure-black/80 flex flex-col items-center justify-center text-brand font-mono transition-opacity backdrop-blur-sm z-10"
                  >
                    <i className="fas fa-rocket text-4xl mb-3 animate-pulse"></i>
                    <span className="text-lg font-bold">Space Explorer</span>
                    <span className="text-xs text-gray-400 mt-2 text-center px-4">Interactive 3D Solar System</span>
                    <span className="text-xs text-gray-500 mt-4 text-center px-4 font-bold border border-gray-700 rounded p-2 bg-gray-900/50">
                      🖱️ Drag to Rotate | 📜 Scroll to Zoom
                      <br />
                      👆 Swipe to Rotate | 🤏 Pinch to Zoom
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/*  Text side  */}
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-white">
                About <span className="text-brand">Me</span>
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                I am an experienced web developer with strong focus on User Experience (UX). Recognized for excellent
                problem-solving skills and a client-centered approach to design and development.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I specialize in modern web technologies, bridging the gap between beautiful design and robust
                engineering.
              </p>

              <p className="text-gray-300 mb-8 leading-relaxed">
                I also enjoy learning new things outside of my field, such as psychology and philosophy, surely through
                informal study. This curiosity drives me to better understand human behavior and apply that knowledge to
                create more intuitive and engaging digital experiences.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-brand pl-4">
                  <h3 className="text-3xl font-bold text-brand">5+</h3>
                  <p className="text-sm text-gray-400 font-medium">Years Experience</p>
                </div>

                <div className="flex items-center">
                  <Link to="/personal-space"
                    className="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-pure-black/60 border border-brand/30 text-white hover:border-brand hover:bg-brand hover:text-pure-black rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  >
                    <span className="font-bold text-sm tracking-widest uppercase">Personal Space</span>
                    <i className="fas fa-arrow-right text-brand group-hover:text-pure-black group-hover:translate-x-1 transition-all"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/*  NEW PROJECTS SECTION: Direct embedded HTML UIs without iframes  */}
      <section id="projects" className="relative min-h-screen flex items-center justify-center py-24 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="bg-off-black/80 backdrop-blur-md border border-brand/20 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">
                Featured <span className="text-brand">Projects</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                A selection of my recent work, showcasing a range of skills and technologies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/*  Project 1  */}
              <div className="bg-pure-black rounded-2xl overflow-hidden border border-brand-darker card-hover transition-all duration-300 group flex flex-col">
                {/*  Direct UI Preview  */}
                <div className="h-56 bg-gray-950 relative overflow-hidden flex items-center justify-center border-b border-brand/20">
                  <img
                    src="./images/tarfalmadani.webp"
                    alt="School website preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                    <i className="fas fa-school text-emerald-500"></i> School
                  </div>
                </div>
                {/*  Info  */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
                      Tarfal Madani
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      The website of a foundation in Bogor which oversees many schools also has a college
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        React
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Tailwind
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Codeigniter 3
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        MySQL
                      </span>
                    </div>
                    <a
                      href="https://dev.tarfalmadani.com"
                      target="_blank"
                      className="text-brand hover:text-brand-light font-medium text-sm flex items-center gap-1"
                    >
                      Visit Project <i className="fas fa-arrow-right text-xs"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/*  Project 2  */}
              <div className="bg-pure-black rounded-2xl overflow-hidden border border-brand-darker card-hover transition-all duration-300 group flex flex-col">
                {/*  Direct UI Preview  */}
                <div className="h-56 bg-gray-950 relative overflow-hidden flex items-center justify-center border-b border-brand/20">
                  <img
                    src="./images/amandigital.webp"
                    alt="School website preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                    <i className="fas fa-book text-emerald-500"></i> Educational
                  </div>
                </div>
                {/*  Info  */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
                      Aman Digital
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Non-profit website that focuses on digital literacy and education for digital communities in
                      Indonesia
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        React
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Tailwind
                      </span>
                    </div>
                    <a
                      href="https://www.amandigital.org"
                      target="_blank"
                      className="text-brand hover:text-brand-light font-medium text-sm flex items-center gap-1"
                    >
                      Visit Project <i className="fas fa-arrow-right text-xs"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/*  Project 2  */}
              <div className="bg-pure-black rounded-2xl overflow-hidden border border-brand-darker card-hover transition-all duration-300 group flex flex-col">
                {/*  Direct UI Preview  */}
                <div className="h-56 bg-gray-950 relative overflow-hidden flex items-center justify-center border-b border-brand/20">
                  <img
                    src="./images/undangan.webp"
                    alt="School website preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                    <i className="fas fa-book text-emerald-500"></i> Educational
                  </div>
                </div>
                {/*  Info  */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
                      Fake Invitation for Educational Purpose
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      A fake invitation website for educational purposes, to show how easy it is to create a fake
                      invitation website and you must avoid it
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        React
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Tailwind
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        PHP
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Postgres
                      </span>
                    </div>
                    <a
                      href="https://undangan.amandigital.org"
                      target="_blank"
                      className="text-brand hover:text-brand-light font-medium text-sm flex items-center gap-1"
                    >
                      Visit Project <i className="fas fa-arrow-right text-xs"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/*  Project 3  */}
              <div className="bg-pure-black rounded-2xl overflow-hidden border border-brand-darker card-hover transition-all duration-300 group flex flex-col">
                {/*  Direct UI Preview  */}
                <div className="h-56 bg-gray-950 relative overflow-hidden flex items-center justify-center border-b border-brand/20">
                  <img
                    src="./images/dev.webp"
                    alt="School website preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 text-slate-400 text-xs font-bold uppercase flex items-center gap-2">
                    <i className="fas fa-tools text-emerald-500"></i> Tools
                  </div>
                </div>
                {/*  Info  */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
                      My Tools Dashboard
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      A dashboard to manage all the tools I use for development and productivity in one place
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Astro
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Svelte
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        React
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Tailwind
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 bg-pure-black border border-brand/30 text-brand-light rounded-full">
                        Hermes (Pyth Network)
                      </span>
                    </div>
                    <a
                      href="https://dev.syamsulbahtiar.com"
                      target="_blank"
                      className="text-brand hover:text-brand-light font-medium text-sm flex items-center gap-1"
                    >
                      Visit Project <i className="fas fa-arrow-right text-xs"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="relative min-h-screen flex items-center justify-center py-24 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative">
          <div className="bg-off-black/80 backdrop-blur-md border border-brand/20 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden">
            {/*  Abstract green shapes  */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand rounded-full filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-light rounded-full filter blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/3">
                <h2 className="text-4xl font-bold mb-4 text-white">
                  My <span className="text-red-500">Arsenal</span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Here are the technologies I work with daily to bring ideas to life. I continuously learn and adapt to
                  new tools.
                </p>
              </div>

              <div className="w-full md:w-2/3">
                <div className="flex flex-wrap gap-4">
                  {/*  Skill Tags  */}
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-html5 text-orange-500 text-xl"></i>
                    <span className="text-gray-200 font-medium">HTML</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-css text-blue-500 text-xl"></i>
                    <span className="text-gray-200 font-medium">CSS & Tailwind</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-php text-indigo-400 text-xl"></i>
                    <span className="text-gray-200 font-medium">PHP & Codeigniter</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-laravel text-orange-600 text-xl"></i>
                    <span className="text-gray-200 font-medium">Laravel</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-js text-yellow-400 text-xl"></i>
                    <span className="text-gray-200 font-medium">JavaScript</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-react text-cyan-400 text-xl"></i>
                    <span className="text-gray-200 font-medium">React</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-node-js text-green-500 text-xl"></i>
                    <span className="text-gray-200 font-medium">Node.js</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-golang text-cyan-400 text-xl"></i>
                    <span className="text-gray-200 font-medium">Golang</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-rust text-gray-300 text-xl"></i>
                    <span className="text-gray-200 font-medium">Rust</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-git-alt text-red-500 text-xl"></i>
                    <span className="text-gray-200 font-medium">Git</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-github text-gray-200 text-xl"></i>
                    <span className="text-gray-200 font-medium">GitHub</span>
                  </div>

                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-gitlab text-orange-600 text-xl"></i>
                    <span className="text-gray-200 font-medium">GitLab</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fas fa-database text-gray-400 text-xl"></i>
                    <span className="text-gray-200 font-medium">SQL & NoSQL</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fab fa-docker text-blue-400 text-xl"></i>
                    <span className="text-gray-200 font-medium">Docker</span>
                  </div>
                  <div className="px-6 py-3 bg-pure-black/50 border border-brand border-opacity-30 rounded-full flex items-center gap-2 hover:border-brand-light transition-colors">
                    <i className="fas fa-dharmachakra text-blue-500 text-xl"></i>
                    <span className="text-gray-200 font-medium">Kubernetes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative min-h-screen flex items-center justify-center py-24 z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 w-full">
          <div className="bg-off-black/80 backdrop-blur-md border border-brand/20 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">
                Get In <span className="text-brand">Touch</span>
              </h2>
              <p className="text-gray-300">
                You can find me on these platforms. Let's connect and build something amazing!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 max-w-2xl mx-auto">
              {/*  Email  */}
              <a
                href="mailto:gmail@syamsulbahtiar.com"
                className="flex items-center p-6 bg-pure-black/60 border border-brand/20 rounded-2xl shadow-sm card-hover transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mr-6 group-hover:bg-brand/20 transition-colors">
                  <i className="fas fa-envelope text-2xl text-brand"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Email Me</h3>
                  <p className="text-gray-400 text-sm">gmail@syamsulbahtiar.com</p>
                </div>
              </a>

              {/*  LinkedIn  */}
              <a
                href="https://www.linkedin.com/in/syamsulbahtiar"
                target="_blank"
                className="flex items-center p-6 bg-pure-black/60 border border-brand/20 rounded-2xl shadow-sm card-hover transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mr-6 group-hover:bg-[#0A66C2]/20 transition-colors">
                  <i className="fab fa-linkedin-in text-2xl text-[#0A66C2]"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">LinkedIn</h3>
                  <p className="text-gray-400 text-sm">Let's connect</p>
                </div>
              </a>

              {/*  GitHub  */}
              <a
                href="https://github.com/yawnshi"
                target="_blank"
                className="flex items-center p-6 bg-pure-black/60 border border-brand/20 rounded-2xl shadow-sm card-hover transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mr-6 group-hover:bg-white/10 transition-colors">
                  <i className="fab fa-github text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">GitHub</h3>
                  <p className="text-gray-400 text-sm">View my repos</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-pure-black/90 backdrop-blur-md text-white py-12 border-t border-brand-darker">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between">
          <a href="#" className="text-2xl font-bold tracking-tighter mb-2">
            <span className="text-white">SB</span>
            <span className="text-brand">.</span>
          </a>
          <p className="text-gray-500 text-sm">© 2026 VenderGreat. All rights reserved.</p>
        </div>
      </footer>

      {/*  Easter Egg Overlay  */}
      <div
        id="easterEggOverlay"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none opacity-0 transition-opacity duration-500 bg-pure-black/30 backdrop-blur-sm"
      >
        <div
          id="easterEggNumber"
          className="text-[12rem] md:text-[20rem] font-black text-brand tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]"
        ></div>
        <div
          id="easterEggText"
          className="text-xl md:text-3xl text-center text-white font-bold mt-4 max-w-3xl px-6 drop-shadow-lg"
        ></div>
      </div>
    </motion.div>
  );
}
