"use client";

import React, { useState, useMemo } from 'react';
import { Info, ArrowRight, Binary, Hexagon, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RadixVisualizer() {
    const [number, setNumber] = useState('255');
    const [fromBase, setFromBase] = useState(10);
    const [toBase, setToBase] = useState(2);

    const conversion = useMemo(() => {
        try {
            const decimal = parseInt(number, fromBase);
            if (isNaN(decimal)) return null;

            const result = decimal.toString(toBase).toUpperCase();

            // Generate steps for decimal to toBase (division method)
            const steps = [];
            let temp = decimal;
            if (temp === 0) steps.push({ q: 0, r: 0 });
            while (temp > 0) {
                steps.push({
                    q: Math.floor(temp / toBase),
                    r: temp % toBase,
                    val: (temp % toBase).toString(toBase).toUpperCase()
                });
                temp = Math.floor(temp / toBase);
            }

            return { decimal, result, steps };
        } catch (e) {
            return null;
        }
    }, [number, fromBase, toBase]);

    const bases = [
        { val: 2, name: 'Binário', icon: <Binary size={14} /> },
        { val: 8, name: 'Octal', icon: <Hash size={14} /> },
        { val: 10, name: 'Decimal', icon: <Hash size={14} /> },
        { val: 16, name: 'Hexadecimal', icon: <Hexagon size={14} /> },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Número de Entrada</label>
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full bg-text-main/5 border border-border-main rounded-2xl px-6 py-4 font-mono font-bold text-xl outline-none focus:ring-2 focus:ring-text-main/10"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Da Base</label>
                    <div className="grid grid-cols-2 gap-2">
                        {bases.map(b => (
                            <button
                                key={b.val}
                                onClick={() => setFromBase(b.val)}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all",
                                    fromBase === b.val ? "bg-text-main text-bg-main border-transparent" : "bg-text-main/5 border-border-main"
                                )}
                            >
                                {b.icon} {b.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Para Base</label>
                    <div className="grid grid-cols-2 gap-2">
                        {bases.map(b => (
                            <button
                                key={b.val}
                                onClick={() => setToBase(b.val)}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all",
                                    toBase === b.val ? "bg-text-main text-bg-main border-transparent" : "bg-text-main/5 border-border-main"
                                )}
                            >
                                {b.icon} {b.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {conversion && (
                <div className="space-y-6">
                    <div className="p-8 bg-text-main text-bg-main rounded-[32px] text-center shadow-2xl">
                        <p className="text-[10px] font-black uppercase tracking-[4px] opacity-60 mb-2">Resultado</p>
                        <h3 className="text-5xl font-black break-all">{conversion.result}</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-text-main/5 border border-border-main rounded-[32px] p-8">
                            <h4 className="font-bold flex items-center gap-2 mb-6">
                                <Info size={18} className="text-blue-500" /> Passo a Passo (Dec para {bases.find(b => b.val === toBase)?.name})
                            </h4>
                            <div className="space-y-3">
                                {conversion.steps.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4 font-mono text-sm border-b border-border-main/5 pb-2 last:border-0">
                                        <span className="opacity-30">#{idx + 1}</span>
                                        <span className="flex-1">Resto de <strong>{(step.q * toBase + step.r)}</strong> / {toBase}</span>
                                        <ArrowRight size={14} className="opacity-40" />
                                        <span className="font-bold text-lg">{step.val}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-[10px] font-bold opacity-40 uppercase tracking-widest leading-relaxed">
                                Leia os restos de baixo para cima (ou da direita para a esquerda) para obter o resultado final.
                            </p>
                        </div>

                        <div className="bg-text-main/5 border border-border-main rounded-[32px] p-8 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                                <Hash size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Decimal Equivalente</p>
                            <h4 className="text-3xl font-black">{conversion.decimal}</h4>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
