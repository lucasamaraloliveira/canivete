'use client';

import React, { useState } from 'react';
import { Binary, Copy, Check, RefreshCw, Sparkles, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function RandomNumberGenerator() {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [count, setCount] = useState(1);
    const [results, setResults] = useState<number[]>([]);
    const [copied, setCopied] = useState(false);

    const generateNumbers = () => {
        const newResults = [];
        for (let i = 0; i < count; i++) {
            newResults.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        setResults(newResults);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-cyan-400">
                    <Binary size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap text-cyan-400">Números Aleatórios</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere sequências de números aleatórios ou realize sorteios dentro de qualquer intervalo.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Mínimo</label>
                        <input
                            type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                            className="w-full bg-text-main/5 border border-border-main rounded-2xl p-4 font-bold text-center outline-none focus:ring-4 focus:ring-text-main/10 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Máximo</label>
                        <input
                            type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                            className="w-full bg-text-main/5 border border-border-main rounded-2xl p-4 font-bold text-center outline-none focus:ring-4 focus:ring-text-main/10 transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 text-center">Quantidade de Números: {count}</label>
                    <input
                        type="range" min="1" max="50" value={count} onChange={(e) => setCount(parseInt(e.target.value))}
                        className="w-full accent-cyan-400"
                    />
                </div>

                <div className="min-h-[160px] bg-text-main/5 border border-border-main rounded-[32px] p-8 flex flex-wrap items-center justify-center gap-4">
                    <AnimatePresence mode="popLayout">
                        {results.length > 0 ? results.map((n, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                className="w-16 h-16 bg-text-main text-bg-main rounded-2xl flex items-center justify-center text-xl font-black shadow-lg"
                            >
                                {n}
                            </motion.div>
                        )) : (
                            <div className="flex flex-col items-center gap-4 opacity-10">
                                <Sparkles size={48} />
                                <span className="text-xs font-black uppercase tracking-[4px]">Sorteie agora</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <button onClick={generateNumbers} className="py-5 bg-cyan-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:bg-cyan-400 active:scale-95 transition-all flex items-center justify-center gap-3">
                        <RefreshCw size={18} /> SORTEAR
                    </button>
                    <button
                        onClick={() => { navigator.clipboard.writeText(results.join(', ')); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        disabled={results.length === 0}
                        className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        {copied ? 'Copiado' : 'Copiar Tudo'}
                    </button>
                </div>
            </div>
        </div>
    );
}
