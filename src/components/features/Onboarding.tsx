import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { 
  BookOpen, 
  ArrowRight, 
  Check, 
  Backpack, 
  Pencil, 
  PenTool, 
  Ruler, 
  GraduationCap, 
  Camera,
  Store,
  CheckCircle2,
  Lock,
  Star,
  Info,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../services/auth';
import { getPlans } from '../../services/payments';
import { PaymentButton } from './PaymentButton';
import { toast } from 'sonner';

const roles = [
  { id: 'student', label: 'Élève / Étudiant', desc: 'Révise tes cours, fais des exercices et gagne des points' },
  { id: 'parent', label: 'Parent d\'élève', desc: 'Suis la progression de tes enfants et encourage-les' },
  { id: 'repetiteur', label: 'Répétiteur / Professeur', desc: 'Propose tes services de soutien scolaire aux familles' },
  { id: 'seller', label: 'Vendeur (Kharandi Makiti)', desc: 'Vends des livres, fournitures ou uniformes scolaires' },
];

const FloatingIcon = ({ icon: Icon, color, delay, size = 48, top, left, rotate }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ 
      opacity: [0, 0.4, 0.2],
      y: [0, -40, 0],
      rotate: [0, rotate, 0]
    }}
    transition={{ 
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none hidden md:block"
    style={{ top, left, color }}
  >
    <Icon size={size} strokeWidth={1.5} />
  </motion.div>
);

const zones = [
  'Kaloum', 'Dixinn', 'Matam', 'Ratoma', 'Matoto', 'Coyah', 'Dubréka', 'Autre'
];

const schoolLevels = [
  'Primaire', 'Collège', 'Lycée', 'Terminale', 'Université', 'Autre'
];

export const Onboarding: React.FC<{ onComplete: () => Promise<void> }> = ({ onComplete }) => {
  const { userProfile, logout, refreshProfile } = useAuth();
  
  // Steps: 
  // 0: Initial choice of Role
  // 1: Complete profile details (First Name, Last Name, Neighborhood, etc.) + KYC for repetiteur / Boutique info for seller
  // 2: Boutique Subscription (only if Seller)
  // 3: Success "Welcome to Kharandi" screen
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('onboarding_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateStep = (newStep: number) => {
    setStep(newStep);
    sessionStorage.setItem('onboarding_step', newStep.toString());
  };
  
  const [role, setRole] = useState<string | null>(() => {
    return sessionStorage.getItem('onboarding_role') || (userProfile?.role !== 'student' ? userProfile?.role : null) || null;
  });
  
  // Profil States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zone, setZone] = useState<string>('');
  const [schoolLevel, setSchoolLevel] = useState('Terminale');
  
  // Tutor States (KYC)
  const [kycFileName, setKycFileName] = useState('');
  const [kycImage, setKycImage] = useState<string | null>(null);
  
  // Seller States
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebook, setFacebook] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sellerPlanId, setSellerPlanId] = useState<string>('seller');

  // Helper inside component to encode contacts
  const encodeContactsInDescription = (desc: string, wa: string, fb: string, ph: string) => {
    const base = desc.replace(/\[CONTACTS: .*?\]/gs, '').trim();
    if (!wa && !fb && !ph) return base;
    return `${base}\n\n[CONTACTS: whatsapp=${encodeURIComponent(wa || '')};facebook=${encodeURIComponent(fb || '')};phone=${encodeURIComponent(ph || '')}]`;
  };

  // Load name and shop details if present in auth profile
  useEffect(() => {
    if (userProfile?.name) {
      const parts = userProfile.name.split(' ');
      if (parts.length > 0) setFirstName(parts[0]);
      if (parts.length > 1) setLastName(parts.slice(1).join(' '));
    }
    if (userProfile?.role && !role) {
      setRole(userProfile.role);
    }
    if (userProfile?.shopName && !shopName) {
      setShopName(userProfile.shopName);
    }
    if (userProfile?.shopDescription) {
      const contactsMatch = userProfile.shopDescription.match(/\[CONTACTS: whatsapp=(.*?);facebook=(.*?);phone=(.*?)\]/);
      if (contactsMatch) {
        if (!whatsapp) setWhatsapp(decodeURIComponent(contactsMatch[1] || ''));
        if (!facebook) setFacebook(decodeURIComponent(contactsMatch[2] || ''));
        if (!shopDescription) setShopDescription(userProfile.shopDescription.replace(/\[CONTACTS: .*?\]/gs, '').trim());
      } else {
        if (!shopDescription) setShopDescription(userProfile.shopDescription);
      }
    } else if (userProfile?.phone && !whatsapp) {
      setWhatsapp(userProfile.phone);
    }
  }, [userProfile]);

  // Dynamically resolve correct plan ID for sellers
  useEffect(() => {
    const fetchSellerPlan = async () => {
      try {
        const plans = await getPlans();
        if (plans && plans.length > 0) {
          const matchPlan = plans.find((p: any) => {
            const name = (p.name || '').toLowerCase();
            const id = (p.id || '').toLowerCase();
            return name.includes('vendeur') || name.includes('boutique') || name.includes('seller') ||
                   id.includes('vendeur') || id.includes('boutique') || id.includes('seller');
          });
          if (matchPlan) {
            setSellerPlanId(matchPlan.id);
          } else {
            const paidPlan = plans.find((p: any) => p.price > 0);
            if (paidPlan) {
              setSellerPlanId(paidPlan.id);
            }
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement ou de la détection du plan vendeur:', err);
      }
    };
    fetchSellerPlan();
  }, []);

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille du fichier ne doit pas dépasser 5 Mo.");
        return;
      }
      setKycFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setKycImage(reader.result as string);
        toast.success("Document d'identité chargé avec succès !");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!firstName.trim() || !lastName.trim() || !zone) {
      toast.error("Veuillez remplir votre prénom, nom et choisir votre quartier.");
      return;
    }

    if (role === 'repetiteur' && !kycImage) {
      toast.error("Veuillez ajouter une photo de votre pièce d'identité (KYC) pour vérification.");
      return;
    }

    if (role === 'seller') {
      if (!shopName.trim() || !zone) {
        toast.error("Veuillez remplir le nom et le quartier de votre boutique.");
        return;
      }
      if (!whatsapp.trim()) {
        toast.error("Veuillez fournir votre numéro WhatsApp.");
        return;
      }
      if (!facebook.trim()) {
        toast.error("Veuillez fournir l'adresse de votre page Facebook.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Map the chosen frontend role ID to what the backend expects
      const backendRole = role === 'student' ? 'STUDENT' : 
                          role === 'parent' ? 'PARENT' : 
                          role === 'repetiteur' ? 'TUTOR' : 
                          role === 'seller' ? 'SELLER' : role;

      const encodedShopDescription = encodeContactsInDescription(
        shopDescription,
        whatsapp.trim(),
        facebook.trim(),
        userProfile?.phone || ''
      );

      // Intermediate save: save profile info but NOT onboarding_completed yet
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: backendRole || undefined,
        city: zone || undefined,
        school_level: role === 'student' ? schoolLevel : undefined,
        kyc_document: role === 'repetiteur' ? kycImage : undefined,
        shop_name: role === 'seller' ? shopName.trim() : undefined,
        shop_description: role === 'seller' ? encodedShopDescription : undefined,
        // onboarding_completed is NOT included here yet
      });

      // Go to next appropriate step
      if (role === 'seller') {
        updateStep(2); // Boutique subscription proposal directly
      } else {
        updateStep(3); // Success/Welcome screen
      }
    } catch (error: any) {
      console.error("Error saving profile progress:", error);
      toast.error(error.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Update Django Profile (No Firestore here!)
      // Map the chosen frontend role ID to what the backend expects
      const backendRole = role === 'student' ? 'STUDENT' : 
                          role === 'parent' ? 'PARENT' : 
                          role === 'repetiteur' ? 'TUTOR' : 
                          role === 'seller' ? 'SELLER' : role;

      const encodedShopDescription = encodeContactsInDescription(
        shopDescription,
        whatsapp.trim(),
        facebook.trim(),
        userProfile?.phone || ''
      );

      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: backendRole || undefined,
        city: zone || undefined,
        school_level: role === 'student' ? schoolLevel : undefined,
        kyc_document: role === 'repetiteur' ? kycImage : undefined,
        shop_name: role === 'seller' ? shopName.trim() : undefined,
        shop_description: role === 'seller' ? encodedShopDescription : undefined,
        onboarding_completed: true,
      });

      toast.success("Profil configuré avec succès !");
      
      sessionStorage.clear();
      
      // Wait a bit to ensure backend consistency before parent reload
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await onComplete();
    } catch (error: any) {
      console.error("Error completing onboarding on Django:", error);
      toast.error(error.message || "Une erreur est survenue lors de la finalisation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-[#F8FBFF] relative overflow-x-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="blob blob-primary opacity-15" />
      <div className="blob blob-secondary opacity-15 top-0 right-0" />
      <div className="blob blob-accent opacity-15 bottom-0 left-0" />

      {/* Floating Educational Icons */}
      <FloatingIcon icon={Backpack} color="#3B82F6" delay={0} top="15%" left="5%" rotate={15} />
      <FloatingIcon icon={Pencil} color="#F59E0B" delay={1} top="10%" left="85%" rotate={-20} />
      <FloatingIcon icon={PenTool} color="#EF4444" delay={2} top="60%" left="3%" rotate={10} />
      <FloatingIcon icon={Ruler} color="#10B981" delay={3} top="80%" left="90%" rotate={25} />
      <FloatingIcon icon={GraduationCap} color="#8B5CF6" delay={1.5} top="40%" left="92%" rotate={-10} />
      <FloatingIcon icon={BookOpen} color="#3B82F6" delay={2.5} top="50%" left="8%" rotate={15} />

      {/* Header logo */}
      <div className="w-full flex justify-center py-4 relative z-20">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
            alt="Kharandi Logo" 
            className="w-10 h-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-xl font-black text-slate-900 tracking-tight">KHARANDI</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full max-w-2xl mx-auto py-8">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: Role Selection */}
          {step === 0 && (
            <motion.div 
              key="step-role" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="w-full glass-card p-6 md:p-8 rounded-[32px] shadow-xl border border-white/50"
            >
              <div className="text-center mb-8">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#3B82F6] bg-blue-50 px-3 py-1.5 rounded-full mb-3 inline-block">
                  Étape 1 sur 3
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight">
                  Bienvenue ! Choisissez votre rôle
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  Pour vous offrir la meilleure expérience, dites-nous qui vous êtes :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(r => (
                  <button 
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      sessionStorage.setItem('onboarding_role', r.id);
                    }}
                    className={`p-5 rounded-2xl border-2 flex flex-col items-start gap-3 text-left transition-all duration-300 ${
                      role === r.id 
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' 
                        : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="font-extrabold text-base text-slate-800">{r.label}</span>
                    <span className="text-xs text-slate-500 leading-relaxed font-semibold">{r.desc}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center gap-4">
                <button 
                  type="button"
                  onClick={() => logout()}
                  className="text-slate-500 hover:text-red-500 font-bold text-sm transition-colors py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-1"
                >
                  <LogOut size={16} /> Se déconnecter
                </button>
                <Button 
                  disabled={!role}
                  onClick={() => updateStep(1)} 
                  className="py-3 px-6 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  Continuer <ArrowRight size={18} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Profile Form (Student / Parent / Tutor / Seller) */}
          {step === 1 && (
            <motion.div 
              key="step-profile" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="w-full glass-card p-6 md:p-8 rounded-[32px] shadow-xl border border-white/50"
            >
              <div className="text-center mb-8">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#3B82F6] bg-blue-50 px-3 py-1.5 rounded-full mb-3 inline-block">
                  Étape 2 sur 3
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                  Complétez votre profil
                </h2>
                <p className="text-slate-500 font-semibold text-sm">
                  Renseignez vos coordonnées pour personnaliser votre compte Kharandi.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                
                {/* Standard Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Prénom <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Sékou"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-slate-50/80 border-2 border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-bold h-12 text-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nom <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Chérif"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-slate-50/80 border-2 border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-bold h-12 text-sm text-slate-800"
                    />
                  </div>
                </div>

                {/* Neighborhood / Zone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Quartier (à Conakry) / Zone <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {zones.map(z => (
                      <button 
                        type="button"
                        key={z}
                        onClick={() => setZone(z)}
                        className={`p-3 rounded-xl border-2 text-xs font-bold transition-all duration-300 text-center ${
                          zone === z 
                            ? 'border-primary bg-primary text-white shadow-md shadow-primary/10' 
                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student specific fields */}
                {role === 'student' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Niveau Scolaire</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {schoolLevels.map(lvl => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setSchoolLevel(lvl)}
                          className={`p-3 rounded-xl border-2 text-xs font-bold transition-all duration-300 text-center ${
                            schoolLevel === lvl 
                              ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 text-[#8B5CF6]' 
                              : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repetiteur specific fields (KYC Required) */}
                {role === 'repetiteur' && (
                  <div className="border border-slate-100 rounded-3xl p-5 bg-slate-50/50 space-y-4">
                    <div className="flex items-start gap-2 text-amber-600">
                      <Lock size={18} className="shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold block">Document d'identité & KYC (Requis) <span className="text-red-500">*</span></span>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                          Pour assurer la sécurité des familles, un document d'identité (CNI, Passeport, carte d'étudiant) lisible est obligatoire afin de valider votre compte de répétiteur professionnel.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary/50 bg-white rounded-2xl p-6 transition-colors relative cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleKycFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      {kycImage ? (
                        <div className="text-center space-y-3 z-20">
                          <CheckCircle2 size={36} className="text-green-500 mx-auto" />
                          <div>
                            <p className="text-xs font-extrabold text-slate-800">{kycFileName || "Fichier sélectionné"}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Cliquez sur la zone pour modifier</p>
                          </div>
                          {kycImage.startsWith('data:image/') && (
                            <img src={kycImage} alt="KYC Preview" className="w-24 h-24 object-cover mx-auto rounded-xl border border-slate-100 shadow-sm" />
                          )}
                        </div>
                      ) : (
                        <div className="text-center space-y-2 z-20">
                          <Camera size={28} className="text-slate-400 group-hover:text-primary transition-colors mx-auto" />
                          <div>
                            <span className="text-xs font-extrabold text-slate-700 block">Téléverser mon justificatif</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Glissez-déposez ou cliquez (Format Image, max 5Mo)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Seller specific fields */}
                {role === 'seller' && (
                  <div className="border border-slate-100 rounded-3xl p-5 bg-slate-50/50 space-y-4">
                    <div className="flex items-start gap-2 text-blue-600 mb-2">
                      <Store size={18} className="shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold block">Coordonnées de votre Boutique</span>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          Ces informations permettront aux élèves du quartier de trouver vos articles de classe.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nom de la boutique <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Ex: Papeterie Moderne de Ratoma"
                          value={shopName}
                          onChange={e => setShopName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary outline-none text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Description <span className="text-slate-400 font-normal">(Optionnel)</span></label>
                        <textarea 
                          placeholder="Ex: Livres de lycée, fournitures, cahiers, uniformes de tous les colèges de Conakry."
                          value={shopDescription}
                          onChange={e => setShopDescription(e.target.value)}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary outline-none text-xs text-slate-800 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Numéro WhatsApp *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: +224622000000"
                            value={whatsapp}
                            onChange={e => setWhatsapp(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary outline-none text-xs font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Page Facebook *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: https://facebook.com/mapage"
                            value={facebook}
                            onChange={e => setFacebook(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary outline-none text-xs font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons for Step 1 */}
                <div className="flex gap-4 pt-4 border-t border-slate-100 flex-col-reverse md:flex-row">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => updateStep(0)}
                    className="flex-1 py-3.5 rounded-xl font-bold bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"
                  >
                    Retour
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? "Enregistrement..." : "Enregistrer et continuer"}
                  </Button>
                </div>

              </form>
            </motion.div>
          )}

          {/* STEP 2: Boutique Subscription Proposition (Only for Sellers) */}
          {step === 2 && role === 'seller' && (
            <motion.div 
              key="step-subscription" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="w-full max-w-lg glass-card p-6 md:p-8 rounded-[32px] shadow-xl border border-white/50 relative overflow-hidden"
            >
              {/* Badge populaire */}
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1.5 font-sans">
                  <Star size={12} fill="currentColor" /> Recommandé
                </div>
              </div>

              <div className="text-center mb-6">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#F59E0B] bg-amber-50 px-3 py-1.5 rounded-full mb-3 inline-block">
                  Étape 3 sur 3
                </span>
                <h2 className="text-2xl font-black text-slate-900 mb-1">
                  Activer votre forfait Vendeur
                </h2>
                <p className="text-slate-500 font-semibold text-xs px-4">
                  Pour commencer à publier des articles et interagir avec la communauté scolaire de Kharandi.
                </p>
              </div>

              {/* Styled Boutique Plan Card */}
              <div className="border border-slate-100 rounded-[24px] bg-slate-50/70 p-5 mb-6 space-y-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F59E0B] flex items-center justify-center shrink-0">
                      <Store size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 text-left">C. Forfait Vendeur — Kharandi Makiti</h3>
                      <p className="text-[10px] font-bold text-amber-700 text-left">Visibilité et commerce de proximité (Année 1)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 block">50 000 GNF</span>
                    <span className="text-[10px] font-bold text-slate-400">/ Semestre</span>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-200" />

                <ul className="space-y-2.5 text-left">
                  <li className="flex items-start gap-2.5 text-slate-600 text-xs font-semibold">
                    <CheckCircle2 size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    <span>Création d'une boutique visible par +10 000 élèves et parents</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-600 text-xs font-semibold">
                    <CheckCircle2 size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    <span>Mise en vente de : livres, manuels, fournitures, uniformes d'écoles</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-600 text-xs font-semibold">
                    <CheckCircle2 size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    <span>Achat direct par les élèves des alentours via leurs points fidélité</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-600 text-xs font-semibold">
                    <CheckCircle2 size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    <span>Outils de comptabilité et de gestion des ventes</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                {/* Integration of real SDK payment button for boutique/seller */}
                <PaymentButton 
                  amount={50000}
                  currency="GNF"
                  planId={sellerPlanId}
                  label="Payer mon forfait (50 000 GNF)"
                  className="w-full py-4 text-sm font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center min-h-12"
                />

                <button 
                  type="button"
                  onClick={() => updateStep(3)}
                  className="w-full py-3 bg-white text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 text-xs font-extrabold rounded-2xl transition-all shadow-sm"
                >
                  Configurer ma boutique sans forfait d'abord (Gratuit Limité)
                </button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                  <Info size={12} className="text-slate-400" /> Aucun engagement — Vous pourrez modifier votre offre à tout moment.
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Success "Bienvenue sur Kharandi" */}
          {step === 3 && (
            <motion.div 
              key="step-success" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.1 }} 
              className="w-full max-w-md glass-card p-8 rounded-[36px] shadow-2xl text-center border border-white/80 relative"
            >
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-lg shadow-green-500/10">
                <Check size={48} strokeWidth={3} className="animate-bounce" />
                <div className="absolute inset-0 bg-green-500 rounded-full scale-110 opacity-10 animate-ping" />
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">C'est tout bon !</h2>
              <p className="text-slate-500 font-semibold text-sm mb-8 leading-relaxed">
                Félicitations, votre espace personnel a été configuré avec succès ! 
                Bienvenue sur <span className="text-[#3B82F6] font-black">Kharandi</span>, votre compagnon de réussite scolaire.
              </p>

              <Button 
                disabled={isSubmitting}
                onClick={handleComplete}
                className="w-full py-4 rounded-2xl font-black text-base shadow-xl shadow-primary/25 bg-[#3B82F6] hover:bg-blue-600 flex items-center justify-center gap-2 min-h-12"
              >
                {isSubmitting ? "Finalisation..." : "Accéder à mon tableau de bord"}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
