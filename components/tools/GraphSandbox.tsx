import React, { useState, useEffect } from 'react';
import { Network, Play, RefreshCw, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GraphSandbox() {
    const ROWS = 12;
    const COLS = 16;
    const [grid, setGrid] = useState<number[][]>(Array(ROWS).fill(0).map(() => Array(COLS).fill(0))); // 0: empty, 1: wall, 2: start, 3: end, 4: path
    const [start, setStart] = useState({ r: 2, c: 2 });
    const [end, setEnd] = useState({ r: 9, c: 13 });
    const [running, setRunning] = useState(false);

    const toggleWall = (r: number, c: number) => {
        if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
        const newGrid = [...grid.map(row => [...row])];
        newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
        setGrid(newGrid);
    };

    const findPath = async () => {
        setRunning(true);
        const newGrid = [...grid.map(row => row.map(cell => cell === 4 ? 0 : cell))];

        const queue = [[start.r, start.c, [] as [number, number][]]];
        const visited = new Set();
        visited.add(`${start.r}-${start.c}`);

        while (queue.length > 0) {
            const [r, c, path] = queue.shift() as [number, number, [number, number][]];

            if (r === end.r && c === end.c) {
                // Show path
                const pathGrid = [...newGrid];
                for (const [pr, pc] of path) {
                    if ((pr === start.r && pc === start.c)) continue;
                    pathGrid[pr][pc] = 4;
                    setGrid([...pathGrid.map(row => [...row])]);
                    await new Promise(res => setTimeout(res, 20));
                }
                setRunning(false);
                return;
            }

            const neighbors = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
            for (const [nr, nc] of neighbors) {
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc] !== 1 && !visited.has(`${nr}-${nc}`)) {
                    visited.add(`${nr}-${nc}`);
                    queue.push([nr, nc, [...path, [r, c]]]);
                }
            }
        }
        setRunning(false);
    };

    const reset = () => {
        setGrid(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
        setRunning(false);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center h-full">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Network size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Graph Sandbox</h3>
                <p className="text-text-main/50">Visualize algoritmos de caminho mínimo (BFS) em tempo real.</p>
            </div>

            <div className="bg-bg-main p-4 rounded-[32px] border border-border-main shadow-2xl space-y-4">
                <div className="grid grid-cols-16 gap-1.5 p-2 bg-text-main/5 rounded-2xl">
                    {grid.map((row, r) => row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => toggleWall(r, c)}
                            className={cn(
                                "w-6 h-6 sm:w-8 sm:h-8 rounded-md transition-all cursor-pointer border",
                                r === start.r && c === start.c ? "bg-green-500 border-green-400" :
                                    r === end.r && c === end.c ? "bg-red-500 border-red-400" :
                                        cell === 1 ? "bg-text-main/80 border-text-main shadow-inner" :
                                            cell === 4 ? "bg-blue-500 border-blue-400 animate-pulse" :
                                                "bg-bg-main border-border-main hover:bg-text-main/5"
                            )}
                        />
                    )))}
                </div>

                <div className="flex items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-500" />
                            <span className="text-[10px] font-bold opacity-40 uppercase">Início</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-500" />
                            <span className="text-[10px] font-bold opacity-40 uppercase">Fim</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-text-main/80" />
                            <span className="text-[10px] font-bold opacity-40 uppercase">Parede</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={reset}
                            className="p-3 hover:bg-text-main/5 rounded-xl transition-colors border border-border-main"
                        >
                            <RefreshCw size={20} className="opacity-40" />
                        </button>
                        <button
                            onClick={findPath}
                            disabled={running}
                            className="px-8 py-3 bg-text-main text-bg-main rounded-[18px] font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Play size={20} className="inline mr-2 fill-current" /> Encontrar Caminho
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-[10px] uppercase font-bold opacity-20 tracking-[10px]">Graph Physics Sandbox 1.0</p>

            <style jsx>{`
                .grid-cols-16 {
                    grid-template-columns: repeat(16, minmax(0, 1fr));
                }
            `}</style>
        </div>
    );
}
