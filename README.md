# SB. | Personal Home Page

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat&logo=three.js&logoColor=white)](#)

Welcome to the source repository for **Syamsul Bahtiar's Personal Home Page and Portfolio**. This project is a premium, high-performance, single-page web portfolio featuring interactive 3D visuals and immersive micro-animations, designed to highlight a rich history of web engineering.

---

## 🌌 Key Highlights & Experience

### 🚀 Interactive 3D Space Explorer
Embedded directly in the **About Me** section is a fully interactive, lightweight 3D Solar System simulation powered by **Three.js**. 
* **User Interaction:** Drag to rotate, scroll/pinch to zoom.
* **Physics & Visuals:** Sun point-light source, orbital paths rendered in the signature brand emerald, and a Saturn ring simulation.
* **Touch Responsive:** Optimized for both desktop cursor navigation and mobile/tablet swipe/pinch gestures.

### 🧪 Dynamic Particle Network Canvas
The background features an interactive HTML5 Canvas particle system:
* Over 100 particles floating and dynamically connecting with translucent network lines based on proximity.
* Interactive mouse repel effect with particle glow when hovering.
* Responsive particle scaling: limits particle density on mobile screens to preserve memory and frame rates.

### ✨ Sleek Glassmorphism & Micro-animations
* Custom Tailwind CSS design using customized HSL-derived emerald variables (`#10b981`, `#34d399`, etc.).
* Smooth scrolling with customized vertical navigation and offset handling for fixed navigation headers.
* High-performance CSS keyframe fade-in-up animations and floating effects.

---

## 🛠️ Stack & Technologies

* **Core Structure & Layout:** HTML5 (Semantic tags), Vanilla Javascript (ES6+)
* **Styling & UI:** Tailwind CSS (CDN-loaded with extended custom theme), Font Awesome v7 icons
* **3D Engine:** Three.js (r128) & OrbitControls
* **Hosting Friendly:** Static structure, ready to deploy to GitHub Pages, Netlify, or Vercel out of the box.

---

## 📁 Directory Structure

```bash
3dbackground/
├── index.html           # Main application structure, layout, styles, and animation logic
├── amandigital.webp     # Project preview: Aman Digital educational site
├── dev.webp             # Project preview: Developer Tools Dashboard
├── tarfalmadani.webp    # Project preview: Tarfal Madani Foundation site
├── undangan.webp        # Project preview: Educational invitation website demo
├── .gitignore           # File exclusion list for Git repository
├── package.json         # Development server config and dependencies
└── LICENSE              # MIT Open-source license agreement
```

---

## ⚡ Quick Start & Development

To run or develop the project locally:

### Option A: Local Dev Server (Recommended)
This repository includes a lightweight [Vite](https://vitejs.dev/) development server to prevent CORS issues with WebGL components and allow fast hot-reloading:

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the local address printed in the terminal (usually `http://localhost:5173`).

### Option B: Quick CLI Server
Alternatively, serve the directory directly using Python, PHP, or Npx:

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# Node/Npx
npx serve .
```

---

## 🎨 Featured Projects Represented

* **Tarfal Madani:** Foundation management website (Bogor) overseeing schools and a college. Built with *React, Tailwind, CodeIgniter 3, and MySQL*.
* **Aman Digital:** Digital space safety and education portal in Indonesia. Built with *React and Tailwind*.
* **Educational Invitation:** Demonstration platform showcasing web security awareness regarding malicious invitations. Built with *React, Tailwind, PHP, and PostgreSQL*.
* **My Tools Dashboard:** Personal productivity hub. Built with *Astro, Svelte, React, Tailwind, and Pyth Network integrations*.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
