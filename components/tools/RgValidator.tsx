'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, Eraser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function RgValidator() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<{ isValid: boolean; message: string } | null>(null);

    const validateRG = (val: string) => {
        const rg = val.replace(/[^\dX]/gi, '').toUpperCase();
        if (rg.length !== 9) return { isValid: false, message: 'O RG deve conter exatamente 9 dígitos (incluindo o DV).' };

        // SP Algorithm (Mod 11)
        const calculateDigit = (slice: string) => {
            let sum = 0;
            const factors = [2, 3, 4, 5, 6, 7, 8, 9];
            for (let i = 0; i < slice.length; i++) {
                sum += parseInt(slice[i]) * factors[i];
            }
            const remainder = sum % 11;
            if (remainder === 0) return '0';
            if (remainder === 1) return 'X';
            return (11 - remainder).toString();
        };

        const d1 = calculateDigit(rg.substring(0, 8));
        if (rg[8] === d1) {
            return { isValid: true, message: 'RG (Modelo SP) estruturalmente legítimo.' };
        }
        return { isValid: false, message: 'Dígito verificador não confere.' };
    };

    const handleCheck = () => {
        if (!input) return;
        setResult(validateRG(input));
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-orange-400">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Validador de RG</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest leading-relaxed">
                    Verifique a validade de registros gerais (modelo SP) seguindo o algoritmo oficial do DV.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-8">
                    <div className="relative group/field">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                if (result) setResult(null);
                            }}
                            placeholder="00.000.000-0"
                            className="w-full bg-text-main/5 border border-border-main rounded-[32px] p-8 text-center text-3xl font-black font-mono outline-none focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:opacity-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleCheck}
                            disabled={!input}
                            className="py-5 bg-orange-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:bg-orange-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                        >
                            <Search size={18} /> Validar RG
                        </button>
                        <button
                            onClick={() => { setInput(''); setResult(null); }}
                            className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3"
                        >
                            <Eraser size={18} /> Limpar
                        </button>
                    </div>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "p-8 rounded-[32px] border flex flex-col items-center text-center gap-4 transition-colors",
                                    result.isValid ? "bg-orange-500/5 border-orange-500/20" : "bg-red-500/5 border-red-500/20"
                                )}
                            >
                                {result.isValid ? (
                                    <CheckCircle2 size={48} className="text-orange-500" />
                                ) : (
                                    <XCircle size={48} className="text-red-500" />
                                )}
                                <div>
                                    <h3 className={cn("text-xl font-black uppercase tracking-tighter", result.isValid ? "text-orange-500" : "text-red-500")}>
                                        {result.isValid ? 'RG Legítimo' : 'RG Inválido'}
                                    </h3>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{result.message}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
