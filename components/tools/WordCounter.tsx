'use client';

import React, { useState, useMemo } from 'react';
import { Hash, AlignLeft, Type, Clock, Copy, Check, Trash2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WordCounter() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const cleanText = text.trim();
        const words = cleanText ? cleanText.split(/\s+/).filter(w => w.length > 0) : [];
        const charsWithSpaces = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(words.length / 200); // 200 wpm average

        return {
            words: words.length,
            charsWithSpaces,
            charsNoSpaces,
            sentences,
            paragraphs,
            readingTime
        };
    }, [text]);

    const copyText = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-1">Word & Character Counter</h3>
                    <p className="text-sm opacity-50 font-medium">Análise detalhada de densidade e métricas de texto.</p>
                </div>
                {text && (
                    <button
                        onClick={() => setText('')}
                        className="p-3 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                    >
                        <Trash2 size={16} /> Limpar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="relative flex-1 group">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Cole seu texto aqui para iniciar a análise..."
                            className="w-full h-full bg-text-main/5 border border-border-main p-8 rounded-[40px] shadow-inner outline-none focus:ring-4 focus:ring-text-main/5 transition-all resize-none text-lg leading-relaxed placeholder:opacity-20 custom-scrollbar"
                        />
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button
                                onClick={copyText}
                                disabled={!text}
                                className="p-4 bg-text-main text-bg-main rounded-[20px] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-0 disabled:scale-90 flex items-center gap-2 font-bold"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Estatísticas em Tempo Real</label>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: 'Palavras', value: stats.words, icon: <AlignLeft size={16} />, color: 'bg-blue-500' },
                            { label: 'Caracteres', value: stats.charsWithSpaces, icon: <Hash size={16} />, color: 'bg-green-500' },
                            { label: 'S/ Espaços', value: stats.charsNoSpaces, icon: <Type size={16} />, color: 'bg-purple-500' },
                            { label: 'Frases', value: stats.sentences, icon: <Zap size={16} />, color: 'bg-yellow-500' },
                            { label: 'Parágrafos', value: stats.paragraphs, icon: <AlignLeft size={16} />, color: 'bg-orange-500' },
                            { label: 'Leitura', value: `${stats.readingTime} min`, icon: <Clock size={16} />, color: 'bg-pink-500' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-6 bg-card-main border border-border-main rounded-[32px] shadow-sm flex items-center justify-between group hover:border-text-main transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.label}</span>
                                </div>
                                <span className="text-2xl font-black italic tabular-nums">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-text-main/5 rounded-[40px] border border-border-main/10">
                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-3">Insights</p>
                        <p className="text-xs font-medium opacity-50 leading-relaxed uppercase tracking-wider">
                            O tempo de leitura é baseado na média de 200 palavras por minuto. Ideal para roteiros e copy de anúncios.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
