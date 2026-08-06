import React from 'react';
import { Card } from '../ui/Card';
import { SchoolIllustration } from '../ui/SchoolIllustration';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Bell, 
  Search, 
  BookOpen, 
  Flame, 
  Newspaper, 
  Megaphone, 
  User, 
  ChevronRight,
  Star,
  MessageCircle,
  ShoppingBag,
  Award,
  PenTool,
  GraduationCap,
  Users,
  PlayCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Globe,
  Trophy,
  Briefcase,
  Lock,
  Gift,
  Brain
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { HomeSkeleton } from '../ui/Skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
  const { userProfile, user } = useAuth();
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

  return (
    <div className="pb-24 md:pb-8">
      {/* Premium Header */}
      <header className="px-6 pt-10 pb-6 md:pt-12 bg-white/60 backdrop-blur-3xl sticky top-0 z-30 border-b border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
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
                      <User className="text-primary" size={26} />
                   )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm" />
              </motion.div>
              <div>
                <p className="font-extrabold text-2xl text-slate-900 leading-tight tracking-tight">
                  Salut, {userProfile?.name?.split(' ')[0] || 'Ami'} 👋
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="inline-flex items-center gap-1.5 text-secondary bg-secondary/10 px-2.5 py-1 rounded-lg font-bold text-xs border border-secondary/20">
                    <Award size={14} className="fill-secondary" /> {points} pts
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                    {role === 'student' ? 'Élève' : role}
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
                placeholder="Chercher un cours, un produit..." 
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
        
        {/* Dynamic Hero Carousel/Banner */}
        <motion.div variants={itemVariants} className="relative w-full rounded-[32px] overflow-hidden shadow-2xl bg-slate-900">
           <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 opacity-90" />
           <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 blur-3xl rounded-full pointer-events-none" />
           <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/30 blur-3xl rounded-full pointer-events-none" />
           
           <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:max-w-xl">
                 <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white/90 text-sm font-bold mb-6 border border-white/10">
                   Karamo, ton assistant Kharandi
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                   Pose une question à ton prof virtuel <span className="text-secondary">KARAMO</span>
                 </h1>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setIsAIChatOpen(true)}
                   className="w-full sm:w-auto px-8 py-4 bg-secondary text-slate-900 rounded-[20px] font-extrabold hover:bg-white transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 text-lg"
                 >
                   <MessageCircle size={22} className="fill-slate-900/10" /> Poser une question
                 </motion.button>
              </div>
              <div className="hidden md:block w-72 h-72">
              </div>
           </div>
        </motion.div>

        {/* Quick Access Categories */}
        <motion.div variants={itemVariants}>
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explorer</h2>
           </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <QuickAccessCard 
                 title="Résultats d'examens"
                 subtitle="Résultats officiels (BEPC, BAC, concours) en temps réel"
                 icon={Award}
                 color="bg-primary"
                 textColor="text-primary"
                 delay={0.1}
                 onClick={() => setActiveTab('Résultats')}
              />
              <QuickAccessCard 
                 title="Bourses"
                 subtitle="Répertoire des bourses selon le niveau, le profil et les ambitions"
                 icon={Briefcase}
                 color="bg-secondary"
                 textColor="text-secondary"
                 delay={0.2}
                 onClick={() => setActiveTab('Bourses')}
              />
              <QuickAccessCard 
                 title="Actualités scolaires"
                 subtitle="Examens, réformes, opportunités — Guinée et international"
                 icon={Newspaper}
                 color="bg-accent"
                 textColor="text-accent"
                 delay={0.3}
                 onClick={() => setActiveTab('Actualités')}
              />
              <QuickAccessCard 
                 title="Marketplace"
                 subtitle="Accès en lecture à l'espace de dépense des points"
                 icon={ShoppingBag}
                 color="bg-primary"
                 textColor="text-primary"
                 delay={0.4}
                 onClick={() => setActiveTab('Kharandi Makiti')}
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
              <QuickAccessCard 
                 title="Études à l'étranger"
                 subtitle="Programmes, universités et opportunités d'études internationales"
                 icon={Globe}
                 color="bg-secondary"
                 textColor="text-secondary"
                 delay={0.5}
                 onClick={() => setActiveTab('Études à l’étranger')}
              />
              <QuickAccessCard 
                 title="Palmarès des écoles"
                 subtitle="Classement des établissements par performances et résultats"
                 icon={Trophy}
                 color="bg-accent"
                 textColor="text-accent"
                 delay={0.6}
                 onClick={() => setActiveTab('Palmarès')}
              />
              <QuickAccessCard 
                 title="Bons Plans"
                 subtitle="Offres ciblées, publicités éducatives et opportunités personnalisées"
                 icon={Gift}
                 color="bg-primary"
                 textColor="text-primary"
                 delay={0.7}
                 imageUrl="https://lh3.googleusercontent.com/d/1X5CDiqzmnmDy1_I9Cu_jyh-SEBZhYKLS"
                 onClick={() => {
                   window.open("https://drive.google.com/file/d/1X5CDiqzmnmDy1_I9Cu_jyh-SEBZhYKLS/view?usp=sharing", "_blank");
                 }}
              />
              <QuickAccessCard 
                 title="Parcours (Gratuit)"
                 subtitle="Chaque type d'utilisateur peut visualiser le chemin qui lui est propre et les fonctionnalités qui lui sont dédiées à travers des vidéos et visuels explicatifs"
                 icon={Users}
                 color="bg-secondary"
                 textColor="text-secondary"
                 delay={0.8}
                 onClick={() => setActiveTab('Onboarding')}
              />
              <QuickAccessCard 
                 title="Calcul mental — Abacus"
                 subtitle="Boulier japonais Soroban, leçons guidées et entraînement Anzan flash"
                 icon={Brain}
                 color="bg-[#18bfd6]"
                 textColor="text-[#18bfd6]"
                 delay={0.9}
                 onClick={() => setActiveTab('Calcul mental')}
              />
            </div>
        </motion.div>

        {/* Parcours utilisateurs */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary to-primary/80 rounded-[24px] p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative mb-6">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex-1">
            <h3 className="text-2xl font-bold mb-2">🗺️ Parcours utilisateurs</h3>
            <p className="text-white/80 max-w-xl text-sm md:text-base">
              Découvre comment utiliser Kharandi selon ton profil : élève, parent, répétiteur ou vendeur. Le guide complet étape par étape.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('Onboarding')}
            className="w-full sm:w-auto relative z-10 bg-white text-primary px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
          >
            Voir mon guide
          </button>
        </motion.div>

        {/* Bons Plans Banner */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary to-secondary rounded-[24px] p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex-1">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <img 
                src="https://lh3.googleusercontent.com/d/1X5CDiqzmnmDy1_I9Cu_jyh-SEBZhYKLS" 
                alt="Bons Plans" 
                className="w-12 h-12 rounded-xl object-contain mr-2 inline-block border-2 border-white/25 bg-white cursor-pointer hover:scale-110 transition-transform shadow-md" 
                referrerPolicy="no-referrer"
                onClick={() => window.open("https://drive.google.com/file/d/1X5CDiqzmnmDy1_I9Cu_jyh-SEBZhYKLS/view?usp=sharing", "_blank")} 
              /> 
              Bons Plans & Opportunités
            </h3>
            <p className="text-white/90 max-w-xl text-sm md:text-base">
              Découvre nos offres partenaires, réductions exclusives sur les fournitures et opportunités éducatives personnalisées pour toi.
            </p>
          </div>
          <button
            disabled
            className="w-full sm:w-auto relative z-10 bg-white/50 text-slate-400 px-6 py-3 rounded-xl font-bold cursor-not-allowed opacity-50 select-none"
          >
            Bientôt disponible
          </button>
        </motion.div>



        {/* Recommended for you */}
        {/* Section removed as requested to eliminate demo data */}

      </motion.main>
    </div>
  );
};

// Sub-components
const QuickAccessCard = ({ title, subtitle, icon: Icon, color, textColor, delay, onClick, premium, imageUrl }: any) => (
  <motion.div
     variants={itemVariants}
     whileHover={{ y: -8, scale: 1.02 }}
     whileTap={{ scale: 0.95 }}
     onClick={onClick}
     className="bg-white rounded-[28px] p-5 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between min-h-[180px] h-auto group relative overflow-hidden pb-6"
  >
     {imageUrl ? (
       <div className="absolute inset-0 opacity-[0.08] hover:opacity-15 group-hover:scale-110 transition-all duration-700 pointer-events-none">
         <img src={imageUrl} alt={title} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
       </div>
     ) : (
       <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500`} />
     )}
     <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${color} bg-opacity-10 mb-4`}>
           <Icon size={24} className={textColor} />
        </div>
        {premium && (
           <div className="bg-slate-100 p-1.5 rounded-xl text-slate-400">
              <Lock size={14} />
           </div>
        )}
     </div>
     <div>
        <h3 className="font-extrabold text-[13px] text-slate-900 leading-tight mb-0.5">{title}</h3>
        <p className="text-[10.5px] font-medium text-slate-400 leading-normal">{subtitle}</p>
     </div>
  </motion.div>
);

const RecommendationCard = ({ title, type, price, image }: any) => (
  <motion.div 
     whileHover={{ y: -6 }}
     className="bg-white rounded-[28px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100 cursor-pointer"
  >
     <div className={`w-full h-36 ${image} rounded-[20px] mb-4 flex items-center justify-center overflow-hidden relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <TrendingUp size={32} className="text-slate-300 relative z-10" />
     </div>
     <div className="px-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{type}</span>
        <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight truncate">{title}</h3>
        <span className="inline-block px-3 py-1.5 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-100">
           {price}
        </span>
     </div>
  </motion.div>
);
