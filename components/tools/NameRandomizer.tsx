'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Users, Shuffle, Trash2, Plus, Trophy, RefreshCw, Layers, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export function NameRandomizer() {
    const [nameInput, setNameInput] = useState('');
    const [names, setNames] = useState<string[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    const addNames = () => {
        const lines = nameInput.split('\n').map(n => n.trim()).filter(n => n !== '');
        if (lines.length > 0) {
            setNames([...new Set([...names, ...lines])]);
            setNameInput('');
        }
    };

    const clearAll = () => {
        setNames([]);
        setWinner(null);
        setHistory([]);
    };

    const drawWinner = () => {
        if (names.length < 1) return;
        setIsSpinning(true);
        setWinner(null);

        // Simulation of a spin
        let counter = 0;
        const maxDraws = 20;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * names.length);
            setWinner(names[randomIndex]);
            counter++;

            if (counter >= maxDraws) {
                clearInterval(interval);
                const finalWinner = names[Math.floor(Math.random() * names.length)];
                setWinner(finalWinner);
                setHistory(prev => [finalWinner, ...prev].slice(0, 10));
                setIsSpinning(false);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#000000', '#ffffff', '#888888']
                });
            }
        }, 100);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Lista de Participantes</label>
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">{names.length} NOMES</span>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-border-main/5 flex gap-4">
                            <textarea
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="Cole ou digite nomes (um por linha)..."
                                className="flex-1 bg-text-main/5 border border-border-main/10 rounded-[32px] p-6 text-sm outline-none focus:ring-4 focus:ring-text-main/5 transition-all resize-none h-32 custom-scrollbar font-medium"
                            />
                            <button
                                onClick={addNames}
                                className="px-8 bg-text-main text-bg-main rounded-[32px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} /> Adicionar
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                            {names.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {names.map((name, i) => (
                                        <div
                                            key={i}
                                            className="px-4 py-2 bg-text-main/5 border border-border-main/5 rounded-full text-xs font-bold flex items-center gap-2 group hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                            onClick={() => setNames(names.filter((_, idx) => idx !== i))}
                                        >
                                            {name}
                                            <Trash2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                                    <Users size={64} className="mb-4" />
                                    <p className="font-black uppercase tracking-widest text-sm">Lista Vazia</p>
                                    <p className="text-[10px] font-bold mt-2">Adicione participantes para sortear</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Sorteio</label>
                    <div className="bg-card-main border border-border-main p-10 rounded-[48px] flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-4 right-4 text-[10px] font-black opacity-10 uppercase tracking-widest">Randomizer 3000</div>

                        <div className={cn(
                            "w-full aspect-square rounded-full border-8 flex flex-col items-center justify-center text-center transition-all duration-300",
                            isSpinning ? "border-text-main animate-pulse scale-95" : "border-text-main/5"
                        )}>
                            {winner ? (
                                <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-500">
                                    <Trophy size={64} className="text-yellow-500" />
                                    <h4 className="text-3xl font-black italic tracking-tighter text-text-main leading-none uppercase max-w-full truncate px-4">
                                        {winner}
                                    </h4>
                                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-[4px]">VENCEDOR</span>
                                </div>
                            ) : (
                                <div className="opacity-20 flex flex-col items-center gap-4">
                                    <Shuffle size={64} />
                                    <span className="text-[10px] font-black uppercase tracking-[4px]">PRONTO P/ GIRAR</span>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={names.length < 2 || isSpinning}
                            onClick={drawWinner}
                            className="w-full py-6 bg-text-main text-bg-main rounded-[32px] font-black uppercase tracking-[2px] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                            <Shuffle size={24} /> Sortear Nome
                        </button>

                        <button
                            onClick={clearAll}
                            className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest transition-all"
                        >
                            Limpar Tudo
                        </button>
                    </div>

                    {history.length > 0 && (
                        <div className="bg-text-main/5 border border-border-main/5 p-8 rounded-[40px] flex flex-col gap-4">
                            <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Últimos Ganhadores</label>
                            <div className="space-y-2">
                                {history.map((h, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-bold opacity-60">
                                        <div className="w-1 h-1 rounded-full bg-text-main" />
                                        {h}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
