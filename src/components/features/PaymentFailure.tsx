import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6"
      >
        <XCircle size={48} />
      </motion.div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
        Échec du paiement
      </h1>
      <p className="text-slate-600 max-w-md mb-8">
        Une erreur est survenue lors de votre paiement. Veuillez réessayer.
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-colors"
      >
        Retour
      </button>
    </div>
  );
};
