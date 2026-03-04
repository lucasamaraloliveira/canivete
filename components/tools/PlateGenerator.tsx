'use client';

import React, { useState } from 'react';
import { Disc, Copy, Check, RefreshCw, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PlateGenerator() {
    const [plate, setPlate] = useState('');
    const [type, setType] = useState<'Mercosul' | 'Padrão'>('Mercosul');
    const [copied, setCopied] = useState(false);

    const generatePlate = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        const rL = () => letters[Math.floor(Math.random() * letters.length)];
        const rN = () => numbers[Math.floor(Math.random() * numbers.length)];

        if (type === 'Mercosul') {
            // Padrão: LLL N L NN (Ex: ABC 1 D 23)
            setPlate(`${rL()}${rL()}${rL()}${rN()}${rL()}${rN()}${rN()}`);
        } else {
            // Padrão: LLL-NNNN (Ex: ABC-1234)
            setPlate(`${rL()}${rL()}${rL()}-${rN()}${rN()}${rN()}${rN()}`);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 bg-text-main/5 text-text-main rounded-[32px] flex items-center justify-center shadow-2xl mb-4 text-slate-500">
                    <Disc size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Placa de Veículos</h2>
                <p className="max-w-md text-sm font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                    Geração de placas no padrão Mercosul e antigo para validação de sistemas de monitoramento.
                </p>
            </div>

            <div className="bg-card-main border border-border-main rounded-[48px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex bg-text-main/5 p-1.5 rounded-2xl">
                        {['Mercosul', 'Padrão'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t as any)}
                                className={cn(
                                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    type === t ? "bg-text-main text-bg-main shadow-lg" : "opacity-40 hover:opacity-100"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex flex-col items-center justify-center">
                        <div className="w-full max-w-[320px] aspect-[3/1] bg-white border-[6px] border-black rounded-lg flex flex-col overflow-hidden shadow-2xl">
                            {type === 'Mercosul' ? (
                                <>
                                    <div className="h-1/3 bg-[#003399] flex items-center justify-between px-4 text-white">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-2 bg-yellow-400 rounded-sm" />
                                            <span className="text-[6px] font-bold">BRASIL</span>
                                        </div>
                                        <span className="text-[10px] font-bold tracking-tighter">MERCOSUL</span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center px-4">
                                        <span className="text-4xl sm:text-5xl font-black tracking-[4px] text-black font-mono">
                                            {plate || 'ABC1D23'}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="h-1/4 bg-slate-100 border-b-4 border-black flex items-center justify-center px-4">
                                        <span className="text-[8px] font-extrabold text-black/60 tracking-widest">BR - SÃO PAULO</span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center px-4 bg-slate-50">
                                        <span className="text-4xl sm:text-5xl font-black tracking-[2px] text-black font-mono">
                                            {plate || 'ABC-1234'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={generatePlate} className="py-5 bg-text-main text-bg-main rounded-[24px] font-black text-xs uppercase tracking-[4px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <RefreshCw size={18} /> Gerar Placa
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(plate); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!plate} className="py-5 bg-text-main/5 border border-border-main rounded-[24px] font-black text-xs uppercase tracking-[4px] hover:bg-text-main/10 transition-all flex items-center justify-center gap-3 disabled:opacity-20">
                            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
