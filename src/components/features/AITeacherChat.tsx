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
  inline?: boolean;
}

const WELCOME = "Bonjour ! Je suis **Karamo**, ton prof virtuel. Je connais tout le programme guinéen. Pose-moi tes questions !";

const SUGGESTIONS = [
  "Explique-moi la dérivée",
  "Aide-moi à réviser le BAC",
  "C'est quoi la photosynthèse ?",
  "Comment résoudre une équation du 2nd degré ?",
];

export const AITeacherChat: React.FC<AITeacherChatProps> = ({ onClose, initialMessage, inline }) => {
  const { isGuest } = useAuth();

  const [messages,  setMessages]  = useState<Message[]>([
    { id: '1', role: 'model', content: WELCOME }
  ]);
  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef             = useRef<HTMLDivElement>(null);
  const initialSent                = useRef(false);
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

            // Backend envoie : {"type":"token","text":"..."} ou {"type":"done"}
            // Ancienne version : {"chunk":"...","done":false}
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
    if (!initialMessage || initialSent.current) return;
    initialSent.current = true;

    const prompt =
      `Tu es Karamo. Un élève vient d'ouvrir ce sujet BAC.\n\n${initialMessage}\n\n` +
      `Présente brièvement le sujet puis pose une question pour évaluer ses connaissances. Méthode socratique.`;

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user',
      content: 'Explique-moi ce sujet et guide-moi.'
    };
    const init: Message[] = [
      { id: '1', role: 'model', content: WELCOME }, userMsg,
    ];
    setMessages(init);
    setTimeout(() => callAIStream(prompt, init), 300);
  }, [initialMessage]); // eslint-disable-line

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const isStreaming = messages.some(m => m.streaming);

  return (
    <motion.div
      initial={inline ? undefined : { opacity: 0, scale: 0.98, y: 20 }}
      animate={inline ? undefined : { opacity: 1, scale: 1, y: 0 }}
      exit={inline   ? undefined : { opacity: 0, scale: 0.98, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={inline
        ? "flex-1 bg-slate-50 flex flex-col font-body h-full relative overflow-hidden"
        : "fixed inset-0 md:inset-auto md:bottom-24 md:right-8 md:w-[400px] md:h-[600px] bg-slate-50 md:rounded-[36px] z-[100] flex flex-col font-body md:shadow-2xl md:border border-slate-200/50 overflow-hidden"
      }
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden shrink-0">
            <img src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo"
              alt="Karamö" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h2 className="font-extrabold text-[16px] text-slate-900 leading-tight">Karamo</h2>
            <p className="text-[12px] text-primary font-bold flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-amber-400 animate-pulse' : 'bg-primary animate-pulse'}`} />
              {isStreaming ? 'En train d\'écrire...' : 'En ligne'}
            </p>
          </div>
        </div>
        {onClose && (
          <motion.button whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 bg-slate-100/60 rounded-full hover:bg-slate-200 transition-colors">
            <X size={18} className="text-slate-500" />
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 font-bold">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-100 shadow-sm overflow-hidden shrink-0 mt-1">
                    <img src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo"
                      alt="K" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className={`px-4 py-3 rounded-[22px] shadow-sm text-[14px] leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-sm font-semibold'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}`}>
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:font-bold prose-strong:text-primary">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-base font-black text-primary mb-2 mt-3" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-sm font-bold text-primary mt-3 mb-1.5 border-b border-primary/10 pb-1.5" {...props} />,
                          p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-2 text-[13px] font-semibold" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 text-slate-700 space-y-1 marker:text-secondary text-[13px] font-semibold" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 text-slate-700 space-y-1 marker:text-secondary font-bold text-[13px]" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-extrabold text-primary" {...props} />,
                          a: ({node, ...props}) => <a className="text-secondary font-bold hover:underline" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-secondary bg-secondary/5 p-2 rounded-lg text-slate-700 italic my-2 text-[13px]" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      {msg.streaming && (
                        <span className="inline-block w-1.5 h-4 bg-primary animate-pulse rounded ml-0.5" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && !isStreaming && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex justify-start">
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-100 shadow-sm overflow-hidden shrink-0 animate-pulse">
                  <img src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo"
                    alt="K" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                </div>
                <div className="px-4 py-3 bg-white border border-slate-100 rounded-[22px] rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-[13px] text-slate-400 font-bold">Karamo réfléchit...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length === 1 && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-2 pt-2">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider px-1">Essaie de demander</p>
            {SUGGESTIONS.map((s, i) => (
              <motion.button key={i} whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(s)}
                className="w-full flex items-center gap-2.5 p-3 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-700 hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm text-left">
                <HelpCircle size={14} className="text-primary shrink-0 animate-pulse" />
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input */}
      <div className="p-3 bg-white/90 backdrop-blur-xl border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 rounded-[28px] border border-slate-200 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all px-4 py-2">
          <input type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Pose ta question..."
            className="flex-1 bg-transparent text-[14px] focus:outline-none text-slate-900 placeholder:text-slate-400 font-bold" />
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-sm">
            <Send size={16} className="ml-0.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
