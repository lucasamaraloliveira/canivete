'use client';

import React, { useState } from 'react';
import { Users, CheckCircle2, XCircle, Search, Eraser, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PisValidator() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<{ isValid: boolean; message: string } | null>(null);

    const validatePIS = (val: string) => {
        const pis = val.replace(/\D/g, '');
        if (pis.length !== 11 || /^(\d)\1+$/.test(pis)) return { isValid: false, message: 'O PIS deve conter 11 dígitos numéricos.' };

        const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(pis[i]) * weights[i];
        }

        const rev = 11 - (sum % 11);
        const d1 = (rev >= 10) ? 0 : rev;

        if (parseInt(pis[10]) === d1) {
            return { isValid: true, message: 'PIS/PASEP estruturalmente legítimo.' };
        }
        return { isValid: false, message: 'Dígito verificador inválido.' };
    };

    const handleCheck = () => {
        if (!input) return;
        setResult(validatePIS(input));
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-purple-400">
                    <Users size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Validador PIS/PASEP</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest leading-relaxed">
                    Valide números do Programa de Integração Social através do algoritmo oficial de verificação.
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
                            placeholder="000.00000.00-0"
                            className="w-full bg-text-main/5 border border-border-main rounded-[32px] p-8 text-center text-3xl font-black font-mono outline-none focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:opacity-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleCheck}
                            disabled={!input}
                            className="py-5 bg-purple-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:bg-purple-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                        >
                            <Search size={18} /> Validar PIS
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
                                    result.isValid ? "bg-purple-500/5 border-purple-500/20" : "bg-red-500/5 border-red-500/20"
                                )}
                            >
                                {result.isValid ? (
                                    <CheckCircle2 size={48} className="text-purple-500" />
                                ) : (
                                    <XCircle size={48} className="text-red-500" />
                                )}
                                <div>
                                    <h3 className={cn("text-xl font-black uppercase tracking-tighter", result.isValid ? "text-purple-500" : "text-red-500")}>
                                        {result.isValid ? 'Número Válido' : 'Número Inválido'}
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
