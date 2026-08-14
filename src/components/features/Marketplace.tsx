import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Loader2, 
  PackageOpen, 
  Phone, 
  Facebook, 
  MessageCircle, 
  X, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Sparkles, 
  BookOpen, 
  Bookmark, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  Filter,
  Tags,
  BadgePercent,
  Compass,
  Layers,
  Sparkle
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { EduLoading } from './EduLoading';
import { getProducts, placeOrder } from '../../services/marketplace';
import { api } from '../../config/api';

const DEFAULT_PRODUCTS = [
  {
    id: "prod-sac-dos",
    title: "Sac à dos Ergonomique Kharandi Premium",
    price: 95000,
    category: "Sacs & Accessoires",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400",
    description: "Sac à dos scolaire imperméable de qualité supérieure, conçu spécialement pour préserver le dos des élèves de la 7ème à la terminale. Plusieurs compartiments de rangement renforcés, mousse respirante au dos, sangles rembourrées réglables et bandes de sécurité réfléchissantes pour la nuit.\n\n[CONTACTS: whatsapp=224622000000;facebook=kharandistore;phone=224622000000]",
    is_boosted: true,
    tagLine: "Santé & Confort du dos",
    badge: "Populaire"
  },
  {
    id: "prod-paquet-bic",
    title: "Paquet Stylo à bille Bic Couleur Classic Réf SM00811",
    price: 55000,
    category: "Écriture / Stylos",
    image_url: "https://lh3.googleusercontent.com/d/1GVlEJ-FNdr_M_URRZIH5vYpB0SypdgMz",
    description: "Paquet de stylos à bille Bic de haute qualité en couleurs de base Bleu, Rouge, Noir (Réf SM00811). Des stylos durables au tracé fluide, parfaits pour l'école et pour composer vos examens avec soin.\n\n[CONTACTS: whatsapp=224622000000;facebook=kharandistore;phone=224622000000]",
    is_boosted: false,
    tagLine: "Tracé fluide & propre",
    badge: "Essentiel scolaire"
  },
  {
    id: "prod-paquet-cahier",
    title: "Cahier 192 pages Calligraphe grands carreaux Série Ligne 8000",
    price: 25000,
    category: "Cahiers & Papeterie",
    image_url: "https://lh3.googleusercontent.com/d/1EEv8X77Yrdv0S9rw_Y_iKMBjz0N0VH4m",
    description: "Cahier de haute qualité de 192 pages au format 17×22 piqué, doté d'une couverture plastique résistante et de grands carreaux (série Calligraphe ligne 8000). Idéal pour prendre des cours propres, soignés et ordonnés.\n\n[CONTACTS: whatsapp=224622000000;facebook=kharandistore;phone=224622000000]",
    is_boosted: false,
    tagLine: "Haute qualité 90g/m²",
    badge: "Meilleure Offre"
  },
  {
    id: "prod-trousse-complete",
    title: "Trousse Scolaire Complète avec Kit de Géométrie Maped",
    price: 45000,
    category: "Sacs & Accessoires",
    image_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400",
    description: "Trousse robuste en tissu lavable contenant un kit complet de géométrie Maped (réglet, équerre, rapporteur, compas de précision) et stylos complémentaires. Idéal pour les matières scientifiques du BEPC et du Baccalauréat d'excellence.\n\n[CONTACTS: whatsapp=224622000000;facebook=kharandistore;phone=224622000000]",
    is_boosted: true,
    tagLine: "Prêt pour les examens",
    badge: "Kit Complet"
  },
  {
    id: "prod-annales-bac",
    title: "Livre d'Annales Bac de Mathématiques & Sciences Physiques",
    price: 75000,
    category: "Livres & Guides",
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400",
    description: "Manuel complet de révision intensive contenant les sujets résolus et commentés des examens d'État guinéens des 5 dernières années. Conseils pédagogiques exclusifs, astuces méthodologiques et fiches de mémorisation rapide.\n\n[CONTACTS: whatsapp=224622000000;facebook=kharandistore;phone=224622000000]",
    is_boosted: false,
    tagLine: "100% conforme au MENA",
    badge: "Recommandé"
  }
];

export const Marketplace: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [confirmingPointsBuy, setConfirmingPointsBuy] = useState(false);
  const { addToCart } = useCart();
  const { userProfile, isGuest, refreshProfile } = useAuth();

  useEffect(() => {
    getProducts()
      .then(data => {
        const fetched = data || [];
        const combined = [...DEFAULT_PRODUCTS, ...fetched.filter((item: any) => !item.id.toString().startsWith('prod-'))];
        setProducts(combined);
      })
      .catch(() => {
        setProducts(DEFAULT_PRODUCTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const decodeContacts = (fullDesc: string) => {
    const contactsMatch = (fullDesc || '').match(/\[CONTACTS: whatsapp=(.*?);facebook=(.*?);phone=(.*?)\]/);
    if (contactsMatch) {
      return {
        description: fullDesc.replace(/\[CONTACTS: .*?\]/gs, '').trim(),
        whatsapp: decodeURIComponent(contactsMatch[1] || ''),
        facebook: decodeURIComponent(contactsMatch[2] || ''),
        phone: decodeURIComponent(contactsMatch[3] || '')
      };
    }
    return { 
      description: fullDesc || '', 
      whatsapp: '224622000000', 
      facebook: 'kharandistore', 
      phone: '224622000000' 
    };
  };

  const availableCategories = ['Tous', 'Sacs & Accessoires', 'Cahiers & Papeterie', 'Écriture / Stylos', 'Livres & Guides'];

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectProductAndReset = (prod: any) => {
    setConfirmingPointsBuy(false);
    setSelectedProduct(prod);
  };

  const handleBuyWithPoints = async (product: any) => {
    if (isGuest) {
      toast.error('Connectez-vous pour échanger vos points.');
      return;
    }

    const pointCost = Math.ceil((Number(product.price) || 0) / 5);
    const userPoints = userProfile?.points || 0;

    if (userPoints < pointCost) {
      toast.error(`Points insuffisants. Il vous faut ${pointCost} pts, vous en avez ${userPoints} pts.`);
      return;
    }

    try {
      await api.post('/users/me/points/', { points: -pointCost });

      if (userProfile?.uid) {
        const key = `kharandi_wallet_transactions_${userProfile.uid}`;
        const existing = localStorage.getItem(key);
        let txs = [];
        if (existing) {
          try { txs = JSON.parse(existing); } catch (e) {}
        }
        const newTx = {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'debit',
          amount: pointCost,
          description: `Achat - ${product.title}`,
          status: 'completed'
        };
        localStorage.setItem(key, JSON.stringify([newTx, ...txs]));
      }

      toast.success(`Succès ! Échange effectué. ${pointCost} points déduits pour "${product.title}".`);
      setSelectedProduct(null);
      setConfirmingPointsBuy(false);
      
      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
      toast.error("Une erreur s'est produite lors de l'échange de points.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 selection:bg-[#18bfd6]/20 selection:text-[#139eb2] font-sans">
      
      {/* ── HIGH-CRAFT DESIGNER HERO BANNER (KHARANDI THEMED) ── */}
      <div className="relative mb-12 rounded-[40px] overflow-hidden bg-gradient-to-br from-[#125866] via-[#1aaec2] to-[#18bfd6] text-white shadow-2xl border border-white/10 p-6 md:p-12 lg:p-14">
        {/* Subtle glowing mesh of educational ambient rings */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
            Fournitures & <span className="bg-gradient-to-r from-amber-300 via-white to-[#bff0f5] bg-clip-text text-transparent">Matériel Scolaire</span>
          </h1>
          
          <p className="text-white/90 text-sm md:text-base font-serif italic leading-relaxed">
            La boutique collaborative guinéenne faite pour l'éducation. Accédez à des fournitures d'excellence, parcourez les manuels officiels et trouvez tout le matériel d'apprentissage de haute qualité.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className="flex items-center gap-1 text-[11px] font-mono tracking-wide font-bold text-emerald-100 bg-emerald-500/15 py-1 px-3 rounded-full border border-emerald-400/20">
              <CheckCircle2 size={12} className="text-emerald-300" /> Vendeurs certifiés
            </span>
          </div>
        </div>
      </div>

      {/* ── FILTER & EXTRA-CLEAN SEARCH BAR ──────────────────── */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-[#18bfd6]" />
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Chercher dans les rayons</h2>
            </div>
            <p className="text-xs text-slate-400">Trouvez instantanément votre matériel de révision</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="Rechercher cahier, stylo, livre..."
              className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#18bfd6]/15 focus:border-[#18bfd6] transition-all text-slate-900 placeholder:text-slate-400/80 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold transition-all"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Custom Rayon Navigation Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100/60">
          {availableCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#18bfd6] text-white shadow-md shadow-[#18bfd6]/20 scale-102 border-transparent' 
                    : 'bg-slate-50 text-slate-600 border border-slate-150/60 hover:bg-slate-100/80'
                }`}
              >
                {cat === 'Tous' && <Layers size={12} />}
                {cat !== 'Tous' && <Tags size={12} />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PRODUCTS BEAUTIFUL REVOLUTIONARY GRID ─────────────── */}
      {loading ? (
        <EduLoading message="Synchronisation des articles en vente..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm max-w-xl mx-auto space-y-5">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto border border-slate-100">
            <PackageOpen size={36} className="text-[#18bfd6]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">Aucun produit en vitrine</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed font-serif italic">
              Nous n'avons trouvé aucun article correspondant à "{searchTerm}" dans la sous-catégorie sélectionnée.
            </p>
          </div>
          <button 
            onClick={() => { setSelectedCategory('Tous'); setSearchTerm(''); }}
            className="px-6 py-3 bg-slate-900 hover:bg-[#18bfd6] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
          >
            Réinitialiser les filtres <X size={12} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((p: any) => {
            const pointPrice = Math.ceil((Number(p.price) || 0) / 5);
            const { description } = decodeContacts(p.description);
            return (
              <motion.div 
                key={p.id} 
                whileHover={{ y: -8, scale: 1.015 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-white rounded-[32px] border border-slate-200/50 shadow-sm overflow-hidden hover:shadow-2xl transition-all flex flex-col justify-between group relative"
              >
                {/* Visual badge top line */}
                <div className="h-1.5 bg-gradient-to-r from-[#18bfd6] to-[#0e8da3] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div 
                  className="cursor-pointer flex-1 flex flex-col p-4" 
                  onClick={() => selectProductAndReset(p)}
                  title="Cliquez pour afficher la fiche complète"
                >
                  {/* Article Thumbnail Frame */}
                  <div className="h-56 bg-slate-50 flex items-center justify-center relative overflow-hidden rounded-[24px] border border-slate-100 p-2">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/5 group-hover:opacity-0 transition-opacity z-10" />
                    {p.image_url ? (
                      <img 
                        src={p.image_url} 
                        alt={p.title} 
                        className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-108" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ShoppingBag size={48} className="text-primary/10" />
                    )}
                    
                    {/* Floating exclusive status pills */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                      {p.is_boosted && (
                        <span className="bg-amber-400 text-slate-900 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider">
                          <Star size={9} className="fill-current" /> Sélection Kharandi
                        </span>
                      )}
                      
                      {p.badge && (
                        <span className="bg-[#18bfd6] text-white text-[9px] font-mono font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-widest">
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {p.category && (
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg z-20">
                        {p.category}
                      </div>
                    )}
                  </div>

                  {/* Body textual area with typography updates */}
                  <div className="pt-4 px-1 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      {p.tagLine && (
                        <p className="text-[10px] text-[#18bfd6] uppercase tracking-widest font-mono font-bold">{p.tagLine}</p>
                      )}
                      <h3 className="font-extrabold text-slate-900 group-hover:text-[#18bfd6] transition-colors text-sm line-clamp-2 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-serif italic line-clamp-2">{description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Tarif</span>
                        <p className="text-base font-black text-[#18bfd6] font-mono">{Number(p.price).toLocaleString()} GNF</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-[#18bfd6] block uppercase font-mono font-bold">En Points</span>
                        <p className="text-xs font-black text-[#139eb2] font-mono bg-[#18bfd6]/10 px-2 py-0.5 rounded-lg border border-[#18bfd6]/10 inline-block">
                          {pointPrice} PTS
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct card call-to-action button */}
                <div className="p-4 pt-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      selectProductAndReset(p);
                    }}
                    className="w-full py-3.5 bg-slate-50 group-hover:bg-[#18bfd6] text-slate-700 group-hover:text-white rounded-[18px] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-150/50 group-hover:border-transparent group-hover:shadow-md shadow-[#18bfd6]/10"
                  >
                    Voir l'article <ArrowRight size={13} className="text-[#18bfd6] group-hover:text-white transition-colors" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── HIGH-LEVEL CONVERSATIONAL DETAILS DIALOG MODAL ────── */}
      <AnimatePresence>
        {selectedProduct && (() => {
          const { description, whatsapp, facebook, phone } = decodeContacts(selectedProduct.description);
          const currentIndex = filtered.findIndex((p: any) => p.id === selectedProduct.id);
          const hasPrev = currentIndex > 0;
          const hasNext = currentIndex !== -1 && currentIndex < filtered.length - 1;

          const onPrev = hasPrev ? () => {
            setConfirmingPointsBuy(false);
            setSelectedProduct(filtered[currentIndex - 1]);
          } : undefined;
          
          const onNext = hasNext ? () => {
            setConfirmingPointsBuy(false);
            setSelectedProduct(filtered[currentIndex + 1]);
          } : undefined;

          const ptCost = Math.ceil((Number(selectedProduct.price) || 0) / 5);
          const studentPoints = userProfile?.points || 0;

          return (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div 
                initial={{ scale: 0.96, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full max-h-[94vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 md:p-8 space-y-6 relative">
                  
                  {/* Floating close switch */}
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-6 right-6 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-450 hover:text-slate-700 transition-all cursor-pointer border border-slate-150/40"
                  >
                    <X size={18} />
                  </button>

                  <div className="inline-flex items-center gap-1 bg-[#18bfd6]/5 px-3 py-1 rounded-full text-[10px] font-bold text-[#139eb2] uppercase font-mono tracking-widest">
                    <Bookmark size={10} className="fill-current text-[#18bfd6]" /> Boutique Scolaire
                  </div>

                  {/* Premium core informational row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                    
                    {/* Visual box left frame */}
                    <div className="md:col-span-5 aspect-square w-full bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-inner p-2">
                      {selectedProduct.image_url ? (
                        <img 
                          src={selectedProduct.image_url} 
                          alt={selectedProduct.title} 
                          className="w-full h-full object-cover rounded-xl" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ShoppingBag size={64} className="text-primary/10" />
                      )}
                    </div>

                    {/* Right core metadata */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-[#139eb2] bg-[#18bfd6]/10 px-2.5 py-1 rounded-md uppercase font-mono border border-[#18bfd6]/10">
                          {selectedProduct.category || "Matériel scolaire"}
                        </span>
                        
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                          {selectedProduct.title}
                        </h2>

                        <div className="flex items-center gap-6 py-3 my-1 border-y border-slate-100">
                          <div>
                            <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Tarif GNF</span>
                            <span className="text-xl font-black text-[#18bfd6] font-mono">{Number(selectedProduct.price).toLocaleString()} <span className="text-xs font-bold text-slate-400">GNF</span></span>
                          </div>
                          <div className="h-8 w-[1px] bg-slate-100" />
                          <div>
                            <span className="text-[9px] text-[#139eb2] block uppercase font-mono font-bold">Prix Points</span>
                            <span className="text-sm font-black text-[#139eb2] font-mono bg-[#18bfd6]/10 px-2.5 py-0.5 rounded-md border border-[#18bfd6]/10 inline-block">{ptCost} PTS</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Détails de l'article</h4>
                          <p className="text-xs text-slate-600 leading-relaxed max-h-36 overflow-y-auto pr-2 whitespace-pre-wrap font-serif italic">
                            {description || "Aucune description de produit disponible pour le moment."}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Interactive Conversion Points segment box */}
                  <div className="bg-[#18bfd6]/[0.03] rounded-3xl p-6 border border-[#18bfd6]/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-[#139eb2] bg-[#18bfd6]/10 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                          SERVICE AUX CHAMPIONS D'ÉTUDES
                        </span>
                        <p className="text-xs text-slate-800 font-extrabold">
                          Échangez vos points contre du matériel d'étude :
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl border border-slate-100">
                        <div>
                          <span className="text-[8px] text-slate-450 block uppercase font-mono font-bold">Votre solde</span>
                          <span className="text-xs font-black text-slate-800 font-mono">{studentPoints} PTS</span>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-150" />
                        <div>
                          <span className="text-[8px] text-[#139eb2] block uppercase font-mono font-bold">Coût</span>
                          <span className={`text-xs font-black font-mono ${studentPoints >= ptCost ? 'text-[#139eb2]' : 'text-red-500'}`}>{ptCost} PTS</span>
                        </div>
                      </div>
                    </div>

                    {confirmingPointsBuy ? (
                      <div className="bg-white border border-[#18bfd6]/20 rounded-2xl p-4 text-center space-y-3 shadow-sm">
                        <p className="text-xs text-slate-700 font-bold">
                          Confirmez-vous le retrait de <strong className="font-extrabold text-[#139eb2] font-mono">{ptCost} PTS</strong> de votre compte étudiant ?
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleBuyWithPoints(selectedProduct)}
                            className="px-5 py-2.5 bg-[#18bfd6] hover:bg-[#139eb2] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#18bfd6]/10 flex items-center gap-1"
                          >
                            <CheckCircle2 size={13} /> Oui, échanger mes points
                          </button>
                          <button 
                            onClick={() => setConfirmingPointsBuy(false)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (studentPoints < ptCost) {
                            toast.error(`Vos points accumulés (${studentPoints}) sont insuffisants pour échanger cet article de ${ptCost} points. Continuez vos exercices !`);
                          } else {
                            setConfirmingPointsBuy(true);
                          }
                        }}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          studentPoints >= ptCost 
                            ? 'bg-[#18bfd6] hover:bg-[#139eb2] text-white shadow-md shadow-[#18bfd6]/10' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Award size={14} className="fill-current text-[#18bfd6]/20" /> Échanger l'article avec mes points Kharandi ({ptCost} pts)
                      </button>
                    )}
                  </div>

                  {/* Beautiful Seller Contacts Section */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <MessageCircle size={14} className="text-[#18bfd6]" />
                      CONTACTS DIRECTS DE LA COMPAGNIE VENDEUSE
                    </h3>

                    {!(whatsapp || facebook || phone) ? (
                      <div className="bg-slate-50 rounded-2xl p-4 text-center text-slate-400 text-xs">
                        Aucun profil social direct n'a été rattaché par le vendeur.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {whatsapp && (
                          <a 
                            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour, je souhaite acheter l'article "${selectedProduct.title}" découvert sur Kharandi à ${Number(selectedProduct.price).toLocaleString()} GNF.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebd53] text-white p-3.5 rounded-2xl font-bold text-xs transition-transform hover:-translate-y-0.5 shadow-md shadow-[#25D366]/10"
                          >
                            <MessageCircle size={14} className="fill-current" />
                            WhatsApp
                            <ExternalLink size={10} className="opacity-75" />
                          </a>
                        )}

                        {phone && (
                          <a 
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 p-3.5 rounded-2xl font-bold text-xs transition-transform hover:-translate-y-0.5 border border-slate-250/20"
                          >
                            <Phone size={14} className="fill-current" />
                            Appeler le vendeur
                          </a>
                        )}

                        {facebook && (
                          <a 
                            href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 bg-[#1877F2] hover:bg-[#1162cd] text-white p-3.5 rounded-2xl font-bold text-xs transition-transform hover:-translate-y-0.5 shadow-md shadow-[#1877F2]/10"
                          >
                            <Facebook size={14} className="fill-current" />
                            Facebook page
                            <ExternalLink size={10} className="opacity-70" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation footer of details modal */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    {onPrev ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPrev();
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-50 transition-colors rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 active:scale-95 cursor-pointer border border-slate-150/60"
                      >
                        <ChevronLeft size={14} /> Précédent
                      </button>
                    ) : (
                      <div />
                    )}

                    {onNext ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNext();
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-50 transition-colors rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 active:scale-95 cursor-pointer border border-slate-150/60"
                      >
                        Suivant <ChevronRight size={14} />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>

                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
