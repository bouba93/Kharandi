import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Upload, TrendingUp, Package, Edit2, Search, X, CheckCircle2, Star, Loader2, Tag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { getMyProducts, createProduct, updateProduct, deleteProduct, getMyPromos, createPromo, getSellerOrders, updateOrderStatus } from '../../services/marketplace';

const CATEGORIES = ['Cahiers & Papeterie','Sacs à dos & Trousses','Manuels scolaires','Matériel de géométrie','Uniformes scolaires','Stylos & Crayons','Autre matériel scolaire'];

export const SellerDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab,   setActiveTab]   = useState<'overview'|'products'|'orders'|'promos'>('overview');
  const [products,    setProducts]    = useState<any[]>([]);
  const [orders,      setOrders]      = useState<any[]>([]);
  const [promos,      setPromos]      = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [title,       setTitle]       = useState('');
  const [price,       setPrice]       = useState('');
  const [description, setDescription] = useState('');
  const [stock,       setStock]       = useState('10');
  const [category,    setCategory]    = useState(CATEGORIES[0]);
  const [imageUrl,    setImageUrl]    = useState('');
  const [isBoosted,   setIsBoosted]   = useState(false);
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [promoCode,   setPromoCode]   = useState('');
  const [promoDiscount,setPromoDiscount]= useState('10');

  // Contact options states
  const [whatsapp,    setWhatsapp]    = useState('');
  const [phone,       setPhone]       = useState('');
  const [facebook,    setFacebook]    = useState('');

  // Encodes contacts into description using robust custom format
  const encodeContactsInDescription = (desc: string, wa: string, fb: string, ph: string) => {
    const base = desc.replace(/\[CONTACTS: .*?\]/gs, '').trim();
    if (!wa && !fb && !ph) return base;
    return `${base}\n\n[CONTACTS: whatsapp=${encodeURIComponent(wa || '')};facebook=${encodeURIComponent(fb || '')};phone=${encodeURIComponent(ph || '')}]`;
  };

  // Decodes contacts from description
  const decodeContactsFromDescription = (fullDesc: string) => {
    const contactsMatch = (fullDesc || '').match(/\[CONTACTS: whatsapp=(.*?);facebook=(.*?);phone=(.*?)\]/);
    if (contactsMatch) {
      return {
        description: fullDesc.replace(/\[CONTACTS: .*?\]/gs, '').trim(),
        whatsapp: decodeURIComponent(contactsMatch[1] || ''),
        facebook: decodeURIComponent(contactsMatch[2] || ''),
        phone: decodeURIComponent(contactsMatch[3] || '')
      };
    }
    return { description: fullDesc || '', whatsapp: '', facebook: '', phone: '' };
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, o, pr] = await Promise.all([getMyProducts(), getSellerOrders(), getMyPromos()]);
      setProducts(p); setOrders(o); setPromos(pr);
    } catch { toast.error("Erreur de chargement."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (userProfile?.shopDescription) {
      const decodedProfile = decodeContactsFromDescription(userProfile.shopDescription);
      setWhatsapp(decodedProfile.whatsapp || userProfile?.phone || '');
      setPhone(decodedProfile.phone || userProfile?.phone || '');
      setFacebook(decodedProfile.facebook || '');
    } else {
      setWhatsapp(userProfile?.phone || '');
      setPhone(userProfile?.phone || '');
      setFacebook('');
    }
  }, [userProfile]);

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setStock('10');
    setCategory(CATEGORIES[0]);
    setImageUrl('');
    setIsBoosted(false);
    setEditProduct(null);
    setShowForm(false);
    if (userProfile?.shopDescription) {
      const decodedProfile = decodeContactsFromDescription(userProfile.shopDescription);
      setWhatsapp(decodedProfile.whatsapp || userProfile?.phone || '');
      setPhone(decodedProfile.phone || userProfile?.phone || '');
      setFacebook(decodedProfile.facebook || '');
    } else {
      setWhatsapp(userProfile?.phone || '');
      setPhone(userProfile?.phone || '');
      setFacebook('');
    }
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setTitle(p.title);
    setPrice(String(p.price));
    setStock(String(p.stock || 10));
    setCategory(p.category || CATEGORIES[0]);
    setImageUrl(p.image_url || '');
    setIsBoosted(p.is_boosted);
    
    // Decode stored contacts
    const decoded = decodeContactsFromDescription(p.description || '');
    setDescription(decoded.description);
    setWhatsapp(decoded.whatsapp || userProfile?.phone || '');
    setPhone(decoded.phone || userProfile?.phone || '');
    setFacebook(decoded.facebook || '');
    
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Encode contacts in the description before submitting
    const encodedDescription = encodeContactsInDescription(description, whatsapp, facebook, phone);
    
    const payload = { 
      title, 
      price: Number(price), 
      description: encodedDescription, 
      stock: Number(stock), 
      category, 
      image_url: imageUrl, 
      is_boosted: isBoosted 
    };
    
    try {
      if (editProduct) { 
        await updateProduct(editProduct.id, payload); 
        toast.success('Produit mis à jour !'); 
      } else { 
        await createProduct(payload); 
        toast.success('Produit ajouté !'); 
      }
      await loadData(); 
      resetForm();
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Erreur."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try { await deleteProduct(id); toast.success('Produit supprimé.'); await loadData(); }
    catch { toast.error('Erreur de suppression.'); }
  };

  const handleCreatePromo = async () => {
    if (!promoCode.trim()) return;
    try { await createPromo({ code: promoCode.toUpperCase(), discount: Number(promoDiscount), is_active: true }); toast.success('Code promo créé !'); setPromoCode(''); await loadData(); }
    catch (err: any) { toast.error(err.response?.data?.message || "Erreur."); }
  };

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.price), 0);
  const tabs = [{ id: 'overview', label: 'Vue d\'ensemble' }, { id: 'products', label: `Produits (${products.length})` }, { id: 'orders', label: `Commandes (${orders.length})` }, { id: 'promos', label: 'Codes Promo' }];

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><TrendingUp size={24} /></div>
        <div><h1 className="text-2xl font-black text-slate-900">Dashboard Vendeur</h1><p className="text-slate-500 text-sm">Gérez votre boutique</p></div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold shrink-0 transition-colors ${activeTab === t.id ? 'bg-primary text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin text-primary" /></div> : (
        <>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[{ label: 'Produits', value: products.length }, { label: 'Commandes', value: orders.length }, { label: 'Revenus GNF', value: revenue.toLocaleString() }].map((s, i) => (
                <div key={i} className="bg-white rounded-[20px] border border-slate-100 p-5">
                  <p className="text-2xl font-black text-primary">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'products' && (
            <>
              <div className="flex justify-end mb-4">
                <button onClick={() => { resetForm(); setShowForm(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                  <Plus size={16} /> Ajouter un produit
                </button>
              </div>
              <AnimatePresence>
                {showForm && (
                  <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-slate-100 p-6 mb-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">Titre *</label><input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" /></div>
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">Prix (GNF) *</label><input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" /></div>
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">Catégorie</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">Stock</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" /></div>
                    </div>
                    <div><label className="text-xs font-bold text-slate-600 mb-1 block">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" /></div>
                    <div><label className="text-xs font-bold text-slate-600 mb-1 block">URL Image</label><input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" /></div>
                    
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                      <p className="text-xs font-black text-slate-700 uppercase tracking-wider">📞 Options de contact direct (Kharandi Connect)</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 mb-1 block">Numéro WhatsApp (ex: +224622000000)</label>
                          <input 
                            type="text" 
                            placeholder="+224..." 
                            value={whatsapp} 
                            onChange={e => setWhatsapp(e.target.value)} 
                            className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary" 
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 mb-1 block">Numéro Téléphone (Appels)</label>
                          <input 
                            type="text" 
                            placeholder="+224..." 
                            value={phone} 
                            onChange={e => setPhone(e.target.value)} 
                            className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary" 
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 mb-1 block">Lien de Profil/Page Facebook</label>
                          <input 
                            type="text" 
                            placeholder="https://facebook.com/..." 
                            value={facebook} 
                            onChange={e => setFacebook(e.target.value)} 
                            className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary" 
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Renseignez ces champs pour que les clients puissent vous joindre instantanément sur les réseaux ou par appel.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editProduct ? 'Mettre à jour' : 'Publier le produit')}
                      </button>
                      <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200">Annuler</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
              {products.length === 0 ? <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100"><p className="text-slate-400">Aucun produit</p></div> : (
                <div className="space-y-3">
                  {products.map((p: any) => (
                    <div key={p.id} className="bg-white rounded-[20px] border border-slate-100 p-4 flex items-center justify-between">
                      <div><p className="font-bold text-slate-900">{p.title}</p><p className="text-xs text-slate-400">{p.category} · {Number(p.price).toLocaleString()} GNF · Stock: {p.stock}</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'orders' && (
            orders.length === 0 ? <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100"><p className="text-slate-400">Aucune commande reçue</p></div> : (
              <div className="space-y-3">
                {orders.map((o: any) => (
                  <div key={o.id} className="bg-white rounded-[20px] border border-slate-100 p-4 flex items-center justify-between">
                    <div><p className="font-bold text-slate-900">{o.product_title}</p><p className="text-xs text-slate-400">{o.buyer_phone} · {Number(o.price).toLocaleString()} GNF</p></div>
                    <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value).then(loadData)}
                      className="border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold focus:outline-none focus:border-primary bg-white">
                      {['pending','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'promos' && (
            <>
              <div className="bg-white rounded-[24px] border border-slate-100 p-5 mb-4">
                <h3 className="font-black text-slate-900 mb-3">Créer un code promo</h3>
                <div className="flex gap-3">
                  <input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="KHARANDI10"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary uppercase" />
                  <input type="number" value={promoDiscount} onChange={e => setPromoDiscount(e.target.value)} min="1" max="100"
                    className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  <span className="flex items-center text-sm text-slate-500 font-bold">%</span>
                  <button onClick={handleCreatePromo} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                    Créer
                  </button>
                </div>
              </div>
              {promos.length > 0 && (
                <div className="space-y-2">
                  {promos.map((p: any) => (
                    <div key={p.id} className="bg-white rounded-[20px] border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tag size={16} className="text-primary" />
                        <span className="font-black font-mono text-slate-900">{p.code}</span>
                        <span className="text-sm text-slate-500">-{p.discount}%</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
