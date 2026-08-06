export interface QCMQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export const REAL_CEE_QUESTIONS: Record<string, QCMQuestion[]> = {
  "Mathématiques": [
    {
      question: "Un terrain rectangulaire a pour longueur 120 m et pour largeur 80 m. Quelle est l'aire de ce terrain ?",
      options: ["9 600 m²", "400 m²", "960 m²", "200 m²"],
      correct_index: 0,
      explanation: "L'aire d'un rectangle est donnée par la formule : Longueur × largeur. Ici, 120 m × 80 m = 9 600 m²."
    },
    {
      question: "Convertissez 15 kg en grammes :",
      options: ["150 g", "1 500 g", "15 000 g", "150 000 g"],
      correct_index: 2,
      explanation: "1 kg équivaut à 1 000 g. Donc, 15 kg = 15 × 1 000 = 15 000 g."
    },
    {
      question: "Un cycliste parcourt 45 km en 3 heures. Quelle est sa vitesse moyenne ?",
      options: ["15 km/h", "135 km/h", "42 km/h", "12 km/h"],
      correct_index: 0,
      explanation: "Vitesse moyenne = Distance / Temps. Soit 45 km / 3 h = 15 km/h."
    },
    {
      question: "Combien fait la somme des fractions 3/5 et 1/5 ?",
      options: ["4/10", "4/5", "2/5", "3/25"],
      correct_index: 1,
      explanation: "Pour additionner deux fractions ayant le même dénominateur, on additionne leurs numérateurs : 3/5 + 1/5 = 4/5."
    },
    {
      question: "Le périmètre d'un carré mesure 36 cm. Quelle est la longueur d'un côté ?",
      options: ["6 cm", "9 cm", "12 cm", "18 cm"],
      correct_index: 1,
      explanation: "Le périmètre d'un carré est Côté × 4. Donc, la longueur d'un côté est Périmètre / 4 = 36 cm / 4 = 9 cm."
    },
    {
      question: "Calculez l'intérêt annuel produit par un capital de 50 000 GNF placé au taux de 6% :",
      options: ["300 GNF", "3 000 GNF", "5 000 GNF", "30 000 GNF"],
      correct_index: 1,
      explanation: "Intérêt = Capital × Taux = 50 000 × 6 / 100 = 3 000 GNF."
    }
  ],
  "Français": [
    {
      question: "Dans la phrase 'L'élève lit attentivement sa leçon', quelle est la classe grammaticale de 'attentivement' ?",
      options: ["Adjectif qualificatif", "Verbe d'action", "Adverbe de manière", "Nom commun"],
      correct_index: 2,
      explanation: "'Attentivement' est un adverbe de manière qui décrit la façon dont l'élève lit."
    },
    {
      question: "Trouvez le synonyme du mot 'magnifique' :",
      options: ["Laid", "Splendide", "Triste", "Minuscule"],
      correct_index: 1,
      explanation: "Le mot 'splendide' exprime une idée d'éclat et de beauté, synonyme de 'magnifique'."
    },
    {
      question: "Quel est le pluriel du nom 'journal' ?",
      options: ["Journals", "Journaux", "Journauxs", "Journales"],
      correct_index: 1,
      explanation: "En français, la plupart des noms se terminant par '-al' font leur pluriel en '-aux'. On écrit donc des 'journaux'."
    },
    {
      question: "À quel temps de l'indicatif est conjugué le verbe dans : 'Hier, nous fîmes une belle promenade' ?",
      options: ["Passé composé", "Passé simple", "Présent", "Imparfait"],
      correct_index: 1,
      explanation: "'Fîmes' correspond au verbe faire conjugué à la première personne du pluriel du passé simple de l'indicatif."
    },
    {
      question: "Identifiez le sujet dans la phrase : 'Dans la cour jouent les enfants.'",
      options: ["La cour", "Dans la cour", "les enfants", "jouent"],
      correct_index: 2,
      explanation: "Pour trouver le sujet, on pose la question 'Qui est-ce qui joue ?'. Ce sont 'les enfants'."
    }
  ],
  "Histoire-Géographie": [
    {
      question: "Quelle est la capitale officielle de la République de Guinée ?",
      options: ["Labé", "Kankan", "Conakry", "Kindia"],
      correct_index: 2,
      explanation: "Conakry est la capitale politique, administrative et économique de la Guinée."
    },
    {
      question: "Quel fleuve important prend sa source en Guinée, dans le Fouta-Djallon ?",
      options: ["Le fleuve Congo", "Le fleuve Niger", "Le fleuve Sénégal", "Le fleuve Nil"],
      correct_index: 1,
      explanation: "Le Fouta-Djallon en Guinée est appelé 'le château d'eau de l'Afrique de l'Ouest' car plusieurs grands fleuves africains comme le Niger y prennent leur source."
    },
    {
      question: "En quelle année la Guinée a-t-elle obtenu son indépendance nationale ?",
      options: ["1958", "1960", "1962", "1975"],
      correct_index: 0,
      explanation: "La Guinée a proclamé son indépendance le 2 octobre 1958, après avoir voté 'NON' au référendum constitutionnel proposé par la France de Charles de Gaulle."
    },
    {
      question: "Quel est le point culminant (plus haute montagne) de la Guinée ?",
      options: ["Le Mont Nimba", "Le Mont Kakoulima", "Le Mont Loura", "Le Mont Gangan"],
      correct_index: 0,
      explanation: "Le Mont Nimba est le plus haut sommet de Guinée, s'élevant à 1 752 mètres d'altitude, situé en Guinée forestière."
    },
    {
      question: "Quelles sont les quatre régions naturelles de la Guinée ?",
      options: [
        "Basse-Guinée, Moyenne-Guinée, Haute-Guinée, Guinée-Forestière",
        "Conakry, Kindia, Boké, Mamou",
        "Fouta-Djallon, Sahel, Sahara, Côte",
        "Nord, Sud, Est, Ouest"
      ],
      correct_index: 0,
      explanation: "La Guinée est géographiquement divisée en quatre régions naturelles distinctes possédant des climats et reliefs propres."
    }
  ],
  "SVT": [
    {
      question: "Quel organe est responsable de pomper le sang pour assurer sa circulation dans le corps ?",
      options: ["Les poumons", "Le cerveau", "Le cœur", "Les reins"],
      correct_index: 2,
      explanation: "Le cœur est un organe musculaire qui fonctionne comme une pompe aspirante et refoulante pour propulser le sang."
    },
    {
      question: "Quel gaz les feuilles des plantes vertes absorbent-elles pendant la journée (photosynthèse) ?",
      options: ["Le dioxygène", "Le dioxyde de carbone (CO₂)", "Le diazote", "La vapeur d'eau"],
      correct_index: 1,
      explanation: "Pendant la journée, avec la lumière du soleil, la plante consomme du CO₂ ambiant et rejette du dioxygène."
    },
    {
      question: "Combien de canines possède un être humain adulte sur chaque mâchoire ?",
      options: ["2 canines", "4 canines", "6 canines", "8 canines"],
      correct_index: 0,
      explanation: "Un adulte a au total 4 canines : 2 sur la mâchoire supérieure et 2 sur la mâchoire inférieure."
    },
    {
      question: "Quelle maladie se transmet par la piqûre de l'anophèle femelle parasitée ?",
      options: ["La tuberculose", "Le paludisme (Malaria)", "Le choléra", "La dysenterie"],
      correct_index: 1,
      explanation: "La piqûre de l'anophèle femelle transmet le Plasmodium, le parasite responsable de la maladie du paludisme."
    }
  ]
};

export const REAL_BEPC_QUESTIONS: Record<string, QCMQuestion[]> = {
  "Mathématiques": [
    {
      question: "Résolvez dans R l'équation : 3x - 5 = 7. Quelle est la solution ?",
      options: ["x = 4", "x = 2", "x = 12", "x = -4"],
      correct_index: 0,
      explanation: "3x - 5 = 7 => 3x = 7 + 5 => 3x = 12 => x = 12 / 3 = 4."
    },
    {
      question: "Dans un triangle rectangle, l'hypoténuse mesure 5 cm et un côté de l'angle droit mesure 3 cm. Quelle est la longueur de l'autre côté de l'angle droit ?",
      options: ["2 cm", "4 cm", "4.5 cm", "6 cm"],
      correct_index: 1,
      explanation: "Par le théorème de Pythagore : Hyp² = Côté1² + Côté2². Soit 5² = 3² + x² => 25 = 9 + x² => x² = 16 => x = 4 cm."
    },
    {
      question: "Déterminez le coefficient directeur de la droite passant par les points A(1, 2) et B(3, 8) :",
      options: ["a = 2", "a = 3", "a = 4", "a = 5"],
      correct_index: 1,
      explanation: "a = (yB - yA) / (xB - xA) = (8 - 2) / (3 - 1) = 6 / 2 = 3."
    },
    {
      question: "Quelle est la valeur simplifiée de l'expression : √18 + √8 ?",
      options: ["5√2", "√26", "6", "10"],
      correct_index: 0,
      explanation: "√18 = √(9 × 2) = 3√2 et √8 = √(4 × 2) = 2√2. La somme est : 3√2 + 2√2 = 5√2."
    },
    {
      question: "Quel est le degré du polynôme P(x) = (2x - 3)(x² + 4x + 1) ?",
      options: ["Degré 1", "Degré 2", "Degré 3", "Degré 4"],
      correct_index: 2,
      explanation: "Le terme contenant le plus grand exposant est obtenu en multipliant (2x) par (x²), ce qui donne 2x³. Donc le degré est de 3."
    }
  ],
  "Physique": [
    {
      question: "Quelle est l'unité internationale de l'intensité d'une force ?",
      options: ["Le Pascal (Pa)", "Le Joule (J)", "Le Newton (N)", "Le Watt (W)"],
      correct_index: 2,
      explanation: "L'intensité d'une force s'exprime en Newtons (N) dans le Système International."
    },
    {
      question: "Un solide possède une masse de 5 kg. On donne g = 10 N/kg. Quel est l'intensité de son poids P ?",
      options: ["2 N", "15 N", "50 N", "500 N"],
      correct_index: 2,
      explanation: "La relation est P = m × g. Donc, P = 5 kg × 10 N/kg = 50 N."
    },
    {
      question: "Quelle est la vitesse approximative de la lumière dans le vide ?",
      options: ["300 m/s", "300 000 km/s", "1 500 m/s", "30 000 km/s"],
      correct_index: 1,
      explanation: "La lumière voyage à environ 300 000 km par seconde dans le vide (soit 3 × 10⁸ m/s)."
    },
    {
      question: "Quelle loi physique exprime la relation U = R × I ?",
      options: ["La loi de Joule", "La loi d'Ohm", "La loi d'Archimède", "La loi de Mariotte"],
      correct_index: 1,
      explanation: "La loi d'Ohm stipule que la tension U aux bornes d'une résistance est égale au produit de sa résistance R par l'intensité du courant I."
    }
  ],
  "Chimie": [
    {
      question: "Quel est le pH classique d'une solution chimiquement neutre à 25 °C ?",
      options: ["pH = 0", "pH = 7", "pH = 14", "pH = 5.5"],
      correct_index: 1,
      explanation: "À 25 °C, une solution est neutre quand sa concentration en ions H₃O⁺ équivaut à celle en OH⁻, ce qui donne un pH de 7."
    },
    {
      question: "Dans l'équation de combustion du carbone : C + O₂ ➔ CO₂, quels sont les réactifs ?",
      options: ["Uniquement le Carbone", "Uniquement le Dioxyde de carbone", "Le Carbone (C) et le Dioxygène (O₂)", "L'azote et le feu"],
      correct_index: 2,
      explanation: "Les réactifs sont les substances de départ qui réagissent ensemble : ici le carbone et le dioxygène."
    },
    {
      question: "Quelle est la formule chimique brute de l'acide chlorhydrique ?",
      options: ["NaCl", "HCl", "NaOH", "H₂SO₄"],
      correct_index: 1,
      explanation: "L'acide chlorhydrique correspond à une solution de chlorure d'hydrogène dont la formule brute s'écrit HCl."
    },
    {
      question: "Quel précipité blanc noircissant à la lumière obtient-on en versant du nitrate d'argent dans une solution d'ions chlorure ?",
      options: ["L'hydroxyde de fer", "Le chlorure d'argent", "Le chlorure d'indium", "Le sulfate de baryum"],
      correct_index: 1,
      explanation: "L'ion argent (Ag⁺) s'associe à l'ion chlorure (Cl⁻) pour former un précipité de chlorure d'argent (AgCl) blanc insoluble qui noircit au soleil."
    }
  ],
  "Français": [
    {
      question: "Dans l'œuvre classique 'Le Cid' de Pierre Corneille, quel est le nom du personnage principal masculin ?",
      options: ["Don Diègue", "Rodrigue", "Don Gormas", "Don Sanche"],
      correct_index: 1,
      explanation: "Le jeune héros de la pièce, surnommé plus tard 'Le Cid', s'appelle Rodrigue."
    },
    {
      question: "Quelle figure de style consiste à comparer deux choses à l'aide d'un outil de comparaison (comme, tel, semblable à) ?",
      options: ["Une métaphore", "Une comparaison", "Une personnification", "Une hyperbole"],
      correct_index: 1,
      explanation: "La comparaison associe explicitement un comparé et un comparant à l'aide d'un mot de liaison."
    },
    {
      question: "Choisissez l'orthographe correcte du mot représentant le passage ordonné d'un état à un autre :",
      options: ["Développement", "Dévelopement", "Développement", "Developpement"],
      correct_index: 0,
      explanation: "Le mot s'écrit avec un accent aigu sur le premier 'e', deux 'p' et deux 'm' : Développement."
    }
  ],
  "SVT": [
    {
      question: "Quel rôle primordial jouent les globules rouges (hématies) présents dans notre sang ?",
      options: [
        "Défendre l'organisme contre les microbes",
        "Assurer la coagulation lors d'une plaie",
        "Transporter le dioxygène aux différents organes",
        "Réguler la température externe"
      ],
      correct_index: 2,
      explanation: "Les globules rouges contiennent de l'hémoglobine qui fixe l'oxygène dans les poumons pour le diffuser aux cellules."
    },
    {
      question: "Quel organe sécrète principalement l'insuline, hormone stockant le sucre sanguin ?",
      options: ["Le foie", "La thyroïde", "Le pancréas", "L'estomac"],
      correct_index: 2,
      explanation: "L'insuline est sécrétée par les cellules bêta des îlots de Langerhans du pancréas."
    }
  ],
  "Histoire-Géographie": [
    {
      question: "Quelle conférence historique internationale de 1884-1885 a fixé les règles du partage colonial de l'Afrique ?",
      options: ["La Conférence de Paris", "La Conférence de Berlin", "La Conférence de Versailles", "La Conférence de Rome"],
      correct_index: 1,
      explanation: "La Conférence de Berlin convoquée par le chancelier Bismarck a ordonné le découpage et le partage de l'Afrique."
    },
    {
      question: "Qui fut le chef emblématique qui a résisté pendant seize ans à la conquête coloniale française en Guinée ?",
      options: ["L'Almamy Samory Touré", "Alpha Yaya Diallo", "Dinah Salifou", "Mory Beyla"],
      correct_index: 0,
      explanation: "L'Almamy Samory Touré, empereur du Wassoulou, a mené une guérilla tenace contre l'armée française jusqu'à sa capture en 1898."
    }
  ]
};

export const REAL_CULTURE_QUESTIONS: Record<string, QCMQuestion[]> = {
  "Culture Générale": [
    {
      question: "Quelle est la devise nationale de la République de Guinée ?",
      options: ["Travail - Justice - Solidarité", "Unité - Progrès - Justice", "Liberté - Égalité - Fraternité", "Foi - Patrie - Travail"],
      correct_index: 0,
      explanation: "La devise nationale officielle de la Guinée inscrite dans la Constitution est 'Travail - Justice - Solidarité'."
    },
    {
      question: "Quel est l'hymne national de la République de Guinée ?",
      options: ["La Guinéenne", "Liberté", "L'Aube Nouvelle", "Le Mali Koulou"],
      correct_index: 1,
      explanation: "L'hymne national de la Guinée s'intitule 'Liberté', composé par Fodéba Keïta et arrangé sur une mélodie traditionnelle."
    },
    {
      question: "Dans quelle région naturelle se situe la préfecture de Labé ?",
      options: ["Basse-Guinée", "Moyenne-Guinée (Fouta-Djallon)", "Haute-Guinée", "Guinée-Forestière"],
      correct_index: 1,
      explanation: "Labé est la plus grande ville et le chef-lieu administratif de la région de la Moyenne-Guinée (Fouta-Djallon)."
    },
    {
      question: "En quelle année l'Organisation des Nations Unies (ONU) a-t-elle été fondée ?",
      options: ["1918", "1945", "1960", "1989"],
      correct_index: 1,
      explanation: "L'ONU a été créée le 24 octobre 1945 à San Francisco au lendemain de la Seconde Guerre mondiale."
    },
    {
      question: "Quel est le plus grand fleuve du monde par son débit d'eau ?",
      options: ["Le Nil", "Le Mississippi", "L'Amazone", "Le Congo"],
      correct_index: 2,
      explanation: "L'Amazone en Amérique du Sud possède le débit moyen le plus élevé de tous les fleuves de la planète."
    },
    {
      question: "Quel scientifique est célèbre pour avoir développé la théorie de la relativité générale ?",
      options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Marie Curie"],
      correct_index: 1,
      explanation: "Albert Einstein a publié la théorie de la relativité restreinte en 1905 puis générale en 1915."
    }
  ],
  "Histoire-Géographie": [
    {
      question: "Quel souverain du Manden a rédigé la Charte de Kouroukan Fouga au XIIIe siècle ?",
      options: ["Sundiata Keïta", "Sumaoro Kanté", "Kankou Moussa", "Samory Touré"],
      correct_index: 0,
      explanation: "Sundiata Keïta, fondateur de l'Empire du Mali, a promulgué en 1236 la Charte de Kouroukan Fouga, l'une des plus anciennes constitutions au monde."
    },
    {
      question: "Quelle est la monnaie officielle utilisée en République de Guinée ?",
      options: ["Le Franc CFA", "Le Franc Guinéen (GNF)", "L'Éco", "Le Dollar US"],
      correct_index: 1,
      explanation: "Le Franc Guinéen (GNF) est la monnaie nationale officielle créée le 1er mars 1960."
    }
  ],
  "Sciences & Innovation": [
    {
      question: "Quel est le symbole chimique de l'or dans le tableau périodique ?",
      options: ["Ag", "Fe", "Au", "Cu"],
      correct_index: 2,
      explanation: "Le symbole de l'or est Au, venant du latin 'Aurum' signifiant 'aurore' ou 'brillant'."
    },
    {
      question: "Combien de planètes composent le système solaire ?",
      options: ["7 planètes", "8 planètes", "9 planètes", "10 planètes"],
      correct_index: 1,
      explanation: "Le système solaire compte 8 planètes officielles depuis le reclassement de Pluton en planète naine en 2006."
    }
  ]
};

