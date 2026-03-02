import React, { useState } from 'react';
import { CircuitBoard, Zap, Play, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';

export function LogicGateSim() {
    const [inputA, setInputA] = useState(false);
    const [inputB, setInputB] = useState(false);
    const [selectedGate, setSelectedGate] = useState<GateType>('AND');

    const calculateOutput = (gate: GateType, a: boolean, b: boolean): boolean => {
        switch (gate) {
            case 'AND': return a && b;
            case 'OR': return a || b;
            case 'NOT': return !a;
            case 'NAND': return !(a && b);
            case 'NOR': return !(a || b);
            case 'XOR': return a !== b;
            default: return false;
        }
    };

    const output = calculateOutput(selectedGate, inputA, inputB);

    const gates: { type: GateType; label: string; desc: string }[] = [
        { type: 'AND', label: 'AND (E)', desc: 'Ligado apenas se ambos forem 1' },
        { type: 'OR', label: 'OR (OU)', desc: 'Ligado se pelo menos um for 1' },
        { type: 'NOT', label: 'NOT (NÃO)', desc: 'Inverte o valor da Entrada A' },
        { type: 'NAND', label: 'NAND', desc: 'Inverso de AND' },
        { type: 'NOR', label: 'NOR', desc: 'Inverso de OR' },
        { type: 'XOR', label: 'XOR', desc: 'Ligado se as entradas forem diferentes' },
    ];

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-text-main/5 rounded-2xl flex items-center justify-center text-text-main mx-auto mb-4">
                    <CircuitBoard size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Logic Gate Sim</h3>
                <p className="text-text-main/50">Explore o comportamento fundamental das portas lógicas digitais.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-bg-main p-10 rounded-[40px] border border-border-main shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    <div className="relative flex items-center gap-12 lg:gap-20">
                        {/* Inputs */}
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={() => setInputA(!inputA)}
                                    className={cn(
                                        "w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-xl transition-all shadow-lg",
                                        inputA ? "bg-text-main text-bg-main border-text-main scale-110" : "bg-text-main/5 border-border-main text-text-main/40"
                                    )}
                                >
                                    {inputA ? '1' : '0'}
                                </button>
                                <span className="text-[10px] uppercase font-bold opacity-30">Input A</span>
                            </div>

                            {selectedGate !== 'NOT' && (
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => setInputB(!inputB)}
                                        className={cn(
                                            "w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-xl transition-all shadow-lg",
                                            inputB ? "bg-text-main text-bg-main border-text-main scale-110" : "bg-text-main/5 border-border-main text-text-main/40"
                                        )}
                                    >
                                        {inputB ? '1' : '0'}
                                    </button>
                                    <span className="text-[10px] uppercase font-bold opacity-30">Input B</span>
                                </div>
                            )}
                        </div>

                        {/* Gate Visual */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-text-main rounded-3xl flex items-center justify-center text-bg-main shadow-2xl animate-in zoom-in-90 animate-pulse-slow">
                                <span className="text-3xl font-black">{selectedGate}</span>
                            </div>
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 bg-yellow-500 text-black rounded-lg text-xs font-bold shadow-lg flex items-center gap-2">
                                <Zap size={14} /> Circuito Ativo
                            </div>
                        </div>

                        {/* Output */}
                        <div className="flex flex-col items-center gap-3">
                            <div className={cn(
                                "w-20 h-20 rounded-[32px] border-4 flex items-center justify-center transition-all duration-500 shadow-2xl",
                                output ? "bg-yellow-500 border-yellow-300 text-black scale-125" : "bg-text-main/5 border-border-main text-text-main/10"
                            )}>
                                {output ? <Zap size={40} className="fill-current" /> : <RefreshCw size={40} className="rotate-45" />}
                            </div>
                            <span className="text-[10px] uppercase font-bold opacity-40 mt-4 tracking-widest">Resultado: {output ? '1' : '0'}</span>
                        </div>
                    </div>

                    {/* Cables (Simplified CSS lines) */}
                    <div className="absolute left-32 right-1/2 top-1/2 h-0.5 bg-text-main/10 -translate-y-1/2 -z-10" />
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 ml-2">Selecionar Porta</p>
                    {gates.map((g) => (
                        <button
                            key={g.type}
                            onClick={() => setSelectedGate(g.type)}
                            className={cn(
                                "w-full p-4 rounded-2xl border text-left transition-all group",
                                selectedGate === g.type
                                    ? "bg-text-main border-text-main shadow-xl scale-[1.02]"
                                    : "bg-card-main border-border-main hover:bg-text-main/5"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={cn("font-black text-sm", selectedGate === g.type ? "text-bg-main" : "text-text-main")}>{g.label}</span>
                                {selectedGate === g.type && <Play size={14} className="text-bg-main fill-current" />}
                            </div>
                            <p className={cn("text-[10px] leading-tight", selectedGate === g.type ? "text-bg-main/60" : "text-text-main/40")}>{g.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-blue-600">
                <p className="text-xs leading-relaxed italic">
                    "Toda a computação moderna é construída a partir dessas operações simples. Ao combinar milhões de portas lógicas, criamos processadores capazes de bilhões de cálculos por segundo."
                </p>
            </div>
        </div>
    );
}
