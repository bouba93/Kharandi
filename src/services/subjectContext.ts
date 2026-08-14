/**
 * services/subjectContext.ts
 * Gestion centralisée du sujet actuellement sélectionné par l'élève.
 * Permet à l'IA Professeur Karamo de recevoir l'intégralité du sujet
 * (titre, année, matière, niveau, énoncé complet, questions et corrigé)
 * dès qu'une question relative à "ce sujet" ou "cet exercice" est posée.
 */

export interface ActiveSubjectData {
  id?: string;
  title: string;
  year?: string;
  subject?: string;
  level?: string;
  series?: string;
  country?: string;
  institution?: string;
  description?: string;
  content: string; // Énoncé intégral, questions/exercices et corrigé s'il existe
}

const STORAGE_KEY = 'kharandi_active_subject';
const EVENT_NAME = 'kharandi_active_subject_changed';

let inMemorySubject: ActiveSubjectData | null = null;

/**
 * Définit le sujet actuellement sélectionné et notifie l'application.
 */
export function setActiveSubject(subject: ActiveSubjectData | null): void {
  inMemorySubject = subject;
  try {
    if (subject) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(subject));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subject));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Unable to persist active subject to storage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: subject }));
  }
}

/**
 * Récupère le sujet actuellement actif (mémoire ou stockage).
 */
export function getActiveSubject(): ActiveSubjectData | null {
  if (inMemorySubject) return inMemorySubject;

  if (typeof window !== 'undefined') {
    try {
      const rawSession = sessionStorage.getItem(STORAGE_KEY);
      if (rawSession) {
        inMemorySubject = JSON.parse(rawSession);
        return inMemorySubject;
      }
      const rawLocal = localStorage.getItem(STORAGE_KEY);
      if (rawLocal) {
        inMemorySubject = JSON.parse(rawLocal);
        return inMemorySubject;
      }
    } catch (err) {
      console.warn('Error reading active subject from storage:', err);
    }
  }
  return null;
}

/**
 * Efface le sujet sélectionné.
 */
export function clearActiveSubject(): void {
  setActiveSubject(null);
}

/**
 * Extrait les données structurées d'un document ou chapitre pour le contexte Karamo.
 */
export function extractSubjectFromDocument(doc: any): ActiveSubjectData | null {
  if (!doc) return null;

  const title = doc.title || 'Sujet d\'examen';
  const content = doc.content || doc.description || '';
  const subjectName = typeof doc.subject === 'object' ? (doc.subject?.name || 'Matière') : (doc.subject || 'Matière');
  const year = doc.year || (title.match(/\b(19\d\d|20\d\d)\b/)?.[0] || 'Session officielle');
  const level = doc.level || doc.series || (title.includes('BAC') ? 'BAC' : (title.includes('BEPC') ? 'BEPC' : 'Général'));

  return {
    id: String(doc.id || ''),
    title,
    year: String(year),
    subject: String(subjectName),
    level: String(level),
    series: doc.series || undefined,
    country: doc.country || 'Guinée',
    institution: doc.institution || 'Ministère de l\'Éducation Nationale (Guinée)',
    description: doc.description || undefined,
    content: content.trim(),
  };
}

/**
 * Construit le prompt enrichi envoyé à l'API IA (Karamo).
 * Transmet l'énoncé complet, les questions et le corrigé pour que Karamo
 * comprenne immédiatement que "ce sujet" désigne le sujet sélectionné.
 */
export function buildKaramoPrompt(userMessage: string, subject: ActiveSubjectData | null = null): string {
  const current = subject || getActiveSubject();

  if (!current || !current.content) {
    return userMessage;
  }

  const subjectHeader = [
    `• Titre de l'épreuve : ${current.title}`,
    current.year ? `• Année de session : ${current.year}` : '',
    current.subject ? `• Matière : ${current.subject}` : '',
    current.level ? `• Niveau / Série : ${current.level}` : '',
    current.country ? `• Pays / Système : ${current.country}` : '',
    current.institution ? `• Organisme : ${current.institution}` : '',
  ].filter(Boolean).join('\n');

  return `════════════════════════════════════════════════════════════════════════════════
[CONTEXTE SCOLAIRE — SUJET SÉLECTIONNÉ PAR L'ÉLÈVE]
${subjectHeader}

--- CONTENU INTÉGRAL DU SUJET (ÉNONCÉ, QUESTIONS, EXERCICES & CORRIGÉ DISPONIBLE) ---
${current.content}
--------------------------------------------------------------------------------

[DIRECTIVES STRICTES POUR PROFESSEUR KARAMO]
Tu es le Professeur Karamo, tuteur virtuel d'excellence pour le programme scolaire guinéen (BAC, BEPC, CEE).
L'élève travaille actuellement sur CE SUJET PRÉCIS affiché ci-dessus.

RÈGLES D'INTERPRÉTATION :
1. Quand l'élève utilise des expressions telles que :
   - « Explique ce sujet »
   - « Résous ce sujet »
   - « Corrige ce sujet »
   - « Explique l'exercice 2 » (ou tout autre exercice / question / partie)
   - « Donne-moi des indices »
   - « Quelles sont les formules clés ? »
   « CE SUJET » et « CET EXERCICE » désignent EXCLUSIVEMENT le sujet et les exercices fournis ci-dessus dans ce prompt.
2. Ne recherche PAS un autre sujet dans ta base de connaissances générale et ne demande pas de quel sujet il s'agit : TU DISPOSES DE TOUT L'ÉNONCÉ CI-DESSUS.
3. Réponds de manière très pédagogique, claire, étape par étape, avec les démonstrations requises, les formules mathématiques/scientifiques au format LaTeX ($...$) et les conseils méthodologiques officiels de la Guinée.
════════════════════════════════════════════════════════════════════════════════

Demande / Question de l'élève :
${userMessage}`;
}
