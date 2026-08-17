import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, GraduationCap, Building2, MapPin, Award, Smartphone, Facebook, Twitter, Link, Check, ArrowLeft, Newspaper, HelpCircle, FileSpreadsheet, Download, ExternalLink, Eye, EyeOff, FileText, BookOpen } from 'lucide-react';
import { EduLoading } from './EduLoading';
import { KharandiIcon } from '../icons/KharandiIcon';
import { fetchWithAuth, BASE_URL } from '../../config/api';

export const StandaloneResultsReader: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [examResults, setExamResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('all'); // all, noms, pv, centre
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [activeExamTab, setActiveExamTab] = useState<'ALL' | 'CEE' | 'BEPC' | 'BEPC_FA' | 'BAC'>('ALL');
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  const shareUrl = window.location.href;

  const officialDocs = [
    {
      id: 'bac-2026',
      tab: 'BAC',
      title: "Résultats Officiels du Baccalauréat Unique — Session 2026",
      subtitle: "Baccalauréat Unique (Toutes Options)",
      description: "Procès-verbal officiel et liste intégrale des candidats admis au Baccalauréat Unique Session 2026 (Sciences Mathématiques, Sciences Expérimentales, Sciences Sociales).",
      viewUrl: "https://drive.google.com/file/d/1SiY39yOtwO9-w7UcursP3fGsueYB7ekk/view?usp=drive_link",
      previewUrl: "https://drive.google.com/file/d/1SiY39yOtwO9-w7UcursP3fGsueYB7ekk/preview",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      id: 'bepc-eg-2026',
      tab: 'BEPC',
      title: "Résultats Officiels du BEPC (Enseignement Général) — Session 2026",
      subtitle: "Brevet d'Études du Premier Cycle (Enseignement Général)",
      description: "Procès-verbal officiel et liste des admis au BEPC 2026 pour l'Enseignement Général sur l'ensemble du territoire national.",
      viewUrl: "https://drive.google.com/file/d/1kLOfpdaEFhHVPFzUmEVrxiJeE9mxf5ON/view?usp=drive_link",
      previewUrl: "https://drive.google.com/file/d/1kLOfpdaEFhHVPFzUmEVrxiJeE9mxf5ON/preview",
      badgeColor: "bg-[#18bfd6]/10 text-[#18bfd6] border-[#18bfd6]/20"
    },
    {
      id: 'bepc-fa-2026',
      tab: 'BEPC_FA',
      title: "Résultats Officiels du BEPC Franco-Arabe — Session 2026",
      subtitle: "Brevet d'Études du Premier Cycle (Franco-Arabe)",
      description: "Procès-verbal officiel et résultats de la session 2026 du BEPC option Franco-Arabe pour toutes les préfectures et communes.",
      viewUrl: "https://drive.google.com/file/d/1Cxu9LFVIdMm37ooCBBXraDljC23zFSxu/view?usp=sharing",
      previewUrl: "https://drive.google.com/file/d/1Cxu9LFVIdMm37ooCBBXraDljC23zFSxu/preview",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Consultez les résultats officiels des examens nationaux (CEE, BEPC, BAC) 2026 sur Kharandi sans inscription !")}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Consultez directement les résultats des examens (CEE, BEPC, BAC) 2026 en Guinée sans inscription sur Kharandi : " + shareUrl)}`, '_blank');
  };

  const shareIndividualResult = (r: any) => {
    const examName = r.examTitle || r.exam || 'Examens 2026';
    const text = `🎉 Félicitations à ${r.noms} ! Admis(e) au ${examName} avec mention/option ${r.mention || 'ADMIS'}. PV : ${r.pv}, Centre : ${r.centre}, DPE : ${r.dpe}. Vérifie ton résultat ici : ${window.location.origin}/?results=cee2026`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [displayLimit, setDisplayLimit] = useState(100);

  // Reset limit when filter or search changes
  useEffect(() => {
    setDisplayLimit(100);
  }, [activeExamTab, searchFilter, searchQuery]);

  // Handle Search across exam categories
  useEffect(() => {
    if (searchQuery.trim().length === 1) {
      return;
    }

    const doFetch = async () => {
      setLoading(true);
      const examParam = activeExamTab === 'ALL' ? 'all' : activeExamTab.toLowerCase();
      try {
        const res = await fetchWithAuth(`/search/?q=${encodeURIComponent(searchQuery.trim())}&type=${searchFilter}&limit=${displayLimit}`);
        if (!res.ok) {
          const errText = await res.text();
          if (res.status === 401 || res.status === 403) {
            throw new Error(`Authentication required (401/403). Please log in.`);
          }
          throw new Error(`Search API ${res.status}: ${errText.slice(0, 100)}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const errText = await res.text();
          throw new Error(`Expected JSON, got HTML or other (${res.status}): ${errText.slice(0, 100)}`);
        }
        const json = await res.json();
        const resultsContainer = json.data?.results || json.results || json.data || json;
        let items: any[] = [];
        if (Array.isArray(resultsContainer)) {
          items = resultsContainer;
        } else if (resultsContainer && typeof resultsContainer === 'object') {
          items = [
            ...(resultsContainer.documents || []),
            ...(resultsContainer.qcm || []),
            ...(resultsContainer.results || []),
            ...(resultsContainer.items || []),
            ...(resultsContainer.exam_results || [])
          ];
          if (items.length === 0) {
            items = Object.values(resultsContainer).flat().filter(x => x && typeof x === 'object');
          }
        }
        setExamResults(items);
        const total = json.total || json.data?.total || items.length;
        setTotalCount(total);
      } catch (err) {
        console.error("Error fetching exam results:", err);
        setExamResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (!searchQuery.trim()) {
      doFetch();
      return;
    }

    const timer = setTimeout(doFetch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchFilter, activeExamTab, displayLimit]);

  const returnToPortal = () => {
    window.location.href = window.location.origin;
  };

  const getExamBadge = (exam: string) => {
    switch (exam?.toUpperCase()) {
      case 'CEE':
        return { label: 'CEE (7ème)', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'BEPC':
        return { label: 'BEPC Général', color: 'bg-[#18bfd6]/15 text-[#1593a4] border-[#18bfd6]/30' };
      case 'BEPC_FA':
        return { label: 'BEPC Franco-Arabe', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'BAC':
        return { label: 'BAC 2026', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      default:
        return { label: exam || 'Examen', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf4] text-slate-900 font-sans pb-24 relative selection:bg-[#bff0f5]/50">
      {/* Editorial top line decor */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-[#18bfd6] to-amber-500 w-full" />

      <header className="max-w-4xl mx-auto px-4 pt-8 md:pt-12 text-center pb-8 border-b-4 border-double border-slate-900/10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono uppercase tracking-widest text-slate-500 mb-6 pb-4 border-b border-slate-900/5">
          <div className="font-bold flex items-center gap-2">
            <KharandiIcon name="actualites" size={28} showBookmark={false} />
            <span>KHARANDI INFOS</span>
          </div>
          <button 
            onClick={returnToPortal}
            id="back-to-home-btn"
            className="px-4 py-1.5 bg-slate-900 text-white rounded-full hover:bg-[#18bfd6] transition-all text-[11px] font-bold flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={12} /> ACCÉDER AU PORTAIL APPRENANT
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 bg-[#18bfd6] text-white rounded-md">
            BASE DE DONNÉES INTÉGRALE 2026
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-mono text-slate-500 font-bold uppercase">MINISTÈRE DE L'ÉDUCATION NATIONALE (DGE)</span>
        </div>

        <h1 className="font-display text-3xl md:text-5xl lg:text-5.5xl font-black text-slate-950 tracking-tight leading-tight max-w-3xl mx-auto mb-6">
          Résultats Officiels des Examens Nationaux — Session 2026
        </h1>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto font-serif italic mb-6">
          Consultez instantanément l'intégralité des résultats officiels (CEE, BEPC Général, BEPC Franco-Arabe & Baccalauréat Unique 2026) par PV, Nom, Prénom, DPE ou Centre d'Examen.
        </p>

        {/* Quick Social share bar */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mr-1">Partager l'accès :</span>
          <button 
            onClick={shareOnWhatsApp}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl border border-emerald-200/40 transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:shadow-sm"
            title="Partager sur WhatsApp"
          >
            <Smartphone size={16} />
          </button>
          <button 
            onClick={shareOnFacebook}
            className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl border border-blue-200/40 transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:shadow-sm"
            title="Partager sur Facebook"
          >
            <Facebook size={16} />
          </button>
          <button 
            onClick={shareOnTwitter}
            className="p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl border border-sky-200/40 transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:shadow-sm"
            title="Partager sur X (Twitter)"
          >
            <Twitter size={16} />
          </button>
          <button 
            onClick={handleCopyLink}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300/40 transition-all flex items-center justify-center cursor-pointer relative shadow-2xs hover:shadow-sm"
            title="Copier le lien direct"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Link size={16} />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {/* Exam Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
          <button 
            onClick={() => setActiveExamTab('ALL')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border cursor-pointer flex items-center gap-1.5 ${
              activeExamTab === 'ALL' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Search size={14} /> Tous les Examens
          </button>
          <button 
            onClick={() => setActiveExamTab('CEE')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border cursor-pointer flex items-center gap-1.5 ${
              activeExamTab === 'CEE' 
                ? 'bg-amber-600 text-white border-amber-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Search size={14} /> CEE (7ème)
          </button>
          <button 
            onClick={() => setActiveExamTab('BEPC')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border cursor-pointer flex items-center gap-1.5 ${
              activeExamTab === 'BEPC' 
                ? 'bg-[#18bfd6] text-white border-[#18bfd6] shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText size={14} /> BEPC Général
          </button>
          <button 
            onClick={() => setActiveExamTab('BEPC_FA')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border cursor-pointer flex items-center gap-1.5 ${
              activeExamTab === 'BEPC_FA' 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={14} /> BEPC Franco-Arabe
          </button>
          <button 
            onClick={() => setActiveExamTab('BAC')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all border cursor-pointer flex items-center gap-1.5 ${
              activeExamTab === 'BAC' 
                ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Award size={14} /> BAC 2026
          </button>
        </div>

        {/* SEARCH FORM CONTAINER */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/70 shadow-lg relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#18bfd6]/5 rounded-full -mr-12 -mt-12 -z-0"></div>
          
          <h2 className="text-xl font-black text-slate-900 mb-2 relative z-10 flex items-center gap-2">
            <FileSpreadsheet className="text-[#18bfd6]" size={22} />
            Moteur de Recherche Direct {activeExamTab !== 'ALL' ? `(${activeExamTab})` : '(Tous les Examens)'}
          </h2>
          
          <p className="text-xs text-slate-500 mb-6 font-medium max-w-xl">
            Saisissez le numéro de PV (ex: 1836, 28767), le nom d'élève ou le centre d'examen pour consulter le résultat.
          </p>

          <div className="flex flex-col lg:flex-row gap-4 relative z-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={
                  searchFilter === 'pv' 
                    ? "Exemple de PV : 1967, 28767, 3074..." 
                    : searchFilter === 'centre' 
                    ? "Exemple de centre : FETO, CABRAL, MATOTO..." 
                    : "Saisissez un Nom, Prénom, PV, Centre ou DPE..."
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#18bfd6] focus:bg-white focus:ring-4 focus:ring-[#18bfd6]/10 transition-all text-slate-800 placeholder-slate-400" 
              />
            </div>

            {/* Filters list */}
            <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shrink-0 overflow-x-auto">
              <button 
                onClick={() => setSearchFilter('all')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Tous
              </button>
              <button 
                onClick={() => setSearchFilter('pv')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'pv' ? 'bg-white shadow-sm text-[#18bfd6]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Par PV
              </button>
              <button 
                onClick={() => setSearchFilter('centre')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'centre' ? 'bg-white shadow-sm text-[#18bfd6]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Par Centre
              </button>
              <button 
                onClick={() => setSearchFilter('noms')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'noms' ? 'bg-white shadow-sm text-[#18bfd6]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Par Nom
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS DISPLAYING SECTION */}
        {loading ? (
          <div className="py-12">
            <EduLoading message="Recherche dans la base de données nationale des résultats 2026..." />
          </div>
        ) : examResults.length === 0 ? (
          <div className="bg-white p-12 rounded-[32px] text-center border border-slate-200/60 shadow-md mb-8">
            <HelpCircle className="mx-auto text-slate-300 mb-4 animate-pulse" size={52} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchQuery.trim().length >= 2 ? "Aucun résultat trouvé" : "Aucun résultat disponible"}
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {searchQuery.trim().length >= 2 
                ? "La recherche n'a retourné aucun candidat admis. Vérifiez le PV ou l'orthographe du nom ou changez d'onglet d'examen."
                : "Veuillez patienter ou lancer une recherche par nom, PV ou centre."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-2">
              <p className="text-sm font-bold text-slate-600">
                {searchQuery.trim() 
                  ? `Affichage de ${examResults.length} sur ${totalCount || examResults.length} candidat(s) trouvé(s) pour "${searchQuery}"`
                  : `Affichage de ${examResults.length} sur ${totalCount || examResults.length} candidats admis (${activeExamTab !== 'ALL' ? activeExamTab : 'Tous les examens'})`}
              </p>
              {totalCount > examResults.length && (
                <button
                  onClick={() => setDisplayLimit(totalCount || 10000)}
                  className="text-xs font-bold text-[#18bfd6] hover:underline cursor-pointer text-left sm:text-right"
                >
                  Tout afficher ({totalCount} candidats)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {examResults.map((r, i) => {
                  const badge = getExamBadge(r.exam);
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.25 }}
                      className="bg-white p-5 rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-[100px] -z-0"></div>
                      
                      <div>
                        <div className="flex justify-between items-start mb-3 relative z-10 gap-2 flex-wrap">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <div className="bg-emerald-50 text-emerald-800 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <Award size={12} /> {r.mention || 'ADMIS'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-slate-900 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
                            PV: {r.pv}
                          </span>
                          {r.rang && (
                            <span className="text-xs text-slate-500 font-mono font-bold">
                              Rang: {r.rang}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-base font-black text-slate-950 mb-3 relative z-10 group-hover:text-[#18bfd6] transition-colors leading-snug">
                          {r.noms}
                        </h3>
                        
                        <div className="space-y-2 relative z-10 text-xs font-medium text-slate-600 mb-4">
                          {r.centre && (
                            <p className="flex items-start gap-2">
                              <Building2 size={15} className="text-slate-400 shrink-0 mt-0.5" /> 
                              <span className="line-clamp-1"><b>Centre :</b> {r.centre}</span>
                            </p>
                          )}
                          {r.origine && (
                            <p className="flex items-start gap-2">
                              <GraduationCap size={15} className="text-slate-400 shrink-0 mt-0.5" /> 
                              <span className="line-clamp-1"><b>Origine :</b> {r.origine}</span>
                            </p>
                          )}
                          {r.dpe && (
                            <p className="flex items-start gap-2">
                              <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" /> 
                              <span><b>DPE/Option :</b> {r.dpe}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                        <button 
                          onClick={() => setSelectedResult(r)}
                          className="text-[11px] font-bold text-[#18bfd6] hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          Détails complets
                        </button>
                        
                        <button 
                          onClick={() => shareIndividualResult(r)}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/30 transition-all"
                          title="Partager sur WhatsApp"
                        >
                          <Smartphone size={12} /> WhatsApp
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {(examResults.length >= displayLimit || (totalCount > examResults.length)) && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 100)}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-[#18bfd6] text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  Charger +100 candidats
                </button>
                {totalCount > examResults.length && (
                  <button
                    onClick={() => setDisplayLimit(totalCount || 10000)}
                    className="px-6 py-3.5 bg-[#18bfd6] hover:bg-[#159cb0] text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    Tout afficher ({totalCount} candidats)
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* OFFICIAL EXAM DOCUMENTS DOWNLOAD & PREVIEW */}
        <div className="space-y-6 mt-8">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="text-[#18bfd6]" size={22} />
            Fichiers Officiels & Procès-Verbaux
          </h2>

          <div className="space-y-6">
            {officialDocs
              .filter(doc => activeExamTab === 'ALL' || doc.tab === activeExamTab)
              .map(doc => (
                <div key={doc.id} className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/70 shadow-lg space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border ${doc.badgeColor}`}>
                        Fichier Officiel PV
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-2">{doc.title}</h3>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">{doc.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {doc.description}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a 
                      href={doc.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 bg-[#18bfd6] hover:bg-[#15adc1] text-white rounded-2xl font-black uppercase text-xs tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Download size={16} /> Consulter / Télécharger <ExternalLink size={14} />
                    </a>

                    <button 
                      onClick={() => setPreviewDocUrl(previewDocUrl === doc.previewUrl ? null : doc.previewUrl)}
                      className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {previewDocUrl === doc.previewUrl ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span>{previewDocUrl === doc.previewUrl ? "Masquer l'aperçu" : "Aperçu Direct PDF"}</span>
                    </button>
                  </div>

                  {previewDocUrl === doc.previewUrl && (
                    <div className="w-full h-[650px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mt-4">
                      <iframe 
                        src={doc.previewUrl}
                        className="w-full h-full border-none"
                        title={doc.title}
                        allow="autoplay"
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Premium call to action banner */}
        <div className="bg-[#f2efe4] rounded-[32px] p-6 md:p-8 border border-slate-900/5 text-center space-y-4 mt-12">
          <h3 className="font-display font-black text-slate-900 text-lg md:text-xl">Entraînez-vous pour l'excellence avec Kharandi</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-serif italic">
            Kharandi offre des cours complets, des fiches de révisions guidées, des exercices interactifs et un assistant pédagogique intelligent <b>Bud-e</b> pour accompagner les élèves guinéens.
          </p>
          <div className="pt-2">
            <button 
              onClick={returnToPortal}
              className="px-6 py-3 bg-slate-900 hover:bg-[#18bfd6] text-white font-mono uppercase tracking-wider text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              DÉCOUVRIR LE PORTAIL APPRENANT <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        </div>
      </main>

      {/* Individual Result Modal */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 bg-slate-950/65 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 md:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-[#18bfd6] to-amber-500" />
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50">
                <Award size={32} />
              </div>

              <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                {selectedResult.mention || 'ADMIS'}
              </span>

              <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">{selectedResult.noms}</h3>
              <p className="text-sm font-mono text-slate-500 font-bold uppercase mb-6">PV : {selectedResult.pv}</p>

              <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-3.5 border border-slate-100 text-sm font-semibold text-slate-700">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                  <span className="text-slate-400 font-bold">EXAMEN :</span>
                  <span className="text-slate-800 font-extrabold">{selectedResult.examTitle || selectedResult.exam || 'Session 2026'}</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-2 border-b border-slate-200/50">
                  <span className="text-slate-400 font-bold">CENTRE :</span>
                  <span className="text-slate-800 text-right font-black">{selectedResult.centre || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-start gap-4 pb-2 border-b border-slate-200/50">
                  <span className="text-slate-400 font-bold">ÉCOLE ORIGINE :</span>
                  <span className="text-slate-800 text-right font-black">{selectedResult.origine || 'N/A'}</span>
                </div>
                {selectedResult.rang && (
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                    <span className="text-slate-400 font-bold">RANG NATIONAL :</span>
                    <span className="text-slate-800 font-bold">{selectedResult.rang}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">DPE / OPTION :</span>
                  <span className="text-[#18bfd6] font-extrabold">{selectedResult.dpe || 'N/A'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <button 
                  onClick={() => shareIndividualResult(selectedResult)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Smartphone size={16} /> Partager sur WhatsApp
                </button>
                <button 
                  onClick={() => setSelectedResult(null)}
                  className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-xs"
                >
                  Fermer la fiche
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-16 border-t border-slate-900/10 pt-8 max-w-4xl mx-auto px-4 text-center text-xs font-mono text-slate-500 space-y-2">
        <p>Portail des Résultats Officiels des Examens Nationaux 2026</p>
        <p>© 2026 Kharandi. Tous droits réservés.</p>
      </footer>
    </div>
  );
};
