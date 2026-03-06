"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, Settings2, Info, Heart, Sparkles, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'HoldOut';

export function BreathWork() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<BreathPhase>('Inhale');
    const [counter, setCounter] = useState(4);
    const [inhaleTime, setInhaleTime] = useState(4);
    const [holdTime, setHoldTime] = useState(4);
    const [exhaleTime, setExhaleTime] = useState(4);
    const [holdOutTime, setHoldOutTime] = useState(4);
    const [cycles, setCycles] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        setIsActive(true);
    };

    const stopTimer = () => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const resetTimer = () => {
        stopTimer();
        setPhase('Inhale');
        setCounter(inhaleTime);
        setCycles(0);
    };

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setCounter(prev => {
                    if (prev <= 1) {
                        // Switch phase
                        switch (phase) {
                            case 'Inhale':
                                if (holdTime > 0) {
                                    setPhase('Hold');
                                    return holdTime;
                                } else {
                                    setPhase('Exhale');
                                    return exhaleTime;
                                }
                            case 'Hold':
                                setPhase('Exhale');
                                return exhaleTime;
                            case 'Exhale':
                                if (holdOutTime > 0) {
                                    setPhase('HoldOut');
                                    return holdOutTime;
                                } else {
                                    setCycles(c => c + 1);
                                    setPhase('Inhale');
                                    return inhaleTime;
                                }
                            case 'HoldOut':
                                setCycles(c => c + 1);
                                setPhase('Inhale');
                                return inhaleTime;
                            default:
                                return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, phase, inhaleTime, holdTime, exhaleTime, holdOutTime]);

    const getPhaseText = () => {
        switch (phase) {
            case 'Inhale': return 'Inspire';
            case 'Hold': return 'Segure';
            case 'Exhale': return 'Expire';
            case 'HoldOut': return 'Segure';
            default: return '';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'Inhale': return 'from-blue-400 to-emerald-400 shadow-blue-500/20';
            case 'Hold': return 'from-emerald-400 to-teal-400 shadow-emerald-500/20';
            case 'Exhale': return 'from-teal-400 to-indigo-400 shadow-indigo-500/20';
            case 'HoldOut': return 'from-indigo-400 to-blue-400 shadow-blue-500/20';
            default: return 'from-blue-400 to-emerald-400';
        }
    };

    return (
        <div className="flex flex-col gap-4 min-h-screen max-w-6xl mx-auto pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Visualizer Area */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Sparkles size={14} /> Espaço de Calma
                        </label>
                        <div className="bg-text-main/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
                            Ciclos Completos: {cycles}
                        </div>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[56px] shadow-2xl overflow-hidden relative flex flex-col items-center justify-center p-12">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_70%)] opacity-50" />

                        {/* Breathing Circle */}
                        <div className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={phase}
                                    initial={{ scale: phase === 'Inhale' ? 0.8 : phase === 'Exhale' ? 1.2 : 1 }}
                                    animate={{
                                        scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : 1,
                                        transition: {
                                            duration: phase === 'Inhale' ? inhaleTime : phase === 'Exhale' ? exhaleTime : 0.5,
                                            ease: "easeInOut"
                                        }
                                    }}
                                    className={cn(
                                        "absolute inset-0 rounded-full bg-gradient-to-br opacity-20 blur-3xl transition-colors duration-1000",
                                        getPhaseColor()
                                    )}
                                />
                            </AnimatePresence>

                            <motion.div
                                animate={{
                                    scale: isActive ? (phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : 1) : 1
                                }}
                                transition={{
                                    duration: phase === 'Inhale' ? inhaleTime : phase === 'Exhale' ? exhaleTime : 0.5,
                                    ease: "easeInOut"
                                }}
                                className={cn(
                                    "w-full h-full rounded-full border-[12px] lg:border-[20px] border-border-main/10 flex flex-col items-center justify-center relative z-10 bg-card-main/40 backdrop-blur-sm shadow-2xl transition-all duration-1000",
                                    isActive && "border-t-transparent animate-spin-slow",
                                    isActive && phase === 'Inhale' && "shadow-[0_0_80px_rgba(59,130,246,0.2)]",
                                    isActive && phase === 'Exhale' && "shadow-[0_0_40px_rgba(79,70,229,0.1)]"
                                )}
                            >
                                <div className="text-center space-y-2">
                                    <motion.h2
                                        key={phase}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-4xl lg:text-7xl font-black italic tracking-tighter uppercase text-text-main"
                                    >
                                        {isActive ? getPhaseText() : "Pronto?"}
                                    </motion.h2>
                                    <motion.div
                                        key={counter}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-2xl lg:text-4xl font-mono font-black opacity-30"
                                    >
                                        {isActive ? counter : ""}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Controls Overlay */}
                        <div className="mt-16 flex items-center gap-6 relative z-20">
                            <button
                                onClick={isActive ? stopTimer : startTimer}
                                className={cn(
                                    "w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 group",
                                    isActive ? "bg-red-500 text-white" : "bg-text-main text-bg-main"
                                )}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                                {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="w-16 h-16 bg-text-main/5 text-text-main/40 hover:text-text-main hover:bg-text-main/10 rounded-2xl flex items-center justify-center transition-all"
                            >
                                <RotateCcw size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Sidebar */}
                <div className="flex flex-col gap-6">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Settings2 size={14} /> Ajustes da Técnica
                    </label>
                    <div className="bg-text-main/5 border border-border-main p-8 rounded-[40px] space-y-8 shadow-inner">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[3px] opacity-30">Padrão de Tempo (Segundos)</h4>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="text-[9px] font-black uppercase opacity-40">Inspiração</label>
                                        <span className="text-sm font-black italic">{inhaleTime}s</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="10" value={inhaleTime}
                                        onChange={(e) => setInhaleTime(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="text-[9px] font-black uppercase opacity-40">Segurar (Com Pulmão Cheio)</label>
                                        <span className="text-sm font-black italic">{holdTime}s</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="10" value={holdTime}
                                        onChange={(e) => setHoldTime(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="text-[9px] font-black uppercase opacity-40">Expiração</label>
                                        <span className="text-sm font-black italic">{exhaleTime}s</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="10" value={exhaleTime}
                                        onChange={(e) => setExhaleTime(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="text-[9px] font-black uppercase opacity-40">Segurar (Com Pulmão Vazio)</label>
                                        <span className="text-sm font-black italic">{holdOutTime}s</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="10" value={holdOutTime}
                                        onChange={(e) => setHoldOutTime(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border-main/10">
                            <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 space-y-3">
                                <div className="flex items-center gap-2 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                                    <Info size={14} /> Box Breathing
                                </div>
                                <p className="text-[9px] font-medium opacity-50 uppercase leading-relaxed tracking-wider italic">
                                    Recomendado: 4-4-4-4. Esta técnica é usada por Navy SEALs para manter o foco e reduzir a ansiedade instantaneamente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <div className="mt-20 mb-4 p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-12 transition-all">
                        <Heart size={28} className="text-red-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight uppercase tracking-tight italic">Mente em Equilíbrio</h4>
                        <p className="text-xs opacity-60 italic leading-snug tracking-tighter">
                            A respiração controlada sinaliza ao seu sistema nervoso que você está seguro, reduzindo o cortisol.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Prática de</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase whitespace-nowrap">MINDFULNESS</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}} />
        </div>
    );
}
