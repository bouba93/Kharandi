import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { api } from '../../config/api';

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
  inline?: boolean;
}

const WELCOME = "Bonjour ! Je suis **Professeur Karamo**, ton enseignant virtuel. Je connais l'intégralité du programme guinéen (BAC, BEPC, CEE). Pose-moi toutes tes questions ou demande-moi de t'expliquer un exercice !";

const SUGGESTIONS = [
  "Explique-moi la résolution de cet exercice",
  "Quelles sont les formules clés à retenir ?",
  "Donne-moi un indice pour commencer",
  "Pose-moi un mini-quiz sur cette notion",
];

export const AITeacherChat: React.FC<AITeacherChatProps> = ({ onClose, initialMessage, contextTitle, inline }) => {
  const { isGuest } = useAuth();

  const [messages,  setMessages]  = useState<Message[]>([
    { id: '1', role: 'model', content: WELCOME }
  ]);
  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef             = useRef<HTMLDivElement>(null);
  const lastInitialMessageRef      = useRef<string | null>(null);
  const abortRef                   = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callAIStream = async (userText: string, currentMessages: Message[]) => {
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId, role: 'model', content: '', streaming: true
    }]);

    try {
      const history = currentMessages
        .filter(m => m.id !== '1' && !m.streaming)
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
          body:   JSON.stringify({ message: userText, history }),
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
          .filter(m => m.id !== '1' && !m.streaming)
          .map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.content })) as any;
        const reply = await askAI(userText, history);
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

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    await callAIStream(text, updated);
  };

  useEffect(() => {
    if (!initialMessage || initialMessage === lastInitialMessageRef.current) return;
    lastInitialMessageRef.current = initialMessage;

    // Clean prompt timestamp if present
    const cleanPrompt = initialMessage.split('###')[0].trim();

    let displayQuestion = 'Peux-tu m\'expliquer ce sujet pas à pas ?';
    if (cleanPrompt.includes('3 questions d\'entraînement') || cleanPrompt.includes('Quiz')) {
      displayQuestion = 'Pose-moi des questions d\'entraînement sur ce sujet.';
    } else if (cleanPrompt.includes('indice') || cleanPrompt.includes('indices')) {
      displayQuestion = 'Donne-moi des indices pour résoudre cet exercice.';
    } else if (cleanPrompt.length < 90) {
      displayQuestion = cleanPrompt;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayQuestion
    };
    const init: Message[] = [
      { id: '1', role: 'model', content: WELCOME },
      userMsg,
    ];
    setMessages(init);
    setTimeout(() => callAIStream(cleanPrompt, init), 250);
  }, [initialMessage]); // eslint-disable-line

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const isStreaming = messages.some(m => m.streaming);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col font-body h-full w-full relative overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between bg-white border-b border-slate-200/80 shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo"
              alt="Prof. Karamo" 
              className="w-full h-full object-cover scale-110" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-[15px] text-slate-900 leading-tight">Prof. Karamo</h2>
              <span className="bg-[#FAB304]/20 text-[#966b02] text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                IA Pédagogique
              </span>
            </div>
            <p className="text-[11px] text-[#18bfd6] font-bold flex items-center gap-1.5 truncate mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
              {isStreaming ? 'En train d\'expliquer...' : (contextTitle ? `Sujet : ${contextTitle}` : 'En ligne - Prêt à vous aider')}
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            aria-label="Fermer Karamo"
            className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        )}
      </div>

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
                  <span className="text-[12px] text-slate-500 font-bold">Prof. Karamo prépare l'explication...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length === 1 && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-1">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider px-1">Questions suggérées</p>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="w-full flex items-center gap-2.5 p-2.5 bg-white border border-slate-200/80 rounded-2xl text-[12px] font-bold text-slate-700 hover:border-[#18bfd6]/50 hover:bg-[#18bfd6]/5 transition-all shadow-xs text-left cursor-pointer"
              >
                <HelpCircle size={14} className="text-[#18bfd6] shrink-0" />
                <span className="truncate">{s}</span>
              </button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Suggested Quick Action Chips when chatting */}
      {messages.length > 1 && !isLoading && (
        <div className="px-3 py-1.5 bg-slate-100/80 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto hide-scrollbar shrink-0">
          <button
            onClick={() => handleSend("Donne-moi un indice sans dévoiler toute la réponse.")}
            className="px-2.5 py-1 bg-white hover:bg-[#18bfd6]/10 hover:text-[#18bfd6] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors"
          >
            💡 Indice
          </button>
          <button
            onClick={() => handleSend("Quelles sont les formules mathématiques ou scientifiques clés pour ce problème ?")}
            className="px-2.5 py-1 bg-white hover:bg-[#18bfd6]/10 hover:text-[#18bfd6] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors"
          >
            📐 Formules clés
          </button>
          <button
            onClick={() => handleSend("Explique-moi l'étape suivante en détail.")}
            className="px-2.5 py-1 bg-white hover:bg-[#18bfd6]/10 hover:text-[#18bfd6] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors"
          >
            ⏩ Étape suivante
          </button>
          <button
            onClick={() => handleSend("Pose-moi une question similaire pour vérifier si j'ai bien assimilé.")}
            className="px-2.5 py-1 bg-white hover:bg-[#FAB304]/20 hover:text-[#966b02] text-slate-600 rounded-lg text-[11px] font-bold border border-slate-200/80 shrink-0 transition-colors"
          >
            ❓ Tester mes acquis
          </button>
        </div>
      )}

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
            placeholder="Posez votre question à Karamo..."
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
};
