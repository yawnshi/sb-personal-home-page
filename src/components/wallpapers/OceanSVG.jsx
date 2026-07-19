import React from 'react';

export default function OceanSVG({ colors }) {
  return (
    <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0 transition-colors duration-1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.skyGrad[0]}/>
          <stop offset="50%" stopColor={colors.skyGrad[1]}/>
          <stop offset="100%" stopColor={colors.skyGrad[2]}/>
        </linearGradient>
        <filter id="waterBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <rect width="1920" height="1080" fill="url(#oceanGrad)" style={{transition: 'fill 1s'}} />
      
      {/* Light Rays */}
      <g fill={colors.sunGrad[0]} opacity="0.1" filter="url(#waterBlur)">
        <polygon points="200,0 600,1080 300,1080 0,0" />
        <polygon points="800,0 1200,1080 900,1080 600,0" />
        <polygon points="1400,0 1800,1080 1500,1080 1200,0" />
      </g>

      {/* Bubbles */}
      <g fill={colors.stars} opacity="0.6">
        <circle cx="250" cy="800" r="4" />
        <circle cx="280" cy="700" r="8" />
        <circle cx="240" cy="550" r="3" />
        <circle cx="950" cy="900" r="5" />
        <circle cx="920" cy="750" r="10" />
        <circle cx="980" cy="600" r="4" />
        <circle cx="1600" cy="850" r="6" />
        <circle cx="1630" cy="650" r="12" />
        <circle cx="1580" cy="500" r="5" />
      </g>

      {/* Sea Floor / Kelp */}
      <path d="M0 900 Q 200 850, 400 950 T 800 900 T 1200 950 T 1600 850 T 1920 950 L1920 1080 L0 1080 Z" fill={colors.mountainBack} style={{transition: 'fill 1s'}} />
      <path d="M0 950 Q 250 900, 500 1000 T 1000 950 T 1500 1000 T 1920 900 L1920 1080 L0 1080 Z" fill={colors.mountainMid} style={{transition: 'fill 1s'}} />
      
      <g fill={colors.mountainFront} style={{transition: 'fill 1s'}}>
        {/* Kelp Silhouettes */}
        <path d="M150 1080 Q 120 900, 180 800 Q 150 700, 190 600 Q 170 800, 160 1080 Z" />
        <path d="M180 1080 Q 200 950, 170 850 Q 220 750, 190 650 Q 200 850, 190 1080 Z" />
        <path d="M1700 1080 Q 1730 850, 1680 750 Q 1750 650, 1690 550 Q 1720 750, 1710 1080 Z" />
      </g>
    </svg>
  );
}
