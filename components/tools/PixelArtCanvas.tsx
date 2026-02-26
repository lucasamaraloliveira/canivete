'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Grid3X3, Copy, Check, Download, RefreshCw, Eraser, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PixelArtCanvas() {
    const [gridSize, setGridSize] = useState(16);
    const [grid, setGrid] = useState<string[][]>([]);
    const [brushColor, setBrushColor] = useState('#2563eb');
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const initGrid = () => {
        const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill('transparent'));
        setGrid(newGrid);
    };

    useEffect(() => {
        initGrid();
    }, [gridSize]);

    const handleCellAction = (row: number, col: number) => {
        const newGrid = [...grid];
        newGrid[row][col] = isErasing ? 'transparent' : brushColor;
        setGrid(newGrid);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isMouseDown) handleCellAction(row, col);
    };

    const download = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = 10;
        canvas.width = gridSize * cellSize;
        canvas.height = gridSize * cellSize;

        grid.forEach((row, ri) => {
            row.forEach((color, ci) => {
                ctx.fillStyle = color === 'transparent' ? 'rgba(0,0,0,0)' : color;
                ctx.fillRect(ci * cellSize, ri * cellSize, cellSize, cellSize);
            });
        });

        const link = document.createElement('a');
        link.download = `pixel-art-${gridSize}x${gridSize}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const COLORS = [
        '#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#a855f7', '#ec4899',
        '#000000', '#4b5563', '#9ca3af', '#ffffff'
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Editor de Pixel Art</label>
                    <button
                        onClick={() => initGrid()}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-6 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Tamanho da Grade ({gridSize}x{gridSize})</label>
                            <div className="flex p-1 bg-text-main/5 rounded-xl border border-border-main/5">
                                {[16, 32, 64].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setGridSize(size)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                                            gridSize === size ? "bg-text-main text-bg-main shadow-lg" : "text-text-main/40 hover:text-text-main"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Cores Populares</label>
                            <div className="grid grid-cols-6 gap-1">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => { setBrushColor(c); setIsErasing(false); }}
                                        className={cn(
                                            "w-full aspect-square rounded-md border border-border-main/5 hover:scale-110 transition-all",
                                            brushColor === c && !isErasing ? "ring-2 ring-text-main" : ""
                                        )}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsErasing(false)}
                            className={cn(
                                "flex-1 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all",
                                !isErasing ? "bg-text-main text-bg-main shadow-xl" : "bg-text-main/5 hover:bg-text-main/10 text-text-main/40"
                            )}
                        >
                            <MousePointer2 size={18} /> Pincel
                        </button>
                        <button
                            onClick={() => setIsErasing(true)}
                            className={cn(
                                "flex-1 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all",
                                isErasing ? "bg-text-main text-bg-main shadow-xl" : "bg-text-main/5 hover:bg-text-main/10 text-text-main/40"
                            )}
                        >
                            <Eraser size={18} /> Borracha
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Pincel Customizado</label>
                        <div className="flex items-center gap-4 bg-text-main/5 p-4 rounded-2xl">
                            <input type="color" value={brushColor} onChange={(e) => { setBrushColor(e.target.value); setIsErasing(false); }} className="w-12 h-12 rounded-xl" />
                            <div className="flex-1 font-mono text-xs font-bold">{brushColor}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={download}
                        className="flex items-center justify-center gap-2 py-4 bg-text-main text-bg-main rounded-[24px] font-bold text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                        <Download size={18} /> Baixar Arte PNG
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Canvas Interativo</label>
                <div
                    className="flex-1 bg-bg-main border border-border-main border-dashed border-2 rounded-[40px] shadow-inner relative flex items-center justify-center p-4 overflow-hidden"
                    onMouseDown={() => setIsMouseDown(true)}
                    onMouseUp={() => setIsMouseDown(false)}
                    onMouseLeave={() => setIsMouseDown(false)}
                >
                    <div
                        className="bg-card-main shadow-2xl rounded-sm overflow-hidden"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                            width: 'min(90%, 600px)',
                            aspectRatio: '1/1'
                        }}
                    >
                        {grid.map((row, ri) => (
                            row.map((color, ci) => (
                                <div
                                    key={`${ri}-${ci}`}
                                    onMouseDown={() => handleCellAction(ri, ci)}
                                    onMouseEnter={() => handleMouseEnter(ri, ci)}
                                    style={{ backgroundColor: color }}
                                    className="border-[0.5px] border-text-main/5 hover:bg-text-main/10 transition-colors"
                                />
                            ))
                        ))}
                    </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
