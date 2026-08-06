import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink, Maximize2, X, Share2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getStudyAbroad } from '../../services/content';
import { EduLoading } from './EduLoading';
import { toast } from 'sonner';

export const StudyAbroad: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    getStudyAbroad()
      .then((data) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const shareItem = (item: any) => {
    const text = ` Études à l'étranger — ${item.country || item.title}: ${item.viewUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-left animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#18bfd6]/10 text-[#18bfd6] rounded-2xl flex items-center justify-center shrink-0">
            <Globe size={26} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Études à l'étranger</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">Découvrez les programmes et opportunités par pays.</p>
          </div>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Lien copié !");
          }}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
        >
          <Share2 size={15} /> Partager
        </button>
      </div>

      {loading ? (
        <EduLoading message="Chargement..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const countryTitle = item.country || item.title || `Pays ${index + 1}`;
            const flag = item.flag || '🌐';
            const imgUrl = item.imageUrl || `https://drive.google.com/thumbnail?id=${item.driveId}&sz=w1000`;
            const driveUrl = item.viewUrl || `https://drive.google.com/file/d/${item.driveId}/view?usp=drive_link`;

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[28px] border border-slate-200/80 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Image Display */}
                <div 
                  className="relative cursor-pointer overflow-hidden bg-slate-900 group-hover:opacity-95 transition-all"
                  onClick={() => setSelectedImage({ ...item, countryTitle, imgUrl, driveUrl, flag })}
                >
                  <img
                    src={imgUrl}
                    alt={countryTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover max-h-[480px] w-full transform group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                      <Maximize2 size={14} /> Agrandir
                    </span>
                  </div>
                </div>

                {/* Card Bottom / Title & Actions */}
                <div className="p-5 flex items-center justify-between border-t border-slate-100 bg-white">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">{flag}</span>
                    <span>{countryTitle}</span>
                  </h2>

                  <div className="flex items-center gap-2">
                    <a
                      href={driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-[#18bfd6] hover:text-white text-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      title="Ouvrir dans Google Drive"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN IMAGE MODAL LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span className="text-3xl">{selectedImage.flag}</span>
                  <span>{selectedImage.countryTitle}</span>
                </h3>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedImage.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#18bfd6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#15adc1] transition-all"
                  >
                    <Download size={14} /> Voir / Télécharger
                  </a>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body / Image */}
              <div className="p-4 overflow-auto flex items-center justify-center bg-slate-900/5 min-h-[400px]">
                <img
                  src={selectedImage.imgUrl}
                  alt={selectedImage.countryTitle}
                  referrerPolicy="no-referrer"
                  className="max-h-[72vh] w-auto object-contain rounded-xl shadow-md"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
