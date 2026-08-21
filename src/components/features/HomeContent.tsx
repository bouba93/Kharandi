import React from 'react';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Bell, 
  Search, 
  BookOpen, 
  Award, 
  MessageCircle, 
  ShoppingBag, 
  Globe, 
  Trophy, 
  Briefcase, 
  Gift, 
  Brain,
  Users,
  Shield,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Package,
  FileText,
  UserCheck,
  Newspaper
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { HomeSkeleton } from '../ui/Skeleton';
import { KharandiIcon, KharandiIconName } from '../icons/KharandiIcon';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const HomeContent: React.FC<{ 
  role: string, 
  setActiveTab: (tab: string) => void,
  setIsAIChatOpen: (open: boolean) => void,
  onSearch?: (query: string) => void,
  onCourseSelect?: (courseId: string) => void
}> = ({ role, setActiveTab, setIsAIChatOpen, onSearch, onCourseSelect }) => {
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { userProfile, user, isGuest } = useAuth();
  const points = userProfile?.points || 0;

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        setActiveTab('Sujets et traités');
      }
    }
  };

  if (loading) return <HomeSkeleton />;

  // Role-specific theme & config
  const roleConfig = {
    student: {
      title: "Espace Élève & Étudiant",
      badgeText: "🎓 Élève / Étudiant",
      heroBg: "from-blue-600 via-indigo-600 to-cyan-500",
      heroAccent: "bg-cyan-400 text-slate-950",
      heroTitle: "Prépare tes examens avec Karamo et les sujets corrigés",
      heroDesc: "Accède aux annales officielles CEE, BEPC, BAC, entraîne-toi au calcul mental Abacus et décroche tes bourses.",
      primaryActionText: "Poser une question à Karamo",
      primaryActionIcon: MessageCircle,
      primaryActionClick: () => setIsAIChatOpen(true),
      stats: [
        { label: "Points acquis", val: `${points} pts`, icon: Award, color: "text-amber-400" },
        { label: "Examens & QCM", val: "100+ sujets", icon: FileText, color: "text-cyan-300" },
        { label: "Niveau", val: "Actif", icon: TrendingUp, color: "text-emerald-300" }
      ],
      quickAccess: [
        { title: "Sujets & Traités", subtitle: "CEE, BEPC, BAC corrigés", icon: Award, kIcon: "examen" as KharandiIconName, tab: "Sujets et traités", color: "bg-blue-600" },
        { title: "Calcul mental — Abacus", subtitle: "Boulier Soroban & Anzan flash", icon: Brain, kIcon: "abacus" as KharandiIconName, tab: "Calcul mental", color: "bg-cyan-500" },
        { title: "Bourses d'études", subtitle: "Opportunités nationales et internationales", icon: Briefcase, kIcon: "bourse" as KharandiIconName, tab: "Bourses", color: "bg-indigo-600" },
        { title: "Études à l'étranger", subtitle: "Programmes & universités partenaires", icon: Globe, kIcon: "voyage" as KharandiIconName, tab: "Études à l’étranger", color: "bg-teal-600" },
        { title: "Actualités scolaires", subtitle: "Réformes et infos examens en Guinée", icon: Newspaper, kIcon: "actualites" as KharandiIconName, tab: "Actualités", color: "bg-blue-500" },
        { title: "Palmarès des écoles", subtitle: "Classements officiels des établissements", icon: Trophy, kIcon: "palmares" as KharandiIconName, tab: "Palmarès", color: "bg-amber-500" },
      ]
    },
    teacher: {
      title: "Espace Enseignant & Répétiteur",
      badgeText: "📚 Enseignant / Tuteur",
      heroBg: "from-emerald-700 via-teal-700 to-cyan-800",
      heroAccent: "bg-emerald-300 text-slate-950",
      heroTitle: "Gère tes cours particuliers, publie tes sujets et accompagne tes élèves",
      heroDesc: "Développe ton activité de tutorat, réponds aux demandes d'élèves en quête d'excellence et partage tes supports pédagogiques.",
      primaryActionText: "Gérer mes cours",
      primaryActionIcon: BookOpen,
      primaryActionClick: () => setActiveTab('Sujets et traités'),
      stats: [
        { label: "Élèves connectés", val: "12 actifs", icon: Users, color: "text-emerald-300" },
        { label: "Cours dispensés", val: "45 sessions", icon: Award, color: "text-amber-300" },
        { label: "Rémunération", val: "3 200 000 GNF", icon: DollarSign, color: "text-teal-300" }
      ],
      quickAccess: [
        { title: "Mes Cours & Élèves", subtitle: "Suivi des sessions et progression", icon: Users, kIcon: "eleve" as KharandiIconName, tab: "Sujets et traités", color: "bg-emerald-600" },
        { title: "Bibliothèque Pédagogique", subtitle: "Ressources, fiches et exercices", icon: BookOpen, kIcon: "bibliotheque" as KharandiIconName, tab: "Bibliothèque", color: "bg-teal-600" },
        { title: "Demandes de Tutorat", subtitle: "Mise en relation avec des parents", icon: UserCheck, kIcon: "aide" as KharandiIconName, tab: "Support", color: "bg-cyan-600" },
        { title: "Portefeuille & Gains", subtitle: "Suivi de revenus et paiements", icon: DollarSign, kIcon: "boutique" as KharandiIconName, tab: "Portefeuille", color: "bg-emerald-700" },
      ]
    },
    repetiteur: {
      title: "Espace Enseignant & Répétiteur",
      badgeText: "📚 Enseignant / Tuteur",
      heroBg: "from-emerald-700 via-teal-700 to-cyan-800",
      heroAccent: "bg-emerald-300 text-slate-950",
      heroTitle: "Gère tes cours particuliers, publie tes sujets et accompagne tes élèves",
      heroDesc: "Développe ton activité de tutorat, réponds aux demandes d'élèves en quête d'excellence et partage tes supports pédagogiques.",
      primaryActionText: "Gérer mes cours",
      primaryActionIcon: BookOpen,
      primaryActionClick: () => setActiveTab('Sujets et traités'),
      stats: [
        { label: "Élèves connectés", val: "12 actifs", icon: Users, color: "text-emerald-300" },
        { label: "Cours dispensés", val: "45 sessions", icon: Award, color: "text-amber-300" },
        { label: "Rémunération", val: "3 200 000 GNF", icon: DollarSign, color: "text-teal-300" }
      ],
      quickAccess: [
        { title: "Mes Cours & Élèves", subtitle: "Suivi des sessions et progression", icon: Users, kIcon: "eleve" as KharandiIconName, tab: "Sujets et traités", color: "bg-emerald-600" },
        { title: "Bibliothèque Pédagogique", subtitle: "Ressources, fiches et exercices", icon: BookOpen, kIcon: "bibliotheque" as KharandiIconName, tab: "Bibliothèque", color: "bg-teal-600" },
        { title: "Demandes de Tutorat", subtitle: "Mise en relation avec des parents", icon: UserCheck, kIcon: "aide" as KharandiIconName, tab: "Support", color: "bg-cyan-600" },
        { title: "Portefeuille & Gains", subtitle: "Suivi de revenus et paiements", icon: DollarSign, kIcon: "boutique" as KharandiIconName, tab: "Portefeuille", color: "bg-emerald-700" },
      ]
    },
    parent: {
      title: "Espace Parent d'élève",
      badgeText: "👨‍👩‍👧 Parent",
      heroBg: "from-indigo-700 via-purple-700 to-violet-800",
      heroAccent: "bg-purple-300 text-slate-950",
      heroTitle: "Suivez la scolarité de vos enfants et trouvez les meilleurs répétiteurs",
      heroDesc: "Consultez les bulletins, suivez les progrès aux examens et offrez à vos enfants un accompagnement pédagogique de premier ordre.",
      primaryActionText: "Trouver un répétiteur",
      primaryActionIcon: UserCheck,
      primaryActionClick: () => setActiveTab('Sujets et traités'),
      stats: [
        { label: "Enfants suivis", val: "2 inscrits", icon: Users, color: "text-purple-300" },
        { label: "Moyenne générale", val: "15.4 / 20", icon: Award, color: "text-indigo-300" },
        { label: "Abonnement", val: "Actif (Annuel)", icon: CheckCircle2, color: "text-emerald-300" }
      ],
      quickAccess: [
        { title: "Suivi des Enfants", subtitle: "Bulletins, notes et présence", icon: Users, kIcon: "eleve" as KharandiIconName, tab: "Sujets et traités", color: "bg-indigo-600" },
        { title: "Palmarès des Écoles", subtitle: "Classement des meilleurs lycées et collèges", icon: Trophy, kIcon: "palmares" as KharandiIconName, tab: "Palmarès", color: "bg-purple-600" },
        { title: "Répétiteurs Vérifiés", subtitle: "Trouvez un prof à domicile qualifié", icon: UserCheck, kIcon: "aide" as KharandiIconName, tab: "Support", color: "bg-violet-600" },
        { title: "Actualités & Examens", subtitle: "Calendrier officiel des épreuves", icon: Newspaper, kIcon: "actualites" as KharandiIconName, tab: "Actualités", color: "bg-indigo-700" },
      ]
    },
    seller: {
      title: "Espace Vendeur & Marchand",
      badgeText: "🛍️ Vendeur — Kharandi Makiti",
      heroBg: "from-amber-600 via-orange-600 to-amber-800",
      heroAccent: "bg-amber-200 text-slate-950",
      heroTitle: "Gérez votre boutique et vendez vos fournitures sur Kharandi Makiti",
      heroDesc: "Publiez vos manuels, cahiers, kits scolaires et gadgets éducatifs à destination d'une communauté active de parents et d'élèves.",
      primaryActionText: "Gérer ma boutique",
      primaryActionIcon: ShoppingBag,
      primaryActionClick: () => setActiveTab('Kharandi Makiti'),
      stats: [
        { label: "Produits en ligne", val: "24 articles", icon: Package, color: "text-amber-200" },
        { label: "Ventes du mois", val: "1 450 000 GNF", icon: DollarSign, color: "text-emerald-300" },
        { label: "Commandes", val: "8 en attente", icon: ShoppingBag, color: "text-orange-300" }
      ],
      quickAccess: [
        { title: "Kharandi Makiti", subtitle: "Gérer mes produits et catalogue", icon: ShoppingBag, kIcon: "boutique" as KharandiIconName, tab: "Kharandi Makiti", color: "bg-amber-600" },
        { title: "Portefeuille & Encaissements", subtitle: "Suivi des revenus e-commerce", icon: DollarSign, kIcon: "bourse" as KharandiIconName, tab: "Portefeuille", color: "bg-orange-600" },
        { title: "Commandes Clients", subtitle: "Expéditions et livraisons", icon: Package, kIcon: "examen" as KharandiIconName, tab: "Kharandi Makiti", color: "bg-amber-700" },
        { title: "Support Marchand", subtitle: "Assistance dédiée aux vendeurs", icon: MessageCircle, kIcon: "aide" as KharandiIconName, tab: "Support", color: "bg-orange-700" },
      ]
    },
    admin: {
      title: "Panneau d'Administration Global",
      badgeText: "🛡️ Administrateur",
      heroBg: "from-slate-900 via-slate-800 to-zinc-900",
      heroAccent: "bg-red-400 text-slate-950",
      heroTitle: "Supervision globale et gestion de la plateforme Kharandi",
      heroDesc: "Modération des utilisateurs, validation des paiements, gestion des abonnements et statistiques en temps réel de la plateforme.",
      primaryActionText: "Accéder à l'Admin",
      primaryActionIcon: Shield,
      primaryActionClick: () => setActiveTab('Administration'),
      stats: [
        { label: "Utilisateurs totaux", val: "1,420 inscrits", icon: Users, color: "text-cyan-300" },
        { label: "Paiements validés", val: "98.4%", icon: Shield, color: "text-emerald-300" },
        { label: "État système", val: "Optimal", icon: CheckCircle2, color: "text-amber-300" }
      ],
      quickAccess: [
        { title: "Administration Système", subtitle: "Gestion utilisateurs et rôles", icon: Shield, kIcon: "tableau_de_bord" as KharandiIconName, tab: "Administration", color: "bg-slate-900" },
        { title: "Validation Abonnements", subtitle: "Activer les forfaits annuels et pass", icon: Award, kIcon: "bourse" as KharandiIconName, tab: "Abonnements", color: "bg-red-700" },
        { title: "Support & Tickets", subtitle: "Assistance technique utilisateurs", icon: MessageCircle, kIcon: "aide" as KharandiIconName, tab: "Support", color: "bg-slate-800" },
        { title: "Actualités & Communiqués", subtitle: "Publier des annonces officielles", icon: Newspaper, kIcon: "actualites" as KharandiIconName, tab: "Actualités", color: "bg-zinc-800" },
      ]
    }
  };

  const activeRoleConfig = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;

  return (
    <div className="pb-24 md:pb-8">
      {/* Role-specific Custom Header */}
      <header className="px-6 pt-10 pb-6 md:pt-12 bg-white/80 backdrop-blur-3xl sticky top-0 z-30 border-b border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 max-w-6xl mx-auto">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
                onClick={() => setActiveTab('Dashboard utilisateur')}
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-[22px] flex items-center justify-center border-2 border-white shadow-md overflow-hidden">
                   {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                      <Users className="text-primary" size={26} />
                   )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
              </motion.div>
              <div>
                <p className="font-extrabold text-2xl text-slate-900 leading-tight tracking-tight">
                  Salut, {userProfile?.name?.split(' ')[0] || (isGuest ? 'Invité' : 'Ami')} 👋
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="inline-flex items-center gap-1.5 text-slate-900 bg-secondary px-2.5 py-1 rounded-lg font-black text-xs border border-slate-950 shadow-[1px_1px_0px_#0f172a]">
                    <Award size={14} className="fill-slate-900" /> {points} pts
                  </span>
                  <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-slate-950 shadow-[1px_1px_0px_#0f172a] ${activeRoleConfig.heroAccent}`}>
                    {activeRoleConfig.badgeText}
                  </span>
                </div>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden relative p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-primary transition-colors"
              onClick={() => setActiveTab('Notifs')}
            >
               <Bell size={22} strokeWidth={1.5} />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </motion.button>
          </div>

          <div className="flex items-center gap-4 flex-1 w-full md:max-w-md ml-auto">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Chercher un cours, un sujet, un produit..." 
                className="w-full bg-slate-50 border-2 border-transparent focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              />
            </form>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex relative p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:text-primary transition-colors"
               onClick={() => setActiveTab('Notifs')}
            >
              <Bell size={22} strokeWidth={1.5} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </motion.button>
          </div>
        </div>
      </header>
      
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 py-8 space-y-10 max-w-6xl mx-auto"
      >
        
        {/* Role-Specific Hero Banner */}
        <motion.div variants={itemVariants} className={`relative w-full rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-r ${activeRoleConfig.heroBg} text-white`}>
           <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 blur-3xl rounded-full pointer-events-none" />
           <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/20 blur-3xl rounded-full pointer-events-none" />
           
           <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full md:max-w-xl">
                 <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white/90 text-xs font-black tracking-wider uppercase mb-5 border border-white/20">
                   {activeRoleConfig.title}
                 </div>
                 <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-4 tracking-tight">
                   {activeRoleConfig.heroTitle}
                 </h1>
                 <p className="text-white/90 text-sm md:text-base font-medium mb-8 leading-relaxed">
                   {activeRoleConfig.heroDesc}
                 </p>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={activeRoleConfig.primaryActionClick}
                   className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 rounded-[20px] font-black hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-3 text-base cursor-pointer"
                 >
                   <activeRoleConfig.primaryActionIcon size={20} className="text-primary" /> {activeRoleConfig.primaryActionText}
                 </motion.button>
              </div>

              {/* Stats Column */}
              <div className="w-full md:w-auto grid grid-cols-1 gap-3 min-w-[240px]">
                 {activeRoleConfig.stats.map((st, idx) => (
                   <div key={idx} className="bg-black/30 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="text-xs text-white/70 font-bold uppercase">{st.label}</p>
                        <p className={`text-xl font-black mt-0.5 ${st.color}`}>{st.val}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <st.icon size={20} className="text-white" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </motion.div>

        {/* Quick Access Categories tailored to role */}
        <motion.div variants={itemVariants}>
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Accès rapides ({role === 'student' ? 'Élève' : role === 'teacher' || role === 'repetiteur' ? 'Enseignant' : role === 'parent' ? 'Parent' : role === 'seller' ? 'Vendeur' : 'Admin'})</h2>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {activeRoleConfig.quickAccess.map((qa, idx) => (
                <QuickAccessCard 
                   key={idx}
                   title={qa.title}
                   subtitle={qa.subtitle}
                   icon={qa.icon}
                   kIcon={qa.kIcon}
                   color={qa.color}
                   textColor="text-slate-900"
                   onClick={() => setActiveTab(qa.tab)}
                />
              ))}
           </div>
        </motion.div>

        {/* Interactive Guidance Banner */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[24px] p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex-1">
            <h3 className="text-2xl font-black mb-2 text-secondary">🗺️ Guide du Parcours & Fonctionnalités</h3>
            <p className="text-slate-300 max-w-xl text-sm md:text-base font-medium">
              Découvrez en détail toutes les possibilités offertes par Kharandi spécifiquement pour le profil <span className="text-white font-bold">{activeRoleConfig.badgeText}</span>.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('Onboarding')}
            className="w-full sm:w-auto relative z-10 bg-secondary text-slate-950 px-6 py-3.5 rounded-xl font-black shadow-lg hover:bg-white transition-all cursor-pointer"
          >
            Explorer le guide
          </button>
        </motion.div>

      </motion.main>
    </div>
  );
};

const QuickAccessCard = ({ title, subtitle, icon: Icon, kIcon, color, textColor, onClick }: any) => (
  <motion.div
     variants={itemVariants}
     whileHover={{ y: -6, scale: 1.02 }}
     whileTap={{ scale: 0.95 }}
     onClick={onClick}
     className="bg-white rounded-[28px] p-5 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between min-h-[170px] h-auto group relative overflow-hidden pb-6"
  >
     <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500`} />
     <div className="flex items-start justify-between mb-4">
        <div>
          {kIcon ? (
            <KharandiIcon name={kIcon} size={42} showBookmark={false} />
          ) : (
            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${color} bg-opacity-20`}>
               <Icon size={24} className={textColor} />
            </div>
          )}
        </div>
     </div>
     <div>
        <h3 className="font-extrabold text-[14px] text-slate-900 leading-tight mb-1">{title}</h3>
        <p className="text-[11px] font-medium text-slate-400 leading-normal line-clamp-2">{subtitle}</p>
     </div>
  </motion.div>
);
