import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

async function parsePdf(filePath) {
  console.log(`Loading ${filePath}...`);
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse(new Uint8Array(buffer));
  const res = await parser.getText();
  console.log(`Loaded ${filePath}: ${res.total} pages, ${res.text.length} chars.`);
  return res;
}

async function run() {
  try {
    const faRes = await parsePdf('bepc_fa.pdf');
    fs.writeFileSync('bepc_fa_raw.txt', faRes.text);
    console.log('Saved bepc_fa_raw.txt');

    const egRes = await parsePdf('bepc_eg.pdf');
    fs.writeFileSync('bepc_eg_raw.txt', egRes.text);
    console.log('Saved bepc_eg_raw.txt');

    const bacRes = await parsePdf('bac_2026.pdf');
    fs.writeFileSync('bac_2026_raw.txt', bacRes.text);
    console.log('Saved bac_2026_raw.txt');
  } catch (err) {
    console.error('Error in extraction:', err);
  }
}

run();
