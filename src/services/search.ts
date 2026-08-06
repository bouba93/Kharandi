import { api } from "../config/api";

export interface SearchResults {
  documents?: Array<{ id: string; title: string; level: string; doc_type: string; is_free: boolean }>;
  qcm?:       Array<{ id: string; subject: string; topic: string; score: number | null }>;
}

export async function globalSearch(q: string, type: "docs" | "qcm" | "all" = "all", limit = 10) {
  if (q.length < 2) return { documents: [], qcm: [] };
  const { data } = await api.get("/search/", { params: { q, type, limit } });
  return data.data.results as SearchResults;
}
