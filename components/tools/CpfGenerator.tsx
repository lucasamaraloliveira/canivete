'use client';

import React, { useState } from 'react';
import { Fingerprint, Copy, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CpfGenerator() {
    const [cpf, setCpf] = useState('');
    const [withMask, setWithMask] = useState(true);
    const [copied, setCopied] = useState(false);

    const generateCPF = () => {
        const rnd = (n: number) => Math.round(Math.random() * n);
        const mod = (base: number, div: number) => Math.round(base - Math.floor(base / div) * div);

        const n: number[] = Array.from({ length: 9 }, () => rnd(9));

        let d1 = n.reduce((acc, val, idx) => acc + val * (10 - idx), 0);
        d1 = 11 - mod(d1, 11);
        if (d1 >= 10) d1 = 0;

        let d2 = n.reduce((acc, val, idx) => acc + val * (11 - idx), 0) + (d1 * 2);
        d2 = 11 - mod(d2, 11);
        if (d2 >= 10) d2 = 0;

        const res = [...n, d1, d2].join('');
        setCpf(withMask ? res.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : res);
    };

    const handleCopy = () => {
        if (!cpf) return;
        navigator.clipboard.writeText(cpf);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4">
                    <Fingerprint size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de CPF</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere CPFs válidos para fins de testes e homologação de software de forma rápida e segura.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <ShieldCheck size={120} />
                </div>

                <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={withMask}
                                    onChange={() => setWithMask(!withMask)}
                                />
                                <div className={cn(
                                    "w-10 h-6 rounded-full transition-colors duration-300",
                                    withMask ? "bg-text-main" : "bg-text-main/10"
                                )} />
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 bg-bg-main rounded-full transition-transform duration-300",
                                    withMask && "translate-x-4"
                                )} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Usar Máscara</span>
                        </label>
                    </div>

                    <div className="relative group/field">
                        <div className="absolute inset-0 bg-text-main/5 rounded-[32px] blur-xl opacity-0 group-hover/field:opacity-100 transition-opacity" />
                        <div className="relative bg-text-main/5 border border-border-main rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[140px]">
                            {cpf ? (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-4xl sm:text-5xl font-black tracking-tighter font-mono"
                                >
                                    {cpf}
                                </motion.span>
                            ) : (
                                <span className="text-sm font-bold uppercase tracking-[4px] opacity-20 italic">Clique para Gerar</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={generateCPF}
                            className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <RefreshCw size={18} /> Gerar Novo
                        </button>
                        <button
                            onClick={handleCopy}
                            disabled={!cpf}
                            className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                        >
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-text-main/5 rounded-[32px] p-6 border border-border-main border-dashed">
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest leading-relaxed text-center italic">
                    Aviso: Esta ferramenta gera apenas dados estruturalmente válidos para testes. Não utilize para fins reais ou ilícitos.
                </p>
            </div>
        </div>
    );
}
