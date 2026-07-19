import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';
import { SceneryHero, wallpaperThemes } from '../components/SceneryHero';

const DigitalClock = ({ showSeconds, themeVibe }) => {
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
      <div className="text-[4.5rem] min-[400px]:text-[5.5rem] sm:text-[8rem] md:text-[12rem] lg:text-[14rem] font-black leading-none tracking-tighter flex flex-wrap justify-center items-baseline drop-shadow-2xl">
        <div className="flex">
          <span className="inline-block py-4 px-1 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{hours}</span>
          <span className={`inline-block py-4 w-[0.3em] text-center text-gray-200 transition-opacity ${time.getSeconds() % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}>:</span>
          <span className="inline-block py-4 px-1 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{minutes}</span>
        </div>
        {showSeconds && (
          <div className={`text-[2.5rem] min-[400px]:text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] font-bold text-transparent bg-clip-text ${themeVibe} sm:ml-4 opacity-90 py-4 px-2 md:px-4 -ml-2 sm:ml-0`}>
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
  const [wallpaperPref, setWallpaperPref] = useState(() => {
    return localStorage.getItem('sb_wallpaper_pref') || 'daily';
  });
  const [hoveredThemeId, setHoveredThemeId] = useState(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef(null);
  const idleTimerRef = useRef(null);

  const resetIdleTimer = () => {
    setShowControls(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowControls(false);
      setIsThemeMenuOpen(false);
    }, 4000);
  };

  useEffect(() => {
    if (isFullscreen) resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isFullscreen]);

  useEffect(() => {
    localStorage.setItem('sb_wallpaper_pref', wallpaperPref);
  }, [wallpaperPref]);

  const savedThemeId = wallpaperPref === 'daily' 
    ? wallpaperThemes[new Date().getDay() % wallpaperThemes.length].id 
    : wallpaperPref;
  const activeThemeId = hoveredThemeId || savedThemeId;
  const activeTheme = wallpaperThemes.find(t => t.id === activeThemeId) || wallpaperThemes[0];

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        try {
          await containerRef.current.requestFullscreen();
        } catch (err) {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        }
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
      // Always set to true as fallback for iOS
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      // Only update if natively supported, otherwise let the React state control it
      if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
         setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <div ref={containerRef} className={`bg-pure-black text-white font-sans h-screen overflow-y-auto hide-scrollbar scroll-smooth ${isFullscreen ? 'fixed inset-0 z-[100] w-full' : 'relative'}`}>
      
      {/* --- LOCKSCREEN HERO SECTION (Only visible in fullscreen) --- */}
      <div className={`relative w-full overflow-hidden transition-all duration-1000 ease-in-out ${isFullscreen ? 'h-[100vh] opacity-100' : 'h-0 opacity-0'}`}>
        {isFullscreen && <SceneryHero themeId={activeThemeId} />}
        {isFullscreen && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            onMouseMove={resetIdleTimer}
            onClick={resetIdleTimer}
            onTouchStart={resetIdleTimer}
          >
             <DigitalClock showSeconds={showSeconds} themeVibe={activeTheme.vibe} />
             
             {/* Controls Group */}
             <div className={`absolute bottom-12 flex flex-col items-center gap-4 z-20 transition-all duration-700 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
               <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transition-all shadow-2xl relative">
                  <span className="text-sm font-bold tracking-widest uppercase text-gray-300">Seconds</span>
                  <button 
                    onClick={() => setShowSeconds(!showSeconds)}
                    className={`w-12 h-6 rounded-full transition-all relative flex items-center ${showSeconds ? activeTheme.vibe : 'bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform duration-300 ${showSeconds ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>

                  <div className="w-px h-6 bg-white/20 mx-2"></div>

                  {/* Theme Palette Toggle */}
                  <button 
                    onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                    className={`text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ${isThemeMenuOpen ? 'bg-white/20 text-white' : ''}`}
                    title="Change Wallpaper"
                  >
                    <i className="fas fa-palette"></i>
                  </button>

                  {/* Theme Menu Dropdown */}
                  <AnimatePresence>
                    {isThemeMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-2 w-48 shadow-2xl origin-bottom"
                      >
                        <button
                          onClick={() => setWallpaperPref('daily')}
                          onMouseEnter={() => setHoveredThemeId('daily' === 'daily' ? wallpaperThemes[new Date().getDay() % wallpaperThemes.length].id : null)}
                          onMouseLeave={() => setHoveredThemeId(null)}
                          className={`text-left px-4 py-2 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors ${wallpaperPref === 'daily' ? activeTheme.vibe + ' text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                          <i className="fas fa-sync-alt mr-2"></i> Daily Rotate
                        </button>
                        <div className="h-px bg-white/10 my-1 w-full"></div>
                        {wallpaperThemes.map(t => (
                          <button
                            key={t.id}
                            onClick={() => setWallpaperPref(t.id)}
                            onMouseEnter={() => setHoveredThemeId(t.id)}
                            onMouseLeave={() => setHoveredThemeId(null)}
                            className={`text-left px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${wallpaperPref === t.id ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                          >
                            <div className={`w-3 h-3 rounded-full ${t.vibe}`}></div>
                            {t.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
          className={`fixed top-6 right-6 z-50 bg-pure-black/50 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md shadow-xl border border-white/10 transition-all duration-700 ease-in-out ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
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
    </motion.div>
  );
}