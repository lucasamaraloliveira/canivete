'use client';

import React, { useState } from 'react';
import { Type, Copy, Check, RefreshCw, Star, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FontPair {
    heading: string;
    body: string;
    name: string;
}

const CURATED_PAIRS: FontPair[] = [
    { heading: 'Playfair Display', body: 'Source Sans Pro', name: 'Clássico & Moderno' },
    { heading: 'Montserrat', body: 'Open Sans', name: 'Geométrico & Amigável' },
    { heading: 'Oswald', body: 'Roboto', name: 'Industrial & Versátil' },
    { heading: 'Merriweather', body: 'Lato', name: 'Elegante & Limpo' },
    { heading: 'Abril Fatface', body: 'Poppins', name: 'Extravagante & Trendy' },
    { heading: 'Quicksand', body: 'Nunito', name: 'Arredondado & Suave' },
    { heading: 'Space Grotesk', body: 'Inter', name: 'Tech & Funcional' },
    { heading: 'DM Serif Display', body: 'Public Sans', name: 'Editorial & Robusto' },
];

export function FontPairer() {
    const [selectedPair, setSelectedPair] = useState<FontPair>(CURATED_PAIRS[0]);
    const [copied, setCopied] = useState<string | null>(null);

    const copyFont = (font: string) => {
        navigator.clipboard.writeText(font);
        setCopied(font);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Combinações Tipográficas</label>
                    <button
                        onClick={() => { setSelectedPair(CURATED_PAIRS[Math.floor(Math.random() * CURATED_PAIRS.length)]); }}
                        className="p-2 hover:bg-text-main/5 rounded-xl transition-all text-text-main/40 hover:text-text-main"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="space-y-4 bg-card-main border border-border-main p-6 rounded-[32px] shadow-sm overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 gap-3">
                        {CURATED_PAIRS.map((pair) => (
                            <button
                                key={pair.name}
                                onClick={() => setSelectedPair(pair)}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all text-left group animate-in slide-in-from-left-2 duration-300",
                                    selectedPair.name === pair.name
                                        ? "bg-text-main text-bg-main border-text-main shadow-lg scale-[1.02]"
                                        : "bg-text-main/5 border-border-main/5 hover:border-border-main text-text-main/60 hover:text-text-main"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{pair.name}</span>
                                    {selectedPair.name === pair.name && <Star size={12} className="fill-current" />}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="text-lg font-bold truncate opacity-90">{pair.heading}</div>
                                    <div className="text-xs truncate opacity-40">{pair.body}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-text-main/5 rounded-[32px] border border-border-main flex flex-col gap-4 shadow-inner">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest">Famílias Selecionadas</label>
                        <a href={`https://fonts.google.com/?selection.family=${selectedPair.heading.replace(' ', '+')}|${selectedPair.body.replace(' ', '+')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-500 hover:underline">Ver no Google Fonts</a>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => copyFont(selectedPair.heading)}
                            className="bg-card-main p-4 rounded-xl border border-border-main hover:bg-text-main hover:text-bg-main transition-all flex items-center justify-between group"
                        >
                            <span className="text-xs font-bold truncate">{selectedPair.heading}</span>
                            {copied === selectedPair.heading ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="opacity-20 group-hover:opacity-100" />}
                        </button>
                        <button
                            onClick={() => copyFont(selectedPair.body)}
                            className="bg-card-main p-4 rounded-xl border border-border-main hover:bg-text-main hover:text-bg-main transition-all flex items-center justify-between group"
                        >
                            <span className="text-xs font-bold truncate">{selectedPair.body}</span>
                            {copied === selectedPair.body ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="opacity-20 group-hover:opacity-100" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Preview Typográfico</label>
                <div className="flex-1 bg-gradient-to-tr from-text-main/5 to-text-main/10 rounded-[40px] p-8 lg:p-12 relative flex flex-col items-start justify-center overflow-hidden shadow-2xl transition-all duration-700">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
                        <Type size={320} />
                    </div>

                    <div className="w-full max-w-2xl relative z-10 animate-in fade-in duration-500">
                        <link
                            href={`https://fonts.googleapis.com/css2?family=${selectedPair.heading.replace(' ', '+')}:wght@700&family=${selectedPair.body.replace(' ', '+')}:wght@400;700&display=swap`}
                            rel="stylesheet"
                        />

                        <h1
                            style={{ fontFamily: `'${selectedPair.heading}', serif`, fontWeight: 700 }}
                            className="text-4xl lg:text-6xl mb-6 text-text-main leading-tight transition-all duration-500"
                        >
                            Esta é uma manchete impactante para seu projeto.
                        </h1>

                        <div
                            style={{ fontFamily: `'${selectedPair.body}', sans-serif` }}
                            className="space-y-6 text-text-main/70 text-base lg:text-lg leading-relaxed transition-all duration-500"
                        >
                            <p>
                                A tipografia correta não apenas comunica palavras, mas também sentimentos e profissionalismo.
                                Combinar uma fonte <strong>Serifada</strong> pesada com uma <strong>Sans-serif</strong> limpa cria
                                um contraste visual balanceado e sofisticado.
                            </p>
                            <p>
                                Use esta combinação no seu próximo projeto web para elevar instantaneamente a qualidade visual da interface.
                                Todos os pares acima foram selecionados manualmente por designers.
                            </p>
                        </div>

                        <button
                            style={{ fontFamily: `'${selectedPair.body}', sans-serif`, fontWeight: 700 }}
                            className="mt-10 px-8 py-4 bg-text-main text-bg-main rounded-2xl shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest"
                        >
                            Call to Action Primário
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-yellow-500/5 rounded-[24px] flex items-center gap-4 text-yellow-600/60 text-[10px] italic border border-yellow-500/10 font-bold uppercase tracking-wider">
                    <Info size={16} className="shrink-0" />
                    <p>As fontes são carregadas dinamicamente via Google Fonts API para o preview. Verifique a licença antes de usar comercialmente.</p>
                </div>
            </div>
        </div>
    );
}
