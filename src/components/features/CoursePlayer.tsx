import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { PaymentButton } from './PaymentButton';
import { 
  CheckCircle2, Lock, Menu, X, BookOpen, Trophy, MessageCircle,
  ZoomIn, ZoomOut, Sun, Moon, FileText, Sparkles, Printer, ArrowLeft,
  ChevronRight, ChevronLeft, Bot, Award, Calendar, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EduLoading } from './EduLoading';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { SecurePDFViewer } from './SecurePDFViewer';
import { useAuth } from '../../contexts/AuthContext';
import { AITeacherChat } from './AITeacherChat';
import { KaramoVoicePlayer } from './KaramoVoicePlayer';

interface Chapter {
  id: string; title: string; content?: string; order: number;
  videoUrl?: string; price?: number; isFree?: boolean;
  file_url?: string;
  quiz?: { question: string; options: string[]; correctAnswer: number; };
}

export const CoursePlayer: React.FC<{ courseId: string; onClose?: () => void }> = ({ courseId, onClose }) => {
  const { userProfile } = useAuth();
  const username = userProfile?.name || userProfile?.phone || 'Élève';

  const [chapters,            setChapters]           = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [quizAnswer,          setQuizAnswer]          = useState<number | null>(null);
  const [quizResult,          setQuizResult]          = useState<string | null>(null);
  const [completedChapters,   setCompletedChapters]   = useState<string[]>([]);
  const [isSidebarOpen,       setIsSidebarOpen]       = useState(false);
  const [loading,             setLoading]             = useState(true);
  const [showKaramo,          setShowKaramo]          = useState(false);
  const [karamoPrompt,        setKaramoPrompt]        = useState<string | undefined>(undefined);

  // Reader Customization State
  const [fontScale, setFontScale] = useState<number>(16); // 14, 16, 18, 20
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'epreuve' | 'corrige'>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const { getDocument, getDocuments } = await import('../../services/learning');

        // ── Cas 1 : courseId est un UUID → fetch direct du document ──────────
        const isUUID = /^[0-9a-f-]{36}$/i.test(courseId);
        if (isUUID) {
          try {
            const doc = await getDocument(courseId);
            const d = (doc as any)?.data || doc;
            if (d && (d.content || d.file_url || d.external_url)) {
              setChapters([{
                id:       String(d.id),
                title:    d.title || 'Sujet',
                content:  d.content || '',
                order:    1,
                isFree:   d.is_free,
                videoUrl: d.doc_type === 'VIDEO' ? (d.external_url || d.file_url) : undefined,
                file_url: d.external_url || d.file_url || undefined,
              }]);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('Direct fetch failed, fallback to list', e);
          }
        }

        // ── Cas 2 : fallback → fetch la liste complète ────────────────────────
        const filters: any = { page_size: 500 };
        if (courseId && !isNaN(Number(courseId))) {
          filters.subject = Number(courseId);
        }

        const data = await getDocuments(filters);
        const rawList = data?.results || data?.data?.results || (Array.isArray(data) ? data : []);

        const list: any[] = [];
        const seen = new Set<string>();
        for (const item of rawList) {
          if (!item) continue;
          const key = `${(item.title || '').trim().toLowerCase()}_${item.level}_${item.doc_type}`;
          if (!seen.has(key)) { seen.add(key); list.push(item); }
        }

        let docs: Chapter[] = [];

        if (courseId && isNaN(Number(courseId))) {
          const matchedDoc = list.find((d: any) => String(d.id) === String(courseId));
          if (matchedDoc) {
            docs = [{
              id:       String(matchedDoc.id),
              title:    matchedDoc.title,
              content:  matchedDoc.content || '',
              order:    1,
              isFree:   matchedDoc.is_free,
              videoUrl: matchedDoc.doc_type === 'VIDEO' ? (matchedDoc.external_url || matchedDoc.file_url) : undefined,
              file_url: matchedDoc.external_url || matchedDoc.file_url || undefined,
            }];
            setCurrentChapterIndex(0);
          }
        } else {
          docs = list.map((d: any, i: number) => ({
            id:       String(d.id),
            title:    d.title,
            content:  d.content || '',
            order:    i + 1,
            isFree:   d.is_free,
            videoUrl: d.doc_type === 'VIDEO' ? (d.external_url || d.file_url) : undefined,
            file_url: d.external_url || d.file_url || undefined,
          }));
        }

        setChapters(docs);
      } catch (err) {
        console.error("Error loading chapters:", err);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const handleQuizSubmit = () => {
    const ch = chapters[currentChapterIndex];
    if (quizAnswer === ch.quiz?.correctAnswer) {
      setQuizResult('Correct !');
      if (!completedChapters.includes(ch.id)) setCompletedChapters(p => [...p, ch.id]);
    } else {
      setQuizResult('Incorrect. Réessayez.');
    }
  };

  const nextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(i => i + 1);
      setQuizAnswer(null);
      setQuizResult(null);
    }
  };

  const progress = chapters.length > 0
    ? Math.round((completedChapters.length / chapters.length) * 100)
    : 0;
  const currentChapter = chapters[currentChapterIndex];

  // Helper to detect if content has a worked solution section
  const hasWorkedSolution = currentChapter?.content?.toLowerCase().includes('corrigé') || 
                            currentChapter?.content?.toLowerCase().includes('solution') ||
                            currentChapter?.content?.toLowerCase().includes('barème');

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[450px]">
      <EduLoading message="Preparation du sujet et mise en page..." />
    </div>
  );

  if (chapters.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white rounded-3xl border border-slate-200">
      <BookOpen size={48} className="text-slate-300 mb-4" />
      <h3 className="text-xl font-black text-slate-800 mb-2">Aucun contenu disponible</h3>
      <p className="text-slate-500 mb-6 text-sm">Ce sujet n'a pas encore de contenu textuel chargé.</p>
      {onClose && (
        <button onClick={onClose} className="px-5 py-2.5 bg-[#163B45] text-white font-bold rounded-xl text-xs">
          Retour à la bibliothèque
        </button>
      )}
    </div>
  );

  return (
    <div className={`flex h-full min-h-[600px] rounded-[28px] overflow-hidden border transition-colors relative ${
      isNightMode ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-slate-100 text-slate-900 border-slate-200'
    }`}>

      {/* Sidebar navigation entre sujets/chapitres */}
      <AnimatePresence>
        {isSidebarOpen && chapters.length > 1 && (
          <motion.div initial={{ width: 0 }} animate={{ width: 280 }} exit={{ width: 0 }}
            className={`overflow-hidden flex-shrink-0 absolute md:relative inset-y-0 left-0 z-40 shadow-2xl md:shadow-none h-full md:h-auto border-r ${
              isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
            <div className="p-4 border-b border-slate-200/50 flex items-center justify-between">
              <div>
                <p className={`font-black text-xs uppercase tracking-wider ${isNightMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Documents de la série ({chapters.length})
                </p>
                <div className="w-36 bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-[#1BB4D3] h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100%-80px)]">
              {chapters.map((ch, i) => (
                <button key={ch.id}
                  onClick={() => {
                    setCurrentChapterIndex(i);
                    setQuizAnswer(null);
                    setQuizResult(null);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3.5 border-b flex items-start gap-3 transition-colors ${
                    isNightMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'
                  } ${i === currentChapterIndex ? (isNightMode ? 'bg-slate-800/80 border-l-4 border-l-[#1BB4D3]' : 'bg-[#E8F8FB] border-l-4 border-l-[#1BB4D3]') : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5
                    ${completedChapters.includes(ch.id) ? 'bg-emerald-500 text-white'
                      : i === currentChapterIndex ? 'bg-[#163B45] text-white'
                      : 'bg-slate-200 text-slate-600'}`}>
                    {completedChapters.includes(ch.id) ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-xs font-bold line-clamp-2 ${i === currentChapterIndex ? 'text-[#1BB4D3]' : (isNightMode ? 'text-slate-200' : 'text-slate-800')}`}>
                      {ch.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone Principale de Lecture */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top Control Header Bar */}
        <div className={`flex flex-wrap items-center justify-between p-2.5 sm:p-4 border-b shrink-0 gap-2 ${
          isNightMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Left Navigation controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {onClose && (
              <button 
                onClick={onClose} 
                className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 flex items-center gap-1 text-xs font-bold"
                title="Retour à la bibliothèque"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Retour</span>
              </button>
            )}

            {chapters.length > 1 && (
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 shrink-0"
                title="Liste des sujets"
              >
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}

            <div className="min-w-0 max-w-[120px] xs:max-w-[170px] sm:max-w-xs md:max-w-md">
              <h2 className={`font-black text-xs sm:text-sm truncate ${isNightMode ? 'text-white' : 'text-slate-900'}`}>
                {currentChapter?.title}
              </h2>
            </div>
          </div>

          {/* Center Reading Settings (Font & Night Mode) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFontScale(s => Math.max(14, s - 2))}
              className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold text-xs"
              title="Réduire la taille du texte"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[10px] sm:text-[11px] font-black px-1 text-slate-500">
              {fontScale}px
            </span>
            <button
              onClick={() => setFontScale(s => Math.min(22, s + 2))}
              className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold text-xs"
              title="Agrandir la taille du texte"
            >
              <ZoomIn size={14} />
            </button>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />

            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
              title={isNightMode ? "Mode clair" : "Mode sombre pour la nuit"}
            >
              {isNightMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setKaramoPrompt(`Explique-moi étape par étape la résolution de ce sujet d'examen : "${currentChapter?.title}". Sois très pédagogique. ###${Date.now()}`);
                setShowKaramo(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-[#FAB304] hover:bg-[#e0a103] text-[#163B45] rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Bot size={15} />
              <span className="hidden sm:inline">Explication Prof. Karamo</span>
              <span className="sm:hidden">Prof. Karamo</span>
            </button>
          </div>
        </div>

        {/* Reading Tabs (Toutes, Épreuve seule, Corrigé pas-à-pas) */}
        {hasWorkedSolution && currentChapter?.content && (
          <div className={`px-3 sm:px-4 py-2 border-b flex items-center justify-between text-xs font-bold gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap ${
            isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-400 shrink-0">Vue :</span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all text-xs ${
                  activeTab === 'all'
                    ? 'bg-[#163B45] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                Vue Complète (Sujet + Corrigé)
              </button>
              <button
                onClick={() => setActiveTab('epreuve')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all text-xs ${
                  activeTab === 'epreuve'
                    ? 'bg-[#163B45] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                📄 Épreuve seule
              </button>
              <button
                onClick={() => setActiveTab('corrige')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all text-xs ${
                  activeTab === 'corrige'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                }`}
              >
                ✍️ Corrigé Détaillé
              </button>
            </div>
          </div>
        )}

        {/* Document Content Scroll View */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 space-y-5 sm:space-y-6">

          {/* Vidéo si présente */}
          {currentChapter?.videoUrl && (
            <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-6 shadow-xl border border-slate-800">
              <video src={currentChapter.videoUrl} controls className="w-full h-full" />
            </div>
          )}

          {/* Synthetic Audio Voice-Over */}
          {currentChapter?.content && (
            <div className="max-w-4xl mx-auto">
              <KaramoVoicePlayer
                textToRead={currentChapter.content}
                title={`Explication Vocale — ${currentChapter.title}`}
                subtitle="Écoutez la synthèse explicative et les conseils méthodologiques du Prof. Karamo"
              />
            </div>
          )}

          {/* Main Formatted Subject Card */}
          {currentChapter?.content ? (
            <div className="max-w-4xl mx-auto space-y-6">

              <div className={`rounded-3xl border shadow-sm p-4 sm:p-7 md:p-10 transition-colors ${
                isNightMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-100' 
                  : 'bg-white border-slate-200/80 text-slate-900'
              }`}>
                
                {/* Header Badge Card */}
                <div className="pb-5 mb-6 sm:mb-8 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-[#1BB4D3]/10 text-[#1BB4D3] border border-[#1BB4D3]/30 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                      Épreuve d'Examen Officiel
                    </span>
                    <h1 className={`text-lg sm:text-2xl font-black mt-2 leading-snug ${isNightMode ? 'text-white' : 'text-[#163B45]'}`}>
                      {currentChapter.title}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                    >
                      <Printer size={14} /> Imprimer / PDF
                    </button>
                  </div>
                </div>

                {/* Markdown Styled Reader with Custom Typography & Spacing */}
                <div className="prose max-w-none dark:prose-invert space-y-5 [overflow-wrap:anywhere] break-words" style={{ fontSize: `${fontScale}px` }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({node, ...props}) => (
                        <h1 className={`text-xl sm:text-3xl font-black my-6 pb-2 border-b-2 ${
                          isNightMode ? 'text-[#1BB4D3] border-slate-800' : 'text-[#163B45] border-[#1BB4D3]/20'
                        }`} {...props} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 className={`text-base sm:text-xl font-extrabold mt-6 mb-3 p-3 sm:p-4 rounded-2xl border-l-4 flex items-center gap-2 ${
                          isNightMode 
                            ? 'bg-slate-800/80 text-teal-300 border-[#1BB4D3]' 
                            : 'bg-[#E8F8FB] text-[#163B45] border-[#1BB4D3]'
                        }`} {...props} />
                      ),
                      h3: ({node, ...props}) => (
                        <h3 className={`text-sm sm:text-lg font-black mt-5 mb-2 ${
                          isNightMode ? 'text-slate-200' : 'text-slate-900'
                        }`} {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p className={`leading-relaxed md:leading-loose mb-4 font-normal ${
                          isNightMode ? 'text-slate-200' : 'text-slate-800'
                        }`} {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul className="list-disc pl-5 sm:pl-6 mb-5 space-y-2 marker:text-[#1BB4D3]" {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol className="list-decimal pl-5 sm:pl-6 mb-5 space-y-2 marker:text-[#163B45] font-semibold" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="leading-relaxed" {...props} />
                      ),
                      strong: ({node, ...props}) => (
                        <strong className={`font-black px-1 py-0.5 rounded ${
                          isNightMode ? 'text-amber-300 bg-amber-950/40' : 'text-slate-950 bg-amber-100/60'
                        }`} {...props} />
                      ),
                      blockquote: ({node, ...props}) => (
                        <blockquote className={`border-l-4 p-4 sm:p-5 rounded-2xl my-5 shadow-sm ${
                          isNightMode 
                            ? 'bg-amber-950/20 border-amber-500 text-amber-200' 
                            : 'bg-amber-50/80 border-[#FAB304] text-slate-800'
                        }`} {...props} />
                      ),
                      code: ({node, inline, ...props}: any) => inline ? (
                        <code className={`px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono break-all ${
                          isNightMode ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-900'
                        }`} {...props} />
                      ) : (
                        <code className="block bg-slate-950 text-teal-300 p-4 sm:p-5 rounded-2xl overflow-x-auto text-xs sm:text-sm font-mono my-5 border border-slate-800 shadow-lg leading-relaxed" {...props} />
                      ),
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                          <table className="w-full border-collapse text-xs sm:text-sm" {...props} />
                        </div>
                      ),
                      th: ({node, ...props}) => (
                        <th className="bg-[#163B45] text-white p-2.5 sm:p-3 font-extrabold text-left" {...props} />
                      ),
                      td: ({node, ...props}) => (
                        <td className="p-2.5 sm:p-3 border-t border-slate-200 dark:border-slate-800" {...props} />
                      )
                    }}
                  >
                    {currentChapter.content}
                  </ReactMarkdown>
                </div>

              </div>

              {/* Bot Assist CTA Banner */}
              <div className="bg-gradient-to-r from-[#163B45] to-[#1BB4D3] text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black shrink-0">
                    <Bot size={26} className="text-[#FAB304]" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm">Une question sur cet exercice ?</h4>
                    <p className="text-[11px] sm:text-xs text-white/80 mt-0.5">Professeur Karamo est prêt à vous expliquer n'importe quelle formule ou question.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setKaramoPrompt(`Pose-moi 3 questions d'entraînement similaires au sujet "${currentChapter?.title}" pour vérifier si j'ai bien compris.`);
                    setShowKaramo(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#FAB304] hover:bg-[#e0a103] text-[#163B45] font-black rounded-xl text-xs shrink-0 shadow-md transition-all text-center"
                >
                  S'entraîner avec l'IA
                </button>
              </div>

            </div>
          ) : currentChapter?.file_url && !currentChapter?.videoUrl ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[70vh] overflow-hidden flex flex-col">
              <SecurePDFViewer
                url={currentChapter.file_url}
                documentId={currentChapter.id}
                username={username}
                title={currentChapter.title}
              />
            </div>
          ) : (
            !currentChapter?.videoUrl && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
                <p className="text-slate-500 font-bold text-sm">Contenu non disponible pour ce sujet.</p>
              </div>
            )
          )}

          {/* Quiz Section si configurée */}
          {currentChapter?.quiz && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-[#FAB304]" /> Quiz de vérification : {currentChapter.quiz.question}
              </h4>
              <div className="space-y-2.5">
                {currentChapter.quiz.options.map((opt, i) => (
                  <button key={i} onClick={() => setQuizAnswer(i)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                      quizAnswer === i
                        ? 'border-[#1BB4D3] bg-[#E8F8FB] text-[#163B45]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
              {quizAnswer !== null && !quizResult && (
                <Button onClick={handleQuizSubmit} className="mt-4 w-full bg-[#163B45] hover:bg-[#1A4B58] text-white">
                  Valider ma réponse
                </Button>
              )}
              {quizResult && (
                <p className={`mt-4 font-bold text-center p-3 rounded-2xl text-xs sm:text-sm ${
                  quizResult.includes('Correct') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {quizResult}
                </p>
              )}
            </div>
          )}

          {/* Bottom Navigation between subjects */}
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-200/60">
            {currentChapterIndex > 0 ? (
              <button
                onClick={() => { setCurrentChapterIndex(i => i - 1); setQuizAnswer(null); setQuizResult(null); }}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft size={16} /> Sujet précédent
              </button>
            ) : <div />}

            {currentChapterIndex < chapters.length - 1 ? (
              <button
                onClick={nextChapter}
                className="px-5 py-2.5 bg-[#163B45] hover:bg-[#1A4B58] text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all ml-auto"
              >
                Sujet suivant <ChevronRight size={16} />
              </button>
            ) : (
              <div className="bg-emerald-100 text-emerald-800 font-black px-4 py-2 rounded-2xl text-xs flex items-center gap-2">
                <Trophy size={16} /> Dernier sujet consulté
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Karamö Assistant Drawer (Desktop) */}
      <AnimatePresence>
        {showKaramo && (
          <motion.div initial={{ width: 0 }} animate={{ width: 380 }} exit={{ width: 0 }}
            className="hidden lg:flex bg-white border-l border-slate-200 overflow-hidden shrink-0 flex-col relative z-20 h-full shadow-2xl">
            <div className="flex-1 w-[380px] h-full flex flex-col">
              <AITeacherChat inline onClose={() => setShowKaramo(false)} initialMessage={karamoPrompt} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Karamö Assistant Drawer (Mobile) */}
      <AnimatePresence>
        {showKaramo && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden absolute inset-0 z-[100] bg-white flex flex-col overflow-hidden rounded-2xl">
            <AITeacherChat inline onClose={() => setShowKaramo(false)} initialMessage={karamoPrompt} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
