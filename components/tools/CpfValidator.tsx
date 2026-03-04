'use client';

import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, XCircle, Search, Eraser, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CpfValidator() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<{ isValid: boolean; message: string } | null>(null);

    const validateCPF = (val: string) => {
        const cpf = val.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return { isValid: false, message: 'Formato inválido ou números repetidos.' };

        const calculateDigit = (slice: string, factor: number) => {
            let sum = 0;
            for (let i = 0; i < slice.length; i++) {
                sum += parseInt(slice[i]) * (factor - i);
            }
            const rev = 11 - (sum % 11);
            return rev >= 10 ? 0 : rev;
        };

        const d1 = calculateDigit(cpf.substring(0, 9), 10);
        const d2 = calculateDigit(cpf.substring(0, 10), 11);

        if (parseInt(cpf[9]) === d1 && parseInt(cpf[10]) === d2) {
            return { isValid: true, message: 'CPF estruturalmente válido.' };
        }
        return { isValid: false, message: 'Dígitos verificadores incorretos.' };
    };

    const handleCheck = () => {
        if (!input) return;
        setResult(validateCPF(input));
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-emerald-500">
                    <Fingerprint size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Validador de CPF</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Verifique a validade estrutural de um CPF instantaneamente através do algoritmo oficial.
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
                            placeholder="000.000.000-00"
                            className="w-full bg-text-main/5 border border-border-main rounded-[32px] p-8 text-center text-3xl font-black font-mono outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:opacity-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleCheck}
                            disabled={!input}
                            className="py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:bg-emerald-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                        >
                            <Search size={18} /> Validar Agora
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
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "p-8 rounded-[32px] border flex flex-col items-center text-center gap-4 transition-colors",
                                    result.isValid ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                                )}
                            >
                                {result.isValid ? (
                                    <CheckCircle2 size={48} className="text-emerald-500" />
                                ) : (
                                    <XCircle size={48} className="text-red-500" />
                                )}
                                <div>
                                    <h3 className={cn("text-xl font-black uppercase tracking-tighter", result.isValid ? "text-emerald-500" : "text-red-500")}>
                                        {result.isValid ? 'Documento Válido' : 'Documento Inválido'}
                                    </h3>
                                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{result.message}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="bg-text-main/5 rounded-[32px] p-6 border border-border-main border-dashed">
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest leading-relaxed text-center italic">
                    Nota: Este validador verifica apenas a integridade matemática do número. Não consulta bases de dados da Receita Federal.
                </p>
            </div>
        </div>
    );
}
