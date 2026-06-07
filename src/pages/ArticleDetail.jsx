import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { articles } from '../data/articles';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-pure-black text-white flex flex-col items-center justify-center font-sans">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <button onClick={() => navigate('/articles')} className="text-brand hover:underline">
          Return to Articles Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pure-black text-white font-sans selection:bg-brand selection:text-white">
      {/* Navigation */}
      <nav className="relative z-50 w-full py-6 px-8 flex justify-between items-center glass border-b border-white/5 sticky top-0 backdrop-blur-xl">
        <Link to="/articles" className="text-xl font-bold tracking-tighter hover:scale-105 transition-transform flex items-center gap-2 text-gray-400 hover:text-white">
          <i className="fas fa-arrow-left text-brand text-sm"></i> Back to Articles
        </Link>
      </nav>

      <article className="max-w-4xl mx-auto px-6 md:px-12 py-12 pb-32">
        {/* Header / Hero */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className={`text-sm font-bold ${article.categoryColor} tracking-widest uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10`}>
              {article.category}
            </span>
            <span className="text-sm font-medium text-gray-500 tracking-wider">
              {article.date}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
            {article.title}
          </h1>
          <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden relative shadow-2xl mb-12">
            <div className={`absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent z-10 opacity-80`}></div>
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </header>

        {/* Content using react-markdown */}
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand hover:prose-a:text-brand-light prose-blockquote:border-l-brand prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-img:rounded-xl">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
        
        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-white/10 flex justify-between items-center">
          <p className="text-gray-500 font-medium">Thanks for reading.</p>
          <Link to="/articles" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors text-sm font-bold tracking-widest uppercase text-white">
            More Articles <i className="fas fa-arrow-right text-brand"></i>
          </Link>
        </div>
      </article>

      {/* Basic prose styles (since we don't have tailwindcss/typography plugin installed) */}
      <style>{`
        .prose h1 { font-size: 2.5em; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.2; }
        .prose h2 { font-size: 2em; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.3; }
        .prose h3 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.4; }
        .prose p { margin-top: 1.25em; margin-bottom: 1.25em; line-height: 1.8; color: #a1a1aa; }
        .prose ul { margin-top: 1.25em; margin-bottom: 1.25em; padding-left: 1.625em; list-style-type: disc; color: #a1a1aa; }
        .prose li { margin-top: 0.5em; margin-bottom: 0.5em; }
        .prose blockquote { 
          margin-top: 1.6em; 
          margin-bottom: 1.6em; 
          border-left-width: 4px; 
          border-color: #10b981; 
          font-style: italic; 
          color: #e4e4e7;
          background: rgba(255,255,255,0.03);
          padding: 1rem 1.5rem;
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .prose strong { color: white; font-weight: 700; }
        .prose a { color: #10b981; text-decoration: underline; text-underline-offset: 4px; }
        .prose a:hover { color: #34d399; }
      `}</style>
    </div>
  );
}
