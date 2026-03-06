"use client";

import React, { useState, useMemo } from 'react';
import { Type, Copy, Check, Info, Maximize, Minimize, Settings2, Box, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { CodeBlock } from '../CodeBlock';

export function ResponsiveType() {
    const [minSize, setMinSize] = useState(16);
    const [maxSize, setMaxSize] = useState(48);
    const [minWidth, setMinWidth] = useState(320);
    const [maxWidth, setMaxWidth] = useState(1280);
    const [copied, setCopied] = useState(false);

    const clampCode = useMemo(() => {
        const slope = (maxSize - minSize) / (maxWidth - minWidth);
        const yAxisIntersection = -minWidth * slope + minSize;
        const preferredValue = `${(yAxisIntersection / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`;
        return `font-size: clamp(${(minSize / 16).toFixed(3)}rem, ${preferredValue}, ${(maxSize / 16).toFixed(3)}rem);`;
    }, [minSize, maxSize, minWidth, maxWidth]);

    const handleCopy = () => {
        navigator.clipboard.writeText(clampCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* Controls Sidebar */}
                <div className="lg:col-span-1 border border-border-main/5 bg-text-main/5 rounded-[40px] p-8 space-y-8 overflow-y-auto custom-scrollbar shadow-inner max-h-[700px]">
                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Settings2 size={14} /> Configurações de Tipografia
                        </label>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">Tamanho da Fonte (px)</span>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black opacity-40 uppercase">Mínimo</p>
                                        <input
                                            type="number" value={minSize}
                                            onChange={(e) => setMinSize(parseInt(e.target.value) || 0)}
                                            className="w-full bg-text-main/5 border border-border-main/20 p-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-text-main/10 transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black opacity-40 uppercase">Máximo</p>
                                        <input
                                            type="number" value={maxSize}
                                            onChange={(e) => setMaxSize(parseInt(e.target.value) || 0)}
                                            className="w-full bg-text-main/5 border border-border-main/20 p-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-text-main/10 transition-all font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">Largura da Tela (px)</span>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black opacity-40 uppercase">Mínima (Break)</p>
                                        <input
                                            type="number" value={minWidth}
                                            onChange={(e) => setMinWidth(parseInt(e.target.value) || 0)}
                                            className="w-full bg-text-main/5 border border-border-main/20 p-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-text-main/10 transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black opacity-40 uppercase">Máxima (Break)</p>
                                        <input
                                            type="number" value={maxWidth}
                                            onChange={(e) => setMaxWidth(parseInt(e.target.value) || 0)}
                                            className="w-full bg-text-main/5 border border-border-main/20 p-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-text-main/10 transition-all font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="h-[400px] bg-text-main/[0.01] border border-border-main border-dashed rounded-[56px] flex flex-col items-center justify-center p-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

                        <div className="space-y-12 w-full max-w-4xl text-center relative z-10">
                            <div className="space-y-2">
                                <h1
                                    className="font-black leading-tight tracking-tighter uppercase transition-all duration-300 transform hover:scale-105"
                                    style={{
                                        fontSize: `clamp(${minSize}px, ${(minSize + (maxSize - minSize) / 2)}px, ${maxSize}px)`
                                    }}
                                >
                                    Tipografia Responsiva
                                </h1>
                                <p className="text-[10px] font-black opacity-20 uppercase tracking-[6px] italic leading-tight">Teste Visual em 100vw</p>
                            </div>

                            <p className="text-sm opacity-60 leading-relaxed max-w-2xl mx-auto italic font-medium px-8 border-l-2 border-text-main/10 shadow-sm py-4 bg-text-main/[0.02] rounded-r-3xl">
                                Redimensione a janela do navegador para ver a fonte encolher e crescer suavemente entre {minSize}px e {maxSize}px.
                                Sem breakpoints rígidos, apenas fluidez matemática.
                            </p>
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
                        <div className="space-y-4 relative z-10">
                            <label className="text-[10px] font-black uppercase tracking-[3px] opacity-40 flex items-center gap-2">
                                <Type size={14} /> CÓDIGO CSS CLAMP()
                            </label>
                            <div className="bg-[#0D0D0D] rounded-3xl border border-white/10 overflow-hidden shadow-inner group/code">
                                <CodeBlock code={clampCode} language="css" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hint Section */}
            <div className="p-8 bg-text-main/5 border border-border-main/10 rounded-[40px] flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
                <div className="w-16 h-16 bg-text-main text-bg-main rounded-[24px] flex items-center justify-center shrink-0 transform rotate-12 group-hover:rotate-0 transition-transform shadow-lg">
                    <Maximize size={28} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-widest text-text-main">Por que usar Clamp?</h4>
                    <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                        A função clamp() permite que você defina um valor mínimo, um valor ideal (baseado em viewport) e um valor máximo.
                        Isso elimina a necessidade de dezenas de media queries para cada tamanho de tela.
                    </p>
                </div>
            </div>
        </div>
    );
}
