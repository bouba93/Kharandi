import { EXAM224_SUBJECTS } from "./exam224Subjects";

export interface FallbackSubject {
  id: string;
  title: string;
  description: string;
  doc_type: string;
  category: 'REAL' | 'BLANC' | 'ETRANGER';
  subject: { id: number; name: string; icon: string };
  level: string;
  is_free: boolean;
  year: string;
  country?: string;
  institution?: string;
  content: string;
}

const BASE_FALLBACK_SUBJECTS: FallbackSubject[] = [
  // ─── 1. EXAMENS RÉELS OFFICIELS (GUINÉE) ──────────────────────────────────
  {
    id: "bac-math-sm-2021",
    title: "Sujet Officiel BAC SM 2021 - Mathématiques",
    description: "Épreuve officielle de Mathématiques - Option Sciences Mathématiques. Analyse complète des suites numériques, nombres complexes et géométrie.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BAC SM",
    is_free: true,
    year: "2021",
    country: "Guinée",
    institution: "MEPUA - Ministère de l'Éducation Nationale",
    content: `# ÉPREUVE OFFICIELLE DE MATHÉMATIQUES — BAC SM (Sciences Mathématiques)
**Session Officielle : 2021 | Ministère de l'Éducation Nationale (Guinée)**
**Durée : 4 heures | Coefficient : 5**

---

### 🎙️ CONSEIL STRATÉGIQUE DU PROFESSEUR KARAMÖ
*« Chers candidats au BAC, la clé sur cette épreuve officielle est d'articuler la récurrence sans faille à l'exercice 1, d'identifier le discriminant complexe à l'exercice 2 et de ne pas négliger la dérivée logarithmique sur le problème. Lisez attentivement les 4 étapes ci-dessous. »*

---

### EXERCICE 1 : Suites Numériques & Convergence (5 points)

Soit la suite numérique $(u_n)_{n \in \mathbb{N}}$ définie par :
$$u_0 = 1 \quad \text{et} \quad u_{n+1} = \sqrt{2 + u_n} \quad \text{pour tout } n \in \mathbb{N}$$

1. **Démonstration par récurrence :** Montrer que pour tout entier naturel $n$, on a $0 \leq u_n \leq 2$.
2. **Sens de variation :** Montrer que la suite $(u_n)$ est strictement croissante. En déduire qu'elle est convergente.
3. **Calcul de la limite :** Déterminer la limite $\ell$ de la suite $(u_n)$.

#### ✦ CORRIGÉ DÉTAILLÉ & RAPPELS DE COURS
* **Rappel Théorique :** Une suite majorée et croissante est toujours convergente vers un réel $\ell$.
* **Étape 1 (Initialisation) :** Pour $n=0$, $u_0 = 1 \in [0; 2]$. Vrai.
* **Étape 2 (Hérédité) :** Supposons $0 \leq u_n \leq 2$. Alors $2 \leq 2 + u_n \leq 4 \implies \sqrt{2} \leq \sqrt{2+u_n} \leq 2$. Comme $\sqrt{2} \geq 0$, on a $0 \leq u_{n+1} \leq 2$.
* **Étape 3 (Limite) :** Par continuité de $f(x) = \sqrt{2+x}$, $\ell = \sqrt{2+\ell} \implies \ell^2 - \ell - 2 = 0 \implies \ell = 2$ (car $\ell \geq 0$). La limite cherchée est **$\ell = 2$**.

---

### EXERCICE 2 : Nombres Complexes (5 points)

On considère dans l'ensemble $\mathbb{C}$ l'équation :
$$(E) : z^2 - (2 + 2i)z + 3 - 2i = 0$$

1. Résoudre l'équation $(E)$ dans $\mathbb{C}$. Exprimez les solutions sous forme algébrique.
2. Établir la forme trigonométrique de chaque racine.

#### ✦ CORRIGÉ PAS À PAS
* Discriminant $\Delta = (2+2i)^2 - 4(3-2i) = 8i - 12 + 8i = -12 + 16i$.
* Posons $\delta = x + iy$. On obtient le système classique : $x^2 - y^2 = -12$, $x^2 + y^2 = 20$, $2xy = 16$.
* On en déduit $x = \pm 2$ et $y = \pm 4$. Puisque $xy > 0$, $\delta = 2 + 4i$.
* Solutions algébriques : $z_1 = -i$ et $z_2 = 2 + 3i$.`
  },
  {
    id: "bac-phys-sm-2021",
    title: "Sujet Officiel BAC SM 2021 - Physique",
    description: "Épreuve théorique officielle de Physique pour les Sciences Mathématiques. Mouvement de projectiles, lois de Newton et satellites.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 2, name: "Physique", icon: "Atom" },
    level: "BAC SM",
    is_free: true,
    year: "2021",
    country: "Guinée",
    institution: "MEPUA",
    content: `# ÉPREUVE OFFICIELLE DE PHYSIQUE — BAC SM
**Session : 2021 | Ministère de l'Éducation Nationale (Guinée)**

---

### EXERCICE 1 : Mouvement d'un Projectile (6 points)

Un projectile de masse $m = 100\text{ g}$ est lancé depuis l'origine $O$ à $t=0$ avec $v_0 = 15\text{ m/s}$ sous un angle $\alpha = 45^\circ$. $g = 9,8\text{ m/s}^2$.

1. Établir les équations horaires cartésiennes du mouvement.
2. En déduire l'équation de la trajectoire.
3. Déterminer la portée maximale.

#### ✦ CORRIGÉ PAS À PAS DE KARAMÖ
* **1. Équations horaires :**
  $x(t) = (v_0 \cos \alpha)t$
  $y(t) = -\frac{1}{2}gt^2 + (v_0 \sin \alpha)t$
* **2. Équation de la trajectoire :**
  $y(x) = -\frac{g}{2v_0^2 \cos^2\alpha} x^2 + (\tan \alpha)x$
* **3. Portée maximale :**
  $x_{\text{max}} = \frac{v_0^2 \sin(2\alpha)}{g} = \frac{15^2 \times 1}{9,8} \approx 22,95\text{ mètres}$.`
  },
  {
    id: "bepc-maths-2023",
    title: "Sujet Officiel BEPC 2023 - Mathématiques",
    description: "Épreuve officielle du BEPC République de Guinée. Développement, factorisation, fractions rationnelles et géométrie analytique.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BEPC",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA - Direction Nationale des Examens",
    content: `# ÉPREUVE OFFICIELLE DE MATHÉMATIQUES — BEPC GUINÉE
**Session : 2023 | MEPUA**

---

### PARTIE ALGÉBRIQUE (10 points)

On donne $A(x) = (2x - 3)^2 - (x+1)^2$ et $B(x) = (x-4)(3x-2) + (x-4)(x+5)$.

1. Développer, réduire et ordonner $A(x)$.
2. Factoriser $A(x)$ et $B(x)$.
3. Résoudre $A(x) = 0$.

#### ✦ CORRIGÉ DÉTAILLÉ DE KARAMÖ
* **Développement :** $A(x) = 4x^2 - 12x + 9 - (x^2 + 2x + 1) = 3x^2 - 14x + 8$.
* **Factorisation :** $A(x) = [(2x-3)-(x+1)][(2x-3)+(x+1)] = (x-4)(3x-2)$.
* **Résolution :** $A(x)=0 \iff x = 4 \quad \text{ou} \quad x = 2/3$.`
  },
  {
    id: "cee-cee7-calcul-2023",
    title: "Sujet Officiel CEE 7ème 2023 - Calcul Écrit",
    description: "Épreuve officielle du Certificat d'Études Élémentaires (CEE). Opérations sur nombres décimaux, conversion d'unités et problème de géométrie.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA",
    content: `# ÉPREUVE OFFICIELLE DE CALCUL ÉCRIT — EXAMEN ENTRÉE EN 7ème
**Session Officielle 2023 | CEE Guinée**

---

### I. OPÉRATIONS (6 points)
1. $4\ 587,25 + 965,80 = 5\ 553,05$
2. $1\ 258,4 \times 3,5 = 4\ 404,40$
3. $7\ 845 \div 12 = 653,75$

### II. PROBLÈME PRATIQUE (14 points)
Un champ rectangulaire mesure $120\text{ m}$ sur $80\text{ m}$.
* Surface = $120 \times 80 = 9\ 600\text{ m}^2 = 96\text{ ares}$.
* Récolte = $9\ 600 \times 15\text{ kg} = 144\ 000\text{ kg} = 144\text{ tonnes}$.
* Prix total = $144\ 000 \times 5\ 000 = 720\ 000\ 000\text{ GNF}$.`
  },

  // ─── 2. EXAMENS BLANCS (LYCÉES & REGIONS) ─────────────────────────────────
  {
    id: "bac-blanc-conakry-math-2025",
    title: "Sujet BAC Blanc Conakry 2025 - Mathématiques SM",
    description: "Examen Blanc Général du Gouvernorat de Conakry & IRE. Préparation intensive au BAC Unique : Intégrales, Probabilités et Geométrie spatiale.",
    doc_type: "EXERCICE",
    category: "BLANC",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BAC SM",
    is_free: true,
    year: "2025",
    country: "Guinée",
    institution: "Inspection Régionale de l'Éducation de Conakry (IRE)",
    content: `# EXAMEN BLANC RÉGIONAL — BAC SM 2025
**Gouvernorat de Conakry | IRE & DPE Dixinn, Matam, Kaloum, Ratoma, Matoto**
**Durée : 4 heures**

---

### 🎙️ VOIX-OFF & RECOMMANDATION DU PROF. KARAMÖ
*« Cet examen blanc reproduit exactement le niveau de complexité de l'épreuve officielle du BAC. Il met l'accent sur les calculs d'intégrales par parties et la loi binomiale. Entraînez-vous dans les conditions réelles de chrono ! »*

---

### EXERCICE 1 : Calcul Intégral & Décomposition (6 points)

On considère l'intégrale $I = \int_{0}^{1} \frac{x^3}{x^2 + 1} \, dx$.

1. Déterminer les réels $a$ et $b$ tels que pour tout $x$, $\frac{x^3}{x^2+1} = ax + \frac{bx}{x^2+1}$.
2. En déduire la valeur exacte de l'intégrale $I$.
3. À l'aide d'une intégration par parties, calculer $J = \int_{0}^{1} x^2 \ln(x^2+1) \, dx$.

#### ✦ CORRIGÉ PAS À PAS DÉTAILLÉ
* **Étape 1 (Décomposition) :**
  $x^3 = x(x^2+1) - x \implies \frac{x^3}{x^2+1} = x - \frac{x}{x^2+1}$. Donc $a = 1$ et $b = -1$.
* **Étape 2 (Calcul de I) :**
  $I = \left[ \frac{x^2}{2} - \frac{1}{2}\ln(x^2+1) \right]_{0}^{1} = \left( \frac{1}{2} - \frac{1}{2}\ln 2 \right) - 0 = \frac{1 - \ln 2}{2}$.
* **Étape 3 (Intégration par parties) :**
  Posons $u(x) = \ln(x^2+1) \implies u'(x) = \frac{2x}{x^2+1}$.
  $v'(x) = x^2 \implies v(x) = \frac{x^3}{3}$.
  $J = \left[ \frac{x^3}{3}\ln(x^2+1) \right]_{0}^{1} - \frac{2}{3}\int_{0}^{1}\frac{x^4}{x^2+1}\,dx = \frac{\ln 2}{3} - \frac{2}{3}\left(\frac{1}{3} - I\right)$.
  En remplaçant $I$, on obtient **$J = \frac{2\ln 2 - 1}{9}$**.`
  },
  {
    id: "bac-blanc-sainte-marie-physique-2025",
    title: "Sujet BAC Blanc Lycée Sainte-Marie 2025 - Physique",
    description: "Épreuve du BAC Blanc d'Excellence du Lycée Sainte-Marie de Dixinn. Oscillateur mécanique amorti, induction électromagnétique et physique nucléaire.",
    doc_type: "EXERCICE",
    category: "BLANC",
    subject: { id: 2, name: "Physique", icon: "Atom" },
    level: "BAC SM",
    is_free: true,
    year: "2025",
    country: "Guinée",
    institution: "Lycée Sainte-Marie de Conakry",
    content: `# EXAMEN BLANC D'EXCELLENCE — LYCÉE SAINTE-MARIE DIXINN
**Section : Sciences Mathématiques & Expérimentales**
**Session Blanc : Mai 2025**

---

### EXERCICE 1 : Décroissance Radioactive & Médecine Nucléaire (6 points)

L'iode 131 ($\text{}^{131}_{53}\text{I}$) est un isotope radioactif émetteur $\beta^-$ utilisé en radiothérapie de la thyroïde. Sa demi-vie ou période radioactive est $T = 8,0\text{ jours}$.

1. Écrire l'équation de désintégration de l'iode 131 en précisant les lois de conservation de Soddy. Nommer le noyau fils obtenu ($\text{Xe}$, $\text{Te}$, $\text{Ba}$).
2. Déterminer la constante radioactive $\lambda$ en $\text{s}^{-1}$.
3. Un patient reçoit une injection contenant une activité $A_0 = 3,7 \times 10^8\text{ Bq}$ à $t=0$. Quelle sera l'activité $A(t)$ restante au bout de $24\text{ jours}$ ?

#### ✦ CORRIGÉ DU PROFESSEUR KARAMÖ
* **Équation de désintégration $\beta^-$ :**
  $$\text{}^{131}_{53}\text{I} \longrightarrow \text{}^{131}_{54}\text{Xe} + \text{}^0_{-1}\text{e} + \bar{\nu}_e$$
* **Constante radioactive :**
  $\lambda = \frac{\ln 2}{T} = \frac{0,693}{8,0 \times 86400\text{ s}} \approx 1,0 \times 10^{-6}\text{ s}^{-1}$.
* **Activité après 24 jours :**
  Puisque $t = 24\text{ jours} = 3T$, l'activité est divisée par $2^3 = 8$ :
  $A(24\text{ jours}) = \frac{A_0}{8} = \frac{3,7 \times 10^8}{8} \approx 4,625 \times 10^7\text{ Bq}$.`
  },
  {
    id: "bepc-blanc-ratoma-francais-2025",
    title: "Sujet BEPC Blanc Ratoma 2025 - Français & Rédaction",
    description: "Examen Blanc de la Commune de Ratoma. Texte suivi de questions de grammaire, vocabulaire et sujet de rédaction narrative.",
    doc_type: "EXERCICE",
    category: "BLANC",
    subject: { id: 6, name: "Français", icon: "BookMarked" },
    level: "BEPC",
    is_free: true,
    year: "2025",
    country: "Guinée",
    institution: "DCE Ratoma - Conakry",
    content: `# EXAMEN BLANC COMMUNAL — BEPC 2025
**Direction Communale de l'Éducation de Ratoma**

---

### TEXTE : L'Éducation des Filles, Moteur du Progrès
*« Éduquer une fille, c'est éduquer toute une nation. Lorsqu'une jeune fille accède à l'école, elle acquiert l'autonomie, préserve sa santé et participe activement au développement économique de sa communauté... »*

### QUESTIONS :
1. **Compréhension :** Dégager l'idée générale du texte et expliquer l'expression « éduquer toute une nation ».
2. **Grammaire :** Relever une proposition subordonnée conjonctive de condition dans le texte.
3. **Rédaction :** Écrire une lettre de sensibilisation à un parent qui hésite à envoyer sa fille au collège.`
  },

  // ─── 3. EXAMENS DE L'ÉTRANGER (INTERNATIONAL / AUTRES PAYS) ───────────────
  {
    id: "bac-france-metropole-math-2024",
    title: "Sujet BAC France Métropole 2024 - Mathématiques Spécialité",
    description: "Épreuve officielle du BAC Général Français (Métropole). Équations différentielles, géométrie dans l'espace et fonctions exponentielles.",
    doc_type: "EXERCICE",
    category: "ETRANGER",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BAC SM",
    is_free: true,
    year: "2024",
    country: "France",
    institution: "Ministère de l'Éducation Nationale (France)",
    content: `# ÉPREUVE DE MATHÉMATIQUES — BAC FRANCE MÉTROPOLE 2024
**Série : Baccalauréat Général Spécialité Mathématiques**
**Épreuve Internationale / Étranger**

---

### 🎙️ ANNALES INTERNATIONALES - CONSEIL KARAMÖ
*« Étudier les sujets du BAC de France permet d'enrichir considérablement son raisonnement mathématique. Ces exercices privilégient la rigueur de démonstration géométrique et les probabilités conditionnelles. »*

---

### EXERCICE 1 : Équations Différentielles & Exponentielle (5 points)

On considère l'équation différentielle $(E) : y' + 2y = 4x$.

1. Démontrer que la fonction affine $g(x) = 2x - 1$ est solution particulière de $(E)$.
2. Résoudre l'équation différentielle homogène $(E_0) : y' + 2y = 0$.
3. En déduire l'ensemble des solutions de l'équation $(E)$.
4. Déterminer la solution particulière $f$ vérifiant la condition initiale $f(0) = 3$.

#### ✦ CORRIGÉ PAS À PAS DE KARAMÖ
* **1. Verification de g(x) :**
  $g'(x) = 2$. Donc $g'(x) + 2g(x) = 2 + 2(2x - 1) = 2 + 4x - 2 = 4x$. $g$ est bien solution.
* **2. Equation homogène :**
  Les solutions de $y' + 2y = 0$ sont de la forme $y_0(x) = C e^{-2x}$ avec $C \in \mathbb{R}$.
* **3. Solutions générales :**
  $y(x) = y_0(x) + g(x) = C e^{-2x} + 2x - 1$.
* **4. Condition initiale f(0) = 3 :**
  $f(0) = C e^0 + 0 - 1 = 3 \implies C - 1 = 3 \implies C = 4$.
  La solution unique est **$f(x) = 4e^{-2x} + 2x - 1$**.`
  },
  {
    id: "bac-senegal-physique-2024",
    title: "Sujet BAC Sénégal 2024 - Physique & Chimie (S2)",
    description: "Sujet officiel du Baccalauréat Sénégalais - Série S2. Ondes mécaniques progressives, oscillateurs électriques RLC et estérification.",
    doc_type: "EXERCICE",
    category: "ETRANGER",
    subject: { id: 2, name: "Physique", icon: "Atom" },
    level: "BAC SM",
    is_free: true,
    year: "2024",
    country: "Sénégal",
    institution: "Office du Baccalauréat du Sénégal",
    content: `# ÉPREUVE DE PHYSIQUE-CHIMIE — BAC SÉNÉGAL 2024
**Série S2 (Sciences Expérimentales & Physiques) | Dakar**

---

### EXERCICE 1 : Chimie Organique & Cinétique (6 points)

On étudie la cinétique d'hydrolyse du propanoate d'éthyle à $25\text{ }^\circ\text{C}$.

1. Écrire l'équation bilancielle de cette réaction en formule développée.
2. Définir le temps de demi-réaction $t_{1/2}$. Comment varie-t-il lorsque la température augmente ?

#### ✦ CORRIGÉ DÉTAILLÉ DE KARAMÖ
* **Équation de l'hydrolyse de l'ester :**
  $$\text{CH}_3-\text{CH}_2-\text{COO}-\text{CH}_2-\text{CH}_3 + \text{H}_2\text{O} \rightleftharpoons \text{CH}_3-\text{CH}_2-\text{COOH} + \text{CH}_3-\text{CH}_2\text{OH}$$
  On obtient de l'acide propanoïque et de l'éthanol.
* **Temps de demi-réaction :**
  $t_{1/2}$ est la durée au bout de laquelle la moitié de l'avancement maximal est atteint ($x(t_{1/2}) = x_{\text{max}}/2$). Une augmentation de la température accélère la réaction et diminue $t_{1/2}$.`
  },
  {
    id: "bac-cote-ivoire-svt-2024",
    title: "Sujet BAC Côte d'Ivoire 2024 - SVT Série D",
    description: "Épreuve officielle du Baccalauréat Ivoirien. Immunologie humaine, réaction inflammatoire et fonctionnement du système nerveux.",
    doc_type: "EXERCICE",
    category: "ETRANGER",
    subject: { id: 3, name: "SVT", icon: "Leaf" },
    level: "BAC SS",
    is_free: true,
    year: "2024",
    country: "Côte d'Ivoire",
    institution: "DECO - Abidjan",
    content: `# ÉPREUVE DE SVT — BAC CÔTE D'IVOIRE 2024
**Série D (Sciences de la Vie et de la Terre) | Abidjan**

---

### EXERCICE : Immunologie & Réponse Spécifique (10 points)

Expliquer le rôle des lymphocytes T4 ($\text{LT}_4$) dans l'activation de la réponse immunitaire à médiation humorale et cellulaire.

#### ✦ DÉMONSTRATION DE KARAMÖ
Les $\text{LT}_4$ sont les chefs d'orchestre du système immunitaire :
1. Ils reconnaissent l'antigène présenté par la cellule présentatrice d'antigène (CPA) via le complexe majeur d'histocompatibilité (CMH II).
2. Ils se différencient en $\text{LT}$ récepteurs sécrétant l'interleukine-2 ($\text{IL}-2$).
3. L'interleukine stimule la multiplication des lymphocytes B (sécrétant les anticorps) et des lymphocytes $\text{LT}_8$ cytotoxiques.`
  },
  {
    id: "bac-maroc-philo-2024",
    title: "Sujet BAC Maroc 2024 - Philosophie & Culture",
    description: "Examen National du Baccalauréat Marocain. Les concepts de la Personne, la Vérité scientifique et la Théorie du Pouvoir Politique.",
    doc_type: "EXERCICE",
    category: "ETRANGER",
    subject: { id: 7, name: "Philosophie", icon: "Lightbulb" },
    level: "BAC",
    is_free: true,
    year: "2024",
    country: "Maroc",
    institution: "Ministère de l'Éducation Nationale (Rabat)",
    content: `# ÉPREUVE DE PHILOSOPHIE — BAC MAROC 2024
**Session Nationale Internationale | Rabat**

---

### SUJET DE DISSERTATION :
*« La vérité scientifique est-elle une simple construction de l'esprit humain ou le reflet exact de la réalité extérieure ? »*

#### ✦ PLAN COMPARATIF DE KARAMO
* **I. Le Réalisme naïf :** La science comme miroir fidèle des lois de la nature (Descartes, Newton).
* **II. Le Constructivisme & Rationalisme appliqué :** La vérité scientifique est une construction théorique vérifiée par l'expérience (Bachelard, Popper).
* **III. Synthèse :** La science progresse par rectifications successives de ses erreurs.`
  },
  // ─── SUJETS RAJOUTÉS DE LA BANQUE COMPLÈTE GUINÉENNE (2015 - 2024) ────────
  {
    id: "bac-math-sm-2024",
    title: "Sujet Officiel BAC SM 2024 - Mathématiques",
    description: "Épreuve officielle du BAC SM 2024. Équations différentielles, géométrie de l'espace et probabilités conditionnelles.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BAC SM",
    is_free: true,
    year: "2024",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE MATHÉMATIQUES — BAC SM 2024 (GUINÉE)
**Session Officielle 2024 | MEPUA**

---

### EXERCICE 1 : Probabilités & Loi Binomiale (5 points)
Une urne contient 4 boules rouges et 6 boules noires. On tire au hasard et simultanément 3 boules de l'urne.
1. Calculer la probabilité d'obtenir exactement 2 boules rouges.
2. On répète l'épreuve 5 fois de suite avec remise. Quelle est la probabilité d'obtenir au moins une fois 2 boules rouges ?

#### ✦ CORRIGÉ PAS À PAS DE PROF. KARAMO
* **1. Tirage simultané :** Nombre total de tirages possibles $C_{10}^3 = 120$.
  Nombre de tirages favorables (2 rouges parmi 4 et 1 noire parmi 6) : $C_4^2 \times C_6^1 = 6 \times 6 = 36$.
  $P(A) = \frac{36}{120} = \frac{3}{10} = 0,3$.
* **2. Répétition (Loi Binomiale $B(5; 0,3)$) :**
  $P(X \geq 1) = 1 - P(X = 0) = 1 - (1 - 0,3)^5 = 1 - (0,7)^5 = 1 - 0,16807 = 0,83193$.`
  },
  {
    id: "bac-phys-sm-2024",
    title: "Sujet Officiel BAC SM 2024 - Physique",
    description: "Épreuve officielle de Physique du BAC SM 2024. Mouvement dans un champ E uniforme, oscillateur RLC et optique ondulatoire.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 2, name: "Physique", icon: "Atom" },
    level: "BAC SM",
    is_free: true,
    year: "2024",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE PHYSIQUE — BAC SM 2024 (GUINÉE)
**Session Officielle 2024 | MEPUA**

---

### EXERCICE 1 : Électron dans un Champ Électrique Uniforme (6 points)
Un électron pénètre entre deux plaques parallèles sous tension $U$ avec une vitesse initiale $v_0$ perpendiculaire au champ $\vec{E}$.
1. Établir l'équation de la trajectoire de l'électron dans le condensateur.
2. Exprimer la déviation électrostatique $Y$ à la sortie des plaques de longueur $L$.

#### ✦ CORRIGÉ PAS À PAS DE PROF. KARAMO
* **1. Accélération :** $\vec{a} = \frac{q\vec{E}}{m} = -\frac{eE}{m}\vec{j}$.
  $x(t) = v_0 t \implies t = \frac{x}{v_0}$.
  $y(t) = \frac{eE}{2m} t^2 \implies y(x) = \frac{eE}{2m v_0^2} x^2$.
* **2. Déviation $Y$ :** Pour $x = L$, $Y = \frac{e U L^2}{2 m d v_0^2}$.`
  },
  {
    id: "bac-math-sm-2023",
    title: "Sujet Officiel BAC SM 2023 - Mathématiques",
    description: "Épreuve officielle du BAC SM 2023. Nombres complexes, transformation du plan et étude de fonction logarithme népérien.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BAC SM",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE MATHÉMATIQUES — BAC SM 2023 (GUINÉE)
**Session Officielle 2023 | MEPUA**

---

### EXERCICE : Étude de la fonction $f(x) = x - \ln(x^2 + 1)$
1. Déterminer l'ensemble de définition $D_f$.
2. Calculer les limites aux bornes de $D_f$.
3. Étudier le sens de variation de $f$ et dresser son tableau de variation.

#### ✦ CORRIGÉ PAS À PAS DE PROF. KARAMO
* **1. Ensemble de définition :** Pour tout $x \in \mathbb{R}$, $x^2 + 1 > 0$, donc $D_f = \mathbb{R}$.
* **2. Limites :** En $+\infty$, $f(x) = x(1 - \frac{\ln(x^2+1)}{x}) \to +\infty$. En $-\infty$, $f(x) \to -\infty$.
* **3. Dérivée :** $f'(x) = 1 - \frac{2x}{x^2+1} = \frac{x^2 - 2x + 1}{x^2+1} = \frac{(x-1)^2}{x^2+1} \geq 0$.
  $f$ est strictement croissante sur $\mathbb{R}$.`
  },
  {
    id: "bac-philo-ss-2024",
    title: "Sujet Officiel BAC SS 2024 - Philosophie",
    description: "Épreuve officielle de Philosophie des Sciences Sociales 2024. La conscience, la liberté politique et le progrès technique.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 7, name: "Philosophie", icon: "Lightbulb" },
    level: "BAC SS",
    is_free: true,
    year: "2024",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE PHILOSOPHIE — BAC SS 2024 (GUINÉE)
**Session Officielle 2024 | MEPUA**

---

### SUJET : *« Le progrès technique garantit-il le bonheur de l'humanité ? »*

#### ✦ PLAN DE DISSERTATION DE PROF. KARAMO
* **I. Le progrès technique comme source de libération :** Allègement du travail humain, avancées de la médecine, communication mondiale (Descartes, Bacon).
* **II. Les dérives et risques de la technique :** Aliénation, destruction environnementale, perte de sens (Rousseau, Jonas).
* **III. Synthèse éthique :** La technique n'est qu'un moyen ; seul un usage guidé par l'éthique assure le bien-être humain.`
  },
  {
    id: "bac-geo-ss-2024",
    title: "Sujet Officiel BAC SS 2024 - Géographie de la Guinée",
    description: "Épreuve de Géographie du BAC SS 2024. L'économie guinéenne, le bauxite, le réseau hydrographique (château d'eau) et l'urbanisation.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 8, name: "Géographie", icon: "Globe" },
    level: "BAC SS",
    is_free: true,
    year: "2024",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE GÉOGRAPHIE — BAC SS 2024 (GUINÉE)
**Session Officielle 2024 | MEPUA**

---

### SUJET : La Guinée, Château d'Eau de l'Afrique de l'Ouest
1. Justifiez l'appellation « Château d'eau de l'Afrique de l'Ouest » attribuée à la Guinée.
2. Citez trois grands fleuves internationaux qui prennent leur source en Guinée et les pays traversés.
3. Quels sont les défis liés à la gestion et à la préservation de ce potentiel hydrologique ?

#### ✦ CORRIGÉ STRUCTURÉ DE PROF. KARAMO
* **1. Raison de l'appellation :** En raison du relief élevé (Massif du Fouta Djallon) et d'une pluviométrie abondante, la Guinée donne naissance aux principaux cours d'eau de la sous-région.
* **2. Fleuves majeurs :**
  - **Le Fleuve Niger :** Source à Faranah $\rightarrow$ Mali, Niger, Bénin, Nigeria.
  - **Le Fleuve Sénégal :** (Bafing) Source au Fouta Djallon $\rightarrow$ Mali, Mauritanie, Sénégal.
  - **Le Fleuve Gambie :** Source à Labé $\rightarrow$ Sénégal, Gambie.
* **3. Défis :** La déforestation, le changement climatique et l'exploitation minière non contrôlée.`
  },
  {
    id: "bac-histoire-ss-2023",
    title: "Sujet Officiel BAC SS 2023 - Histoire Moderne",
    description: "Épreuve officielle d'Histoire BAC SS 2023. La décolonisation en Afrique, le rôle d'Ahmed Sékou Touré et le Référendum du 28 Septembre 1958.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 9, name: "Histoire", icon: "History" },
    level: "BAC SS",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE OFFICIELLE D'HISTOIRE — BAC SS 2023 (GUINÉE)
**Session Officielle 2023 | MEPUA**

---

### SUJET : Le Référendum du 28 Septembre 1958 et l'Indépendance de la Guinée
1. Expliquez les circonstances politiques qui ont conduit au vote du « NON » le 28 septembre 1958.
2. Analysez les conséquences immédiates de cette prise de position sur les relations franco-guinéennes.

#### ✦ RÉSUMÉ HISTORIQUE DE PROF. KARAMO
* **1. Le contexte :** Le projet de Communauté Franco-Africaine proposé par le Général de Gaulle. Sous la direction d'Ahmed Sékou Touré et du PDG-RDA, la Guinée rejette la Communauté (« Nous préférons la liberté dans la pauvreté à la richesse dans la servitude ») et vote **NON** à plus de 94%.
* **2. Les conséquences :** Proclamation de l'Indépendance le **2 Octobre 1958**, rupture brutale de l'assistance technique française, et accession de la Guinée à la souveraineté nationale.`
  },
  {
    id: "bepc-maths-2024",
    title: "Sujet Officiel BEPC 2024 - Mathématiques",
    description: "Épreuve officielle du BEPC 2024. Systèmes d'équations à deux inconnues, théorème de Pythagore et trigonométrie.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BEPC",
    is_free: true,
    year: "2024",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE MATHÉMATIQUES — BEPC 2024 (GUINÉE)
**Session Officielle 2024 | MEPUA**

---

### EXERCICE 1 : Résolution de Système (6 points)
Résoudre par la méthode de substitution ou de combinaison le système suivant :
$$\begin{cases} 2x + 3y = 13 \\ 5x - y = 7 \end{cases}$$

#### ✦ CORRIGÉ DÉTAILLÉ DE PROF. KARAMO
* De la 2ème équation : $y = 5x - 7$.
* On remplace $y$ dans la 1ère équation : $2x + 3(5x - 7) = 13 \iff 2x + 15x - 21 = 13 \iff 17x = 34 \iff x = 2$.
* On en déduit $y = 5(2) - 7 = 10 - 7 = 3$.
* Le couple solution est **$(x; y) = (2; 3)$**.`
  },
  {
    id: "bepc-physique-2023",
    title: "Sujet Officiel BEPC 2023 - Physique & Chimie",
    description: "Épreuve de Physique-Chimie BEPC 2023. Électricité (Loi d'Ohm, puissance), masse volumique et réactions chimiques.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 2, name: "Physique", icon: "Atom" },
    level: "BEPC",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE DE PHYSIQUE-CHIMIE — BEPC 2023 (GUINÉE)
**Session Officielle 2023 | MEPUA**

---

### EXERCICE : Loi d'Ohm & Puissance Électrique (8 points)
Un conducteur ohmique de résistance $R = 50\ \Omega$ est traversé par un courant d'intensité $I = 0,4\text{ A}$ pendant $10\text{ minutes}$.
1. Calculer la tension $U$ aux bornes du conducteur.
2. Calculer la puissance électrique $P$ consommée.
3. Calculer l'énergie thermique $E$ dissipée par effet Joule en Joules puis en Wattheures.

#### ✦ CORRIGÉ PAS À PAS DE PROF. KARAMO
* **1. Tension $U$ :** $U = R \times I = 50 \times 0,4 = 20\text{ Volts}$.
* **2. Puissance $P$ :** $P = U \times I = 20 \times 0,4 = 8\text{ Watts}$.
* **3. Énergie $E$ :** $t = 10\text{ min} = 600\text{ secondes}$.
  $E = P \times t = 8 \times 600 = 4\ 800\text{ Joules}$.
  En Wattheures : $E = \frac{4800}{3600} = 1,33\text{ Wh}$.`
  },
  {
    id: "bepc-histoire-geo-2023",
    title: "Sujet Officiel BEPC 2023 - Histoire & Géographie",
    description: "Épreuve officielle d'Histoire-Géographie BEPC 2023. La résistance guinéenne (Samory Touré), le relief et la végétation de la Guinée.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 9, name: "Histoire", icon: "History" },
    level: "BEPC",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE D'HISTOIRE-GÉOGRAPHIE — BEPC 2023 (GUINÉE)
**Session Officielle 2023 | MEPUA**

---

### PARTIE I : HISTOIRE (10 points)
Présentez la figure de l'Almamy Samory Touré : son empire (Wassoulou), sa stratégie militaire et les étapes de sa résistance contre la pénétration coloniale française.

#### ✦ SYNTHÈSE DE PROF. KARAMO
* **L'Empire du Wassoulou :** Fondé par Samory Touré au XIXe siècle avec Bissandougou comme capitale.
* **Stratégie militaire :** L'armée organisée (les sofas), la fabrication locale d'armes, la tactique de la terre brûlée et le déplacement stratégique de l'empire vers l'est.
* **Fin de la résistance :** Capture à Guélémou en 1898 et exil au Gabon.`
  },
  {
    id: "bepc-anglais-2023",
    title: "Sujet Officiel BEPC 2023 - Anglais",
    description: "Épreuve officielle d'Anglais au BEPC. Comprehension text about youth and technology, grammar questions, and guided writing.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 10, name: "Anglais", icon: "Languages" },
    level: "BEPC",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# OFFICIAL ENGLISH EXAMINATION — BEPC 2023 (GUINEA)
**Session 2023 | Ministry of Pre-University Education**

---

### SECTION 1: READING COMPREHENSION (10 marks)
*Text: The Importance of Mobile Phones for Guinean Students.*
1. Answer True or False according to the text.
2. Find in the text synonyms for: *useful*, *learn*, *fast*.

### SECTION 2: GRAMMAR & USAGE (10 marks)
1. Turn into the passive voice: *"Students use computers in the library."*
   $\rightarrow$ *"Computers are used by students in the library."*
2. Complete with the correct tense: *"If I (have) _____ time, I will visit Conakry."*
   $\rightarrow$ *"have"* (Conditional Type 1).`
  },
  {
    id: "cee-math-2024",
    title: "Sujet Officiel CEE 7ème 2024 - Calcul Écrit",
    description: "Épreuve officielle du Calcul Écrit - Examen de CEE 7ème 2024. Problèmes de pourcentages, périmètre et aire du cercle, partage proportionnel.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2024",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE DE CALCUL ÉCRIT — CEE 7ème 2024 (GUINÉE)
**Session Officielle 2024 | Entrée en 7ème Année**

---

### PROBLÈME DE PARTAGE PROPORTIONNEL (14 points)
Trois commerçants de Madina se partagent un bénéfice de $15\ 000\ 000\text{ GNF}$ proportionnellement à leurs investissements : $2\ 000\ 000\text{ GNF}$, $3\ 000\ 000\text{ GNF}$ et $5\ 000\ 000\text{ GNF}$.
Calculer la part de chacun.

#### ✦ CORRIGÉ PAS À PAS DE PROF. KARAMO
* Capital total investi = $2 + 3 + 5 = 10\text{ millions GNF}$.
* Part du 1er = $\frac{15\ 000\ 000 \times 2}{10} = 3\ 000\ 000\text{ GNF}$.
* Part du 2ème = $\frac{15\ 000\ 000 \times 3}{10} = 4\ 500\ 000\text{ GNF}$.
* Part du 3ème = $\frac{15\ 000\ 000 \times 5}{10} = 7\ 500\ 000\text{ GNF}$.
* Verification : $3 + 4,5 + 7,5 = 15\text{ millions GNF}$.`
  },
  {
    id: "cee-dictee-2024",
    title: "Sujet Officiel CEE 7ème 2024 - Dictée & Questions",
    description: "Épreuve officielle de Dictée et Questions CEE 2024. Accord du participe passé, analyse grammaticale et vocabulaire.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 5, name: "Français", icon: "FileText" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2024",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE DE DICTÉE & QUESTIONS — CEE 2024 (GUINÉE)
**Session Officielle 2024 | CEE 7ème**

---

### DICTÉE : Le Marché de Madina
*« Au petit matin, les marchandes s'installent au grand marché. Les étals se remplissent de fruits frais, de légumes colorés et d'étoffes magnifiques. Les acheteurs affluent de tous les quartiers de Conakry. »*

---

### QUESTIONS :
1. Justifiez l'orthographe du mot *"colorés"*.
2. Donnez la nature et la fonction du mot *"magnifiques"*.
3. Mettez au pluriel la phrase : *"La marchande installe son étal."*

#### ✦ CORRIGÉ DE PROF. KARAMO
* **1. Orthographe :** *"colorés"* s'accorde en genre et en nombre avec le nom masculin pluriel *"légumes"*.
* **2. Nature & Fonction :** *"magnifiques"* est un adjectif qualificatif, épithète du nom *"étoffes"*.
* **3. Pluriel :** *"Les marchandes installent leurs étals."*`
  },
  {
    id: "cee-sciences-2023",
    title: "Sujet Officiel CEE 7ème 2023 - Sciences d'Observation",
    description: "Épreuve de Sciences d'Observation CEE 2023. Le corps humain, la digestion, la germination de la graine et l'hygiène de vie.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 4, name: "SVT", icon: "Leaf" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2023",
    country: "Guinée",
    institution: "MEPUA - Guinée",
    content: `# ÉPREUVE DE SCIENCES D'OBSERVATION — CEE 2023
**Session Officielle 2023 | CEE 7ème Année**

---

### QUESTIONS :
1. Citez dans l'ordre les différents organes de l'appareil digestif de l'homme.
2. Quelles sont les conditions indispensables pour qu'une graine de maïs germe ?
3. Expliquez le rôle du sang dans l'organisme.

#### ✦ CORRIGÉ PAS À PAS DE PROF. KARAMO
* **1. Appareil digestif :** La bouche $\rightarrow$ l'œsophage $\rightarrow$ l'estomac $\rightarrow$ l'intestin grêle $\rightarrow$ le gros intestin $\rightarrow$ l'anus.
* **2. Conditions de germination :** L'eau (humidité), l'air (oxygène) et une température favorable (chaleur).
* **3. Rôle du sang :** Transporter l'oxygène et les nutriments vers les cellules, et éliminer le dioxyde de carbone et les déchets.`
  },
  // ─── SUJETS CEE SESSION 2000 (SOURCE EXAM224.COM) ─────────────────────────
  {
    id: "cee-2000-redaction",
    title: "Sujet Officiel CEE 7ème 2000 - Rédaction",
    description: "Épreuve officielle de Rédaction CEE 2000 (Option Français). Portrait physique et moral d'un membre de la famille.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 5, name: "Français", icon: "FileText" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2000",
    country: "Guinée",
    institution: "MEPUA / SNESCO - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE RÉDACTION — CEE 2000 (GUINÉE)
**Session Officielle 2000 | Ministère de l'Éducation Nationale (MEPU-A / SNESCO)**
*Profils : Option Français | Coefficient : 1 | Durée : 1 heure*

---

### SUJET DE RÉDACTION
> **Faites le portrait physique et moral de votre grand-père ou de votre grand-mère.**

---

#### ✦ CONSEILS & PLAN DE RÉDACTION DE PROF. KARAMO
1. **Introduction :** Présentez brièvement la personne choisie (nom, âge approximatif, lieu de résidence).
2. **Portrait physique :** Décrivez le visage (rides, regard bienveillant), la démarche, la tenue vestimentaire traditionnelle et la voix.
3. **Portrait moral & Qualités :** Décrivez sa gentillesse, sa sagesse, les histoires ou contes qu'il/elle vous raconte au foyer, sa générosité et ses conseils de vie.
4. **Conclusion :** Exprimez vos sentiments d'affection et le respect que vous lui portez.`
  },
  {
    id: "cee-2000-geographie",
    title: "Sujet Officiel CEE 7ème 2000 - Géographie",
    description: "Épreuve officielle de Géographie CEE 2000. Les climats de la Guinée, pays limitrophes et cultures industrielles.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 8, name: "Géographie", icon: "Globe" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2000",
    country: "Guinée",
    institution: "MEPUA / SNESCO - Guinée",
    content: `# ÉPREUVE OFFICIELLE DE GÉOGRAPHIE — CEE 2000 (GUINÉE)
**Session Officielle 2000 | Ministère de l'Éducation Nationale (MEPU-A / SNESCO)**
*Coefficient : 1 | Durée : 1 heure*

---

### QUESTIONS :
1. **Citez les types de climat de la République de Guinée.** (3 points)
2. **Citez les pays limitrophes de la République de Guinée.** (3 points)
3. **Quelles sont les principales cultures industrielles de la Guinée ?** (4 points)

---

#### ✦ CORRIGÉ DÉTAILLÉ DE PROF. KARAMO
* **1. Types de climats en Guinée :**
  - **Le Climat Guinéen (Subéquatorial) :** Pluviométrie très forte, caractérisé par deux saisons bien marquées (Basse Guinée).
  - **Le Climat Foutanien (Soudano-Guinéen d'altitude) :** Températures fraîches et pluies abondantes (Moyenne Guinée).
  - **Le Climat Soudano-Guinéen :** Saison sèche prolongée (Haute Guinée).
  - **Le Climat Subéquatorial Forestier :** Pluie presque toute l'année (Guinée Forestière).
* **2. Pays limitrophes (6 pays) :**
  La Guinée est bordée par la Guinée-Bissau, le Sénégal, le Mali, la Côte d'Ivoire, le Libéria et la Sierra Leone.
* **3. Principales cultures industrielles :**
  Le café, le cacao, le coton, l'hévéa, le palme à huile et l'ananas.`
  },
  {
    id: "cee-2000-sciences",
    title: "Sujet Officiel CEE 7ème 2000 - Sciences d'Observation",
    description: "Épreuve officielle de Sciences d'Observation CEE 2000. États de la matière, composition du lait et hygiène.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 4, name: "SVT", icon: "Leaf" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2000",
    country: "Guinée",
    institution: "MEPUA / SNESCO - Guinée",
    content: `# ÉPREUVE DE SCIENCES D'OBSERVATION — CEE 2000 (GUINÉE)
**Session Officielle 2000 | MEPU-A / SNESCO**
*Coefficient : 1 | Durée : 1 heure*

---

### QUESTIONS :
1. **Citez les états de la matière en donnant un exemple pour chaque état.** (2 points)
2. **Dites pourquoi le lait peut suffire à l'alimentation d'un bébé et citez ses composants.** (4 points)
3. **Quelles sont les règles élémentaires de protection de la vision ?** (4 points)

---

#### ✦ CORRIGÉ GUIDÉ DE PROF. KARAMO
* **1. États de la matière :**
  - **Solide :** La glace, le fer, le bois.
  - **Liquide :** L'eau, le lait, l'huile.
  - **Gazeux :** La vapeur d'eau, l'air, l'oxygène.
* **2. Le lait et l'alimentation du bébé :**
  Le lait est un **aliment complet** car il contient tous les nutriments indispensables à la croissance : l'eau, les lipides (matières grasses), les protides (caséine), les glucides (lactose), les sels minéraux (calcium) et les vitamines.
* **3. Hygiène de la vision :**
  Ne pas lire dans l'obscurité, éviter de se frotter les yeux avec des mains sales, maintenir une distance d'au moins 30 cm par rapport aux livres/écrans.`
  },
  {
    id: "cee-2000-histoire",
    title: "Sujet Officiel CEE 7ème 2000 - Histoire",
    description: "Épreuve officielle d'Histoire CEE 2000. La résistance coloniale, l'Hégire et l'Empire du Ghana.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 9, name: "Histoire", icon: "History" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2000",
    country: "Guinée",
    institution: "MEPUA / SNESCO - Guinée",
    content: `# ÉPREUVE OFFICIELLE D'HISTOIRE — CEE 2000 (GUINÉE)
**Session Officielle 2000 | MEPU-A / SNESCO**
*Coefficient : 1 | Durée : 1 heure*

---

### QUESTIONS :
1. **Citez deux grands résistants africains à l'invasion coloniale morts hors de leur pays. Où chacun est-il mort et quand ?** (3 points)
2. **Qu'est-ce que l'Hégire ?** (1 point)
3. **Par qui fut détruit l'empire du Ghana et quand ?** (2 points)

---

#### ✦ CORRIGÉ HISTORIQUE DE PROF. KARAMO
* **1. Deux grands résistants morts en exil :**
  - **L'Almamy Samory Touré :** Mort en exil à Ndjolé (Gabon) le **2 juin 1900**.
  - **Béhanzin (Roi du Dahomey) :** Mort en exil à Alger (Algérie) en **1906**.
* **2. L'Hégire :**
  L'Hégire désigne l'émigration du Prophète Mahomet (PSL) et de ses compagnons de La Mecque vers Médine en l'an **622**, marquant le début du calendrier musulman.
* **3. Destruction de l'Empire du Ghana :**
  L'Empire du Ghana (Koumbi Saleh) a été affaibli par les **Almoravides** au XIe siècle, puis définitivement soumis par **Sumaoro Kanté** au début du XIIIe siècle (1203).`
  },
  {
    id: "cee-2000-dictee",
    title: "Sujet Officiel CEE 7ème 2000 - Dictée & Questions",
    description: "Épreuve officielle de Dictée & Questions CEE 2000. Texte sur la déforestation, questions de vocabulaire et de grammaire.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 5, name: "Français", icon: "FileText" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2000",
    country: "Guinée",
    institution: "MEPUA / SNESCO - Guinée",
    content: `# ÉPREUVE DE DICTÉE & QUESTIONS — CEE 2000 (GUINÉE)
**Session Officielle 2000 | MEPU-A / SNESCO**
*Coefficient : 2 | Durée : 2 heures*

---

### DICTÉE (10 points)
*Autrefois, la Guinée était entièrement recouverte de forêt. Il pleuvait beaucoup; les agriculteurs faisaient de bonnes récoltes. La population mangeait à sa faim et ne manquait point d’air pur.*

*Aujourd’hui, ces forêts se dégradent petit à petit sous l’effet des feux de brousse et de la coupe abusive du bois. Pendant la saison sèche, il n’y a pas assez d’eau dans les marigots qui ne coulent presque plus. C’est dans cette eau stagnante qu’on lave les habits et qu’on puise de l’eau de boisson. Or, pour la bonne santé, tu dois respirer de l’air pur, être propre, boire de l’eau potable et avoir une habitation aérée.*

---

### QUESTIONS DE COMPRÉHENSION & DE GRAMMAIRE (10 points)

**I- Compréhension :**
a- Quel titre peut-on donner à ce texte ?
b- Expliquez : *Manger à sa faim*, *La coupe abusive du bois*, *Une eau stagnante*, *Une eau potable*.

**II- Vocabulaire :**
- Donnez deux mots de la même famille que « bois » (ex: boisement, reboisement).
- Donnez deux mots de la même famille que « sèche » (ex: sécheresse, séchage).

**III- Conjugaison :**
- Le verbe « faire » aux 4 temps simples de l'indicatif (1ère et 3ème personne du pluriel).
- Le verbe « faire » au plus-que-parfait et passé antérieur.`
  },
  {
    id: "cee-2000-ecm",
    title: "Sujet Officiel CEE 7ème 2000 - ECM (Éducation Civique)",
    description: "Épreuve officielle d'ECM CEE 2000. Devise nationale, droits et devoirs, actualité politique guinéenne.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 6, name: "ECM", icon: "Award" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2000",
    country: "Guinée",
    institution: "MEPUA / SNESCO - Guinée",
    content: `# ÉPREUVE D'ÉDUCATION CIVIQUE ET MORALE — CEE 2000
**Session Officielle 2000 | MEPU-A / SNESCO**
*Coefficient : 1 | Durée : 1 heure*

---

### QUESTIONS :
1. **Quelle est la devise de la nation guinéenne ?** (2 points)
2. **Qu’est-ce que le droit ? Qu’est-ce que le devoir ?** (2 points)
3. **Quel événement politique s’est déroulé en Guinée le dimanche 25 juin 2000 ?** (4 points)
4. **Quel est le nombre des préfectures de la République de Guinée ? Citez une préfecture de chaque région administrative.** (2 points)

---

#### ✦ CORRIGÉ DE PROF. KARAMO
* **1. Devise Nationale :** *"Travail - Justice - Solidarité"*.
* **2. Droit et Devoir :**
  - **Le Droit :** Ce qu'une personne est autorisée à exiger de la société ou des autres (ex: le droit à l'éducation, à la santé).
  - **Le Devoir :** Les obligations morales ou légales qu'un citoyen doit accomplir envers la collectivité (ex: payer ses impôts, respecter la loi).
* **3. Événement du 25 juin 2000 :**
  Les élections municipales et communales en République de Guinée.
* **4. Préfectures & Régions Administratives :**
  La Guinée compte **33 préfectures**.
  - *Basse Guinée (Kindia) :* Kindia, Boké.
  - *Moyenne Guinée (Labé) :* Labé, Mamou.
  - *Haute Guinée (Kankan) :* Kankan, Faranah.
  - *Guinée Forestière (Nzérékoré) :* Nzérékoré, Macenta.`
  },
  {
    id: "cee-2000-calcul",
    title: "Sujet Officiel CEE 7ème 2000 - Calcul Écrit",
    description: "Épreuve officielle de Calcul Écrit CEE 2000. Opérations décimales, unités de temps et problème de surface d'un champ.",
    doc_type: "EXERCICE",
    category: "REAL",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2000",
    country: "Guinée",
    institution: "MEPUA / SNESCO - Guinée",
    content: `# ÉPREUVE DE CALCUL ÉCRIT — CEE 2000 (GUINÉE)
**Session Officielle 2000 | MEPU-A / SNESCO**
*Coefficient : 2 | Durée : 1 Heure 30 minutes*

---

### I- OPÉRATIONS (4 points)
1. $406,752 + 2008 + 34,08 + 119,2 = ?$
2. $43,752 \div 0,82 = ?$
3. $88,6 \times 48,4 = ?$
4. $3\text{h } 15\text{min} - 2\text{h } 45\text{min} = ?$

---

### II- PROBLÈME (6 points)
1. Un champ rectangulaire mesure $840\text{ m}$ de longueur et $300\text{ m}$ de largeur.
2. On l’a ensemencé avec du riz qui coûte $325\text{ FG}$ le kilo et la dépense totale en semence a été de $84\ 420\text{ FG}$. Quel poids de riz a-t-on acheté ?
3. Calculez la surface du champ en hectares, puis trouvez le poids de riz semé à l'hectare.

---

#### ✦ CORRIGÉ PAS À PAS DE PROF. KARAMO
* **Opérations :**
  1. $406,752 + 2008 + 34,08 + 119,2 = 2568,032$.
  2. $43,752 \div 0,82 = 53,356$.
  3. $88,6 \times 48,4 = 4288,24$.
  4. $3\text{h } 15\text{min} - 2\text{h } 45\text{min} = 2\text{h } 75\text{min} - 2\text{h } 45\text{min} = 30\text{ minutes}$.

* **Problème :**
  1. **Poids total de riz acheté :**
     $\text{Poids} = \frac{84\ 420}{325} = 259,75\text{ kg}$.
  2. **Surface du champ en hectares :**
     $\text{Surface en m}^2 = 840 \times 300 = 252\ 000\text{ m}^2$.
     Comme $1\text{ ha} = 10\ 000\text{ m}^2$, $\text{Surface} = \frac{252\ 000}{10\ 000} = 25,2\text{ hectares}$.
  3. **Poids de riz semé par hectare :**
     $\text{Densité} = \frac{259,75}{25,2} \approx 10,3\text{ kg/ha}$.`
  }
];

export const FALLBACK_BAC_SUBJECTS: FallbackSubject[] = [
  ...BASE_FALLBACK_SUBJECTS,
  ...(EXAM224_SUBJECTS as FallbackSubject[]).filter((sub: any) => {
    const isBac = sub.level && sub.level.toUpperCase().includes('BAC');
    if (!isBac) return true;
    const content = sub.content || '';
    if (content.includes('erreurs de frappe') || content.includes('version transcrite') || content.includes('&hellip;&hellip;') || content.length < 100) {
      return false;
    }
    return true;
  })
];




