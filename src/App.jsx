import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import PersonalSpace from './pages/PersonalSpace';
import ArticlesHub from './pages/ArticlesHub';
import ArticleDetail from './pages/ArticleDetail';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/personal-space" element={<PersonalSpace />} />
        <Route path="/articles" element={<ArticlesHub />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
