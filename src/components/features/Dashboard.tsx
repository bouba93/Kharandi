import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, BookOpen, Home, User, Menu, X, ShoppingBag, ShoppingCart, CreditCard, MessageCircle, Shield, ShieldCheck, MessageSquare, PenTool, GraduationCap, Users, Newspaper, Award, LogOut, Lock, Globe, Trophy, Briefcase, Wallet as WalletIcon, ArrowLeft, Brain } from 'lucide-react';
import { KharandiIcon, KharandiIconName } from '../icons/KharandiIcon';
import { motion, AnimatePresence } from 'motion/react';
import { Marketplace } from './Marketplace';
import { SellerDashboard } from './SellerDashboard';
import { HomeContent } from './HomeContent';
import { Library } from './Library';
import { Notifications } from './Notifications';
import { Profile } from './Profile';
import { AITeacherChat } from './AITeacherChat';
import { Subscription } from './Subscription';
import { BackgroundDesign } from './BackgroundDesign';
import { AdminDashboard } from './AdminDashboard';
import { SupportTickets } from './SupportTickets';
import { ChatFeature } from './chat/ChatFeature';
import { Exercises } from './Exercises';
import { Tutors } from './Tutors';
import { Grades } from './Grades';
import { News } from './News';
import { Scholarships } from './Scholarships';
import { StudyAbroad } from './StudyAbroad';
import { SchoolRankings } from './SchoolRankings';
import { Results } from './Results';
import { Onboarding } from './Onboarding';
import { UserParcours } from './UserParcours';
import { AbacusModule } from './abacus/AbacusModule';
import { Wallet } from './Wallet';
import { OnboardingTutorial, useOnboarding } from './OnboardingTutorial';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';


const tabToPath: Record<string, string> = {
  'Accueil': '/',
  'Sujets et traités': '/biblio',
  'Exo Gagnant': '/exercices',
  'Mon Wallet': '/wallet',
  'Kharandi École': '/notes',
  'Répétiteurs': '/repetiteurs',
  'Kharandi Makiti': '/marche',
  'Résultats': '/resultats',
  'Bourses': '/bourses',
  'Études à l’étranger': '/etudes-etranger',
  'Palmarès': '/palmares',
  'Actualités': '/actualites',
  'Abonnements': '/abonnements',
  'Notifs': '/notifs',
  'Dashboard utilisateur': '/profil',
  'Messages': '/messages',
  'Support': '/support',
  'Calcul mental': '/abacus',
  'Administration': '/admin'
};

const inactiveTabs: string[] = [];

const pathToTab: Record<string, string> = Object.entries(tabToPath).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { userProfile, isGuest, setGuestMode, logout } = useAuth();
  const role = userProfile?.role || 'student';
  const subscriptionPlan = userProfile?.subscriptionPlan || 'free';

  const { show: showOnboardingTutorial, close: closeOnboardingTutorial } = useOnboarding(role);

  const [activeTab, setActiveTabState] = useState(pathToTab[currentPath] || 'Accueil');
  
  // SSE désactivé — Render free tier ne supporte pas les connexions longues
  // useEffect(() => {
  //   const es = new EventSource(
  //     `${import.meta.env.VITE_API_URL}/notifications/stream/`,
  //     { withCredentials: true }
  //   );
  //   es.onmessage = (e) => {
  //     const notif = JSON.parse(e.data);
  //     if (notif.type === 'payment_success') toast.success(notif.message);
  //     if (notif.type === 'payment_failed')  toast.error(notif.message);
  //   };
  //   return () => es.close();
  // }, []);

  useEffect(() => {
    if (role === 'seller' && subscriptionPlan === 'free') {
       if (currentPath !== '/subscription') {
         navigate('/subscription');
       }
       setActiveTabState('Abonnements');
    } else if (pathToTab[currentPath]) {
      setActiveTabState(pathToTab[currentPath]);
    } else {
      setActiveTabState('Accueil');
    }
  }, [currentPath, role, subscriptionPlan, navigate]);

  useEffect(() => {
    const roleThemeStyles = {
      student: {
        primary: '#18bfd6',
        secondary: '#fcb303',
        accent: '#fcb303',
      },
      eleve: {
        primary: '#18bfd6',
        secondary: '#fcb303',
        accent: '#fcb303',
      },
      teacher: {
        primary: '#10b981',
        secondary: '#06b6d4',
        accent: '#06b6d4',
      },
      repetiteur: {
        primary: '#10b981',
        secondary: '#06b6d4',
        accent: '#06b6d4',
      },
      parent: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#a78bfa',
      },
      seller: {
        primary: '#f59e0b',
        secondary: '#f97316',
        accent: '#f97316',
      },
      admin: {
        primary: '#ef4444',
        secondary: '#f87171',
        accent: '#f87171',
      }
    };

    const theme = roleThemeStyles[role as keyof typeof roleThemeStyles] || roleThemeStyles.student;
    
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);

    return () => {
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-secondary');
      document.documentElement.style.removeProperty('--color-accent');
    };
  }, [role]);

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const scrollRef = useRef<number>(0);

  const setActiveTab = (tab: string) => {
    if (inactiveTabs.includes(tab)) {
      import('sonner').then(m => m.toast.success("Bientôt disponible !"));
      return;
    }
    if (role === 'seller' && subscriptionPlan === 'free' && tab !== 'Abonnements' && tab !== 'Dashboard utilisateur' && tab !== 'Support') {
      return; 
    }
    setActiveTabState(tab);
    setIsMoreMenuOpen(false);
    navigate(tabToPath[tab] || '/');
  };

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiChatContext, setAiChatContext] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const openKaramoWithContext = (context: string) => {
    setAiChatContext(context);
    setIsAIChatOpen(true);
  };
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  const handleLogout = async () => {
    try {
      if (isGuest) {
        setGuestMode(false);
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('Sujets et traités');
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab('Sujets et traités');
  };

  const isFeatureAllowed = (tab: string) => {
    if (role === 'admin') return true;
    if (isGuest) {
      if (['Messages', 'Notifs', 'Support', 'Abonnements', 'Kharandi École', 'Exo Gagnant'].includes(tab)) return false;
      return true;
    }
    
    if (role === 'seller' && subscriptionPlan === 'free') {
       return tab === 'Abonnements' || tab === 'Dashboard utilisateur' || tab === 'Support';
    }

    const freeFeatures = [
      'Accueil', 
      'Sujets et traités',
      'Kharandi Makiti', 
      'Abonnements', 
      'Dashboard utilisateur', 
      'Notifs', 
      'Support',
      'Résultats',
      'Bourses',
      'Études à l’étranger',
      'Palmarès',
      'Actualités',
      'Exo Gagnant',
      'Mon Wallet',
      'Onboarding'
    ];
    
    if (subscriptionPlan === 'free') {
      if ((role === 'teacher' || role === 'repetiteur' || role === 'tutor') && tab === 'Répétiteurs') {
        return true;
      }
      return freeFeatures.includes(tab);
    }
    
    // If they have a paid plan, they get access to everything appropriate for their role
    return true;
  };

  const renderLockedFeature = (featureName: string) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Lock size={48} className="text-primary" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Fonctionnalité Premium</h2>
      <p className="text-slate-500 max-w-md mb-8 text-lg">
        L'accès à la section <strong>{featureName}</strong> nécessite un abonnement actif. Mettez à niveau votre compte pour débloquer toutes les fonctionnalités.
      </p>
      <button 
        onClick={() => setActiveTab('Abonnements')}
        className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        Voir les abonnements
      </button>
    </div>
  );

  const renderContent = () => {
    if (!isFeatureAllowed(activeTab)) {
      return renderLockedFeature(activeTab);
    }

    switch (activeTab) {
      case 'Accueil':
        return <HomeContent role={role} setActiveTab={setActiveTab} setIsAIChatOpen={setIsAIChatOpen} onSearch={handleSearch} onCourseSelect={handleCourseSelect} />;
      case 'Sujets et traités':
        return <Library initialSearchQuery={searchQuery} initialCourseId={selectedCourseId} onCourseClose={() => setSelectedCourseId(null)} onOpenKaramo={openKaramoWithContext} setActiveTab={setActiveTab} />;
      case 'Exo Gagnant':
        return <Exercises />;
      case 'Mon Wallet':
        return <Wallet setActiveTab={setActiveTab} />;
      case 'Kharandi École':
        return <Grades />;
      case 'Répétiteurs':
        return <Tutors />;
      case 'Kharandi Makiti':
        return role === 'seller' ? <SellerDashboard /> : <Marketplace setActiveTab={setActiveTab} />;
      case 'Résultats':
        return <Results />;
      case 'Bourses':
        return <Scholarships />;
      case 'Études à l’étranger':
        return <StudyAbroad />;
      case 'Palmarès':
        return <SchoolRankings />;
      case 'Actualités':
        return <News />;
      case 'Abonnements':
        return <Subscription />;
      case 'Notifs':
        return <Notifications />;
      case 'Dashboard utilisateur':
        return <Profile />;
      case 'Messages':
        return <ChatFeature />;
      case 'Support':
        return <SupportTickets />;
      case 'Calcul mental':
        return <AbacusModule onBackToDashboard={() => setActiveTab('Accueil')} onOpenKaramo={openKaramoWithContext} />;
      case 'Administration':
        return <AdminDashboard />;
      case 'Onboarding':
        return <UserParcours />;
      default:
        return <HomeContent role={role} setActiveTab={setActiveTab} setIsAIChatOpen={setIsAIChatOpen} />;
    }
  };

  const navItems: Array<{ id: string; icon: any; kIcon: KharandiIconName; roles?: string[]; premium?: boolean; badge?: boolean }> = [
    { id: 'Accueil', icon: Home, kIcon: 'accueil' as KharandiIconName },
    { id: 'Sujets et traités', icon: BookOpen, kIcon: 'cours' as KharandiIconName, roles: ['student', 'eleve', 'parent', 'admin', 'teacher', 'repetiteur'] },
    { id: 'Calcul mental', icon: Brain, kIcon: 'abacus' as KharandiIconName, premium: true, roles: ['student', 'eleve', 'parent', 'admin', 'teacher', 'repetiteur'] },
    { id: 'Exo Gagnant', icon: PenTool, kIcon: 'exercices' as KharandiIconName, roles: ['student', 'eleve', 'admin'] },
    { id: 'Mon Wallet', icon: WalletIcon, kIcon: 'portefeuille' as KharandiIconName, roles: ['student', 'eleve', 'parent', 'admin', 'teacher', 'repetiteur', 'seller'] },
    { id: 'Répétiteurs', icon: Users, kIcon: 'enseignant' as KharandiIconName, premium: true, roles: ['student', 'eleve', 'parent', 'admin', 'teacher', 'repetiteur', 'tutor'] },
    { id: 'Résultats', icon: Award, kIcon: 'examen' as KharandiIconName, roles: ['student', 'eleve', 'parent', 'admin'] },
    { id: 'Bourses', icon: Briefcase, kIcon: 'bourse' as KharandiIconName, roles: ['student', 'eleve', 'parent', 'admin'] },
    { id: 'Études à l’étranger', icon: Globe, kIcon: 'voyage' as KharandiIconName, roles: ['student', 'eleve', 'parent', 'admin'] },
    { id: 'Palmarès', icon: Trophy, kIcon: 'palmares' as KharandiIconName, roles: ['student', 'eleve', 'parent', 'admin'] },
    { id: 'Actualités', icon: Newspaper, kIcon: 'actualites' as KharandiIconName, roles: ['student', 'eleve', 'parent', 'admin'] },
    { id: 'Kharandi Makiti', icon: ShoppingBag, kIcon: 'boutique' as KharandiIconName },
    { id: 'Messages', icon: MessageCircle, kIcon: 'discussion' as KharandiIconName, premium: true },
    { id: 'Abonnements', icon: CreditCard, kIcon: 'abonnement' as KharandiIconName },
    { id: 'Notifs', icon: Bell, kIcon: 'notifications' as KharandiIconName, badge: true },
    { id: 'Support', icon: MessageSquare, kIcon: 'aide' as KharandiIconName },
    { id: 'Dashboard utilisateur', icon: User, kIcon: 'profil' as KharandiIconName }
  ].filter(item => {
    if (isGuest && ['Messages', 'Notifs', 'Support', 'Abonnements', 'Kharandi École', 'Exo Gagnant'].includes(item.id)) return false;
    if (isGuest) return true;
    
    // Si c'est une fonctionnalité premium et que l'utilisateur est sur le forfait gratuit
    if ((item as any).premium && subscriptionPlan === 'free' && role !== 'admin') return false;

    // Si l'utilisateur a l'addon student_access, il a accès aux fonctionnalités student (sauf exo gagnant/Exercices)
    if (userProfile?.activeAddons?.includes('student_access') && item.id !== 'Exo Gagnant' && item.roles?.includes('student')) {
      return true;
    }

    return !item.roles || item.roles.includes(role);
  });

  // Mobile nav items (subset to avoid cramping)
  const mobileNavItems = [
    { id: 'Accueil', icon: Home },
    { id: 'Sujets et traités', icon: BookOpen },
    { id: 'Kharandi Makiti', icon: ShoppingBag },
    { id: 'Dashboard utilisateur', icon: User }
  ];

  const moreNavItems = navItems.filter(item => 
    !mobileNavItems.find(mi => mi.id === item.id)
  );

  if (role === 'admin' && !isGuest) {
    if (!navItems.some(i => i.id === 'Administration')) {
      navItems.push({ id: 'Administration', icon: Shield, kIcon: 'tableau_de_bord', badge: false });
    }
  }

  const roleTranslations: Record<string, string> = {
    student: 'Élève',
    eleve: 'Élève',
    teacher: 'Professeur',
    repetiteur: 'Professeur',
    tutor: 'Professeur',
    parent: 'Parent',
    seller: 'Vendeur',
    boutique: 'Boutique',
    admin: 'Administrateur'
  };

  const displayRole = isGuest ? 'Invité' : (roleTranslations[role] || role);

  return (
    <div className="bg-transparent min-h-screen font-body relative flex">
      <BackgroundDesign />
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-sidebar z-30 sticky top-0 h-screen">
        <div className="p-6 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105">
            <img 
              src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
              alt="Kharandi Logo" 
              className="w-full h-full object-contain p-2"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-50 mb-2">
          <p className="font-extrabold text-text-main truncate">
            {isGuest ? 'Mode Invité' : (userProfile?.name && userProfile.name !== 'Utilisateur' 
              ? userProfile.name 
              : (userProfile?.email?.split('@')[0] || 'Utilisateur'))}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="font-medium text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block">{displayRole}</span>
            <button 
              onClick={() => setActiveTab('Dashboard utilisateur')}
              className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 hover:bg-accent/20 px-2 py-0.5 rounded-md border border-accent/20 cursor-pointer transition-all active:scale-95"
            >
              <Award size={12} /> {userProfile?.points || 0} pts
            </button>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const isLocked = !isFeatureAllowed(item.id);
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all duration-300 relative ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {item.kIcon ? (
                    <KharandiIcon 
                      name={item.kIcon} 
                      size={26} 
                      showBackground={false} 
                      showBookmark={false} 
                      primaryColor={isActive ? '#FFFFFF' : '#163B45'} 
                    />
                  ) : (
                    <item.icon 
                      size={22} 
                      strokeWidth={isActive ? 2.5 : 2}
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                  )}
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C0392B] rounded-full border-2 border-white" />
                  )}
                </div>
                <span className={`text-[15px] z-10 flex-1 text-left ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.id}
                </span>
                {isLocked && (
                  <Lock size={14} className={`z-10 ${isActive ? 'text-white/70' : 'text-slate-300'}`} />
                )}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-pill" 
                    className="absolute inset-0 bg-primary rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300"
          >
            <LogOut size={22} />
            <span className="text-[15px] font-bold">{isGuest ? 'Quitter le mode invité' : 'Se déconnecter'}</span>
          </button>
        </div>
      </aside>

      <main 
        onScroll={(e) => {
          const currentScrollY = e.currentTarget.scrollTop;
          if (currentScrollY > scrollRef.current && currentScrollY > 100) {
            document.getElementById('mobile-nav')?.classList.add('translate-y-[150%]');
            document.getElementById('mobile-fab')?.classList.add('translate-y-40', 'opacity-0', 'pointer-events-none');
            document.getElementById('library-fab')?.classList.add('translate-y-40', 'opacity-0', 'pointer-events-none');
          } else {
            document.getElementById('mobile-nav')?.classList.remove('translate-y-[150%]');
            document.getElementById('mobile-fab')?.classList.remove('translate-y-40', 'opacity-0', 'pointer-events-none');
            document.getElementById('library-fab')?.classList.remove('translate-y-40', 'opacity-0', 'pointer-events-none');
          }
          scrollRef.current = currentScrollY;
        }}
        className="flex-1 relative w-full md:w-[calc(100%-16rem)] max-w-7xl mx-auto pb-40 md:pb-8 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"
      >
        {activeTab !== 'Onboarding' && (
          <header className="md:hidden flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                <img 
                  src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
                  alt="Kharandi Logo" 
                  className="w-full h-full object-contain p-1"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-800">Kharandi</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('Dashboard utilisateur')}
                className="flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-xl border border-accent/20 cursor-pointer transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <Award size={13} className="text-accent" />
                <span className="tabular-nums">{userProfile?.points || 0} pts</span>
              </button>
            </div>
          </header>
        )}

        {activeTab !== 'Accueil' && activeTab !== 'Onboarding' && (
          <div className="px-6 pt-6 md:px-8 pb-2 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('Accueil')}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-primary transition-all group shrink-0 cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-primary" />
              Retour à l'accueil
            </button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">{activeTab}</h2>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AI Teacher FAB - Only for paid plans */}
      {subscriptionPlan !== 'free' && (
        <div id="mobile-fab" className="fixed bottom-32 md:bottom-8 right-6 z-40 transition-all duration-300">
          <motion.button 
            drag
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!isFeatureAllowed('Sujets et traités')) {
                setActiveTab('Abonnements');
              } else {
                setIsAIChatOpen(true);
              }
            }}
            className="w-16 h-16 bg-gradient-to-tr from-primary to-primary/80 text-white rounded-full flex items-center justify-center shadow-[0_12px_30px_rgba(24,191,214,0.4)] border-2 border-white/20 backdrop-blur-sm overflow-hidden relative"
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo" 
              alt="Karamö" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {!isFeatureAllowed('Sujets et traités') && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Lock size={24} className="text-white" />
              </div>
            )}
            <span className="absolute 0 top-0 right-0 w-4 h-4 bg-secondary rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        </div>
      )}

      {/* AI Teacher Chat Modal */}
      <AnimatePresence>
        {isAIChatOpen && (
          <AITeacherChat
            key="ai-chat"
            onClose={() => { setIsAIChatOpen(false); setAiChatContext(undefined); }}
            initialMessage={aiChatContext}
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation (Mobile Only) */}
      <div id="mobile-nav" className="md:hidden fixed bottom-6 left-6 right-6 z-50 transition-transform duration-300">
        <div className="bg-white/90 backdrop-blur-2xl border border-white/20 px-6 py-3 flex justify-between items-center shadow-[0_20px_50px_rgba(13,27,42,0.15)] rounded-[32px]">
          {mobileNavItems.map(item => {
            const isActive = activeTab === item.id;
            const isLocked = !isFeatureAllowed(item.id);
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                  isActive ? 'text-primary' : 'text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 relative ${isActive ? 'bg-primary/10 scale-110' : 'hover:bg-slate-100'}`}>
                  <item.icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <Lock size={10} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                  {item.id === 'Accueil' ? 'Home' : item.id}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill" 
                    className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          
          {/* More Button */}
          <button 
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
              isMoreMenuOpen ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${isMoreMenuOpen ? 'bg-primary/10 scale-110' : 'hover:bg-slate-100'}`}>
              <Menu size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold tracking-tight">Plus</span>
          </button>
        </div>
      </div>

      {/* Mobile More Menu Overlay */}
      <AnimatePresence>
        {isMoreMenuOpen && [
            <motion.div 
              key="more-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
            />,
            <motion.div 
              key="more-menu-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[70] p-8 md:hidden shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <div className="grid grid-cols-3 gap-6">
                {moreNavItems.map(item => {
                  const isLocked = !isFeatureAllowed(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="flex flex-col items-center gap-3 group relative"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative ${
                        activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500'
                      }`}>
                        <item.icon size={24} />
                        {isLocked && (
                          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                            <Lock size={12} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-bold text-center ${activeTab === item.id ? 'text-primary' : 'text-slate-600'}`}>
                        {item.id}
                      </span>
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                    <LogOut size={24} />
                  </div>
                  <span className="text-xs font-bold text-red-600">Déconnexion</span>
                </button>
              </div>
            </motion.div>
        ]}
      </AnimatePresence>

      {showOnboardingTutorial && (
        <OnboardingTutorial 
          role={role} 
          onClose={closeOnboardingTutorial} 
        />
      )}
    </div>
  );
};