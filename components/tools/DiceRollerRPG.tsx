import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dice5, RotateCcw, Trash2, History, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const DIE_TYPES = [
    { label: 'D4', max: 4, icon: '▲', color: 'bg-red-500' },
    { label: 'D6', max: 6, icon: '■', color: 'bg-orange-500' },
    { label: 'D8', max: 8, icon: '◆', color: 'bg-yellow-500' },
    { label: 'D10', max: 10, icon: '✦', color: 'bg-green-500' },
    { label: 'D12', max: 12, icon: '⬟', color: 'bg-blue-500' },
    { label: 'D20', max: 20, icon: '⬢', color: 'bg-purple-500' },
    { label: 'D100', max: 100, icon: '●', color: 'bg-pink-500' },
];

interface Roll {
    id: string;
    type: string;
    value: number;
    timestamp: number;
}

export function DiceRollerRPG() {
    const [history, setHistory] = useState<Roll[]>([]);
    const [lastRoll, setLastRoll] = useState<Roll | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    const rollSound = useRef<HTMLAudioElement | null>(null);

    const rollDie = useCallback((type: typeof DIE_TYPES[0]) => {
        setIsRolling(true);

        // Simulate roll animation delay
        setTimeout(() => {
            const val = Math.floor(Math.random() * type.max) + 1;
            const newRoll: Roll = {
                id: Math.random().toString(36).substring(7),
                type: type.label,
                value: val,
                timestamp: Date.now()
            };
            setLastRoll(newRoll);
            setHistory(prev => [newRoll, ...prev].slice(0, 50));
            setIsRolling(false);
        }, 400);
    }, []);

    const clearHistory = () => {
        setHistory([]);
        setLastRoll(null);
    };

    return (
        <div className="flex flex-col items-center gap-12 p-8 max-w-4xl mx-auto h-full">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-text-main/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-text-main">
                    <Dice5 size={32} className={cn(isRolling && "animate-spin")} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main">Simulador de Dados RPG</h2>
                <p className="text-sm opacity-50 font-medium">Role o seu destino com precisão digital</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                {/* Rolling Area */}
                <div className="space-y-8">
                    <div className="bg-card-main dark:bg-[#0D0D0D]/40 border border-border-main rounded-[40px] p-10 shadow-2xl relative aspect-square flex flex-col items-center justify-center group overflow-hidden">
                        <AnimatePresence mode="wait">
                            {isRolling ? (
                                <motion.div
                                    key="rolling"
                                    initial={{ scale: 0.8, opacity: 0, rotate: -45 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 1.2, opacity: 0, rotate: 45 }}
                                    className="text-9xl font-black text-text-main opacity-20"
                                >
                                    ?
                                </motion.div>
                            ) : lastRoll ? (
                                <motion.div
                                    key={lastRoll.id}
                                    initial={{ scale: 0.5, opacity: 0, y: 50, rotate: -180 }}
                                    animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 text-text-main">{lastRoll.type}</p>
                                        <h1 className={cn(
                                            "text-9xl font-black tracking-tighter drop-shadow-2xl text-text-main",
                                            lastRoll.value === DIE_TYPES.find(d => d.label === lastRoll.type)?.max && "text-yellow-500 animate-pulse"
                                        )}>
                                            {lastRoll.value}
                                        </h1>
                                    </div>
                                    {lastRoll.value === DIE_TYPES.find(d => d.label === lastRoll.type)?.max && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto w-fit"
                                        >
                                            <Award size={12} /> SUCESSO CRÍTICO!
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="text-center opacity-10 space-y-4">
                                    <Dice5 size={80} className="mx-auto" />
                                    <p className="font-black text-xs uppercase tracking-widest">Selecione um dado abaixo</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Selection Grid */}
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                        {DIE_TYPES.map((die) => (
                            <button
                                key={die.label}
                                disabled={isRolling}
                                onClick={() => rollDie(die)}
                                className={cn(
                                    "group p-3 py-4 bg-text-main/5 border border-border-main rounded-2xl flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-90",
                                    isRolling && "opacity-50 grayscale cursor-not-allowed"
                                )}
                            >
                                <span className="text-2xl opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all">{die.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-main">{die.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* History Area */}
                <div className="bg-text-main/5 p-8 rounded-[40px] border border-border-main space-y-6 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] opacity-30 text-text-main flex items-center gap-2">
                            <History size={14} /> Histórico de Rolagens
                        </h4>
                        <button
                            onClick={clearHistory}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar space-y-2 pr-2 max-h-[500px]">
                        <AnimatePresence>
                            {history.length > 0 ? history.map((roll, i) => (
                                <motion.div
                                    key={roll.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-card-main/40 p-4 border border-border-main rounded-2xl flex items-center justify-between group hover:border-text-main/20 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 rounded-lg bg-text-main/10 flex items-center justify-center text-[10px] font-black opacity-30 group-hover:opacity-100 transition-opacity">{roll.type}</span>
                                        <span className="text-xl font-bold text-text-main">{roll.value}</span>
                                    </div>
                                    <span className="text-[10px] opacity-20 font-medium">{new Date(roll.timestamp).toLocaleTimeString()}</span>
                                </motion.div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4 py-20">
                                    <RotateCcw size={40} />
                                    <p className="font-black text-xs uppercase tracking-widest">Nada rolado ainda</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-6 border-t border-border-main">
                        <div className="flex items-center justify-between text-text-main/40 text-[10px] font-black uppercase tracking-widest px-2">
                            <span>Total de Rolagens</span>
                            <span className="text-text-main">{history.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.1);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
