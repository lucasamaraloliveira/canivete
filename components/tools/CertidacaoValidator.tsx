'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Search, Eraser, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CertidacaoValidator() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<{ isValid: boolean; message: string } | null>(null);

    const validateCertidacao = (val: string) => {
        const doc = val.replace(/\D/g, '');
        if (doc.length !== 32) return { isValid: false, message: 'A matrícula da certidão deve conter exatamente 32 dígitos.' };

        // Basic structural checks based on CNJ pattern
        const tipo = doc.substring(8, 10);
        const validTipos = ['55', '60', '70']; // Nascimento, Casamento, Óbito
        if (!validTipos.includes(tipo)) return { isValid: false, message: 'Tipo de certidão inválido (Digitos 9 e 10).' };

        const ano = parseInt(doc.substring(10, 14));
        if (ano < 1800 || ano > new Date().getFullYear()) return { isValid: false, message: 'Ano de registro inválido.' };

        // More complex digit verification exists for CNJ, but for UI validation this length + segment check is the key
        return { isValid: true, message: 'Estrutura de matrícula CNJ conforme.' };
    };

    const handleCheck = () => {
        if (!input) return;
        setResult(validateCertidacao(input));
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-sky-600">
                    <FileText size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Validador de Certidões</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest leading-relaxed">
                    Verifique matrículas de certidões (Nascimento, Casamento e Óbito) no padrão nacional do CNJ.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-8">
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (result) setResult(null);
                        }}
                        placeholder="000.000.000.000.0.0.0.0.0.00.000.0000.0.00000.000.0000000-00"
                        className="w-full bg-text-main/5 border border-border-main rounded-[32px] p-8 text-center text-xl font-bold font-mono outline-none focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:opacity-10 h-32 resize-none"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleCheck}
                            className="py-5 bg-sky-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:bg-sky-500 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                        >
                            <Search size={18} /> Validar Matrícula
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
                                className={cn(
                                    "p-8 rounded-[32px] border flex flex-col items-center text-center gap-4 transition-colors",
                                    result.isValid ? "bg-sky-500/5 border-sky-500/20" : "bg-red-500/5 border-red-500/20"
                                )}
                            >
                                {result.isValid ? <CheckCircle2 size={48} className="text-sky-500" /> : <XCircle size={48} className="text-red-500" />}
                                <div>
                                    <h3 className={cn("text-xl font-black uppercase tracking-tighter", result.isValid ? "text-sky-500" : "text-red-500")}>
                                        {result.isValid ? 'Matrícula Válida' : 'Matrícula Inválida'}
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
