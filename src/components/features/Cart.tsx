import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2, Loader2, Tag, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { notifyOrderConfirmation } from '../../services/notifications';
import { checkPromoCode } from '../../services/marketplace';
import { createOrder } from '../../services/orders';
import { initiatePayment } from '../../services/payments';
import { toast } from 'sonner';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, promoCode, applyPromoCode } = useCart();
  const { userProfile } = useAuth();
  const [isCheckingOut,  setIsCheckingOut]  = useState(false);
  const [orderSuccess,   setOrderSuccess]   = useState(false);
  const [promoInput,     setPromoInput]     = useState('');
  const [isApplyingPromo,setIsApplyingPromo]= useState(false);

  const subtotal      = cart.reduce((s, i) => s + i.price, 0);
  const discountAmount= promoCode ? (subtotal * promoCode.discount) / 100 : 0;
  const total         = subtotal - discountAmount;

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    setIsApplyingPromo(true);
    try {
      const promo = await checkPromoCode(promoInput.toUpperCase());
      applyPromoCode({ id: promo.id, code: promo.code, discount: promo.discount, sellerId: promo.seller_id });
      toast.success(`Code promo appliqué : -${promo.discount}%`);
    } catch {
      toast.error('Code promo invalide ou expiré.');
      applyPromoCode(null);
    } finally { setIsApplyingPromo(false); }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { toast.error('Veuillez vous connecter pour commander.'); return; }
    setIsCheckingOut(true);
    try {
      const orderData = await createOrder(
        cart.map(item => ({ document_id: item.id, name: item.title, unit_price: item.price, quantity: (item as any).quantity || 1 })),
        "GNF"
      );
      const orderId = orderData?.id || orderData?.order_id;
      const payData = await initiatePayment({ amount: total, currency: "GNF", order_id: orderId });
      if (payData?.payment_url) {
        clearCart();
        window.location.href = payData.payment_url;
      } else {
        toast.error("URL de paiement introuvable.");
      }
      if (userProfile?.phone) {
        await notifyOrderConfirmation(userProfile.phone, orderId, total);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors du checkout.");
    } finally { setIsCheckingOut(false); }
  };

  if (orderSuccess) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag size={48} className="text-green-600" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Commande confirmée !</h2>
      <p className="text-slate-500">Votre commande a été passée avec succès.</p>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24">
      <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
        <ShoppingBag size={24} className="text-primary" /> Mon Panier ({cart.length})
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[24px] border border-slate-100">
          <ShoppingBag size={48} className="mx-auto mb-3 text-slate-200" />
          <p className="font-bold text-slate-400">Votre panier est vide</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {cart.map((item: any) => (
              <div key={item.id} className="bg-white rounded-[20px] border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-primary font-bold">{Number(item.price).toLocaleString()} GNF</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Code promo */}
          <div className="bg-white rounded-[20px] border border-slate-100 p-4 mb-4">
            <div className="flex gap-2">
              <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Code promo"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              <button onClick={handleApplyPromo} disabled={isApplyingPromo}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors disabled:opacity-60">
                {isApplyingPromo ? <Loader2 size={16} className="animate-spin" /> : <Tag size={16} />}
              </button>
            </div>
            {promoCode && (
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-green-600 font-bold">✓ {promoCode.code} — -{promoCode.discount}%</span>
                <button onClick={() => applyPromoCode(null)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-white rounded-[20px] border border-slate-100 p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm text-slate-600"><span>Sous-total</span><span>{subtotal.toLocaleString()} GNF</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Réduction</span><span>-{discountAmount.toLocaleString()} GNF</span></div>}
            <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total</span><span className="text-primary">{total.toLocaleString()} GNF</span>
            </div>
          </div>

          <button onClick={handleCheckout} disabled={isCheckingOut}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60 transition-colors">
            {isCheckingOut ? <><Loader2 size={18} className="animate-spin" /> Traitement...</> : 'Passer la commande →'}
          </button>
        </>
      )}
    </div>
  );
};
