import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { Phone, Lock, Eye, EyeOff, AlertCircle, Loader2, Backpack, Pencil, PenTool, Ruler, GraduationCap, BookOpen, CheckCircle2, ArrowLeft, MessageCircle, Mail, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

const ADMIN_PHONE = '+224627382173';

type Step = 'phone' | 'otp' | 'password' | 'new_password' | 'reset_otp' | 'reset_new';
type Mode = 'login' | 'register';

export const Login: React.FC = () => {
  const { setGuestMode, setDemoMode } = useAuth();
  const [mode,        setMode]        = useState<Mode>('login');
  const [step,        setStep]        = useState<Step>('phone');
  const [phone,       setPhone]       = useState('');
  const [otpCode,     setOtpCode]     = useState('');
  const [password,    setPassword]    = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string|null>(null);
  const [bannerIdx,   setBannerIdx]   = useState(0);
  const [hasAccount,  setHasAccount]  = useState<boolean|null>(null);

  const banners = [
    "https://lh3.googleusercontent.com/d/1IUjSHliHKUAS9Thn4jtRV_pUwgARgkz3",
    "https://lh3.googleusercontent.com/d/1SnhypXjYCJVOPnEtfvG9LKgJPWcjyudj"
  ];

  React.useEffect(() => {
    const t = setInterval(() => setBannerIdx(p => p === 0 ? 1 : 0), 6000);
    return () => clearInterval(t);
  }, []);

  const fmt = () => {
    const c = phone.replace(/\D/g, '');
    return c.startsWith('224') ? `+${c}` : `+224${c}`;
  };

  const _save = (data: any) => {
    const d = data?.data || data;
    if (d?.tokens?.access)  localStorage.setItem('access_token',  d.tokens.access);
    if (d?.tokens?.refresh) localStorage.setItem('refresh_token', d.tokens.refresh);
    if (d?.device_token)    localStorage.setItem('kharandi_device_token', d.device_token);
    window.dispatchEvent(new CustomEvent('auth:reload-profile'));
  };

  const _go = () => { window.location.href = '/'; };

  const handleDemoLogin = (selectedRole: string = 'admin') => {
    setDemoMode(selectedRole);
    toast.success(`Connexion au Compte Démo réussie ! Accès complet activé.`);
    window.location.href = '/';
  };

  const sendOTP = async (p: string) => {
    await api.post('/auth/otp/send/', { phone: p });
  };

  // ── Étape 1 : numéro ──────────────────────────────────────────────────────
  const handlePhone = async () => {
    const p = fmt();
    setLoading(true); setError(null);
    try {
      if (mode === 'login') {
        // Essayer connexion par device_token d'abord
        const { data } = await api.post('/auth/login/', { phone: p });
        if (data?.data?.tokens) { _save(data); _go(); return; }
        if (data?.data?.otp_sent) {
          // Ancien compte sans mot de passe → OTP
          setStep('otp'); toast.info(`Code envoyé au ${p}`); return;
        }
        // A un compte → demander mot de passe
        setHasAccount(true);
        setStep('password');
      } else {
        // Inscription → vérifier que le compte n'existe pas
        try {
          const { data } = await api.post('/auth/login/', { phone: p });
          if (data?.data?.tokens || data?.data?.otp_sent) {
            setError("Ce numéro est déjà inscrit. Connectez-vous à la place.");
            setMode('login'); return;
          }
        } catch {}
        // Envoyer OTP d'inscription
        await sendOTP(p);
        setStep('otp'); toast.info(`Code envoyé au ${p}`);
      }
    } catch (err: any) {
      const code = err.response?.data?.code;
      if (code === 'device_blocked') {
        localStorage.removeItem('kharandi_device_token');
        await sendOTP(p);
        setStep('otp'); toast.info("Vérification requise");
        setError(null); return;
      }
      if (err.response?.status === 404 && mode === 'login') {
        setError("Aucun compte avec ce numéro. Créez un compte d'abord.");
      } else {
        setError(err.response?.data?.message || 'Erreur. Réessayez.');
      }
    } finally { setLoading(false); }
  };

  // ── Connexion par mot de passe ─────────────────────────────────────────────
  const handlePassword = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/login/password/', { phone: fmt(), password });
      _save(data); toast.success('Connexion réussie !'); _go();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mot de passe incorrect.');
    } finally { setLoading(false); }
  };

  // ── Vérification OTP ──────────────────────────────────────────────────────
  const handleOTP = async () => {
    setLoading(true); setError(null);
    const p = fmt();
    try {
      if (mode === 'login') {
        const { data } = await api.post('/auth/login/verify/', { phone: p, code: otpCode });
        _save(data); toast.success('Connexion réussie !'); _go();
      } else {
        // Inscription → aller vers création mot de passe
        setStep('new_password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code incorrect ou expiré.');
    } finally { setLoading(false); }
  };

  // ── Inscription : créer le mot de passe ───────────────────────────────────
  const handleNewPassword = async () => {
    if (newPassword.length < 6) {
      setError("Minimum 6 caractères."); return;
    }
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/register/', {
        phone: fmt(), code: otpCode, password: newPassword,
      });
      _save(data);
      toast.success('Compte créé ! Bienvenue sur Kharandi 🎉');
      _go();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur. Réessayez.');
    } finally { setLoading(false); }
  };

  // ── Reset mot de passe ────────────────────────────────────────────────────
  const handleResetRequest = async () => {
    setLoading(true); setError(null);
    try {
      await api.post('/auth/password/reset/request/', { phone: fmt() });
      setStep('reset_otp'); toast.info(`Code envoyé au ${fmt()}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur. Réessayez.');
    } finally { setLoading(false); }
  };

  const handleResetConfirm = async () => {
    if (newPassword.length < 6) { setError("Minimum 6 caractères."); return; }
    setLoading(true); setError(null);
    try {
      const { data } = await api.post('/auth/password/reset/confirm/', {
        phone: fmt(), code: otpCode, new_password: newPassword,
      });
      _save(data);
      toast.success('Mot de passe mis à jour !');
      _go();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code incorrect ou expiré.');
    } finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'phone')        handlePhone();
    else if (step === 'password')    handlePassword();
    else if (step === 'otp')         handleOTP();
    else if (step === 'new_password')handleNewPassword();
    else if (step === 'reset_otp')   step === 'reset_otp' && otpCode ? setStep('reset_new') : null;
    else if (step === 'reset_new')   handleResetConfirm();
  };

  const reset = (m: Mode) => {
    setMode(m); setStep('phone'); setError(null);
    setOtpCode(''); setPassword(''); setNewPassword('');
    setHasAccount(null);
  };

  const FloatingIcon = ({ icon: Icon, color, delay, top, left, rotate }: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }}
      transition={{ repeat: Infinity, duration: 4, delay }}
      className="absolute pointer-events-none hidden lg:block"
      style={{ top, left, color, transform: `rotate(${rotate}deg)` }}>
      <Icon size={40} strokeWidth={1} />
    </motion.div>
  );

  const stepTitle: Record<Step, string> = {
    phone:        mode === 'login' ? 'Ravi de vous revoir !' : 'Créer votre compte',
    password:     'Entrez votre mot de passe',
    otp:          mode === 'login' ? 'Vérification' : 'Confirmez votre numéro',
    new_password: 'Choisissez un mot de passe',
    reset_otp:    'Code de réinitialisation',
    reset_new:    'Nouveau mot de passe',
  };

  const stepSub: Record<Step, string> = {
    phone:        mode === 'login' ? 'Entrez votre numéro' : 'Quelques secondes suffisent',
    password:     fmt(),
    otp:          `Code envoyé au ${fmt()}`,
    new_password: 'Il sera sauvegardé sur cet appareil',
    reset_otp:    `Code envoyé au ${fmt()}`,
    reset_new:    'Choisissez un nouveau mot de passe sécurisé',
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Floating background orbs for depth */}
      <div className="absolute top-0 right-0 w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[#18bfd6]/10 via-[#18bfd6]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35%] h-[35%] rounded-full bg-gradient-to-tr from-[#fcb303]/10 via-[#fcb303]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Background Micro Floating Icons for modern playful learning vibe - STRICTLY Kharandi colors */}
      <FloatingIcon icon={Backpack}      color="#18bfd6" delay={0}   top="10%" left="5%"  rotate={15}  />
      <FloatingIcon icon={Pencil}        color="#fcb303" delay={1}   top="85%" left="4%"  rotate={-20} />
      <FloatingIcon icon={PenTool}       color="#18bfd6" delay={2}   top="15%" left="45%" rotate={10}  />
      <FloatingIcon icon={Ruler}         color="#fcb303" delay={0.5} top="75%" left="42%" rotate={25}  />
      <FloatingIcon icon={GraduationCap} color="#18bfd6" delay={1.5} top="5%"  left="40%" rotate={-10} />
      <FloatingIcon icon={BookOpen}      color="#fcb303" delay={2.5} top="45%" left="48%" rotate={15}  />

      {/* Panneau gauche - Premium Brand Presentation in soft light brand color palette */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#18bfd6]/5 via-[#18bfd6]/15 to-[#fcb303]/10 border-r border-[#18bfd6]/10 text-slate-900 select-none">
        {/* Subtle geometric learning lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#18bfd6]/20 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#fcb303]/20 blur-[90px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#18bfd6]/30 shadow-xs">
            <img src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" alt="Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-slate-900 via-[#18bfd6] to-[#fcb303] bg-clip-text text-transparent tracking-tight">KHARANDI</span>
        </div>

        {/* Middle Content / Image slides / Slogans */}
        <div className="relative z-10 my-auto max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-slate-900">
              L'excellence scolaire à portée de <span className="bg-gradient-to-r from-[#18bfd6] to-[#fcb303] bg-clip-text text-transparent">main</span>.
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed font-semibold">
              La première solution guinéenne pensée pour les établissements scolaires, les parents d'élèves soucieux et les esprits curieux.
            </p>
          </div>

          {/* Premium Glass Card Carousel Showcase */}
          <div className="relative h-[260px] xl:h-[300px] rounded-3xl border border-[#18bfd6]/20 bg-white/80 p-2 backdrop-blur-md overflow-hidden shadow-xl flex flex-col justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent z-10 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={bannerIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-slate-50/60"
              >
                <img 
                  src={banners[bannerIdx]} 
                  alt="Promotionnel" 
                  className="w-full h-full object-contain p-1" 
                  referrerPolicy="no-referrer" 
                />
              </motion.div>
            </AnimatePresence>

            {/* Dynamic Dots Indicator */}
            <div className="absolute bottom-4 left-6 z-20 flex gap-1.5">
              {banners.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${bannerIdx === i ? 'w-5 bg-[#18bfd6]' : 'w-1.5 bg-slate-300/80'}`} 
                />
              ))}
            </div>
          </div>

          {/* Key pillars Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/85 border border-[#18bfd6]/10 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#18bfd6]/10 flex items-center justify-center text-[#18bfd6] shrink-0">
                <GraduationCap size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Espace École</h4>
                <p className="text-[10px] text-slate-500 font-bold">Bulletins & Direct</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/85 border border-[#fcb303]/10 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#fcb303]/10 flex items-center justify-center text-[#fcb303] shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Soutien & Examens</h4>
                <p className="text-[10px] text-slate-500 font-bold">Exercices & Guides</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 border-t border-[#18bfd6]/15 pt-5 mt-auto">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Contact & Assistance Kharandi</p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-slate-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-slate-800 font-bold bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/50 shadow-2xs">
                <Phone size={13} className="text-[#18bfd6]" /> +224 626 18 71 17
              </span>
              <a href="mailto:contact@kharandi.gn" className="flex items-center gap-1.5 hover:text-[#18bfd6] transition-colors bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/50 shadow-2xs">
                <Mail size={13} className="text-[#fcb303]" /> contact@kharandi.gn
              </a>
            </div>
            <div className="flex flex-col sm:items-end text-[11px] text-slate-400">
              <a href="https://kharandi.gn" target="_blank" rel="noreferrer" className="hover:text-[#18bfd6] transition-colors font-extrabold text-[#18bfd6] flex items-center gap-1 mb-0.5">
                www.kharandi.gn <ExternalLink size={11} />
              </a>
              <span>© 2026 Kharandi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire - Right Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto min-h-screen">
        
        {/* Floating Back Button to home */}
        <button 
          onClick={() => { window.location.href = '/'; }}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 shadow-xs hover:shadow-md transition-all group z-50 cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#18bfd6]" />
          Retour à l'accueil
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 border border-slate-100 p-8 sm:p-10 rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-md text-center max-w-md w-full relative z-10 my-auto"
        >
          {/* Logo container with brand styling */}
          <div className="w-20 h-20 bg-gradient-to-tr from-[#18bfd6]/10 to-[#fcb303]/10 rounded-[24px] flex items-center justify-center mx-auto mb-4 overflow-hidden border border-white shadow-xs">
            <img src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55"
              alt="Kharandi" className="w-14 h-14 object-contain" referrerPolicy="no-referrer" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-4 bg-[#18bfd6]/25" />
            <p className="text-[#18bfd6] font-black text-[9px] tracking-[0.25em] uppercase">Plateforme Kharandi</p>
            <div className="h-px w-4 bg-[#18bfd6]/25" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">{stepTitle[step]}</h2>
          <p className="text-slate-500 font-medium text-xs mb-6 px-4">{stepSub[step]}</p>

          {/* Toggle Tab - only on phone step */}
          {step === 'phone' && (
            <div className="flex bg-slate-50 p-1.5 rounded-[20px] mb-6 border border-slate-200/50">
              {(['login', 'register'] as Mode[]).map(m => (
                <button 
                  key={m} 
                  type="button" 
                  onClick={() => reset(m)}
                  className={`flex-1 py-3 text-xs font-black rounded-[14px] uppercase tracking-wider transition-all cursor-pointer
                    ${mode === m 
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-100' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {m === 'login' ? 'Connexion' : 'Inscription'}
                </button>
              ))}
            </div>
          )}

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl mb-5 flex items-start gap-2.5 text-xs font-bold text-left border border-red-100"
              >
                <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Actions */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">

            {/* Step : Get Phone */}
            {step === 'phone' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    required 
                    placeholder="Numéro de téléphone (+224...)"
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-4 pl-12 rounded-[20px] bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#18bfd6] focus:ring-4 focus:ring-[#18bfd6]/10 outline-none transition-all shadow-xs block text-sm font-medium" 
                  />
                </div>
              </motion.div>
            )}

            {/* Step : Password login */}
            {step === 'password' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPwd ? 'text' : 'password'} 
                    required 
                    autoFocus 
                    placeholder="Saisissez votre mot de passe"
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 pr-12 rounded-[20px] bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#18bfd6] focus:ring-4 focus:ring-[#18bfd6]/10 outline-none transition-all shadow-xs block text-sm font-medium" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none z-10 cursor-pointer"
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <div className="flex justify-between items-center px-1">
                  <button 
                    type="button" 
                    onClick={() => { setStep('phone'); }}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-[#18bfd6] transition-colors"
                  >
                    ← Modifier numéro
                  </button>
                  <button 
                    type="button" 
                    onClick={handleResetRequest}
                    className="text-[10px] font-black uppercase text-[#18bfd6] hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step : Code Verification (OTP) */}
            {(step === 'otp' || step === 'reset_otp') && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-2 text-center">
                <div className="w-14 h-14 bg-[#18bfd6]/10 text-[#18bfd6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone size={24} />
                </div>
                <input 
                  required 
                  autoFocus 
                  maxLength={6} 
                  placeholder="------"
                  value={otpCode} 
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full max-w-[180px] bg-slate-50 border-2 border-[#18bfd6]/20 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.4em] focus:outline-none focus:border-[#18bfd6] mx-auto block" 
                />
                <button 
                  type="button" 
                  onClick={() => { setStep('phone'); setOtpCode(''); }}
                  className="block mx-auto mt-4 text-[11px] font-bold text-slate-400 hover:text-[#18bfd6] transition-colors cursor-pointer"
                >
                  ← Modifier le numéro de téléphone
                </button>
              </motion.div>
            )}

            {/* Step : New Password / Reset Confirm */}
            {(step === 'new_password' || step === 'reset_new') && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="bg-[#18bfd6]/5 border border-[#18bfd6]/10 rounded-2xl p-4 text-left">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    🔒 <strong>Sécurité locale :</strong> Ce mot de passe sera mémorisé sur votre appareil pour vous éviter de futurs codes SMS.
                  </p>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPwd ? 'text' : 'password'} 
                    required 
                    autoFocus
                    placeholder="Nouveau mot de passe (6+ caractères)"
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full p-4 pl-12 pr-12 rounded-[20px] bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#18bfd6] focus:ring-4 focus:ring-[#18bfd6]/10 outline-none transition-all shadow-xs block text-sm font-medium" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicators */}
                <div className="flex gap-1.5 px-0.5">
                  {[1,2,3,4].map(i => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        newPassword.length >= i*3 ? 'bg-[#18bfd6]' : 'bg-slate-100'
                      }`} 
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Validation Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-[20px] font-extrabold uppercase tracking-wider text-xs justify-center gap-2 bg-[#18bfd6] hover:bg-[#18bfd6]/95 text-white active:scale-95 transition-all cursor-pointer shadow-sm mt-2 shrink-0 min-h-[54px]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                step === 'phone'        ? 'Continuer' :
                step === 'password'     ? 'Se connecter' :
                step === 'otp'          ? (mode === 'login' ? 'Confirmer' : 'Suivant') :
                step === 'new_password' ? 'Créer mon compte' :
                step === 'reset_otp'    ? 'Suivant' :
                'Mettre à jour mon mot de passe'
              )}
            </Button>
          </form>

          {/* Slogan footnote */}
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-4">
            {step === 'phone' && mode === 'login'
              ? "Reconnaissance de l'appareil instantanée. Connexion sans SMS si mémorisé."
              : step === 'new_password'
              ? "Votre mot de passe est crypté et sécurisé en local."
              : step === 'phone' && mode === 'register'
              ? "Nous vous enverrons un code SMS gratuit pour prouver la propriété de votre numéro."
              : ""}
          </p>

          {/* Mode Compte Démo - Accès Immédiat et Complet */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-left">
            <div className="bg-gradient-to-br from-[#18bfd6]/10 via-[#18bfd6]/5 to-[#fcb303]/10 border border-[#18bfd6]/20 rounded-2xl p-4 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#18bfd6]/15 text-[#18bfd6] rounded-lg flex items-center justify-center shrink-0 font-bold">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Mode Compte Démo</h4>
                    <p className="text-[10px] font-bold text-slate-500">Accès immédiat à toutes les fonctionnalités</p>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider bg-[#18bfd6] text-white px-2 py-0.5 rounded-full shadow-2xs shrink-0">
                  Accès Total
                </span>
              </div>

              <p className="text-[11px] text-slate-600 font-medium mb-3 leading-relaxed">
                Explorez l'intégralité de la plateforme Kharandi (Scolaire, Exo Gagnant, Répétiteurs, Calcul mental, Wallet, Marketplace) sans code SMS.
              </p>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#18bfd6] to-[#fcb303] hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={15} />
                Se connecter au Compte Démo (Accès Complet)
              </button>

              <div className="mt-3 pt-2.5 border-t border-slate-200/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                  Tester un rôle spécifique :
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('student')}
                    className="py-1.5 px-2 bg-white/90 hover:bg-white text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 text-center transition-all cursor-pointer hover:border-[#18bfd6] hover:text-[#18bfd6]"
                  >
                    🎓 Élève VIP
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('teacher')}
                    className="py-1.5 px-2 bg-white/90 hover:bg-white text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 text-center transition-all cursor-pointer hover:border-[#18bfd6] hover:text-[#18bfd6]"
                  >
                    👨‍🏫 Enseignant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('parent')}
                    className="py-1.5 px-2 bg-white/90 hover:bg-white text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 text-center transition-all cursor-pointer hover:border-[#18bfd6] hover:text-[#18bfd6]"
                  >
                    👨‍👩‍👧 Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('ecole')}
                    className="py-1.5 px-2 bg-white/90 hover:bg-white text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 text-center transition-all cursor-pointer hover:border-[#18bfd6] hover:text-[#18bfd6]"
                  >
                    🏫 Établissement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Support contacts */}
        <p className="mt-8 text-xs text-slate-400 text-center font-bold">
          Besoin d'aide ? Contactez le support Kharandi au <span className="text-[#18bfd6]">+224 626 18 71 17</span>
        </p>
      </div>
    </div>
  );
};
