import React from 'react';

export default function CyberpunkSVG({ colors }) {
  return (
    <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0 transition-colors duration-1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cyberskyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.skyGrad[0]}/>
          <stop offset="60%" stopColor={colors.skyGrad[1]}/>
          <stop offset="100%" stopColor={colors.skyGrad[2]}/>
        </linearGradient>
        <radialGradient id="cyberHaze" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor={colors.sunGlow} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={colors.skyGrad[2]} stopOpacity="0"/>
        </radialGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <rect width="1920" height="1080" fill="url(#cyberskyGrad)" style={{transition: 'fill 1s'}} />
      <rect width="1920" height="1080" fill="url(#cyberHaze)" style={{transition: 'fill 1s'}} />
      
      {/* Stars in smog */}
      <g fill={colors.stars} opacity="0.3">
        <circle cx="200" cy="150" r="1.5" />
        <circle cx="850" cy="80" r="1" />
        <circle cx="1400" cy="200" r="2" />
        <circle cx="1700" cy="120" r="1.5" />
      </g>

      {/* Massive Cyber Moon / Planet */}
      <circle cx="1500" cy="300" r="250" fill={colors.sunGrad[0]} filter="url(#neonGlow)" opacity="0.15" />
      <circle cx="1500" cy="300" r="248" fill="transparent" stroke={colors.sunGrad[1]} strokeWidth="2" opacity="0.3" strokeDasharray="10 5" />
      <path d="M1250 300 Q 1500 200, 1750 300" stroke={colors.sunGrad[1]} strokeWidth="1" fill="none" opacity="0.2" />
      <path d="M1250 300 Q 1500 400, 1750 300" stroke={colors.sunGrad[1]} strokeWidth="1" fill="none" opacity="0.2" />

      {/* Background Cityscape */}
      <g fill={colors.mountainBack} opacity="0.9" style={{transition: 'fill 1s'}}>
        <rect x="100" y="500" width="150" height="600" />
        <rect x="250" y="650" width="100" height="450" />
        <rect x="350" y="400" width="200" height="700" />
        <rect x="600" y="550" width="120" height="550" />
        <rect x="750" y="450" width="250" height="650" />
        <rect x="1050" y="600" width="180" height="500" />
        <rect x="1250" y="350" width="220" height="750" />
        <rect x="1500" y="500" width="150" height="600" />
        <rect x="1700" y="600" width="220" height="500" />
      </g>

      {/* Midground Cityscape */}
      <g fill={colors.mountainMid} style={{transition: 'fill 1s'}}>
        <rect x="0" y="700" width="180" height="400" />
        <rect x="200" y="600" width="120" height="500" />
        <path d="M350 750 L400 700 L500 700 L550 750 Z" />
        <rect x="350" y="750" width="200" height="350" />
        <rect x="650" y="650" width="180" height="450" />
        <rect x="850" y="550" width="150" height="550" />
        <rect x="1050" y="700" width="200" height="400" />
        <rect x="1300" y="600" width="180" height="500" />
        <rect x="1550" y="750" width="150" height="350" />
        <rect x="1750" y="650" width="170" height="450" />
      </g>

      {/* Foreground Silhouettes & Neon */}
      <g fill={colors.mountainFront} style={{transition: 'fill 1s'}}>
        <rect x="-50" y="850" width="300" height="250" />
        <rect x="300" y="800" width="250" height="300" />
        <rect x="600" y="900" width="400" height="200" />
        <rect x="1100" y="850" width="350" height="250" />
        <rect x="1500" y="800" width="500" height="300" />
      </g>

      {/* Neon Windows & Antennas */}
      <g fill={colors.sunGrad[0]} filter="url(#neonGlow)" opacity="0.8">
        <rect x="380" y="420" width="10" height="10" />
        <rect x="420" y="420" width="10" height="10" />
        <rect x="420" y="460" width="10" height="10" />
        <rect x="800" y="480" width="10" height="100" />
        <rect x="1300" y="380" width="50" height="5" />
        <rect x="1300" y="420" width="50" height="5" />
        <circle cx="1360" cy="310" r="3" fill={colors.sunGrad[1]} />
      </g>

      <g stroke={colors.mountainBack} strokeWidth="4">
        <line x1="450" y1="400" x2="450" y2="300" />
        <line x1="850" y1="450" x2="850" y2="250" />
        <line x1="1360" y1="350" x2="1360" y2="200" />
      </g>

      {/* Flying Spinners / Light Trails */}
      <g opacity="0.6">
        <path d="M 200 400 L 400 350" stroke={colors.sunGrad[0]} strokeWidth="2" fill="none" filter="url(#neonGlow)" strokeDasharray="50 150" />
        <path d="M 1200 200 L 800 250" stroke={colors.sunGrad[1]} strokeWidth="1.5" fill="none" filter="url(#neonGlow)" strokeDasharray="30 200" />
        <path d="M 1600 500 L 1900 450" stroke={colors.stars} strokeWidth="1" fill="none" filter="url(#neonGlow)" strokeDasharray="20 100" />
      </g>
    </svg>
  );
}
