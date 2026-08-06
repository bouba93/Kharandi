import { AbacusLesson, AbacusBadge } from './abacus.types';

export const INITIAL_LESSONS: AbacusLesson[] = [
  // Niveau 1 — Découvrir le boulier
  {
    id: 'l1_1',
    level: 1,
    title: 'Les perles du haut et du bas',
    subtitle: 'Reconnaître la valeur des perles',
    goal: 'Apprendre à lire une perle supérieure (5) et une perle inférieure (1)',
    explanation: 'Sur un boulier Soroban, la perle du haut vaut 5 lorsqu’elle descend vers la barre centrale. Les 4 perles du bas valent 1 chacune lorsqu’elles montent vers la barre.',
    demoValue: 5,
    targetValue: 5,
    hint: 'Fais descendre la perle du haut sur la colonne de droite (unités) pour afficher 5.'
  },
  {
    id: 'l1_2',
    level: 1,
    title: 'Représenter les chiffres de 0 à 9',
    subtitle: 'Les unités fondamentales',
    goal: 'Savoir composer tous les chiffres simples de 0 à 9',
    explanation: 'Pour faire 7 : fais descendre la perle du haut (5) et monte 2 perles du bas (1 + 1). Total = 5 + 2 = 7.',
    demoValue: 7,
    targetValue: 7,
    hint: 'Active 1 perle en haut (5) et 2 perles en bas (2) sur la première tige à droite.'
  },

  // Niveau 2 — Construire les nombres
  {
    id: 'l2_1',
    level: 2,
    title: 'Les dizaines et les unités (12)',
    subtitle: 'Passer à deux colonnes',
    goal: 'Apprendre à utiliser la colonne des dizaines',
    explanation: 'La 2ème colonne à partir de la droite représente les dizaines. Pour faire 12 : monte 1 perle du bas sur les dizaines, et 2 perles du bas sur les unités.',
    demoValue: 12,
    targetValue: 12,
    hint: 'Mets 1 sur la colonne des dizaines et 2 sur la colonne des unités.'
  },
  {
    id: 'l2_2',
    level: 2,
    title: 'Composer le nombre 25',
    subtitle: 'Associer dizaines et perle de 5',
    goal: 'Former le nombre 25 sur le boulier',
    explanation: 'Pour 25 : place 2 perles du bas sur les dizaines (20), et fais descendre la perle du haut sur les unités (5).',
    demoValue: 25,
    targetValue: 25,
    hint: '2 sur les dizaines et 5 sur les unités.'
  },
  {
    id: 'l2_3',
    level: 2,
    title: 'Composer le nombre 47',
    subtitle: 'Perles du haut et du bas combinées',
    goal: 'Former le nombre 47',
    explanation: 'Pour 47 : place 4 perles du bas sur les dizaines (40). Sur les unités, active la perle du haut (5) + 2 perles du bas (2) = 7.',
    demoValue: 47,
    targetValue: 47,
    hint: '4 dizaines et 7 unités (5 + 2).'
  },
  {
    id: 'l2_4',
    level: 2,
    title: 'Représenter 63 et 99',
    subtitle: 'Capacité maximale sur deux tiges',
    goal: 'Former le nombre maximal à 2 chiffres : 99',
    explanation: 'Pour 99 : active toutes les perles (5 + 4 = 9) sur les dizaines, et toutes les perles (5 + 4 = 9) sur les unités.',
    demoValue: 99,
    targetValue: 99,
    hint: 'Active toutes les perles sur les deux premières tiges de droite.'
  },

  // Niveau 3 — Additions simples
  {
    id: 'l3_1',
    level: 3,
    title: 'Addition simple sans retenue (2 + 3)',
    subtitle: 'Ajouter directement des perles',
    goal: 'Calculer 2 + 3 = 5',
    explanation: 'Affiche 2 perles du bas. Pour ajouter 3, retire les 2 perles du bas et abaisse la perle du haut (5).',
    demoValue: 2,
    targetValue: 5,
    operationText: '2 + 3',
    hint: 'Forme le résultat final : 5 sur les unités.'
  },
  {
    id: 'l3_2',
    level: 3,
    title: 'Addition avec dizaines (10 + 4)',
    subtitle: 'Addition sur colonnes séparées',
    goal: 'Calculer 10 + 4 = 14',
    explanation: 'Affiche 10 (1 dizaine). Ajoute 4 sur les unités. Le résultat obtenu est 14.',
    demoValue: 10,
    targetValue: 14,
    operationText: '10 + 4',
    hint: 'Positionne 1 sur les dizaines et 4 sur les unités.'
  },
  {
    id: 'l3_3',
    level: 3,
    title: 'Addition directe (21 + 6)',
    subtitle: 'Combiner dizaines et perle de 5',
    goal: 'Calculer 21 + 6 = 27',
    explanation: 'Affiche 21. Pour ajouter 6 aux unités : abaisse la perle de 5 et monte 1 perle de 1. Tu obtiens 27.',
    demoValue: 21,
    targetValue: 27,
    operationText: '21 + 6',
    hint: 'Mets 2 sur les dizaines et 7 sur les unités.'
  },

  // Niveau 4 — Additions avec passage
  {
    id: 'l4_1',
    level: 4,
    title: 'Compléments à 5 (+4 = +5 -1)',
    subtitle: 'Passage par la quinzaine',
    goal: 'Utiliser les compléments de 5',
    explanation: 'Si tu as 2 et veux ajouter 4 : il n’y a plus assez de perles en bas. Ajoute 5 (baisse perle du haut) et enlève 1 en bas. 2 + 4 = 6.',
    demoValue: 2,
    targetValue: 6,
    operationText: '2 + 4',
    hint: 'Affiche le résultat final 6.'
  },
  {
    id: 'l4_2',
    level: 4,
    title: 'Compléments à 10 (+8 = +10 -2)',
    subtitle: 'Changement de colonne (retenue)',
    goal: 'Ajouter avec retenue sur la dizaine',
    explanation: 'Pour 7 + 8 : ajoute 1 dizaine (+10) et retire 2 unités (-2). 7 + 8 = 15.',
    demoValue: 7,
    targetValue: 15,
    operationText: '7 + 8',
    hint: 'Affiche 15 (1 dizaine et 5 unités).'
  },

  // Niveau 5 — Soustractions
  {
    id: 'l5_1',
    level: 5,
    title: 'Soustraction simple (9 - 4)',
    subtitle: 'Retirer des perles',
    goal: 'Calculer 9 - 4 = 5',
    explanation: 'Affiche 9 (5 + 4). Pour enlever 4, baisse les 4 perles du bas. Il reste la perle du haut (5).',
    demoValue: 9,
    targetValue: 5,
    operationText: '9 - 4',
    hint: 'Retire les perles du bas pour laisser seulement 5.'
  },
  {
    id: 'l5_2',
    level: 5,
    title: 'Soustraction avec emprunt (15 - 7)',
    subtitle: 'Emprunter sur la dizaine',
    goal: 'Calculer 15 - 7 = 8',
    explanation: 'Affiche 15. Pour enlever 7 : enlève 1 dizaine (-10) et rajoute 3 aux unités (+3). 15 - 7 = 8.',
    demoValue: 15,
    targetValue: 8,
    operationText: '15 - 7',
    hint: 'Forme 8 sur la colonne des unités.'
  }
];

export const ALL_BADGES: AbacusBadge[] = [
  {
    id: 'first_bead',
    title: 'Première perle',
    description: 'A accompli son tout premier exercice de boulier',
    icon: '✨',
    unlocked: false
  },
  {
    id: 'ten_correct',
    title: '10 bonnes réponses',
    description: 'A accumulé 10 réponses exactes en entraînement',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'master_units',
    title: 'Maître des unités',
    description: 'A complété toutes les leçons du Niveau 1',
    icon: '🥇',
    unlocked: false
  },
  {
    id: 'champion_tens',
    title: 'Champion des dizaines',
    description: 'A complété toutes les leçons du Niveau 2',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'streak_5',
    title: 'Série de 5',
    description: 'A réussi 5 bonnes réponses consécutives',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'lightning_calc',
    title: 'Calculateur éclair',
    description: 'A résolu un exercice en moins de 5 secondes',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'mental_abacus',
    title: 'Boulier mental',
    description: 'A réussi sa première série en mode calcul mental',
    icon: '🧠',
    unlocked: false
  }
];
