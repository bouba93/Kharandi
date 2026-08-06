import fs from 'fs';
import path from 'path';

export interface ExamResult {
  exam: 'CEE' | 'BEPC' | 'BEPC_FA' | 'BAC';
  examTitle: string;
  dpe: string;
  rang: string;
  ex: string;
  noms: string;
  centre: string;
  pv: string;
  origine: string;
  mention: string;
}

let allResultsCache: ExamResult[] | null = null;
let loadPromise: Promise<ExamResult[]> | null = null;

export async function loadAllExamResults(): Promise<ExamResult[]> {
  if (allResultsCache) return allResultsCache;
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    try {
      const results: ExamResult[] = [];
      const dataDir = path.join(process.cwd(), 'data');

      const files = [
        { file: 'results_cee.json', defaultExam: 'CEE', title: "CEE 2026 (7ème Année)" },
        { file: 'results_bepc_fa.json', defaultExam: 'BEPC_FA', title: "BEPC Franco-Arabe 2026" },
        { file: 'results_bepc_eg.json', defaultExam: 'BEPC', title: "BEPC Enseignement Général 2026" },
        { file: 'results_bac_2026.json', defaultExam: 'BAC', title: "Baccalauréat Unique 2026" }
      ];

      for (const item of files) {
        const filePath = path.join(dataDir, item.file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            for (const r of parsed) {
              results.push(r);
            }
            console.log(`Loaded ${parsed.length} entries from ${item.file}`);
          }
        } else {
          console.warn(`Dataset missing: ${filePath}`);
        }
      }

      allResultsCache = results;
      console.log(`Total exam results cached in memory: ${results.length}`);
      resolve(results);
    } catch (err) {
      console.error('Error loading exam results:', err);
      resolve([]);
    }
  });

  return loadPromise;
}

export function normalizeStr(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function searchExamResults(
  query: string,
  examFilter: string = 'all', // 'all', 'cee', 'bepc', 'bepc_fa', 'bac'
  typeFilter: string = 'all', // 'all', 'pv', 'noms', 'centre', 'dpe'
  limit: number = 50
): Promise<ExamResult[]> {
  const all = await loadAllExamResults();

  const normalizedQuery = normalizeStr(query);
  const queryParts = normalizedQuery.split(/\s+/).filter(Boolean);

  let filtered = all;

  // 1. Filter by Exam category if requested
  if (examFilter !== 'all') {
    const targetExam = examFilter.toUpperCase();
    filtered = filtered.filter(r => r.exam.toUpperCase() === targetExam);
  }

  if (!query || queryParts.length === 0) {
    return filtered.slice(0, limit);
  }

  // 2. Filter by search query
  const matched = filtered.filter((r) => {
    const pvNorm = normalizeStr(r.pv);

    if (typeFilter === 'pv') {
      return pvNorm === normalizedQuery || pvNorm.includes(normalizedQuery);
    }

    const nomsNorm = normalizeStr(r.noms);
    const centreNorm = normalizeStr(r.centre);
    const dpeNorm = normalizeStr(r.dpe);
    const origineNorm = normalizeStr(r.origine);

    if (typeFilter === 'noms') {
      return queryParts.every(part => nomsNorm.includes(part));
    }

    if (typeFilter === 'centre') {
      return queryParts.every(part => centreNorm.includes(part));
    }

    if (typeFilter === 'dpe') {
      return queryParts.every(part => dpeNorm.includes(part));
    }

    // Default 'all'
    return (
      pvNorm === normalizedQuery ||
      queryParts.every(part => nomsNorm.includes(part)) ||
      queryParts.every(part => centreNorm.includes(part)) ||
      queryParts.every(part => dpeNorm.includes(part)) ||
      queryParts.every(part => origineNorm.includes(part))
    );
  });

  return matched.slice(0, limit);
}
