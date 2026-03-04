'use client';

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function RgGenerator() {
    const [rg, setRg] = useState('');
    const [withMask, setWithMask] = useState(true);
    const [copied, setCopied] = useState(false);

    const generateRG = () => {
        const rnd = (n: number) => Math.floor(Math.random() * n);
        const n = Array.from({ length: 8 }, () => rnd(10));

        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += n[i] * (2 + i);
        }

        const mod = sum % 11;
        let lastDigit = 11 - mod;

        let finalDigit = lastDigit.toString();
        if (lastDigit === 10) finalDigit = 'X';
        if (lastDigit === 11) finalDigit = '0';

        const res = n.join('') + finalDigit;
        setRg(withMask ? res.replace(/(\d{2})(\d{3})(\d{3})([\dX])/, '$1.$2.$3-$4') : res);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de RG</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Crie números de RG estruturalmente corretos (modelo SP) para preenchimento de formulários de teste.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={withMask} onChange={() => setWithMask(!withMask)} />
                                <div className={cn("w-10 h-6 rounded-full transition-colors duration-300", withMask ? "bg-text-main" : "bg-text-main/10")} />
                                <div className={cn("absolute top-1 left-1 w-4 h-4 bg-bg-main rounded-full transition-transform duration-300", withMask && "translate-x-4")} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Usar Máscara</span>
                        </label>
                    </div>

                    <div className="relative bg-text-main/5 border border-border-main rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[140px]">
                        {rg ? (
                            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl sm:text-5xl font-black tracking-tighter font-mono">
                                {rg}
                            </motion.span>
                        ) : (
                            <span className="text-sm font-bold uppercase tracking-[4px] opacity-20 italic">Aguardando...</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generateRG} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Gerar Novo
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(rg); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!rg} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
