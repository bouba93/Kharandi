import React, { useState, useEffect } from 'react';
import { Bell, Star, BookOpen, Megaphone, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNotifications, markAllRead, markOneRead } from '../../services/content';

const ICONS: Record<string, any> = {
  info: Bell, success: CheckCircle2, promo: Star, warning: Megaphone,
};

export const Notifications: React.FC = () => {
  const [notifs,  setNotifs]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    try { setNotifs(await getNotifications()); }
    catch { setNotifs([]); }
    finally { setLoading(false); }
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifs(n => n.map(x => ({ ...x, is_read: true })));
  };

  const handleMarkOne = async (id: string) => {
    await markOneRead(id);
    setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x));
  };

  const unread = notifs.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <header className="px-6 pt-12 pb-4 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-[28px] font-extrabold text-slate-900 flex items-center gap-2">
              Notifications {unread > 0 && (
                <span className="bg-primary text-white text-xs font-black px-2 py-0.5 rounded-full">{unread}</span>
              )}
            </h1>
            <p className="text-sm text-slate-500">Vos dernières activités</p>
          </div>
          {unread > 0 && (
            <button onClick={handleMarkAll}
              className="text-xs font-bold text-primary hover:underline">
              Tout marquer lu
            </button>
          )}
        </div>
      </header>

      <div className="p-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[24px] border border-slate-100">
            <Bell size={48} className="mx-auto mb-3 text-slate-200" />
            <p className="font-bold text-slate-400">Aucune notification</p>
          </div>
        ) : notifs.map((n: any) => {
          const Icon = ICONS[n.notif_type] || Bell;
          return (
            <motion.div key={n.id} layout
              onClick={() => !n.is_read && handleMarkOne(n.id)}
              className={`flex gap-4 p-4 rounded-[20px] border transition-all cursor-pointer
                ${n.is_read ? 'bg-white border-slate-100' : 'bg-primary/5 border-primary/20'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0
                ${n.is_read ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${n.is_read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!n.is_read && <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
