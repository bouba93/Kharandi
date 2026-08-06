import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CreditCard, BookOpen, Bell, Shield, Headphones, Info, LogOut, CheckCircle2, ShieldAlert, User, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../services/auth';

export const Profile: React.FC = () => {
  const [activeView, setActiveView] = useState<string | null>(null);
  const { userProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.city || '',
  });

  React.useEffect(() => {
    if (userProfile && !isEditing) {
      setEditData({
        name: userProfile.name && userProfile.name !== 'Utilisateur' ? userProfile.name : '',
        phone: userProfile.phone || '',
        address: userProfile.city || '',
      });
    }
  }, [userProfile, isEditing]);

  const handleUpdateProfile = async () => {
    try {
      const parts = editData.name.split(' ');
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        city: editData.address
      });
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent('auth:reload-profile'));
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: "personal", icon: User, label: "Informations personnelles", color: "text-primary", bg: "bg-primary/10" },
    { id: "subscription", icon: CreditCard, label: "Mon abonnement", color: "text-primary", bg: "bg-primary/10" },
    { id: "history", icon: BookOpen, label: "Mes lectures récentes", color: "text-accent", bg: "bg-accent/10" },
    { id: "notifications", icon: Bell, label: "Notifications", color: "text-secondary", bg: "bg-secondary/20" },
    { id: "security", icon: Shield, label: "Sécurité & Appareils", color: "text-gray-600", bg: "bg-gray-100" },
    { id: "antifraud", icon: ShieldAlert, label: "Kharandi Shield Anti-Fraude", color: "text-red-500", bg: "bg-red-50", adminOnly: true },
    { id: "support", icon: Headphones, label: "Support", color: "text-primary", bg: "bg-primary/10" },
    { id: "about", icon: Info, label: "À propos de Kharandi", color: "text-gray-600", bg: "bg-gray-100" },
  ].filter(item => !item.adminOnly || userProfile?.role === 'admin');

  const [sessions] = useState([
    { 
      id: 'current',
      device: (() => {
        const ua = navigator.userAgent;
        if (ua.indexOf("Win") !== -1) return "PC Windows";
        if (ua.indexOf("Mac") !== -1) return "Mac";
        if (ua.indexOf("iPhone") !== -1) return "iPhone";
        if (ua.indexOf("Android") !== -1) return "Android Phone";
        return "Navigateur Web";
      })(),
      browser: (() => {
        const ua = navigator.userAgent;
        if (ua.indexOf("Chrome") !== -1) return "Google Chrome";
        if (ua.indexOf("Firefox") !== -1) return "Firefox";
        if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) return "Safari";
        return "Navigateur";
      })(),
      location: "Conakry, Guinée",
      active: true,
      lastActive: "Actif maintenant"
    }
  ]);

  const renderView = () => {
    switch (activeView) {
      case 'personal':
        return (
          <motion.div 
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 min-h-screen md:min-h-0 md:bg-transparent"
          >
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity lg:hidden">
                <ChevronLeft size={20} /> Retour
              </button>
              <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight hidden lg:block">Informations personnelles</h2>
              <button 
                onClick={() => isEditing ? handleUpdateProfile().catch(console.error) : setIsEditing(true)}
                className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                {isEditing ? 'Enregistrer' : 'Modifier'}
              </button>
            </div>
            
            <div className="max-w-2xl bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full p-4 pl-12 rounded-[20px] border border-gray-100 bg-gray-50 disabled:opacity-70 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">Email (Non modifiable)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    disabled
                    value={userProfile?.email}
                    className="w-full p-4 pl-12 rounded-[20px] border border-gray-100 bg-gray-50 opacity-70 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">Rôle</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    disabled
                    value={
                      userProfile?.role === 'student' ? 'Élève / Étudiant' :
                      userProfile?.role === 'parent' ? "Parent d'élève" :
                      userProfile?.role === 'repetiteur' || userProfile?.role === 'teacher' ? 'Répétiteur / Professeur' :
                      userProfile?.role === 'seller' ? 'Vendeur (Kharandi Makiti)' :
                      userProfile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'
                    }
                    className="w-full p-4 pl-12 rounded-[20px] border border-gray-100 bg-gray-50 opacity-70 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="tel" 
                    disabled={!isEditing}
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full p-4 pl-12 rounded-[20px] border border-gray-100 bg-gray-50 disabled:opacity-70 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">Quartier / Adresse</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={editData.address}
                    placeholder="Votre quartier"
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="w-full p-4 pl-12 rounded-[20px] border border-gray-100 bg-gray-50 disabled:opacity-70 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'subscription':
        return (
          <motion.div 
            key="subscription"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 min-h-screen md:min-h-0 md:bg-transparent"
          >
            <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80 transition-opacity lg:hidden">
              <ChevronLeft size={20} /> Retour
            </button>
            <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight mb-6 hidden lg:block">Mon abonnement</h2>
            <div className="max-w-2xl bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden">
              {/* Elegant ambient light flare in background */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10 shadow-sm shrink-0">
                    <CreditCard size={26} strokeWidth={2.2} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Forfait Actuel</span>
                    <h3 className="font-black text-xl text-slate-900 mt-0.5 leading-tight">
                      {userProfile?.subscriptionPlan === 'free' || !userProfile?.subscriptionPlan 
                        ? 'Formule Découverte' 
                        : `Offre ${userProfile.subscriptionPlan}`}
                    </h3>
                  </div>
                </div>

                <div className="self-start sm:self-center">
                </div>
              </div>

              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center justify-between py-1 text-sm">
                  <span className="font-bold text-slate-400">Type de licence</span>
                  <span className="font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-xl text-xs uppercase tracking-wider">Gratuit & Permanent</span>
                </div>
                <div className="flex items-center justify-between py-1 text-sm">
                  <span className="font-bold text-slate-400">Services inclus</span>
                  <span className="font-black text-slate-700 text-xs">
                    Actualités, Résultats & Guides scolaires 
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-sm">
                  <span className="font-bold text-slate-400">Sécurité plateforme</span>
                  <span className="font-black text-emerald-600 flex items-center gap-1 text-xs">
                    <CheckCircle2 size={14} /> Sécurisé par SSL
                  </span>
                </div>
              </div>

              {userProfile?.activeAddons && userProfile.activeAddons.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                  <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Options Premium Activées</h4>
                  <div className="space-y-2">
                    {userProfile.activeAddons.includes('student_access') && (
                      <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span className="font-bold text-sm">Forfait Élève / Parent débloqué</span>
                      </div>
                    )}
                    {(userProfile.activeAddons.includes('ad_boost') || userProfile.activeAddons.includes('product_boost')) && (
                      <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span className="font-bold text-sm">Mise en avant activée</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 'history':
        return (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 md:bg-transparent"
          >
            <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80 transition-opacity lg:hidden">
              <ChevronLeft size={20} /> Retour
            </button>
            <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight mb-6 hidden lg:block">Mes lectures récentes</h2>
              {/* History list - currently empty for users */}
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <BookOpen size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-1">Aucune lecture récente</h3>
                <p className="text-gray-500 max-w-xs text-sm">Vos documents consultés s'afficheront ici au fur et à mesure.</p>
              </div>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div 
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 md:bg-transparent"
          >
            <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80 transition-opacity lg:hidden">
              <ChevronLeft size={20} /> Retour
            </button>
            <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight mb-6 hidden lg:block">Préférences de notifications</h2>
            <div className="max-w-2xl space-y-4">
              {[
                { title: "Nouveaux sujets et corrigés", desc: "Soyez alerté dès qu'un nouveau document est disponible dans votre niveau.", active: true },
                { title: "Rappels de révision", desc: "Recevez des rappels pour continuer vos lectures en cours.", active: true },
                { title: "Messages des répétiteurs", desc: "Soyez notifié quand un répétiteur répond à votre annonce.", active: true },
                { title: "Mises à jour Kharandi", desc: "Actualités et nouvelles fonctionnalités de l'application.", active: false }
              ].map((pref, i) => (
                <div key={i} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="pr-4">
                    <h3 className="font-bold text-[16px] text-text-main mb-1">{pref.title}</h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{pref.desc}</p>
                  </div>
                  <button className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pref.active ? 'bg-primary' : 'bg-gray-200'}`}>
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pref.active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div 
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 md:bg-transparent"
          >
            <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80 transition-opacity lg:hidden">
              <ChevronLeft size={20} /> Retour
            </button>
            <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight mb-6 hidden lg:block">Sécurité & Appareils</h2>
            <div className="max-w-2xl space-y-6">
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <h3 className="font-bold text-[18px] text-text-main mb-2">Sécurité du compte</h3>
                <p className="text-[14px] text-gray-500">Votre compte est protégé par votre mot de passe et l'authentification sécurisée.</p>
              </div>
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <h3 className="font-bold text-[18px] text-text-main mb-6">Appareils connectés</h3>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-bold text-[16px] text-text-main">
                          {session.device} <span className="text-gray-400 font-medium text-sm">({session.browser})</span>
                        </p>
                        <p className={`text-[14px] font-bold mt-1 ${session.active ? 'text-primary' : 'text-gray-500'}`}>
                          {session.active ? 'Cet appareil (Actif)' : session.location}
                        </p>
                      </div>
                      {!session.active && (
                        <button className="text-[14px] font-bold text-[#C0392B] bg-[#C0392B]/10 px-4 py-2 rounded-xl hover:bg-[#C0392B]/20 transition-colors">
                          Déconnecter
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'antifraud':
        return (
          <motion.div 
            key="antifraud"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 md:bg-transparent"
          >
            <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80 transition-opacity lg:hidden">
              <ChevronLeft size={20} /> Retour
            </button>
            <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight mb-6 hidden lg:block">Kharandi Shield Protection</h2>
            <div className="max-w-2xl bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-bl-[100px]" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                  <ShieldAlert size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-text-main">Protection Active</h3>
                  <p className="text-[15px] text-red-500 font-bold mt-1">Statut: Surveillance en cours</p>
                </div>
              </div>
              <p className="text-gray-600 text-[16px] leading-relaxed relative z-10 mb-8">
                Kharandi Shield analyse en temps réel les comportements sur la plateforme pour détecter et prévenir toute tentative de fraude ou d'abus.
              </p>
              <div className="space-y-4 relative z-10 bg-gray-50/50 p-6 rounded-[24px] border border-gray-100">
                {[
                  'Analyse des connexions suspectes', 
                  'Détection de partage de compte abusif', 
                  'Vérification de l\'intégrité des évaluations'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-red-500" size={24} />
                    <span className="text-[16px] text-text-main font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 'support':
        return (
          <motion.div 
            key="support"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 md:bg-transparent"
          >
            <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80 transition-opacity lg:hidden">
              <ChevronLeft size={20} /> Retour
            </button>
            <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight mb-6 hidden lg:block">Support Client</h2>
            <div className="max-w-2xl space-y-6">
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <h3 className="font-bold text-[18px] text-text-main mb-6">Contactez-nous</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 py-4 border-b border-gray-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] text-gray-500 font-bold">Email</p>
                      <p className="font-bold text-[16px] text-text-main">contactkharandi@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-4 border-b border-gray-50">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] text-gray-500 font-bold">Téléphone</p>
                      <p className="font-bold text-[16px] text-text-main">+224 626 18 71 17</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] text-gray-500 font-bold">Adresse</p>
                      <p className="font-bold text-[16px] text-text-main">Belle-Vue, en Face du commissariat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'about':
        return (
          <motion.div 
            key="about"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 md:p-0 bg-gray-50 md:bg-transparent"
          >
            <button onClick={() => setActiveView(null)} className="flex items-center gap-2 text-primary font-bold mb-6 hover:opacity-80 transition-opacity lg:hidden">
              <ChevronLeft size={20} /> Retour
            </button>
            <h2 className="text-[28px] font-extrabold text-[#0D1B2A] tracking-tight mb-6 hidden lg:block">À propos de Kharandi</h2>
            <div className="max-w-2xl bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-extrabold text-primary">K</span>
              </div>
              <h3 className="font-bold text-2xl text-text-main mb-2">Kharandi</h3>
              <p className="text-gray-500 mb-6">Version 1.0.0</p>
              <p className="text-[16px] text-gray-600 leading-relaxed mb-8">
                La première plateforme éducative intelligente en Guinée, conçue pour accompagner les élèves vers la réussite.
              </p>
              <div className="flex justify-center gap-4">
                <button className="text-primary font-bold hover:underline">Conditions d'utilisation</button>
                <span className="text-gray-300">•</span>
                <button className="text-primary font-bold hover:underline">Politique de confidentialité</button>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div 
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-20 relative overflow-hidden"
          >
            {/* Decorative School Illustrations */}
            <div className="absolute top-10 left-10 opacity-10 -rotate-12">
              <BookOpen size={80} className="text-primary" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-10 rotate-12">
              <Shield size={80} className="text-secondary" />
            </div>
            <div className="absolute top-1/2 right-20 opacity-5 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-accent rounded-full" />
            </div>

            <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mb-6 border border-primary/10 relative z-10">
              <User size={48} className="text-primary/40" />
            </div>
            <h3 className="text-2xl font-black text-text-main mb-2 relative z-10">Sélectionnez une option</h3>
            <p className="text-gray-500 font-medium max-w-xs relative z-10">Choisissez une section dans le menu de gauche pour gérer vos paramètres.</p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <header className="px-6 pt-12 pb-6 glass-sidebar rounded-b-[32px] md:rounded-b-none shadow-[0_8px_32px_rgba(13,27,42,0.04)] md:shadow-none sticky top-0 z-20 border-b border-white/50 md:border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-text-main tracking-tight">Mon Profil</h1>
              <p className="text-gray-500 text-sm font-medium">Gérez vos informations et vos préférences.</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100"
          >
            <LogOut size={20} /> Se déconnecter
          </motion.button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Menu */}
          <div className={`lg:col-span-4 space-y-6 ${activeView ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-[40px] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[32px] flex items-center justify-center text-white border-4 border-white/30 shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-4xl font-black">
                    {userProfile?.name && userProfile.name !== 'Utilisateur'
                      ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()
                      : (userProfile?.email?.[0]?.toUpperCase() || 'U')}
                  </span>
                </div>
                <h2 className="text-2xl font-black mb-1">{userProfile?.name || 'Utilisateur'}</h2>
                <p className="text-white/70 font-bold bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm text-sm border border-white/10">
                  {userProfile?.role === 'student' ? 'Élève' : 
                   (userProfile?.role === 'teacher' || userProfile?.role === 'repetiteur' || userProfile?.role === 'tutor') ? 'Professeur' : 
                   userProfile?.role === 'parent' ? "Parent d'élève" : 
                   userProfile?.role === 'seller' ? 'Vendeur' :
                   userProfile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -left-10 -top-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-4">
              {menuItems.map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-[24px] transition-all mb-1 last:mb-0 ${activeView === item.id ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${activeView === item.id ? 'bg-primary text-white' : item.bg + ' ' + item.color}`}>
                      <item.icon size={22} strokeWidth={2.5} />
                    </div>
                    <span className="font-black text-[15px]">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className={activeView === item.id ? 'text-primary' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className={`lg:col-span-8 ${activeView ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 min-h-[600px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                {renderView()}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

