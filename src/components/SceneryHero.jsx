import React, { lazy, Suspense } from 'react';

// Lazy load individual SVG themes to optimize bundle size
const SynthwaveSVG = lazy(() => import('./wallpapers/SynthwaveSVG'));
const CyberpunkSVG = lazy(() => import('./wallpapers/CyberpunkSVG'));
const OceanSVG = lazy(() => import('./wallpapers/OceanSVG'));
const ForestSVG = lazy(() => import('./wallpapers/ForestSVG'));
const CrimsonSVG = lazy(() => import('./wallpapers/CrimsonSVG'));
const SolarSVG = lazy(() => import('./wallpapers/SolarSVG'));
const MonochromeSVG = lazy(() => import('./wallpapers/MonochromeSVG'));

export const wallpaperThemes = [
  {
    id: 'synthwave',
    name: 'Synthwave',
    vibe: 'bg-gradient-to-r from-pink-500 to-orange-400',
    colors: {
      skyGrad: ['#0a0026', '#2c003e', '#8d0055'],
      sunGrad: ['#ff007c', '#ffb347'],
      sunGlow: '#8d0055',
      stars: '#ffffff',
      mountainFront: '#14002e',
      mountainMid: '#0d001f',
      mountainBack: '#05000d',
    },
    Component: SynthwaveSVG
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    vibe: 'bg-gradient-to-r from-green-400 to-cyan-500',
    colors: {
      skyGrad: ['#001111', '#002b2b', '#005544'],
      sunGrad: ['#00ffcc', '#00ff55'],
      sunGlow: '#005544',
      stars: '#aaffee',
      mountainFront: '#001a14',
      mountainMid: '#00110d',
      mountainBack: '#000806',
    },
    Component: CyberpunkSVG
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    vibe: 'bg-gradient-to-r from-blue-600 to-teal-400',
    colors: {
      skyGrad: ['#000a1a', '#001b3a', '#003b5c'],
      sunGrad: ['#00aaff', '#00ffff'],
      sunGlow: '#003b5c',
      stars: '#cceeff',
      mountainFront: '#001429',
      mountainMid: '#000d1a',
      mountainBack: '#00050d',
    },
    Component: OceanSVG
  },
  {
    id: 'forest',
    name: 'Forest Mystical',
    vibe: 'bg-gradient-to-r from-emerald-500 to-green-300',
    colors: {
      skyGrad: ['#051a05', '#0a2e0a', '#144d14'],
      sunGrad: ['#aaff00', '#ffff00'],
      sunGlow: '#144d14',
      stars: '#eeffcc',
      mountainFront: '#0a240a',
      mountainMid: '#051405',
      mountainBack: '#000800',
    },
    Component: ForestSVG
  },
  {
    id: 'crimson',
    name: 'Crimson Eclipse',
    vibe: 'bg-gradient-to-r from-red-600 to-red-400',
    colors: {
      skyGrad: ['#1a0000', '#330000', '#660000'],
      sunGrad: ['#ff0000', '#ff3300'],
      sunGlow: '#660000',
      stars: '#ffcccc',
      mountainFront: '#260000',
      mountainMid: '#140000',
      mountainBack: '#0a0000',
    },
    Component: CrimsonSVG
  },
  {
    id: 'solar',
    name: 'Solar Flare',
    vibe: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    colors: {
      skyGrad: ['#1a0a00', '#4d1a00', '#993300'],
      sunGrad: ['#ffff00', '#ff6600'],
      sunGlow: '#993300',
      stars: '#ffeebb',
      mountainFront: '#331100',
      mountainMid: '#1a0800',
      mountainBack: '#0d0400',
    },
    Component: SolarSVG
  },
  {
    id: 'monochrome',
    name: 'Monochrome Grid',
    vibe: 'bg-gradient-to-r from-gray-400 to-gray-200',
    colors: {
      skyGrad: ['#000000', '#1a1a1a', '#404040'],
      sunGrad: ['#e6e6e6', '#ffffff'],
      sunGlow: '#404040',
      stars: '#ffffff',
      mountainFront: '#1f1f1f',
      mountainMid: '#141414',
      mountainBack: '#0a0a0a',
    },
    Component: MonochromeSVG
  }
];

export const SceneryHero = ({ themeId }) => {
  const theme = wallpaperThemes.find(t => t.id === themeId) || wallpaperThemes[0];
  const ActiveSVGComponent = theme.Component;

  return (
    <Suspense fallback={<div className="absolute inset-0 bg-pure-black z-0 transition-colors duration-1000"></div>}>
      <ActiveSVGComponent colors={theme.colors} />
    </Suspense>
  );
};
