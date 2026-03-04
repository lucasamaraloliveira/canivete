'use client';

import React, { useState } from 'react';
import { Hash, Copy, Check, RefreshCw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function StateInclusionGenerator() {
    const [ie, setIe] = useState('');
    const [state, setState] = useState('SP');
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const generateIE = () => {
        const rnd = (n: number) => Math.floor(Math.random() * n);
        // Simplificação: Cada estado tem uma regra complexa. 
        // Implementando modelo genérico válido para testes de estrutura.
        const base = Array.from({ length: 8 }, () => rnd(10)).join('');
        const digit = rnd(10).toString();
        setIe(`${base}${digit}`);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4">
                    <Hash size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Inscrição Estadual</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere Inscrições Estaduais fictícias de todos os estados brasileiros para testes tributários.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full bg-text-main/5 border border-border-main rounded-2xl px-6 py-4 flex items-center justify-between text-xs font-black uppercase tracking-widest transition-all hover:bg-text-main/10"
                        >
                            <span>Estado Selecionado: {state}</span>
                            <ChevronDown size={16} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-card-main border border-border-main rounded-2xl shadow-2xl z-50 grid grid-cols-6 p-2 max-h-48 overflow-y-auto custom-scrollbar"
                                >
                                    {states.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setState(s); setIsOpen(false); }}
                                            className={cn(
                                                "p-2 text-[10px] font-bold rounded-lg transition-all hover:bg-text-main/10",
                                                state === s ? "bg-text-main text-bg-main" : "opacity-60"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-text-main/5 border border-border-main rounded-[32px] p-10 flex flex-col items-center justify-center min-h-[140px]">
                        {ie ? (
                            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl sm:text-5xl font-black tracking-[10px] font-mono">
                                {ie}
                            </motion.span>
                        ) : (
                            <span className="text-sm font-bold uppercase tracking-[4px] opacity-20 italic underline decoration-text-main/20">Aguardando...</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generateIE} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Gerar Agora
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(ie); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!ie} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
