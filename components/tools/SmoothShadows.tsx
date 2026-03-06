"use client";

import React, { useState, useMemo } from 'react';
import { Layers, Copy, Check, Info, Box, Sliders, Layout, Minus, Plus, Sun, Moon, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

import { CodeBlock } from '../CodeBlock';

export function SmoothShadows() {
    const [layers, setLayers] = useState(6);
    const [alpha, setAlpha] = useState(0.07);
    const [offset, setOffset] = useState(10);
    const [blur, setBlur] = useState(20);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
    const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');
    const [copied, setCopied] = useState(false);

    const shadows = useMemo(() => {
        const shadowList = [];
        for (let i = 1; i <= layers; i++) {
            const ratio = i / layers;
            const currentOffset = (offset * Math.pow(ratio, 2.5)).toFixed(1);
            const currentBlur = (blur * Math.pow(ratio, 2.5)).toFixed(1);
            const currentAlpha = (alpha / layers).toFixed(4);
            shadowList.push(`${currentOffset}px ${currentOffset}px ${currentBlur}px rgba(${color.r}, ${color.g}, ${color.b}, ${currentAlpha})`);
        }
        return shadowList.join(', ');
    }, [layers, alpha, offset, blur, color]);

    const cssCode = `box-shadow: ${shadows};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* Controls Sidebar */}
                <div className="lg:col-span-1 border border-border-main/5 bg-text-main/5 rounded-[40px] p-8 space-y-8 overflow-y-auto custom-scrollbar shadow-inner max-h-[700px]">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Sliders size={14} /> Ajustes de Camadas
                        </label>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="opacity-40">Camadas: {layers}</span>
                                </div>
                                <input
                                    type="range" min="1" max="10" value={layers}
                                    onChange={(e) => setLayers(parseInt(e.target.value))}
                                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="opacity-40">Opacidade: {(alpha * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range" min="0.01" max="0.5" step="0.01" value={alpha}
                                    onChange={(e) => setAlpha(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="opacity-40">Offset Final: {offset}px</span>
                                </div>
                                <input
                                    type="range" min="0" max="200" value={offset}
                                    onChange={(e) => setOffset(parseInt(e.target.value))}
                                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="opacity-40">Blur Máximo: {blur}px</span>
                                </div>
                                <input
                                    type="range" min="0" max="300" value={blur}
                                    onChange={(e) => setBlur(parseInt(e.target.value))}
                                    className="w-full h-1 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                    <Palette size={14} /> Cor da Sombra (RGB)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['r', 'g', 'b'] as const).map(c => (
                                        <div key={c} className="space-y-1">
                                            <span className="text-[8px] font-black uppercase opacity-30">{c}</span>
                                            <input
                                                type="number" min="0" max="255" value={color[c]}
                                                onChange={(e) => setColor({ ...color, [c]: parseInt(e.target.value) || 0 })}
                                                className="w-full p-2 bg-text-main/5 border border-border-main rounded-lg text-xs font-bold text-center outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className={cn(
                        "h-[400px] border border-border-main border-dashed rounded-[56px] flex items-center justify-center relative overflow-hidden group transition-colors duration-500",
                        previewTheme === 'light' ? "bg-zinc-100" : "bg-zinc-900"
                    )}>
                        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

                        {/* Theme Toggle Button */}
                        <button
                            onClick={() => setPreviewTheme(prev => prev === 'light' ? 'dark' : 'light')}
                            className="absolute top-6 left-6 p-3 bg-card-main border border-border-main rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all z-20"
                        >
                            {previewTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <div
                            className={cn(
                                "w-64 h-64 rounded-[48px] border flex flex-col items-center justify-center gap-2 transform transition-all duration-500 hover:scale-105 relative z-10",
                                previewTheme === 'light' ? "bg-white border-zinc-200" : "bg-zinc-800 border-zinc-700"
                            )}
                            style={{ boxShadow: shadows }}
                        >
                            <Box size={48} className={cn(previewTheme === 'light' ? "text-zinc-200" : "text-zinc-700")} />
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest italic",
                                previewTheme === 'light' ? "opacity-20" : "opacity-40"
                            )}>Visualização Premium</span>
                        </div>
                    </div>

                    {/* Output Code */}
                    <div className="p-8 bg-card-main border border-border-main rounded-[40px] shadow-sm relative group overflow-hidden">
                        <button
                            onClick={handleCopy}
                            className="absolute top-8 right-8 p-3 bg-text-main text-bg-main rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl z-20"
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[3px] opacity-40 flex items-center gap-2">
                                <Layers size={14} /> CSS DE SHADOW LAYERED
                            </label>
                            <div className="bg-[#0D0D0D] rounded-3xl border border-white/5 overflow-hidden shadow-2xl group/code">
                                <div className="max-h-48 overflow-auto custom-scrollbar">
                                    <CodeBlock code={cssCode} language="css" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hint Section */}
            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Info size={20} />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Design Premium</h4>
                    <p className="text-[10px] font-medium opacity-60 uppercase leading-relaxed tracking-[0.5px]">
                        Sombras com múltiplas camadas (layered) imitam como a luz se comporta na vida real, criando um efeito muito mais natural e elegante do que sombras simples.
                    </p>
                </div>
            </div>
        </div>
    );
}
