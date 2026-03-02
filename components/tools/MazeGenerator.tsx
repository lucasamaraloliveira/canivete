import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Activity, RefreshCcw, Download, Printer, Settings, Zap, Compass, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

type Cell = {
    visited: boolean;
    walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
};

export function MazeGenerator() {
    const [size, setSize] = useState(20);
    const [maze, setMaze] = useState<Cell[][]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateMaze = useCallback(() => {
        setIsGenerating(true);

        const grid: Cell[][] = Array(size).fill(null).map(() =>
            Array(size).fill(null).map(() => ({
                visited: false,
                walls: { top: true, right: true, bottom: true, left: true },
            }))
        );

        const stack: [number, number][] = [];
        const current: [number, number] = [0, 0];
        grid[0][0].visited = true;
        stack.push(current);

        while (stack.length > 0) {
            const [r, c] = stack[stack.length - 1];
            const neighbors: [number, number, string][] = [];

            if (r > 0 && !grid[r - 1][c].visited) neighbors.push([r - 1, c, 'top']);
            if (r < size - 1 && !grid[r + 1][c].visited) neighbors.push([r + 1, c, 'bottom']);
            if (c > 0 && !grid[r][c - 1].visited) neighbors.push([r, c - 1, 'left']);
            if (c < size - 1 && !grid[r][c + 1].visited) neighbors.push([r, c + 1, 'right']);

            if (neighbors.length > 0) {
                const [nr, nc, dir] = neighbors[Math.floor(Math.random() * neighbors.length)];

                if (dir === 'top') { grid[r][c].walls.top = false; grid[nr][nc].walls.bottom = false; }
                if (dir === 'bottom') { grid[r][c].walls.bottom = false; grid[nr][nc].walls.top = false; }
                if (dir === 'left') { grid[r][c].walls.left = false; grid[nr][nc].walls.right = false; }
                if (dir === 'right') { grid[r][c].walls.right = false; grid[nr][nc].walls.left = false; }

                grid[nr][nc].visited = true;
                stack.push([nr, nc]);
            } else {
                stack.pop();
            }
        }

        setMaze(grid);
        setIsGenerating(false);
    }, [size]);

    useEffect(() => {
        generateMaze();
    }, [generateMaze]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col items-center gap-12 p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar">
            <div className="text-center space-y-4 print:hidden">
                <div className="w-16 h-16 bg-text-main/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-text-main">
                    <Activity size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main">Gerador de Labirintos</h2>
                <p className="text-sm opacity-50 font-medium tracking-tight uppercase">Crie e exporte labirintos procedurais</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 w-full items-start mb-12">
                {/* Settings Panel */}
                <div className="w-full lg:w-80 space-y-6 print:hidden">
                    <div className="bg-card-main dark:bg-white/5 p-8 rounded-[40px] border border-border-main space-y-8 shadow-sm">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] opacity-30 text-text-main flex items-center gap-2">
                            <Settings size={14} /> Configurações
                        </h4>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Dificuldade ({size}x{size})</p>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-text-main/10 rounded-full appearance-none cursor-pointer accent-text-main"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={generateMaze}
                                className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:opacity-90 active:scale-95 transition-all"
                            >
                                <Zap size={18} /> GERAR NOVO
                            </button>
                            <button
                                onClick={handlePrint}
                                className="w-full py-5 bg-text-main/5 border border-border-main border-dashed rounded-[24px] font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-text-main/10"
                            >
                                <Printer size={18} /> EXPORTAR PDF
                            </button>
                        </div>
                    </div>

                    <div className="bg-text-main/5 p-8 rounded-[40px] border border-border-main space-y-6">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] opacity-30 text-text-main">Legenda Táctica</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-tight">
                                <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                    <Map size={14} className="text-white" />
                                </div>
                                <span>Ponto de Partida</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-tight">
                                <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                    <Compass size={14} className="text-white" />
                                </div>
                                <span>Objetivo Final</span>
                            </div>
                        </div>
                        <p className="text-[10px] leading-relaxed font-medium opacity-30 italic">O algoritmo garante que sempre existe um único caminho possível entre os dois pontos.</p>
                    </div>
                </div>

                {/* Maze Area */}
                <div className="flex-1 w-full bg-card-main dark:bg-[#0D0D0D]/40 p-4 md:p-12 rounded-[40px] border border-border-main shadow-2xl relative maze-container">
                    <div
                        className="grid gap-0 mx-auto bg-white border-4 border-black print:w-[18cm] print:h-[18cm]"
                        style={{
                            gridTemplateColumns: `repeat(${size}, 1fr)`,
                            width: '100%',
                            maxWidth: '800px',
                            aspectRatio: '1',
                            margin: '0 auto'
                        }}
                    >
                        {maze.map((row, r) =>
                            row.map((cell, c) => {
                                // Special handling for entry/exit walls
                                const isEntry = r === 0 && c === 0;
                                const isExit = r === size - 1 && c === size - 1;

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={cn(
                                            "relative",
                                            (cell.walls.top && !isEntry) && "border-t-[1px] md:border-t-2 border-t-black",
                                            cell.walls.right && "border-r-[1px] md:border-r-2 border-r-black",
                                            (cell.walls.bottom && !isExit) && "border-b-[1px] md:border-b-2 border-b-black",
                                            cell.walls.left && "border-l-[1px] md:border-l-2 border-l-black",
                                        )}
                                    >
                                        {isEntry && (
                                            <div className="absolute inset-0 bg-green-500/10 flex flex-col items-center justify-center">
                                                {/* Desktop Indicator */}
                                                <motion.div
                                                    initial={{ y: -10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute -top-4 text-green-600 print:hidden"
                                                >
                                                    <RefreshCcw size={14} className="rotate-180" />
                                                </motion.div>

                                                {/* Print Indicator */}
                                                <div className="hidden print:flex absolute -top-8 left-0 right-0 items-center justify-center">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter border-2 border-black px-1 leading-none bg-white font-mono">INÍCIO</span>
                                                </div>

                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full print:bg-black" />
                                            </div>
                                        )}
                                        {isExit && (
                                            <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full print:bg-black" />

                                                {/* Desktop Indicator */}
                                                <motion.div
                                                    initial={{ y: 0, opacity: 1 }}
                                                    animate={{ y: 10, opacity: 0 }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute -bottom-4 text-red-600 print:hidden"
                                                >
                                                    <Download size={14} />
                                                </motion.div>

                                                {/* Print Indicator */}
                                                <div className="hidden print:flex absolute -bottom-8 left-0 right-0 items-center justify-center">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter border-2 border-black px-1 leading-none bg-white font-mono">FIM</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body { background: white !important; margin: 0; padding: 0; }
                    .print\\:hidden, header, footer, nav, aside { display: none !important; }
                    .maze-container { 
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        padding: 2cm !important;
                        border: none !important;
                        background: white !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                }
            `}</style>
        </div>
    );
}
