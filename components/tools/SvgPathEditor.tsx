'use client';

import React, { useState } from 'react';
import { MousePointer2, Copy, Check, RefreshCw, PenTool, Type, Move, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '../CodeBlock';

function CustomSelect({
    value,
    onChange,
    options
}: {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[]
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative group/select">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "min-w-[100px] p-2 bg-text-main/5 border border-border-main/20 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none flex items-center justify-between transition-all hover:bg-text-main/10",
                    isOpen && "ring-2 ring-text-main/10 border-text-main/20 bg-text-main/10"
                )}
            >
                <span className="truncate pr-2">{selectedLabel}</span>
                <ChevronDown size={14} className={cn("shrink-0 opacity-30 group-hover/select:opacity-100 transition-all", isOpen && "rotate-180 opacity-100")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-full right-0 mt-2 bg-card-main/90 backdrop-blur-xl border border-border-main rounded-2xl shadow-2xl z-20 overflow-hidden py-2 min-w-[140px]"
                        >
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                        value === opt.value
                                            ? "bg-text-main text-bg-main"
                                            : "text-text-main/60 hover:bg-text-main/5 hover:text-text-main hover:pl-6"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

interface Point {
    x: number;
    y: number;
    type: 'M' | 'L' | 'Q' | 'C';
    cp1?: { x: number, y: number };
    cp2?: { x: number, y: number };
}

export function SvgPathEditor() {
    const [points, setPoints] = useState<Point[]>([
        { x: 50, y: 150, type: 'M' },
        { x: 150, y: 50, type: 'Q', cp1: { x: 100, y: 50 } },
        { x: 250, y: 150, type: 'L' }
    ]);
    const [activePoint, setActivePoint] = useState<number | null>(null);
    const [activeCp, setActiveCp] = useState<{ pIdx: number, cp: 1 | 2 } | null>(null);
    const [copied, setCopied] = useState(false);

    const generatePath = () => {
        return points.map((p, i) => {
            if (p.type === 'M') return `M ${p.x} ${p.y}`;
            if (p.type === 'L') return `L ${p.x} ${p.y}`;
            if (p.type === 'Q') return `Q ${p.cp1!.x} ${p.cp1!.y}, ${p.x} ${p.y}`;
            if (p.type === 'C') return `C ${p.cp1!.x} ${p.cp1!.y}, ${p.cp2!.x} ${p.cp2!.y}, ${p.x} ${p.y}`;
            return '';
        }).join(' ');
    };

    const handleMouseDown = (e: React.MouseEvent, type: 'point' | 'cp', idx: number, cpIdx?: 1 | 2) => {
        e.preventDefault();
        if (type === 'point') setActivePoint(idx);
        else setActiveCp({ pIdx: idx, cp: cpIdx! });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (activePoint === null && activeCp === null) return;

        const rect = e.currentTarget.getBoundingClientRect();

        // Mapeia coordenadas do mouse (pixels da tela) para o sistema de coordenadas do SVG (viewBox 0 0 300 300)
        const x = Math.round((e.clientX - rect.left) * (300 / rect.width));
        const y = Math.round((e.clientY - rect.top) * (300 / rect.height));

        const newPoints = [...points];
        if (activePoint !== null) {
            newPoints[activePoint] = { ...newPoints[activePoint], x, y };
        } else if (activeCp !== null) {
            const p = newPoints[activeCp.pIdx];
            if (activeCp.cp === 1) p.cp1 = { x, y };
            else p.cp2 = { x, y };
        }
        setPoints(newPoints);
    };

    const handleMouseUp = () => {
        setActivePoint(null);
        setActiveCp(null);
    };

    const svgCode = `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <path d="${generatePath()}" fill="none" stroke="black" stroke-width="2" />
</svg>`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Editor de Caminhos SVG</label>
                    <button
                        onClick={() => {
                            setPoints([
                                { x: 50, y: 150, type: 'M' },
                                { x: 150, y: 50, type: 'Q', cp1: { x: 100, y: 50 } },
                                { x: 250, y: 150, type: 'L' }
                            ]);
                        }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-4 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm overflow-y-auto custom-scrollbar max-h-[400px]">
                    {points.map((p, i) => (
                        <div key={i} className="p-4 bg-text-main/5 rounded-2xl border border-border-main/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black italic uppercase tracking-widest opacity-30">Ponto {i} ({p.type})</span>
                                <CustomSelect
                                    value={p.type}
                                    onChange={(val) => {
                                        const newPoints = [...points];
                                        const type = val as Point['type'];
                                        newPoints[i] = { ...p, type };
                                        if (type === 'Q' && !p.cp1) newPoints[i].cp1 = { x: p.x - 20, y: p.y - 20 };
                                        if (type === 'C' && !p.cp2) {
                                            if (!p.cp1) newPoints[i].cp1 = { x: p.x - 40, y: p.y - 20 };
                                            newPoints[i].cp2 = { x: p.x - 20, y: p.y - 20 };
                                        }
                                        setPoints(newPoints);
                                    }}
                                    options={[
                                        { label: 'Move To', value: 'M' },
                                        { label: 'Line To', value: 'L' },
                                        { label: 'Quadratic', value: 'Q' },
                                        { label: 'Cubic', value: 'C' },
                                    ]}
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center pr-1">
                                            <label className="text-[8px] font-bold opacity-20 uppercase">X</label>
                                            <span className="text-[10px] font-mono font-bold opacity-40">{p.x}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="300" value={p.x} onChange={(e) => {
                                                const newPoints = [...points];
                                                newPoints[i].x = parseInt(e.target.value) || 0;
                                                setPoints(newPoints);
                                            }}
                                            className="w-full accent-text-main h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center pr-1">
                                            <label className="text-[8px] font-bold opacity-20 uppercase">Y</label>
                                            <span className="text-[10px] font-mono font-bold opacity-40">{p.y}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="300" value={p.y} onChange={(e) => {
                                                const newPoints = [...points];
                                                newPoints[i].y = parseInt(e.target.value) || 0;
                                                setPoints(newPoints);
                                            }}
                                            className="w-full accent-text-main h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {p.cp1 && (
                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-main/5">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center pr-1">
                                                <label className="text-[8px] font-bold opacity-20 uppercase tracking-widest text-blue-500">CP1 X</label>
                                                <span className="text-[10px] font-mono font-bold opacity-40">{p.cp1.x}</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="300" value={p.cp1.x} onChange={(e) => {
                                                    const newPoints = [...points];
                                                    newPoints[i].cp1 = { ...newPoints[i].cp1!, x: parseInt(e.target.value) || 0 };
                                                    setPoints(newPoints);
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-blue-500/10 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center pr-1">
                                                <label className="text-[8px] font-bold opacity-20 uppercase tracking-widest text-blue-500">CP1 Y</label>
                                                <span className="text-[10px] font-mono font-bold opacity-40">{p.cp1.y}</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="300" value={p.cp1.y} onChange={(e) => {
                                                    const newPoints = [...points];
                                                    newPoints[i].cp1 = { ...newPoints[i].cp1!, y: parseInt(e.target.value) || 0 };
                                                    setPoints(newPoints);
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-blue-500/10 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                )}

                                {p.cp2 && (
                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-main/5">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center pr-1">
                                                <label className="text-[8px] font-bold opacity-20 uppercase tracking-widest text-blue-500">CP2 X</label>
                                                <span className="text-[10px] font-mono font-bold opacity-40">{p.cp2.x}</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="300" value={p.cp2.x} onChange={(e) => {
                                                    const newPoints = [...points];
                                                    newPoints[i].cp2 = { ...newPoints[i].cp2!, x: parseInt(e.target.value) || 0 };
                                                    setPoints(newPoints);
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-blue-500/10 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center pr-1">
                                                <label className="text-[8px] font-bold opacity-20 uppercase tracking-widest text-blue-500">CP2 Y</label>
                                                <span className="text-[10px] font-mono font-bold opacity-40">{p.cp2.y}</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="300" value={p.cp2.y} onChange={(e) => {
                                                    const newPoints = [...points];
                                                    newPoints[i].cp2 = { ...newPoints[i].cp2!, y: parseInt(e.target.value) || 0 };
                                                    setPoints(newPoints);
                                                }}
                                                className="w-full accent-blue-500 h-1 bg-blue-500/10 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => setPoints([...points, { x: 150, y: 150, type: 'L' }])}
                        className="w-full py-3 border border-dashed border-border-main rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-text-main/5 transition-all"
                    >
                        + Adicionar Ponto
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Código SVG</label>
                    <div className="h-48 bg-[#1e1e1e] rounded-[32px] overflow-auto custom-scrollbar shadow-inner relative group">
                        <CodeBlock code={svgCode} language="xml" className="w-full" />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(svgCode);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-bold"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Canvas de Manipulação</label>
                <div
                    className="flex-1 bg-bg-main border border-border-main border-dashed border-2 rounded-[40px] shadow-inner relative overflow-hidden group/canvas"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                    <svg viewBox="0 0 300 300" className="w-full h-full">
                        <path d={generatePath()} fill="none" stroke="currentColor" strokeWidth="2" className="text-text-main" />

                        {points.map((p, i) => (
                            <React.Fragment key={i}>
                                {p.cp1 && (
                                    <>
                                        <line x1={p.x} y1={p.y} x2={p.cp1.x} y2={p.cp1.y} stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-text-main/20" />
                                        <circle
                                            cx={p.cp1.x} cy={p.cp1.y} r="5"
                                            onMouseDown={(e) => handleMouseDown(e, 'cp', i, 1)}
                                            className="fill-blue-500 cursor-move hover:scale-150 transition-transform"
                                            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                                        />
                                    </>
                                )}
                                {p.cp2 && (
                                    <>
                                        <line x1={p.x} y1={p.y} x2={p.cp2.x} y2={p.cp2.y} stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-text-main/20" />
                                        <circle
                                            cx={p.cp2.x} cy={p.cp2.y} r="5"
                                            onMouseDown={(e) => handleMouseDown(e, 'cp', i, 2)}
                                            className="fill-blue-500 cursor-move hover:scale-150 transition-transform"
                                            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                                        />
                                    </>
                                )}
                                <circle
                                    cx={p.x} cy={p.y} r="6"
                                    onMouseDown={(e) => handleMouseDown(e, 'point', i)}
                                    className={cn(
                                        "cursor-move hover:scale-150 transition-transform",
                                        p.type === 'M' ? "fill-green-500" : "fill-text-main"
                                    )}
                                    style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                                />
                            </React.Fragment>
                        ))}
                    </svg>

                    <div className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-[10px] font-bold text-text-main/60 uppercase tracking-widest pointer-events-none">
                        Arraste os pontos para editar
                    </div>
                </div>
                <div className="flex gap-2 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                    <PenTool size={16} className="text-blue-500 shrink-0" />
                    <p className="text-[10px] font-medium text-blue-600/60 leading-relaxed uppercase tracking-wider">
                        Verde: Início (Move) | Preto: Âncora | Azul: Controle Bézier
                    </p>
                </div>
            </div>
        </div>
    );
}
