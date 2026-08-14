import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  Loader2, 
  HelpCircle, 
  BookOpen, 
  History, 
  Plus, 
  Trash2, 
  Clock, 
  MessageSquare, 
  ChevronLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { api } from '../../config/api';
import { 
  ActiveSubjectData, 
  getActiveSubject, 
  buildKaramoPrompt 
} from '../../services/subjectContext';
import {
  ChatSession,
  getStoredSessions,
  saveChatSession,
  createChatSession,
  deleteChatSession,
  clearAllChatSessions,
  getActiveSessionId,
  setActiveSessionId,
} from '../../services/chatHistory';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  streaming?: boolean;
}

interface AITeacherChatProps {
  onClose?: () => void;
  initialMessage?: string;
  contextTitle?: string;
  activeSubject?: ActiveSubjectData;
  inline?: boolean;
}

const WELCOME = "Bonjour ! Je suis **Professeur Karamo**, ton enseignant virtuel. Je connais l'intégralité du programme guinéen (BAC, BEPC, CEE). Pose-moi toutes tes questions ou demande-moi de t'expliquer un exercice !";

const DEFAULT_SUGGESTIONS = [
  "Explique-moi la résolution de cet exercice",
  "Quelles sont les formules clés à retenir ?",
  "Donne-moi un indice pour commencer",
  "Pose-moi un mini-quiz sur cette notion",
];

const SUBJECT_SUGGESTIONS = [
  "Explique ce sujet étape par étape",
  "Résous ce sujet en détaillant les calculs",
  "Corrige ce sujet avec les points du barème",
  "Explique l'exercice 1",
  "Explique l'exercice 2",
  "Quelles sont les formules clés de ce sujet ?",
];

export const AITeacherChat: React.FC<AITeacherChatProps> = ({ 
  onClose, 
  initialMessage, 
  contextTitle, 
  activeSubject: initialActiveSubject,
  inline 
}) => {
  const { isGuest, userProfile } = useAuth();
  const userId = userProfile?.uid ? String(userProfile.uid) : (isGuest ? 'guest' : null);

  const [currentSubject, setCurrentSubject] = useState<ActiveSubjectData | null>(
    () => initialActiveSubject || getActiveSubject()
  );

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => getActiveSessionId());
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(() => getStoredSessions(userId));

  const [messages,  setMessages]  = useState<Message[]>(() => {
    const stored = getStoredSessions(userId);
    const activeId = getActiveSessionId();
    const found = activeId ? stored.find(s => s.id === activeId) : null;
    if (found && found.messages && found.messages.length > 0) {
      return found.messages;
    }
    return [{ id: '1', role: 'model', content: WELCOME }];
  });

  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef             = useRef<HTMLDivElement>(null);
  const containerRef               = useRef<HTMLDivElement>(null);
  const lastInitialMessageRef      = useRef<string | null>(null);
  const abortRef                   = useRef<AbortController | null>(null);
  const idleTimerRef               = useRef<NodeJS.Timeout | null>(null);
  const idleCountRef               = useRef(0);

  // Re-sync sessions list when user profile changes
  useEffect(() => {
    setSessions(getStoredSessions(userId));
  }, [userId]);

  // Persist messages whenever they change (and not actively streaming)
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const isStreamingNow = messages.some(m => m.streaming);
    if (isStreamingNow) return;

    // Filter meaningful messages
    const validMessages = messages.filter(m => m.content && m.content.trim().length > 0);
    if (validMessages.length <= 1 && validMessages[0]?.id === '1') {
      return; // Do not save solitary default welcome
    }

    let sessionId = currentSessionId;
    let existingList = getStoredSessions(userId);
    let session = sessionId ? existingList.find(s => s.id === sessionId) : null;

    if (!session) {
      // Find first user question for title
      const firstUserMsg = validMessages.find(m => m.role === 'user');
      const title = firstUserMsg 
        ? (firstUserMsg.content.length > 45 ? firstUserMsg.content.slice(0, 45) + '…' : firstUserMsg.content)
        : (currentSubject?.title || 'Discussion Karamo');

      session = {
        id: sessionId || ('session_' + Date.now()),
        title,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        subjectTitle: currentSubject?.title || undefined,
        messages: validMessages
      };
      sessionId = session.id;
      setCurrentSessionId(sessionId);
      setActiveSessionId(sessionId);
    } else {
      // Update session title if default
      if (session.title === 'Nouvelle discussion' || session.title === 'Discussion Karamo') {
        const firstUserMsg = validMessages.find(m => m.role === 'user');
        if (firstUserMsg) {
          session.title = firstUserMsg.content.length > 45 
            ? firstUserMsg.content.slice(0, 45) + '…' 
            : firstUserMsg.content;
        }
      }
      session.messages = validMessages;
      session.updatedAt = Date.now();
      if (currentSubject?.title) session.subjectTitle = currentSubject.title;
    }

    saveChatSession(session, userId);
    setSessions(getStoredSessions(userId));
  }, [messages, currentSessionId, currentSubject, userId]);

  // Auto-close on inactivity (60 seconds without interaction, paused while loading, typing, or viewing history)
  useEffect(() => {
    if (!onClose) return;

    const resetIdleTimer = () => {
      idleCountRef.current = 0;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      resetIdleTimer();
      if (e.key === 'Escape') {
        if (showHistory) {
          setShowHistory(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('mousemove', resetIdleTimer, { passive: true });
    window.addEventListener('mousedown', resetIdleTimer, { passive: true });
    window.addEventListener('touchstart', resetIdleTimer, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('scroll', resetIdleTimer, { passive: true });

    // Tick every second
    idleTimerRef.current = setInterval(() => {
      if (isLoading || input.trim().length > 0 || showHistory) {
        idleCountRef.current = 0;
        return;
      }

      idleCountRef.current += 1;
      if (idleCountRef.current >= 60) {
        onClose();
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('mousedown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', resetIdleTimer);
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [onClose, isLoading, input, showHistory]);

  // Sync active subject from props or custom events
  useEffect(() => {
    if (initialActiveSubject) {
      setCurrentSubject(initialActiveSubject);
    } else {
      setCurrentSubject(getActiveSubject());
    }

    const handleSubjectChange = (e: any) => {
      setCurrentSubject(e.detail || getActiveSubject());
    };

    window.addEventListener('kharandi_active_subject_changed', handleSubjectChange);
    return () => {
      window.removeEventListener('kharandi_active_subject_changed', handleSubjectChange);
    };
  }, [initialActiveSubject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartNewChat = () => {
    const newSession = createChatSession(
      'Nouvelle discussion',
      currentSubject?.title,
      userId
    );
    setCurrentSessionId(newSession.id);
    setActiveSessionId(newSession.id);
    setMessages([{ id: '1', role: 'model', content: WELCOME }]);
    setSessions(getStoredSessions(userId));
    setShowHistory(false);
    toast.success('Nouvelle discussion démarrée');
  };

  const handleSelectSession = (sess: ChatSession) => {
    setCurrentSessionId(sess.id);
    setActiveSessionId(sess.id);
    setMessages(sess.messages && sess.messages.length > 0 ? sess.messages : [{ id: '1', role: 'model', content: WELCOME }]);
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatSession(sessionId, userId);
    const updated = getStoredSessions(userId);
    setSessions(updated);
    if (currentSessionId === sessionId) {
      if (updated.length > 0) {
        handleSelectSession(updated[0]);
      } else {
        handleStartNewChat();
      }
    }
    toast.info('Discussion supprimée');
  };

  const handleClearAllSessions = () => {
    clearAllChatSessions(userId);
    setSessions([]);
    handleStartNewChat();
    toast.info('Historique des discussions effacé');
  };

  const callAIStream = async (userDisplayQuestion: string, fullPromptToSend: string, currentMessages: Message[]) => {
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId, role: 'model', content: '', streaming: true
    }]);

    try {
      const history = currentMessages
        .filter(m => m.id !== '1' && !m.streaming && m.id !== currentMessages[currentMessages.length - 1]?.id)
        .map(m => ({
          role:    m.role === 'model' ? 'assistant' : 'user',
          content: m.content,
        }));

      const token = localStorage.getItem('access_token');
      abortRef.current = new AbortController();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/ask/stream/`,
        {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body:   JSON.stringify({ 
            message: fullPromptToSend, 
            history 
          }),
          signal: abortRef.current.signal,
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader  = response.body!.getReader();
      const decoder = new TextDecoder();
      let   full    = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const parsed = JSON.parse(raw);
            const delta = parsed.text || parsed.chunk || '';
            const isDone = parsed.type === 'done' || parsed.done === true;

            if (delta) {
              full += delta;
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: full, streaming: true } : m
              ));
            }
            if (isDone) break;
          } catch { /* ignorer */ }
        }
      }

      setMessages(prev => prev.map(m =>
        m.id === aiMsgId ? { ...m, streaming: false } : m
      ));

    } catch (err: any) {
      if (err.name === 'AbortError') return;

      // Fallback non-streaming
      try {
        const { askAI } = await import('../../services/ai');
        const history = currentMessages
          .filter(m => m.id !== '1' && !m.streaming && m.id !== currentMessages[currentMessages.length - 1]?.id)
          .map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.content })) as any;
        const reply = await askAI(fullPromptToSend, history);
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: reply || "Désolé, je n'ai pas pu répondre.", streaming: false }
            : m
        ));
      } catch {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: "⚠️ Karamo est indisponible. Réessaie dans quelques secondes.", streaming: false }
            : m
        ));
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const text = (overrideInput || input).trim();
    if (!text || isLoading) return;

    if (isGuest) {
      const n = parseInt(localStorage.getItem('guest_ai_requests') || '0');
      if (n >= 3) { toast.error("Limite invité atteinte."); return; }
      localStorage.setItem('guest_ai_requests', String(n + 1));
    }

    // Prepare full enriched prompt with subject content for AI backend
    const fullPrompt = buildKaramoPrompt(text, currentSubject);

    // Clean user message for visual display in UI
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    await callAIStream(text, fullPrompt, updated);
  };

  useEffect(() => {
    if (!initialMessage || initialMessage === lastInitialMessageRef.current) return;
    lastInitialMessageRef.current = initialMessage;

    // Clean prompt timestamp if present
    const cleanPrompt = initialMessage.split('###')[0].trim();

    let displayQuestion = cleanPrompt;
    if (cleanPrompt.includes('[CONTEXTE SCOLAIRE') || cleanPrompt.includes('ÉPREUVE OFFICIELLE')) {
      displayQuestion = 'Peux-tu m\'expliquer ce sujet pas à pas ?';
    } else if (cleanPrompt.includes('3 questions d\'entraînement') || cleanPrompt.includes('Quiz')) {
      displayQuestion = 'Pose-moi des questions d\'entraînement sur ce sujet.';
    } else if (cleanPrompt.includes('indice') || cleanPrompt.includes('indices')) {
      displayQuestion = 'Donne-moi des indices pour résoudre cet exercice.';
    } else if (cleanPrompt.length > 120 && !cleanPrompt.startsWith('Bonjour')) {
      displayQuestion = 'Peux-tu m\'expliquer ce sujet pas à pas ?';
    }

    // Build the full prompt with active subject if available
    const fullPrompt = cleanPrompt.includes('CONTENU INTÉGRAL DU SUJET') 
      ? cleanPrompt 
      : buildKaramoPrompt(cleanPrompt, currentSubject);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayQuestion
    };

    // Create a new distinct session for this initial subject prompt
    const title = displayQuestion.length > 40 ? displayQuestion.slice(0, 40) + '…' : displayQuestion;
    const newSess = createChatSession(title, currentSubject?.title, userId);
    setCurrentSessionId(newSess.id);
    setActiveSessionId(newSess.id);

    const init: Message[] = [
      { id: '1', role: 'model', content: WELCOME },
      userMsg,
    ];
    setMessages(init);
    setTimeout(() => callAIStream(displayQuestion, fullPrompt, init), 250);
  }, [initialMessage]); // eslint-disable-line

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const isStreaming = messages.some(m => m.streaming);
  const activeSubjectTitle = currentSubject?.title || contextTitle;
  const activeSuggestions = currentSubject ? SUBJECT_SUGGESTIONS : DEFAULT_SUGGESTIONS;

  const chatContent = (
    <div 
      ref={containerRef}
      className="flex-1 bg-slate-50 flex flex-col font-body h-full w-full relative overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-200/80 shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo"
              alt="Prof. Karamo" 
              className="w-full h-full object-cover scale-110" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[14px] text-slate-900 leading-tight">Prof. Karamo</h2>
              <span className="bg-[#FAB304]/20 text-[#966b02] text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                Discussions sauvegardées
              </span>
            </div>
            <p className="text-[11px] text-[#18bfd6] font-bold flex items-center gap-1.5 truncate mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
              {isStreaming ? 'En train d\'expliquer...' : (activeSubjectTitle ? `Sujet : ${activeSubjectTitle}` : 'En ligne - Prêt à vous aider')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* New Chat Button */}
          <button
            onClick={handleStartNewChat}
            aria-label="Nouvelle discussion"
            title="Nouvelle discussion (+)"
            className="p-1.5 bg-slate-100 hover:bg-[#18bfd6]/15 hover:text-[#18bfd6] text-slate-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nouveau</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            aria-label="Historique des discussions"
            title="Consulter l'historique des discussions sauvegardées"
            className={`p-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
              showHistory 
                ? 'bg-[#163B45] text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <History size={15} />
            <span className="hidden sm:inline">Historique</span>
            {sessions.length > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${showHistory ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {sessions.length}
              </span>
            )}
          </button>

          {/* Close button */}
          {onClose && (
            <button 
              onClick={onClose}
              aria-label="Fermer Karamo"
              title="Fermer (ou appuyer sur Échap)"
              className="p-1.5 bg-slate-100 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer ml-1"
            >
              <X size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Active Subject Context Bar */}
      {currentSubject && (
        <div className="px-4 py-1.5 bg-gradient-to-r from-[#163B45]/5 via-[#18bfd6]/10 to-amber-500/10 border-b border-slate-200/80 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-lg bg-[#163B45] text-[#FAB304] flex items-center justify-center shrink-0">
              <BookOpen size={11} />
            </div>
            <div className="min-w-0 truncate">
              <span className="font-extrabold text-[#163B45] truncate block text-[11px] leading-tight">
                {currentSubject.title}
              </span>
              <span className="text-[9.5px] text-slate-500 font-semibold truncate block">
                {currentSubject.subject} · {currentSubject.year} · {currentSubject.level}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[8.5px] font-black uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Énoncé & Corrigé actifs
            </span>
          </div>
        </div>
      )}

      {/* MAIN BODY: History drawer or Chat messages */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* History Drawer Overlay */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="absolute inset-0 z-20 bg-white flex flex-col shadow-inner"
            >
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <h3 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#18bfd6]" />
                      Discussions enregistrées
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Toutes vos questions sont conservées sur votre appareil</p>
                  </div>
                </div>

                {sessions.length > 0 && (
                  <button
                    onClick={handleClearAllSessions}
                    title="Effacer tout l'historique"
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Tout effacer
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {sessions.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-extrabold text-xs text-slate-600">Aucune discussion enregistrée</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
                      Vos échanges avec Karamo seront automatiquement sauvegardés ici pour consultation future.
                    </p>
                    <button
                      onClick={handleStartNewChat}
                      className="mt-4 px-3 py-1.5 bg-[#163B45] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-[#163B45]/90 transition-colors"
                    >
                      Poser une question
                    </button>
                  </div>
                ) : (
                  sessions.map((sess) => {
                    const isCurrent = sess.id === currentSessionId;
                    const dateStr = new Date(sess.updatedAt || sess.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    const msgCount = sess.messages ? sess.messages.length : 0;

                    return (
                      <div
                        key={sess.id}
                        onClick={() => handleSelectSession(sess)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                          isCurrent 
                            ? 'bg-[#18bfd6]/10 border-[#18bfd6] shadow-xs' 
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-black text-xs text-slate-900 truncate">
                              {sess.title}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 bg-[#18bfd6] text-white rounded text-[8.5px] font-extrabold shrink-0">
                                Active
                              </span>
                            )}
                          </div>

                          {sess.subjectTitle && (
                            <p className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-0.5 inline-block mb-1 truncate max-w-full">
                              📖 {sess.subjectTitle}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                            <span>{dateStr}</span>
                            <span>•</span>
                            <span>{msgCount} message{msgCount > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="Supprimer cette discussion"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 mt-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 6 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2.5 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs overflow-hidden shrink-0 mt-1">
                      <img 
                        src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo"
                        alt="K" 
                        className="w-full h-full object-cover scale-110" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-[20px] shadow-xs text-[13px] leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-[#163B45] text-white rounded-tr-xs font-semibold'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'}`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:font-bold prose-strong:text-[#163B45]">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-[15px] font-black text-[#163B45] mb-2 mt-3" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-[14px] font-bold text-[#163B45] mt-3 mb-1.5 border-b border-slate-100 pb-1" {...props} />,
                            p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-2 text-[13px] font-medium" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 text-slate-700 space-y-1 marker:text-[#18bfd6] text-[13px] font-medium" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 text-slate-700 space-y-1 marker:text-[#FAB304] font-semibold text-[13px]" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-black text-[#163B45]" {...props} />,
                            a: ({node, ...props}) => <a className="text-[#18bfd6] font-bold hover:underline" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-[#FAB304] bg-[#FAB304]/10 p-2.5 rounded-lg text-slate-800 italic my-2 text-[13px]" {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                        {msg.streaming && (
                          <span className="inline-block w-1.5 h-3.5 bg-[#18bfd6] animate-pulse rounded ml-0.5 align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && !isStreaming && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs overflow-hidden shrink-0 animate-pulse">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo"
                      alt="K" 
                      className="w-full h-full object-cover scale-110" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-[20px] rounded-tl-xs shadow-xs flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin text-[#18bfd6]" />
                    <span className="text-[12px] text-slate-500 font-bold">Prof. Karamo analyse le sujet...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.length === 1 && !isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-1">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider px-1">Questions suggérées</p>
              {activeSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="w-full text-left p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#18bfd6] hover:bg-[#18bfd6]/5 text-xs text-slate-700 font-bold transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
                >
                  <span>{s}</span>
                  <HelpCircle size={14} className="text-slate-300 group-hover:text-[#18bfd6] shrink-0" />
                </button>
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="px-3 py-1.5 bg-slate-100/80 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto hide-scrollbar shrink-0">
        <button
          onClick={() => handleSend("Donne-moi un indice sans dévoiler toute la réponse.")}
          className="px-2.5 py-1 bg-white hover:bg-[#18bfd6]/10 hover:text-[#18bfd6] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors cursor-pointer"
        >
          💡 Indice
        </button>
        <button
          onClick={() => handleSend("Quelles sont les formules mathématiques ou scientifiques clés pour ce sujet ?")}
          className="px-2.5 py-1 bg-white hover:bg-[#18bfd6]/10 hover:text-[#18bfd6] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors cursor-pointer"
        >
          📐 Formules clés
        </button>
        <button
          onClick={() => handleSend("Explique l'exercice 2 en détail.")}
          className="px-2.5 py-1 bg-white hover:bg-[#18bfd6]/10 hover:text-[#18bfd6] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors cursor-pointer"
        >
          ✍️ Exercice 2
        </button>
        <button
          onClick={() => handleSend("Explique-moi l'étape suivante en détail.")}
          className="px-2.5 py-1 bg-white hover:bg-[#18bfd6]/10 hover:text-[#18bfd6] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors cursor-pointer"
        >
          ⏩ Étape suivante
        </button>
        <button
          onClick={() => handleSend("Pose-moi une question similaire pour vérifier si j'ai bien assimilé.")}
          className="px-2.5 py-1 bg-white hover:bg-[#FAB304]/20 hover:text-[#966b02] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors cursor-pointer"
        >
          ❓ Tester mes acquis
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-slate-50 rounded-[24px] border border-slate-200 focus-within:border-[#18bfd6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#18bfd6]/20 transition-all px-3.5 py-1.5"
        >
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={currentSubject ? `Posez votre question sur « ${currentSubject.title} »...` : "Posez votre question à Karamo..."}
            className="flex-1 bg-transparent text-[13px] focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium" 
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 bg-[#163B45] hover:bg-[#1A4B58] text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );

  if (inline) {
    return chatContent;
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop: click anywhere outside to close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
      />

      {/* Slide-over Drawer with auto-close when idle */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="relative w-full sm:w-[460px] md:w-[500px] h-full bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.25)] flex flex-col z-[101] border-l border-slate-200"
      >
        {chatContent}
      </motion.div>
    </div>
  );
};
