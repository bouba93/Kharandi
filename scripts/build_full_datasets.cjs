const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const MENTIONS = ['TBIEN', 'BIEN', 'ABIEN', 'PASSABLE', 'EXCELLENT', 'MOYENNE'];

async function processPdf(filePath, examType, examTitle, outputPath) {
  console.log(`Starting parsing ${filePath} for ${examType}...`);
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse(new Uint8Array(buffer));
  const pdfData = await parser.getText();
  const pages = pdfData.pages || [];
  
  const results = [];
  let currentDpeOrOption = '';

  for (let p = 0; p < pages.length; p++) {
    const lines = pages[p].text.split('\n');
    for (let l = 0; l < lines.length; l++) {
      const line = lines[l].trim();
      if (!line) continue;
      
      // Skip header lines
      if (
        line.startsWith('Résultats') ||
        line.startsWith('RESULTATS') ||
        line.startsWith('Page') ||
        line.startsWith('ENSEIGNEMENT') ||
        line.includes('Prénoms et Noms') ||
        line.includes('Options Rang ex') ||
        line.includes('Ire Rang ex')
      ) {
        continue;
      }

      // Match a candidate row using regex:
      // Pattern:
      // (DPE or Option)? (Rang) (ex: X or empty) (Noms, Centre, PV, Origine, Mention)
      // Usually a row contains a PV (digits 1 to 7 chars) and ends with a Mention (BIEN, TBIEN, ABIEN, PASSABLE, etc.)
      
      const words = line.split(/\s+/);
      let foundMention = '';
      let mentionIdx = -1;
      for (let i = words.length - 1; i >= 0; i--) {
        const w = words[i].toUpperCase().replace(/[^A-Z]/g, '');
        if (MENTIONS.includes(w)) {
          foundMention = words[i];
          mentionIdx = i;
          break;
        }
      }

      // Look for PV number (digits)
      let pvIdx = -1;
      for (let i = 0; i < words.length; i++) {
        if (/^\d{1,8}$/.test(words[i])) {
          // ensure it's not the rank (rank is usually 2nd or 3rd element)
          if (i > 1 && (pvIdx === -1 || i > pvIdx)) {
            pvIdx = i;
          }
        }
      }

      if (pvIdx !== -1 && words.length >= 4) {
        let dpe = words[0];
        let rangIdx = 1;
        let ex = '';
        if (words[1] === 'X' || words[1] === 'x') {
          ex = 'X';
          rangIdx = 1;
        } else if (words[2] === 'X' || words[2] === 'x') {
          ex = 'X';
          rangIdx = 1;
        }

        // Check if words[0] is numeric (meaning DPE/Option was inherited from previous line)
        if (/^\d+$/.test(words[0])) {
          dpe = currentDpeOrOption;
          rangIdx = 0;
          if (words[1] === 'X' || words[1] === 'x') {
            ex = 'X';
          }
        } else {
          currentDpeOrOption = dpe;
        }

        const pv = words[pvIdx];
        const rang = words[rangIdx] || '';

        // Extract name, center, origine, mention
        // Tokens between rang/ex and pvIdx are Name + Centre
        // Tokens between pvIdx and mentionIdx (or end) are Origine
        const beforePv = words.slice(ex ? (rangIdx + 2) : (rangIdx + 1), pvIdx);
        const afterPv = mentionIdx !== -1 ? words.slice(pvIdx + 1, mentionIdx) : words.slice(pvIdx + 1);

        // Usually name is first half, center is second half of beforePv
        const fullBefore = beforePv.join(' ');
        const fullAfter = afterPv.join(' ');

        results.push({
          exam: examType,
          examTitle: examTitle,
          dpe: dpe,
          rang: rang,
          ex: ex,
          noms: fullBefore || line,
          centre: fullBefore || dpe,
          pv: pv,
          origine: fullAfter || dpe,
          mention: foundMention || 'ADMIS'
        });
      }
    }
  }

  console.log(`Parsed ${results.length} records for ${examType}. Saving to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Finished ${outputPath}`);
}

async function run() {
  try {
    await processPdf('data/bepc_fa_drive.file', 'BEPC_FA', "BEPC Franco-Arabe 2026", 'data/results_bepc_fa.json');
    await processPdf('data/bepc_eg_drive.file', 'BEPC', "BEPC Enseignement Général 2026", 'data/results_bepc_eg.json');
    await processPdf('data/bac_2026_drive.file', 'BAC', "Baccalauréat Unique 2026", 'data/results_bac_2026.json');
    console.log("ALL DATASETS BUILT SUCCESSFULLY!");
  } catch (err) {
    console.error("Error building datasets:", err);
  }
}

run();
