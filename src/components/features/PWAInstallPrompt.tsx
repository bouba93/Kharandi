import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      
      setIsVisible(false);
    } else {
      
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-6 md:w-96"
        >
          <div className="bg-[#0D1B2A] text-white p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
              <Download className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[15px] leading-tight mb-0.5">Installer Kharandi</h4>
              <p className="text-[12px] text-gray-400">Accédez à vos cours plus rapidement et hors ligne.</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-primary hover:bg-primary/90 text-[#0D1B2A] px-4 py-2 rounded-xl text-[13px] font-bold transition-colors"
              >
                Installer
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-[12px] font-medium flex items-center justify-center gap-1"
              >
                Plus tard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
