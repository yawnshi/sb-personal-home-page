import React from 'react';

export default function MonochromeSVG({ colors }) {
  return (
    <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0 transition-colors duration-1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="monoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.skyGrad[0]}/>
          <stop offset="50%" stopColor={colors.skyGrad[1]}/>
          <stop offset="100%" stopColor={colors.skyGrad[2]}/>
        </linearGradient>
      </defs>
      
      <rect width="1920" height="1080" fill="url(#monoGrad)" style={{transition: 'fill 1s'}} />
      
      {/* Floating Geometric Wireframes */}
      <g stroke={colors.sunGrad[0]} strokeWidth="2" fill="none" opacity="0.6" style={{transition: 'stroke 1s'}}>
        {/* Isometric Cube 1 */}
        <g transform="translate(300, 300) scale(1.5)">
          <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" />
          <line x1="0" y1="0" x2="0" y2="50" />
          <line x1="0" y1="0" x2="-43" y2="-25" />
          <line x1="0" y1="0" x2="43" y2="-25" />
        </g>
        
        {/* Isometric Cube 2 */}
        <g transform="translate(1500, 700) scale(2)">
          <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" />
          <line x1="0" y1="0" x2="0" y2="50" />
          <line x1="0" y1="0" x2="-43" y2="-25" />
          <line x1="0" y1="0" x2="43" y2="-25" />
        </g>
        
        {/* Diamond */}
        <polygon points="960,100 1000,200 960,300 920,200" />
      </g>

      {/* Structured Grid */}
      <g stroke={colors.mountainBack} strokeWidth="2" opacity="0.8" style={{transition: 'stroke 1s'}}>
        {/* Vertical Lines */}
        {Array.from({length: 20}).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1080" />
        ))}
        {/* Horizontal Lines */}
        {Array.from({length: 12}).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="1920" y2={i * 100} />
        ))}
      </g>
      
      {/* Solid Geometric Base */}
      <polygon points="0,1080 0,800 600,600 1200,850 1920,600 1920,1080" fill={colors.mountainFront} opacity="0.9" style={{transition: 'fill 1s'}} />
      <polygon points="0,1080 0,900 800,750 1500,950 1920,700 1920,1080" fill={colors.mountainMid} opacity="0.9" style={{transition: 'fill 1s'}} />
    </svg>
  );
}
