import { AbacusColumn, DifficultyLevel, MentalSpeed } from './abacus.types';

/**
 * Converts a number to array of AbacusColumns (from left to right, highest digit to units)
 * Example for 6 columns and number 123:
 * Index 0 (100k): 0
 * Index 1 (10k): 0
 * Index 2 (1k): 0
 * Index 3 (100s): 1 -> upper=false, lower=1
 * Index 4 (10s): 2 -> upper=false, lower=2
 * Index 5 (1s): 3 -> upper=false, lower=3
 */
export function numberToAbacusColumns(val: number, colCount: number = 6): AbacusColumn[] {
  const result: AbacusColumn[] = [];
  const safeVal = Math.max(0, Math.floor(val));
  const digits = safeVal.toString().padStart(colCount, '0').slice(-colCount).split('');

  for (let i = 0; i < colCount; i++) {
    const d = parseInt(digits[i], 10) || 0;
    const upperActive = d >= 5;
    const lowerCount = d % 5;
    result.push({ upperActive, lowerCount });
  }

  return result;
}

/**
 * Converts an array of AbacusColumns back to a single integer value.
 */
export function abacusColumnsToNumber(cols: AbacusColumn[]): number {
  let total = 0;
  const len = cols.length;
  for (let i = 0; i < len; i++) {
    const col = cols[i];
    const digitValue = (col.upperActive ? 5 : 0) + col.lowerCount;
    const placeValue = Math.pow(10, len - 1 - i);
    total += digitValue * placeValue;
  }
  return total;
}

export interface GeneratedProblem {
  num1: number;
  num2: number;
  operation: '+' | '-' | '*' | '/';
  expressionText: string;
  expectedResult: number;
  explanation: string;
}

export function generatePracticeProblem(difficulty: DifficultyLevel): GeneratedProblem {
  if (difficulty === 'beginner') {
    const isAddition = Math.random() > 0.3;
    if (isAddition) {
      const num1 = Math.floor(Math.random() * 15) + 1;
      const num2 = Math.floor(Math.random() * (20 - num1)) + 1;
      return {
        num1,
        num2,
        operation: '+',
        expressionText: `${num1} + ${num2}`,
        expectedResult: num1 + num2,
        explanation: `Pour faire ${num1} + ${num2} : Affiche ${num1} sur le boulier, puis ajoute ${num2} perles. Tu obtiens ${num1 + num2}.`
      };
    } else {
      const num1 = Math.floor(Math.random() * 18) + 2;
      const num2 = Math.floor(Math.random() * num1) + 1;
      return {
        num1,
        num2,
        operation: '-',
        expressionText: `${num1} - ${num2}`,
        expectedResult: num1 - num2,
        explanation: `Pour faire ${num1} - ${num2} : Affiche ${num1} sur le boulier, puis enlève ${num2} perles. Tu obtiens ${num1 - num2}.`
      };
    }
  }

  if (difficulty === 'intermediate') {
    const opRand = Math.random();
    if (opRand < 0.6) {
      // Additions 2-3 digits
      const num1 = Math.floor(Math.random() * 450) + 10;
      const num2 = Math.floor(Math.random() * 450) + 10;
      return {
        num1,
        num2,
        operation: '+',
        expressionText: `${num1} + ${num2}`,
        expectedResult: num1 + num2,
        explanation: `Pour additionner ${num1} + ${num2} : Ajoute d'abord les centaines, puis les dizaines et enfin les unités sur chaque colonne.`
      };
    } else {
      // Subtractions 2-3 digits
      const num1 = Math.floor(Math.random() * 800) + 100;
      const num2 = Math.floor(Math.random() * num1) + 10;
      return {
        num1,
        num2,
        operation: '-',
        expressionText: `${num1} - ${num2}`,
        expectedResult: num1 - num2,
        explanation: `Pour soustraire ${num1} - ${num2} : Retire successivement les centaines, dizaines et unités colonne par colonne.`
      };
    }
  }

  // Advanced: Large numbers, multiplication & division
  const opChoice = Math.random();
  if (opChoice < 0.4) {
    // Large addition
    const num1 = Math.floor(Math.random() * 450000) + 1000;
    const num2 = Math.floor(Math.random() * 450000) + 1000;
    return {
      num1,
      num2,
      operation: '+',
      expressionText: `${num1.toLocaleString('fr-FR')} + ${num2.toLocaleString('fr-FR')}`,
      expectedResult: num1 + num2,
      explanation: `Additionne colonne par colonne de gauche à droite sur les 6 tiges du boulier.`
    };
  } else if (opChoice < 0.7) {
    // Multiplication
    const num1 = Math.floor(Math.random() * 95) + 5;
    const num2 = Math.floor(Math.random() * 25) + 2;
    return {
      num1,
      num2,
      operation: '*',
      expressionText: `${num1} × ${num2}`,
      expectedResult: num1 * num2,
      explanation: `Pour multiplier ${num1} par ${num2} : Multiplie les dizaines (${num1 - (num1 % 10)} × ${num2}) puis ajoute les unités (${num1 % 10} × ${num2}).`
    };
  } else {
    // Division with exact integer
    const num2 = Math.floor(Math.random() * 12) + 2;
    const expectedResult = Math.floor(Math.random() * 50) + 5;
    const num1 = num2 * expectedResult;
    return {
      num1,
      num2,
      operation: '/',
      expressionText: `${num1} ÷ ${num2}`,
      expectedResult,
      explanation: `Divise ${num1} par ${num2}. Cherche combien de fois ${num2} rentre dans ${num1}. Résultat : ${expectedResult}.`
    };
  }
}

export interface MentalSequence {
  numbers: number[];
  speedMs: number;
  expectedSum: number;
}

export function generateMentalSequence(difficulty: DifficultyLevel, speed: MentalSpeed): MentalSequence {
  let count = 4;
  let maxVal = 9;
  let allowSubtractions = false;

  if (difficulty === 'beginner') {
    count = 4;
    maxVal = 9;
  } else if (difficulty === 'intermediate') {
    count = 6;
    maxVal = 49;
    allowSubtractions = true;
  } else {
    count = 8;
    maxVal = 99;
    allowSubtractions = true;
  }

  const speedMsMap: Record<MentalSpeed, number> = {
    slow: 1500,
    normal: 1000,
    fast: 600,
  };

  const numbers: number[] = [];
  let currentSum = 0;

  for (let i = 0; i < count; i++) {
    if (i === 0 || !allowSubtractions) {
      const val = Math.floor(Math.random() * maxVal) + 1;
      numbers.push(val);
      currentSum += val;
    } else {
      const isSub = Math.random() > 0.65;
      if (isSub && currentSum > 10) {
        const subVal = Math.floor(Math.random() * Math.min(currentSum - 1, maxVal)) + 1;
        numbers.push(-subVal);
        currentSum -= subVal;
      } else {
        const addVal = Math.floor(Math.random() * maxVal) + 1;
        numbers.push(addVal);
        currentSum += addVal;
      }
    }
  }

  return {
    numbers,
    speedMs: speedMsMap[speed],
    expectedSum: currentSum,
  };
}

/**
 * Web Audio API synth beep for mental calculation flash
 */
export function playFlashBeep(pitch: number = 440) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}
