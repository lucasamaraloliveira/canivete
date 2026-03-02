import React, { useState } from 'react';
import { Atom as AtomIcon, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AtomVisualizer() {
    const [protons, setProtons] = useState(1);
    const [neutrons, setNeutrons] = useState(0);
    const [electrons, setElectrons] = useState(1);

    const shells = [];
    let remainingElectrons = electrons;
    const shellCapacities = [2, 8, 18, 32];

    for (const capacity of shellCapacities) {
        if (remainingElectrons > 0) {
            shells.push(Math.min(remainingElectrons, capacity));
            remainingElectrons -= capacity;
        } else break;
    }

    const elements = ["", "Hidrogênio (H)", "Hélio (He)", "Lítio (Li)", "Berílio (Be)", "Boro (B)", "Carbono (C)", "Nitrogênio (N)", "Oxigênio (O)", "Flúor (F)", "Neônio (Ne)"];

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <AtomIcon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Atom Visualizer</h3>
                <p className="text-text-main/50">Visualize a estrutura atômica com o modelo de Bohr interativo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-square bg-bg-main rounded-[40px] border border-border-main shadow-2xl relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />

                    {/* Nucleus */}
                    <div className="relative z-10 w-12 h-12 flex flex-wrap items-center justify-center p-1 gap-0.5">
                        {[...Array(protons)].map((_, i) => <div key={`p-${i}`} className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />)}
                        {[...Array(neutrons)].map((_, i) => <div key={`n-${i}`} className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-sm" />)}
                    </div>

                    {/* Shells */}
                    {shells.map((count, sIndex) => {
                        const radius = 60 + sIndex * 40;
                        return (
                            <React.Fragment key={sIndex}>
                                <div
                                    className="absolute rounded-full border border-text-main/5 pointer-events-none"
                                    style={{ width: radius * 2, height: radius * 2 }}
                                />
                                {[...Array(count)].map((_, eIndex) => {
                                    const angle = (2 * Math.PI * eIndex) / count;
                                    return (
                                        <div
                                            key={`e-${sIndex}-${eIndex}`}
                                            className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-spin-slow"
                                            style={{
                                                left: `calc(50% + ${radius * Math.cos(angle)}px - 6px)`,
                                                top: `calc(50% + ${radius * Math.sin(angle)}px - 6px)`,
                                                animationDuration: `${10 + sIndex * 5}s`
                                            }}
                                        />
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-text-main/5 rounded-[32px] border border-border-main text-center">
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-30 mb-1">Elemento Identificado</p>
                        <h4 className="text-3xl font-black">{elements[protons] || `Elemento ${protons}`}</h4>
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="text-center">
                                <p className="text-[10px] opacity-40 font-bold">PRÓTONS</p>
                                <p className="text-xl font-bold">{protons}</p>
                            </div>
                            <div className="w-px h-8 bg-border-main self-end mb-1" />
                            <div className="text-center">
                                <p className="text-[10px] opacity-40 font-bold">NÊUTRONS</p>
                                <p className="text-xl font-bold">{neutrons}</p>
                            </div>
                            <div className="w-px h-8 bg-border-main self-end mb-1" />
                            <div className="text-center">
                                <p className="text-[10px] opacity-40 font-bold">ELÉTRONS</p>
                                <p className="text-xl font-bold">{electrons}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: 'Prótons (+)', val: protons, set: setProtons, color: 'text-red-500', max: 10 },
                            { label: 'Nêutrons (0)', val: neutrons, set: setNeutrons, color: 'text-gray-400', max: 10 },
                            { label: 'Elétrons (-)', val: electrons, set: setElectrons, color: 'text-blue-500', max: 10 }
                        ].map((part) => (
                            <div key={part.label} className="flex items-center justify-between p-4 bg-bg-main border border-border-main rounded-2xl">
                                <span className={cn("font-bold text-sm", part.color)}>{part.label}</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => part.set(Math.max(0, part.val - 1))} className="p-1 hover:bg-text-main/5 rounded-lg"><Minus size={18} /></button>
                                    <span className="font-mono font-bold text-lg min-w-[20px] text-center">{part.val}</span>
                                    <button onClick={() => part.set(Math.min(part.max, part.val + 1))} className="p-1 hover:bg-text-main/5 rounded-lg"><Plus size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
