import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Award, Download, ExternalLink, GraduationCap, Building2, MapPin, Eye, EyeOff, BookOpen, Share2, FileText, Smartphone } from 'lucide-react';
import { getResults } from '../../services/content';
import { EduLoading } from './EduLoading';
import { toast } from 'sonner';
import { fetchWithAuth, BASE_URL } from '../../config/api';

export const Results: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('TOUS');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  // Search Engine state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all'); // all, pv, centre, noms
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedResultModal, setSelectedResultModal] = useState<any | null>(null);
  const [displayLimit, setDisplayLimit] = useState(100);

  // Reset limit when filter or search changes
  useEffect(() => {
    setDisplayLimit(100);
  }, [activeFilter, searchFilter, searchQuery]);

  // Handle Search across all exam categories (auto-loads when empty query)
  useEffect(() => {
    if (searchQuery.trim().length === 1) {
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      let examParam = 'all';
      if (activeFilter === 'CEE 2026') examParam = 'cee';
      else if (activeFilter === 'BEPC') examParam = 'bepc';
      else if (activeFilter === 'BEPC Franco-Arabe') examParam = 'bepc_fa';
      else if (activeFilter === 'BAC') examParam = 'bac';

      try {
        const res = await fetch(`/api/results/search?q=${encodeURIComponent(searchQuery.trim())}&exam=${examParam}&filter=${searchFilter}&limit=${displayLimit}`);
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Search API ${res.status}: ${errText.slice(0, 100)}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const errText = await res.text();
          throw new Error(`Expected JSON, got HTML or other (${res.status}): ${errText.slice(0, 100)}`);
        }
        const totalHeader = res.headers.get('X-Total-Count');
        if (totalHeader) setTotalCount(parseInt(totalHeader, 10));
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.results || data.data?.results || []);
        setSearchResults(items);
        if (data.total) setTotalCount(data.total);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchFilter, activeFilter, displayLimit]);

  const officialExams = [
    {
      id: 'bac-2026-doc',
      category: 'BAC',
      title: "Résultats du Baccalauréat Unique — Session 2026",
      subtitle: "Procès-Verbal Officiel (Toutes Options)",
      description: "Procès-verbal officiel et liste nominative des admis au Baccalauréat Unique 2026 (Sciences Mathématiques, Sciences Expérimentales, Sciences Sociales).",
      viewUrl: "https://drive.google.com/file/d/1SiY39yOtwO9-w7UcursP3fGsueYB7ekk/view?usp=drive_link",
      previewUrl: "https://drive.google.com/file/d/1SiY39yOtwO9-w7UcursP3fGsueYB7ekk/preview",
      badgeColor: "bg-purple-500/10 text-purple-800 border-purple-200",
      accentBg: "from-purple-500/10 via-purple-500/5 to-indigo-500/10",
      fileType: "PV Officiel (PDF)"
    },
    {
      id: 'bepc-eg-2026-doc',
      category: 'BEPC',
      title: "Résultats du BEPC Enseignement Général — Session 2026",
      subtitle: "Brevet d'Études du Premier Cycle",
      description: "Liste officielle et procès-verbal nominatif des admis au BEPC Enseignement Général 2026 sur l'ensemble du territoire guinéen.",
      viewUrl: "https://drive.google.com/file/d/1kLOfpdaEFhHVPFzUmEVrxiJeE9mxf5ON/view?usp=drive_link",
      previewUrl: "https://drive.google.com/file/d/1kLOfpdaEFhHVPFzUmEVrxiJeE9mxf5ON/preview",
      badgeColor: "bg-[#18bfd6]/10 text-[#18bfd6] border-[#18bfd6]/20",
      accentBg: "from-[#18bfd6]/10 via-cyan-500/5 to-[#18bfd6]/20",
      fileType: "PV Officiel (PDF)"
    },
    {
      id: 'bepc-fa-2026-doc',
      category: 'BEPC Franco-Arabe',
      title: "Résultats du BEPC Franco-Arabe — Session 2026",
      subtitle: "Brevet d'Études du Premier Cycle (Franco-Arabe)",
      description: "Procès-verbal officiel des admis au BEPC option Franco-Arabe pour la session 2026.",
      viewUrl: "https://drive.google.com/file/d/1Cxu9LFVIdMm37ooCBBXraDljC23zFSxu/view?usp=sharing",
      previewUrl: "https://drive.google.com/file/d/1Cxu9LFVIdMm37ooCBBXraDljC23zFSxu/preview",
      badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-200",
      accentBg: "from-emerald-500/10 via-teal-500/5 to-emerald-600/10",
      fileType: "PV Officiel (PDF)"
    },
    {
      id: 'cee-2026-doc',
      category: 'CEE 2026',
      title: "Résultats du Certificat d'Études Élémentaires (CEE) — 7ème Année 2026",
      subtitle: "Examen d'Entrée en 7ème Année (Primaire)",
      description: "Base de données nationale nominative et liste complète des 188 108 admis au CEE 2026.",
      viewUrl: "https://docs.google.com/spreadsheets/d/1O6G8FYil3bJxVtxmGbO4iYCWEGoxDO88/edit?usp=drive_link",
      badgeColor: "bg-amber-500/10 text-amber-800 border-amber-200",
      accentBg: "from-amber-500/10 via-yellow-500/5 to-amber-600/10",
      fileType: "Google Sheets (188 108 admis)"
    }
  ];

  useEffect(() => {
    getResults()
      .then(data => setResults(data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['TOUS', 'CEE 2026', 'BEPC', 'BEPC Franco-Arabe', 'BAC'];

  const displayedExams = officialExams.filter(exam => {
    if (activeFilter === 'TOUS') return true;
    if (activeFilter === 'CEE 2026' && exam.category === 'CEE 2026') return true;
    return exam.category === activeFilter;
  });

  const getBadgeStyle = (exam: string) => {
    switch (exam?.toUpperCase()) {
      case 'CEE': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'BEPC': return 'bg-[#18bfd6]/15 text-[#1593a4] border-[#18bfd6]/30';
      case 'BEPC_FA': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'BAC': return 'bg-purple-100 text-purple-900 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-left animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#18bfd6]/10 text-[#18bfd6] rounded-2xl flex items-center justify-center shrink-0">
            <Award size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#18bfd6]/10 text-[#18bfd6] px-2.5 py-0.5 rounded-full border border-[#18bfd6]/20">
                Portail Officiel National 2026
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Résultats des Examens Nationaux</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">Consultation nominative instantanée & procès-verbaux CEE, BEPC (Général & Franco-Arabe) et Baccalauréat Unique 2026.</p>
          </div>
        </div>

        {/* Share link button */}
        <button 
          onClick={() => {
            const url = window.location.origin + '/?results=cee2026';
            navigator.clipboard.writeText(url);
            toast.success("Lien direct du portail des résultats copié !");
          }}
          className="px-5 py-3 bg-[#18bfd6] hover:bg-[#15adc1] text-white rounded-2xl transition-all text-xs font-black uppercase tracking-wider shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#18bfd6]/15"
        >
          <Share2 size={16} /> Partager le Portail
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => {
              setActiveFilter(cat);
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-extrabold transition-all border shrink-0 cursor-pointer flex items-center gap-2
              ${activeFilter === cat 
                ? 'bg-[#18bfd6] text-white border-[#18bfd6] shadow-md shadow-[#18bfd6]/20' 
                : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50'}`}
          >
            <BookOpen size={14} />
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* INTERACTIVE NOMINATIVE SEARCH ENGINE */}
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#18bfd6] bg-[#18bfd6]/10 px-2.5 py-0.5 rounded-full">
              Moteur de Recherche Direct
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">Recherche Nominative {activeFilter !== 'TOUS' ? `— ${activeFilter}` : '— Tous les Examens 2026'}</h2>
            <p className="text-xs text-slate-500 font-medium">Recherchez instantanément tout candidat admis par son PV, son nom ou son centre d'examen.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={searchFilter === 'pv' ? "Entrez le PV (ex: 1967, 28767, 3074)..." : searchFilter === 'centre' ? "Nom du centre d'examen..." : "Entrez un nom, un PV, un centre ou une école..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#18bfd6] focus:bg-white focus:ring-4 focus:ring-[#18bfd6]/10 transition-all text-slate-800" 
            />
          </div>
          <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shrink-0 overflow-x-auto">
            <button onClick={() => setSearchFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'all' ? 'bg-white shadow-xs text-[#18bfd6]' : 'text-slate-500 hover:text-slate-900'}`}>Tous</button>
            <button onClick={() => setSearchFilter('pv')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'pv' ? 'bg-white shadow-xs text-[#18bfd6]' : 'text-slate-500 hover:text-slate-900'}`}>Par PV</button>
            <button onClick={() => setSearchFilter('centre')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'centre' ? 'bg-white shadow-xs text-[#18bfd6]' : 'text-slate-500 hover:text-slate-900'}`}>Par Centre</button>
            <button onClick={() => setSearchFilter('noms')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${searchFilter === 'noms' ? 'bg-white shadow-xs text-[#18bfd6]' : 'text-slate-500 hover:text-slate-900'}`}>Par Nom</button>
          </div>
        </div>

        {searchLoading ? (
          <EduLoading message="Recherche des correspondances dans la base nationale 2026..." />
        ) : searchResults.length === 0 ? (
          <div className="bg-slate-50 p-8 rounded-2xl text-center border border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-2" size={36} />
            <h4 className="font-extrabold text-slate-800 text-sm">
              {searchQuery.trim().length >= 2 ? "Aucun candidat trouvé" : "Aucun résultat trouvé"}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery.trim().length >= 2 ? "Vérifiez le numéro de PV ou l'orthographe du nom." : "Entrez une recherche ou changez d'onglet d'examen."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-2">
              <p className="text-xs font-bold text-slate-600">
                {searchQuery.trim() 
                  ? `Affichage de ${searchResults.length} sur ${totalCount || searchResults.length} candidat(s) trouvé(s) pour "${searchQuery}"`
                  : `Affichage de ${searchResults.length} sur ${totalCount || searchResults.length} candidats admis (${activeFilter !== 'TOUS' ? activeFilter : 'Tous les examens'})`}
              </p>
              {totalCount > searchResults.length && (
                <button
                  onClick={() => setDisplayLimit(totalCount || 10000)}
                  className="text-xs font-bold text-[#18bfd6] hover:underline cursor-pointer text-left sm:text-right"
                >
                  Afficher les {totalCount} candidats
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {searchResults.map((r, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getBadgeStyle(r.exam)}`}>
                          {r.exam}
                        </span>
                        <div className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                          <Award size={12} /> {r.mention || 'ADMIS'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-slate-900 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg">PV: {r.pv}</span>
                        {r.rang && <span className="text-xs text-slate-500 font-mono font-bold">Rang: {r.rang}</span>}
                      </div>
                      
                      <h4 className="text-base font-black text-slate-900 mb-2 leading-snug">{r.noms}</h4>
                      
                      <div className="space-y-1.5 text-xs text-slate-600 font-medium mb-4">
                        {r.centre && <p className="flex items-center gap-1.5"><Building2 size={14} className="text-slate-400 shrink-0" /> <span className="truncate">Centre : {r.centre}</span></p>}
                        {r.origine && <p className="flex items-center gap-1.5"><GraduationCap size={14} className="text-slate-400 shrink-0" /> <span className="truncate">Origine : {r.origine}</span></p>}
                        {r.dpe && <p className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400 shrink-0" /> <span>DPE/Option : {r.dpe}</span></p>}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const text = `🎉 Félicitations à ${r.noms} ! Admis(e) au ${r.examTitle || r.exam} avec mention ${r.mention || 'ADMIS'}. PV : ${r.pv}, Centre : ${r.centre}.`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <Smartphone size={14} /> Partager sur WhatsApp
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {(searchResults.length >= displayLimit || (totalCount > searchResults.length)) && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 100)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
                >
                  Charger +100 candidats
                </button>
                {totalCount > searchResults.length && (
                  <button
                    onClick={() => setDisplayLimit(totalCount || 10000)}
                    className="px-6 py-3 bg-[#18bfd6] hover:bg-[#159cb0] text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
                  >
                    Tout afficher ({totalCount} candidats)
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* OFFICIAL EXAM DOCUMENTS CARDS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
          <FileText size={22} className="text-[#18bfd6]" />
          <h2>Procès-Verbaux et Fichiers Officiels des Résultats</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedExams.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ y: -4 }}
              className={`bg-gradient-to-br ${exam.accentBg} bg-white rounded-[28px] border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[300px]`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${exam.badgeColor}`}>
                    {exam.category}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">{exam.fileType}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{exam.title}</h3>
                  <p className="text-xs text-slate-500 font-bold">{exam.subtitle}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {exam.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200/50 mt-6 flex flex-col gap-2">
                {exam.viewUrl ? (
                  <div className="flex gap-2">
                    <a
                      href={exam.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 bg-[#18bfd6] hover:bg-[#15adc1] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Download size={15} />
                      <span>Consulter / Télécharger</span>
                      <ExternalLink size={13} className="opacity-80" />
                    </a>

                    {exam.previewUrl && (
                      <button
                        onClick={() => {
                          if (previewDocUrl === exam.previewUrl) {
                            setPreviewDocUrl(null);
                          } else {
                            setPreviewDocUrl(exam.previewUrl);
                          }
                        }}
                        className={`px-3 py-3 rounded-xl border transition-all text-xs font-bold cursor-pointer flex items-center justify-center ${
                          previewDocUrl === exam.previewUrl 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                        title="Aperçu intégré"
                      >
                        {previewDocUrl === exam.previewUrl ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setActiveFilter('CEE 2026');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Search size={15} />
                    <span>Rechercher un Élève CEE</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EMBEDDED GOOGLE DRIVE DOCUMENT PREVIEW MODAL / CONTAINER */}
      <AnimatePresence>
        {previewDocUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] border border-slate-200 shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <FileText className="text-[#18bfd6]" size={20} />
                <span>Aperçu Officiel du Fichier de Résultats</span>
              </div>

              <button
                onClick={() => setPreviewDocUrl(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Fermer l'Aperçu
              </button>
            </div>

            <div className="w-full h-[650px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <iframe 
                src={previewDocUrl}
                className="w-full h-full border-none"
                title="Aperçu des résultats officiels"
                allow="autoplay"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
