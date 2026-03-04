'use client';

import React, { useState } from 'react';
import { Users, Copy, Check, RefreshCw, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PisGenerator() {
    const [pis, setPis] = useState('');
    const [copied, setCopied] = useState(false);

    const generatePIS = () => {
        const rnd = (n: number) => Math.floor(Math.random() * n);
        const n = Array.from({ length: 10 }, () => rnd(10));

        const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = n.reduce((acc, val, idx) => acc + val * weights[idx], 0);

        const mod = sum % 11;
        let digit = 11 - mod;
        if (digit >= 10) digit = 0;

        const res = n.join('') + digit;
        setPis(res.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4'));
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-blue-500">
                    <Users size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de PIS/PASEP</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Crie números de PIS/PASEP válidos para homologação de sistemas de RH e folha de pagamento.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                    <Briefcase size={120} />
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="bg-text-main/5 border border-border-main rounded-[32px] p-10 flex flex-col items-center justify-center gap-4">
                        {pis ? (
                            <motion.span initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                                {pis}
                            </motion.span>
                        ) : (
                            <div className="py-8 opacity-20">
                                <span className="text-sm font-bold uppercase tracking-[4px]">Aguardando Geração</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generatePIS} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Novo PIS
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(pis); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!pis} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
