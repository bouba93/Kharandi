import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, X, Loader2, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  OUVERT: 'Ouvert', EN_COURS: 'En cours', RESOLU: 'Résolu', FERME: 'Fermé',
};
const STATUS_COLORS: Record<string, string> = {
  OUVERT: 'bg-blue-100 text-blue-700', EN_COURS: 'bg-yellow-100 text-yellow-700',
  RESOLU: 'bg-green-100 text-green-700', FERME: 'bg-gray-100 text-gray-500',
};

export const SupportTickets: React.FC = () => {
  const [tickets,     setTickets]     = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [isCreating,  setIsCreating]  = useState(false);
  const [subject,     setSubject]     = useState('');
  const [description, setDescription] = useState('');
  const [category,    setCategory]    = useState<'PAIEMENT' | 'TECHNIQUE' | 'CONTENU' | 'ABONNEMENT' | 'AUTRE'>('AUTRE');
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const { getTickets } = await import('../../services/support');
      const data = await getTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch { setTickets([]); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) { setError("Le sujet est obligatoire."); return; }
    setSubmitting(true); setError(null);
    try {
      const { createTicket } = await import('../../services/support');
      await createTicket({ title: subject, description, category });
      setSubject(''); setDescription(''); setIsCreating(false);
      toast.success("Ticket créé avec succès !");
      await fetchTickets();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la création.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Support</h1>
            <p className="text-sm text-slate-500">Signalez un problème ou posez une question.</p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="flex items-center gap-2 text-sm">
          {isCreating ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Nouveau ticket</>}
        </Button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 mb-6">
            <h2 className="font-black text-slate-900 mb-4">Nouveau ticket</h2>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Sujet *</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} required
                  placeholder="Décrivez votre problème en une phrase"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Catégorie</label>
                <select value={category} onChange={e => setCategory(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white">
                  <option value="TECHNIQUE">Problème technique</option>
                  <option value="PAIEMENT">Paiement</option>
                  <option value="ABONNEMENT">Abonnement</option>
                  <option value="CONTENU">Contenu</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Décrivez le problème en détail..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none h-24" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Envoi...</> : 'Envoyer le ticket'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 size={32} className="animate-spin text-primary" /></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100">
          <MessageSquare size={48} className="mx-auto mb-3 text-slate-200" />
          <p className="font-bold text-slate-400">Aucun ticket pour l'instant</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t: any) => (
            <div key={t.id} className="bg-white rounded-[20px] border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-bold text-slate-900">{t.title}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-bold shrink-0 ${STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-500'}`}>
                  {STATUS_LABELS[t.status] || t.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.category} · {new Date(t.created_at).toLocaleDateString('fr-FR')}</p>
              {t.replies?.length > 0 && (
                <p className="text-xs text-primary font-bold mt-2">{t.replies.length} réponse(s)</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
