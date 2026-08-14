import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  GraduationCap, 
  Gift, 
  Loader2, 
  AlertCircle, 
  Star, 
  Store, 
  School, 
  Award, 
  ArrowRight, 
  UserCheck, 
  Coins, 
  Target,
  Trophy
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { getPlans, getSubscriptionStatus, initiateSubscription } from '../../services/payments';

type TabType = 'STUDENT' | 'PALMARES' | 'TUTOR' | 'SELLER' | 'CERTIFICATION';

export const Subscription: React.FC = () => {
  const { userProfile } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [fetchingData, setFetchingData] = useState(true);
  
  // New Interactive states
  const [activeTab, setActiveTab] = useState<TabType>('STUDENT');
  
  // Section B: Tutor Options
  const [tutorPeriod, setTutorPeriod] = useState<'ANNUAL_1' | 'ANNUAL_2'>('ANNUAL_1'); // SEMESTER (50K) vs TRIMESTER (50K)
  const [tutorOptionHighlight, setTutorOptionHighlight] = useState(false); // +20K GNF / mois
  
  // Section C: Seller Options
  const [sellerOptionHighlight, setSellerOptionHighlight] = useState(false); // +20K GNF / mois
  const [sellerOptionBoost, setSellerOptionBoost] = useState(false); // +15K GNF / semaine

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, statusData] = await Promise.all([
          getPlans(),
          getSubscriptionStatus(),
        ]);
        setPlans(plansData || []);
        setSubscriptionStatus(statusData);
      } catch (err) {
        console.error('Erreur chargement abonnements:', err);
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (planId: string, price: number) => {
    if (!userProfile) {
      toast.error('Vous devez être connecté.');
      return;
    }

    setLoadingPlanId(planId);
    setLoading(true);

    try {
      if (price === 0) {
        await initiateSubscription(planId);
        toast.success('Forfait gratuit activé !');
        window.dispatchEvent(new CustomEvent('auth:reload-profile'));
        const status = await getSubscriptionStatus();
        setSubscriptionStatus(status);
      } else {
        const result = await initiateSubscription(planId);
        if (result?.payment_url) {
          window.location.href = result.payment_url;
        } else {
          toast.error('Impossible de générer le lien de paiement.');
        }
      }
    } catch (err: any) {
      console.error('Erreur abonnement:', err);
      toast.error(err.response?.data?.message || "Erreur lors de l'activation.");
    } finally {
      setLoading(false);
      setLoadingPlanId(null);
    }
  };

  const handleDirectPayment = async (amount: number, label: string) => {
    if (!userProfile) {
      toast.error('Vous devez être connecté pour vous abonner.');
      return;
    }
    setLoading(true);
    try {
      const { initiatePayment } = await import('../../services/payments');
      const data = await initiatePayment({ amount, currency: "GNF" });
      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error("Impossible de générer le lien de paiement.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to purchase the Student Plan using either mapping or direct checkout
  const handleStudentPurchase = () => {
    // Try to find the real Student / Annual plan in the database list
    const matchedPlan = plans.find(p => {
      const name = (p.name || '').toLowerCase();
      const hasStudentKeywords = name.includes('élève') || name.includes('eleve') || name.includes('etudiant') || name.includes('étudiant') || name.includes('student');
      return hasStudentKeywords || p.price === 45000 || p.id === 'student' || p.id === 'eleve';
    });
    
    if (matchedPlan) {
      handleSubscribe(matchedPlan.id, matchedPlan.price);
    } else {
      handleSubscribe('student', 45000);
    }
  };

  // Helper to purchase Tutor Plan with active choices
  const handleTutorPurchase = () => {
    let price = 50000; // Base is 50 000 GNF
    if (tutorOptionHighlight) {
      price += 20000; // + 20 000 GNF/mois highlight
    }
    const matchedPlan = plans.find(p => p.id === 'tutor' || p.id === 'repetiteur' || (p.name || '').toLowerCase().includes('répétiteur') || (p.name || '').toLowerCase().includes('tuteur'));
    if (matchedPlan) {
      handleSubscribe(matchedPlan.id, price);
    } else {
      handleSubscribe('tutor', price);
    }
  };

  // Helper to purchase Seller Plan with active choices
  const handleSellerPurchase = () => {
    let price = 50000; // Base is 50 000 GNF
    if (sellerOptionHighlight) price += 20000;
    if (sellerOptionBoost) price += 15000;
    const matchedPlan = plans.find(p => p.id === 'seller' || p.id === 'vendeur' || (p.name || '').toLowerCase().includes('vendeur') || (p.name || '').toLowerCase().includes('boutique'));
    if (matchedPlan) {
      handleSubscribe(matchedPlan.id, price);
    } else {
      handleSubscribe('seller', price);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={44} />
          <p className="text-slate-500 font-bold">Chargement de la grille tarifaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
          Abonnements <span className="text-primary">Kharandi</span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
          Choisissez l'offre qui correspond le mieux à vos besoins d'apprentissage, de tutorat ou de commerce.
        </p>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 bg-slate-100 p-2 rounded-[24px] mb-10 max-w-4xl mx-auto border border-slate-200/50 shadow-inner">
        {[
          { id: 'STUDENT', label: 'Espace Élève', icon: GraduationCap, color: 'hover:text-primary' },
          { id: 'PALMARES', label: 'Pass Palmarès (250K)', icon: Trophy, color: 'hover:text-amber-600' },
          { id: 'TUTOR', label: 'Répétiteurs', icon: UserCheck, color: 'hover:text-secondary' },
          { id: 'SELLER', label: 'Vendeur (Boutique)', icon: Store, color: 'hover:text-accent' },
          { id: 'CERTIFICATION', label: 'Formations', icon: Award, color: 'hover:text-secondary' },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${tab.color} ${
                isSelected 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/70' 
                  : 'text-slate-500 hover:bg-white/40'
              }`}
            >
              <Icon size={16} className={isSelected ? 'text-primary' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENTS */}
      <div className="min-h-[450px]">
        
        {/* A. ABONNEMENT ELEVE / ETUDIANT */}
        {activeTab === 'STUDENT' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="bg-blue-100 text-blue-700 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Formule Annuelle</span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">Abonnement Élève / Étudiant</h2>
                <p className="text-slate-500 mt-2 font-medium">
                  Le compagnon d'apprentissage ultime conçu pour les élèves guinéens. Un accès illimité, ludique et enrichi pour propulser vos notes de classe et examens.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Tous les cours, vidéos et fiches pédagogiques",
                  "Exercices interactifs avec correction automatique",
                  "Suivi scolaire personnalisé et tableau de bord",
                  "Wallet de points et système de récompenses",
                  "Karamö, le prof virtuel intelligent disponible 24h/24"
                ].map((feat, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-xs font-semibold text-slate-600 flex items-start gap-2.5">
                <AlertCircle size={16} className="text-sky-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Saviez-vous ?</strong> Les exercices permettent d'accumuler des points cumulables dans votre wallet, échangeables contre des cadeaux scolaires et de généreuses récompenses !
                </p>
              </div>
            </div>

            <div className="md:col-span-5 bg-white border-2 border-primary/20 rounded-[32px] p-8 shadow-xl relative flex flex-col justify-between h-full min-h-[380px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-6 -mt-6 overflow-hidden" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md z-10">
                Recommandé
              </div>

              <div className="mt-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Prix Unique</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-black text-slate-900 leading-none">45 000</span>
                  <span className="text-xl font-bold text-slate-400">GNF</span>
                  <span className="text-slate-400 font-extrabold text-xs ml-1">/ an</span>
                </div>
                <p className="text-xs font-bold text-green-600 bg-green-50 inline-block px-2.5 py-1 rounded-lg mt-2">
                  ~ 5 000 GNF / mois seulement
                </p>
              </div>

              <div className="h-[1px] bg-slate-100 my-6" />

              <div className="space-y-4">
                <button
                  onClick={handleStudentPurchase}
                  disabled={loading}
                  className="w-full py-4 text-sm font-black text-white bg-primary hover:bg-primary/95 rounded-2xl shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Demande de paiement...</>
                  ) : (
                    <>S'abonner maintenant <ArrowRight size={16} /></>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-extrabold uppercase">
                  Paiement Mobile Money Sécurisé
                </p>
              </div>
            </div>
          </div>
        )}

        {/* B. PASS PALMARES NATIONAL DES ECOLES */}
        {activeTab === 'PALMARES' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                  Pass Exclusif Annuel
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">Pass Palmarès National des Écoles</h2>
                <p className="text-slate-500 mt-2 font-medium">
                  Accès privilégié et illimité au classement officiel des établissements scolaires guinéens (écoles primaires, collèges et lycées, publics et privés), rapports d'audit détaillés et statistiques de performance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Classement intégral des meilleures écoles de Guinée",
                  "Audits détaillés selon les 8 dimensions de qualité",
                  "Téléchargement des fiches d'évaluation officielles",
                  "Statistiques comparatives par région et préfecture",
                  "Mises à jour annuelles et palmarès des examens nationaux"
                ].map((feat, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-amber-700" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs font-semibold text-slate-700 flex items-start gap-2.5">
                <Trophy size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Un classement de référence :</strong> Le Palmarès Kharandi est le baromètre national reconnu pour orienter les familles et valoriser l'excellence des établissements scolaires en Guinée.
                </p>
              </div>
            </div>

            <div className="md:col-span-5 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-600/10 border-2 border-amber-400/60 rounded-[32px] p-8 shadow-xl relative flex flex-col justify-between h-full min-h-[380px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-6 -mt-6 overflow-hidden" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md z-10">
                Offre Palmarès
              </div>

              <div className="mt-4">
                <p className="text-xs font-black text-amber-900/60 uppercase tracking-wider mb-1">Tarif Annuel</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-black text-slate-900 leading-none">250 000</span>
                  <span className="text-xl font-bold text-slate-500">GNF</span>
                  <span className="text-slate-400 font-extrabold text-xs ml-1">/ an</span>
                </div>
                <p className="text-xs font-bold text-amber-800 bg-amber-100/80 inline-block px-2.5 py-1 rounded-lg mt-2 border border-amber-200">
                  Accès illimité 365 jours
                </p>
              </div>

              <div className="h-[1px] bg-amber-200/50 my-6" />

              <div className="space-y-4">
                <button
                  onClick={() => handleSubscribe('palmares', 250000)}
                  disabled={loading}
                  className="w-full py-4 text-sm font-black text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-2xl shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Génération du paiement...</>
                  ) : (
                    <>S'abonner au Palmarès (250 000 GNF/an) <ArrowRight size={16} /></>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-extrabold uppercase">
                  Paiement Mobile Money Sécurisé
                </p>
              </div>
            </div>
          </div>
        )}

        {/* B. FORFAIT REPETITEUR */}
        {activeTab === 'TUTOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            <div className="lg:col-span-12 mb-2">
              <span className="bg-indigo-100 text-indigo-700 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Espace Professionnel</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Forfait Répétiteur</h2>
              <p className="text-slate-500 mt-1 font-medium">
                Augmentez votre visibilité et obtenez plus d'élèves en publiant et promouvant vos annonces de cours particuliers.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {/* Option Select */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4">
                <p className="text-sm font-black text-slate-900">1. Tarif d'abonnement de base :</p>
                
                <div className="p-4 bg-white border-2 border-indigo-500 rounded-2xl flex justify-between items-center shadow-inner">
                  <div>
                    <span className="text-xs font-black text-slate-800">Forfait Standard Répétiteur</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Publication complète de vos annonces et profils.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600 font-mono">50 000 GNF</p>
                    <p className="text-[10px] text-slate-400 font-extrabold">/ semestre</p>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-200 my-1" />

                <p className="text-sm font-black text-slate-900">2. Options visibilité additionnelles (Facultatives) :</p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50/80 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={tutorOptionHighlight} 
                      onChange={(e) => setTutorOptionHighlight(e.target.checked)}
                      className="mt-1 accent-indigo-600 h-4 w-4 shrink-0" 
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                        Mise en avant profil <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[9px] font-black">+ 20 000 GNF / mois</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Votre profil s'affiche en premier dans la liste de recherche des élèves et parents.</p>
                    </div>
                  </label>

                  <div className="flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl opacity-80">
                    <div className="mt-1 bg-amber-100 text-amber-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase shrink-0">Bientôt</div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block">
                        Boost visibilité premium <span className="text-slate-400 font-bold">· Sur devis</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Campagnes hyper-ciblées sur WhatsApp et e-mail auprès des parents de votre quartier.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-8 -mt-8" />
              
              <div>
                <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">Résumé de commande</span>
                <h3 className="text-2xl font-black mt-3">Votre forfait</h3>
                
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="text-white/70 font-bold">Forfait Répétiteur</span>
                    <span className="font-extrabold">50 000 GNF</span>
                  </div>
                  {tutorOptionHighlight && (
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="text-white/70 font-bold">Mise en avant profil</span>
                      <span className="font-extrabold text-indigo-300">+ 20 000 GNF</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-0.5">Total à payer</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black leading-none">
                    {(50000 + (tutorOptionHighlight ? 20000 : 0)).toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-indigo-300">GNF</span>
                  <span className="text-white/40 text-[10px] font-bold">
                    / Semestre
                  </span>
                </div>

                <button
                  onClick={handleTutorPurchase}
                  disabled={loading}
                  className="w-full py-4 text-sm font-black text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-lg mt-6 shadow-indigo-500/10 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Initialisation...</>
                  ) : (
                    <>Confirmer et S'abonner <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* C. FORFAIT VENDEUR — KHARANDI MAKITI */}
        {activeTab === 'SELLER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            <div className="lg:col-span-12 mb-2">
              <span className="bg-amber-100 text-amber-700 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Espace Boutique</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Forfait Vendeur — Boutique</h2>
              <p className="text-slate-500 mt-1 font-medium">
                Vendez vos livres, manuels, fournitures scolaires ou uniformes d’écoles auprès de notre vaste communauté d'élèves et parents.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4">
                <p className="text-sm font-black text-slate-900">1. Période de souscription de base :</p>
                <div className="p-4 bg-white border-2 border-amber-500 rounded-2xl flex justify-between items-center shadow-inner">
                  <div>
                    <span className="text-xs font-black text-slate-800">Forfait Standard Boutique (Année 1)</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Accès catalogue complet & outils d'encaissement.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-amber-600">50 000 GNF</p>
                    <p className="text-[10px] text-slate-400 font-extrabold">/ semestre</p>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-200 my-1" />

                <p className="text-sm font-black text-slate-900">2. Options marketing de visibilité (Optionnel) :</p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50/80 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={sellerOptionHighlight} 
                      onChange={(e) => setSellerOptionHighlight(e.target.checked)}
                      className="mt-1 accent-amber-500 h-4 w-4 shrink-0" 
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                        Mise en avant boutique <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[9px] font-black">+ 20 000 GNF / mois</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Votre boutique obtient un badge officiel et s'affiche dans le carrousel des meilleurs prestataires.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50/80 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={sellerOptionBoost} 
                      onChange={(e) => setSellerOptionBoost(e.target.checked)}
                      className="mt-1 accent-amber-500 h-4 w-4 shrink-0" 
                    />
                    <div>
                      <span className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                        Boost produit individuel <span className="text-amber-100 bg-amber-600 text-white px-2 py-0.5 rounded text-[9px] font-black">+ 15 000 GNF / semaine</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Doublez vos clics en plaçant un produit vedette directement sur le flux central des devoirs d'élèves.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-8 -mt-8" />
              
              <div>
                <span className="bg-amber-500/20 text-amber-300 font-extrabold text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">Résumé de la boutique</span>
                <h3 className="text-2xl font-black mt-3">Votre forfait</h3>
                
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="text-white/70 font-bold">Standard Boutique (Année 1)</span>
                    <span className="font-extrabold">50 000 GNF</span>
                  </div>
                  {sellerOptionHighlight && (
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="text-white/70 font-bold">Mise en avant boutique</span>
                      <span className="font-extrabold text-amber-300">+ 20 000 GNF</span>
                    </div>
                  )}
                  {sellerOptionBoost && (
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="text-white/70 font-bold">Boost produit individuel</span>
                      <span className="font-extrabold text-amber-300">+ 15 000 GNF</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-0.5">Total à payer</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black leading-none">
                    {(50000 + (sellerOptionHighlight ? 20000 : 0) + (sellerOptionBoost ? 15000 : 0)).toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-amber-300">GNF</span>
                  <span className="text-white/40 text-[10px] font-bold">/ Semestre</span>
                </div>

                <button
                  onClick={handleSellerPurchase}
                  disabled={loading}
                  className="w-full py-4 text-sm font-black text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-lg mt-6 shadow-amber-500/10 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Initialisation...</>
                  ) : (
                    <>Souscrire & Propulser <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* E. FORMATIONS CERTIFIANTES */}
        {activeTab === 'CERTIFICATION' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="bg-emerald-100 text-emerald-700 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Abonnement unique de spécialité</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Formations Certifiantes</h2>
              <p className="text-slate-500 font-medium">
                Maîtrisez les outils les plus demandés du marché avec validation par la prestigieuse certification d'aptitude KHARANDI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Bureautique — Niveau de base",
                  price: 100000,
                  badge: "Niveau Base",
                  content: "Word, Excel, Windows + Certification officielle KHARANDI.",
                  bgColor: "from-emerald-50 to-emerald-100/40 border-emerald-100",
                  textColor: "text-emerald-700",
                  btnColor: "bg-emerald-600 hover:bg-emerald-700",
                },
                {
                  title: "Bureautique — Niveau avancé",
                  price: 300000,
                  badge: "Performance Pro",
                  content: "Excel avancé (tableaux de bord croisés), PowerPoint professionnel, présentations d'impact + Certification officielle KHARANDI.",
                  bgColor: "from-indigo-50 to-indigo-100/40 border-indigo-100",
                  textColor: "text-indigo-700",
                  btnColor: "bg-primary hover:bg-primary/95",
                }
              ].map((course, idx) => (
                <div key={idx} className={`bg-gradient-to-b ${course.bgColor} border-2 rounded-3xl p-6 flex flex-col justify-between shadow-sm`}>
                  <div>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 bg-white rounded-lg inline-block border ${course.textColor} border-slate-100 shadow-sm mb-3`}>
                      {course.badge}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{course.title}</h3>
                    <p className="text-xs text-slate-600 font-semibold mt-2 leading-relaxed">{course.content}</p>
                    
                    <div className="flex items-baseline gap-1 mt-4 mb-2">
                      <span className="text-2xl font-black text-slate-950">{course.price.toLocaleString()}</span>
                      <span className="text-sm font-bold text-slate-500">GNF</span>
                      <span className="text-slate-400 text-xs font-bold ml-1">· tarif unique</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDirectPayment(course.price, course.title)}
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl font-black text-white text-xs transition-all flex items-center justify-center gap-1.5 mt-4 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${course.btnColor}`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <>Acheter la formation certifiante <ArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* INFO FOOTER */}
      <div className="mt-12 flex items-start gap-4 bg-slate-50 border border-slate-200/60 rounded-[32px] p-6 text-sm text-slate-600 max-w-4xl mx-auto shadow-sm">
        <AlertCircle size={28} className="text-primary shrink-0 mt-1 animate-pulse" />
        <div className="w-full">
          <h3 className="font-black text-slate-800 text-lg mb-3">Contenus Gratuits Accessibles à Tous :</h3>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
             <p className="font-medium text-slate-700 leading-relaxed mb-4">
               Notez bien que plusieurs rubriques majeures de Kharandi restent <strong>entièrement gratuites</strong> d'accès pour toute la population :
             </p>
             <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> <span className="font-bold text-slate-700">Résultats d'examens</span></li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> <span className="font-bold text-slate-700">Bourses d'études</span></li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> <span className="font-bold text-slate-700">Études à l'étranger</span></li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">Palmarès des écoles (Payant — 250 000 GNF/an)</span></li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> <span className="font-bold text-slate-700">Actualités scolaires</span></li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> <span className="font-bold text-slate-700">Marketplace</span></li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> <span className="font-bold text-slate-700">Bons Plans</span></li>
             </ul>
             <div className="mt-5 pt-3 border-t border-slate-100">
               <p className="text-xs text-slate-500 font-medium">
                 * Les abonnements et forfaits professionnels permettent de financer la plateforme et débloquent l'accès aux capacités d'intelligence artificielle (IA) ou des services personnalisés premium avancés !
               </p>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};
