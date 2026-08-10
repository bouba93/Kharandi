import fs from 'fs';
import path from 'path';
import { loadCeeResults } from './ceeResults';

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

  loadPromise = new Promise(async (resolve) => {
    try {
      const results: ExamResult[] = [];

      // 1. Load full CEE results from CSV (30,373 records)
      try {
        const ceeRecords = await loadCeeResults();
        for (const r of ceeRecords) {
          results.push({
            ...r,
            exam: 'CEE',
            examTitle: "Examen d'Entrée en 7ème Année (CEE) 2026"
          });
        }
        console.log(`Loaded ${ceeRecords.length} full CEE entries from CSV`);
      } catch (ceeErr) {
        console.error("Error loading CEE CSV results:", ceeErr);
      }

      // 2. Load BEPC & BAC results from JSON datasets
      const dataDir = path.join(process.cwd(), 'data');
      const files = [
        { file: 'results_bepc_fa.json', defaultExam: 'BEPC_FA', title: "BEPC Franco-Arabe 2026" },
        { file: 'results_bepc_eg.json', defaultExam: 'BEPC', title: "BEPC Enseignement Général 2026" },
        { file: 'results_bac_2026.json', defaultExam: 'BAC', title: "Baccalauréat Unique 2026" }
      ];

      for (const item of files) {
        const filePath = path.join(dataDir, item.file);
        if (fs.existsSync(filePath)) {
          try {
            let content = fs.readFileSync(filePath, 'utf-8');
            let parsed: any;
            try {
              parsed = JSON.parse(content);
            } catch (jsonErr) {
              console.warn(`JSON parse error in ${item.file}, attempting auto-repair...`);
              const lastObjEnd = content.lastIndexOf('}');
              if (lastObjEnd !== -1) {
                let repaired = content.substring(0, lastObjEnd + 1).trim();
                if (repaired.endsWith(',')) repaired = repaired.slice(0, -1);
                if (!repaired.endsWith(']')) repaired += ']';
                parsed = JSON.parse(repaired);
                console.log(`Auto-repaired ${item.file} successfully (${parsed.length} items).`);
              } else {
                throw jsonErr;
              }
            }

            if (Array.isArray(parsed)) {
              for (const r of parsed) {
                results.push(r);
              }
              console.log(`Loaded ${parsed.length} entries from ${item.file}`);
            }
          } catch (fileErr) {
            console.error(`Failed to load ${item.file}:`, fileErr);
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

export function cleanNorm(str: string): string {
  return normalizeStr(str)
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function compactNorm(str: string): string {
  return normalizeStr(str).replace(/[^a-z0-9]/g, "");
}

export async function searchExamResultsWithTotal(
  query: string,
  examFilter: string = 'all', // 'all', 'cee', 'bepc', 'bepc_fa', 'bac'
  typeFilter: string = 'all', // 'all', 'pv', 'noms', 'centre', 'dpe'
  limit: number = 100
): Promise<{ results: ExamResult[]; total: number }> {
  const all = await loadAllExamResults();

  const normalizedQuery = normalizeStr(query).trim();
  const cleanQueryParts = cleanNorm(query).split(' ').filter(Boolean);
  const compactQuery = compactNorm(query);

  let filtered = all;

  // 1. Filter by Exam category if requested
  if (examFilter !== 'all') {
    const targetExam = examFilter.toUpperCase();
    filtered = filtered.filter(r => r.exam.toUpperCase() === targetExam);
  }

  if (!query || cleanQueryParts.length === 0) {
    const effectiveLimit = limit <= 0 ? filtered.length : limit;
    return {
      results: filtered.slice(0, effectiveLimit),
      total: filtered.length
    };
  }

  // 2. Filter by search query
  const matched = filtered.filter((r) => {
    const rPvCompact = compactNorm(r.pv);
    const rPvClean = cleanNorm(r.pv);
    const rNomsClean = cleanNorm(r.noms);
    const rCentreClean = cleanNorm(r.centre);
    const rDpeClean = cleanNorm(r.dpe);
    const rOrigineClean = cleanNorm(r.origine);
    const rMentionClean = cleanNorm(r.mention);

    if (typeFilter === 'pv') {
      return rPvCompact === compactQuery || rPvClean.includes(compactQuery);
    }

    if (typeFilter === 'noms') {
      const rNomsCompact = compactNorm(r.noms);
      return cleanQueryParts.every(part => rNomsClean.includes(part) || rNomsCompact.includes(part));
    }

    if (typeFilter === 'centre') {
      return cleanQueryParts.every(part => rCentreClean.includes(part));
    }

    if (typeFilter === 'dpe') {
      return cleanQueryParts.every(part => rDpeClean.includes(part));
    }

    // Default 'all' - multi-field search across all fields
    if (rPvCompact === compactQuery) {
      return true;
    }

    const cleanFull = `${rNomsClean} ${rPvClean} ${rCentreClean} ${rDpeClean} ${rOrigineClean} ${rMentionClean} ${r.exam.toLowerCase()}`;
    const compactFull = compactNorm(r.noms) + rPvCompact + compactNorm(r.centre) + compactNorm(r.dpe) + compactNorm(r.origine);

    return cleanQueryParts.every(part => cleanFull.includes(part) || compactFull.includes(part));
  });

  const effectiveLimit = limit <= 0 ? matched.length : limit;
  return {
    results: matched.slice(0, effectiveLimit),
    total: matched.length
  };
}

export async function searchExamResults(
  query: string,
  examFilter: string = 'all',
  typeFilter: string = 'all',
  limit: number = 100
): Promise<ExamResult[]> {
  const { results } = await searchExamResultsWithTotal(query, examFilter, typeFilter, limit);
  return results;
}

