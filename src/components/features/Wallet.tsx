import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Gift, 
  ShoppingBag, PenTool, Award, RefreshCw, CreditCard, Sparkles, 
  CheckCircle2, Clock, ShieldCheck, Plus, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletProps {
  setActiveTab?: (tab: string) => void;
}

export const Wallet: React.FC<WalletProps> = ({ setActiveTab }) => {
  const { userProfile, refreshProfile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeCode, setRechargeCode] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const points = userProfile?.points || 0;
  // Conversion indicative : 10 pts = 100 GNF
  const equivalentGNF = points * 10;

  useEffect(() => {
    loadTransactions();
  }, [userProfile?.uid]);

  const loadTransactions = () => {
    if (!userProfile?.uid) return;
    const key = `kharandi_wallet_transactions_${userProfile.uid}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        setTransactions([]);
      }
    } else {
      // Transactions initiales de bienvenue si aucune transaction n'existe
      const initialTxs: Transaction[] = [
        {
          id: 'tx-welcome',
          date: new Date().toISOString(),
          type: 'credit',
          amount: 50,
          description: 'Bonus de bienvenue Kharandi',
          status: 'completed'
        }
      ];
      setTransactions(initialTxs);
      localStorage.setItem(key, JSON.stringify(initialTxs));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshProfile) {
      await refreshProfile();
    }
    loadTransactions();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Portefeuille mis à jour !');
    }, 500);
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rechargeCode.trim()) {
      toast.error('Veuillez entrer un code valide.');
      return;
    }

    const codeUpper = rechargeCode.trim().toUpperCase();
    if (codeUpper === 'KHARANDI2026' || codeUpper === 'BONUS100') {
      const bonusAmount = 100;
      const key = `kharandi_wallet_transactions_${userProfile?.uid}`;
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'credit',
        amount: bonusAmount,
        description: `Code Recharge Cadeau (${codeUpper})`,
        status: 'completed'
      };
      
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem(key, JSON.stringify(updated));

      // Mettre à jour les points locaux si possible
      if (userProfile) {
        userProfile.points = (userProfile.points || 0) + bonusAmount;
      }

      toast.success(`Code activé ! +${bonusAmount} points ajoutés à votre portefeuille.`);
      setRechargeCode('');
      setIsRecharging(false);
    } else {
      toast.error('Code invalide ou déjà utilisé.');
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'credit') return tx.type === 'credit';
    if (filter === 'debit') return tx.type === 'debit';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* En-tête du Portefeuille */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#18bfd6] to-[#fcb303] rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#18bfd6]/20">
            <WalletIcon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mon Wallet Points</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#18bfd6]/10 text-[#18bfd6] uppercase tracking-wider">
                Compte Actif
              </span>
            </div>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Gagnez des points en révisant et échangez-les contre des cadeaux et services.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#18bfd6]' : 'text-slate-500'} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Cartes Principales de Solde */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Solde Points */}
        <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col justify-between min-h-[220px]">
          {/* Cercles décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#18bfd6]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fcb303]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                Solde Kharandi Récompenses
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {points.toLocaleString('fr-FR')}
                </span>
                <span className="text-lg font-extrabold text-[#fcb303]">PTS</span>
              </div>
              <p className="text-slate-300 text-xs font-medium mt-1">
                Valeur estimée : <strong className="text-white font-bold">{equivalentGNF.toLocaleString('fr-FR')} GNF</strong> en avantages scolaires.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-slate-200">
              <ShieldCheck size={14} className="text-[#18bfd6]" /> Sécurisé
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => setActiveTab && setActiveTab('Exo Gagnant')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#18bfd6] hover:bg-[#15aabf] text-slate-900 font-extrabold text-xs rounded-xl shadow-lg shadow-[#18bfd6]/20 transition-all cursor-pointer"
            >
              <PenTool size={16} />
              <span>Gagner des points</span>
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('Kharandi Makiti')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <ShoppingBag size={16} className="text-[#fcb303]" />
              <span>Utiliser en boutique</span>
            </button>

            <button
              onClick={() => setIsRecharging(!isRecharging)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Code cadeau</span>
            </button>
          </div>
        </div>

        {/* Carte Paliers de Récompenses */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Gift size={18} className="text-[#fcb303]" /> Prochains Paliers
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Objectifs</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-800">Kit Fournitures Scolaires</div>
                  <div className="text-[10px] text-slate-500 font-semibold">100 Points requis</div>
                </div>
                {points >= 100 ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <span className="text-[10px] font-bold text-[#18bfd6] bg-[#18bfd6]/10 px-2 py-0.5 rounded-full">
                    {points}/100 pts
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-800">1 Mois d'Abonnement Offert</div>
                  <div className="text-[10px] text-slate-500 font-semibold">500 Points requis</div>
                </div>
                {points >= 500 ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {points}/500 pts
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-800">Bourse d'Excellence Kharandi</div>
                  <div className="text-[10px] text-slate-500 font-semibold">1000 Points requis</div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
                  {points}/1000 pts
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab && setActiveTab('Exo Gagnant')}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Participer au Concours Hebdo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Zone Code Promo / Code Recharge */}
      <AnimatePresence>
        {isRecharging && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleRedeemCode}
            className="bg-gradient-to-r from-[#18bfd6]/10 to-[#fcb303]/10 border border-[#18bfd6]/20 p-6 rounded-3xl space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Gift size={18} className="text-[#18bfd6]" /> Activer un Code Cadeau ou Promo
              </h3>
              <button
                type="button"
                onClick={() => setIsRecharging(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Fermer
              </button>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Saisissez votre code promo ou votre code de recharge partenaire (ex: <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[#18bfd6] font-bold">KHARANDI2026</code> ou <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[#18bfd6] font-bold">BONUS100</code>).
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={rechargeCode}
                onChange={(e) => setRechargeCode(e.target.value)}
                placeholder="Ex: KHARANDI2026"
                className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#18bfd6]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#18bfd6] hover:bg-[#15aabf] text-slate-900 font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Activer
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Historique des Transactions */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Historique des Opérations</h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Toutes vos entrées et sorties de points sur Kharandi.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Toutes ({transactions.length})
            </button>
            <button
              onClick={() => setFilter('credit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'credit'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Gains (+)
            </button>
            <button
              onClick={() => setFilter('debit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filter === 'debit'
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dépenses (-)
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Clock size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-black text-slate-700">Aucune transaction trouvée</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              Résolvez des séries sur Exo Gagnant pour accumuler des points dans votre portefeuille.
            </p>
            <button
              onClick={() => setActiveTab && setActiveTab('Exo Gagnant')}
              className="mt-4 px-4 py-2 bg-[#18bfd6] text-slate-900 font-extrabold text-xs rounded-xl hover:bg-[#15aabf] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <PenTool size={14} />
              <span>Commencer une épreuve</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-2xl transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'credit' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800 leading-snug">{tx.description}</div>
                    <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {new Date(tx.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-sm font-black ${
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.amount} pts
                  </div>
                  <span className="inline-block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {tx.status === 'completed' ? 'Validé' : 'En cours'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
