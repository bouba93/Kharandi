import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { 
  School, UserCircle, ArrowRight, ShieldCheck, KeyRound, 
  Check, Loader2, ArrowLeft, GraduationCap, Users, BookOpen, 
  Lock, Mail, Star, Building, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  verifyActivationCode, finalizeActivation,
  schoolLogin, teacherLogin, parentLookup,
} from '../../services/ecole';

export const EcoleLogin: React.FC<{
  onParentLogin:  (data: any) => void;
  onSchoolLogin:  (profile: any) => void;
  onTeacherLogin: (profile: any) => void;
}> = ({ onParentLogin, onSchoolLogin, onTeacherLogin }) => {

  const [mode, setMode] = useState<'selection'|'school'|'parent'|'teacher'|'activation'|'setup_password'>('selection');

  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [studentId,      setStudentId]      = useState('');
  const [teacherEmail,   setTeacherEmail]   = useState('');
  const [teacherPass,    setTeacherPass]    = useState('');
  const [activCode,      setActivCode]      = useState('');
  const [activEmail,     setActivEmail]     = useState('');
  const [newPassword,    setNewPassword]    = useState('');
  const [confirmPass,    setConfirmPass]    = useState('');
  const [matchedSchool,  setMatchedSchool]  = useState<any>(null);
  const [loading,        setLoading]        = useState(false);

  const handleQuickDemoLogin = async (role: 'school' | 'teacher' | 'parent') => {
    setLoading(true);
    try {
      if (role === 'school') {
        const res = await schoolLogin('demo@ecole.gn', 'any');
        toast.success("Accès Direction démo actif !");
        onSchoolLogin(res.profile);
      } else if (role === 'teacher') {
        const res = await teacherLogin('camara@demo.gn', 'any');
        toast.success("Accès Enseignant démo actif !");
        onTeacherLogin(res.profile);
      } else if (role === 'parent') {
        const data = await parentLookup('KHA-DEMO-MAMA');
        toast.success("Accès Parent (Mamadou Diallo) actif !");
        onParentLogin(data);
      }
    } catch (err: any) {
      toast.error("Erreur d'accès démo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await schoolLogin(email.trim().toLowerCase(), password);
      toast.success("Connexion direction réussie !");
      onSchoolLogin(res.profile);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Identifiants incorrects.");
    } finally { setLoading(false); }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await teacherLogin(teacherEmail.trim().toLowerCase(), teacherPass);
      toast.success(`Bienvenue, professeur !`);
      onTeacherLogin(res.profile);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Identifiants enseignant incorrects.");
    } finally { setLoading(false); }
  };

  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) { toast.error("Matricule requis."); return; }
    setLoading(true);
    try {
      const data = await parentLookup(studentId.trim().toUpperCase());
      onParentLogin(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Matricule introuvable.");
    } finally { setLoading(false); }
  };

  const verifyActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyActivationCode(activCode.trim().toUpperCase(), activEmail.trim().toLowerCase());
      if (res.school_name) {
        setMatchedSchool({ name: res.school_name, email: activEmail.trim().toLowerCase(), code: activCode.trim().toUpperCase() });
        setMode('setup_password');
        toast.success("Code validé ! Définissez votre mot de passe.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Code ou email incorrect.");
    } finally { setLoading(false); }
  };

  const finalizeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error("Minimum 6 caractères."); return; }
    if (newPassword !== confirmPass) { toast.error("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const res = await finalizeActivation(matchedSchool.code, matchedSchool.email, newPassword);
      toast.success("École activée ! Connectez-vous maintenant.");
      setMode('school');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'activation.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row relative overflow-hidden font-sans">
      
      {/* Absolute top corner back button */}
      <button 
        onClick={() => window.location.href = '/'}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 hover:text-slate-900 shadow-sm hover:shadow-md transition-all group cursor-pointer z-50"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#18bfd6]" />
        Retour à Kharandi
      </button>

      {/* Left Column: Visual Brand / Info Slider (Showcases Premium Vibe) */}
      <div className="lg:w-[45%] bg-gradient-to-br from-[#0e9bb2] via-[#18bfd6] to-[#fcb303]/90 relative flex flex-col justify-between p-8 md:p-12 text-white overflow-hidden shrink-0">
        
        {/* Background artwork, soft organic curves and geometric dots */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-yellow-400 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        {/* Top brand header */}
        <div className="relative z-10 flex items-center gap-3 mt-14 lg:mt-6">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2">
            <img 
              src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
              alt="Kharandi Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight leading-none text-white">KHARANDI</h2>
            <span className="text-[10px] font-bold text-cyan-100 uppercase tracking-widest mt-1 block">L'éducation réinventée</span>
          </div>
        </div>

        {/* Middle illustration / features list */}
        <div className="relative z-10 my-auto py-10 space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-black uppercase tracking-wider text-yellow-100">
              <GraduationCap size={14} className="text-yellow-200" />
              Espace Scolaire Élite
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-white font-sans">
              Suivez et orchestrez la réussite scolaire
            </h1>
            <p className="text-sm md:text-base text-cyan-50/90 leading-relaxed font-medium max-w-md">
              Kharandi École connecte en temps réel directeurs, enseignants et parents pour un accompagnement pédagogique d'excellence.
            </p>
          </div>

          {/* Mini Bento Cards of features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl text-yellow-200"><GraduationCap size={18} /></div>
              <div>
                <h4 className="font-extrabold text-sm">Suivi Pédagogique</h4>
                <p className="text-xs text-cyan-100/80 mt-1">Saisie des notes, calculs de moyennes et bulletins.</p>
              </div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl text-cyan-200"><Users size={18} /></div>
              <div>
                <h4 className="font-extrabold text-sm">Portail Parents</h4>
                <p className="text-xs text-cyan-100/80 mt-1">Vue instantanée sur les notes, l'assiduité et la scolarité.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-cyan-100/70 flex justify-between items-center">
          <span>© {new Date().getFullYear()} Kharandi Technologie.</span>
          <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" /> République de Guinée</span>
        </div>
      </div>

      {/* Right Column: Dynamic Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10 bg-slate-50/40">
        
        {/* Ambient grids on the form side */}
        <div className="absolute inset-0 bg-[radial-gradient(#18bfd6_0.8px,transparent_0.8px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />

        <div className="w-full max-w-md">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={mode} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              
              {/* Header inside the form card */}
              <div className="mb-6 text-center lg:text-left">
                {mode !== 'selection' && (
                  <button 
                    onClick={() => setMode('selection')}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3 cursor-pointer group"
                  >
                    <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> Retour
                  </button>
                )}
                
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {mode === 'selection' && "Bienvenue sur l'Espace École"}
                  {mode === 'parent' && "Suivi de l'élève"}
                  {mode === 'school' && "Accès Administratif"}
                  {mode === 'teacher' && "Accès Enseignant"}
                  {mode === 'activation' && "Activation d'Établissement"}
                  {mode === 'setup_password' && "Définir le mot de passe"}
                </h2>
                <p className="text-slate-400 text-xs font-bold mt-1.5">
                  {mode === 'selection' && "Choisissez votre profil pour commencer la session"}
                  {mode === 'parent' && "Saisissez le matricule unique pour suivre les bulletins et devoirs"}
                  {mode === 'school' && "Renseignez vos identifiants de Direction"}
                  {mode === 'teacher' && "Connectez-vous pour saisir vos notes et faire l'appel"}
                  {mode === 'activation' && "Activez le compte de votre école grâce au code de bienvenue"}
                  {mode === 'setup_password' && "Configurez le mot de passe de sécurité de votre direction"}
                </p>
              </div>

              {/* SELECTION MODE */}
              {mode === 'selection' && (
                <div className="space-y-3.5">
                  {[
                    { 
                      m: 'parent', 
                      icon: <UserCircle size={22} />, 
                      color: 'bg-cyan-50 border-cyan-100 text-[#18bfd6]', 
                      title: 'Espace Parent d\'Élève', 
                      desc: 'Consultez les moyennes, absences et badges de votre enfant.' 
                    },
                    { 
                      m: 'school', 
                      icon: <School size={22} />, 
                      color: 'bg-amber-50 border-amber-100 text-[#fcb303]', 
                      title: 'Direction de l\'École', 
                      desc: 'Gérez l\'administration, les classes et la facturation.' 
                    },
                    { 
                      m: 'teacher', 
                      icon: <KeyRound size={22} />, 
                      color: 'bg-indigo-50 border-indigo-100 text-indigo-600', 
                      title: 'Espace Enseignant', 
                      desc: 'Saisissez les notes, gérez l\'appel et publiez les devoirs.' 
                    }
                  ].map(({ m, icon, color, title, desc }) => (
                    <button 
                      key={m} 
                      onClick={() => setMode(m as any)}
                      className="w-full p-4.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all group flex items-start gap-4 text-left cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className={`w-11 h-11 ${color} border rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs`}>
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-[#18bfd6] transition-colors">{title}</h3>
                          <ArrowRight size={14} className="text-slate-300 group-hover:text-[#18bfd6] group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-semibold">{desc}</p>
                      </div>
                    </button>
                  ))}

                  {/* FAST QUICK ACCESS DEMO CARD */}
                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <div className="bg-slate-50/80 rounded-2xl p-4.5 border border-slate-100">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-200/60 px-2.5 py-0.5 rounded-md mb-3">
                        ⚡ Mode démonstration (Accès Rapide)
                      </span>
                      <p className="text-xs text-slate-400 font-bold mb-3.5 leading-relaxed">
                        Explorez instantanément Kharandi École avec nos 3 comptes de démonstration pré-configurés :
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleQuickDemoLogin('school')}
                          className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-amber-100 hover:border-amber-300 hover:bg-amber-50/20 text-[#c68900] transition-all cursor-pointer text-center group shadow-xs active:scale-95"
                        >
                          <Building size={16} className="text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-black">Directeur</span>
                          <span className="text-[8px] font-semibold text-slate-400 mt-0.5">Admin</span>
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleQuickDemoLogin('teacher')}
                          className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/20 text-indigo-600 transition-all cursor-pointer text-center group shadow-xs active:scale-95"
                        >
                          <GraduationCap size={16} className="text-indigo-500 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-black">Enseignant</span>
                          <span className="text-[8px] font-semibold text-slate-400 mt-0.5">M. Camara</span>
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleQuickDemoLogin('parent')}
                          className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-cyan-100 hover:border-cyan-300 hover:bg-cyan-50/20 text-[#15adc1] transition-all cursor-pointer text-center group shadow-xs active:scale-95"
                        >
                          <UserCircle size={16} className="text-cyan-500 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-black">Parent</span>
                          <span className="text-[8px] font-semibold text-slate-400 mt-0.5">M. Diallo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activation Trigger */}
                  <div className="pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setMode('activation')}
                      className="w-full py-3 px-4 bg-amber-500/10 hover:bg-amber-500/15 text-[#fb7f00] font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 border border-amber-500/10 cursor-pointer"
                    >
                      <ShieldCheck size={15} /> Première connexion ? Activer mon école
                    </button>
                  </div>

                </div>
              )}

              {/* PARENT LOGIN */}
              {mode === 'parent' && (
                <form onSubmit={handleParentLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Matricule de l'élève</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap size={16} />
                      </div>
                      <input 
                        type="text" 
                        required 
                        value={studentId} 
                        onChange={e => setStudentId(e.target.value)}
                        placeholder="EX : KHA-SCH1-4A2F" 
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#18bfd6] focus:ring-4 focus:ring-[#18bfd6]/10 transition-all font-mono uppercase" 
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    isLoading={loading} 
                    className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#18bfd6] hover:bg-[#15adc1] text-white shadow-lg shadow-cyan-100/40 cursor-pointer mt-2"
                  >
                    Accéder au dossier <ArrowRight size={14} />
                  </Button>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <button 
                      type="button" 
                      onClick={() => handleQuickDemoLogin('parent')} 
                      className="text-[11px] font-black text-[#18bfd6] hover:underline"
                    >
                      ⚡ Connexion immédiate démo (M. Diallo)
                    </button>
                  </div>
                </form>
              )}

              {/* SCHOOL DIRECTION LOGIN */}
              {mode === 'school' && (
                <form onSubmit={handleSchoolLogin} className="space-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Email de la direction</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Mail size={16} />
                        </div>
                        <input 
                          type="email" 
                          required 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          placeholder="direction@ecole.gn" 
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#18bfd6] focus:ring-4 focus:ring-[#18bfd6]/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Mot de passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock size={16} />
                        </div>
                        <input 
                          type="password" 
                          required 
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                          placeholder="••••••••" 
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#18bfd6] focus:ring-4 focus:ring-[#18bfd6]/10 transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    isLoading={loading} 
                    className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#18bfd6] hover:bg-[#15adc1] text-white shadow-lg shadow-[#18bfd6]/25 cursor-pointer mt-2 transition-all"
                  >
                    Se connecter
                  </Button>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <button 
                      type="button" 
                      onClick={() => handleQuickDemoLogin('school')} 
                      className="text-[11px] font-black text-[#18bfd6] hover:underline"
                    >
                      ⚡ Connexion immédiate démo (Directeur)
                    </button>
                  </div>
                </form>
              )}

              {/* TEACHER LOGIN */}
              {mode === 'teacher' && (
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Email enseignant</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Mail size={16} />
                        </div>
                        <input 
                          type="email" 
                          required 
                          value={teacherEmail} 
                          onChange={e => setTeacherEmail(e.target.value)} 
                          placeholder="prof@ecole.gn" 
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Mot de passe</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock size={16} />
                        </div>
                        <input 
                          type="password" 
                          required 
                          value={teacherPass} 
                          onChange={e => setTeacherPass(e.target.value)} 
                          placeholder="••••••••" 
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    isLoading={loading} 
                    className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100/40 cursor-pointer mt-2"
                  >
                    Ouvrir la session
                  </Button>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <button 
                      type="button" 
                      onClick={() => handleQuickDemoLogin('teacher')} 
                      className="text-[11px] font-black text-indigo-600 hover:underline"
                    >
                      ⚡ Connexion immédiate démo (Enseignant)
                    </button>
                  </div>
                </form>
              )}

              {/* ACTIVATION STEP 1 */}
              {mode === 'activation' && (
                <form onSubmit={verifyActivation} className="space-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Code d'activation</label>
                      <input 
                        type="text" 
                        required 
                        value={activCode} 
                        onChange={e => setActivCode(e.target.value)} 
                        placeholder="EX : SCH-DF67"
                        className="w-full bg-orange-50/20 border border-orange-200/80 rounded-2xl px-4 py-3.5 text-sm font-bold text-orange-700 placeholder:text-orange-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-mono uppercase text-center" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Email officiel de l'école</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Mail size={16} />
                        </div>
                        <input 
                          type="email" 
                          required 
                          value={activEmail} 
                          onChange={e => setActivEmail(e.target.value)} 
                          placeholder="direction@votre-ecole.com" 
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    isLoading={loading} 
                    className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-100/40 cursor-pointer mt-2"
                  >
                    Vérifier le code
                  </Button>
                </form>
              )}

              {/* ACTIVATION STEP 2: PASSWORD SET UP */}
              {mode === 'setup_password' && matchedSchool && (
                <form onSubmit={finalizeSetup} className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                    <div className="p-1 bg-emerald-500 text-white rounded-full"><Check size={16} /></div>
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-900">Établissement vérifié</h4>
                      <p className="text-xs text-emerald-700/80 mt-0.5 font-bold">{matchedSchool.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        required 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        placeholder="6 caractères minimum" 
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Confirmer le mot de passe</label>
                      <input 
                        type="password" 
                        required 
                        value={confirmPass} 
                        onChange={e => setConfirmPass(e.target.value)} 
                        placeholder="Saisissez à nouveau" 
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    isLoading={loading} 
                    className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100/40 cursor-pointer mt-2"
                  >
                    Activer & Terminer
                  </Button>
                </form>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
};
