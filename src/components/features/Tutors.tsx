import React, { useState, useEffect } from 'react';
import { Users, MapPin, MessageCircle, Plus, X, BookOpen, Search, Star, Filter, ChevronRight, Phone, Send, Loader2, Calendar, Clock, DollarSign, FileText, CheckCircle2, Shield, AlertCircle, Share2, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { EduLoading } from './EduLoading';
import { getTutorAds, createTutorAd, deleteTutorAd } from '../../services/content';
import { toast } from 'sonner';

const ZONES = ['Kaloum','Dixinn','Matam','Ratoma','Matoto','Coyah','Dubréka','Autre'];

const DEFAULT_TUTORS = [
  {
    id: "tutor-default-1",
    phone: "+224 622 45 45 88",
    profile: {
      first_name: "Amadou",
      last_name: "Diallo",
      city: "Ratoma",
      role: "TUTOR"
    },
    subjects: "Mathématiques, Physique & Chimie",
    levels: "Collège & Lycée (Terminales SM/SE)",
    bio: "Enseignant de lycée passionné de sciences réelles. J'accompagne nos futurs bacheliers au quotidien pour dompter le programme et exceller aux épreuves officielles.",
    rating: 4.9,
    reviews: 18,
    avatarColor: "bg-[#18bfd6]/10 text-[#18bfd6]"
  },
  {
    id: "tutor-default-2",
    phone: "+224 621 89 01 23",
    profile: {
      first_name: "Mme Fatoumata",
      last_name: "Barry",
      city: "Dixinn",
      role: "TUTOR"
    },
    subjects: "Anglais, Français & Hist-Géo",
    levels: "Primaire & Collège (BEPC)",
    bio: "Professeure diplômée, spécialisée dans la remise à niveau personnalisée en langues et rédactions complexes pour le brevet.",
    rating: 4.8,
    reviews: 14,
    avatarColor: "bg-[#fcb303]/10 text-[#fcb303]"
  },
  {
    id: "tutor-default-3",
    phone: "+224 628 34 56 78",
    profile: {
      first_name: "Souleymane",
      last_name: "Camara",
      city: "Matoto",
      role: "TUTOR"
    },
    subjects: "Biologie / SVT & Chimie",
    levels: "Lycée (Terminales SS)",
    bio: "Répétiteur ultra-dynamique. Ma méthode simplifie les notions cellulaires complexes grâce au dessin et favorise l'assimilation rapide.",
    rating: 5.0,
    reviews: 22,
    avatarColor: "bg-purple-100 text-purple-600"
  }
];

interface TutorSession {
  id: string;
  studentName: string;
  date: string;
  duration: number; // in hours
  rate: number; // GNF per hour
  summary: string;
}

export const Tutors: React.FC = () => {
  const { userProfile } = useAuth();
  
  // Identifier si l'utilisateur est un Répétiteur
  const isTutor = userProfile?.role === 'TUTOR' || userProfile?.role === 'repetiteur' || userProfile?.role === 'teacher';

  const [ads,          setAds]          = useState<any[]>([]);
  const [tutors,       setTutors]       = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState<'profiles'|'ads'>('profiles');
  const [showForm,     setShowForm]     = useState(false);
  const [filter,       setFilter]       = useState<'all'|'offer'|'request'>('all');
  const [subjectFilter,setSubjectFilter]= useState('');
  const [tutorSearch,  setTutorSearch]  = useState('');
  const [tutorZone,    setTutorZone]    = useState('all');
  const [adType,       setAdType]       = useState<'offer'|'request'>('offer');
  const [subject,      setSubject]      = useState('');
  const [level,        setLevel]        = useState('');
  const [location,     setLocation]     = useState('');
  const [description,  setDescription]  = useState('');
  const [phone,        setPhone]        = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Répétiteur de maison State & Logic ──────────────────────────────────────
  const [tutorTab, setTutorTab] = useState<'dashboard' | 'announce' | 'kyc'>('dashboard');
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  
  // Session form fields
  const [newStudent, setNewStudent] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDuration, setNewDuration] = useState(2);
  const [newRate, setNewRate] = useState(50000);
  const [newSummary, setNewSummary] = useState('');

  // Charger les sessions locales du Répétiteur
  useEffect(() => {
    if (isTutor) {
      const saved = localStorage.getItem('kharandi_tutor_sessions');
      if (saved) {
        try {
          setSessions(JSON.parse(saved));
        } catch (e) {
          setSessions([]);
        }
      }
    }
  }, [isTutor]);

  // Sauvegarder les sessions locales du Répétiteur
  const saveSessions = (updated: TutorSession[]) => {
    setSessions(updated);
    localStorage.setItem('kharandi_tutor_sessions', JSON.stringify(updated));
  };

  // Ajouter une séance de soutien
  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent || !newDate || !newSummary) {
      toast.error("Veuillez remplir tous les champs de la séance.");
      return;
    }

    const session: TutorSession = {
      id: `session-${Date.now()}`,
      studentName: newStudent,
      date: newDate,
      duration: Number(newDuration),
      rate: Number(newRate),
      summary: newSummary
    };

    const updated = [session, ...sessions];
    saveSessions(updated);
    
    // Reset form
    setNewStudent('');
    setNewDate('');
    setNewDuration(2);
    setNewSummary('');
    
    toast.success("Séance de cours enregistrée avec succès !");
  };

  // Supprimer une séance de cours
  const handleDeleteSession = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette séance ?")) {
      const updated = sessions.filter(s => s.id !== id);
      saveSessions(updated);
      toast.success("Séance supprimée.");
    }
  };

  // Partager le rapport de cours par WhatsApp ou Presse-papier
  const handleShareReport = (session: TutorSession) => {
    const reportText = `🎓 *RAPPORT DE SÉANCE DE COURS - KHARANDI* 🎓\n\n` +
      `👤 *Élève :* ${session.studentName}\n` +
      `📅 *Date de séance :* ${new Date(session.date).toLocaleDateString('fr-FR')}\n` +
      `⏱️ *Durée :* ${session.duration} heure(s) de cours\n` +
      `📚 *Sujet traité :* ${session.summary}\n` +
      `💸 *Tarif de la séance :* ${(session.duration * session.rate).toLocaleString()} GNF\n\n` +
      `_Rapport transmis instantanément via Kharandi. Merci pour votre collaboration !_`;

    navigator.clipboard.writeText(reportText).then(() => {
      toast.success("Rapport copié dans le presse-papier !");
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
      window.open(whatsappUrl, '_blank');
    }).catch(() => {
      toast.error("Impossible de copier.");
    });
  };

  // Charger les annonces pour les parents/élèves
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === 'ads') {
          setAds(await getTutorAds());
        } else {
          const { api } = await import('../../config/api');
          const { data } = await api.get('/auth/users/?role=TUTOR').catch(() => ({ data: { data: [] } }));
          const fetchedTutors = data?.data || [];
          setTutors([
            ...DEFAULT_TUTORS,
            ...fetchedTutors.filter((t: any) => !t.id?.toString().startsWith('tutor-default-'))
          ]);
        }
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, [activeTab]);

  const handleSubmitAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTutorAd({ ad_type: adType, subject, level, location, description, phone });
      toast.success("Annonce publiée !");
      setShowForm(false); setSubject(''); setDescription(''); setPhone('');
      setAds(await getTutorAds());
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la publication.");
    } finally { setIsSubmitting(false); }
  };

  const filteredAds = ads.filter(a =>
    (filter === 'all' || a.ad_type === filter) &&
    (!subjectFilter || a.subject.toLowerCase().includes(subjectFilter.toLowerCase()))
  );

  const filteredTutors = tutors.filter(t => {
    const firstName = t.profile?.first_name || '';
    const lastName = t.profile?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
    const subjects = (t.subjects || t.profile?.subjects || '').toLowerCase();
    const levels = (t.levels || t.profile?.levels || '').toLowerCase();
    const city = (t.profile?.city || t.profile?.neighborhood || '').toLowerCase();
    const q = tutorSearch.toLowerCase();
    const matchesSearch = !q || fullName.includes(q) || subjects.includes(q) || levels.includes(q);
    const matchesZone = tutorZone === 'all' || city.includes(tutorZone.toLowerCase());
    return matchesSearch && matchesZone;
  });

  // Extraction et parsing des documents KYC du profil répétiteur
  let kycDocs: { recto?: string; verso?: string } | null = null;
  try {
    const profileAny = userProfile as any;
    if (profileAny?.kyc_document) {
      kycDocs = JSON.parse(profileAny.kyc_document);
    }
  } catch {}

  // ── Rendu de l'Espace Répétiteur de Maison ──────────────────────────────────
  if (isTutor) {
    // Calcul des statistiques réelles (non mockées !)
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalEarnings = sessions.reduce((sum, s) => sum + (s.duration * s.rate), 0);

    return (
      <div className="p-6 max-w-4xl mx-auto pb-24 font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-none">Mon Espace Répétiteur</h1>
              <p className="text-slate-500 text-xs mt-1">Soutien scolaire à domicile & Suivi des cours</p>
            </div>
          </div>
          <span className="self-start md:self-center px-3 py-1 bg-emerald-100/60 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-200">
            🏡 Tuteur Vérifié
          </span>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-[20px] mb-6 border border-slate-200/50">
          <button 
            onClick={() => setTutorTab('dashboard')}
            className={`flex-1 py-3 text-xs font-black rounded-[14px] uppercase tracking-wider transition-all cursor-pointer
              ${tutorTab === 'dashboard' ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            📊 Mes Séances & Suivi
          </button>
          <button 
            onClick={() => setTutorTab('announce')}
            className={`flex-1 py-3 text-xs font-black rounded-[14px] uppercase tracking-wider transition-all cursor-pointer
              ${tutorTab === 'announce' ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            📋 Mon Annonce Publique
          </button>
          <button 
            onClick={() => setTutorTab('kyc')}
            className={`flex-1 py-3 text-xs font-black rounded-[14px] uppercase tracking-wider transition-all cursor-pointer
              ${tutorTab === 'kyc' ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            🛡️ KYC & Identité
          </button>
        </div>

        {/* TAB 1: Dashboard & Logging */}
        {tutorTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Real Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Séances Déclarées</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">{sessions.length}</span>
                  <span className="text-xs font-bold text-slate-500">leçons</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Total Heures Dispensees</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600">{totalHours} h</span>
                  <span className="text-xs font-bold text-slate-500">de soutien</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Gains Totaux Generes</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-500">{totalEarnings.toLocaleString()}</span>
                  <span className="text-xs font-bold text-slate-500">GNF</span>
                </div>
              </div>
            </div>

            {/* Form to Log a Session */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-emerald-500" /> Enregistrer une séance de cours particulier
              </h3>
              <form onSubmit={handleAddSession} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Nom de l'élève *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Mohamed Sylla"
                      value={newStudent}
                      onChange={e => setNewStudent(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Date du cours *</label>
                    <input 
                      type="date" 
                      required 
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Durée de la leçon (Heures) *</label>
                    <input 
                      type="number" 
                      required 
                      min={1} 
                      max={12}
                      value={newDuration}
                      onChange={e => setNewDuration(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Tarif horaire convenu (GNF / Heure) *</label>
                    <input 
                      type="number" 
                      required 
                      min={1000}
                      step={5000}
                      value={newRate}
                      onChange={e => setNewRate(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Rapport et notions abordées *</label>
                  <textarea 
                    required 
                    rows={2}
                    placeholder="Ex: Analyse de la fonction exponentielle, résolution de QCM types BAC."
                    value={newSummary}
                    onChange={e => setNewSummary(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  ➕ Enregistrer la séance de cours
                </button>
              </form>
            </div>

            {/* Sessions History */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-emerald-500" /> Historique des séances de cours dispensées
              </h3>
              
              {sessions.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold">Aucune séance enregistrée pour le moment. Déclarez votre premier cours ci-dessus.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {sessions.map(s => (
                    <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-all">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{s.studentName}</h4>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                            📅 {new Date(s.date).toLocaleDateString('fr-FR')} • ⏱️ {s.duration} h de cours
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-amber-500 block">{(s.duration * s.rate).toLocaleString()} GNF</span>
                          <span className="text-[9px] text-slate-400 font-bold block">{s.rate.toLocaleString()} GNF/h</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 italic leading-relaxed">
                        "{s.summary}"
                      </p>

                      <div className="flex gap-2 border-t border-slate-50 pt-3">
                        <button 
                          onClick={() => handleShareReport(s)}
                          className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Share2 size={13} /> Partager le rapport aux parents
                        </button>
                        <button 
                          onClick={() => handleDeleteSession(s.id)}
                          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Publish / Manage public Ad */}
        {tutorTab === 'announce' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider mb-4">📢 Configurer mon profil public</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Remplissez vos spécialités scolaires de soutien afin d'être visible dans l'annuaire Kharandi et recevoir les sollicitations directes des familles guinéennes.
              </p>

              <form onSubmit={handleSubmitAd} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Matières enseignées *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Ex: Mathématiques, Physique"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Niveaux scolaires ciblés *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Ex: Collège & Lycée"
                      value={level}
                      onChange={e => setLevel(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Zone d'intervention (Ville/Quartier) *</label>
                    <select 
                      required
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="">— Choisir —</option>
                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Numéro de téléphone direct *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Ex: +224 626 18..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Présentation et méthodologie de soutien *</label>
                  <textarea 
                    required 
                    rows={4}
                    placeholder="Décrivez votre parcours d'enseignement, vos méthodes de soutien de maison et comment vous aidez l'élève à progresser..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Enregistrement..." : "💾 Sauvegarder mon profil public"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: KYC status */}
        {tutorTab === 'kyc' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                <Shield size={20} className="text-emerald-500" />
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Statut des pièces justificatives KYC</h3>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-bold leading-relaxed mb-6 flex gap-3">
                <Clock size={18} className="shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-extrabold uppercase mb-0.5">Vérification de sécurité en cours</p>
                  <p>Vos pièces d'identité ont été téléversées de manière hautement sécurisée. Elles sont actuellement en cours d'audit par les équipes de conformité Kharandi. Votre profil public reste visible, mais la mention "Profil Audité" sera apposée une fois la vérification finalisée.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pièce Recto</span>
                  {kycDocs?.recto ? (
                    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                      <img src={kycDocs.recto} alt="KYC Recto" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center flex flex-col items-center justify-center aspect-video bg-slate-50/50">
                      <AlertCircle size={24} className="text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500 font-bold">Non fournie lors de l'onboarding</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pièce Verso</span>
                  {kycDocs?.verso ? (
                    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                      <img src={kycDocs.verso} alt="KYC Verso" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center flex flex-col items-center justify-center aspect-video bg-slate-50/50">
                      <AlertCircle size={24} className="text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500 font-bold">Non fournie lors de l'onboarding</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Rendu Standard: Pour Éléves / Parents (Browsing directory) ──────────────
  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0"><Users size={24} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Répétiteurs</h1>
            <p className="text-slate-500 text-sm">Trouvez ou proposez du soutien scolaire</p>
          </div>
        </div>
        {activeTab === 'ads' && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            {showForm ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Publier</>}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
        {(['profiles', 'ads'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer
              ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
            {tab === 'profiles' ? '👤 Répétiteurs' : '📋 Annonces'}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && activeTab === 'ads' && (
          <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmitAd} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Type d'annonce</label>
                <select value={adType} onChange={e => setAdType(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                  <option value="offer">J'offre des cours</option>
                  <option value="request">Je cherche un répétiteur</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Matière *</label>
                <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Mathématiques"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Niveau</label>
                <input value={level} onChange={e => setLevel(e.target.value)} placeholder="Terminale"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Zone</label>
                <select value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                  <option value="">— Choisir —</option>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Téléphone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+224..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">Description *</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Décrivez votre offre ou demande..." rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Publication...</> : <><Send size={16} /> Publier l'annonce</>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? <EduLoading message="Chargement..." /> : (
        <>
          {activeTab === 'ads' && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
                  {(['all', 'offer', 'request'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer
                        ${filter === f ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {f === 'all' ? 'Toutes' : f === 'offer' ? 'Offres' : 'Demandes'}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-64">
                  <input value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
                    placeholder="Filtrer par matière..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary" />
                </div>
              </div>
              {filteredAds.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100">
                  <p className="text-slate-400 font-bold">Aucune annonce disponible</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAds.map((ad: any) => (
                    <div key={ad.id} className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-2 ${ad.ad_type === 'offer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {ad.ad_type === 'offer' ? 'Offre' : 'Demande'}
                          </span>
                          <span className="font-bold text-slate-900">{ad.subject}</span>
                        </div>
                        {ad.is_boosted && <Star size={16} className="text-yellow-500 fill-current shrink-0" />}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{ad.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                        {ad.level && <span>Niveau : {ad.level}</span>}
                        {ad.location && <span><MapPin size={12} className="inline mr-0.5" /> {ad.location}</span>}
                        {ad.phone && <span><Phone size={12} className="inline mr-0.5" /> {ad.phone}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'profiles' && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-5 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                <input value={tutorSearch} onChange={e => setTutorSearch(e.target.value)}
                  placeholder="Rechercher par nom, matière ou niveau..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary font-medium" />
                <select value={tutorZone} onChange={e => setTutorZone(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary shrink-0 sm:w-48 bg-white">
                  <option value="all">Toutes les zones</option>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              {filteredTutors.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100">
                  <Users size={48} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-slate-400 font-bold">Aucun répétiteur trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredTutors.map((t: any) => {
                    const firstName = t.profile?.first_name || '';
                    const lastName = t.profile?.last_name || '';
                    const fullName = firstName ? `${firstName} ${lastName}`.trim() : (t.phone || 'Professeur Kharandi');
                    const avatarLetter = (firstName || fullName || '?')[0].toUpperCase();
                    
                    const rating = t.rating || 4.7;
                    const reviews = t.reviews || 6;
                    const subjects = t.subjects || t.profile?.subjects || "Matières générales, Soutien";
                    const levels = t.levels || t.profile?.levels || "Primaire & Collège";
                    const bio = t.bio || t.profile?.bio || "Professeur dévoué et à l'écoute, disponible pour des cours de soutien à domicile.";
                    const avatarBg = t.avatarColor || "bg-[#18bfd6]/10 text-[#18bfd6]";
                    const location = t.profile?.city || t.profile?.neighborhood || "Conakry";

                    return (
                      <div key={t.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                        
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${avatarBg}`}>
                                {avatarLetter}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-slate-900 leading-snug">{fullName}</h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin size={12} className="text-primary" /> {location}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl border border-amber-100/50 shrink-0">
                              <Star size={12} className="fill-current text-amber-500" />
                              <span className="text-xs font-bold">{rating.toFixed(1)}</span>
                              <span className="text-[10px] text-slate-400 font-medium">({reviews})</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">
                            "{bio}"
                          </p>

                          <div className="space-y-3 mb-5 border-t border-slate-50 pt-3">
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1 tracking-wider">Matières :</span>
                              <div className="flex flex-wrap gap-1.5">
                                {subjects.split(',').map((subj: string, idx: number) => (
                                  <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                                    {subj.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1 tracking-wider">Niveaux :</span>
                              <span className="bg-primary/5 text-primary border border-primary/10 px-2.5 py-0.5 rounded-lg text-[10px] font-bold inline-block">
                                {levels}
                              </span>
                            </div>
                          </div>
                        </div>

                        {t.phone && (
                          <div className="flex gap-2 border-t border-slate-50 pt-4">
                            <a 
                              href={`tel:${t.phone}`} 
                              className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                            >
                              <Phone size={13} /> Appeler
                            </a>
                            <a 
                              href={`https://wa.me/${t.phone.replace(/[\s+.-]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 transition-colors active:scale-95 cursor-pointer"
                              title="Contacter sur WhatsApp"
                            >
                              <MessageCircle size={15} />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
