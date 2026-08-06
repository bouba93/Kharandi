import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Ensure root data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Process CEE CSV
console.log('--- Processing CEE 2026 ---');
const ceeCsvPath = path.join(process.cwd(), 'public', 'results_cee_2026.csv');
let ceeResults = [];
if (fs.existsSync(ceeCsvPath)) {
  const content = fs.readFileSync(ceeCsvPath, 'utf-8');
  const records = parse(content, {
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true
  });
  
  for (const record of records) {
    if (record[0] === 'DPE' || record[0]?.includes('RESULTATS')) continue;
    ceeResults.push({
      exam: 'CEE',
      examTitle: "Examen d'Entrée en 7ème Année (CEE) 2026",
      dpe: record[0] || '',
      rang: record[1] || '',
      ex: record[2] || '',
      noms: record[3] || '',
      centre: record[4] || '',
      pv: record[5] || '',
      origine: record[6] || '',
      mention: record[7] || 'ADMIS'
    });
  }
}
console.log(`CEE entries: ${ceeResults.length}`);
fs.writeFileSync(path.join(dataDir, 'results_cee.json'), JSON.stringify(ceeResults));

// Helper for parsing raw text lines from PDF extractions
function parsePdfRawLines(filePath, examType, defaultExamTitle) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} not found`);
    return [];
  }
  const rawText = fs.readFileSync(filePath, 'utf-8');
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const records = [];

  const mentions = ['TBIEN', 'BIEN', 'ABIEN', 'PASSABLE', 'EXCELLENT'];

  for (const line of lines) {
    if (
      line.startsWith('Résultats') || 
      line.startsWith('RESULTATS') || 
      line.includes('SESSION 2026') || 
      line.includes('Page ') || 
      line.startsWith('-- ') || 
      line.includes('Prénoms et Noms')
    ) {
      continue;
    }

    // Try extracting mention at the end
    let mention = 'ADMIS';
    let workingLine = line;

    for (const m of mentions) {
      if (workingLine.endsWith(m)) {
        mention = m === 'ABIEN' ? 'Assez Bien' : m === 'TBIEN' ? 'Très Bien' : m;
        workingLine = workingLine.slice(0, -m.length).trim();
        break;
      }
    }

    // Match numbers and text patterns
    // e.g., "MAMOU 1 MARIAMA BAH LYCEE FETO 1967 HADJA FTA BTA BALDE"
    // or "SS-FA 1 DAOUDA CAMARA KK-IV-MATOTO 3074 HADJAKANINGBESIDIBE"
    // Find PV (usually 3 to 6 digits)
    const pvMatch = workingLine.match(/\b(\d{3,7})\b/);
    if (!pvMatch) continue;

    const pv = pvMatch[1];
    const pvIndex = workingLine.lastIndexOf(pv);
    const beforePv = workingLine.substring(0, pvIndex).trim();
    const afterPv = workingLine.substring(pvIndex + pv.length).trim();

    // Parse beforePv: [Region/DPE or Option] [Rang] [ex] [Noms...] [Centre...]
    // Find the first numbers which indicate the Rang
    const rangMatch = beforePv.match(/^([A-Za-z0-9\/-]+)?\s*(\d+)\s*(X)?\s*(.+)$/);
    
    let dpeOrOption = '';
    let rang = '';
    let ex = '';
    let restBeforePv = beforePv;

    if (rangMatch) {
      dpeOrOption = rangMatch[1] || '';
      rang = rangMatch[2] || '';
      ex = rangMatch[3] || '';
      restBeforePv = rangMatch[4] || '';
    }

    // Rest before PV contains Nom and Centre. Often Centre starts with LYCEE, COLLEGE, GS, FA, CABRAL, etc. or is capitalized
    // Let's use a heuristic for Nom vs Centre
    let noms = restBeforePv;
    let centre = 'Non spécifié';

    const centreKeywords = ['LYCEE', 'COLLEGE', 'GS', 'FA ', 'CABRAL', 'DITINN', 'DJISSOUMA', 'DUCAL', 'DONGHOL', 'SCHOOL', 'COMPLEXE'];
    let minCentreIdx = -1;
    let foundKw = '';

    for (const kw of centreKeywords) {
      const idx = restBeforePv.indexOf(kw);
      if (idx > 0 && (minCentreIdx === -1 || idx < minCentreIdx)) {
        minCentreIdx = idx;
        foundKw = kw;
      }
    }

    if (minCentreIdx > 0) {
      noms = restBeforePv.substring(0, minCentreIdx).trim();
      centre = restBeforePv.substring(minCentreIdx).trim();
    }

    records.push({
      exam: examType,
      examTitle: defaultExamTitle,
      dpe: dpeOrOption,
      rang: rang,
      ex: ex,
      noms: noms,
      centre: centre,
      pv: pv,
      origine: afterPv || centre,
      mention: mention
    });
  }

  return records;
}

// 2. Process BEPC Franco-Arabe
console.log('--- Processing BEPC Franco-Arabe ---');
const bepcFaResults = parsePdfRawLines('bepc_fa_raw.txt', 'BEPC_FA', "BEPC Franco-Arabe 2026");
console.log(`BEPC Franco-Arabe entries: ${bepcFaResults.length}`);
fs.writeFileSync(path.join(dataDir, 'results_bepc_fa.json'), JSON.stringify(bepcFaResults));

// 3. Process BEPC Enseignement Général
console.log('--- Processing BEPC Enseignement Général ---');
const bepcEgResults = parsePdfRawLines('bepc_eg_raw.txt', 'BEPC', "BEPC Enseignement Général 2026");
console.log(`BEPC General entries: ${bepcEgResults.length}`);
fs.writeFileSync(path.join(dataDir, 'results_bepc_eg.json'), JSON.stringify(bepcEgResults));

// 4. Process BAC 2026
console.log('--- Processing BAC 2026 ---');
const bacResults = parsePdfRawLines('bac_2026_raw.txt', 'BAC', "Baccalauréat Unique 2026");
console.log(`BAC entries: ${bacResults.length}`);
fs.writeFileSync(path.join(dataDir, 'results_bac_2026.json'), JSON.stringify(bacResults));

console.log('=== INDEXING COMPLETED SUCCESSFULLY ===');
