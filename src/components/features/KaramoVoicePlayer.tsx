import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Sparkles, Bot, FastForward, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KharandiIcon } from '../icons/KharandiIcon';

interface KaramoVoicePlayerProps {
  textToRead: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const KaramoVoicePlayer: React.FC<KaramoVoicePlayerProps> = ({
  textToRead,
  title = "Explication Vocale de Prof. Karamo",
  subtitle = "Écoutez la résolution pas à pas et la stratégie de l'épreuve",
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean text from markdown formatting, LaTeX & hashtags before speech for a natural teacher voice
  const cleanTextForSpeech = (rawText: string) => {
    if (!rawText) return "";

    let speech = rawText;

    // Use Karamo without accent for smooth pronunciation
    speech = speech.replace(/Karamö/g, 'Karamo');

    // 1. Remove all hashtag symbols (#) completely to prevent TTS from reading "dièse" or "thièse"
    speech = speech.replace(/#+/g, ' ');

    // 2. Math LaTeX replacement into smooth spoken French
    speech = speech
      // Fractions \frac{a}{b} -> a divisé par b
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 sur $2')
      .replace(/\\sqrt\{([^}]+)\}/g, 'racine de $1')
      // Powers
      .replace(/\^{2}|\^2/g, ' au carré')
      .replace(/\^{3}|\^3/g, ' au cube')
      .replace(/\^\{([^}]+)\}|\^([0-9a-zA-Z])/g, ' puissance $1$2')
      // Operations & LaTeX functions
      .replace(/\\times|\\cdot/g, ' fois ')
      .replace(/\\div/g, ' divisé par ')
      .replace(/\\pm/g, ' plus ou moins ')
      .replace(/\\neq/g, ' différent de ')
      .replace(/\\leq/g, ' inférieur à ')
      .replace(/\\geq/g, ' supérieur à ')
      .replace(/\\in/g, ' dans ')
      .replace(/\\infty/g, ' l\'infini ')
      .replace(/\\rightarrow|\\Rightarrow/g, ' ce qui donne ')
      .replace(/\\alpha/g, ' alpha ')
      .replace(/\\beta/g, ' bêta ')
      .replace(/\\pi/g, ' pi ')
      .replace(/\\Delta/g, ' delta ')
      .replace(/\\lim_\{([^}]+)\}/g, ' limite quand $1 ')
      .replace(/\\int/g, ' intégrale ')
      .replace(/\\sum/g, ' somme ');

    // 3. Remove all backslashes and remaining LaTeX blocks
    speech = speech
      .replace(/\\[a-zA-Z]+/g, ' ')
      .replace(/[{}]/g, ' ');

    // 4. Remove Markdown syntax completely
    speech = speech
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\$/g, '');

    // 5. Replace repeated math operators or symbols that cause "fois fois" or punctuation noise
    speech = speech
      .replace(/(\s*fois\s*)+/gi, ' fois ')
      .replace(/(\s*plus\s*)+/gi, ' plus ')
      .replace(/(\s*moins\s*)+/gi, ' moins ')
      .replace(/(\s*égale\s*)+/gi, ' égale ')
      .replace(/(\s*divisé par\s*)+/gi, ' divisé par ');

    // 6. Clean bullets, numbers, hyphens, underscores, slashes, bars, etc.
    speech = speech
      .replace(/^\s*[-*+•]\s+/gm, ' ')
      .replace(/^\s*\d+[\.\)]\s+/gm, ' ')
      .replace(/[-_~|\\\/]/g, ' ')
      .replace(/[*#@&+=]/g, ' ');

    // 7. Normalize whitespace and punctuation for natural pauses
    speech = speech
      .replace(/[\r\n]+/g, '. ')
      .replace(/\s+/g, ' ')
      .replace(/\.\s*\./g, '.')
      .replace(/,\s*,/g, ',')
      .trim();

    // Make an engaging, natural pedagogical summary
    const shortExcerpt = speech.length > 700 ? speech.slice(0, 700) + '.' : speech;

    return `Bonjour chers élèves ! C'est votre professeur Karamo. Je vais vous lire et vous expliquer les points essentiels de ce sujet : ${shortExcerpt} Prenez bien le temps de travailler chaque exercice !`;
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Prefer French male or French natural voice
      const frVoice = availableVoices.find(
        v => v.lang.startsWith('fr') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Thomas') || v.name.includes('Paul') || v.name.includes('Bernard'))
      ) || availableVoices.find(v => v.lang.startsWith('fr')) || availableVoices[0];
      
      if (frVoice) setSelectedVoice(frVoice);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any previous speech

    const textToSay = cleanTextForSpeech(textToRead);

    const utterance = new SpeechSynthesisUtterance(textToSay);
    utterance.lang = 'fr-FR';
    utterance.rate = rate;
    utterance.pitch = 0.98; // Slightly deeper, pedagogical tone

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const changeRate = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!hasSpeechSupport) {
    return null;
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-[#163B45] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md">
        <KharandiIcon name="karamo_assistant" size={20} showBackground={false} showBookmark={false} primaryColor="#FAB304" />
        {!isPlaying ? (
          <button onClick={handlePlay} className="flex items-center gap-1.5 text-[#FAB304] hover:underline">
            <Play size={14} fill="#FAB304" /> Écouter Karamo 🎧
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handlePause} className="text-white hover:text-[#FAB304]">
              <Pause size={14} />
            </button>
            <button onClick={handleStop} className="text-red-400 hover:text-red-300">
              <Square size={12} fill="currentColor" />
            </button>
            <span className="w-2 h-2 rounded-full bg-[#1BB4D3] animate-ping" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#163B45] via-[#1A4B58] to-[#1BB4D3] text-white rounded-2xl p-3.5 sm:p-4 shadow-md border border-white/10 relative overflow-hidden my-4">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#FAB304]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
        
        {/* Left Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FAB304] text-[#163B45] flex items-center justify-center font-black shrink-0 shadow-md">
            <KharandiIcon name="karamo_assistant" size={24} showBackground={false} showBookmark={false} primaryColor="#163B45" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[200px] sm:max-w-xs">{title}</h4>
              <span className="bg-[#FAB304] text-[#163B45] text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Voix-Off Karamo
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/80 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
          
          {/* Animated Equalizer Waves */}
          {isPlaying && (
            <div className="flex items-center gap-1 px-2 py-1 bg-black/20 rounded-xl shrink-0">
              <span className="w-1 h-3 bg-[#FAB304] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-[#1BB4D3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2.5 bg-[#FAB304] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-3.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
            </div>
          )}

          {/* Speed Selector */}
          <div className="flex items-center bg-black/25 p-1 rounded-xl border border-white/10 shrink-0">
            <span className="text-[10px] text-white/60 font-bold px-1 hidden sm:inline">Vitesse:</span>
            {[0.9, 1.0, 1.25].map((r) => (
              <button
                key={r}
                onClick={() => changeRate(r)}
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-black rounded-lg transition-all ${
                  rate === r ? 'bg-[#FAB304] text-[#163B45] shadow-sm' : 'text-white/70 hover:text-white'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>

          {/* Play/Pause Button */}
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-3.5 py-2 bg-[#FAB304] hover:bg-[#e0a003] active:scale-95 text-[#163B45] rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 whitespace-nowrap"
            >
              <Play size={14} fill="#163B45" />
              <span>{isPaused ? 'Reprendre' : 'Écouter'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePause}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <Pause size={13} /> Pause
              </button>
              <button
                onClick={handleStop}
                className="p-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl transition-all"
                title="Stopper la voix"
              >
                <Square size={12} fill="currentColor" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
