'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Clock, Info, RotateCcw, Plus, Minus, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays, subDays, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Mode = 'diff' | 'add' | 'sub';

export function DateTools() {
    const [mode, setMode] = useState<Mode>('diff');
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [amount, setAmount] = useState('0');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const num = parseInt(amount) || 0;

        if (!isValid(start)) return;

        switch (mode) {
            case 'diff':
                if (isValid(end)) {
                    const diff = differenceInDays(end, start);
                    setResult({
                        value: Math.abs(diff),
                        label: Math.abs(diff) === 1 ? 'dia de diferença' : 'dias de diferença',
                        isNegative: diff < 0
                    });
                }
                break;
            case 'add':
                const added = addDays(start, num);
                setResult({
                    value: format(added, "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
                    raw: format(added, 'dd/MM/yyyy')
                });
                break;
            case 'sub':
                const subbed = subDays(start, num);
                setResult({
                    value: format(subbed, "eeee, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
                    raw: format(subbed, 'dd/MM/yyyy')
                });
                break;
        }
    };

    useEffect(() => {
        calculate();
    }, [mode, startDate, endDate, amount]);

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-orange-500">
                    <Calendar size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Calculadora de Datas</h2>
                <div className="flex bg-text-main/5 p-1 rounded-2xl mt-4">
                    {[
                        { id: 'diff', icon: History, label: 'Diferença' },
                        { id: 'add', icon: Plus, label: 'Somar' },
                        { id: 'sub', icon: Minus, label: 'Subtrair' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setMode(item.id as Mode); setResult(null); }}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                mode === item.id ? "bg-text-main text-bg-main shadow-lg" : "opacity-40 hover:opacity-100"
                            )}
                        >
                            <item.icon size={14} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black uppercase tracking-[3px] opacity-40 ml-4 flex items-center gap-2">
                                <Clock size={12} /> Data Inicial
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-text-main/5 border border-border-main rounded-3xl p-6 text-xl font-black outline-none focus:ring-4 focus:ring-orange-500/10 transition-all color-scheme-dark"
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {mode === 'diff' ? (
                                <motion.div
                                    key="diff-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col gap-4"
                                >
                                    <label className="text-[10px] font-black uppercase tracking-[3px] opacity-40 ml-4">Data Final</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-text-main/5 border border-border-main rounded-3xl p-6 text-xl font-black outline-none focus:ring-4 focus:ring-orange-500/10 transition-all color-scheme-dark"
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="amount-input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col gap-4"
                                >
                                    <label className="text-[10px] font-black uppercase tracking-[3px] opacity-40 ml-4">Quantidade de Dias</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={amount}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                setAmount(val || '0');
                                            }}
                                            placeholder="0"
                                            className="w-full bg-text-main/5 border border-border-main rounded-3xl p-6 text-xl font-black outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest opacity-20 pointer-events-none">DIAS</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-text-main/5 border border-border-main rounded-full flex items-center justify-center text-orange-500/40">
                            <ArrowRight size={24} />
                        </div>
                    </div>

                    <div className="p-10 bg-orange-500 text-white rounded-[40px] shadow-2xl shadow-orange-500/20 flex flex-col items-center justify-center gap-3 relative overflow-hidden group/result">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <p className="text-[10px] font-black uppercase tracking-[5px] opacity-60">Resultado da Operação</p>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={result?.value + mode}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <h4 className={cn(
                                    "font-black tracking-tighter leading-tight",
                                    mode === 'diff' ? "text-6xl sm:text-7xl" : "text-2xl sm:text-3xl uppercase"
                                )}>
                                    {result?.value || '0'}
                                </h4>
                                {mode === 'diff' && (
                                    <span className="text-[10px] font-black uppercase tracking-[4px] opacity-60 mt-2">
                                        {result?.label}
                                        {result?.isNegative && " (No passado)"}
                                    </span>
                                )}
                                {(mode === 'add' || mode === 'sub') && result?.raw && (
                                    <span className="text-4xl font-black tracking-tighter opacity-40 mt-4 border-t border-white/10 pt-4 w-full">
                                        {result.raw}
                                    </span>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="absolute bottom-4 right-8 opacity-20 group-hover/result:opacity-40 transition-opacity">
                            <RotateCcw size={40} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-[32px] flex items-center gap-6">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <Info size={24} />
                </div>
                <p className="text-[10px] font-bold text-orange-500/80 uppercase tracking-widest leading-relaxed">
                    Operações realizadas com base no calendário gregoriano. O resultado considera bissextos e variações de dias nos meses automaticamente.
                </p>
            </div>
        </div>
    );
}
