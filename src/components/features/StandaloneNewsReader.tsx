import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, Clock, Share2, Printer, ArrowLeft, Check, Link, Facebook, Twitter, Smartphone, ExternalLink, Award } from 'lucide-react';
import { PRESET_NEWS, NewsArticle } from './News';

export const StandaloneNewsReader: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  // Get article from URL query param
  const queryParams = new URLSearchParams(window.location.search);
  const articleId = queryParams.get('article');
  const activeArticle = PRESET_NEWS.find(a => a.id === articleId) || PRESET_NEWS[0];

  // Direct primary and secondary fallbacks
  const primaryFallback = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop";
  const secondaryFallback = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop";

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(activeArticle.title)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(activeArticle.title + ' - ' + shareUrl)}`, '_blank');
  };

  const returnToPortal = () => {
    // Clear the query parameter and reload the main page
    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <div className="min-h-screen bg-[#fcfaf4] text-slate-900 font-sans pb-24 relative selection:bg-amber-200">
      {/* Editorial top line decor */}
      <div className="h-2 bg-gradient-to-r from-amber-600 via-primary to-emerald-600 w-full" />

      <header className="max-w-4xl mx-auto px-4 pt-8 md:pt-12 text-center pb-8 border-b-4 border-double border-slate-900/10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono uppercase tracking-widest text-slate-500 mb-6 pb-4 border-b border-slate-900/5">
          <div className="font-bold flex items-center gap-1.5"><Newspaper size={14} className="text-primary" /> KHARANDI</div>
          <button 
            onClick={returnToPortal}
            id="back-to-home-btn"
            className="px-4 py-1.5 bg-slate-900 text-white rounded-full hover:bg-primary transition-all text-[11px] font-bold flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={12} /> ALLER AU PORTAIL KHARANDI
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 bg-slate-900 text-white rounded">
            {activeArticle.category}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-mono text-slate-500 font-bold uppercase">{activeArticle.source}</span>
        </div>

        <h1 className="font-display text-3xl md:text-5xl lg:text-5.5xl font-black text-slate-950 tracking-tight leading-tight max-w-3xl mx-auto mb-6">
          {activeArticle.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500 mb-2">
          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {activeArticle.date}</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> Temps de lecture : {activeArticle.readTime}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Social share side bar */}
          <div className="lg:col-span-2 lg:sticky lg:top-8 flex lg:flex-col gap-3 justify-center pt-2">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 hidden lg:block text-center mb-1">PARTAGER</p>
            <button 
              onClick={shareOnWhatsApp}
              id="share-wa"
              className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-2xl border border-emerald-200/50 transition-all flex items-center justify-center cursor-pointer hover:shadow-md"
              title="Partager sur WhatsApp"
            >
              <Smartphone size={18} />
            </button>
            <button 
              onClick={shareOnFacebook}
              id="share-fb"
              className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl border border-blue-200/50 transition-all flex items-center justify-center cursor-pointer hover:shadow-md"
              title="Partager sur Facebook"
            >
              <Facebook size={18} />
            </button>
            <button 
              onClick={shareOnTwitter}
              id="share-tw"
              className="p-3 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-2xl border border-sky-200/50 transition-all flex items-center justify-center cursor-pointer hover:shadow-md"
              title="Partager sur X (Twitter)"
            >
              <Twitter size={18} />
            </button>
            <button 
              onClick={handleCopyLink}
              id="share-copy"
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-300/40 transition-all flex items-center justify-center cursor-pointer relative hover:shadow-md"
              title="Copier le lien direct"
            >
              {copied ? <Check size={18} className="text-green-600" /> : <Link size={18} />}
            </button>
          </div>

          {/* Article main content */}
          <div className="lg:col-span-12 space-y-8">
            
            {/* Primary Hero image */}
            <div className="w-full h-64 md:h-[480px] rounded-[32px] overflow-hidden relative border border-slate-200 bg-white shadow-xl">
              <img 
                src={activeArticle.image} 
                alt={activeArticle.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = primaryFallback;
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 to-transparent text-white p-4 pt-12 md:p-6 md:pt-16">
                <p className="text-xs font-mono opacity-90 flex items-center gap-1">
                  <Award size={12} className="text-secondary" /> {activeArticle.source} — Session 2026.
                </p>
              </div>
            </div>

            {/* Paragraph columns with Drop Cap and beautiful styling */}
            <div className="font-serif text-slate-850 text-base md:text-lg leading-relaxed text-justify space-y-6 max-w-3xl mx-auto">
              
              {activeArticle.content.split('\n\n').map((paragraph, index) => {
                // If subheader
                if (paragraph.startsWith('###')) {
                  return (
                    <h2 key={index} className="font-display font-black text-slate-900 text-xl md:text-2xl tracking-normal mt-10 mb-4 border-l-4 border-primary pl-3">
                      {paragraph.replace('###', '').trim()}
                    </h2>
                  );
                }

                // If lists/bullets inside (for potential flexibility)
                if (paragraph.startsWith('*') || paragraph.includes('* ')) {
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2 font-sans text-sm md:text-base text-slate-700 my-4">
                      {paragraph.split('\n').map((li, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">{li.replace('*', '').trim()}</li>
                      ))}
                    </ul>
                  );
                }

                // Embed secondary image beautifully after the first subtopic
                const isAfterFirstSection = index === 2;

                return (
                  <React.Fragment key={index}>
                    {index === 0 ? (
                      <p className="mb-6 text-base md:text-lg text-slate-900 font-serif leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-primary">
                        {paragraph}
                      </p>
                    ) : (
                      <p className="mb-6 text-slate-750 font-serif leading-relaxed">
                        {paragraph}
                      </p>
                    )}

                    {isAfterFirstSection && activeArticle.secondImage && (
                      <div className="my-8 w-full h-56 md:h-80 rounded-[24px] overflow-hidden relative border border-slate-200 bg-white shadow-md">
                        <img 
                          src={activeArticle.secondImage} 
                          alt="Salle d'examen et candidats" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = secondaryFallback;
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 p-2.5 text-white text-[11px] font-mono text-center">
                          Égalité des chances et inclusion : transcription d'épreuves pour tous élèves.
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Newsletter Subscription promotion panel instead of normal ads */}
            <div className="bg-[#f2efe4] rounded-3xl p-6 md:p-8 border border-slate-900/5 max-w-3xl mx-auto text-center space-y-4">
              <h3 className="font-display font-black text-slate-900 text-lg md:text-xl">Suivez toute l'actualité des examens en Guinée</h3>
              <p className="text-slate-600 text-sm max-w-lg mx-auto font-serif italic">
                Kharandi est le portail d'apprentissage intelligent en Guinée. Révisez, entraînez-vous et consultez directement vos notes.
              </p>
              <div className="pt-2">
                <button 
                  onClick={returnToPortal}
                  id="discover-portal-btn"
                  className="px-6 py-3 bg-slate-900 hover:bg-primary text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  DÉCOUVRIR LE PORTAIL KHARANDI <ExternalLink size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-slate-900/10 pt-8 max-w-4xl mx-auto px-4 text-center text-xs font-mono text-slate-500 space-y-2">
        <p>Publié par l'admin de Kharandi — Évènement suivi le {activeArticle.date.split(' ').slice(1).join(' ')}</p>
        <p>© 2026 Kharandi. Tous droits réservés. Tout usage d'informations doit citer la source officielle.</p>
      </footer>
    </div>
  );
};
