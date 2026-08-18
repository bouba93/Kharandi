import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  MapPin, 
  Users, 
  Download, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  Calendar, 
  Award, 
  GraduationCap, 
  Lock, 
  CreditCard, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';
import { getSchoolRankings } from '../../services/content';
import { EduLoading } from './EduLoading';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export const SchoolRankings: React.FC = () => {
  const { userProfile } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem('kharandi_palmares_unlocked') === 'true');

  const evalDocUrl = "https://docs.google.com/document/d/1fu59ELcDGwSKAstU1hsDYTtLiALvYDaM/edit?usp=sharing&ouid=100951247435149509106&rtpof=true&sd=true";

  const isSubscribedToPalmares = unlocked || 
    userProfile?.role === 'admin' || 
    userProfile?.subscriptionPlan === 'palmares' || 
    userProfile?.subscriptionPlan === 'annuel' || 
    userProfile?.activeAddons?.includes('palmares');

  useEffect(() => {
    getSchoolRankings()
      .then(data => {
        setSchools(data || []);
      })
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribePalmares = async () => {
    setPaying(true);
    try {
      const { initiateSubscription } = await import('../../services/payments');
      const res = await initiateSubscription('palmares', 'GNF');
      if (res?.payment_url) {
        window.location.href = res.payment_url;
      } else {
        localStorage.setItem('kharandi_palmares_unlocked', 'true');
        setUnlocked(true);
        toast.success("Pass Palmarès activé avec succès (250 000 GNF/an) !");
      }
    } catch (err: any) {
      console.error("Erreur initiation abonnement palmares:", err);
      toast.error(err.response?.data?.message || "Erreur lors de l'activation du Pass Palmarès.");
    } finally {
      setPaying(false);
    }
  };

  const dimensions = [
    "Performance académique",
    "Qualité de l'enseignement",
    "Gouvernance",
    "Environnement scolaire",
    "Infrastructures",
    "Vie citoyenne",
    "Innovation",
    "Inclusion"
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-left animate-fade-in">
      
      {/* STATUS BANNER IF SUBSCRIBED */}
      {isSubscribedToPalmares && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">Pass Actif</span>
              <p className="text-xs md:text-sm font-bold">Vous bénéficiez de l'accès complet au Palmarès National des Écoles (250.000 GNF / an)</p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-300/60">
            Accès Répertoire & Fiches Débloqué
          </span>
        </div>
      )}

      {/* HERO HEADER - COULEURS KHARANDI AVEC IMAGE DE COUVERTURE */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 shadow-xl">
        <img 
          src="https://lh3.googleusercontent.com/d/175IT_yx9FJRcBEbJ468jf8stdT1_HWMb" 
          alt="Palmarès Kharandi Couverture" 
          className="w-full h-auto object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* INTRODUCTORY PRESENTATION SECTION */}
      <div className="bg-white rounded-[32px] border border-slate-150 p-6 md:p-10 shadow-sm space-y-8">
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[#18bfd6] font-black text-xs uppercase tracking-wider">
              <GraduationCap size={18} />
              <span>Cadre & Engagement Éducatif</span>
            </div>
            <span className="bg-amber-100 text-amber-800 font-black text-[11px] px-3 py-1 rounded-full border border-amber-200">
              Abonnement : 250.000 GNF / an
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug">
            Une démarche d'excellence au service de l'Éducation en Guinée
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            Chaque année, des milliers d'établissements scolaires guinéens (écoles primaires, collèges et lycées, publics comme privés) œuvrent au quotidien pour offrir à leurs élèves un enseignement de qualité. Le <strong>Palmarès National des Écoles de Guinée</strong> est né de la volonté de reconnaître cet engagement et de le porter à la connaissance de tous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span>Méthodologie Rigoureuse et Transparente</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Porté par <strong>Kharandi</strong>, ce classement repose sur une méthodologie construite autour de <strong>huit dimensions essentielles</strong> de la vie scolaire. Chaque établissement est évalué sur la base de données vérifiées, d'audits de terrain et d'entretiens avec les équipes pédagogiques — <em>jamais sur simple déclaration</em>.
            </p>

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Les 8 dimensions d'évaluation :</span>
              <div className="flex flex-wrap gap-2">
                {dimensions.map((dim, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50/60 border border-cyan-100 text-slate-700 text-xs font-bold rounded-xl shadow-2xs">
                    <CheckCircle2 size={13} className="text-[#18bfd6]" />
                    {dim}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#18bfd6]/10 text-[#18bfd6] flex items-center justify-center font-black">
              <BookOpen size={20} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Un outil de progrès pour tous</h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Au-delà du classement, le Palmarès est un outil au service de tous : il aide les familles à faire des choix éclairés, valorise les bonnes pratiques des établissements les plus performants, et donne aux décideurs une photographie objective de la qualité de l'offre éducative sur l'ensemble du territoire national.
            </p>
          </div>
        </div>

        {/* FICHE D'ÉVALUATION DOWNLOAD CTA (PROTECTED) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-600/10 border-2 border-amber-400/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fcb303] to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <FileText size={28} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Document Officiel
              </span>
              <h3 className="font-black text-slate-900 text-lg md:text-xl">Fiche d'Évaluation École — Édition 2026</h3>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Consultez et téléchargez la fiche de critères et la grille d'audit officielle pour les établissements scolaires.
              </p>
            </div>
          </div>

          {isSubscribedToPalmares ? (
            <a
              href={evalDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3.5 bg-[#18bfd6] hover:bg-[#15adc1] text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#18bfd6]/20 transition-all shrink-0 group cursor-pointer"
            >
              <Download size={16} className="text-[#fcb303] group-hover:scale-110 transition-transform" />
              <span>Télécharger la Fiche d'Évaluation</span>
              <ExternalLink size={14} className="text-white/80" />
            </a>
          ) : (
            <button
              onClick={handleSubscribePalmares}
              className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Lock size={16} className="text-amber-200" />
              <span>S'abonner (250 000 GNF/an)</span>
            </button>
          )}
        </div>
      </div>

      {/* PAYWALL / CLASSEMENT DES ÉCOLES */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#18bfd6]/10 rounded-2xl flex items-center justify-center text-[#18bfd6]">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Classement des Établissements</h2>
              <p className="text-xs text-slate-500 font-medium">Écoles primaires, collèges & lycées d'excellence en Guinée.</p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Tarif : 250 000 GNF / an
          </span>
        </div>

        {!isSubscribedToPalmares ? (
          <div className="relative bg-gradient-to-br from-slate-900 via-amber-950/80 to-slate-900 rounded-[32px] p-8 md:p-12 text-white shadow-2xl border-2 border-amber-500/30 overflow-hidden text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-3xl mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
              <Lock size={40} className="animate-pulse" />
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <span className="inline-block bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                Accès Restreint · Pass Payant
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Palmarès National des Écoles — 250.000 GNF / an
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                L'accès à la consultation intégrale du classement des établissements scolaires guinéens, aux fiches de notation détaillées et aux rapports d'audit officiels nécessite l'activation du <strong>Pass Palmarès Annuel</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <Trophy className="text-amber-400 mb-1" size={20} />
                <h4 className="font-extrabold text-xs text-white">Classement National</h4>
                <p className="text-[11px] text-slate-300">Écoles primaires, collèges & lycées publics et privés</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <ShieldCheck className="text-emerald-400 mb-1" size={20} />
                <h4 className="font-extrabold text-xs text-white">Fiches d'Évaluation</h4>
                <p className="text-[11px] text-slate-300">Grilles d'audit complètes sur 8 axes pédagogiques</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
                <Award className="text-amber-400 mb-1" size={20} />
                <h4 className="font-extrabold text-xs text-white">Mises à jour 365 Jours</h4>
                <p className="text-[11px] text-slate-300">Statistiques et révisions officielles annuelles</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <button
                onClick={handleSubscribePalmares}
                disabled={paying}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-105"
              >
                {paying ? (
                  <><EduLoading message="" /> Connexion au paiement...</>
                ) : (
                  <><CreditCard size={18} /> Débloquer le Palmarès (250 000 GNF / an)</>
                )}
              </button>
            </div>
          </div>
        ) : loading ? (
          <EduLoading message="Calcul du palmarès..." />
        ) : schools.length === 0 ? (
          <div className="bg-white p-12 rounded-[32px] text-center border border-slate-100 shadow-xs space-y-3">
            <Trophy className="mx-auto text-slate-300" size={48} />
            <h3 className="text-lg font-bold text-slate-800">Aucun palmarès publié pour le moment</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Les travaux d'audit et de consolidation des classements officiels sont en cours par le comité d'évaluation Kharandi.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {schools.map((s: any, i: number) => (
              <motion.div
                key={s.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-[24px] shadow-xs border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-50 to-teal-100 text-[#18bfd6] rounded-2xl flex items-center justify-center font-black text-xl shrink-0 border border-cyan-200/50">
                  #{s.rank}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-black text-slate-900 mb-1">{s.name}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 font-semibold">
                    {s.location && <span className="flex items-center gap-1"><MapPin size={14} /> {s.location}</span>}
                    {s.school_type && <span className="flex items-center gap-1"><Users size={14} /> {s.school_type}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl text-amber-700 font-black text-sm border border-amber-200/60">
                  <Star size={16} className="fill-amber-400 text-amber-400" /> {s.score}/100
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* VISION SECTION - COULEURS KHARANDI */}
      <div className="bg-gradient-to-br from-[#18bfd6] via-[#129bb0] to-[#0d6f7e] rounded-[32px] p-8 md:p-10 text-white shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-[#fcb303]">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-100">Perspective & Avenir</span>
            <h3 className="text-2xl font-black text-white">Vision & Engagement Continu</h3>
          </div>
        </div>

        <div className="space-y-4 text-sm text-cyan-50 leading-relaxed font-normal">
          <p>
            Le <strong>Palmarès National des Écoles de Guinée</strong> n'est pas une fin en soi : c'est un point de départ. Chaque établissement classé reçoit un rapport détaillé mettant en évidence ses points forts et ses axes de progrès, dans une logique d'amélioration continue plutôt que de simple compétition.
          </p>
          <p>
            En valorisant l'excellence sous toutes ses formes (académique, pédagogique, humaine et innovante), <strong>Kharandi</strong> souhaite contribuer, aux côtés du Ministère de l'Éducation, des familles et de la communauté éducative, à l'émergence d'un système scolaire guinéen toujours plus performant, équitable et tourné vers l'avenir.
          </p>
        </div>

        <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-yellow-200 font-extrabold text-xs">
            <Calendar size={16} />
            <span>Rendez-vous chaque année en septembre pour la cérémonie officielle de remise des distinctions et la publication du nouveau Palmarès national.</span>
          </div>

          <a
            href={evalDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-2 border border-white/30"
          >
            <FileText size={14} className="text-[#fcb303]" />
            <span>Consulter la Fiche d'Évaluation</span>
          </a>
        </div>
      </div>

    </div>
  );
};
