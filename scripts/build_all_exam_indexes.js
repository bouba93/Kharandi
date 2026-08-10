import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

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

// DPE list for BEPC
const bepcDpes = [
  'BOKE', 'BOFFA', 'FRIA', 'GAOUAL', 'KOUNDARA',
  'KALOUM', 'DIXINN', 'MATAM', 'RATOMA', 'MATOTO', 'CONAKRY',
  'FARANAH', 'DABOLA', 'DINGUIRAYE', 'KISSIDOUGOU',
  'KANKAN', 'KEROUANE', 'KOUROUSSA', 'MANDIANA', 'SIGUIRI',
  'KINDIA', 'COYAH', 'DUBREKA', 'FORECARIAH', 'FORACARIAH', 'TELIMELE',
  'LABE', 'KOUBIA', 'LELOUMA', 'MALI', 'TOUGUE',
  'MAMOU', 'DALABA', 'PITA',
  'NZEREKORE', "N'ZEREKORE", 'BEYLA', 'GUECKEDOU', 'LOLA', 'MACENTA', 'YOMOU'
];

// Options for BAC
const bacOptions = ['SS-FA', 'SE-FA', 'SM-FA', 'SS', 'SE', 'SM', 'A-FA', 'L-FA'];

const mentionsList = ['TBIEN', 'BIEN', 'ABIEN', 'PASSABLE', 'EXCELLENT'];

function parsePdfRawLinesLineStart(filePath, prefixList, examType, defaultExamTitle) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} not found`);
    return [];
  }

  const rawText = fs.readFileSync(filePath, 'utf-8');
  const rawLines = rawText.split('\n').map(l => l.trim());

  // Filter headers / footers
  const cleanLines = rawLines.filter(l => {
    if (!l) return false;
    if (l.startsWith('Résultats') || l.startsWith('RESULTATS') || l.includes('SESSION 2026') || 
        l.includes('ENSEIGNEMENT') || l.includes('Page ') || l.startsWith('-- ') || 
        l.includes('Prénoms et Noms') || l.includes('Options Rang') || l.includes('Ire Rang')) {
      return false;
    }
    return true;
  });

  const escapedPrefixes = prefixList.map(p => p.replace("'", "\\x27"));
  const startRegex = new RegExp('^(' + escapedPrefixes.join('|') + ')\\s+(\\d{1,6})\\s*(X)?\\s+', 'i');

  const rawEntries = [];
  let buffer = [];

  for (const line of cleanLines) {
    if (startRegex.test(line) && buffer.length > 0) {
      rawEntries.push(buffer.join(' '));
      buffer = [];
    }
    buffer.push(line);
  }
  if (buffer.length > 0) {
    rawEntries.push(buffer.join(' '));
  }

  console.log(`[${examType}] Total candidate raw records: ${rawEntries.length}`);

  const results = [];

  for (const entry of rawEntries) {
    let working = entry.trim();

    // 1. Extract Mention
    let mention = 'ADMIS';
    for (const m of mentionsList) {
      if (working.endsWith(m)) {
        mention = m === 'ABIEN' ? 'Assez Bien' : m === 'TBIEN' ? 'Très Bien' : m;
        working = working.slice(0, -m.length).trim();
        break;
      }
    }

    // 2. Match start
    const matchStart = working.match(startRegex);
    if (!matchStart) continue;

    const dpeOrOpt = matchStart[1].trim().toUpperCase();
    const rang = matchStart[2];
    const ex = matchStart[3] || '';
    const rest = working.substring(matchStart[0].length).trim();

    // 3. Find PV (sequence of 3 to 7 digits)
    const pvMatches = [...rest.matchAll(/\b(\d{3,7})\b/g)];
    let pv = '';
    let noms = rest;
    let centre = 'Non spécifié';
    let origine = '';

    if (pvMatches.length > 0) {
      const lastPvMatch = pvMatches[pvMatches.length - 1];
      pv = lastPvMatch[1];
      const pvIdx = rest.lastIndexOf(pv);

      const beforePv = rest.substring(0, pvIdx).trim();
      const afterPv = rest.substring(pvIdx + pv.length).trim();

      origine = afterPv;

      const centreKeywords = [
        'LYCEE', 'COLLEGE', 'GS ', 'GS-', 'FA ', 'CABRAL', 'DITINN', 'DJISSOUMA', 
        'DUCAL', 'DONGHOL', 'SCHOOL', 'COMPLEXE', 'COL ', 'KK-', 'COMMUNAL'
      ];
      let minIdx = -1;
      for (const kw of centreKeywords) {
        const idx = beforePv.indexOf(kw);
        if (idx > 0 && (minIdx === -1 || idx < minIdx)) {
          minIdx = idx;
        }
      }

      if (minIdx > 0) {
        noms = beforePv.substring(0, minIdx).trim();
        centre = beforePv.substring(minIdx).trim();
      } else {
        noms = beforePv;
      }
    }

    results.push({
      exam: examType,
      examTitle: defaultExamTitle,
      dpe: dpeOrOpt,
      rang: rang,
      ex: ex,
      noms: noms,
      centre: centre,
      pv: pv,
      origine: origine || centre,
      mention: mention
    });
  }

  return results;
}

// 2. Process BEPC Franco-Arabe
console.log('--- Processing BEPC Franco-Arabe ---');
const bepcFaResults = parsePdfRawLinesLineStart('bepc_fa_raw.txt', bepcDpes, 'BEPC_FA', "BEPC Franco-Arabe 2026");
console.log(`BEPC Franco-Arabe entries: ${bepcFaResults.length}`);
fs.writeFileSync(path.join(dataDir, 'results_bepc_fa.json'), JSON.stringify(bepcFaResults));

// 3. Process BEPC Enseignement Général
console.log('--- Processing BEPC Enseignement Général ---');
const bepcEgResults = parsePdfRawLinesLineStart('bepc_eg_raw.txt', bepcDpes, 'BEPC', "BEPC Enseignement Général 2026");
console.log(`BEPC General entries: ${bepcEgResults.length}`);
fs.writeFileSync(path.join(dataDir, 'results_bepc_eg.json'), JSON.stringify(bepcEgResults));

// 4. Process BAC 2026
console.log('--- Processing BAC 2026 ---');
const bacResults = parsePdfRawLinesLineStart('bac_2026_raw.txt', bacOptions, 'BAC', "Baccalauréat Unique 2026");
console.log(`BAC entries: ${bacResults.length}`);
fs.writeFileSync(path.join(dataDir, 'results_bac_2026.json'), JSON.stringify(bacResults));

console.log('=== INDEXING COMPLETED SUCCESSFULLY ===');
