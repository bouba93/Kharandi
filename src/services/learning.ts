import { api } from "../config/api";
import { FALLBACK_BAC_SUBJECTS } from "../data/fallbackSubjects";

export interface Document {
  id:           string;
  title:        string;
  description:  string;
  doc_type:     "LIVRE" | "COURS" | "EXERCICE" | "CORRECTION" | "VIDEO";
  subject:      { id: number; name: string; icon: string };
  level:        string;
  file_url:     string | null;
  external_url: string | null;
  is_free:      boolean;
  downloads:    number;
  created_at:   string;
  content?:     string;
}

export interface DocumentFilters {
  level?:    string;
  doc_type?: string;
  subject?:  number;
  is_free?:  boolean;
  search?:   string;
  page?:     number;
  page_size?: number;
}

/** Liste paginée des documents avec injection locale sécurisée */
export async function getDocuments(filters: DocumentFilters = {}): Promise<any> {
  const params = { page_size: 100, ...filters };
  let results: any[] = [];
  try {
    const { data } = await api.get("/learning/documents/", { params });
    const raw = data?.data || data;
    if (Array.isArray(raw)) {
      results = raw;
    } else if (Array.isArray(raw?.results)) {
      results = raw.results;
    } else if (Array.isArray(raw?.data?.results)) {
      results = raw.data.results;
    } else if (raw) {
      results = [raw];
    }
  } catch (err) {
    console.error("Failed to fetch documents from API, using fallback:", err);
  }

  // Injecter nos sujets BAC locaux si non déjà présents
  const combined = [...results];
  for (const fallback of FALLBACK_BAC_SUBJECTS) {
    if (!combined.some(item => String(item.id) === String(fallback.id))) {
      combined.push(fallback);
    }
  }

  return combined;
}

/** Détail d'un document (incrémente le compteur de téléchargements) */
export async function getDocument(id: string): Promise<Document> {
  const fallback = FALLBACK_BAC_SUBJECTS.find(item => String(item.id) === String(id));
  if (fallback) {
    return fallback as unknown as Document;
  }
  const { data } = await api.get(`/learning/documents/${id}/`);
  return data?.data || data;
}

/** Liste des matières */
export async function getSubjects() {
  const { data } = await api.get("/learning/subjects/");
  return data?.data?.results || data?.results || data?.data || data;
}
