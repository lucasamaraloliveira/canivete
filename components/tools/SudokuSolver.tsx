import React, { useState, useCallback, useMemo } from 'react';
import { Grid, Eraser, Play, RefreshCcw, Check, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

type CellValue = number | null;
type GridType = CellValue[][];

export function SudokuSolver() {
    const [grid, setGrid] = useState<GridType>(() =>
        Array(9).fill(null).map(() => Array(9).fill(null))
    );
    const [isSolving, setIsSolving] = useState(false);
    const [solved, setSolved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid = (grid: GridType, r: number, c: number, n: number) => {
        for (let i = 0; i < 9; i++) {
            if (grid[r][i] === n || grid[i][c] === n) return false;
        }
        const rr = Math.floor(r / 3) * 3;
        const cc = Math.floor(c / 3) * 3;
        for (let i = rr; i < rr + 3; i++) {
            for (let j = cc; j < cc + 3; j++) {
                if (grid[i][j] === n) return false;
            }
        }
        return true;
    };

    const solveSudokuRecursive = (g: GridType): boolean => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (g[r][c] === null) {
                    for (let n = 1; n <= 9; n++) {
                        if (isValid(g, r, c, n)) {
                            g[r][c] = n;
                            if (solveSudokuRecursive(g)) return true;
                            g[r][c] = null;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const handleSolve = () => {
        setIsSolving(true);
        setError(null);
        const newGrid = grid.map(row => [...row]);

        // Check initial validity
        let isInitiallyValid = true;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] !== null) {
                    const val = grid[r][c]!;
                    newGrid[r][c] = null;
                    if (!isValid(newGrid, r, c, val)) isInitiallyValid = false;
                    newGrid[r][c] = val;
                }
            }
        }

        if (!isInitiallyValid) {
            setError("Tabuleiro contém conflitos iniciais!");
            setIsSolving(false);
            return;
        }

        const start = performance.now();
        if (solveSudokuRecursive(newGrid)) {
            setGrid(newGrid);
            setSolved(true);
        } else {
            setError("Não há solução para este tabuleiro.");
        }
        setIsSolving(false);
    };

    const updateCell = (r: number, c: number, val: string) => {
        const num = val === '' ? null : parseInt(val);
        if (num !== null && (isNaN(num) || num < 1 || num > 9)) return;
        const newGrid = grid.map(row => [...row]);
        newGrid[r][c] = num;
        setGrid(newGrid);
        setSolved(false);
        setError(null);
    };

    const resetGrid = () => {
        setGrid(Array(9).fill(null).map(() => Array(9).fill(null)));
        setSolved(false);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center gap-8 p-6 max-w-4xl mx-auto h-full">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-text-main/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-text-main">
                    <Grid size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main leading-none">Sudoku Solver</h2>
                <p className="text-sm opacity-50 font-medium tracking-tight">Resolva qualquer tabuleiro em milissegundos</p>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                {/* Sudoku Grid */}
                <div className="bg-card-main dark:bg-[#0D0D0D]/40 p-4 rounded-[32px] border border-border-main shadow-2xl backdrop-blur-xl relative group">
                    <div className="grid grid-cols-9 border-2 border-text-main/20 bg-text-main/5 p-px">
                        {grid.map((row, r) =>
                            row.map((cell, c) => (
                                <input
                                    key={`${r}-${c}`}
                                    type="text"
                                    maxLength={1}
                                    value={cell === null ? '' : cell}
                                    onChange={(e) => updateCell(r, c, e.target.value)}
                                    className={cn(
                                        "w-10 h-10 md:w-12 md:h-12 text-center text-xl font-bold transition-all outline-none border border-text-main/10",
                                        "bg-transparent focus:bg-text-main/10 focus:ring-1 focus:ring-text-main/20",
                                        (c + 1) % 3 === 0 && c < 8 && "border-r-4 border-r-text-main/20",
                                        (r + 1) % 3 === 0 && r < 8 && "border-b-4 border-b-text-main/20",
                                        solved && cell !== null && "text-green-500",
                                        error && "text-red-500 border-red-500/20"
                                    )}
                                    disabled={isSolving}
                                />
                            ))
                        )}
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute -bottom-16 left-0 right-0 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Bug size={14} /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Panel */}
                <div className="flex-1 space-y-6 w-full">
                    <div className="bg-text-main/5 p-6 rounded-[32px] border border-border-main space-y-6 shadow-sm">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] opacity-30 text-text-main">Ações</h4>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSolve}
                                disabled={isSolving || solved}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all",
                                    solved
                                        ? "bg-green-500 text-white opacity-50 cursor-not-allowed"
                                        : "bg-text-main text-bg-main hover:opacity-90 active:scale-95"
                                )}
                            >
                                {isSolving ? <RefreshCcw className="animate-spin" /> : solved ? <Check /> : <Zap size={18} />}
                                {isSolving ? "RESOLVENDO..." : solved ? "RESOLVIDO" : "RESOLVER AGORA"}
                            </button>

                            <button
                                onClick={resetGrid}
                                className="w-full py-4 bg-text-main/5 hover:bg-red-500/10 hover:text-red-500 border border-border-main rounded-2xl font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95"
                            >
                                <Eraser size={18} /> LIMPAR TUDO
                            </button>
                        </div>
                    </div>

                    <div className="bg-text-main/5 p-6 rounded-[32px] border border-border-main space-y-4">
                        <h4 className="font-black text-xs uppercase tracking-widest opacity-30 text-text-main">Como Usar</h4>
                        <ul className="space-y-3">
                            {[
                                "Insira os números conhecidos do tabuleiro.",
                                "Tabuleiros com solução única resolvem instantaneamente.",
                                "O algoritmo usa backtracking recursivo otimizado.",
                                "Clique em Limpar para iniciar um novo desafio."
                            ].map((step, i) => (
                                <li key={i} className="flex gap-3 text-sm font-medium opacity-60">
                                    <div className="w-5 h-5 rounded-full bg-text-main/10 flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
