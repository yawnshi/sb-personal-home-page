import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

export default function ArticlesHub() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <div className="min-h-screen bg-pure-black text-white font-sans selection:bg-brand selection:text-white">
      {/* Navigation */}
      <nav className="relative z-50 w-full py-6 px-8 flex justify-between items-center glass border-b border-white/5 sticky top-0 backdrop-blur-xl">
        <Link to="/personal-space" className="text-xl font-bold tracking-tighter hover:scale-105 transition-transform flex items-center gap-2 text-gray-400 hover:text-white">
          <i className="fas fa-arrow-left text-brand text-sm"></i> Back to Personal Space
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Thoughts</span>
          </h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            A collection of essays, technical deep-dives, and philosophical musings on design, engineering, and the spaces in between.
          </p>
        </div>

        {/* Premium Card Grid (Masonry feel) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link 
              key={article.slug} 
              to={`/articles/${article.slug}`} 
              className={`group flex flex-col bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.05] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2`}
            >
              <div className="w-full aspect-video bg-gray-800 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${article.categoryBg} mix-blend-overlay z-10 group-hover:opacity-50 transition-opacity duration-500`}></div>
                <img 
                  src={article.coverImage} 
                  alt={article.title} 
                  className="w-full h-full object-cover filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110" 
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-bold ${article.categoryColor} tracking-widest uppercase`}>{article.category}</span>
                  <span className="text-xs font-medium text-gray-500 tracking-wider">{article.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all leading-snug">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-sm font-bold text-white tracking-widest uppercase gap-2 group-hover:text-brand transition-colors">
                  Read Article <i className="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
    </motion.div>
  );
}