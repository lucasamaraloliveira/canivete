'use client';

import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue/i18n';
import { Clock, Calendar, Info, AlertCircle, RefreshCw } from 'lucide-react';

export function CronVisualizer() {
    const [cron, setCron] = useState('*/15 * * * *');
    const [explanation, setExplanation] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            if (!cron.trim()) {
                setExplanation('');
                setError(null);
                return;
            }
            const description = cronstrue.toString(cron, { locale: "pt_BR" });
            setExplanation(description);
            setError(null);
        } catch (e: any) {
            setError(e.toString());
            setExplanation('');
        }
    }, [cron]);

    const commonCrons = [
        { label: 'A cada minuto', value: '* * * * *' },
        { label: 'A cada 5 minutos', value: '*/5 * * * *' },
        { label: 'Toda hora (início)', value: '0 * * * *' },
        { label: 'Todo dia (meia-noite)', value: '0 0 * * *' },
        { label: 'Todo domingo', value: '0 0 * * 0' },
        { label: 'Primeiro dia do mês', value: '0 0 1 * *' },
    ];

    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4 border border-border-main/10 shadow-sm">
                    <Clock size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-text-main">Cron Job Visualizer</h3>
                <p className="text-text-main/50">Traduza expressões cron complexas para linguagem humana.</p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="relative group">
                    <input
                        value={cron}
                        onChange={(e) => setCron(e.target.value)}
                        className="w-full p-6 font-mono text-2xl text-center bg-bg-main border border-border-main rounded-[32px] focus:ring-4 focus:ring-text-main/5 outline-none transition-all shadow-sm group-hover:shadow-md"
                        placeholder="* * * * *"
                    />
                    <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                        <div className="px-4 py-1 bg-card-main border border-border-main rounded-full text-[10px] font-black uppercase tracking-widest opacity-40 shadow-sm">
                            min hr dia mês d-sem
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {error ? (
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center gap-4 text-red-600 dark:text-red-400">
                            <AlertCircle size={24} className="shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Expressão Inválida</span>
                                <p className="font-mono text-sm">{error}</p>
                            </div>
                        </div>
                    ) : explanation && (
                        <div className="p-8 bg-text-main text-bg-main rounded-[32px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                                <Calendar size={80} />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-3 block">Agendamento Descrito</span>
                                <p className="text-xl lg:text-2xl font-bold leading-tight uppercase font-sans tracking-tight italic">
                                    "{explanation}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {commonCrons.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => setCron(c.value)}
                            className="p-4 bg-card-main border border-border-main rounded-2xl text-xs font-bold hover:bg-text-main/5 transition-all text-left flex items-center justify-between group"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="opacity-40 text-[9px] uppercase tracking-wider">{c.label}</span>
                                <span className="font-mono">{c.value}</span>
                            </div>
                            <RefreshCw size={14} className="opacity-0 group-hover:opacity-20 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-text-main/5 rounded-2xl flex items-center gap-4 border border-border-main/5">
                <Info size={18} className="text-text-main/40 shrink-0" />
                <p className="text-xs text-text-main/60 leading-relaxed italic">
                    Expressoes cron vindo de sistemas Unix/Linux permitem agendar tarefas repetitivas.
                    Use o campo acima para entender quando sua rotina será executada.
                </p>
            </div>
        </div>
    );
}
