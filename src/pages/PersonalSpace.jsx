import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const SceneryHero = () => (
  <svg viewBox="0 0 1920 1080" className="w-full h-full object-cover absolute inset-0 z-0" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a0026"/>
        <stop offset="50%" stopColor="#2c003e"/>
        <stop offset="100%" stopColor="#8d0055"/>
      </linearGradient>
      <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff007c"/>
        <stop offset="100%" stopColor="#ffb347"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <rect width="1920" height="1080" fill="url(#skyGrad)" />
    
    <g fill="#ffffff" opacity="0.8">
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
    
    <g stroke="#8d0055" strokeWidth="6" opacity="0.8">
      <line x1="710" y1="500" x2="1210" y2="500" />
      <line x1="710" y1="540" x2="1210" y2="540" strokeWidth="8"/>
      <line x1="710" y1="590" x2="1210" y2="590" strokeWidth="10"/>
      <line x1="710" y1="650" x2="1210" y2="650" strokeWidth="14"/>
      <line x1="710" y1="720" x2="1210" y2="720" strokeWidth="18"/>
      <line x1="710" y1="810" x2="1210" y2="810" strokeWidth="24"/>
    </g>

    <path d="M0 800 L300 500 L600 750 L900 450 L1200 700 L1500 500 L1920 850 L1920 1080 L0 1080 Z" fill="#14002e" opacity="0.8" />
    <path d="M0 900 L400 600 L800 850 L1100 550 L1500 800 L1920 600 L1920 1080 L0 1080 Z" fill="#0d001f" opacity="0.9" />
    <path d="M0 1000 L500 750 L1000 950 L1400 700 L1920 950 L1920 1080 L0 1080 Z" fill="#05000d" />
  </svg>
);

const DigitalClock = ({ showSeconds }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] select-none z-10 relative mt-[-10vh]">
      <div className="text-xl md:text-3xl font-medium tracking-widest uppercase mb-4 opacity-90 drop-shadow-md">
        {dateStr}
      </div>
      <div className="text-[8rem] md:text-[14rem] font-black leading-none tracking-tighter flex items-baseline drop-shadow-2xl">
        <div className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 py-4">
          {hours}
          <span className={`inline-block ${time.getSeconds() % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}>:</span>
          {minutes}
        </div>
        {showSeconds && (
          <div className="text-[4rem] md:text-[7rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400 ml-4 opacity-90 py-4 pr-2">
            {seconds}
          </div>
        )}
      </div>
    </div>
  );
};

export default function PersonalSpace() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSeconds, setShowSeconds] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-pure-black text-white font-sans h-screen overflow-y-auto hide-scrollbar scroll-smooth">
      
      {/* --- LOCKSCREEN HERO SECTION (Only visible in fullscreen) --- */}
      <div className={`relative w-full overflow-hidden transition-all duration-1000 ease-in-out ${isFullscreen ? 'h-[100vh] opacity-100' : 'h-0 opacity-0'}`}>
        {isFullscreen && <SceneryHero />}
        {isFullscreen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <DigitalClock showSeconds={showSeconds} />
             
             {/* Seconds Toggle */}
             <div className="absolute bottom-12 flex flex-col items-center gap-4 z-20">
               <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 hover:border-white/30 transition-all">
                  <span className="text-sm font-bold tracking-widest uppercase text-gray-300">Seconds</span>
                  <button 
                    onClick={() => setShowSeconds(!showSeconds)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${showSeconds ? 'bg-brand' : 'bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform duration-300 ${showSeconds ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
               </div>
               
               {/* Scroll Indicator */}
               <div className="mt-8 animate-bounce opacity-60">
                 <i className="fas fa-chevron-down text-2xl text-white"></i>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* --- STANDARD BACKGROUND EFFECTS (When not in fullscreen hero) --- */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-full h-full bg-brand-dark rounded-full filter blur-[150px] opacity-20 animate-pulse mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 -right-1/4 w-full h-full bg-blue-900 rounded-full filter blur-[150px] opacity-20 animate-pulse mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900 rounded-full filter blur-[200px] opacity-10 mix-blend-screen pointer-events-none"></div>
        </div>
      )}

      {/* Navigation */}
      {!isFullscreen && (
        <nav className="relative z-50 w-full py-6 px-8 flex justify-between items-center glass border-b border-white/5 sticky top-0 backdrop-blur-xl">
          <Link to="/" className="text-2xl font-bold tracking-tighter hover:scale-105 transition-transform flex items-center gap-2 text-white">
            <i className="fas fa-arrow-left text-brand text-sm"></i> Back to Hub
          </Link>
          <button 
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-white/5 hover:bg-brand/20 border border-white/10 hover:border-brand/50 px-4 py-2 rounded-full transition-all text-sm font-bold tracking-widest uppercase text-gray-300 hover:text-white"
          >
            <i className="fas fa-expand"></i> Wallpaper Mode
          </button>
        </nav>
      )}

      {isFullscreen && (
        <button 
          onClick={toggleFullscreen}
          className="fixed top-6 right-6 z-50 bg-pure-black/50 hover:bg-red-500/80 text-white p-4 rounded-full backdrop-blur-md transition-all shadow-xl border border-white/10"
          title="Exit Wallpaper Mode"
        >
          <i className="fas fa-compress text-xl"></i>
        </button>
      )}

      {/* Main Content Grid */}
      <main className={`relative z-10 max-w-7xl mx-auto px-6 md:px-12 transition-all duration-700 ease-in-out py-20`}>
        
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand to-blue-500">Space</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-light">
            My curated corner of the internet. A collection of thoughts, sounds, and visual explorations.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* On Repeat Widget */}
          <div className="md:col-span-8 lg:col-span-7 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col group hover:bg-white/[0.04] hover:border-brand/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand/10 rounded-full blur-[80px] group-hover:bg-brand/20 transition-all duration-700 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center shadow-lg">
                <i className="fas fa-headphones text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">On Repeat</h3>
                <p className="text-gray-400 text-sm">My anti-mainstream playlist</p>
              </div>
            </div>
            
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-inner flex-1">
              <iframe
                className="absolute top-0 left-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                src="https://www.youtube.com/embed/videoseries?si=PPU3hyNasxUWEoc5&amp;list=PLPirW_3Fhee_pfal-zq34cbCP7FB9k4E4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              >
              </iframe>
            </div>
          </div>

          {/* Intro / Stat Card */}
          <div className="md:col-span-4 lg:col-span-5 bg-gradient-to-br from-brand-dark/20 to-pure-black backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center group hover:border-brand/40 transition-all duration-500 shadow-2xl relative overflow-hidden">
             <i className="fas fa-quote-left text-4xl text-brand/30 mb-6 absolute top-8 left-8"></i>
             <h2 className="text-3xl font-bold text-white mb-4 z-10 leading-snug">"Design is not just what it looks like and feels like. Design is how it works."</h2>
             <p className="text-gray-400 z-10 font-medium tracking-wide uppercase text-sm">- Steve Jobs</p>
          </div>

          {/* Mainstream Music Widget */}
          <div className="md:col-span-5 lg:col-span-4 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col group hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center shadow-lg">
                <i className="fas fa-compact-disc text-white text-xl animate-[spin_4s_linear_infinite]"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Mainstream</h3>
                <p className="text-gray-400 text-sm">Popular hits</p>
              </div>
            </div>
            
            <div className="relative w-full aspect-square md:aspect-auto md:flex-1 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
              <iframe
                className="absolute top-0 left-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                src="https://www.youtube.com/embed/videoseries?si=lIUtmAs_wbRmAu7a&amp;list=PLPirW_3Fhee9Iqfah08npjgMtVpjFsN93"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              >
              </iframe>
            </div>
          </div>

          {/* Articles Section */}
          <div className="md:col-span-7 lg:col-span-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col group hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900 to-purple-500 flex items-center justify-center shadow-lg">
                  <i className="fas fa-feather-alt text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Recent Thoughts</h3>
              </div>
              <Link to="/articles" className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest flex items-center gap-2">
                View All <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {articles.slice(0, 3).map((article) => (
                <Link to={`/articles/${article.slug}`} key={article.slug} className={`group/article flex flex-col md:flex-row gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10`}>
                  <div className="w-full md:w-48 h-32 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 relative">
                     <div className={`absolute inset-0 bg-gradient-to-br ${article.categoryBg} mix-blend-overlay z-10 group-hover/article:opacity-50 transition-opacity`}></div>
                     <img src={article.coverImage} alt="Article cover" className="w-full h-full object-cover filter grayscale group-hover/article:grayscale-0 transition-all duration-500 transform group-hover/article:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className={`text-xs font-bold ${article.categoryColor} mb-2 tracking-widest uppercase`}>{article.category}</span>
                    <h4 className={`text-xl font-bold text-white mb-2 group-hover/article:${article.categoryColor} transition-colors leading-tight`}>{article.title}</h4>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Global styles specifically for this page */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
}
