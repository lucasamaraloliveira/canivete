'use client';

import React, { useState } from 'react';
import { CreditCard, Copy, Check, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CnhGenerator() {
    const [cnh, setCnh] = useState('');
    const [copied, setCopied] = useState(false);

    const generateCNH = () => {
        const rnd = () => Math.floor(Math.random() * 9).toString();
        let num = Array.from({ length: 9 }, rnd).join('');

        const calculateDigits = (base: string) => {
            let sum = 0;
            for (let i = 0, j = 9; i < 9; i++, j--) {
                sum += parseInt(base[i]) * j;
            }
            let d1 = sum % 11;
            let inc = 0;
            if (d1 >= 10) {
                d1 = 0;
                inc = 2;
            }

            sum = 0;
            for (let i = 0, j = 1; i < 9; i++, j++) {
                sum += parseInt(base[i]) * j;
            }
            let d2 = sum % 11;
            if (d2 >= 10) d2 = 0;

            d2 = d2 - inc;
            if (d2 < 0) d2 = d2 + 11;
            if (d2 >= 10) d2 = 0;

            return `${d1}${d2}`;
        };

        const digits = calculateDigits(num);
        setCnh(num + digits);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4">
                    <CreditCard size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de CNH</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Geração de números de Carteira Nacional de Habilitação (CNH) válidos para testes de cadastro.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-8 text-center">
                    <div className="relative bg-text-main/5 border border-border-main rounded-[32px] p-10 flex items-center justify-center min-h-[140px]">
                        {cnh ? (
                            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl sm:text-5xl font-black tracking-[10px] font-mono">
                                {cnh}
                            </motion.span>
                        ) : (
                            <span className="text-sm font-bold uppercase tracking-[4px] opacity-20 italic">Pronto para Gerar</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generateCNH} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Gerar CNH
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(cnh); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!cnh} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
