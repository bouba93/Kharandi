import React, { useState, useEffect } from 'react';
import { Users, MapPin, MessageCircle, Plus, X, BookOpen, Search, Star, Filter, ChevronRight, Phone, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { EduLoading } from './EduLoading';
import { getTutorAds, createTutorAd, deleteTutorAd } from '../../services/content';
import { getMe } from '../../services/auth';
import { toast } from 'sonner';

const ZONES = ['Kaloum','Dixinn','Matam','Ratoma','Matoto','Coyah','Dubréka','Autre'];

const DEFAULT_TUTORS = [
  {
    id: "demo-tutor-1",
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
    id: "demo-tutor-2",
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
    id: "demo-tutor-3",
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

export const Tutors: React.FC = () => {
  const { userProfile } = useAuth();
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === 'ads') {
          setAds(await getTutorAds());
        } else {
          // Utiliser les users avec rôle TUTOR depuis l'API, combiné aux démos
          const { api } = await import('../../config/api');
          const { data } = await api.get('/auth/users/?role=TUTOR').catch(() => ({ data: { data: [] } }));
          const fetchedTutors = data?.data || [];
          setTutors([
            ...DEFAULT_TUTORS,
            ...fetchedTutors.filter((t: any) => !t.id?.toString().startsWith('demo-'))
          ]);
        }
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><Users size={24} /></div>
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
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
            {tab === 'profiles' ? '👤 Répétiteurs' : '📋 Annonces'}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && activeTab === 'ads' && (
          <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 mb-6 space-y-4">
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
              className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
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
                      className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors
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
                        {ad.phone && <span><Phone size={12} className="inline" /> {ad.phone}</span>}
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
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary shrink-0 sm:w-48">
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
                  
                  // Safe custom attributes with defaults for registered profile items
                  const rating = t.rating || 4.7;
                  const reviews = t.reviews || 6;
                  const subjects = t.subjects || t.profile?.subjects || "Matières générales, Soutien";
                  const levels = t.levels || t.profile?.levels || "Primaire & Collège";
                  const bio = t.bio || t.profile?.bio || "Professeur dévoué et à l'écoute, disponible pour des cours de soutien à domicile ou à distance.";
                  const avatarBg = t.avatarColor || "bg-[#18bfd6]/10 text-[#18bfd6]";
                  const location = t.profile?.city || t.profile?.neighborhood || "Conakry";

                  return (
                    <div key={t.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                      {/* Decorative colored corner overlay on hover */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#18bfd6]/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                      
                      <div>
                        {/* Header Details */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${avatarBg}`}>
                              {avatarLetter}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 leading-snug">{fullName}</h3>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} className="text-[#18bfd6]" /> {location}
                              </p>
                            </div>
                          </div>
                          
                          {/* Rating Label */}
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl border border-amber-100/50 shrink-0">
                            <Star size={12} className="fill-current text-amber-500" />
                            <span className="text-xs font-bold">{rating.toFixed(1)}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({reviews})</span>
                          </div>
                        </div>

                        {/* Bio Presentation */}
                        <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">
                          "{bio}"
                        </p>

                        {/* Subjects taught and Levels as badges */}
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
                            <span className="bg-[#18bfd6]/5 text-[#18bfd6] border border-[#18bfd6]/10 px-2.5 py-0.5 rounded-lg text-[10px] font-bold inline-block">
                              {levels}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      {t.phone && (
                        <div className="flex gap-2 border-t border-slate-50 pt-4">
                          <a 
                            href={`tel:${t.phone}`} 
                            className="flex-1 py-2.5 bg-[#18bfd6] hover:bg-[#18bfd6]/90 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-95"
                          >
                            <Phone size={13} /> Appeler
                          </a>
                          <a 
                            href={`https://wa.me/${t.phone.replace(/[\s+.-]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 transition-colors active:scale-95"
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
