import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, BookOpen, LayoutGrid, List, X, Calendar, Play,
  Sparkles, Star, Filter, ArrowUpDown, CheckCircle2,
  FileText, Bot, Eye, HelpCircle, RefreshCw, ChevronRight,
  BookMarked, Calculator, Atom, FlaskConical, Leaf, Globe,
  Lightbulb, Loader2, Award, Zap, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { CoursePlayer } from './CoursePlayer';
import { FALLBACK_BAC_SUBJECTS } from '../../data/fallbackSubjects';
import { KharandiIcon, KharandiIconName } from '../icons/KharandiIcon';
import { toast } from 'sonner';

// ─── Helpers for Subject Icons & Colors ─────────────────────────────────────
const getSubjectIconName = (subject: string): KharandiIconName => {
  const s = (subject || '').toLowerCase();
  if (s.includes('math') || s.includes('calcul')) return 'matieres';
  if (s.includes('physique')) return 'exercices';
  if (s.includes('chimie')) return 'exercices';
  if (s.includes('biologie') || s.includes('svt') || s.includes('géol')) return 'cours';
  if (s.includes('français') || s.includes('littér')) return 'cours';
  if (s.includes('anglais') || s.includes('langue')) return 'langue';
  if (s.includes('philo')) return 'calcul_mental';
  if (s.includes('écono') || s.includes('gestion')) return 'statistiques';
  if (s.includes('histoire') || s.includes('géo')) return 'destination';
  return 'documents';
};

const getLevelBadgeColor = (level: string) => {
  const l = (level || '').toUpperCase();
  if (l.includes('SM')) return { bg: 'bg-cyan-500/10 text-cyan-700 border-cyan-300', tag: 'BAC SM' };
  if (l.includes('SE')) return { bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300', tag: 'BAC SE' };
  if (l.includes('SS')) return { bg: 'bg-amber-500/10 text-amber-700 border-amber-300', tag: 'BAC SS' };
  if (l.includes('BEPC')) return { bg: 'bg-purple-500/10 text-purple-700 border-purple-300', tag: 'BEPC' };
  if (l.includes('7È') || l.includes('7E') || l.includes('CEE')) return { bg: 'bg-blue-500/10 text-blue-700 border-blue-300', tag: '7È CEE' };
  return { bg: 'bg-slate-100 text-slate-700 border-slate-200', tag: level || 'ANNALE' };
};

const getCategoryBadge = (item: any) => {
  const cat = item.category;
  const t = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();

  if (cat === 'REAL' || (!cat && !t.includes('blanc') && !t.includes('france') && !t.includes('sénégal') && !t.includes('maroc') && !t.includes('côte d\'ivoire') && !t.includes('étranger') && !t.includes('tunisie'))) {
    return { label: 'Officiel 🇬🇳', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  if (cat === 'BLANC' || (!cat && (t.includes('blanc') || t.includes('ire') || t.includes('dce') || t.includes('lycée')))) {
    return { label: 'Examen Blanc 📝', cls: 'bg-[#E8F8FB] text-[#163B45] border-[#1BB4D3]/30' };
  }
  return { label: `Étranger ${item.country ? '• ' + item.country : '🌍'}`, cls: 'bg-purple-100 text-purple-900 border-purple-200' };
};

const isBacSubject = (item: any) =>
  item.level?.includes('SM') || item.level?.includes('SS') || item.level?.includes('SE') ||
  item.type === 'BAC' || item.level === 'BAC' || item.level?.includes('BEPC') || item.level?.includes('7ème') || item.level?.includes('7E');

// ─── Main Component ────────────────────────────────────────────────────────
export const Library: React.FC<{
  initialSearchQuery?: string;
  initialCourseId?: string | null;
  onCourseClose?: () => void;
  onOpenKaramo?: (context: string) => void;
  setActiveTab?: (tab: string) => void;
}> = ({ initialSearchQuery = '', initialCourseId = null, onCourseClose, onOpenKaramo, setActiveTab }) => {
  const { userProfile } = useAuth();
  const isSubscribed = userProfile?.isApproved;

  // Local State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Primary Filters
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'Tous' | 'REAL' | 'BLANC' | 'ETRANGER'>('Tous');
  const [selectedLevelTab, setSelectedLevelTab] = useState<string>('Tous');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('Toutes');
  const [selectedYear, setSelectedYear] = useState<string>('Toutes');
  const [onlySolvables, setOnlySolvables] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  const isHubView = selectedCategoryTab === 'Tous' && selectedLevelTab === 'Tous' && !searchTerm && selectedSubjectFilter === 'Toutes' && selectedYear === 'Toutes' && !onlySolvables && !onlyFavorites;
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kharandi_fav_subjects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('kharandi_fav_subjects', JSON.stringify(next));
        if (!prev.includes(id)) toast.success('Ajouté à vos sujets favoris ⭐');
        else toast.info('Retiré des favoris');
      } catch {}
      return next;
    });
  };

  // Data Loading
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourseId);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      let allResults: any[] = [];
      try {
        const { getDocuments } = await import('../../services/learning');
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 15) {
          const raw = await getDocuments({ page, page_size: 250 } as any);
          let results: any[] = [];
          
          if (Array.isArray(raw)) {
            results = raw;
            hasMore = false;
          } else if (Array.isArray(raw?.results)) {
            results = raw.results;
            hasMore = !!raw.next;
          } else if (Array.isArray(raw?.data?.results)) {
            results = raw.data.results;
            hasMore = !!raw.data.next;
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

      // Merge local fallback subjects
      const combinedResults = [...allResults];
      for (const fallback of FALLBACK_BAC_SUBJECTS) {
        if (!combinedResults.some(item => String(item.id) === String(fallback.id))) {
          combinedResults.push(fallback);
        }
      }

      if (isMounted) {
        setContents(combinedResults);
        setLoading(false);
      }
    };

    fetchAll();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (initialCourseId) setSelectedCourseId(initialCourseId);
  }, [initialCourseId]);

  const handleCloseCourse = () => {
    setSelectedCourseId(null);
    onCourseClose?.();
  };

  const handleOpenItem = (item: any) => {
    if (item.isFormation) {
      toast.info('Formation certifiante bientôt disponible sur Kharandi !');
      return;
    }
    const isLocked = item.locked ?? (item.is_free === false);
    if (!isLocked || isSubscribed) {
      setSelectedCourseId(item.id);
    } else {
      toast.error('Abonnement requis pour accéder à la version complète de ce sujet.');
    }
  };

  const handleAskKaramo = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onOpenKaramo) {
      toast.info('Ouvrez le chat Karamö IA depuis le bouton en bas à droite !');
      return;
    }
    const subject = item.subject?.name || item.subject || 'Général';
    const context =
      `📚 **Question sur l'épreuve : ${item.title}**\n` +
      `• Niveau/Série : ${item.level || 'Examens'}\n` +
      `• Matière : ${subject}\n` +
      `• Année : ${item.year || 'Épreuve officielle'}\n\n` +
      `*Aide-moi à comprendre et résoudre cet exercice étape par étape avec les formules clés.*`;
    onOpenKaramo(context);
  };

  // Close autocomplete on click outside
  useEffect(() => {
    const cb = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', cb);
    return () => document.removeEventListener('mousedown', cb);
  }, []);

  // Filter lists definition
  const levelTabs = [
    { id: 'Tous', label: 'Tous les niveaux' },
    { id: 'BAC SM', label: 'BAC SM (Sciences Maths)' },
    { id: 'BAC SE', label: 'BAC SE (Sciences Exp)' },
    { id: 'BAC SS', label: 'BAC SS (Sciences Soc)' },
    { id: 'BEPC', label: 'BEPC (3ème)' },
    { id: '7ème', label: '7ème Année (CEE)' },
    { id: 'Supérieur', label: 'Supérieur / Université' }
  ];

  const subjectFilters = [
    'Toutes', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'SVT',
    'Français', 'Philosophie', 'Anglais', 'Histoire', 'Géographie', 'Économie'
  ];

  const availableYears = useMemo(() => {
    const setYears = new Set<string>();
    contents.forEach(item => {
      if (item.year && item.year.length === 4) setYears.add(item.year);
    });
    return Array.from(setYears).sort((a, b) => parseInt(b) - parseInt(a));
  }, [contents]);

  // Category counts calculation
  const realCount = useMemo(() => {
    return contents.filter(item => {
      if (item.category) return item.category === 'REAL';
      const t = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
      return !t.includes('blanc') && !t.includes('france') && !t.includes('sénégal') && !t.includes('maroc') && !t.includes('côte d\'ivoire') && !t.includes('étranger') && !t.includes('tunisie');
    }).length;
  }, [contents]);

  const blancCount = useMemo(() => {
    return contents.filter(item => {
      if (item.category) return item.category === 'BLANC';
      const t = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
      return t.includes('blanc') || t.includes('ire') || t.includes('dce') || t.includes('lycée');
    }).length;
  }, [contents]);

  const etrangerCount = useMemo(() => {
    return contents.filter(item => {
      if (item.category) return item.category === 'ETRANGER';
      const t = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
      return t.includes('france') || t.includes('sénégal') || t.includes('maroc') || t.includes('côte d\'ivoire') || t.includes('étranger') || t.includes('international') || t.includes('tunisie');
    }).length;
  }, [contents]);

  // Derived Filtered Contents
  const filteredContents = useMemo(() => {
    return contents.filter(item => {
      const title = (item.title || '').toLowerCase();
      const subjectName = (item.subject?.name || item.subject || '').toLowerCase();
      const level = (item.level || '').toUpperCase();
      const desc = (item.description || '').toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      // Search match
      const matchSearch = !query || title.includes(query) || subjectName.includes(query) || desc.includes(query);

      // Grand Category Tab Match
      let matchCategory = true;
      if (selectedCategoryTab !== 'Tous') {
        if (item.category) {
          matchCategory = item.category === selectedCategoryTab;
        } else {
          const t = title + ' ' + desc;
          if (selectedCategoryTab === 'BLANC') {
            matchCategory = t.includes('blanc') || t.includes('ire') || t.includes('dce') || t.includes('lycée');
          } else if (selectedCategoryTab === 'ETRANGER') {
            matchCategory = t.includes('france') || t.includes('sénégal') || t.includes('maroc') || t.includes('côte d\'ivoire') || t.includes('étranger') || t.includes('international') || t.includes('tunisie');
          } else if (selectedCategoryTab === 'REAL') {
            matchCategory = !t.includes('blanc') && !t.includes('france') && !t.includes('sénégal') && !t.includes('maroc') && !t.includes('côte d\'ivoire') && !t.includes('étranger') && !t.includes('tunisie');
          }
        }
      }

      // Level Tab Match
      let matchLevel = true;
      if (selectedLevelTab !== 'Tous') {
        if (selectedLevelTab === 'BAC SM') matchLevel = level.includes('SM') || level.includes('MATH');
        else if (selectedLevelTab === 'BAC SE') matchLevel = level.includes('SE') || level.includes('EXP');
        else if (selectedLevelTab === 'BAC SS') matchLevel = level.includes('SS') || level.includes('SOC');
        else if (selectedLevelTab === 'BEPC') matchLevel = level.includes('BEPC') || level.includes('3È');
        else if (selectedLevelTab === '7ème') matchLevel = level.includes('7È') || level.includes('7E') || level.includes('CEE');
        else if (selectedLevelTab === 'Supérieur') matchLevel = level.includes('LICENCE') || level.includes('MASTER') || level.includes('FAC') || level.includes('SUP');
      }

      // Subject Filter Match
      let matchSubject = true;
      if (selectedSubjectFilter !== 'Toutes') {
        const sub = selectedSubjectFilter.toLowerCase();
        matchSubject = subjectName.includes(sub) || title.includes(sub);
      }

      // Year Filter Match
      let matchYear = true;
      if (selectedYear !== 'Toutes') {
        matchYear = item.year === selectedYear;
      }

      // Solvables Match (Corrigé inclus)
      let matchSolvable = true;
      if (onlySolvables) {
        matchSolvable = item.doc_type === 'EXERCICE' || (item.content && (item.content.includes('CORRIGÉ') || item.content.includes('Corrigé')));
      }

      // Favorites Match
      let matchFav = true;
      if (onlyFavorites) {
        matchFav = favorites.includes(String(item.id));
      }

      return matchSearch && matchCategory && matchLevel && matchSubject && matchYear && matchSolvable && matchFav;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        if (yearA !== yearB) return yearB - yearA;
      } else if (sortBy === 'oldest') {
        const yearA = parseInt(a.year) || 9999;
        const yearB = parseInt(b.year) || 9999;
        if (yearA !== yearB) return yearA - yearB;
      }
      return (a.title || '').localeCompare(b.title || '');
    });
  }, [contents, searchTerm, selectedCategoryTab, selectedLevelTab, selectedSubjectFilter, selectedYear, onlySolvables, onlyFavorites, favorites, sortBy]);

  const groupedContents = useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    filteredContents.forEach(item => {
      let groupKey = 'Autres';
      
      if (selectedLevelTab === 'Tous' || selectedLevelTab === 'ALL') {
        const levelStr = (item.level || '').toUpperCase();
        if (levelStr.includes('SM') || levelStr.includes('MATH')) groupKey = 'BAC SM';
        else if (levelStr.includes('SE') || levelStr.includes('EXP')) groupKey = 'BAC SE';
        else if (levelStr.includes('SS') || levelStr.includes('SOC')) groupKey = 'BAC SS';
        else if (levelStr.includes('BEPC') || levelStr.includes('3È')) groupKey = 'BEPC';
        else if (levelStr.includes('7È') || levelStr.includes('7E') || levelStr.includes('CEE')) groupKey = '7ème Année (CEE)';
        else if (levelStr.includes('LICENCE') || levelStr.includes('MASTER') || levelStr.includes('FAC') || levelStr.includes('SUP')) groupKey = 'Supérieur';
        else if (item.level) groupKey = item.level;
      } else {
        groupKey = item.year ? String(item.year) : 'Année inconnue';
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });

    const sortedGroups: Record<string, any[]> = {};
    
    if (selectedLevelTab === 'Tous' || selectedLevelTab === 'ALL') {
      const order = ['BAC SM', 'BAC SE', 'BAC SS', 'BEPC', '7ème Année (CEE)', 'Supérieur', 'Autres'];
      order.forEach(key => {
        if (groups[key] && groups[key].length > 0) {
          sortedGroups[key] = groups[key].sort((a, b) => {
             const subA = (a.subject?.name || a.subject || '').localeCompare(b.subject?.name || b.subject || '');
             if (subA !== 0) return subA;
             return parseInt(b.year || '0') - parseInt(a.year || '0');
          });
        }
      });
      Object.keys(groups).forEach(key => {
        if (!sortedGroups[key] && groups[key].length > 0) {
          sortedGroups[key] = groups[key].sort((a, b) => {
             const subA = (a.subject?.name || a.subject || '').localeCompare(b.subject?.name || b.subject || '');
             if (subA !== 0) return subA;
             return parseInt(b.year || '0') - parseInt(a.year || '0');
          });
        }
      });
    } else {
      Object.keys(groups).sort((a, b) => {
        const yearA = parseInt(a);
        const yearB = parseInt(b);
        if (!isNaN(yearA) && !isNaN(yearB)) return yearB - yearA;
        return a.localeCompare(b);
      }).forEach(key => {
        sortedGroups[key] = groups[key].sort((a, b) => {
           const subA = (a.subject?.name || a.subject || '').localeCompare(b.subject?.name || b.subject || '');
           if (subA !== 0) return subA;
           return (a.title || '').localeCompare(b.title || '');
        });
      });
    }
    
    return sortedGroups;
  }, [filteredContents, selectedLevelTab]);

  // Autocomplete Suggestions
  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const q = searchTerm.toLowerCase();
    return contents.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.subject?.name || c.subject || '').toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchTerm, contents]);

  // Stats calculation
  const totalSolvables = useMemo(() => {
    return contents.filter(i => i.doc_type === 'EXERCICE' || (i.content && i.content.includes('CORRIGÉ'))).length;
  }, [contents]);

  if (selectedCourseId) {
    return <CoursePlayer courseId={selectedCourseId} onClose={handleCloseCourse} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 md:pb-12 text-[#163B45]">
      
      {/* ─── HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#163B45] via-[#1A4B58] to-[#1BB4D3] text-white pt-8 pb-12 px-4 md:px-8 rounded-b-[36px] shadow-lg">
        {/* Decorative Background Patterns */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-[#FAB304]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FAB304] border border-white/15">
                <KharandiIcon name="devoirs" size={20} showBackground={false} showBookmark={false} primaryColor="#FAB304" />
                <span>Annales Officielles & Corrigés 2026</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
                Sujets & Traités d'Examens
              </h1>
              <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                Préparez sereinement votre <strong>BAC Unique</strong>, <strong>BEPC</strong> et <strong>CEE 7ème</strong> avec la banque complète d'épreuves officielles, leurs corrigés guidés pas à pas et le soutien instantané de l'IA Karamo.
              </p>

              {/* Stat Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#1BB4D3] animate-pulse" />
                  <span>{loading ? '...' : `${contents.length} Sujets disponibles`}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>{totalSolvables} Corrigés pas-à-pas</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#FAB304]">
                  <KharandiIcon name="karamo_assistant" size={18} showBackground={false} showBookmark={false} primaryColor="#FAB304" />
                  <span>Explications Karamo IA</span>
                </div>
              </div>
            </div>

            {/* Karamo IA Callout Box */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full lg:w-80 bg-white/15 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAB304] text-[#163B45] flex items-center justify-center font-black shrink-0 shadow-md">
                  <Bot size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Professeur Karamo IA</h4>
                  <p className="text-[11px] text-white/70">Bloqué sur un exercice ?</p>
                </div>
              </div>
              <p className="text-xs text-white/90 font-medium leading-normal">
                Sélectionnez un sujet ou posez directement votre question pour recevoir des explications et méthodes de résolution.
              </p>
              <button
                onClick={() => onOpenKaramo?.('Bonjour Karamo, peux-tu m’aider à réviser mes sujets de BAC et BEPC ?')}
                className="w-full py-2.5 px-3 bg-[#1BB4D3] hover:bg-[#18a2bd] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <KharandiIcon name="poser_question" size={18} showBackground={false} showBookmark={false} primaryColor="#FFFFFF" /> Poser une question à l'IA
              </button>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20 space-y-6">

        {/* ─── SEARCH & PRIMARY FILTERS BAR ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-4 md:p-5 space-y-4">
          
          {/* Top Search Field + Actions */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full" ref={searchRef}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Rechercher une matière, une année (ex: BAC 2024 SM, Maths BEPC)..."
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl py-3 pl-10 pr-9 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1BB4D3] focus:bg-white focus:ring-4 focus:ring-[#1BB4D3]/10 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              )}

              {/* Autocomplete suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 divide-y divide-slate-100"
                  >
                    {suggestions.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => { setSearchTerm(item.title); setShowSuggestions(false); }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[#E8F8FB]/60 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#1BB4D3]/10 text-[#1BB4D3] flex items-center justify-center shrink-0">
                          <KharandiIcon name={getSubjectIconName(item.subject?.name || item.subject)} size={22} showBackground={false} showBookmark={false} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500">{item.subject?.name || item.subject} • {item.level} • {item.year || 'Exam'}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Filters Toggles */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
              
              {/* Only Solvables Toggle */}
              <button
                onClick={() => setOnlySolvables(!onlySolvables)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shrink-0 ${
                  onlySolvables
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 size={15} />
                <span>Corrigés inclus</span>
              </button>

              {/* Only Favorites Toggle */}
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shrink-0 ${
                  onlyFavorites
                    ? 'bg-[#FAB304] text-[#163B45] border-[#e5a200] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Star size={15} fill={onlyFavorites ? '#163B45' : 'none'} />
                <span>Favoris ({favorites.length})</span>
              </button>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1BB4D3] shrink-0"
              >
                <option value="recent">Plus récents d'abord</option>
                <option value="oldest">Plus anciens d'abord</option>
                <option value="title">Titre (A - Z)</option>
              </select>

              {/* View Mode Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#1BB4D3] shadow-sm' : 'text-slate-400'}`}
                  title="Vue Grille"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#1BB4D3] shadow-sm' : 'text-slate-400'}`}
                  title="Vue Liste"
                >
                  <List size={16} />
                </button>
              </div>

            </div>

          </div>



        </div>

        {/* ─── RESULTS HEADER COUNTER / BACK BUTTON ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 flex-wrap">
            {(selectedCategoryTab !== 'Tous' || selectedLevelTab !== 'Tous' || searchTerm || selectedSubjectFilter !== 'Toutes' || selectedYear !== 'Toutes' || onlySolvables || onlyFavorites) ? (
              <>
                <button
                  onClick={() => {
                    setSelectedCategoryTab('Tous');
                    setSelectedLevelTab('Tous');
                    setSearchTerm('');
                    setSelectedSubjectFilter('Toutes');
                    setSelectedYear('Toutes');
                    setOnlySolvables(false);
                    setOnlyFavorites(false);
                  }}
                  className="px-3 py-1.5 bg-[#163B45] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:bg-[#1A4B58] transition-colors"
                >
                  <ArrowLeft size={14} /> Voir toutes les catégories
                </button>
                {selectedLevelTab !== 'Tous' && (
                  <span className="bg-[#1BB4D3]/10 text-[#163B45] border border-[#1BB4D3]/30 px-3 py-1 rounded-xl text-xs font-black">
                    Niveau : {selectedLevelTab}
                  </span>
                )}
                {selectedCategoryTab !== 'Tous' && (
                  <span className="bg-[#1BB4D3]/10 text-[#163B45] border border-[#1BB4D3]/30 px-3 py-1 rounded-xl text-xs font-black">
                    Type : {selectedCategoryTab === 'REAL' ? 'Examen Réel 🇬🇳' : selectedCategoryTab === 'BLANC' ? 'Examen Blanc 📝' : 'Étranger 🌍'}
                  </span>
                )}
                {selectedSubjectFilter !== 'Toutes' && (
                  <span className="bg-[#1BB4D3]/10 text-[#163B45] border border-[#1BB4D3]/30 px-3 py-1 rounded-xl text-xs font-black">
                    Matière : {selectedSubjectFilter}
                  </span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#1BB4D3] rounded-full animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {loading ? 'Chargement des annales...' : 'Choix des Catégories & Examens'}
                </span>
              </div>
            )}
          </div>

          <div className="text-xs font-black text-slate-500">
            {filteredContents.length} document{filteredContents.length > 1 ? 's' : ''} disponible{filteredContents.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* ─── SHOWCASE CATEGORY CARDS (HUB VIEW) ───────────────────── */}
        {isHubView ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Examen Réel */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setSelectedCategoryTab('REAL')}
                className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/20 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px] group"
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full text-[11px] font-black uppercase tracking-wider">
                      Officiel 🇬🇳
                    </span>
                    <span className="text-xs font-bold text-emerald-200 bg-black/20 px-2.5 py-1 rounded-lg">
                      {realCount} Sujets
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-200 transition-colors">
                    Examens Réels
                  </h3>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    Épreuves officielles authentiques des examens nationaux (BAC Unique, BEPC, CEE) avec leurs barèmes et corrigés officiels.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-emerald-700/50 relative z-10">
                  <span className="text-xs font-extrabold text-emerald-300 group-hover:underline flex items-center gap-1">
                    Cliquer pour voir les sujets réels
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Examen Blanc */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setSelectedCategoryTab('BLANC')}
                className="bg-gradient-to-br from-[#163B45] via-[#1A4B58] to-[#1BB4D3] text-white rounded-3xl p-6 shadow-xl border border-white/10 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px] group"
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#FAB304]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 rounded-full text-[11px] font-black uppercase tracking-wider">
                      Sujets Blancs 📝
                    </span>
                    <span className="text-xs font-bold text-cyan-200 bg-black/20 px-2.5 py-1 rounded-lg">
                      {blancCount} Sujets
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#FAB304] transition-colors">
                    Examens Blancs
                  </h3>
                  <p className="text-xs text-cyan-100/80 leading-relaxed">
                    Épreuves de préparation intensive des Inspections Régionales (IRE Conakry, DCE Ratoma, Sainte-Marie, etc.).
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-white/10 relative z-10">
                  <span className="text-xs font-extrabold text-[#FAB304] group-hover:underline flex items-center gap-1">
                    Cliquer pour voir les examens blancs
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAB304] text-[#163B45] flex items-center justify-center group-hover:translate-x-1 transition-transform font-bold">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Examen de l'Étranger */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setSelectedCategoryTab('ETRANGER')}
                className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl border border-purple-500/20 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px] group"
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded-full text-[11px] font-black uppercase tracking-wider">
                      International 🌍
                    </span>
                    <span className="text-xs font-bold text-purple-200 bg-black/20 px-2.5 py-1 rounded-lg">
                      {etrangerCount} Sujets
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-purple-200 transition-colors">
                    Examens de l'Étranger
                  </h3>
                  <p className="text-xs text-purple-100/80 leading-relaxed">
                    Sujets de référence internationale (France Métropole, Sénégal, Côte d'Ivoire, Maroc) pour perfectionner votre niveau.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-purple-800/50 relative z-10">
                  <span className="text-xs font-extrabold text-purple-300 group-hover:underline flex items-center gap-1">
                    Cliquer pour voir les épreuves internationales
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        ) : null}

        {/* ─── ALL SUBJECTS GRID / LIST ───────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  <div className="w-16 h-5 bg-slate-200 rounded-full" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-9 bg-slate-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : isHubView ? null : filteredContents.length > 0 ? (
          <div className="space-y-4">
            
            {(selectedLevelTab === 'Tous' || selectedLevelTab === 'ALL') ? (
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-black text-[#163B45] flex items-center gap-2">
                  <BookOpen size={20} className="text-[#1BB4D3]" />
                  Sélectionnez un niveau
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(groupedContents).map(([groupLvl, groupItems]) => {
                    let color = 'from-slate-600 to-slate-800';
                    let icon = '📚';
                    if (groupLvl === 'BAC SM') { color = 'from-blue-600 to-indigo-700'; icon = '📐'; }
                    else if (groupLvl === 'BAC SE') { color = 'from-teal-600 to-emerald-700'; icon = '🔬'; }
                    else if (groupLvl === 'BAC SS') { color = 'from-amber-600 to-orange-700'; icon = '🌍'; }
                    else if (groupLvl === 'BEPC') { color = 'from-purple-600 to-pink-700'; icon = '🎓'; }
                    else if (groupLvl === '7ème Année (CEE)' || groupLvl === '7È CEE') { color = 'from-sky-600 to-blue-700'; icon = '🎒'; }
                    else if (groupLvl === 'Supérieur') { color = 'from-rose-600 to-red-700'; icon = '🏛️'; }
                    
                    return (
                      <button
                        key={groupLvl}
                        onClick={() => setSelectedLevelTab(groupLvl === '7ème Année (CEE)' ? '7È CEE' : groupLvl)}
                        className={`p-5 rounded-3xl text-left bg-gradient-to-br ${color} text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[140px] relative overflow-hidden group`}
                      >
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 text-7xl opacity-10 group-hover:scale-110 transition-transform">
                          {icon}
                        </div>
                        <div className="relative z-10">
                          <span className="text-[11px] font-black uppercase tracking-wider text-white/80 bg-black/10 px-2 py-1 rounded-md">
                            Niveau
                          </span>
                          <h4 className="text-xl font-black mt-3">{groupLvl}</h4>
                        </div>
                        <div className="mt-6 flex items-center justify-between relative z-10">
                          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg">
                            {groupItems.length} sujets
                          </span>
                          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groupedContents).map(([groupLvl, groupItems]) => (
                  <div key={groupLvl} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1BB4D3]/10 text-[#1BB4D3] flex items-center justify-center">
                        <LayoutGrid size={16} />
                      </div>
                      <h3 className="text-lg font-black text-[#163B45]">{groupLvl}</h3>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {groupItems.length} sujets
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      viewMode === 'list'
                        ? 'space-y-3'
                        : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    }
                  >
                    {groupItems.map((item, index) => {
                      const badgeInfo = getLevelBadgeColor(item.level);
                      const categoryBadge = getCategoryBadge(item);
                      const subjectName = item.subject?.name || item.subject || 'Matière';
                      const iconName = getSubjectIconName(subjectName);
                      const hasWorkedSolution = item.doc_type === 'EXERCICE' || (item.content && item.content.includes('CORRIGÉ'));
                      const isFav = favorites.includes(String(item.id));

                      return (
                        <motion.div
                          key={item.id || index}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.02, 0.4) }}
                          onClick={() => handleOpenItem(item)}
                          className={`group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#1BB4D3]/40 transition-all duration-300 flex ${
                            viewMode === 'list' ? 'flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4' : 'flex-col p-5'
                          } overflow-hidden cursor-pointer relative`}
                        >
                          {/* Top Bar / Badges */}
                          <div className={`flex items-start justify-between gap-2 ${viewMode === 'list' ? 'w-full sm:w-auto' : 'w-full mb-3'}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-[#E8F8FB] border border-[#1BB4D3]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <KharandiIcon name={iconName} size={28} showBackground={false} showBookmark={false} primaryColor="#1BB4D3" />
                              </div>
                              {viewMode === 'list' && (
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-[#1BB4D3] transition-colors">{item.title}</h4>
                                  <p className="text-xs text-slate-500 font-medium">{subjectName} • {item.year || 'Examen'}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 shrink-0 justify-end">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${categoryBadge.cls}`}>
                                {categoryBadge.label}
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeInfo.bg}`}>
                                {badgeInfo.tag}
                              </span>
                              {item.year && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Calendar size={10} /> {item.year}
                                </span>
                              )}
                              <button
                                onClick={(e) => toggleFavorite(String(item.id), e)}
                                className={`p-1.5 rounded-full transition-colors ${
                                  isFav ? 'text-[#FAB304] bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'
                                }`}
                                title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                              >
                                <Star size={16} fill={isFav ? '#FAB304' : 'none'} />
                              </button>
                            </div>
                          </div>

                          {/* Body Title & Excerpt */}
                          {viewMode === 'grid' && (
                            <div className="flex-1 space-y-1.5 mb-4">
                              <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-[#1BB4D3] transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium truncate">
                                {subjectName}
                              </p>
                              
                              {hasWorkedSolution && (
                                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md pt-1">
                                  <CheckCircle2 size={11} /> Corrigé pas-à-pas inclus
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'w-full sm:w-auto shrink-0' : 'w-full pt-2 border-t border-slate-100'}`}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenItem(item); }}
                              className="flex-1 bg-[#1BB4D3] hover:bg-[#18a2bd] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                            >
                              <Play size={12} fill="currentColor" /> Consulter
                            </button>
                            
                            <button
                              onClick={(e) => handleAskKaramo(item, e)}
                              className="p-2 bg-slate-100 hover:bg-[#FAB304]/20 hover:text-[#163B45] text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200"
                              title="Demander de l'aide à l'IA Karamo"
                            >
                              <Bot size={15} className="text-[#163B45]" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[#E8F8FB] rounded-2xl flex items-center justify-center mx-auto text-[#1BB4D3]">
              <KharandiIcon name="devoirs" size={36} showBackground={false} showBookmark={false} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Aucun sujet ne correspond à votre recherche</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Essayez de modifier votre mot-clé, de décocher les filtres stricts ou de consulter une autre série d'examen.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevelTab('Tous');
                setSelectedSubjectFilter('Toutes');
                setSelectedYear('Toutes');
                setOnlySolvables(false);
                setOnlyFavorites(false);
              }}
              className="px-5 py-2.5 bg-[#163B45] text-white rounded-xl text-xs font-bold hover:bg-[#1A4B58] transition-colors shadow-md"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}

      </main>

    </div>
  );
};
