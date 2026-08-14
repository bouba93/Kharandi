/**
 * services/chatHistory.ts
 * Stockage et persistance locale des conversations avec le Professeur Karamo.
 * Permet de sauvegarder chaque fil de discussion, de reprendre une session précédente,
 * ou de consulter l'historique de ses questions et révisions.
 */

export interface StoredMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  subjectTitle?: string;
  messages: StoredMessage[];
}

const STORAGE_PREFIX = 'kharandi_karamo_history';
const ACTIVE_SESSION_KEY = 'kharandi_karamo_active_session_id';

function getStorageKey(userId?: string | null): string {
  if (userId) return `${STORAGE_PREFIX}_${userId}`;
  return `${STORAGE_PREFIX}_guest`;
}

/**
 * Récupère la liste de toutes les sessions enregistrées, triées par date décroissante.
 */
export function getStoredSessions(userId?: string | null): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const sessions: ChatSession[] = JSON.parse(raw);
    return Array.isArray(sessions)
      ? sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      : [];
  } catch (err) {
    console.warn('Error reading chat sessions from localStorage:', err);
    return [];
  }
}

/**
 * Récupère une session par son identifiant.
 */
export function getSessionById(sessionId: string, userId?: string | null): ChatSession | null {
  const list = getStoredSessions(userId);
  return list.find(s => s.id === sessionId) || null;
}

/**
 * Sauvegarde ou met à jour une session.
 */
export function saveChatSession(session: ChatSession, userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredSessions(userId);
    const index = list.findIndex(s => s.id === session.id);
    const updated = {
      ...session,
      updatedAt: Date.now(),
      // Ne garder que les messages finaux (non vides)
      messages: session.messages.filter(m => m.content && m.content.trim().length > 0)
    };

    if (index >= 0) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }

    // Limiter l'historique aux 30 dernières discussions pour éviter la saturation du stockage
    const trimmed = list.slice(0, 30);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(trimmed));
  } catch (err) {
    console.warn('Error saving chat session:', err);
  }
}

/**
 * Crée une nouvelle session de discussion.
 */
export function createChatSession(
  title?: string, 
  subjectTitle?: string, 
  userId?: string | null
): ChatSession {
  const newSession: ChatSession = {
    id: 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    title: title || (subjectTitle ? `Sujet : ${subjectTitle}` : 'Nouvelle discussion'),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    subjectTitle: subjectTitle || undefined,
    messages: []
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, newSession.id);
    } catch {}
  }

  saveChatSession(newSession, userId);
  return newSession;
}

/**
 * Supprime une session spécifique.
 */
export function deleteChatSession(sessionId: string, userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredSessions(userId).filter(s => s.id !== sessionId);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(list));
    const active = getActiveSessionId();
    if (active === sessionId) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch (err) {
    console.warn('Error deleting chat session:', err);
  }
}

/**
 * Efface l'intégralité de l'historique des discussions.
 */
export function clearAllChatSessions(userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getStorageKey(userId));
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (err) {
    console.warn('Error clearing chat history:', err);
  }
}

/**
 * Récupère l'ID de la session active courante.
 */
export function getActiveSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Définit l'ID de la session active courante.
 */
export function setActiveSessionId(sessionId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (sessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch {}
}
