import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { getSubscriptionStatus } from '../../services/payments';
import { useCart } from '../../contexts/CartContext';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { clearCart }  = useCart();
  const [status,       setStatus]      = useState<'loading' | 'success' | 'error'>('loading');
  const [isPremium,    setIsPremium]   = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref'); // KHR-XXXXXXXXXXXX — référence LengoPay

    const verify = async () => {
      try {
        // Attendre 2s que le webhook LengoPay soit traité par Django
        await new Promise(r => setTimeout(r, 2000));

        // Vérifier le statut d'abonnement via l'API Django
        const sub = await getSubscriptionStatus();
        setIsPremium(sub.is_premium);
        clearCart();

        if (sub.is_premium) {
          toast.success('Paiement confirmé ! Votre abonnement est actif.');
          setStatus('success');
          window.dispatchEvent(new CustomEvent('auth:reload-profile'));
        } else {
          // Le webhook n'est peut-être pas encore arrivé — afficher succès quand même
          toast.success('Paiement enregistré. Activation en cours...');
          setStatus('success');
        }
      } catch (err) {
        console.error('Erreur vérification paiement:', err);
        setStatus('error');
      }

      // Rediriger vers l'accueil après 3 secondes
      setTimeout(() => navigate('/'), 3000);
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6
          ${status === 'loading' ? 'bg-blue-100 text-blue-600' :
            status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
      >
        {status === 'loading' ? <Loader2 size={48} className="animate-spin" /> :
         status === 'success' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
      </motion.div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
        {status === 'loading' ? 'Vérification du paiement...' :
         status === 'success' ? (isPremium ? 'Paiement Confirmé !' : 'Paiement enregistré !') :
         'Erreur de vérification'}
      </h1>

      <p className="text-slate-600 max-w-md mb-8">
        {status === 'loading'
          ? 'Veuillez patienter pendant que nous confirmons votre transaction.'
          : status === 'success'
            ? isPremium
              ? 'Votre abonnement est actif. Vous allez être redirigé vers l\'accueil.'
              : 'Votre paiement a bien été reçu. L\'activation peut prendre quelques instants.'
            : 'Impossible de vérifier le paiement. Contactez le support si nécessaire.'}
      </p>

      {status !== 'loading' && (
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-colors"
        >
          Retour à l'accueil
        </button>
      )}
    </div>
  );
};
