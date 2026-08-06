import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { PaymentButton } from './PaymentButton';
import { CheckCircle2, Lock, Menu, X, BookOpen, Trophy, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EduLoading } from './EduLoading';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { SecurePDFViewer } from './SecurePDFViewer';
import { useAuth } from '../../contexts/AuthContext';
import { AITeacherChat } from './AITeacherChat';

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
  const [isSidebarOpen,       setIsSidebarOpen]       = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
  const [loading,             setLoading]             = useState(true);
  const [showKaramo,          setShowKaramo]          = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [karamoPrompt,        setKaramoPrompt]        = useState<string | undefined>(undefined);

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
            const matchedSubjectId = matchedDoc.subject?.id || matchedDoc.subject;
            const relatedDocs = matchedSubjectId
              ? list.filter((d: any) => String(d.subject?.id || d.subject) === String(matchedSubjectId))
              : [matchedDoc];

            docs = relatedDocs.map((d: any, i: number) => ({
              id:       String(d.id),
              title:    d.title,
              content:  d.content || '',
              order:    i + 1,
              isFree:   d.is_free,
              videoUrl: d.doc_type === 'VIDEO' ? (d.external_url || d.file_url) : undefined,
              file_url: d.external_url || d.file_url || undefined,
            }));

            const idx = relatedDocs.findIndex((d: any) => String(d.id) === String(courseId));
            if (idx !== -1) setCurrentChapterIndex(idx);
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <EduLoading message="Chargement du sujet..." />
    </div>
  );

  if (chapters.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <BookOpen size={48} className="text-gray-300 mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun contenu disponible</h3>
      <p className="text-gray-500 mb-4">Ce sujet n'a pas encore de contenu chargé.</p>
      {onClose && <Button onClick={onClose}>Retour</Button>}
    </div>
  );

  return (
    <div className="flex h-full min-h-[500px] bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 relative">

      {/* Sidebar chapitres */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ width: 0 }} animate={{ width: 280 }} exit={{ width: 0 }}
            className="bg-white border-r border-gray-200 overflow-hidden flex-shrink-0 absolute md:relative inset-y-0 left-0 z-40 shadow-xl md:shadow-none h-full md:h-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-black text-slate-900 text-sm">Chapitres</p>
                <div className="w-32 bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{progress}% complété</p>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="overflow-y-auto">
              {chapters.map((ch, i) => (
                <button key={ch.id}
                  onClick={() => {
                    setCurrentChapterIndex(i);
                    setQuizAnswer(null);
                    setQuizResult(null);
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full text-left p-4 border-b border-gray-50 flex items-center gap-3 hover:bg-gray-50 transition-colors
                    ${i === currentChapterIndex ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0
                    ${completedChapters.includes(ch.id) ? 'bg-green-500 text-white'
                      : i === currentChapterIndex ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-500'}`}>
                    {completedChapters.includes(ch.id) ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className="text-sm font-bold text-gray-700 truncate">{ch.title}</span>
                  {!ch.isFree && <Lock size={12} className="text-gray-400 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl">
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h3 className="font-black text-slate-900 truncate pr-4">{currentChapter?.title}</h3>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setKaramoPrompt(`Explique-moi ce sujet : ${currentChapter?.title} ###${Date.now()}`);
                setShowKaramo(true);
              }}
              className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-0 md:mr-2 shrink-0">
              <MessageCircle size={16} />
              <span className="hidden sm:inline">Expliquer le sujet</span>
              <span className="sm:hidden">Expliquer</span>
            </Button>
            <button onClick={() => setShowKaramo(!showKaramo)}
              className="p-2 md:hidden hover:bg-gray-100 rounded-xl shrink-0">
              <MessageCircle size={18} className={showKaramo ? 'text-primary' : 'text-gray-500'} />
            </button>
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl shrink-0">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">

          {/* Vidéo */}
          {currentChapter?.videoUrl && (
            <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 shrink-0">
              <video src={currentChapter.videoUrl} controls className="w-full h-full" />
            </div>
          )}

          {/* Contenu texte */}
          {currentChapter?.content ? (
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm mb-6 p-6 md:p-8">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-black text-primary mb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-primary mt-8 mb-4 border-b border-primary/10 pb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3" {...props} />,
                    p:  ({node, ...props}) => <p  className="text-slate-600 leading-relaxed mb-4 text-[15px]" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-slate-600 space-y-2 marker:text-secondary" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-slate-600 space-y-2 marker:text-secondary font-bold" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-extrabold text-slate-900" {...props} />,
                    a:  ({node, ...props}) => <a  className="text-secondary font-bold hover:underline" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-secondary/50 bg-secondary/5 p-4 rounded-xl text-slate-700 italic my-6" {...props} />
                    ),
                    code: ({node, inline, ...props}: any) => inline
                      ? <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props} />
                      : <code className="block bg-slate-800 text-slate-50 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4 shadow-inner" {...props} />,
                  }}
                >
                  {currentChapter.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : currentChapter?.file_url && !currentChapter?.videoUrl ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 flex-1 min-h-[60vh] md:min-h-[70vh] overflow-hidden flex flex-col">
              <SecurePDFViewer
                url={currentChapter.file_url}
                documentId={currentChapter.id}
                username={username}
                title={currentChapter.title}
              />
            </div>
          ) : (
            !currentChapter?.videoUrl && (
              <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-center">Contenu non disponible pour ce sujet.</p>
              </div>
            )
          )}

          {/* Quiz */}
          {currentChapter?.quiz && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <h4 className="font-black text-slate-900 mb-4">Quiz — {currentChapter.quiz.question}</h4>
              <div className="space-y-2">
                {currentChapter.quiz.options.map((opt, i) => (
                  <button key={i} onClick={() => setQuizAnswer(i)}
                    className={`w-full text-left p-3 rounded-xl border text-sm font-bold transition-colors
                      ${quizAnswer === i
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {quizAnswer !== null && !quizResult && (
                <Button onClick={handleQuizSubmit} className="mt-4 w-full">Valider ma réponse</Button>
              )}
              {quizResult && (
                <p className={`mt-4 font-bold text-center p-3 rounded-xl
                  ${quizResult.includes('Correct') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {quizResult}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {currentChapterIndex > 0 && (
              <Button variant="secondary"
                onClick={() => { setCurrentChapterIndex(i => i - 1); setQuizAnswer(null); setQuizResult(null); }}
                className="flex-1">← Précédent</Button>
            )}
            {currentChapterIndex < chapters.length - 1 && (
              <Button onClick={nextChapter} className="flex-1">Chapitre suivant →</Button>
            )}
            {currentChapterIndex === chapters.length - 1 && (
              <div className="flex-1 bg-green-50 text-green-700 font-black py-3 rounded-2xl flex items-center justify-center gap-2">
                <Trophy size={18} /> Terminé !
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Karamo Desktop */}
      <AnimatePresence>
        {showKaramo && (
          <motion.div initial={{ width: 0 }} animate={{ width: 400 }} exit={{ width: 0 }}
            className="hidden md:flex bg-white border-l border-gray-200 overflow-hidden shrink-0 flex-col relative z-20 h-full">
            <div className="flex-1 w-[400px] h-full flex flex-col">
              <AITeacherChat inline onClose={() => setShowKaramo(false)} initialMessage={karamoPrompt} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Karamo Mobile */}
      <AnimatePresence>
        {showKaramo && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden absolute inset-0 z-[100] bg-white flex flex-col overflow-hidden rounded-xl">
            <AITeacherChat inline onClose={() => setShowKaramo(false)} initialMessage={karamoPrompt} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
