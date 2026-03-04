import React, { useState } from 'react';
import { Scale, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BmiCalculator() {
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);

    const bmi = weight / ((height / 100) ** 2);

    const getBmiStatus = () => {
        if (bmi < 18.5) return { label: 'Abaixo do Peso', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        if (bmi < 25) return { label: 'Peso Normal', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
        if (bmi < 30) return { label: 'Sobrepeso', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
        if (bmi < 35) return { label: 'Obesidade I', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
        return { label: 'Obesidade Severa', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    };

    const status = getBmiStatus();

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-8 py-10 lg:py-16">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <Scale size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">BMI Calculator</h3>
                <p className="text-text-main/50">Cálculo de IMC com feedback instantâneo de saúde.</p>
            </div>

            <div className="bg-bg-main p-8 rounded-[40px] border border-border-main space-y-10 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Peso (kg): {weight}</label>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="200"
                            value={weight}
                            onChange={(e) => setWeight(parseInt(e.target.value))}
                            className="w-full h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                        />
                        <div className="flex justify-between text-[10px] opacity-30 font-bold">
                            <span>30kg</span>
                            <span>200kg</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40">Altura (cm): {height}</label>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="230"
                            value={height}
                            onChange={(e) => setHeight(parseInt(e.target.value))}
                            className="w-full h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                        />
                        <div className="flex justify-between text-[10px] opacity-30 font-bold">
                            <span>100cm</span>
                            <span>230cm</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase tracking-[4px] opacity-30 mb-2">Seu IMC</p>
                    <h2 className="text-7xl font-black tracking-tighter mb-4">{bmi.toFixed(1)}</h2>
                    <div className={cn("px-6 py-2 rounded-full font-bold text-sm border animate-in zoom-in-95", status.bg, status.color, status.border)}>
                        {status.label}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-text-main/5 border border-border-main rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-text-main/60 font-bold text-sm uppercase tracking-wider">
                    <Info size={16} /> Sobre o IMC
                </div>
                <p className="text-xs leading-relaxed opacity-60">
                    O Índice de Massa Corporal (IMC) é uma medida universal aprovada pela OMS para identificar riscos de desnutrição ou obesidade. <br /><br />
                    <strong>Nota:</strong> Este cálculo não diferencia massa muscular de gordura. Atletas podem ter um IMC alto sem estarem acima do peso ideal de gordura.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4 opacity-50">
                    <div className="text-[10px] font-bold">Normal: 18.5 - 24.9</div>
                    <div className="text-[10px] font-bold">Sobrepeso: 25 - 29.9</div>
                </div>
            </div>
        </div>
    );
}
