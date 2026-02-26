'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Wind, Download, Plus, Trash2, RefreshCw, Layers, Copy, Check, MousePointer2, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeshPoint {
    id: string;
    x: number;
    y: number;
    color: string;
    size: number;
    opacity: number;
}

export function GradientMeshBuilder() {
    const [points, setPoints] = useState<MeshPoint[]>([
        { id: '1', x: 20, y: 20, color: '#ff0080', size: 40, opacity: 0.8 },
        { id: '2', x: 80, y: 20, color: '#7928ca', size: 45, opacity: 0.7 },
        { id: '3', x: 50, y: 80, color: '#0070f3', size: 50, opacity: 0.9 }
    ]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const addPoint = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newPoint: MeshPoint = {
            id: Math.random().toString(36).substr(2, 9),
            x, y,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            size: 40 + Math.random() * 20,
            opacity: 0.8
        };
        setPoints([...points, newPoint]);
        setSelectedId(newPoint.id);
    };

    const updatePoint = (id: string, updates: Partial<MeshPoint>) => {
        setPoints(points.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePoint = (id: string) => {
        setPoints(points.filter(p => p.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const selectedPoint = points.find(p => p.id === selectedId);

    const generateCss = () => {
        return `background-color: ${bgColor};\nbackground-image: ${points.map(p => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0, transparent 50%)`).join(', ')};`;
    };

    const copyCss = () => {
        navigator.clipboard.writeText(generateCss());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Canvas do Gradiente Mesh</label>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">Clique p/ adicionar pontos</span>
                        </div>
                    </div>

                    <div
                        ref={containerRef}
                        onDoubleClick={addPoint}
                        className="relative w-full aspect-video rounded-[48px] shadow-2xl overflow-hidden cursor-crosshair group"
                        style={{
                            backgroundColor: bgColor,
                            backgroundImage: points.map(p => `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0, transparent 50%)`).join(', ')
                        }}
                    >
                        {points.map(p => (
                            <div
                                key={p.id}
                                onMouseDown={(e) => { e.stopPropagation(); setSelectedId(p.id); }}
                                className={cn(
                                    "absolute w-6 h-6 border-2 border-white rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 cursor-move transition-transform hover:scale-125 z-20",
                                    selectedId === p.id ? "scale-150 ring-4 ring-text-main/20" : "opacity-0 group-hover:opacity-100"
                                )}
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    backgroundColor: p.color,
                                    boxShadow: `0 0 20px ${p.color}44`
                                }}
                            />
                        ))}
                    </div>

                    <div className="bg-card-main border border-border-main p-6 rounded-[32px] shadow-inner font-mono text-xs relative overflow-hidden group">
                        <pre className="text-text-main/70 whitespace-pre-wrap">{generateCss()}</pre>
                        <button
                            onClick={copyCss}
                            className="absolute top-4 right-4 p-3 bg-text-main text-bg-main rounded-[18px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copiado' : 'Copiar CSS'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Propriedades do Ponto</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Fundo (Background)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color" value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                                    />
                                    <input
                                        type="text" value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="flex-1 bg-text-main/5 border border-border-main/10 rounded-xl px-4 text-xs font-mono font-bold"
                                    />
                                </div>
                            </div>

                            {selectedPoint ? (
                                <>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pr-1">
                                            <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Cor do Ponto</label>
                                            <button onClick={() => deletePoint(selectedPoint.id)} className="text-red-500 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="color" value={selectedPoint.color}
                                                onChange={(e) => updatePoint(selectedPoint.id, { color: e.target.value })}
                                                className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                                            />
                                            <input
                                                type="text" value={selectedPoint.color}
                                                onChange={(e) => updatePoint(selectedPoint.id, { color: e.target.value })}
                                                className="flex-1 bg-text-main/5 border border-border-main/10 rounded-xl px-4 text-xs font-mono font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border-main/10">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Posição X</label>
                                                <span className="text-xs font-black italic">{Math.round(selectedPoint.x)}%</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="100" value={selectedPoint.x}
                                                onChange={(e) => updatePoint(selectedPoint.id, { x: parseInt(e.target.value) })}
                                                className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Posição Y</label>
                                                <span className="text-xs font-black italic">{Math.round(selectedPoint.y)}%</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="100" value={selectedPoint.y}
                                                onChange={(e) => updatePoint(selectedPoint.id, { y: parseInt(e.target.value) })}
                                                className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                                    <MousePointer2 size={32} className="mb-4" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Selecione um ponto no canvas para editar</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-text-main/5 rounded-[40px] border border-border-main/10 flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-text-main/60 uppercase tracking-widest font-black text-[10px]">
                            <Plus size={14} /> Atalhos
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-[10px] font-bold opacity-40 uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-text-main" />
                                Double Click no canvas p/ adicionar
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-bold opacity-40 uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-text-main" />
                                Drag & Drop p/ mover (em breve)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
