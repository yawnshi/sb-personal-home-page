import React from 'react';

export default function SolarSVG({ colors }) {
  return (
    <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0 transition-colors duration-1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.skyGrad[0]}/>
          <stop offset="70%" stopColor={colors.skyGrad[1]}/>
          <stop offset="100%" stopColor={colors.skyGrad[2]}/>
        </linearGradient>
        <filter id="solarGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="30" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <rect width="1920" height="1080" fill="url(#solarGrad)" style={{transition: 'fill 1s'}} />
      
      {/* Deep Space Stars */}
      <g fill={colors.stars} opacity="0.6">
        <circle cx="200" cy="150" r="1.5" />
        <circle cx="450" cy="300" r="2" opacity="0.5" />
        <circle cx="800" cy="100" r="1" />
        <circle cx="1200" cy="250" r="2" opacity="0.7" />
        <circle cx="1600" cy="150" r="1.5" />
        <circle cx="1750" cy="350" r="1" />
        <circle cx="100" cy="600" r="2" />
        <circle cx="350" cy="800" r="1.5" />
        <circle cx="1500" cy="700" r="1" />
        <circle cx="1800" cy="650" r="2" />
      </g>

      {/* Solar Flares / Coronal Mass Ejections */}
      <g stroke={colors.sunGrad[1]} fill="none" opacity="0.4" strokeWidth="4" filter="url(#solarGlow)">
        <path d="M 960 500 Q 700 100 500 400" />
        <path d="M 960 500 Q 1400 200 1600 600" />
        <path d="M 960 500 Q 1200 800 1500 900" />
        <path d="M 960 500 Q 600 700 300 800" />
      </g>

      {/* Distant Planets */}
      {/* Gas Giant with Ring */}
      <g transform="translate(300, 300) rotate(-20)">
        <ellipse cx="0" cy="0" rx="90" ry="15" fill="none" stroke={colors.sunGrad[0]} strokeWidth="3" opacity="0.6" />
        <ellipse cx="0" cy="0" rx="100" ry="20" fill="none" stroke={colors.sunGrad[1]} strokeWidth="1" opacity="0.3" />
        <circle cx="0" cy="0" r="40" fill={colors.mountainMid} opacity="0.9" />
        {/* Shadow side */}
        <path d="M-40 0 A 40 40 0 0 0 40 0" fill={colors.mountainBack} opacity="0.5" />
      </g>

      {/* Rocky Planet & Moon */}
      <g transform="translate(1600, 450)">
        <circle cx="0" cy="0" r="25" fill={colors.mountainFront} opacity="0.8" />
        <path d="M-25 0 A 25 25 0 0 0 25 0" fill={colors.mountainBack} opacity="0.6" />
        {/* Tiny Moon */}
        <circle cx="40" cy="-30" r="5" fill={colors.stars} opacity="0.7" />
      </g>

      {/* Massive Sun in Space (Scaled down for mobile brightness) */}
      <circle cx="960" cy="500" r="220" fill={colors.sunGrad[1]} filter="url(#solarGlow)" opacity="0.6" />
      <circle cx="960" cy="500" r="180" fill={colors.sunGrad[0]} opacity="0.9" />
      
      {/* Planetary Orbit Horizon (Atmosphere Glow) */}
      <path d="M-200 1200 Q 960 700 2120 1200 Z" fill={colors.sunGrad[0]} opacity="0.2" filter="url(#solarGlow)" />
      
      {/* Planetary Orbit Horizon (Surface) */}
      <path d="M-200 1200 Q 960 850 2120 1200 L2120 1080 L-200 1080 Z" fill={colors.mountainBack} style={{transition: 'fill 1s'}} />
      <path d="M0 1200 Q 960 900 1920 1200 L1920 1080 L0 1080 Z" fill={colors.mountainMid} style={{transition: 'fill 1s'}} />
      <path d="M100 1200 Q 960 950 1820 1200 L1920 1080 L0 1080 Z" fill={colors.mountainFront} style={{transition: 'fill 1s'}} />
    </svg>
  );
}
