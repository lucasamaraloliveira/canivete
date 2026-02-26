'use client';

import React, { useState } from 'react';
import { Type, Copy, Check, RefreshCw, Zap, Sparkles, Wand2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AcronymCreator() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const generateAcronym = (input: string) => {
        if (!input.trim()) return '';
        return input
            .split(/\s+/)
            .filter(word => word.length > 0 && !['o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'com', 'para', 'por'].includes(word.toLowerCase()))
            .map(word => word[0].toUpperCase())
            .join('');
    };

    const acronym = generateAcronym(text);

    const copyAcronym = () => {
        navigator.clipboard.writeText(acronym);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Acronym Creator</h2>
                    <p className="opacity-40 text-sm font-medium">Gere siglas criativas a partir de nomes de projetos ou frases.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-6">
                    <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30 flex items-center gap-2">
                        <Type size={12} /> Frase ou Nome Original
                    </label>
                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden relative group">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Ex: Sistema de Gestão de Aprendizado..."
                            className="w-full h-full bg-transparent p-12 text-2xl font-black italic tracking-tight placeholder:opacity-10 outline-none resize-none leading-relaxed custom-scrollbar"
                        />
                        <div className="absolute top-8 right-8 text-[10px] font-mono opacity-20 bg-text-main text-bg-main px-2 py-1 rounded">
                            {text.split(/\s+/).filter(w => w).length} PALAVRAS
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30 flex items-center gap-2">
                            <Sparkles size={12} /> Sigla Sugerida
                        </label>
                        <button
                            onClick={copyAcronym}
                            disabled={!acronym}
                            className="p-3 bg-text-main/5 hover:bg-text-main hover:text-bg-main rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider disabled:opacity-0"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar Sigla'}
                        </button>
                    </div>

                    <div className="flex-1 bg-text-main border-transparent rounded-[48px] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20" />
                        <h3 className="text-9xl font-black text-bg-main italic tracking-tighter drop-shadow-2xl z-10 break-all px-8 text-center animate-in zoom-in-75 duration-300">
                            {acronym || <span className="opacity-10">SGA</span>}
                        </h3>
                        {acronym && (
                            <div className="mt-8 px-6 py-2 bg-bg-main/10 backdrop-blur-md rounded-full text-[10px] font-black text-bg-main uppercase tracking-[4px] z-10 animate-bounce-slow">
                                Brandable
                            </div>
                        )}
                    </div>

                    <div className="bg-text-main/5 border border-border-main/10 p-8 rounded-[40px] flex gap-4">
                        <div className="w-10 h-10 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                            <Zap size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Lógica de Filtro</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                Removemos automaticamente preposições e artigos comuns para criar siglas mais limpas e memoráveis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}} />
        </div>
    );
}
