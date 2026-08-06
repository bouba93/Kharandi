/**
 * SubjectViewer.tsx — Design magazine dynamique
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Clock, Moon, Sun,
  ZoomIn, ZoomOut, CheckCircle, FileText, ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { saveReadingProgress, getReadingProgress } from '../../services/content';

interface SubjectViewerProps {
  doc: any;
  username: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function parseContent(raw: string) {
  const lines = raw.split('\n').filter(l => l.trim());
  const header: string[] = [];
  const exercises: { title: string; content: string[] }[] = [];
  let inHeader = true;
  let current: { title: string; content: string[] } | null = null;

  for (const line of lines) {
    const t = line.trim();
    if (inHeader && /^(Exercice|Partie|Problème|Question)\s*[A-Z0-9:\-]/i.test(t)) {
      inHeader = false;
    }
    if (inHeader) { header.push(t); continue; }
    if (/^(Exercice|Partie|Problème)\s*[A-Z0-9:\-]/i.test(t)) {
      if (current) exercises.push(current);
      current = { title: t, content: [] };
    } else if (current) {
      current.content.push(t);
    } else {
      exercises.push({ title: '', content: [t] });
    }
  }
  if (current) exercises.push(current);
  return { header, exercises };
}

function getSerieStyle(title: string) {
  if (title.includes('BAC SM')) return { gradient: 'from-primary via-primary/95 to-primary/70', badge: 'bg-primary', text: 'BAC SM' };
  if (title.includes('BAC SS')) return { gradient: 'from-secondary via-secondary/95 to-secondary/70', badge: 'bg-secondary', text: 'BAC SS' };
  if (title.includes('BAC SE')) return { gradient: 'from-primary via-primary/85 to-secondary/85', badge: 'bg-accent', text: 'BAC SE' };
  return { gradient: 'from-primary via-primary/80 to-primary/60', badge: 'bg-primary', text: 'BAC' };
}

export const SubjectViewer: React.FC<SubjectViewerProps> = ({ doc, username, onClose, onPrev, onNext }) => {
  const [dark,     setDark]     = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const [isRead,   setIsRead]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeEx, setActiveEx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { header, exercises } = parseContent(doc.content || '');
  const style   = getSerieStyle(doc.title || '');
  const year    = (doc.title || '').match(/\b(20\d{2}|19\d{2})\b/)?.[1] || '';
  const matiere = (doc.title || '').split('—')[1]?.trim() || '';

  useEffect(() => {
    getReadingProgress(doc.id).then(p => {
      setProgress(p?.progress || 0);
      setIsRead(p?.is_read || false);
    }).catch(() => {});
  }, [doc.id]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
      if (pct > progress) {
        setProgress(pct);
        if (pct > 5) saveReadingProgress(doc.id, pct, pct >= 95).catch(() => {});
        if (pct >= 95 && !isRead) setIsRead(true);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [progress, isRead]);

  const bg   = dark ? 'bg-gray-950' : 'bg-slate-50';
  const card = dark ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white border-slate-100 text-slate-900';
  const sub  = dark ? 'text-gray-400' : 'text-slate-500';
  const hasNoContent = !doc.content || doc.content.length < 50;

  return (
    <div className={`min-h-screen ${bg} flex flex-col transition-colors duration-200`}>
      {/* Barre top */}
      <div className={`sticky top-0 z-30 ${dark ? 'bg-gray-950/95 border-gray-800' : 'bg-white/95 border-slate-100'} backdrop-blur-xl border-b`}>
        <div className={`h-1 ${dark ? 'bg-gray-800' : 'bg-slate-100'}`}>
          <motion.div className={`h-1 bg-gradient-to-r ${style.gradient}`}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onClose}
            className={`flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl transition-colors ${dark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-slate-100 text-slate-600'}`}>
            <ChevronLeft size={16} /> Bibliothèque
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold truncate ${sub}`}>{doc.title}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setFontSize(s => Math.max(12, s - 1))} className={`p-2 rounded-lg ${dark ? 'hover:bg-gray-800' : 'hover:bg-slate-100'}`}>
              <ZoomOut size={14} className={sub} />
            </button>
            <span className={`text-xs font-bold w-7 text-center ${sub}`}>{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(20, s + 1))} className={`p-2 rounded-lg ${dark ? 'hover:bg-gray-800' : 'hover:bg-slate-100'}`}>
              <ZoomIn size={14} className={sub} />
            </button>
            <div className={`w-px h-4 mx-1 ${dark ? 'bg-gray-700' : 'bg-slate-200'}`} />
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg ${dark ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 pb-24 space-y-5">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-[28px] overflow-hidden border ${card} shadow-lg`}>
            <div className={`bg-gradient-to-r ${style.gradient} px-6 py-5 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-black bg-white/20 px-3 py-1 rounded-full">{style.text}</span>
                    {year && (
                      <span className="text-sm font-black bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={11} /> {year}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-black leading-tight">{matiere || doc.title}</h1>
                  {doc.description && <p className="text-white/75 text-sm mt-1">{doc.description}</p>}
                </div>
                {isRead && <div className="bg-white/20 rounded-2xl p-2.5"><CheckCircle size={20} /></div>}
              </div>
            </div>
            {header.length > 0 && !hasNoContent && (
              <div className={`px-6 py-4 border-t ${dark ? 'border-gray-800' : 'border-slate-100'}`}>
                {header.slice(0, 6).map((line, i) => (
                  <p key={i} style={{ fontSize: 13 }}
                    className={`leading-relaxed ${/baccalaureat|session/i.test(line) ? `font-black ${dark ? 'text-white' : 'text-slate-900'}` : `font-medium ${sub}`}`}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          {/* Contenu vide */}
          {hasNoContent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-[24px] border ${card} shadow-sm p-8 text-center`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${dark ? 'bg-gray-800' : 'bg-slate-50'}`}>
                <FileText size={28} className={sub} />
              </div>
              <h3 className={`font-black text-lg mb-2 ${dark ? 'text-white' : 'text-slate-800'}`}>Sujet en cours de chargement</h3>
              <p className={`text-sm mb-4 ${sub}`}>
                Ce sujet a été référencé mais son contenu est en cours de récupération. Revenez dans quelques minutes.
              </p>
              {doc.external_url && (
                <a href={doc.external_url} target="_blank" rel="noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white ${style.badge} hover:opacity-90 transition-opacity`}>
                  <ExternalLink size={14} /> Voir sur exam224.com
                </a>
              )}
            </motion.div>
          )}

          {/* Navigation rapide */}
          {!hasNoContent && exercises.filter(e => e.title).length > 1 && (
            <div className={`rounded-[20px] border ${card} shadow-sm p-4`}>
              <p className={`text-xs font-black uppercase tracking-wider mb-3 ${sub}`}>Navigation rapide</p>
              <div className="flex flex-wrap gap-2">
                {exercises.filter(e => e.title).map((ex, i) => (
                  <button key={i}
                    onClick={() => { setActiveEx(activeEx === i ? null : i); document.getElementById(`ex-${i}`)?.scrollIntoView({ behavior: 'smooth' }); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all border
                      ${activeEx === i ? `${style.badge} text-white border-transparent` : dark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                    {ex.title.length > 20 ? ex.title.slice(0, 20) + '…' : ex.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exercices */}
          {!hasNoContent && exercises.map((ex, idx) => (
            <motion.div key={idx} id={`ex-${idx}`}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + idx * 0.04 }}
              className={`rounded-[24px] border ${card} shadow-sm overflow-hidden`}>
              {ex.title && (
                <div className={`flex items-center gap-3 px-5 py-4 border-b ${dark ? 'border-gray-800' : 'border-slate-50'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0 ${style.badge}`}>{idx + 1}</div>
                  <h2 style={{ fontSize: fontSize + 1 }} className={`font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{ex.title}</h2>
                </div>
              )}
              <div className="px-5 py-4 space-y-2">
                {ex.content.map((line, li) => {
                  const isSubTitle = /^[A-Z]\)|^\d+[.)]\s|^Partie [A-Z]/i.test(line);
                  const isQuestion = /^\s*\d+[.)]\s/.test(line);
                  if (isSubTitle) return <p key={li} style={{ fontSize: fontSize - 1 }} className={`font-black mt-3 mb-1 ${dark ? 'text-blue-300' : 'text-primary'}`}><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{line}</ReactMarkdown></p>;
                  if (isQuestion) return (
                    <div key={li} className="flex gap-2.5 mt-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${dark ? 'bg-gray-600' : 'bg-slate-300'}`} />
                      <div style={{ fontSize }} className={`leading-relaxed font-medium ${dark ? 'text-gray-200' : 'text-slate-800'}`}><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{line}</ReactMarkdown></div>
                    </div>
                  );
                  return <div key={li} style={{ fontSize }} className={`leading-relaxed ${dark ? 'text-gray-300' : 'text-slate-700'} markdown-body`}><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{line}</ReactMarkdown></div>;
                })}
              </div>
            </motion.div>
          ))}

          {/* Bouton terminé */}
          {!hasNoContent && !isRead && progress > 20 && (
            <div className="flex justify-center">
              <button onClick={async () => { setIsRead(true); setProgress(100); await saveReadingProgress(doc.id, 100, true).catch(() => {}); }}
                className={`flex items-center gap-2 px-8 py-4 text-white font-black rounded-[20px] shadow-xl hover:scale-105 transition-transform bg-gradient-to-r ${style.gradient}`}>
                <CheckCircle size={18} /> J'ai terminé ce sujet ✓
              </button>
            </div>
          )}
          {isRead && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-2xl font-bold text-sm border border-green-200">
                <CheckCircle size={16} /> Sujet complété — Excellent travail !
              </div>
            </div>
          )}

          {/* Navigation Précédent / Suivant */}
          {(onPrev || onNext) && (
            <div className={`flex items-center justify-between gap-4 pt-6 border-t ${dark ? 'border-gray-800' : 'border-slate-100'}`}>
              {onPrev ? (
                <button
                  onClick={onPrev}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-black transition-colors active:scale-95 shadow-sm cursor-pointer ${
                    dark
                      ? 'bg-gray-900 border-gray-800 hover:bg-gray-800 text-gray-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-705'
                  }`}
                >
                  <ChevronLeft size={14} /> Précédent
                </button>
              ) : (
                <div />
              )}

              {onNext ? (
                <button
                  onClick={onNext}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-black transition-all active:scale-95 shadow-md cursor-pointer bg-gradient-to-r ${style.gradient} hover:opacity-95`}
                >
                  Suivant <ChevronRight size={14} />
                </button>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
