import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface PaymentButtonProps {
  amount: number; currency: string; label?: string;
  planId?: string; className?: string; children?: React.ReactNode; style?: React.CSSProperties;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount, currency, label = "Payer", planId, className, children, style
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // ✅ JWT Django uniquement — plus de auth.currentUser Firebase
      const token = localStorage.getItem('access_token');
      if (!token) { toast.error("Vous devez être connecté pour effectuer un paiement."); return; }

      if (planId) {
        const { initiateSubscription } = await import('../../services/payments');
        const data = await initiateSubscription(planId, currency || "GNF");
        if (data?.payment_url) window.location.href = data.payment_url;
        else toast.error("URL de paiement introuvable.");
      } else {
        const { initiatePayment } = await import('../../services/payments');
        const data = await initiatePayment({ amount, currency: currency || "GNF" });
        if (data?.payment_url) window.location.href = data.payment_url;
        else toast.error("URL de paiement introuvable.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors du paiement.");
    } finally { setLoading(false); }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} className={className} style={style}>
      {loading ? "Chargement..." : children || label}
    </Button>
  );
};
