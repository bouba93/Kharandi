import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, ArrowRight, X, Sparkles, BookOpen, Clock, Share2, Printer, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNews } from '../../services/content';
import { EduLoading } from './EduLoading';

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  source: string;
  excerpt: string;
  content: string;
  color: string;
  image: string;
  secondImage?: string;
  thirdImage?: string;
  readTime?: string;
  isTrending?: boolean;
}

export const PRESET_NEWS: NewsArticle[] = [
  {
    id: "bac-2026-guinee",
    title: "Baccalauréat 2026 en Guinée : lancement de l'examen et instauration historique d'une session de rattrapage",
    category: "Examens Nationaux",
    date: "Lundi 29 Juin 2026",
    source: "Guinee7",
    excerpt: "Le baccalauréat unique, session 2026, a officiellement débuté ce lundi 29 juin sur l'ensemble du territoire guinéen. Au total, 94 392 candidats prennent part à cet examen, marqué par une innovation historique : l'instauration d'une session de rattrapage.",
    content: `Le baccalauréat unique, session 2026, a officiellement débuté ce lundi 29 juin sur l'ensemble du territoire guinéen. Au total, 94 392 candidats, dont 41 642 filles et 32 248 candidats libres, prennent part à cet examen, réparti dans environ 250 centres à travers le pays. Cette session marque la dernière étape d'une campagne d'examens nationaux qui a déjà mobilisé près de 600 000 candidats toutes filières confondues, après le certificat d'études élémentaires et le BEPC.

Dans plusieurs communes, des cérémonies de lancement ont eu lieu en présence des autorités locales et éducatives, qui ont insisté sur la sécurisation des sujets et la lutte contre la fraude. À Conakry, les délégués chargés de superviser le déroulement des épreuves ont été mobilisés en amont, et le ministre de l'Éducation nationale s'est adressé aux candidats à la veille des épreuves pour les encourager. Les autorités assurent avoir pris toutes les dispositions logistiques et sécuritaires nécessaires, tandis que la correction des copies devrait débuter rapidement afin de réduire les délais avant la publication des résultats, dont la date reste pour l'instant inconnue.

### Une innovation majeure : la session de rattrapage

La grande nouveauté de cette édition réside dans l'instauration, pour la première fois dans l'histoire du système éducatif guinéen, d'une session de rattrapage pour le baccalauréat. Cette réforme, annoncée par arrêté ministériel le jour même du lancement des épreuves, vise à offrir une seconde chance aux candidats ayant échoué de justesse à l'examen.

Concrètement, les élèves ayant obtenu une moyenne générale comprise entre 8,50/20 et 9,99/20 à la session ordinaire pourront bénéficier de ce dispositif. Aucune démarche administrative ne sera nécessaire de la part des candidats : leur identification se fera automatiquement par la Direction générale des examens et contrôles scolaires, concours et passerelles. Les épreuves de rattrapage devront se tenir dans un délai maximal de 21 jours après la proclamation des résultats de la session ordinaire, et porteront sur deux matières au maximum, avec une priorité accordée aux disciplines de spécialité non validées.

### Modalités de notation et valorisation du diplôme

Les notes obtenues lors du rattrapage remplaceront celles de la session ordinaire si elles sont meilleures. Tout candidat parvenant ainsi à atteindre une moyenne définitive de 10/20 sera déclaré admis, et le diplôme délivré aura exactement la même valeur académique et juridique que celui obtenu lors de la session classique. Les heureux bénéficiaires de cette voie seront toutefois orientés en priorité vers les filières de l'enseignement technique et de la formation professionnelle.

Selon les autorités, cette mesure répond à une volonté présidentielle de protéger les élèves confrontés à des difficultés ponctuelles et de mettre fin aux situations d'échec liées à de très faibles écarts de points. Elle s'inscrit plus largement dans un effort de modernisation du système national d'évaluation, fondé sur le mérite et l'équité, et vise à réduire le poids du redoublement sur les familles comme sur les infrastructures scolaires. Du côté des parents d'élèves, l'accueil est largement favorable, certaines associations qualifiant cette réforme de victoire après des années de plaidoyer en ce sens.`,
    color: "bg-[#bff0f5]/10 text-primary border-[#bff0f5]/20",
    image: "https://lh3.googleusercontent.com/d/1uy_RhCTz5fGZmymWntNNLLQZCFCwocAk",
    readTime: "5 min de lecture",
    isTrending: true
  },
  {
    id: "cee-2026-ratoma",
    title: "Examen d'entrée en 7ème année : le coup d'envoi de la session 2026 donné à Conakry",
    category: "Examens Nationaux",
    date: "Jeudi 18 Juin 2026",
    source: "Ministère de l'Éducation Nationale",
    excerpt: "Les épreuves de l'examen d'entrée en 7ème année, sanctionnées par le Certificat d'Études Élémentaires (CEE), ont officiellement démarré ce jeudi 18 juin 2026 sur toute l'étendue du territoire national. C'est à l'école primaire de Konimodou, dans la commune de Ratoma à Conakry, que le ministre de l'Éducation nationale, Alpha Bacar Barry, a personnellement lancé la première composition, celle de Rédaction.",
    content: `Les épreuves de l'examen d'entrée en 7ème année, sanctionnées par le Certificat d'Études Élémentaires (CEE), ont officiellement démarré ce jeudi 18 juin 2026 sur toute l'étendue du territoire national. C'est à l'école primaire de Konimodou, dans la commune de Ratoma à Conakry, que le ministre de l'Éducation nationale, Alpha Bacar Barry, a personnellement lancé la première composition, celle de Rédaction.

L'enjeu est considérable. À l'échelle du pays, 338 392 candidats sont inscrits à cette session, dont 159 578 filles. Le centre de Konimodou, à lui seul, accueille 501 candidats répartis dans 17 salles, parmi lesquels 271 jeunes filles.

### Un examen pensé pour l'inclusion
Le ministre a insisté sur les mesures déployées pour offrir aux élèves les meilleures conditions possibles. L'objectif affiché était d'apaiser les candidats et de leur permettre de prendre place sereinement dans les salles. Un effort particulier a été consenti pour les élèves malvoyants, dont les épreuves ont été retranscrites en braille.

L'un de ces candidats, Moussa Moïse Guémou, a confié son optimisme. Il a décrit l'usage du poinçon et de la tablette munie de papier bristol qui lui permet d'écrire en braille, avant de dire espérer figurer parmi les meilleurs du pays à l'issue de cet examen.

Le département a également joué la carte de la proximité, en rapprochant les centres d'examen des zones de résidence des élèves. Les équipes d'encadrement, de surveillance et de coordination, ainsi que des agents du ministère, ont été déployées sur le terrain pour intervenir rapidement en cas de difficulté.

### Une session sous le signe des réformes
Pour Alpha Bacar Barry, cette édition a valeur de test. Il a évoqué un « moment de vérité » destiné à mesurer l'efficacité des réformes engagées dans l'enseignement pré-universitaire, citant notamment la refonte récente des programmes du primaire et la distribution de nouveaux manuels, qui marquent l'entrée dans une nouvelle ère pour ce cycle.

Le ministre s'est aussi félicité d'une dynamique encourageante : la forte présence de jeunes filles parmi les candidats. Un signal positif pour la scolarisation des filles, qu'il importe désormais, selon lui, d'accompagner jusqu'au terme de leur parcours afin qu'elles puissent révéler tout leur potentiel.

### Un calendrier national resserré
Cette épreuve ouvre une séquence chargée. Les trois grands examens nationaux — l'entrée en 7ème année, le BEPC et le Baccalauréat unique — se succèdent sur deux semaines, du 18 juin au 3 juillet 2026.`,
    color: "bg-amber-50 text-amber-900 border-amber-200",
    image: "https://lh3.googleusercontent.com/d/1WwH2TngRr6394pk3nvbFQSQWwaKL-EQN",
    secondImage: "https://lh3.googleusercontent.com/d/1JJ0E9WjCZK9xqObbvhHQcMBWj6VD7LT-",
    readTime: "4 min de lecture",
    isTrending: true
  },
  {
    id: "bepc-2026-guinee",
    title: "BEPC en Guinée : Début des épreuves à travers le pays",
    category: "Examens Nationaux",
    date: "Lundi 22 Juin 2026",
    source: "Ministère de l'Éducation Nationale",
    excerpt: "Ce lundi 22 juin 2026, les épreuves du Brevet d’Etude du Premier Cycle (BEPC) ont officiellement débuté sur tout l’étendue du territoire guinéen avec plus de 136 639 candidats mobilisés.",
    content: `Conakry, Guinée - Le compte à rebours est terminé. Le moment de mettre en pratique les connaissances acquises en classe est désormais arrivé. Ce lundi 22 juin 2026, les épreuves du Brevet d’Etude du Premier Cycle (BEPC) ont officiellement débuté sur tout l’étendue du territoire guinéen.

### Une participation massive à l'échelle nationale

Selon les statistiques officielles, 136 639 candidats dont 73 837 garçons, 62 802 filles, et 46 805 candidats libres participent à cet examen et sont répartis dans les différents centres d’évaluation à travers le pays. Les autorités éducatives et les encadreurs sont mobilisés afin d’assurer le bon fonctionnement des épreuves dans le respect des consignes établies.

### Tolérance zéro contre les fraudes

Le ministère de l’Education nationale a rappelé le respect strict des dispositions établies pour la bonne tenue des épreuves, notamment l’interdiction totale de toute forme de fraude, tout en souhaitant bonne chance à l’ensemble des candidats.

Pour notre part, nous leur adressons également nos encouragements et leur souhaitons plein de succès pour cette session du BEPC 2026.`,
    color: "bg-[#18bfd6]/10 text-[#18bfd6] border-[#18bfd6]/20",
    image: "https://lh3.googleusercontent.com/d/1Jehzxg4dQS5KANJ6aIg5pG0KeKNG8auQ",
    secondImage: "https://lh3.googleusercontent.com/d/1-uw1GM2f1KY_Kgh3NOlxmh7vIzuSkaB3",
    thirdImage: "https://lh3.googleusercontent.com/d/1OTgKgPni2nig7QxNMRpvRXYFaSQwNDvO",
    readTime: "3 min de lecture",
    isTrending: true
  }
];

export const News: React.FC = () => {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Tous');

  useEffect(() => {
    setItems(PRESET_NEWS);
    setLoading(false);
  }, []);

  const categories = ['Tous', 'Examens Nationaux'];
  const filteredArticles = categoryFilter === 'Tous' 
    ? items 
    : items.filter(a => a.category.toLowerCase().includes(categoryFilter.slice(0, 5).toLowerCase()) || categoryFilter.toLowerCase().includes(a.category.slice(0, 5).toLowerCase()));

  // Selected article detail reader modal
  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">
      {/* Newspaper Header Masthead Decoration */}
      <div className="border-t-4 border-b border-black py-4 mb-8 text-center bg-amber-50/15 rounded-xl shadow-xs px-4">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-black/10 pb-4 mb-4 gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
          <div>ÉDITION NATIONALE GUINÉENNE</div>
          <div className="flex items-center gap-1.5"><Newspaper size={14} className="text-primary animate-pulse" /> JOURNAL OFFICIEL DE KHARANDI</div>
          <div>COURS, EXAMENS ET BOURSES</div>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mt-2 mb-2 select-none uppercase">
          La Tribune Éducative
        </h1>
        <p className="font-serif italic text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-4">
          « L'éducation est l'arme la plus puissante pour changer le monde. Le savoir guinéen réinventé au quotidien. »
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-black/10 pt-4 gap-4 text-xs font-mono text-slate-600">
          <div className="border-r border-black/5 last:border-0 py-1">
            <strong>DATE :</strong> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="border-r border-black/5 last:border-0 py-1">
            <strong>ACCÈS :</strong> Libre d'accès
          </div>
          <div className="border-r border-black/5 last:border-0 py-1 hidden md:block">
            <strong>VOL :</strong> XII · N° 104
          </div>
          <div className="py-1 hidden md:block">
            <strong>COLLABORATION :</strong> SNABE, MENA, KHARANDI LAB
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        <span className="text-xs font-mono text-slate-400 shrink-0 uppercase flex items-center gap-1">
          <AlignLeft size={12} /> Rubriques :
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            id={`filter-news-${cat}`}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shrink-0 cursor-pointer ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div className="py-24"><EduLoading message="Impression de la gazette en cours..." /></div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-24 bg-white/50 border border-slate-200 rounded-[32px] p-8 max-w-lg mx-auto shadow-sm">
          <Newspaper className="mx-auto text-slate-300 mb-4 animate-bounce" size={48} />
          <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Aucun article dans cette rubrique</h3>
          <p className="text-slate-500 text-sm">Le rédacteur prépare de nouveaux articles de presse scolaire pour la Guinée. Revenez très bientôt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Headline spotlight: 1st article of the list */}
          {filteredArticles[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 bg-amber-50/10 border-2 border-slate-900/10 rounded-[36px] overflow-hidden p-6 md:p-8 hover:shadow-xl hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
              onClick={() => openArticle(filteredArticles[0])}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider text-red-500 uppercase">À LA UNE</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{filteredArticles[0].date}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <span className="inline-block text-xs font-bold font-mono px-2.5 py-1 rounded border border-slate-400/25 bg-slate-10 border-slate-200 text-slate-800 uppercase">
                      {filteredArticles[0].category}
                    </span>
                    <h2 className="font-display text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight leading-header group-hover:text-primary transition-colors">
                      {filteredArticles[0].title}
                    </h2>
                    <p className="text-slate-650 text-sm md:text-base leading-relaxed font-serif italic text-justify">
                      {filteredArticles[0].excerpt}
                    </p>
                  </div>
                  
                  <div className="md:col-span-5 h-48 md:h-64 rounded-2xl overflow-hidden relative border border-slate-100">
                    <img 
                      src={filteredArticles[0].image} 
                      alt="Spotlight logo" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-3 pt-8">
                      <p className="text-[10px] font-mono text-white/9 text-white/90 truncate">Source : {filteredArticles[0].source}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-6">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {filteredArticles[0].readTime || '3 min'}
                </span>
                <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-all flex items-center gap-1.5 font-mono">
                  Lire le grand format <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </motion.div>
          )}

          {/* Right column trending bulletin on desktop */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-primary via-[#16afd4] to-[#0e8da3] text-white rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden shadow-lg h-full min-h-[220px]">
              <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className="text-white" />
                  <span className="text-xs font-mono text-white uppercase tracking-wider font-bold">Innovation Kharandi</span>
                </div>
                <h3 className="text-xl font-bold font-sans tracking-tight leading-snug mb-3 text-white">
                  Toute l'école guinéenne réinventée sur votre mobile de 7ème à la Terminale.
                </h3>
                <p className="text-white/90 text-xs leading-relaxed font-serif italic">
                  Activez votre parcours numérique et apprenez plus vite grâce à nos exercices corrigés pas-à-pas et notre tuteur virtuel.
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-white/20 pt-4 mt-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-white">GN</div>
                <div>
                  <p className="text-xs font-bold text-white">Guinée Éducation Digitale</p>
                  <p className="text-[10px] text-white/70 font-mono">Réseaux scolaires 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of other articles */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredArticles.slice(1).map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.05 }}
                onClick={() => openArticle(item)}
                className="bg-white hover:bg-amber-50/5 p-6 rounded-[32px] border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="h-44 w-full rounded-2xl overflow-hidden mb-4 relative bg-gray-100 border border-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/95 text-slate-800 shadow-sm border border-slate-100">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                      <span>Source : {item.source}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-serif italic line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {item.readTime || '3 min'}
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1 font-mono">
                    Lire l'article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      )}

      {/* Immersive Newspaper Reader Modal View */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 md:p-8 flex items-center justify-center"
            onClick={closeArticle}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#fdfbf7] text-slate-900 w-full max-w-4xl rounded-[36px] shadow-2xl overflow-hidden border-4 border-slate-900/20 max-h-[90vh] flex flex-col relative"
              onClick={e => e.stopPropagation()} // Stop propagation to avoid auto-closing
            >
              {/* Retro Paper Tint Gradient */}
              <div className="absolute inset-0 bg-radial from-transparent to-amber-900/2 pointer-events-none" />

              {/* Top Banner Toolbar */}
              <div className="bg-slate-900 text-slate-300 px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 z-10 relative">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase">LA TRIBUNE DIGITAL READING</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => window.print()} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Imprimer l'article">
                    <Printer size={15} />
                  </button>
                  <button onClick={closeArticle} className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable Newspaper Pages */}
              <div className="overflow-y-auto p-6 md:p-10 space-y-6 flex-1 hide-scrollbar relative">
                
                {/* Masthead of the specific article */}
                <div className="text-center space-y-3 pb-6 border-b-2 border-double border-slate-900/20">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                      {selectedArticle.category}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase">{selectedArticle.source}</span>
                  </div>
                  
                  <h2 className="font-display text-2xl md:text-3.5xl lg:text-4.5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
                    {selectedArticle.title}
                  </h2>

                  <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-500 pt-2">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {selectedArticle.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> Continuité de lecture : {selectedArticle.readTime || '3 min'}</span>
                  </div>
                </div>

                {/* Article content in real newspaper double column layout if screen size is wide */}
                <div className="space-y-6">
                  {selectedArticle.image && (
                    <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden relative border border-slate-200 bg-white shadow-sm">
                      <img 
                        src={selectedArticle.image} 
                        alt="Hero banner" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/40 text-white text-[11px] font-mono p-3">
                        Illustration officielle — Publiée pour Kharandi Guinée. Tout droit réservé.
                      </div>
                    </div>
                  )}

                  {/* Body columns with Drop Cap */}
                  <div className="font-serif text-slate-800 text-base md:text-lg leading-relaxed text-justify md:columns-2 gap-8 md:border-b md:border-double md:border-slate-900/10 md:pb-8">
                    
                    {/* Inject custom styled drop cap into the first paragraph of rendering */}
                    <div className="first-paragraph-container prose prose-amber">
                      {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                        // Render headings as bold stylized subheaders
                        if (paragraph.startsWith('###')) {
                          return (
                            <h4 key={index} className="font-display font-black text-slate-900 text-lg md:text-xl tracking-tight mt-6 mb-3 border-l-3 border-primary pl-2.5 break-inside-avoid">
                              {paragraph.replace('###', '').trim()}
                            </h4>
                          );
                        }

                        // Render quotes nicely
                        if (paragraph.startsWith('>')) {
                          return (
                            <blockquote key={index} className="font-serif italic border-l-4 border-slate-900/30 pl-4 my-4 my-2 text-slate-650 bg-amber-50/20 py-2 pr-2 break-inside-avoid">
                              {paragraph.replace('>', '').replace(/—/g, '').trim()}
                            </blockquote>
                          );
                        }

                        // Bullet list rendering
                        if (paragraph.includes('*')) {
                          return (
                            <ul key={index} className="list-disc pl-5 my-3 space-y-1 font-sans text-sm md:text-base break-inside-avoid">
                              {paragraph.split('\n').map((li, lIdx) => (
                                <li key={lIdx}>{li.replace('*', '').trim()}</li>
                              ))}
                            </ul>
                          );
                        }

                        // First letter drop cap magic on index 0
                        if (index === 0) {
                          const firstLetter = paragraph.charAt(0);
                          const remainingText = paragraph.slice(1);
                          return (
                            <p key={index} className="mb-4">
                              <span className="text-5xl font-display font-medium float-left leading-[0.8] mr-2.5 mt-1.5 text-primary border border-primary/20 bg-primary/5 rounded p-1">
                                {firstLetter}
                              </span>
                              {remainingText}
                            </p>
                          );
                        }

                        return (
                          <React.Fragment key={index}>
                            <p className="mb-4">{paragraph}</p>
                            {index === 2 && selectedArticle.secondImage && (
                              <div className="my-4 w-full h-48 rounded-xl overflow-hidden relative border border-slate-200 bg-white shadow-xs">
                                <img 
                                  src={selectedArticle.secondImage} 
                                  alt="Second illustration" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop";
                                  }}
                                />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Signature at bottom */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t border-slate-950/5 text-xs font-mono text-slate-500 gap-4">
                  <div>Publié par l'admin de Kharandi — Conakry, République de Guinée</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Partager :</span>
                    <button 
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-all"
                      onClick={() => {
                        const shareUrl = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedArticle.title + ' - ' + shareUrl)}`, '_blank');
                      }}
                    >
                      WhatsApp
                    </button>
                    <button 
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-all"
                      onClick={() => {
                        const shareUrl = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                      }}
                    >
                      Facebook
                    </button>
                    <button 
                      className="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-all"
                      onClick={() => {
                        const shareUrl = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(selectedArticle.title)}`, '_blank');
                      }}
                    >
                      X (Twitter)
                    </button>
                    <button 
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-all"
                      onClick={() => {
                        const shareUrl = `${window.location.origin}${window.location.pathname}?article=${selectedArticle.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        import('sonner').then(m => m.toast.success("Lien copié dans le presse-papier !"));
                      }}
                    >
                      Copier le lien
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom bar */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 text-center shrink-0">
                <button 
                  onClick={closeArticle}
                  className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Fermer la Gazette
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
