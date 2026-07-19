import React from 'react';

export default function ForestSVG({ colors }) {
  return (
    <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0 transition-colors duration-1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.skyGrad[0]}/>
          <stop offset="50%" stopColor={colors.skyGrad[1]}/>
          <stop offset="100%" stopColor={colors.skyGrad[2]}/>
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.sunGrad[1]} stopOpacity="1"/>
          <stop offset="40%" stopColor={colors.sunGrad[0]} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={colors.skyGrad[2]} stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <rect width="1920" height="1080" fill="url(#forestGrad)" style={{transition: 'fill 1s'}} />
      
      {/* Moon */}
      <circle cx="1400" cy="300" r="150" fill="url(#moonGlow)" />
      <circle cx="1400" cy="300" r="60" fill="#ffffff" opacity="0.9" filter="blur(2px)" />

      {/* Fireflies */}
      <g fill={colors.stars} opacity="0.8">
        <circle cx="200" cy="850" r="3" filter="blur(1px)" />
        <circle cx="350" cy="700" r="2" filter="blur(1px)" />
        <circle cx="800" cy="900" r="4" filter="blur(2px)" />
        <circle cx="1100" cy="750" r="2" />
        <circle cx="1500" cy="850" r="3" filter="blur(1px)" />
        <circle cx="1750" cy="650" r="2" />
      </g>

      {/* Background Trees */}
      <g fill={colors.mountainBack} style={{transition: 'fill 1s'}}>
        <path d="M100 1080 L150 700 L200 1080 Z" />
        <path d="M300 1080 L350 650 L400 1080 Z" />
        <path d="M600 1080 L650 600 L700 1080 Z" />
        <path d="M850 1080 L900 750 L950 1080 Z" />
        <path d="M1100 1080 L1150 600 L1200 1080 Z" />
        <path d="M1350 1080 L1400 650 L1450 1080 Z" />
        <path d="M1650 1080 L1700 700 L1750 1080 Z" />
      </g>

      {/* Midground Trees */}
      <g fill={colors.mountainMid} style={{transition: 'fill 1s'}}>
        <path d="M0 1080 L80 550 L160 1080 Z" />
        <path d="M220 1080 L300 500 L380 1080 Z" />
        <path d="M480 1080 L550 450 L620 1080 Z" />
        <path d="M720 1080 L800 550 L880 1080 Z" />
        <path d="M980 1080 L1050 450 L1120 1080 Z" />
        <path d="M1220 1080 L1300 500 L1380 1080 Z" />
        <path d="M1520 1080 L1600 550 L1680 1080 Z" />
        <path d="M1780 1080 L1850 450 L1920 1080 Z" />
      </g>

      {/* Foreground Terrain & Trees */}
      <path d="M0 950 Q 400 850, 960 950 T 1920 950 L1920 1080 L0 1080 Z" fill={colors.mountainFront} style={{transition: 'fill 1s'}} />
      <g fill={colors.mountainFront} style={{transition: 'fill 1s'}}>
        <path d="M-50 1080 L50 350 L150 1080 Z" />
        <path d="M400 1080 L500 400 L600 1080 Z" />
        <path d="M850 1080 L950 300 L1050 1080 Z" />
        <path d="M1400 1080 L1500 400 L1600 1080 Z" />
      </g>
    </svg>
  );
}
