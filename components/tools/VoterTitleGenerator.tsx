'use client';

import React, { useState } from 'react';
import { ClipboardCheck, Copy, Check, RefreshCw, Vote } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function VoterTitleGenerator() {
    const [title, setTitle] = useState('');
    const [copied, setCopied] = useState(false);

    const generateTitle = () => {
        const rnd = (n: number) => Math.floor(Math.random() * n);

        // 8 dígitos sequenciais
        const n = Array.from({ length: 8 }, () => rnd(10));

        // Estado (01 a 28)
        const st = rnd(28) + 1;
        const stStr = st.toString().padStart(2, '0');

        const base = [...n, parseInt(stStr[0]), parseInt(stStr[1])];

        // Primeiro dígito (baseado nos 8 primeiros)
        let sum1 = 0;
        const w1 = [2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 8; i++) sum1 += n[i] * w1[i];
        let d1 = sum1 % 11;
        if (d1 === 10) d1 = 0;

        // Segundo dígito (baseado na UF + d1)
        const base2 = [parseInt(stStr[0]), parseInt(stStr[1]), d1];
        const w2 = [7, 8, 9];
        let sum2 = 0;
        for (let i = 0; i < 3; i++) sum2 += base2[i] * w2[i];
        let d2 = sum2 % 11;
        if (d2 === 10) d2 = 0;

        const res = n.join('') + stStr + d1.toString() + d2.toString();
        setTitle(res.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'));
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-purple-500">
                    <Vote size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Título de Eleitor</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Geração de números de Título de Eleitor válidos seguindo o algoritmo e código de estado oficial da Justiça Eleitoral.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <ClipboardCheck size={120} />
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="bg-text-main/5 border border-border-main rounded-[32px] p-10 flex flex-col items-center justify-center gap-4">
                        {title ? (
                            <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                                {title}
                            </motion.span>
                        ) : (
                            <div className="py-8 opacity-20">
                                <span className="text-sm font-bold uppercase tracking-[4px]">Aguardando Geração</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generateTitle} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Novo Título
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(title); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!title} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
