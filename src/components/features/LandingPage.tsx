import React from 'react';
import { motion } from 'motion/react';
import { BookMarked, MessageCircle, ArrowRight, Smartphone, Target, Shield, Sprout, Network, Zap, Mail, Phone, MapPin, Lightbulb, Pencil, Pen, Ruler, GraduationCap, Backpack, Compass, Star, Triangle, Circle, Hexagon, Square, Users, Award, TrendingUp, Gift, BarChart3, ShoppingBag, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

export const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 sm:px-8 lg:px-12 overflow-hidden flex flex-col items-center text-center bg-white min-h-[90vh] justify-center">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>

          {/* Floating Background Icons */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.3]">
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-[15%] left-[5%] text-primary">
              <Lightbulb size={64} />
            </motion.div>
            <motion.div animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute top-[65%] left-[10%] text-secondary">
              <Backpack size={72} />
            </motion.div>
            <motion.div animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[75%] right-[8%] text-primary">
              <Ruler size={64} />
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }} className="absolute top-[20%] right-[20%] text-secondary">
              <GraduationCap size={68} />
            </motion.div>
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute top-[80%] left-[20%] text-yellow-400">
              <Star size={48} />
            </motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[25%] left-[25%] text-green-400">
              <BookOpen size={64} />
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-12 relative z-10 w-full mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -10, 0] 
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              y: { 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut" 
              }
            }}
            className="w-32 h-32 md:w-44 md:h-44 mx-auto mb-4 bg-white rounded-[48px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center justify-center -translate-y-4"
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
              alt="Kharandi Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] md:text-xs">
                Ton Camarade Scolaire
              </span>
              <div className="h-px w-8 bg-primary/30" />
            </div>
            
            <h1 className="text-[22px] sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.25] md:leading-[1.1] max-w-5xl px-4 text-center">
              <span className="text-slate-900 flex flex-col sm:flex-row justify-center items-center gap-y-2 sm:gap-x-4 mb-2 drop-shadow-sm">
                <span>Apprendre</span>
                <span className="hidden sm:inline text-primary transition-transform cursor-default select-none mx-1 text-xl sm:text-2xl md:text-4xl lg:text-5xl">→</span>
                <span>Progresser</span>
                <span className="hidden sm:inline text-primary transition-transform cursor-default select-none mx-1 text-xl sm:text-2xl md:text-4xl lg:text-5xl">→</span>
                <span>Réussir</span>
              </span>
              <span className="text-xs sm:text-base md:text-2xl text-slate-400 font-bold block mt-5 md:mt-6 max-w-3xl mx-auto leading-relaxed px-2">
                <span className="flex flex-col sm:inline-flex items-center gap-y-1 sm:gap-1.5 sm:flex-row sm:flex-wrap justify-center">
                  <span>Gagner des points</span>
                  <span className="hidden sm:inline text-primary/60 text-xs md:text-lg">→</span>
                  <span>Accéder à des opportunités</span>
                  <span className="hidden sm:inline text-primary/60 text-xs md:text-lg">→</span>
                  <span>Utiliser ses avantages</span>
                </span>
              </span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative px-4 sm:px-6 w-full max-w-4xl mx-auto"
          >
            <p className="text-sm sm:text-base md:text-xl text-slate-600 leading-relaxed font-medium bg-white/50 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-white/80 shadow-sm">
              Kharandi transforme l’apprentissage en un <span className="text-primary font-bold">écosystème complet</span> où l’élève peut apprendre, pratiquer, être accompagné et récompensé, tandis que les parents restent connectés et impliqués.
            </p>
          </motion.div>
          
          <div className="flex justify-center items-center pt-8 px-4 w-full">
            <Button onClick={onLogin} className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 w-full sm:w-auto max-w-xs sm:max-w-none">
              Accès Plateforme <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* The 7 Pillars Section */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        {/* Background Decorative Icons from Image */}
        <div className="absolute top-12 left-12 md:left-24 opacity-10 pointer-events-none">
          <Backpack size={100} className="text-primary rotate-[-15deg]" strokeWidth={1.5} />
        </div>
        <div className="absolute top-12 right-12 md:right-24 opacity-10 pointer-events-none">
          <BookOpen size={100} className="text-secondary rotate-[15deg]" strokeWidth={1.5} />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h3 className="text-3xl md:text-5xl font-black text-[#0D1B2A] mb-4">Les 7 Piliers de Kharandi</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Kharandi est une plateforme éducative complète qui accompagne l’élève de bout en bout.
            </p>
          </motion.div>

          {/* Row 1: 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* 1. Apprendre */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#EEF9FF] p-8 rounded-[32px] border border-transparent hover:border-sky-200 transition-all group relative overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200 group-hover:scale-110 transition-transform">
                  <BookMarked size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-[#0D1B2A] mb-1">Apprendre</h4>
              <p className="text-xs font-bold text-slate-600 mb-4">(contenus + formations)</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Des cours clairs et structurés, des vidéos, des fiches et des formations pour comprendre en profondeur.
              </p>
            </motion.div>

            {/* 2. S'entraîner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFF5F1] p-8 rounded-[32px] border border-transparent hover:border-orange-200 transition-all group relative overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                  <Pencil size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-[#0D1B2A] mb-1">S'entraîner</h4>
              <p className="text-xs font-bold text-slate-600 mb-4">(exercices + suivi)</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Des exercices variés et des quiz adaptés à ton niveau pour t'entraîner efficacement avec un suivi personnalisé.
              </p>
            </motion.div>

            {/* 3. Être accompagné */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-primary/5 p-8 rounded-[32px] border border-transparent hover:border-primary/20 transition-all group relative overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-[#0D1B2A] mb-1">Être accompagné</h4>
              <p className="text-xs font-bold text-slate-600 mb-4">(répétiteurs)</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Des répétiteurs qualifiés disponibles pour t'aider, répondre à tes questions et t'accompagner dans ta progression.
              </p>
            </motion.div>

            {/* 4. Suivre ses performances */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[#FFF8F1] p-8 rounded-[32px] border border-transparent hover:border-peach-200 transition-all group relative overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#FF7129] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform">
                  <BarChart3 size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-[#0D1B2A] mb-1">Suivre ses perfs</h4>
              <p className="text-xs font-bold text-slate-600 mb-4">(notes scolaires)</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Un tableau de bord complet pour suivre tes notes, tes progrès et identifier tes axes d'amélioration.
              </p>
            </motion.div>
          </div>

          {/* Row 2: 3 Columns Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* 5. Être récompensé */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-[#F8F7FF] p-8 rounded-[32px] border border-transparent hover:border-purple-200 transition-all group relative overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                  <Gift size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-[#0D1B2A] mb-1">Être récompensé</h4>
              <p className="text-xs font-bold text-slate-600 mb-4">(points)</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Gagne des points en apprenant, en t'entraînant et en restant actif sur la plateforme.
              </p>
            </motion.div>

            {/* 6. Transformer ses efforts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-secondary/5 p-8 rounded-[32px] border border-transparent hover:border-secondary/20 transition-all group relative overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-[#0D1B2A] mb-1">Ses avantages</h4>
              <p className="text-xs font-bold text-slate-600 mb-4">(marketplace)</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Utilise tes points dans la marketplace Kharandi pour obtenir des cours, des réductions et des produits utiles à ta réussite.
              </p>
            </motion.div>

            {/* 7. Karamö */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-accent/5 p-8 rounded-[32px] border border-transparent hover:border-accent/20 transition-all group relative overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
              </div>
              <h4 className="text-xl font-black text-[#0D1B2A] mb-1 leading-tight">Karamö : le répétiteur IA Kharandi</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mt-4">
                Ton assistant intelligent disponible 24/7. Il t'aide à réfléchir, comprendre et progresser, sans jamais te donner les réponses toutes faites.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Karamö Chat Interactive Showcase */}
      <section className="py-24 px-6 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-widest italic">Intelligence Artificielle</h2>
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Karamö : le <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200 drop-shadow-sm italic">cœur intelligent</span> de Kharandi
            </h3>
            
            <p className="text-lg md:text-xl text-white font-bold leading-relaxed border-l-4 border-secondary pl-6 py-2">
              Karamö est bien plus qu’un simple répétiteur IA. C’est un assistant éducatif complet qui accompagne l’élève, les parents et l’ensemble du parcours scolaire.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-xl mt-1 shrink-0"><MessageCircle size={24} className="text-secondary" /></div>
                <p className="text-white/90 leading-relaxed">
                  Il guide l’élève avec la <strong className="text-white">méthode socratique</strong> : il ne donne pas directement les réponses, mais aide à comprendre, réfléchir et progresser durablement, étape par étape.
                </p>
              </div>

              <div className="flex items-start gap-4 text-white/90 italic">
                <div className="bg-white/10 p-2 rounded-xl mt-1 shrink-0"><TrendingUp size={24} className="text-secondary" /></div>
                <p className="leading-relaxed">
                  En parallèle, il assure un <strong className="text-white">suivi intelligent de la vie scolaire</strong> : notes, progression, assiduité, points gagnés… tout est centralisé et accessible simplement.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-xl mt-1 shrink-0"><Users size={24} className="text-secondary" /></div>
                <p className="text-white/90 leading-relaxed">
                  Karamö est aussi un <strong className="text-white">pont entre l’école et la famille</strong>. Les parents peuvent interagir avec la plateforme, poser des questions et consulter les informations clés, y compris en langue locale.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-xl mt-1 shrink-0"><Zap size={24} className="text-secondary" /></div>
                <p className="text-white/90 leading-relaxed">
                  Enfin, il accompagne l’utilisateur dans tout l’<strong className="text-white">écosystème Kharandi</strong> : apprendre, s’entraîner, gagner des points et les utiliser dans la marketplace.
                </p>
              </div>
            </div>
          </div>
          
          {/* Chat UI Mockup */}
          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[500px]">
              {/* Header */}
              <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white border border-slate-100">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo" 
                    alt="Karamö" 
                    className="w-full h-full object-cover scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Karamö</p>
                  <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span> En ligne</p>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50 flex flex-col">
                <div className="flex items-end justify-end gap-2">
                  <div className="bg-primary text-white font-medium p-3 rounded-2xl rounded-br-sm max-w-[85%] text-sm shadow-sm md:shadow-none">
                    Karamö, je ne comprends pas comment calculer le discriminant.
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 overflow-hidden bg-white border border-slate-100">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo" 
                      alt="Karamö" 
                      className="w-full h-full object-cover scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-white text-slate-700 p-3 rounded-2xl rounded-bl-sm max-w-[85%] text-sm shadow-sm border border-slate-100">
                    Bonjour ! Ne t'inquiète pas, on va regarder ça ensemble. Te souviens-tu de la formule du discriminant (Delta) ?
                  </div>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <div className="bg-primary text-white font-medium p-3 rounded-2xl rounded-br-sm max-w-[85%] text-sm shadow-sm md:shadow-none">
                    Je crois que c'est b² - 4ac, mais je ne sais pas qui sont a, b et c.
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 overflow-hidden bg-white border border-slate-100">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1T_HkF0Kf0tiZfRSXVgxTdpDmbMTVR9Wo" 
                      alt="Karamö" 
                      className="w-full h-full object-cover scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="bg-white text-slate-700 p-3 rounded-2xl rounded-bl-sm max-w-[85%] text-sm shadow-sm border border-slate-100">
                    Très bien ! C'est exactement ça. Dans une équation de type ax² + bx + c = 0, à ton avis, que valent a, b et c dans l'équation 2x² - 5x + 3 = 0 ?
                  </div>
                </div>
              </div>
              
              {/* Input Mock */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="bg-slate-100 rounded-full py-3 px-4 flex items-center gap-2">
                  <div className="text-slate-500 text-sm flex-1">Écrivez votre réponse ici...</div>
                  <div className="w-8 h-8 bg-primary rounded-full flex flex-shrink-0 items-center justify-center cursor-pointer">
                    <span className="text-white text-xs font-bold">➤</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



       {/* Motivation / Footer CTA */}
      <section className="py-32 px-6 bg-secondary text-slate-900 text-center rounded-t-[3rem] mt-12 pb-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black">Notre Engagement</h2>
            <p className="text-xl text-slate-800 font-medium leading-relaxed">
              "Transformer chaque téléphone en une salle de classe d'excellence. Découvrez la plateforme qui rend l'éducation d'excellence accessible et transforme cette innovation technologique en un impact social à l'échelle nationale."
            </p>
          </div>
          
          <div className="pt-16 border-t border-slate-900/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email */}
              <div className="flex items-center gap-4 bg-white/40 p-6 rounded-2xl border border-white/50 hover:bg-white/60 hover:border-white transition-all group">
                <div className="w-12 h-12 bg-white flex flex-shrink-0 items-center justify-center text-slate-900 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                  <Mail size={24} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-sm text-slate-600 font-medium mb-1">Email</p>
                  <a href="mailto:contactkharandi@gmail.com" className="text-base sm:text-lg font-bold text-slate-900 hover:text-primary transition-colors block break-words">
                    contactkharandi@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 bg-white/40 p-6 rounded-2xl border border-white/50 hover:bg-white/60 hover:border-white transition-all group">
                <div className="w-12 h-12 bg-white flex flex-shrink-0 items-center justify-center text-slate-900 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                  <Phone size={24} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-sm text-slate-600 font-medium mb-1">Téléphone</p>
                  <a href="tel:+224626187117" className="text-base sm:text-lg font-bold text-slate-900 hover:text-primary transition-colors block break-words">
                    +224 626 18 71 17
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-4 bg-white/40 p-6 rounded-2xl border border-white/50 hover:bg-white/60 hover:border-white transition-all group">
                <div className="w-12 h-12 bg-white flex flex-shrink-0 items-center justify-center text-slate-900 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                  <MapPin size={24} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-sm text-slate-600 font-medium mb-1">Adresse</p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 break-words">
                    Belle-Vue, en face du commissariat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

