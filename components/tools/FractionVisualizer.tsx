import React, { useState } from 'react';
import { PieChart, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FractionVisualizer() {
    const [numerator, setNumerator] = useState(1);
    const [denominator, setDenominator] = useState(4);

    const updateNumerator = (delta: number) => {
        setNumerator(prev => Math.max(1, Math.min(denominator, prev + delta)));
    };

    const updateDenominator = (delta: number) => {
        setDenominator(prev => {
            const next = Math.max(2, Math.min(20, prev + delta));
            if (numerator > next) setNumerator(next);
            return next;
        });
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <PieChart size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Fraction Visualizer</h3>
                <p className="text-text-main/50">Visualização interativa para compreensão de frações matemáticas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-bg-main p-8 rounded-[40px] border border-border-main flex flex-col items-center justify-center gap-6 shadow-xl leading-none">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => updateNumerator(-1)} className="p-2 hover:bg-text-main/10 rounded-xl transition-colors"><Minus size={18} /></button>
                            <span className="text-5xl font-black min-w-[60px] text-center">{numerator}</span>
                            <button onClick={() => updateNumerator(1)} className="p-2 hover:bg-text-main/10 rounded-xl transition-colors"><Plus size={18} /></button>
                        </div>
                        <div className="w-24 h-2 bg-text-main rounded-full" />
                        <div className="flex items-center gap-4">
                            <button onClick={() => updateDenominator(-1)} className="p-2 hover:bg-text-main/10 rounded-xl transition-colors"><Minus size={18} /></button>
                            <span className="text-5xl font-black min-w-[60px] text-center">{denominator}</span>
                            <button onClick={() => updateDenominator(1)} className="p-2 hover:bg-text-main/10 rounded-xl transition-colors"><Plus size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-main p-8 rounded-[40px] border border-border-main flex flex-col items-center justify-center shadow-xl">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="32"
                                className="text-text-main/5"
                            />
                            <circle
                                cx="96"
                                cy="96"
                                r="80"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="32"
                                strokeDasharray={502.65}
                                strokeDashoffset={502.65 - (502.65 * numerator / denominator)}
                                className="text-text-main transition-all duration-500"
                            />
                            {/* Slice lines */}
                            {[...Array(denominator)].map((_, i) => (
                                <line
                                    key={i}
                                    x1="96" y1="96"
                                    x2={96 + 80 * Math.cos(2 * Math.PI * i / denominator)}
                                    y2={96 + 80 * Math.sin(2 * Math.PI * i / denominator)}
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="text-bg-main/40"
                                />
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xl opacity-20">
                            {Math.round(numerator / denominator * 100)}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <div className="flex gap-2">
                    {[...Array(denominator)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 h-3 rounded-full transition-all duration-300",
                                i < numerator ? "bg-text-main" : "bg-text-main/5"
                            )}
                        />
                    ))}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 text-center mt-2">
                    Visualização em Barra
                </div>
            </div>
        </div>
    );
}
