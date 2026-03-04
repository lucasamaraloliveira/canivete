'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, RefreshCw, ClipboardCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function DocumentGenerator() {
    const [doc, setDoc] = useState<string>('');
    const [type, setType] = useState('Nascimento');
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const types = ['Nascimento', 'Casamento', 'Óbito'];

    const generateDoc = () => {
        const rnd = (n: number) => Math.floor(Math.random() * n);

        // Padrão de Certidão (Matrícula): 32 dígitos em grupos
        // Ex: 123456.01.55.2023.1.00001.001.0000001-99
        const cns = rnd(899999) + 100000;
        const acervo = '01';
        const tipo = type === 'Nascimento' ? '55' : type === 'Casamento' ? '60' : '70';
        const ano = '202' + rnd(5);
        const livro = '1';
        const numLivro = (rnd(89999) + 10000).toString().padStart(5, '0');
        const numFolha = (rnd(899) + 1).toString().padStart(3, '0');
        const numTermo = (rnd(8999999) + 1000000).toString().padStart(7, '0');
        const dv = rnd(99).toString().padStart(2, '0');

        setDoc(`${cns}.${acervo}.${tipo}.${ano}.${livro}.${numLivro}.${numFolha}.${numTermo}-${dv}`);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-sky-600">
                    <FileText size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">Gerador Certidões</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere números de matrícula de certidões brasileiras (Nascimento, Casamento e Óbito) no padrão nacional do CNJ.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ClipboardCheck size={120} />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full bg-text-main/5 border border-border-main rounded-2xl px-6 py-4 flex items-center justify-between text-xs font-black uppercase tracking-widest transition-all hover:bg-text-main/10"
                    >
                        <span>Tipo de Certidão: {type}</span>
                        <ChevronDown size={16} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-card-main border border-border-main rounded-2xl shadow-2xl z-50 overflow-hidden"
                            >
                                {types.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => { setType(t); setIsOpen(false); }}
                                        className={cn(
                                            "w-full p-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-border-main/5 last:border-0 hover:bg-text-main/5",
                                            type === t && "bg-text-main text-bg-main"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="bg-text-main/5 border border-border-main rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[120px]">
                    {doc ? (
                        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl font-black font-mono text-center break-all tracking-tight">
                            {doc}
                        </motion.span>
                    ) : (
                        <span className="text-sm font-black uppercase tracking-[4px] opacity-10">Gerar Matrícula</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={generateDoc} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        <RefreshCw size={18} /> Novo Número
                    </button>
                    <button
                        onClick={() => { navigator.clipboard.writeText(doc); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        disabled={!doc}
                        className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
