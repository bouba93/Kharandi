import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

export interface CeeResult {
  dpe: string;
  rang: string;
  ex: string;
  noms: string;
  centre: string;
  pv: string;
  origine: string;
  mention: string;
}

let cachedResults: CeeResult[] | null = null;
let loadPromise: Promise<CeeResult[]> | null = null;

export async function loadCeeResults(): Promise<CeeResult[]> {
  if (cachedResults) return cachedResults;
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const results: CeeResult[] = [];
    const csvPath = path.join(process.cwd(), 'public', 'results_cee_2026.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.warn("CEE Results CSV not found at", csvPath);
      resolve([]);
      return;
    }

    const parser = fs.createReadStream(csvPath).pipe(
      parse({
        columns: false,
        skip_empty_lines: true,
        relax_column_count: true,
        relax_quotes: true,
      })
    );

    parser.on('readable', function () {
      let record;
      while ((record = parser.read())) {
        if (record[0] === 'DPE' || record[0].includes('RESULTATS')) continue;
        results.push({
          dpe: record[0] || '',
          rang: record[1] || '',
          ex: record[2] || '',
          noms: record[3] || '',
          centre: record[4] || '',
          pv: record[5] || '',
          origine: record[6] || '',
          mention: record[7] || '',
        });
      }
    });

    parser.on('error', function (err) {
      console.error("Error parsing CEE results:", err.message);
      reject(err);
    });

    parser.on('end', function () {
      console.log('Loaded', results.length, 'CEE results');
      cachedResults = results;
      resolve(results);
    });
  });

  return loadPromise;
}
