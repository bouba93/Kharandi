import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';
import { AbacusBoardProps, AbacusColumn } from './abacus.types';
import { numberToAbacusColumns, abacusColumnsToNumber } from './abacus.engine';

export const AbacusBoard: React.FC<AbacusBoardProps> = ({
  value,
  onChange,
  columns = 6,
  readOnly = false,
  showValue: initialShowValue = true,
  compact = false,
  highlightColumn
}) => {
  const [cols, setCols] = useState<AbacusColumn[]>(() =>
    numberToAbacusColumns(value, columns)
  );
  const [showNumericValue, setShowNumericValue] = useState(initialShowValue);

  // Sync internal state when controlled value prop changes
  useEffect(() => {
    setCols(numberToAbacusColumns(value, columns));
  }, [value, columns]);

  const currentValue = abacusColumnsToNumber(cols);

  const handleUpperBeadClick = (colIdx: number) => {
    if (readOnly) return;
    const newCols = cols.map((c, idx) => {
      if (idx !== colIdx) return c;
      return { ...c, upperActive: !c.upperActive };
    });
    setCols(newCols);
    if (onChange) {
      onChange(abacusColumnsToNumber(newCols));
    }
  };

  const handleLowerBeadClick = (colIdx: number, beadIndex: number) => {
    if (readOnly) return;
    // beadIndex is 0 to 3 (from top to bottom in lower deck)
    const newCols = cols.map((c, idx) => {
      if (idx !== colIdx) return c;
      const currentCount = c.lowerCount;
      // If clicking a bead that is already active (i.e. beadIndex < currentCount)
      // and it's the last active one or above, set lowerCount = beadIndex
      // Otherwise set lowerCount = beadIndex + 1
      let newCount = beadIndex + 1;
      if (beadIndex === currentCount - 1) {
        newCount = beadIndex;
      }
      return { ...c, lowerCount: newCount };
    });
    setCols(newCols);
    if (onChange) {
      onChange(abacusColumnsToNumber(newCols));
    }
  };

  const handleReset = () => {
    if (readOnly) return;
    const resetCols = cols.map(() => ({ upperActive: false, lowerCount: 0 }));
    setCols(resetCols);
    if (onChange) {
      onChange(0);
    }
  };

  // Column headers (Position labels)
  const getColLabel = (indexFromRight: number) => {
    switch (indexFromRight) {
      case 0: return { short: 'U', long: 'Unités' };
      case 1: return { short: 'D', long: 'Dizaines' };
      case 2: return { short: 'C', long: 'Centaines' };
      case 3: return { short: 'M', long: 'Milliers' };
      case 4: return { short: 'DM', long: 'Diz. Milliers' };
      case 5: return { short: 'CM', long: 'Cent. Milliers' };
      default: return { short: `10^${indexFromRight}`, long: `Position ${indexFromRight}` };
    }
  };

  const beadWidth = compact ? 'w-8 sm:w-10' : 'w-10 sm:w-14';
  const beadHeight = compact ? 'h-5 sm:h-6' : 'h-7 sm:h-9';
  const framePadding = compact ? 'p-3' : 'p-4 sm:p-6';

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Top Controls Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          {!readOnly && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              title="Remettre le boulier à zéro"
            >
              <RotateCcw size={14} />
              <span>RAZ</span>
            </button>
          )}
          <button
            onClick={() => setShowNumericValue(!showNumericValue)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            title="Afficher ou masquer la valeur numérique"
          >
            {showNumericValue ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showNumericValue ? 'Masquer valeur' : 'Voir valeur'}</span>
          </button>
        </div>

        {/* Display Current Numeric Value */}
        {showNumericValue && (
          <div className="flex items-center gap-2 bg-[#18bfd6]/10 border border-[#18bfd6]/30 px-4 py-1.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valeur :</span>
            <span className="text-lg sm:text-2xl font-black text-[#18bfd6] tracking-tight">
              {currentValue.toLocaleString('fr-FR')}
            </span>
          </div>
        )}
      </div>

      {/* Main Soroban Abacus Frame */}
      <div className={`relative w-full max-w-2xl bg-gradient-to-b from-[#2a1d17] via-[#3a271d] to-[#1e130d] rounded-[28px] border-4 border-[#5a3a25] shadow-2xl overflow-hidden ${framePadding}`}>
        {/* Inner shadow & metallic corner pins */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-[24px]" />
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#fcb303] border border-amber-800 shadow-inner" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#fcb303] border border-amber-800 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#fcb303] border border-amber-800 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#fcb303] border border-amber-800 shadow-inner" />

        {/* Outer Rod Container */}
        <div className="relative flex justify-around items-stretch gap-1 sm:gap-2 min-h-[260px] sm:min-h-[320px]">

          {/* Central Horizontal Beam (Barre centrale) */}
          <div className="absolute top-[32%] left-0 right-0 h-4 bg-gradient-to-r from-[#18bfd6] via-[#fcb303] to-[#18bfd6] z-10 shadow-md border-y border-amber-900 flex items-center justify-around px-4">
            {/* Unit dots on beam */}
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={`dot-${i}`}
                className={`w-1.5 h-1.5 rounded-full ${
                  (columns - 1 - i) % 3 === 0 ? 'bg-white shadow-sm ring-1 ring-black/30' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Columns */}
          {cols.map((col, colIdx) => {
            const indexFromRight = columns - 1 - colIdx;
            const isHighlighted = highlightColumn === colIdx;
            const digitVal = (col.upperActive ? 5 : 0) + col.lowerCount;

            return (
              <div
                key={`col-${colIdx}`}
                className={`relative flex-1 flex flex-col items-center justify-between rounded-xl py-1 transition-colors ${
                  isHighlighted ? 'bg-amber-400/20 ring-2 ring-[#fcb303]' : ''
                }`}
              >
                {/* Vertical Metal Rod */}
                <div className="absolute top-0 bottom-0 w-1.5 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 rounded-full shadow-inner z-0" />

                {/* Upper Deck (Heaven - 1 bead = 5) */}
                <div className="relative z-10 w-full flex flex-col items-center h-[30%] justify-start pt-1">
                  <motion.button
                    type="button"
                    onClick={() => handleUpperBeadClick(colIdx)}
                    disabled={readOnly}
                    aria-label={`Perle supérieure colonne ${getColLabel(indexFromRight).long}`}
                    animate={{ y: col.upperActive ? (compact ? 28 : 36) : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`${beadWidth} ${beadHeight} rounded-full bg-gradient-to-b ${
                      col.upperActive
                        ? 'from-[#fcb303] via-[#e59b02] to-[#b27700] border-amber-300 shadow-lg scale-105'
                        : 'from-[#18bfd6] via-[#14a3b7] to-[#0f7e8e] border-cyan-200 shadow-md'
                    } border-2 flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 transition-all`}
                  >
                    <span className="text-[10px] sm:text-xs font-black text-white drop-shadow-xs">5</span>
                  </motion.button>
                </div>

                {/* Spacer for central beam */}
                <div className="h-4 z-20" />

                {/* Lower Deck (Earth - 4 beads = 1 each) */}
                <div className="relative z-10 w-full flex flex-col items-center h-[62%] justify-end pb-1 gap-1">
                  {[0, 1, 2, 3].map((beadIdx) => {
                    const isActive = beadIdx < col.lowerCount;
                    // Lower active beads slide UP toward beam
                    const activeOffsetY = compact ? -22 : -30;

                    return (
                      <motion.button
                        key={`lower-${colIdx}-${beadIdx}`}
                        type="button"
                        onClick={() => handleLowerBeadClick(colIdx, beadIdx)}
                        disabled={readOnly}
                        aria-label={`Perle inférieure ${beadIdx + 1} colonne ${getColLabel(indexFromRight).long}`}
                        animate={{ y: isActive ? activeOffsetY : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`${beadWidth} ${beadHeight} rounded-full bg-gradient-to-b ${
                          isActive
                            ? 'from-[#fcb303] via-[#e59b02] to-[#b27700] border-amber-300 shadow-lg scale-105'
                            : 'from-amber-100 via-amber-200 to-amber-300 border-amber-400/60 shadow-sm'
                        } border-2 flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 transition-all`}
                      >
                        <span className={`text-[10px] sm:text-xs font-black ${isActive ? 'text-white' : 'text-amber-800'}`}>
                          1
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Column Digit Indicator at Bottom of Frame */}
                <div className="z-20 mt-2 flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs font-black text-white/90 bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                    {digitVal}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-300/80 uppercase tracking-wider mt-0.5">
                    {getColLabel(indexFromRight).short}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
