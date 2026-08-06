import React, { useState, useEffect, useRef } from 'react';
import {
  Search, BookOpen, LayoutGrid, List, X, Calendar, Play,
  Lightbulb, FlaskConical, Calculator, Globe, BookMarked, Atom,
  Leaf, ChevronRight, Loader2, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { CoursePlayer } from './CoursePlayer';
import { FALLBACK_BAC_SUBJECTS } from '../../data/fallbackSubjects';

const subjectIcon = (subject: string) => {
  const s = (subject || '').toLowerCase();
  if (s.includes('math'))                           return <Calculator size={18} />;
  if (s.includes('physique'))                       return <Atom size={18} />;
  if (s.includes('chimie'))                         return <FlaskConical size={18} />;
  if (s.includes('biologie') || s.includes('géol')) return <Leaf size={18} />;
  if (s.includes('français'))                       return <BookMarked size={18} />;
  if (s.includes('anglais'))                        return <Globe size={18} />;
  if (s.includes('philos'))                         return <Lightbulb size={18} />;
  if (s.includes('économie'))                       return <ChevronRight size={18} />;
  return <BookOpen size={18} />;
};

const serieColor = (level: string) => {
  return { light: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', gradient: 'from-primary/90 to-primary/80' };
};

const isBacSubject = (item: any) =>
  item.level?.includes('SM') || item.level?.includes('SS') || item.level?.includes('SE') ||
  item.type === 'BAC' || item.level === 'BAC' || item.level?.includes('BEPC') || item.level?.includes('7ème');

// ─── Card BAC ─────────────────────────────────────────────────────────────────
const BacSubjectCard = ({ item, viewMode, index, onOpen }: any) => {
  const colors  = serieColor(item.level);
  const year    = item.year || '';
  const subject = item.subject?.name || item.subject || '';
  const level   = item.level || '';
  const title   = item.title || '';
  const serie   = level.match(/\b(SM|SS|SE)\b/)?.[0] || (level.includes('BEPC') ? 'BEPC' : level.includes('7ème') ? '7ème CEE' : '');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      className={`group bg-white rounded-2xl border ${colors.border} shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col`}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Icône + badges */}
        <div className="flex items-start justify-between gap-2">
          <div className={`w-10 h-10 rounded-xl ${colors.light} ${colors.text} flex items-center justify-center border ${colors.border} shrink-0`}>
            {subjectIcon(subject)}
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {serie && (
              <span className={`text-[10px] font-black ${colors.text} ${colors.light} px-2 py-0.5 rounded-full border ${colors.border}`}>
                {serie}
              </span>
            )}
            {year && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Calendar size={9} />{year}
              </span>
            )}
          </div>
        </div>

        {/* Titre + matière */}
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-slate-800 text-[14px] leading-snug line-clamp-2 mb-1">{title}</h4>
          <p className="text-[12px] text-slate-400 font-medium truncate">{subject}</p>
        </div>

        {/* Boutons */}
        <div className="flex gap-2 pt-1">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => { e.stopPropagation(); onOpen(item); }}
            className="flex-1 flex items-center justify-center gap-1 bg-orange-500 text-white hover:bg-orange-600 px-3 py-2.5 rounded-xl text-[12px] font-black transition-colors"
          >
            <Play size={12} fill="currentColor" /> Ouvrir
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Card générique ───────────────────────────────────────────────────────────
const styles = [
  { bg: 'bg-primary/10',  text: 'text-primary',  iconBg: 'bg-primary/10',  border: 'border-primary/20'  }
];

const GenericCard = ({ item, viewMode, index, onOpen }: any) => {
  const style = styles[0];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      onClick={() => onOpen(item)}
      className={`group bg-white rounded-2xl border-2 ${style.border} shadow-sm hover:shadow-lg transition-all duration-200 flex ${viewMode === 'list' ? 'flex-row items-center gap-4' : 'flex-col'} overflow-hidden cursor-pointer p-4 gap-3`}
    >
      <div className={`w-11 h-11 rounded-xl ${style.iconBg} ${style.text} flex items-center justify-center shrink-0`}>
        <BookOpen size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-extrabold text-slate-800 text-[14px] leading-snug mb-1.5 line-clamp-2">{item.title}</h4>
        <div className="flex gap-1.5 flex-wrap">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{item.level}</span>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.type}</span>
          {item.price && <span className="text-[11px] font-black text-emerald-600">{item.price.toLocaleString()} GNF</span>}
        </div>
      </div>
      <div className={`${viewMode === 'list' ? 'shrink-0' : 'w-full'} flex`}>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(item); }}
          className={`flex-1 flex items-center justify-center gap-1.5 ${item.isFormation ? `${style.iconBg} ${style.text}` : 'bg-orange-500 text-white hover:bg-orange-600'} py-2.5 rounded-xl text-[12px] font-bold transition-all`}
        >
          {item.isFormation
            ? <><ShoppingBag size={13} /> Acheter</>
            : <><Play size={12} fill="currentColor" /> Ouvrir</>}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
export const Library: React.FC<{
  initialSearchQuery?: string;
  initialCourseId?: string | null;
  onCourseClose?: () => void;
  onOpenKaramo?: (context: string) => void;
  setActiveTab?: (tab: string) => void;
}> = ({ initialSearchQuery = '', initialCourseId = null, onCourseClose, onOpenKaramo }) => {

  const [viewMode, setViewMode]           = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm]       = useState(initialSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilter, setSelectedFilter]   = useState('Tous');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourseId);
  const [contents, setContents]           = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const searchRef                         = useRef<HTMLDivElement>(null);
  const { userProfile }                   = useAuth();
  const isSubscribed                      = userProfile?.isApproved;

  useEffect(() => {
    const fetchAll = async () => {
      const mockFormations: any[] = []; // formations supprimées

      let allResults: any[] = [];
      try {
        const { getDocuments } = await import('../../services/learning');
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 30) {
          const raw = await getDocuments({ page, page_size: 250 } as any);

          let results: any[] = [];
          let nextExists = false;

          if (Array.isArray(raw)) {
            results  = raw;
            hasMore  = false;
          } else if (Array.isArray(raw?.results)) {
            results    = raw.results;
            nextExists = !!raw.next;
            hasMore    = nextExists;
          } else if (Array.isArray(raw?.data?.results)) {
            results    = raw.data.results;
            nextExists = !!raw.data.next;
            hasMore    = nextExists;
          } else {
            hasMore = false;
          }

          if (results.length === 0) break;
          allResults = [...allResults, ...results];
          page++;
        }
      } catch (err) {
        console.error('Library fetch error:', err);
      }

      // Injecter les sujets BAC locaux si non déjà présents pour garantir leur affichage continu
      const combinedResults = [...allResults];
      for (const fallback of FALLBACK_BAC_SUBJECTS) {
        if (!combinedResults.some(item => String(item.id) === String(fallback.id))) {
          combinedResults.push(fallback);
        }
      }

      setContents([...mockFormations, ...combinedResults]);
      setLoading(false);
    };
    fetchAll().catch(console.error);
  }, []);

  useEffect(() => { if (initialCourseId) setSelectedCourseId(initialCourseId); }, [initialCourseId]);

  const handleCloseCourse = () => { setSelectedCourseId(null); onCourseClose?.(); };

  const handleOpenItem = (item: any) => {
    if (item.isFormation) {
      import('sonner').then(m => m.toast.success('Achat bientôt disponible !'));
      return;
    }
    const isLocked = item.locked ?? (item.is_free === false);
    if (!isLocked || isSubscribed) setSelectedCourseId(item.id);
    else import('sonner').then(m => m.toast.error('Abonnement requis pour accéder à ce contenu.'));
  };

  const handleKaramo = (item: any) => {
    if (!onOpenKaramo) return;
    const subject = item.subject?.name || item.subject || '';
    const context =
      `📚 **${item.title}**\n` +
      `• Série : ${item.level || 'N/A'}\n` +
      `• Matière : ${subject}\n` +
      `• Année : ${item.year || 'N/A'}\n\n` +
      (item.description ? `**Contenu :**\n${item.description}` : '');
    onOpenKaramo(context);
  };

  const filters = [
    'Tous', 'Formations Certifiantes', 
    '7ème', 'BEPC', 'BAC SM', 'BAC SS', 'BAC SE', 'BAC', 'Terminale',
    'Licence 1', 'Licence 2', 'Licence 3', 'Master', 'Doctorat'
  ];

  const filteredContents = contents.filter(item => {
    const matchSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.subject?.name || item.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = selectedFilter === 'Tous' ||
                        (item.level || '').includes(selectedFilter) ||
                        (item.subject?.name || item.subject || '').toLowerCase().includes(selectedFilter.toLowerCase());
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    if (yearA !== yearB) return yearB - yearA;
    return (a.title || '').localeCompare(b.title || '');
  });

  const suggestions = searchTerm.length > 1
    ? contents.filter(c =>
        (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.subject?.name || c.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', cb);
    return () => document.removeEventListener('mousedown', cb);
  }, []);

  if (selectedCourseId) return <CoursePlayer courseId={selectedCourseId} onClose={handleCloseCourse} />;

  const bacItems   = filteredContents.filter(isBacSubject);
  const otherItems = filteredContents.filter(i => !isBacSubject(i));

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">

      {/* Header */}
      <header className="px-4 md:px-6 pt-8 md:pt-12 pb-4 md:pb-6 bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Sujets et traités</h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium hidden sm:block">Annales BAC · Cours · Formations</p>
            </div>
          </div>

          {/* Recherche */}
          <div className="relative w-full sm:w-72 md:w-80" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text" value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Matière, série, année..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-9 pr-8 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={14} />
              </button>
            )}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                >
                  {suggestions.map((item, i) => (
                    <button key={i} onClick={() => { setSearchTerm(item.title); setShowSuggestions(false); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {subjectIcon(item.subject?.name || item.subject || '')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400">{item.subject?.name || item.subject} · {item.level}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filtres + toggle vue */}
        <div className="flex items-center gap-2">
          <div className="flex gap-2 overflow-x-auto flex-1 pb-1 hide-scrollbar">
            {filters.map((f, i) => (
              <button key={i} onClick={() => setSelectedFilter(f)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] font-extrabold transition-all border ${
                  selectedFilter === f
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'
                }`}
              >{f}</button>
            ))}
          </div>
          <div className="hidden sm:flex gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-slate-400'}`}>
              <List size={16} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-slate-400'}`}>
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="px-4 md:px-6 py-6 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {loading ? 'Chargement...' : `${filteredContents.length} documents`}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Loader2 size={36} className="text-primary animate-spin" />
            <p className="text-slate-400 text-sm font-semibold">Chargement de tous les sujets...</p>
          </div>
        ) : (
          <>
            {/* Annales & Examens Nationaux */}
            {bacItems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-7 bg-primary rounded-full" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-lg font-black text-slate-900">Annales & Examens Nationaux (BAC, BEPC, 7ème)</h2>
                    <p className="text-xs text-slate-400">{bacItems.length} sujets officiels et simulations d'entraînement</p>
                  </div>
                </div>
                <div className={
                  viewMode === 'list'
                    ? 'space-y-3'
                    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                }>
                  {bacItems.map((item, i) => (
                    <BacSubjectCard
                      key={item.id} item={item}
                      viewMode={viewMode} index={i}
                      onOpen={handleOpenItem}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Cours & Formations */}
            {otherItems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-7 bg-accent rounded-full" />
                  <div>
                    <h2 className="text-base md:text-lg font-black text-slate-900">Cours & Formations</h2>
                    <p className="text-xs text-slate-400">{otherItems.length} contenus disponibles</p>
                  </div>
                </div>
                <div className={
                  viewMode === 'list'
                    ? 'space-y-3'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'
                }>
                  {otherItems.map((item, i) => (
                    <GenericCard key={item.id} item={item} viewMode={viewMode} index={i} onOpen={handleOpenItem} />
                  ))}
                </div>
              </section>
            )}

            {filteredContents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4 border border-slate-200">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Aucun résultat</h3>
                <p className="text-slate-400 text-sm">Essayez d'autres mots-clés ou filtres.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
