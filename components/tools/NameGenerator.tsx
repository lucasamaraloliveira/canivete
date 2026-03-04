'use client';

import React, { useState } from 'react';
import { Type, Copy, Check, RefreshCw, User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function NameGenerator() {
    const [names, setNames] = useState<string[]>([]);
    const [count, setCount] = useState(5);
    const [gender, setGender] = useState<'All' | 'Male' | 'Female'>('All');
    const [copied, setCopied] = useState(false);

    const generateNames = () => {
        const male = ['Lucas', 'Mateus', 'Gabriel', 'Felipe', 'Vinicius', 'Gustavo', 'Pedro', 'Guilherme', 'Thiago', 'Bruno'];
        const female = ['Ana', 'Julia', 'Beatriz', 'Mariana', 'Larissa', 'Fernanda', 'Camila', 'Leticia', 'Amanda', 'Bruna'];
        const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida'];

        const newNames = [];
        for (let i = 0; i < count; i++) {
            let pool = gender === 'Male' ? male : gender === 'Female' ? female : [...male, ...female];
            const first = pool[Math.floor(Math.random() * pool.length)];
            const last1 = lastNames[Math.floor(Math.random() * lastNames.length)];
            const last2 = lastNames[Math.floor(Math.random() * lastNames.length)];
            newNames.push(`${first} ${last1} ${last2}`);
        }
        setNames(newNames);
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-sky-500">
                    <Type size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Gerador de Nomes</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Gere listas de nomes brasileiros realistas para preenchimento de bancos de dados mas de teste.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-text-main/5 p-1.5 rounded-2xl flex gap-1">
                        {['All', 'Male', 'Female'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGender(g as any)}
                                className={cn(
                                    "flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                                    gender === g ? "bg-text-main text-bg-main" : "opacity-40 hover:opacity-100"
                                )}
                            >
                                {g === 'All' ? 'Todos' : g === 'Male' ? 'Masc' : 'Fem'}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 bg-text-main/5 px-4 py-3 rounded-2xl flex items-center justify-between border border-border-main/10">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Qtd: {count}</span>
                        <input
                            type="range" min="1" max="20" value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            className="w-24 accent-text-main"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-h-[300px]">
                    <AnimatePresence mode="popLayout">
                        {names.length > 0 ? names.map((name, idx) => (
                            <motion.div
                                key={name + idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 bg-text-main/5 rounded-2xl flex items-center justify-between group hover:bg-text-main/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-text-main/5 rounded-xl flex items-center justify-center text-text-main group-hover:bg-text-main group-hover:text-bg-main transition-colors">
                                        <User size={16} />
                                    </div>
                                    <span className="font-bold text-sm tracking-tight">{name}</span>
                                </div>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(name); }}
                                    className="p-2 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity"
                                >
                                    <Copy size={14} />
                                </button>
                            </motion.div>
                        )) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-10">
                                <Users size={64} className="mb-4" />
                                <span className="text-xs font-black uppercase tracking-[4px]">Clique para Listar</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={generateNames} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        <RefreshCw size={18} /> Gerar Lista
                    </button>
                    <button
                        onClick={() => { navigator.clipboard.writeText(names.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        disabled={names.length === 0}
                        className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        {copied ? 'Copiado' : 'Copiar Tudo'}
                    </button>
                </div>
            </div>
        </div>
    );
}
