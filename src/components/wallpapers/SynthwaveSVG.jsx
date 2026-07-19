import React from 'react';

export default function SynthwaveSVG({ colors }) {
  return (
    <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0 transition-colors duration-1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.skyGrad[0]}/>
          <stop offset="50%" stopColor={colors.skyGrad[1]}/>
          <stop offset="100%" stopColor={colors.skyGrad[2]}/>
        </linearGradient>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.sunGrad[0]}/>
          <stop offset="100%" stopColor={colors.sunGrad[1]}/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <rect width="1920" height="1080" fill="url(#skyGrad)" style={{transition: 'fill 1s'}} />
      
      <g fill={colors.stars} opacity="0.8" style={{transition: 'fill 1s'}}>
        <circle cx="200" cy="150" r="1.5" />
        <circle cx="450" cy="300" r="2" opacity="0.5" />
        <circle cx="800" cy="100" r="1" />
        <circle cx="1200" cy="250" r="2" opacity="0.7" />
        <circle cx="1600" cy="150" r="1.5" />
        <circle cx="1750" cy="350" r="1" />
        <circle cx="100" cy="400" r="2" />
        <circle cx="950" cy="200" r="1" />
        <circle cx="1800" cy="100" r="2" />
        <circle cx="1400" cy="400" r="1.5" />
        <circle cx="50" cy="50" r="1" />
      </g>

      <circle cx="960" cy="650" r="250" fill="url(#sunGrad)" filter="url(#glow)" />
      
      <g stroke={colors.sunGlow} strokeWidth="6" opacity="0.8" style={{transition: 'stroke 1s'}}>
        <line x1="710" y1="500" x2="1210" y2="500" />
        <line x1="710" y1="540" x2="1210" y2="540" strokeWidth="8"/>
        <line x1="710" y1="590" x2="1210" y2="590" strokeWidth="10"/>
        <line x1="710" y1="650" x2="1210" y2="650" strokeWidth="14"/>
        <line x1="710" y1="720" x2="1210" y2="720" strokeWidth="18"/>
        <line x1="710" y1="810" x2="1210" y2="810" strokeWidth="24"/>
      </g>

      <path d="M0 800 L300 500 L600 750 L900 450 L1200 700 L1500 500 L1920 850 L1920 1080 L0 1080 Z" fill={colors.mountainFront} opacity="0.8" style={{transition: 'fill 1s'}} />
      <path d="M0 900 L400 600 L800 850 L1100 550 L1500 800 L1920 600 L1920 1080 L0 1080 Z" fill={colors.mountainMid} opacity="0.9" style={{transition: 'fill 1s'}} />
      <path d="M0 1000 L500 750 L1000 950 L1400 700 L1920 950 L1920 1080 L0 1080 Z" fill={colors.mountainBack} style={{transition: 'fill 1s'}} />
    </svg>
  );
}
