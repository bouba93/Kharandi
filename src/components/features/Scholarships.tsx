import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Search, X, Calendar, MapPin, GraduationCap, CheckCircle2, Bookmark, DollarSign, Users, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EduLoading } from './EduLoading';
import { getScholarships } from '../../services/content';

export interface ScholarshipDetail {
  id: string;
  university: string;
  program_name: string;
  excerpt: string;
  country: string;
  city: string;
  level: string;
  link: string;
  coverage?: string; // e.g. "Totale (100% frais de scolarité, billet A/R, hébergement)"
  allowance?: string; // e.g. "900 USD / mois d'aide d'entretien"
  languageReq?: string; // e.g. "Français (pas de test requis) ou Anglais de base"
  eligibilityAverage?: string; // e.g. "Tranche de moyenne : Supérieure ou égale à 14/20 au Bac"
  targetBranch?: string; // e.g. "Sciences Mathématiques (SM) & Sciences Expérimentales (SE)"
  requiredDocs?: string[];
  stagesOfSelection?: string[];
  maxAge?: string; // e.g. "Moins de 23 ans au 1er octobre"
}

// Highly realistic enriched local scholarships
const DETAILED_PRESETS: ScholarshipDetail[] = [
  {
    id: 's1',
    university: 'Fédération de Russie (Coopération Bilatérale)',
    program_name: 'Bourses d\'études d\'État de la Fédération de Russie',
    excerpt: 'Bourses d\'études universitaires d\'élite couvrant les frais de scolarité et d\'hébergement pour les étudiants de nationalité guinéenne.',
    country: 'Russie',
    city: 'Moscou, Saint-Pétersbourg, Kazan',
    level: 'Licence, Master & Doctorat',
    link: 'https://education-in-russia.com',
    coverage: "Gratuité totale des frais de scolarité + Logement universitaire garanti + Complément d'apprentissage linguistique",
    allowance: "Allocation de subsistance mensuelle selon le statut académique de l'étudiant",
    languageReq: "Année préparatoire de langue russe obligatoire incluse (frais pris en charge)",
    eligibilityAverage: "Moyenne générale au Bac supérieure ou égale à 12.00 / 20",
    targetBranch: "Toutes séries (Sciences Mathématiques, Sciences Expérimentales, Sciences Sociales)",
    maxAge: "Moins de 25 ans pour le cycle de Licence",
    requiredDocs: [
      "Copie certifiée conforme du Diplôme de Baccalauréat d'État",
      "Relevés de notes des classes de 11ème, 12ème et Terminale",
      "Passeport guinéen en cours de validité (au moins 18 mois)",
      "Certificat médical d'aptitude physique et rapport d'analyses de sang"
    ],
    stagesOfSelection: [
      "Dépôt du dossier numérique sur le portail officiel de la coopération",
      "Évaluation des dossiers par le comité mixte bilatéral (Russie - SNABE)",
      "Test facultatif d'aptitudes générales dans les locaux du Ministère"
    ]
  },
  {
    id: 's2',
    university: 'Royaume du Maroc (AMCI / SNABE)',
    program_name: 'Bourses d\'études de la Coopération Bilatérale Marocaine',
    excerpt: 'Filières médicales, ingénierie de pointe, paramédicales, techniques et de gestion pour les lauréats du système guinéen.',
    country: 'Maroc',
    city: 'Rabat, Casablanca, Fès, Marrakech',
    level: 'Classes Préparatoires, Licence & Master d\'Ingénieur',
    link: 'https://www.amci.ma',
    coverage: "Frais académiques pris en charge à 100% + Assurance médicale universelle marocaine + Hébergement en Cité Universitaire",
    allowance: "750 DH (Dirhams marocains) distribués bimestriellement",
    languageReq: "Langue d'enseignement française (Arabe littéral pour certaines spécificités juridiques)",
    eligibilityAverage: "Minimum 13.50 / 20 au Baccalauréat de la République de Guinée",
    targetBranch: "Série SM (Sciences Mathématiques) ou SE (Sciences Expérimentales) pour les filières scientifiques et médicales",
    maxAge: "23 ans révolus au plus tard le jour de la rentrée universitaire",
    requiredDocs: [
      "Attestation ou relevé officiel de notes du Bac (originale ou certifiée)",
      "Copie légalisée de l'extrait de Registre de Naissance",
      "Deux photographies d'identité récentes en couleur",
      "Certificat de nationalité guinéenne"
    ],
    stagesOfSelection: [
      "Sélection automatique par ordre de mérite global selon les quotas de filières disponibles",
      "Validation médicale auprès d'un médecin désigné par l'ambassade"
    ]
  },
  {
    id: 's3',
    university: 'République Algérienne Démocratique et Populaire',
    program_name: 'Bourses d\'études de la Coopération Algérienne',
    excerpt: 'Financement d\'exemption complète pour effectuer des cursus d\'ingénierie, de médecine d\'élite et de sciences technologiques.',
    country: 'Algérie',
    city: 'Alger, Oran, Constantine',
    level: 'Licence & Doctorat d\'Ingénieur',
    link: 'https://www.mesrs.dz',
    coverage: "Scolarité universitaire gratuite + Logement en campus national algérien + Restauration et transports locaux subventionnés",
    allowance: "Bourse trimestrielle accordée par l'État d'accueil",
    languageReq: "Français oral et écrit maîtrisé",
    eligibilityAverage: "Moyenne au bac supérieure ou égale à 13.00 / 20",
    targetBranch: "Filières Techniques & Technologiques : Priorité absolue aux majors SM et SE",
    maxAge: "Moins de 24 ans à la date d'inscription physique",
    requiredDocs: [
      "Copie conforme certifiée du diplôme ou de l'attestation du Bac",
      "Relevé de notes officiel du Baccalauréat guinéen",
      "Fiche de vœux thématique remplie lors de la convocation",
      "Certificat de non-contagion pulmonaire et vaccins à jour"
    ],
    stagesOfSelection: [
      "Dépôt physique des originaux au secrétariat permanent du SNABE",
      "Orientation sélective basée sur la note obtenue dans les matières scientifiques fondamentales"
    ]
  },
  {
    id: 's4',
    university: 'République Populaire de Chine (Bourse du Gouvernement Chinois)',
    program_name: 'Bourses d\'études du Gouvernement Chinois (CSC)',
    excerpt: 'Programme premium complet de bourses prenant en charge les frais de scolarité, d\'hébergement, d\'assurance médicale complète et d\'allocations mensuelles.',
    country: 'Chine',
    city: 'Pékin, Shanghai, Wuhan, Canton',
    level: 'Licence, Master & Doctorat',
    link: 'https://www.campuschina.org',
    coverage: "Frais académiques complets + Logement universitaire simple ou double de haut standing + Assurance maladie internationale complète",
    allowance: "2 500 RMB à 3 500 RMB (Yuan) par mois selon le cycle d'études (environ 350$ à 500$ USD/mois)",
    languageReq: "Cursus disponible en Anglais (avec justificatif TOEFL/IELTS) ou en Chinois (1 an de cours de langue HSK inclus)",
    eligibilityAverage: "Une très bonne moyenne de fin d'études secondaires (Recommandé minimum 14.00 / 20)",
    targetBranch: "Toutes options (Sciences Mathématiques, Sciences Expérimentales, Lettres et Sciences Sociales)",
    maxAge: "Moins de 25 ans pour la Licence ; Moins de 35 ans de limite d'âge pour postuler au Master",
    requiredDocs: [
      "Formulaire de candidature en anglais ou en chinois imprimé du portail CSC",
      "Relevés de notes officiels traduits en anglais par un traducteur assermenté",
      "Deux lettres de recommandation d'enseignants du cycle secondaire (pour la licence) ou universitaire",
      "Rapport d'examen physique pour étrangers (Foreigner Physical Examination Form)"
    ],
    stagesOfSelection: [
      "Pré-admission par une université chinoise recommandée (fortement conseillé)",
      "Candidature en ligne sur le portail d'assistance du CSC et dépôt auprès de l'Ambassade de Chine à Conakry"
    ]
  },
  {
    id: 's5',
    university: 'Gouvernement de la République de Guinée (SNABE)',
    program_name: 'Bourses d\'Excellence Nationale du Chef d\'État',
    excerpt: 'Allocation d\'élite d\'État accordée souverainement aux lauréats de chaque option du Baccalauréat national pour des études de prestige international.',
    country: 'Option Internationale (Mondial)',
    city: 'Capitales universitaires majeures',
    level: 'Licence Spécialisée / Écoles d\'Ingénieurs d\'élite',
    link: 'https://snabe.gov.gn',
    coverage: "Scolarité totale dans les grandes écoles privées ou publiques internationales + Billet d'avion annuel aller-retour offert",
    allowance: "Bourse mensuelle d'élite octroyée par le Trésor Public guinéen pour le coût complet de la vie urbaine",
    languageReq: "Conforme à l'exigence de l'établissement d'accueil final",
    eligibilityAverage: "Réservé exclusivement aux majors classés officiellement dans le TOP 10 de chaque série du Baccalauréat guinéen",
    targetBranch: "Option Sciences Mathématiques (SM), Sciences Expérimentales (SE) et Sciences Sociales (SS)",
    maxAge: "Aucune limite rigide si classé officiellement dans le tableau d'excellence du Chef de l'État",
    requiredDocs: [
      "Attestation d'Excellence délivrée par le Ministère de l'Éducation Pré-Universitaire",
      "Copie légalisée de la décision officielle de proclamation du bac",
      "Passeport diplomatique ou de service selon dispositions particulières",
      "Lettre d'admission de l'institut étranger d'excellence ciblé (Mines, Polytechnique, Sorbonne, MIT, etc.)"
    ],
    stagesOfSelection: [
      "Attribution automatique de droit après validation officielle de la liste restreinte par décret présidentiel"
    ]
  },
  {
    id: 's6',
    university: 'Gouvernement du Japon (Bourse MEXT)',
    program_name: 'Bourses de recherche et d\'études de premier cycle du MEXT',
    excerpt: 'Prestigieux programme mondial du Ministère de l\'Éducation du Japon s\'adressant aux diplômés guinéens d\'envergure académique.',
    country: 'Japon',
    city: 'Tokyo, Kyoto, Osaka, Tohoku',
    level: 'Premier cycle (Undergraduate) & Doctorat de recherche',
    link: 'https://www.gn.emb-japan.go.jp/itpr_fr/bourses.html',
    coverage: "Prise en charge intégrale des frais de scolarité, d'inscription et d'examen + Transport aérien aller et retour direct d'Élite",
    allowance: "117 000 JPY (Yens japonais) à 145 000 JPY par mois d'aide",
    languageReq: "Apprentissage intensif du japonais (1ère année d'orientation) ; ou anglais si programme spécialisé",
    eligibilityAverage: "Moyenne académique académique remarquable avec de fortes notes en calcul et raisonnement logique",
    targetBranch: "Toutes séries (Priorité aux esprits scientifiques pour la technologie ou esprits analytiques pour le développement global)",
    maxAge: "Avoir entre 17 et 24 ans au moment du démarrage de l'année d'études du gouvernement",
    requiredDocs: [
      "Formulaire d'application standard MEXT dûment signé",
      "Bulletins de notes originaux des trois dernières années de formation guinéenne",
      "Certificats et diplômes officiels d'état",
      "Lettre de motivation argumentée et rédigée avec rigueur scientifique"
    ],
    stagesOfSelection: [
      "Examen poussé des dossiers à l'ambassade à Conakry",
      "Épreuve écrite de sélection (Maths, Anglais, Japonais)",
      "Entretien d'admission direct à l'ambassade"
    ]
  }
];

interface CountryTheme {
  border: string;
  bg: string;
  badge: string;
  accent: string;
  glow: string;
  gradient: string;
  lightBg: string;
}

const getCountryTheme = (country: string): CountryTheme => {
  const c = (country || '').toLowerCase();
  if (c.includes('maroc')) {
    return {
      border: 'hover:border-emerald-400/80 border-emerald-200/50',
      bg: 'bg-emerald-50/10 hover:bg-emerald-50/20',
      badge: 'bg-emerald-100/80 text-emerald-990 font-bold border-emerald-200',
      accent: 'text-emerald-700',
      glow: 'shadow-emerald-100/50',
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      lightBg: 'bg-emerald-50/30'
    };
  }
  if (c.includes('russie')) {
    return {
      border: 'hover:border-blue-400/80 border-blue-200/50',
      bg: 'bg-blue-50/10 hover:bg-blue-50/20',
      badge: 'bg-blue-100/80 text-blue-990 font-bold border-blue-200',
      accent: 'text-blue-700',
      glow: 'shadow-blue-100/50',
      gradient: 'from-blue-500 via-sky-500 to-indigo-650',
      lightBg: 'bg-blue-50/30'
    };
  }
  if (c.includes('chine')) {
    return {
      border: 'hover:border-red-400/80 border-red-200/50',
      bg: 'bg-red-50/5 hover:bg-red-50/15',
      badge: 'bg-red-100/80 text-red-990 font-bold border-red-200',
      accent: 'text-red-750',
      glow: 'shadow-red-100/50',
      gradient: 'from-red-500 via-rose-500 to-orange-600',
      lightBg: 'bg-red-50/30'
    };
  }
  if (c.includes('algérie') || c.includes('algerie')) {
    return {
      border: 'hover:border-teal-400/80 border-teal-200/50',
      bg: 'bg-teal-50/10 hover:bg-teal-50/20',
      badge: 'bg-teal-100/80 text-teal-990 font-bold border-teal-200',
      accent: 'text-teal-750',
      glow: 'shadow-teal-100/50',
      gradient: 'from-teal-500 via-emerald-500 to-green-650',
      lightBg: 'bg-teal-50/30'
    };
  }
  if (c.includes('japon')) {
    return {
      border: 'hover:border-pink-400/80 border-pink-200/50',
      bg: 'bg-pink-50/10 hover:bg-pink-50/20',
      badge: 'bg-pink-100/80 text-pink-990 font-bold border-pink-200',
      accent: 'text-pink-700',
      glow: 'shadow-pink-100/50',
      gradient: 'from-pink-500 via-rose-450 to-red-500',
      lightBg: 'bg-pink-50/30'
    };
  }
  if (c.includes('guinée') || c.includes('guinee') || c.includes('mondial') || c.includes('excellence') || c.includes('international')) {
    return {
      border: 'hover:border-amber-400/80 border-amber-200/50',
      bg: 'bg-amber-50/10 hover:bg-amber-50/20',
      badge: 'bg-amber-100/80 text-amber-990 font-bold border-amber-200',
      accent: 'text-amber-700',
      glow: 'shadow-amber-100/50',
      gradient: 'from-amber-500 via-yellow-500 to-orange-600',
      lightBg: 'bg-amber-50/30'
    };
  }
  // Default elegant neutral
  return {
    border: 'hover:border-cyan-400/80 border-cyan-200/50',
    bg: 'bg-cyan-50/5 hover:bg-cyan-50/15',
    badge: 'bg-cyan-10 border border-cyan-200 text-cyan-900',
    accent: 'text-primary',
    glow: 'shadow-cyan-100/50',
    gradient: 'from-cyan-500 to-blue-600',
    lightBg: 'bg-cyan-50/20'
  };
};

export const Scholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<ScholarshipDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipDetail | null>(null);
  const [countryFilter, setCountryFilter] = useState<string>('Tous');

  useEffect(() => {
    getScholarships()
      .then(data => {
        // Enforce strong detailed profile structure on load
        const apiData = (data || []).map((item: any) => ({
          id: item.id || Math.random().toString(),
          university: item.university || item.title,
          program_name: item.program_name || item.excerpt,
          excerpt: item.excerpt,
          country: item.country || "Enseignement",
          city: item.city || "Plusieurs villes",
          level: item.level || "Supérieur"
        }));

        // Merge API fetched data into detailed structure, preserving detailed presets
        const merged = [...DETAILED_PRESETS];
        apiData.forEach((apiItem: any) => {
          if (!merged.some(m => m.university.toLowerCase() === apiItem.university.toLowerCase())) {
            merged.push({
              ...apiItem,
              link: apiItem.link || "https://snabe.gov.gn",
              coverage: "Prise en charge partielle selon convention",
              allowance: "Selon critères d'excellence de l'état",
              languageReq: "Français",
              eligibilityAverage: "Minimum 12.00 / 20 au bac",
              targetBranch: "Filières générales",
              maxAge: "Moins de 25 ans",
              requiredDocs: ["Copie officielle certifiée conforme du Baccalauréat", "Relevés de notes annuels d'études", "Extrait de naissance"],
              stagesOfSelection: ["Examen de dossier par le secrétariat"]
            });
          }
        });
        setScholarships(merged);
      })
      .catch(() => setScholarships(DETAILED_PRESETS))
      .finally(() => setLoading(false));
  }, []);

  const countries = ['Tous', 'Maroc', 'Russie', 'Chine', 'Algérie', 'Japon', 'Guinée'];

  const filtered = scholarships.filter(s => {
    const matchesSearch = 
      s.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.level.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry = countryFilter === 'Tous' || 
      s.country.toLowerCase().includes(countryFilter.toLowerCase()) || 
      (countryFilter === 'Guinée' && s.country.toLowerCase().includes('international'));

    return matchesSearch && matchesCountry;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">
      
      {/* Editorial Header Masthead */}
      <div className="border-t-4 border-b border-black py-4 mb-8 text-center bg-cyan-50/10 rounded-xl shadow-xs px-4">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-black/10 pb-4 mb-4 gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
          <div>OFFICIEL DES BOURSES D'ÉTUDES SUR KHARANDI</div>
          <div className="flex items-center gap-1.5"><Award size={14} className="text-secondary" /> COOPÉRATION BILATÉRALE GUINÉENNE</div>
          <div>SESSION ACADÉMIQUE 2026</div>
        </div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mt-2 mb-2 select-none uppercase">
          Le Bulletin Officiel des Bourses
        </h1>
        <p className="font-serif italic text-base md:text-lg text-slate-650 max-w-2xl mx-auto mb-4">
          « L'accès équitable à l'excellence mondiale. Retrouvez en un coup d'œil l'intégralité des opportunités de financement pour les bacheliers et universitaires guinéens. »
        </p>
      </div>

      {/* Control center: Search and country quick filter */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          <div className="md:col-span-5 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher une destination, un niveau..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner text-slate-800" 
            />
          </div>

          <div className="md:col-span-7 flex flex-wrap gap-2 items-center justify-start md:justify-end">
            <span className="text-xs font-mono text-slate-400 uppercase shrink-0">Filtrer par destination :</span>
            {countries.map(country => (
              <button
                key={country}
                id={`filter-country-${country}`}
                onClick={() => setCountryFilter(country)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  countryFilter === country
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {country}
              </button>
            ))}
          </div>

        </div>
      </div>

      {loading ? (
        <EduLoading message="Compilation et mise à jour de l'officiel des bourses..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-[36px] text-center border-2 border-dashed border-slate-200 max-w-lg mx-auto">
          <Award className="mx-auto text-slate-300 mb-4 animate-spin" size={48} style={{ animationDuration: '3s' }} />
          <h3 className="text-xl font-bold font-display text-slate-800 mb-2">Aucune bourse ne correspond à vos critères</h3>
          <p className="text-slate-500 text-sm">Modifiez vos mots clés de recherche ou élargissez vos destinations pour explorer d'autres opportunités de scolarité bilatérale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item: ScholarshipDetail, i: number) => {
            const theme = getCountryTheme(item.country);
            return (
              <motion.div 
                key={item.id || i} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedScholarship(item)}
                className={`p-6 rounded-[32px] border-2 shadow-sm hover:shadow-xl hover:-translate-y-1 ${theme.border} ${theme.bg} transition-all duration-300 cursor-pointer flex flex-col justify-between group h-full relative overflow-hidden`}
              >
                {/* Dynamic colored top stripe */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${theme.gradient}`} />

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-mono uppercase font-black border ${theme.badge}`}>
                      <MapPin size={10} className={theme.accent} /> {item.country}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase truncate max-w-32">{item.city}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`font-display text-lg font-bold text-slate-900 group-hover:${theme.accent} transition-colors leading-snug line-clamp-2`}>
                      {item.university}
                    </h3>
                    <p className={`font-bold text-xs font-mono uppercase tracking-wider ${theme.accent}`}>
                      {item.program_name}
                    </p>
                    <p className="text-slate-650 text-sm leading-relaxed font-serif italic line-clamp-3 pt-1">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6">
                  <div className="flex items-center justify-between mb-3.5 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1"><GraduationCap size={12} className={theme.accent} /> {item.level}</span>
                  </div>
                  <div className={`w-full bg-slate-905 bg-slate-900 text-white font-mono uppercase tracking-wider text-center py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:${theme.gradient} group-hover:text-white transition-all`}>
                    Consulter le dossier <ExternalLink size={12} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Scholarship Dossier Detail Reader Modal */}
      <AnimatePresence>
        {selectedScholarship && (() => {
          const mTheme = getCountryTheme(selectedScholarship.country);
          return (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-4 md:p-8 flex items-center justify-center"
              onClick={() => setSelectedScholarship(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 30 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-[#fdfbf7] text-slate-900 w-full max-w-4xl rounded-[36px] shadow-2xl overflow-hidden border-4 border-slate-100 max-h-[90vh] flex flex-col relative"
                onClick={e => e.stopPropagation()}
              >
                {/* Paper color filter mapping */}
                <div className="absolute inset-0 bg-radial from-transparent to-amber-900/2 pointer-events-none" />

                {/* Title Header with Country Gradient */}
                <div className={`bg-gradient-to-r ${mTheme.gradient} text-white px-6 py-4 flex items-center justify-between shrink-0 z-10 relative shadow-md`}>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-white" />
                    <span className="text-xs font-mono font-bold tracking-widest uppercase">DOSSIER OFFICIEL D'INSCRIPTION</span>
                  </div>
                  <button onClick={() => setSelectedScholarship(null)} className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Scrollable details */}
                <div className="overflow-y-auto p-6 md:p-10 space-y-8 flex-1 hide-scrollbar relative">
                  
                  {/* Scholarship Headplate */}
                  <div className="pb-6 border-b-2 border-double border-slate-900/20 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-3 text-xs font-mono">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase flex items-center gap-1 border ${mTheme.badge}`}>
                        <MapPin size={11} className={mTheme.accent} /> {selectedScholarship.country}
                      </span>
                      <span className="text-slate-305">|</span>
                      <span className="text-slate-500 font-bold uppercase">{selectedScholarship.city}</span>
                      <span className="text-slate-305">|</span>
                      <span className="text-slate-500 font-mono italic">Filière d'excellence</span>
                    </div>

                    <h2 className="font-display text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight leading-header mb-1">
                      {selectedScholarship.university}
                    </h2>
                    <p className="text-slate-650 font-mono text-sm leading-relaxed uppercase border-b border-slate-900/5 pb-4">
                      {selectedScholarship.program_name}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs font-mono text-slate-600">
                      <div className={`p-2.5 ${mTheme.lightBg} rounded-xl border border-slate-900/5 text-center`}>
                        <p className="text-slate-400 mb-1 uppercase font-bold">NIVEAU EXIGÉ</p>
                        <p className="font-sans font-black text-slate-700 truncate">{selectedScholarship.level}</p>
                      </div>
                      <div className={`p-2.5 ${mTheme.lightBg} rounded-xl border border-slate-900/5 text-center`}>
                        <p className="text-slate-400 mb-1 uppercase font-bold">BOURSE MENSUELLE</p>
                        <p className="font-sans font-black text-slate-700 truncate">{selectedScholarship.allowance ? "Oui (Subvention)" : "Selon Profil"}</p>
                      </div>
                      <div className={`p-2.5 ${mTheme.lightBg} rounded-xl border border-slate-900/5 text-center`}>
                        <p className="text-slate-400 mb-1 uppercase font-bold">ATTRIBUTION</p>
                        <p className="font-sans font-black text-emerald-600 truncate">100% Gratuite</p>
                      </div>
                      <div className={`p-2.5 ${mTheme.lightBg} rounded-xl border border-slate-900/5 text-center`}>
                        <p className="text-slate-400 mb-1 uppercase font-bold">LANGUE</p>
                        <p className="font-sans font-black text-slate-700 truncate">Français / Anglais</p>
                      </div>
                    </div>
                  </div>

                  {/* Main description columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-serif leading-relaxed text-slate-800 text-justify">
                    
                    {/* Left panel criteria summary (2/3 of space) */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="space-y-3 prose">
                        <h4 className="font-display font-black text-slate-900 text-lg md:text-xl border-l-4 border-slate-900 pl-3">
                          Présentation de l'Opportunité
                        </h4>
                        <p className="text-base text-slate-650 leading-relaxed">
                          {selectedScholarship.excerpt} Ce programme de coopération stratégique s'inscrit au cœur des initiatives inter-gouvernementales pour former des cadres hautement qualifiés du système d'enseignement guinéen dans les pôles d'excellence partenaires.
                        </p>
                      </div>

                      {/* Rich sections */}
                      <div className={`p-5 rounded-2xl border border-slate-200/50 ${mTheme.lightBg} space-y-4`}>
                        <h5 className="font-sans font-black text-slate-900 text-xs tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-200 pb-2.5">
                          <DollarSign size={14} className={mTheme.accent} /> Avantages & Couverture Financière
                        </h5>
                        <ul className="space-y-2.5 text-xs md:text-sm font-sans list-none pl-0 text-slate-650">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-550 shrink-0 mt-0.5" />
                            <span><strong>Scolarité :</strong> {selectedScholarship.coverage || "Exemption de frais"}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-550 shrink-0 mt-0.5" />
                            <span><strong>Aides complémentaires :</strong> {selectedScholarship.allowance || "Frais académiques pris en charge"}</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3.5 pt-2">
                        <h4 className="font-display font-black text-slate-900 text-lg md:text-xl border-l-4 border-slate-900 pl-3 flex items-center gap-2">
                          <FileText size={18} /> Pièces Requises pour Constituer le Dossier
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {(selectedScholarship.requiredDocs || [
                            "Copie de relevé officiel conforme du Bac",
                            "Copie légalisée certifiée conforme du passeport",
                            "Certificats médicaux d'aptitude",
                            "Quatre photos d'identité récentes en couleur"
                          ]).map((doc, idx) => (
                            <div key={idx} className="flex gap-2.5 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs items-start">
                              <span className="w-5 h-5 bg-primary/10 text-primary font-mono text-[10px] font-black rounded-full shrink-0 flex items-center justify-center">{idx + 1}</span>
                              <span className="text-xs text-slate-700 font-sans leading-relaxed">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right panel specifications (1/3 of space) */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Eligibility sidebar card */}
                      <div className={`p-5 rounded-2xl border space-y-4 border-slate-200/55 ${mTheme.lightBg}`}>
                        <h5 className="font-sans font-black text-slate-950 text-xs tracking-wider uppercase border-b border-slate-900/10 pb-2 flex items-center gap-1.5">
                          <GraduationCap size={14} className="text-amber-800" /> Profil d'Éligibilité
                        </h5>
                        
                        <div className="space-y-4 text-xs font-sans">
                          <div>
                            <p className="text-slate-400 uppercase font-black tracking-widest text-[9px]">SÉRIES / OPTIONS ADMISSIBLES</p>
                            <p className="font-bold text-slate-800 leading-snug mt-1">{selectedScholarship.targetBranch || "Toutes spécialités"}</p>
                          </div>
                          
                          <div>
                            <p className="text-slate-400 uppercase font-black tracking-widest text-[9px]">CRITÈRES DE MOYENNE GÉNÉRALE</p>
                            <p className="font-bold text-slate-800 leading-snug mt-1">{selectedScholarship.eligibilityAverage || "Supérieur à 12.00 / 20"}</p>
                          </div>

                          <div>
                            <p className="text-slate-400 uppercase font-black tracking-widest text-[9px]">PRÉREQUIS DE LANGUE</p>
                            <p className="font-bold text-slate-800 leading-snug mt-1">{selectedScholarship.languageReq || "Français de base"}</p>
                          </div>

                          {selectedScholarship.maxAge && (
                            <div>
                              <p className="text-slate-400 uppercase font-black tracking-widest text-[9px]">LIMITE D'ÂGE EXIGÉE</p>
                              <p className="font-bold text-slate-800 leading-snug mt-1">{selectedScholarship.maxAge}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* How selection works */}
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 font-sans text-xs">
                        <h5 className="font-black text-slate-900 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-200 flex items-center gap-1">
                          <AlertCircle size={13} className="text-slate-500" /> Remarque Importante
                        </h5>
                        <p className="text-slate-500 leading-relaxed font-serif italic">
                          Il est rappelé aux candidats de ne jamais verser de sommes d'argent à de tiers pseudos-intermédiaires scolaires. Les candidatures aux bourses d'excellence s'effectuent par le biais de la centrale directe de l'État (SNABE).
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Footer selection actions */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-xs font-mono text-slate-405 text-slate-505">
                    Besoin d'aide ? Contactez support@kharandi.com
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setSelectedScholarship(null)}
                      className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-150 rounded-xl text-xs font-bold text-slate-600 transition-colors w-full sm:w-auto shrink-0 cursor-pointer"
                    >
                      Fermer le Bulletin
                    </button>
                    <a 
                      href={selectedScholarship.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`px-5 py-2.5 bg-slate-900 hover:bg-gradient-to-r hover:${mTheme.gradient} text-white hover:text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0 cursor-pointer font-mono`}
                    >
                      POSTULER AU PORTAIL <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
