import React from 'react';

export default function CrimsonSVG({ colors }) {
  return (
    <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0 transition-colors duration-1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="crimsonGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.skyGrad[0]}/>
          <stop offset="60%" stopColor={colors.skyGrad[1]}/>
          <stop offset="100%" stopColor={colors.skyGrad[2]}/>
        </linearGradient>
        <filter id="eclipseGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="25" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <rect width="1920" height="1080" fill="url(#crimsonGrad)" style={{transition: 'fill 1s'}} />
      
      {/* Stars/Ash */}
      <g fill={colors.stars} opacity="0.6">
        <circle cx="150" cy="200" r="1.5" />
        <circle cx="500" cy="100" r="2" />
        <circle cx="850" cy="300" r="1" />
        <circle cx="1200" cy="150" r="2.5" />
        <circle cx="1650" cy="250" r="1.5" />
      </g>

      {/* Eclipsed Sun */}
      <g transform="translate(960, 450)">
        <circle cx="0" cy="0" r="260" fill={colors.sunGrad[0]} filter="url(#eclipseGlow)" opacity="0.8" />
        <circle cx="0" cy="0" r="240" fill={colors.sunGrad[1]} filter="url(#eclipseGlow)" />
        <circle cx="5" cy="-5" r="238" fill={colors.skyGrad[0]} /> {/* The obscuring planet */}
      </g>
      
      {/* Background Crags */}
      <path d="M0 750 L150 600 L250 650 L400 500 L600 650 L750 550 L950 700 L1150 500 L1350 650 L1500 550 L1700 750 L1920 600 L1920 1080 L0 1080 Z" fill={colors.mountainBack} style={{transition: 'fill 1s'}} />
      
      {/* Midground Crags */}
      <path d="M0 850 L200 700 L450 800 L700 600 L950 850 L1200 650 L1450 800 L1750 650 L1920 850 L1920 1080 L0 1080 Z" fill={colors.mountainMid} style={{transition: 'fill 1s'}} />
      
      {/* Foreground Terrain with Craters */}
      <path d="M0 1000 Q 300 900, 600 980 T 1200 950 T 1920 1000 L1920 1080 L0 1080 Z" fill={colors.mountainFront} style={{transition: 'fill 1s'}} />
      <g fill={colors.mountainMid} opacity="0.5">
        <ellipse cx="300" cy="1000" rx="40" ry="15" />
        <ellipse cx="800" cy="980" rx="60" ry="20" />
        <ellipse cx="1400" cy="1020" rx="80" ry="25" />
      </g>
    </svg>
  );
}
