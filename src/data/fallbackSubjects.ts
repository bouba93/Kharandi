export const FALLBACK_BAC_SUBJECTS = [
  {
    id: "bac-math-sm-2021",
    title: "Sujet BAC SM 2021 - Mathématiques",
    description: "Épreuve complète de Mathématiques de l'Option Sciences Mathématiques. Contient l'analyse des suites numériques, les nombres complexes et la géométrie analytique.",
    doc_type: "EXERCICE",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BAC SM",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE DE MATHÉMATIQUES — BAC SM (Sciences Mathématiques)
**Session : 2021**
**Durée : 4 heures**

---

### EXERCICE 1 : Suites Numériques & Convergence (5 points)

Soit la suite numérique $(u_n)_{n \in \mathbb{N}}$ définie par :
$$u_0 = 1 \quad \text{et} \quad u_{n+1} = \sqrt{2 + u_n} \quad \text{pour tout } n \in \mathbb{N}$$

1. **Démonstration par récurrence**
   Montrer que pour tout entier naturel $n$, on a $0 \leq u_n \leq 2$.
2. **Sens de variation**
   Montrer que la suite $(u_n)$ est strictement croissante. En déduire qu'elle est convergente.
3. **Calcul de la limite**
   Déterminer la limite $\ell$ de la suite $(u_n)$.

#### ✦ CORRIGÉ ET DU CONSEIL DE KARAMÖ
* **Indice pour la récurrence :** Pour $n=0$, $u_0 = 1$ est bien compris entre $0$ et $2$. Supposons $0 \leq u_n \leq 2$, alors $2 \leq u_n + 2 \leq 4$ donc $\sqrt{2} \leq \sqrt{2 + u_n} \leq 2$. L'hérédité est parfaitement vérifiée.
* **Limite :** La fonction $f(x) = \sqrt{2+x}$ étant continue sur $[0; 2]$, la limite $\ell$ vérifie $\ell = \sqrt{2+\ell}$. En élevant au carré, $\ell^2 - \ell - 2 = 0$. Les solutions sont $\ell = 2$ ou $\ell = -1$. Comme la suite est positive, on a **$\ell = 2$**.

---

### EXERCICE 2 : Nombres Complexes (5 points)

On considère dans l'ensemble $\mathbb{C}$ l'équation :
$$(E) : z^2 - (2 + 2i)z + 3 - 2i = 0$$

1. Résoudre l'équation $(E)$ dans $\mathbb{C}$. On exprimera les solutions sous forme algébrique.
2. Établir la forme trigonométrique de chaque racine de $(E)$.

#### ✦ CORRIGÉ PAS À PAS
* Calculons le discriminant $\Delta$ :
  $\Delta = (2+2i)^2 - 4(3-2i) = 8i - 12 + 8i = -12 + 16i$.
  Pour trouver les racines carrées $\delta = x+iy$ de $\Delta$, on résout le système :
  $\begin{cases} x^2 - y^2 = -12 \\ x^2 + y^2 = \sqrt{(-12)^2 + 16^2} = 20 \\ 2xy = 16 \end{cases}$
  En combinant les lignes, on trouve $2x^2 = 8 \implies x^2 = 4 \implies x = \pm 2$. Et $2y^2 = 32 \implies y = \pm 4$.
  Comme $xy > 0$, on prend $\delta = 2+4i$.
  Les racines sont donc :
  $z_1 = \frac{2+2i - (2+4i)}{2} = -i$
  $z_2 = \frac{2+2i + (2+4i)}{2} = 2 + 3i$.

---

### PROBLÈME ANALYTIQUE (10 points)

On considère la fonction numérique d'une variable réelle $f$ définie sur $]0 ; +\infty[$ par :
$$f(x) = x + \ln(x) - \frac{1}{x}$$

1. Dresser le tableau de variation complet de $f$.
2. Montrer qu'il existe un unique réel $\alpha \in [0,5 \ ; \ 1,5]$ tel que $f(\alpha) = 0$.
3. Déterminer l'équation de la tangente à la courbe au point d'abscisse $x=1$.`
  },
  {
    id: "bac-phys-sm-2021",
    title: "Sujet BAC SM 2021 - Physique",
    description: "Épreuve théorique de Physique pour les Sciences Mathématiques. Cinématique Newtonienne, forces fondamentales, satellites artificiels et oscillateur harmonique.",
    doc_type: "EXERCICE",
    subject: { id: 2, name: "Physique", icon: "Atom" },
    level: "BAC SM",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE DE PHYSIQUE — BAC SM
**Session : 2021**
**Option : Sciences Mathématiques**

---

### EXERCICE 1 : Mouvement d'un Projectile (6 points)

Un projectile de masse $m = 100\text{ g}$ est lancé depuis l'origine $O$ à un instant $t=0$ avec une vitesse initiale $v_0 = 15\text{ m}\cdot\text{s}^{-1}$ inclinée d'un angle $\alpha = 45^\circ$ par rapport à l'horizontale. On néglige la résistance de l'air et on prendra $g = 9,8\text{ m}\cdot\text{s}^{-2}$.

1. Établir les équations horaires cartésiennes du mouvement du projectile.
2. En déduire l'équation de la trajectoire.
3. Déterminer la portée maximale (distance maximale atteinte au sol).

#### ✦ CORRIGÉ PRÉVOYANT
* **Équations horaires :**
  $x(t) = (v_0 \cos \alpha)t$
  $y(t) = -\frac{1}{2}gt^2 + (v_0 \sin \alpha)t$
* **Équation de la trajectoire :**
  $y(x) = -\frac{g}{2v_0^2\cos^2\alpha}x^2 + (\tan \alpha)x$
* **Portée maximale :**
  La portée est obtenue pour $y(x) = 0 \implies x = \frac{v_0^2 \sin(2\alpha)}{g}$.
  Avec $\alpha = 45^\circ$, $\sin(2\alpha) = 1$. Donc $x_{\text{max}} = \frac{15^2}{9,8} \approx 22,95\text{ m}$.

---

### EXERCICE 2 : Satellites en Orbite (4 points)

Un satellite artificiel de la Terre décrit une trajectoire circulaire uniforme d'altitude $h = 600\text{ km}$ au-dessus de la Terre de rayon $R_T = 6400\text{ km}$.

1. Rappeler la formule donnant la vitesse d'un satellite en fonction de sa hauteur.
2. Calculer sa période de révolution en heures, minutes et secondes. (On prendra $G = 6,67 \times 10^{-11}\text{ N}\cdot\text{m}^2\cdot\text{kg}^{-2}$ et $M_T = 5,98 \times 10^{24}\text{ kg}$).`
  },
  {
    id: "bac-svt-ss-2021",
    title: "Sujet BAC SS 2021 - SVT (Biologie)",
    description: "Sujet officiel des Sciences Expérimentales en SVT. Génétique humaine, hérédité liée au sexe et biosynthèse des protéines.",
    doc_type: "EXERCICE",
    subject: { id: 3, name: "SVT", icon: "Leaf" },
    level: "BAC SS",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE DE SVT — BAC SS (Sciences Expérimentales)
**Session : 2021**
**Durée : 3 heures**

---

### PREMIÈRE PARTIE : Restitution de Connaissances (8 points)

Expliquer les étapes essentielles de la **biosynthèse des protéines** dans une cellule eucaryote. Le candidat s'appuiera sur des schémas précis montrant la transcription nucléaire et la traduction de l'ARN messager au niveau du cytoplasme.

#### ✦ GUIDE DE RÉPONSE DE KARAMÖ
Votre devoir doit s'articuler autour de deux grands axes :
1. **La Transcription (Nucléaire) :** Processus par lequel l'ARN polymérase extrait la séquence de base d'un brin d'ADN pour composer l'ARN messager (pré-messager puis mature après épissage).
2. **La Traduction (Cytoplasmique) :** Mécanisme au cours duquel le ribosome lit les codons de l'ARNm pour assembler les acides aminés apportés par les ARNt (Phase d'initiation, phase d'élongation, phase de terminaison au codon STOP).

---

### DEUXIÈME PARTIE : Génétique Humaine (12 points)

On étudie la transmission d'une maladie orpheline héréditaire rare dans une grande famille guinéenne.
L'analyse généalogique montre qu'un homme atteint de la maladie transmet toujours le caractère pathologique à l'intégralité de ses filles, tandis qu'aucun de ses fils n'est touché.

1. Déterminez si l'allèle de la maladie est dominant ou récessif. Justifiez.
2. Le gène en cause est-il situé sur un autosome ou sur un gonosome ? Lequel en particulier ?
3. Rédiger le génotype complet des parents et de la première descendance.`
  },
  {
    id: "bac-econ-se-2021",
    title: "Sujet BAC SE 2021 - Économie générale",
    description: "Épreuve d'Économie des Sciences Économiques. Analyse complète de l'inflation, de la balance des paiements en Guinée et du chômage structurel.",
    doc_type: "EXERCICE",
    subject: { id: 4, name: "Économie", icon: "TrendingUp" },
    level: "BAC SE",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE D'ÉCONOMIE GÉNÉRALE — BAC SE
**Session : 2021**
**Option : Sciences Économiques**

---

### EXERCICE 1 : Rappels de Macroéconomie (6 points)

Donner les définitions rigoureuses de :
1. **Produit Intérieur Brut (PIB)** nominal par rapport au PIB réel.
2. **Inflation** : Quels sont ses principaux moteurs (inflation par la demande, par les coûts, ou monétaire) ?
3. **Balance Commerciale** : Comment se définit une crise de balance de paiements ?

---

### EXERCICE 2 : Problématique de Développement (14 points)

#### SUJET DE DISSERTATION :
*« Analysez les principaux défis macroéconomiques auxquels la République de Guinée fait face dans l'exploitation de ses ressources minières pour assurer un développement inclusif et durable. »*

#### ✦ INDICATEURS ET CONSEILS DE CONCEPTION
* **Introduction :** Problématiser le concept du « syndrome hollandais » (Dutch Disease) et comment la primauté minière (Bauxite, Fer de Simandou) peut altérer la compétitivité du secteur agricole et industriel local.
* **Axe 1 :** L'apport structurel des devises minières à l'économie nationale guinéenne (PIB croissant, investissements en infrastructures routières et énergétiques).
* **Axe 2 :** Les risques de concentration, de volatilité des cours mondiaux des matières premières, et l'impact écologique local.
* **Conclusion :** Importance stratégique des politiques de diversification de l'économie et d'inclusion humaine.`
  },
  {
    id: "bac-chim-ss-2020",
    title: "Sujet BAC SS 2020 - Chimie",
    description: "Correction et exercices pratiques de Chimie Générale. Acides, bases faibles, constantes de dissociation d'équilibre et titrage pH-métrique.",
    doc_type: "EXERCICE",
    subject: { id: 5, name: "Chimie", icon: "FlaskConical" },
    level: "BAC SS",
    is_free: true,
    year: "2020",
    content: `# ÉPREUVE DE CHIMIE — BAC SS / SM
**Session : 2020**

---

### EXERCICE 1 : Équilibre Acide-Base (10 points)

On dissout une masse $m = 0,60\text{ g}$ d'acide éthanoïque ($\text{CH}_3\text{COOH}$) pur dans de l'eau distillée pour obtenir $V = 500\text{ mL}$ de solution aqueuse. Le pH de cette solution est mesuré à $3,4$ à la température de $25\text{ }^\circ\text{C}$.

1. Établir l'équation de la réaction chimique de l'acide éthanoïque avec l'eau.
2. Calculer la concentration molaire initiale $C_0$ de l'acide préparé. (Masses molaires : $M(\text{H}) = 1\text{ g/mol}$, $M(\text{C}) = 12\text{ g/mol}$, $M(\text{O}) = 16\text{ g/mol}$).
3. Déterminer le taux d'avancement final $\tau$ de la réaction. Qu'en concluez-vous sur la force de l'acide ?
4. Calculer la constante d'acidité $K_a$ du couple $\text{CH}_3\text{COOH}/\text{CH}_3\text{COO}^-$.

#### ✦ CORRIGÉ PAS À PAS
* **Masse molaire de CH₃COOH :** $M = 2\times 12 + 4\times 1 + 2\times 16 = 60\text{ g/mol}$.
* **Concentration initiale $C_0$ :** $n = \frac{m}{M} = \frac{0,60}{60} = 0,01\text{ mol}$.
  $C_0 = \frac{n}{V} = \frac{0,01}{0,500} = 2,0 \times 10^{-2}\text{ mol/L}$.
* **Calcul de \tau :**
  Par définition, $\tau = \frac{[\text{H}_3\text{O}^+]_{\text{éq}}}{C_0}$.
  Comme $\text{pH} = 3,4$, $[\text{H}_3\text{O}^+]_{\text{éq}} = 10^{-3,4} \approx 3,98 \times 10^{-4}\text{ mol/L}$.
  $\tau = \frac{3,98 \times 10^{-4}}{2,0 \times 10^{-2}} \approx 0,0199$ soit environ $2,0\%$.
  Puisque $\tau \ll 1$, la réaction est très limitée ; l'acide éthanoïque est donc un **acide faible**.`
  },
  {
    id: "bac-fran-2021",
    title: "Sujet BAC 2021 - Français & Littérature",
    description: "Épreuve obligatoire de Français pour toutes séries. Travaux de commentaire stylistique de textes littéraires et plans de thèses de dissertation.",
    doc_type: "EXERCICE",
    subject: { id: 6, name: "Français", icon: "BookMarked" },
    level: "BAC",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE DE FRANÇAIS — BAC UNIQUE
**Session : 2021**
**Toutes Séries**

---

### PREMIER SUJET : Dissertation Littéraire

**Sujet :**
*« La littérature africaine moderne n'a plus pour seul but de protester ou de dénoncer l'histoire vécue. Elle doit avant tout guider les sociétés vers la reconstruction culturelle et spirituelle. »*

Partagez-vous ce point de vue ? Vous illustrerez votre réponse d'exemples précis empruntés aux œuvres étudiées d'auteurs tels que Camara Laye, Williams Sassine, Aimé Césaire ou Léopold Sédar Senghor.

#### ✦ PLAN DE DISSERTATION SUGGÉRÉ PAR KARAMÖ
* **I. Une littérature d’abord enracinée dans le combat, la lutte politique et l’engagement historique.**
  * Rappel des injustices dénoncées par la négritude (Césaire, Senghor).
  * Satire politique post-indépendance accusatrice (Williams Sassine, Tchicaya U Tam'si).
* **II. Cependant, la littérature est également gardienne des valeurs et source d'espérance esthétique.**
  * Préservation du patrimoine et des vertus ancestrales (Camara Laye dans *L'Enfant noir*).
  * L'éveil spirituel et la quête humaine universelle.
* **III. Synthèse : Une complémentarité nécessaire.**
  * L'écrivain est à la fois le capteur et la voix de son peuple : dénoncer le mal actuel sert directement à concevoir le cheminement vers la libération de l'esprit.`
  },
  {
    id: "bac-philo-2021",
    title: "Sujet BAC 2021 - Philosophie",
    description: "Dissertations d'examens nationaux en Philosophie. Thématiques : La Force de la Loi, la Morale, la Liberté de conscience et la Science.",
    doc_type: "EXERCICE",
    subject: { id: 7, name: "Philosophie", icon: "Lightbulb" },
    level: "BAC",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE DE PHILOSOPHIE — BAC UNIQUE
**Session : 2021**

---

### SUJET DE DISSERTATION N°1 :

*« L'État est-il le plus grand obstacle à la liberté individuelle d'un citoyen ? »*

#### ✦ ANALYSE ET STRUCTURES ARGUMENTATIVES
* **Introduction :** Poser le paradoxe. L'État détient le monopole de la violence légitime (Weber) mais c'est aussi lui qui met en place les lois pour garantir la coexistence libre et pacifique contre l'arbitraire sauvage.
* **Thèse :** L'État oppresseur et totalitaire, l'excès de règles policières et de censure comme limitations matérielles et psychologiques de la souveraineté de l'individu.
* **Antithèse :** Sans l'État, l'individu se retrouve à l'état de nature où règne la loi du plus fort (Hobbes dans *Le Léviathan*). Les lois démocratiques émancipent et sécurisent l'existence collective (Rousseau dans *Le Contrat Social*).
* **Synthèse :** La vraie liberté ne réside pas dans l'absence totale de lois, mais dans l'obéissance à la loi qu'on s'est prescrite. L'État doit être de droit afin d'équilibrer sécurité et libertés.`
  },
  {
    id: "bac-histgeo-2020",
    title: "Sujet BAC SE 2020 - Histoire & Géographie",
    description: "Sujet officiel d'Histoire des Sciences Économiques. Traite de la décolonisation africaine, de l'indépendance de la Guinée en 1958 et du développement géopolitique mondial.",
    doc_type: "EXERCICE",
    subject: { id: 8, name: "Histoire-Géographie", icon: "Compass" },
    level: "BAC SE",
    is_free: true,
    year: "2020",
    content: `# ÉPREUVE D'HISTOIRE-GÉOGRAPHIE — BAC SE
**Session : 2020**

---

### PREMIER SUJET : Le référendum du 28 Septembre 1958 en Guinée

#### CONTEXTE HISTORIQUE & PROTOCOLE DE RÉUNION :
Analysez les circonstances, la signification historique et les conséquences géopolitiques majeures du référendum d'autodétermination de septembre 1958 où le peuple guinéen, sous l'impulsion d'Ahmed Sékou Touré, a courageusement voté « NON » au projet de Communauté Franco-Africaine proposé par le Général de Gaulle.

---

### DEUXIÈME SUJET : Économie de la République de Guinée (Géographie économique)

Expliquer les atouts naturels exceptionnels de la Guinée (hydrologie abondante surnommée « Château d’eau de l'Afrique occidentale », richesses minières bauxitiques, ferrifères, aurifères et diamantifères) et mettez en évidence les raisons de ses difficultés d'industrialisation à grande échelle.`
  },
  {
    id: "bac-chim-sm-2021",
    title: "Sujet BAC SM 2021 - Chimie organique",
    description: "Examen de Chimie organique complexes. Hydrocarbures, alcools, acides carboxyliques et réactions d'estérification/hydrolyse pour Terminale SM.",
    doc_type: "EXERCICE",
    subject: { id: 5, name: "Chimie", icon: "FlaskConical" },
    level: "BAC SM",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE DE CHIMIE — BAC SM
**Session : 2021**
**Section : Chimie Organique**

---

### EXERCICE 1 : Estérification et constantes cinétiques (7 points)

On mélange $0,2\text{ mol}$ d'acide éthanoïque et $0,2\text{ mol}$ d'éthanol à une température stabilisée de $60\text{ }^\circ\text{C}$ en présence de quelques gouttes d'acide sulfurique concentré jouant le rôle de catalyseur.

1. Établir l'équation bilan de cette réaction en formule semi-développée. Nommer l'ester obtenu.
2. Quelles sont les caractéristiques fondamentales d'une réaction d'estérification ?
3. Déterminer la composition du mélange réactionnel à l'équilibre chimique.`
  },
  {
    id: "bac-phys-ss-2021",
    title: "Sujet BAC SS 2021 - Énergie & Électricité",
    description: "Sujet d'Électricité théorique et pratique. Oscillations électriques libres et amorties, étude complète d'un dipôle RLC série connecté à un analyseur logique.",
    doc_type: "EXERCICE",
    subject: { id: 2, name: "Physique", icon: "Atom" },
    level: "BAC SS",
    is_free: true,
    year: "2021",
    content: `# ÉPREUVE DE PHYSIQUE — BAC SS
**Session : 2021**
**Domaine : Dipôles RLC et Électrodynamique**

---

### EXERCICE : Étude du Dipôle RLC (8 points)

Un condensateur idéal de capacité $C = 10\text{ }\mu\text{F}$ préalablement chargé sous une tension stable $U_0 = 12\text{ V}$ est branché en circuit fermé à un instant choisi comme origine de temps ($t=0$) avec une bobine inductive caractérisée par sa résistance interne $r = 5\text{ }\Omega$ et une inductance $L = 0,5\text{ H}$.

1. Établir l'équation différentielle régissant la tension $u_c(t)$ aux bornes du condensateur.
2. Expliquer comment se comporte l'énergie globale interne du circuit au cours du temps. Nommer ce régime d'oscillation.`
  },
  {
    id: "bepc-maths-2023",
    title: "Sujet BEPC 2023 - Mathématiques",
    description: "Épreuve officielle de Mathématiques de la session 2023 du BEPC. Équations, inéquations, fractions rationnelles, fonctions affines et géométrie plane.",
    doc_type: "EXERCICE",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "BEPC",
    is_free: true,
    year: "2023",
    content: `# ÉPREUVE DE MATHÉMATIQUES — BEPC GUINÉE
**Session : 2023**
**Durée : 2 heures**

---

### PARTIE ALGÉBRIQUE (10 points)

#### EXERCICE 1 (5 points)
On considère les expressions algébriques $A(x)$ et $B(x)$ définies par :
$$A(x) = (2x - 3)^2 - (x+1)^2$$
$$B(x) = (x-4)(3x-2) + (x-4)(x+5)$$

1. **Développement :** Développer, réduire et ordonner $A(x)$ selon les puissances décroissantes de $x$.
2. **Factorisation :** Factoriser $A(x)$ et $B(x)$ sous forme de produit de facteurs du premier degré.
3. **Résolution :** Résoudre dans $\mathbb{R}$ l'équation $A(x) = 0$.

#### ✦ CORRIGÉ PAS À PAS DE KARAMÖ
* **Développement de A(x) :**
  $A(x) = (4x^2 - 12x + 9) - (x^2 + 2x + 1) = 3x^2 - 14x + 8$.
* **Factorisation de A(x) :**
  C'est une différence de deux carrés $a^2 - b^2 = (a-b)(a+b)$ :
  $A(x) = [(2x-3) - (x+1)][(2x-3) + (x+1)] = (x-4)(3x-2)$.
* **Factorisation de B(x) :**
  On met $(x-4)$ en facteur commun :
  $B(x) = (x-4)[(3x-2) + (x+5)] = (x-4)(4x+3)$.
* **Résolution de A(x) = 0 :**
  $(x-4)(3x-2) = 0 \iff x = 4 \quad \text{ou} \quad x = \frac{2}{3}$.
  L'ensemble des solutions est $S = \left\{\frac{2}{3}; 4\right\}$.

---

### PARTIE GÉOMÉTRIQUE (10 points)

Dans un plan muni d'un repère orthonormé $(O, \vec{i}, \vec{j})$, on donne les points $A(1; 2)$, $B(4; 6)$ et $C(-3; 5)$.

1. Placer ces points dans le repère.
2. Calculer les distances $AB$, $AC$ et $BC$. En déduire la nature du triangle $ABC$.
3. Déterminer les coordonnées du point $D$ tel que $\vec{AD} = \vec{BC}$.`
  },
  {
    id: "bepc-physique-2022",
    title: "Sujet BEPC 2022 - Physique & Chimie",
    description: "Épreuve complète de Sciences Physiques et Chimie. Intensité, tension, circuits électriques complexes, oxydoréduction, hydrocarbures et mécanique de base.",
    doc_type: "EXERCICE",
    subject: { id: 2, name: "Physique & Chimie", icon: "Atom" },
    level: "BEPC",
    is_free: true,
    year: "2022",
    content: `# ÉPREUVE DE PHYSIQUE & CHIMIE — BEPC GUINÉE
**Session : 2022**
**Durée : 2 heures**

---

### PARTIE A : CHIMIE (10 points)

1. **Combustion des hydrocarbures :**
   * Écrire l'équation bilan de la combustion complète du butane ($\text{C}_4\text{H}_{10}$) dans le dioxygène ($\text{O}_2$).
   * Quel volume de dioxyde de carbone ($\text{CO}_2$) obtient-on par la combustion complète de $2\text{ moles}$ de butane dans les conditions normales de température et de pression ? (Volume molaire $V_m = 22,4\text{ L/mol}$).

2. **Équilibres chimiques & Solutions :**
   Comment identifier la présence d'ions chlorure ($\text{Cl}^-$) dans une solution aqueuse ? Écrire l'équation de la réaction de précipitation.

#### ✦ CORRIGÉ PRÉVOYANT DE KARAMÖ
* **Équation de combustion complète du butane :**
  $$2\text{C}_4\text{H}_{10} + 13\text{O}_2 \longrightarrow 8\text{CO}_2 + 10\text{H}_2\text{O}$$
* **Calcul du volume de CO2 :**
  D'après l'équation, $2\text{ moles}$ de $\text{C}_4\text{H}_{10}$ produisent $8\text{ moles}$ de $\text{CO}_2$.
  Le volume de $\text{CO}_2$ obtenu est :
  $V_{\text{CO}_2} = n \times V_m = 8\text{ mol} \times 22,4\text{ L/mol} = 179,2\text{ L}$.
* **Identification des ions chlorure :**
  On verse quelques gouttes de nitrate d'argent ($\text{Ag}^+ + \text{NO}_3^-$). Il se forme un précipité blanc de chlorure d'argent ($\text{AgCl}$) qui noircit à la lumière :
  $$\text{Ag}^+ + \text{Cl}^- \longrightarrow \text{AgCl} \downarrow$$

---

### PARTIE B : PHYSIQUE (10 points)

1. **Optique & Lentilles :**
   Une lentille convergente possède une distance focale $f = 5\text{ cm}$. Calculer sa vergence $C$ en dioptries ($\text{D}$).
2. **Mécanique :**
   Un solide de masse $m = 2\text{ kg}$ est posé sur une table horizontale. Calculer l'intensité de son poids $P$ (on donne la constante de pesanteur $g = 10\text{ N/kg}$).`
  },
  {
    id: "cee-cee7-calcul-2023",
    title: "Sujet Entrée en 7ème 2023 - Calcul Écrit",
    description: "Épreuve officielle de Calcul Écrit de l'Examen National de Fin d'Études Primaires (Certificat d'Étude Élémentaire). Opérations numériques, pourcentages et problèmes géométriques.",
    doc_type: "EXERCICE",
    subject: { id: 1, name: "Mathématiques", icon: "Calculator" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2023",
    content: `# ÉPREUVE DE CALCUL ÉCRIT — EXAMEN D'ENTRÉE EN 7ème
**Session : 2023**
**Niveau : Certificat d'Études Élémentaires (Guinée)**

---

### I. OPÉRATIONS (6 points)

Pose et effectue les opérations suivantes :
1. $4\ 587,25 + 965,80$
2. $1\ 258,4 \times 3,5$
3. $7\ 845 \div 12$ (donne le résultat avec deux chiffres après la virgule).

#### ✦ CORRIGÉ SIMPLE DE KARAMÖ
1. **Somme :**
   $4\ 587,25 + 965,80 = 5\ 553,05$
2. **Produit :**
   $1\ 258,4 \times 3,5 = 4\ 404,40$
3. **Division :**
   $7\ 845 \div 12 = 653,75$

---

### II. PROBLÈME PRATIQUE (14 points)

Un agriculteur possède un champ rectangulaire mesurant $120\text{ mètres}$ de longueur et $80\text{ mètres}$ de largeur.

1. **Calcul des dimensions :**
   * Calculer la surface de ce champ en mètres carrés ($m^2$), puis l'exprimer en ares ($a$).
2. **Rendement & Vente :**
   * Il y cultive des cannes à sucre et récolte en moyenne $15\text{ kg}$ de cannes à sucre par mètre carré. Quelle est la masse totale de la récolte en tonnes ?
   * Il vend sa récolte à raison de $5\rm{,}000\text{ GNF}$ le kilogramme. Quel est le montant total obtenu par la vente ?

#### ✦ CORRIGÉ DU PROBLÈME
1. **Surface du champ :**
   * $\text{Aire} = \text{Longueur} \times \text{Largeur} = 120\text{ m} \times 80\text{ m} = 9\rm{,}600\text{ m}^2$.
   * $\text{Aire} = 9\rm{,}600 \div 100 = 96\text{ ares}$.
2. **Masse de la récolte :**
   * $\text{Masse} = 9\rm{,}600\text{ m}^2 \times 15\text{ kg/m}^2 = 144\rm{,}000\text{ kg}$.
   * $\text{Masse} = 144\rm{,}000 \div 1\rm{,}000 = 144\text{ tonnes}$.
3. **Revenu financier :**
   * $\text{Vente} = 144\rm{,}000\text{ kg} \times 5\rm{,}000\text{ GNF} = 720\rm{,}000\rm{,}000\text{ GNF}$ (720 Millions de Francs Guinéens).`
  },
  {
    id: "cee-cee7-redac-2022",
    title: "Sujet Entrée en 7ème 2022 - Rédaction",
    description: "Épreuve officielle de Rédaction de l'Examen d'Entrée en 7ème. Expression de l'esprit narratif et descriptif. Sujet sur l'utilité du reboisement de l'école.",
    doc_type: "EXERCICE",
    subject: { id: 3, name: "Français", icon: "BookMarked" },
    level: "7ème Année (CEE)",
    is_free: true,
    year: "2022",
    content: `# ÉPREUVE DE RÉDACTION — EXAMEN D'ENTRÉE EN 7ème
**Session : 2022**
**Niveau : Primaire (Guinée)**

---

### LE SUJET DE RÉDACTION

> **Sujet :** Durant la semaine de l'environnement, l'école organise une journée de plantation d'arbres. Rédige un texte de 10 à 15 lignes pour raconter le déroulement de cette journée et expliquer pourquoi il est crucial de planter des arbres dans ta communauté.

---

### ✦ GRILLE ET MODÈLE DE CORRIGÉ DE KARAMÖ

1. **L'Introduction :**
   Présenter le cadre (le jour de la semaine, ton école, l'effervescence matinale).
2. **Le Développement :**
   Décrire l'action collective et expliquer l'utilité de l'arbre.
3. **La Conclusion :**
   Un message d'espoir pour l'avenir de ton école.

#### EXEMPLE DE RÉDACTION :

*Le samedi matin, la cour de notre Complexe Scolaire Kharandi s'est animée d'une joie extraordinaire à l'occasion de la Journée Verte. Munis de pelles, d'arrosoirs et de seaux, tous les élèves se sont réunis pour reboiser notre établissement.*

*Sous la direction attentive de nos maîtres, nous avons délicatement mis en terre vingt jeunes manguiers et acacias. En petits groupes solidaires, les uns creusaient le sol meuble tandis que les autres apportaient de l'eau claire pour abreuver la terre. À chaque arbre planté, c'est l'espoir d'un meilleur ombrage futur, de mangues sucrées à partager et surtout d'une bouffée d'oxygène pur pour notre santé commune.*

*En protégeant ces arbres aujourd'hui, nous préparons un avenir plus vert pour notre Guinée. Cette journée inoubliable m'a appris qu'un simple geste protège toute la planète.*`
  }
];
