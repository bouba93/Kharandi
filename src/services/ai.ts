/**
 * services/ai.ts — Karamo AI (Qwen 2.5-VL via OpenRouter)
 */
import { api } from "../config/api";

// ─── Chat texte ────────────────────────────────────────────────────────────
export async function askAI(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  subjectContext?: string,
  subjectId?: string
) {
  const payload: any = { message, history };
  if (subjectContext) payload.subject_context = subjectContext;
  if (subjectId) payload.subject_id = subjectId;
  const { data } = await api.post("/ai/ask/", payload);
  return data?.data || data;
}

// ─── Analyse d'image (photo devoir, schéma) ────────────────────────────────
export async function askAIImage(
  imageOrUrl: File | string,
  question = "Explique et corrige ce document scolaire."
) {
  if (typeof imageOrUrl === "string") {
    const { data } = await api.post("/ai/ask-image/", {
      image_url: imageOrUrl, question,
    });
    return data?.data?.answer || "";
  }
  const fd = new FormData();
  fd.append("image",    imageOrUrl);
  fd.append("question", question);
  const { data } = await api.post("/ai/ask-image/", fd);
  return data?.data?.answer || "";
}

// ─── Générer QCM ───────────────────────────────────────────────────────────
export async function generateQCM(params: {
  subject: string; level: string; topic: string;
  difficulty?: "FACILE" | "MOYEN" | "DIFFICILE";
}) {
  const { data } = await api.post("/ai/generate-qcm/", {
    subject:    params.subject,
    level:      params.level,
    topic:      params.topic,
    difficulty: params.difficulty || "MOYEN",
  });
  const d = data?.data || data;
  return d?.questions || d;
}

// ─── Soumettre QCM ─────────────────────────────────────────────────────────
export async function submitQCM(
  qcmId: string,
  answers: Record<string, number>
) {
  const { data } = await api.post(`/ai/qcm/${qcmId}/submit/`, { answers });
  return data?.data || data;
}

// ─── Statut Karamo ─────────────────────────────────────────────────────────
export async function getAIStatus() {
  const { data } = await api.get("/ai/status/");
  return data?.data || data;
}
