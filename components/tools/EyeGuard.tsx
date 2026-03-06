"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Clock, RotateCcw, Play, Pause, Bell, BellOff, Info, Sun, Monitor, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function EyeGuard() {
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [workInterval, setWorkInterval] = useState(20); // minutes
    const [breakDuration, setBreakDuration] = useState(20); // seconds
    const [completedBreaks, setCompletedBreaks] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTimeLeft(workInterval * 60);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const playAlert = () => {
        if (!soundEnabled) return;
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.connect(gain);
            gain.connect(context.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, context.currentTime);
            gain.gain.setValueAtTime(0, context.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
            osc.start(context.currentTime);
            osc.stop(context.currentTime + 0.5);
        } catch (e) {
            console.error("Audio failed", e);
        }
    };

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        playAlert();
                        if (isBreak) {
                            setIsBreak(false);
                            setCompletedBreaks(c => c + 1);
                            return workInterval * 60;
                        } else {
                            setIsBreak(true);
                            return breakDuration;
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
    }, [isActive, isBreak, workInterval, breakDuration, soundEnabled]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = isBreak
        ? (timeLeft / breakDuration) * 100
        : (timeLeft / (workInterval * 60)) * 100;

    return (
        <div className="flex flex-col gap-4 min-h-screen max-w-6xl mx-auto pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Timer Main Area */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Clock size={14} /> Monitor de Fadiga
                        </label>
                        <div className="flex gap-4">
                            <div className="bg-text-main/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
                                Pausas Hoje: {completedBreaks}
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={cn(
                                    "p-2 rounded-xl transition-all",
                                    soundEnabled ? "bg-text-main/10 text-text-main" : "bg-text-main/5 text-text-main/30"
                                )}
                            >
                                {soundEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                            </button>
                        </div>
                    </div>

                    <div className={cn(
                        "flex-1 border rounded-[56px] shadow-2xl relative flex flex-col items-center justify-center p-12 transition-all duration-700 overflow-hidden",
                        isBreak
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-card-main border-border-main"
                    )}>
                        {/* Status Label */}
                        <div className="absolute top-12 flex flex-col items-center gap-2">
                            <div className={cn(
                                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px] animate-pulse",
                                isBreak ? "bg-emerald-500 text-white" : "bg-text-main/10 text-text-main/60"
                            )}>
                                {isBreak ? 'Hora do Descanso' : (isActive ? 'Modo Trabalho' : 'Pausado')}
                            </div>
                        </div>

                        {/* Progress Ring / Timer */}
                        <div className="relative w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="50%" cy="50%" r="48%"
                                    className="fill-none stroke-text-main/5 stroke-[8px] lg:stroke-[12px]"
                                />
                                <motion.circle
                                    cx="50%" cy="50%" r="48%"
                                    className={cn(
                                        "fill-none stroke-[8px] lg:stroke-[12px] stroke-linecap-round",
                                        isBreak ? "stroke-emerald-500" : "stroke-text-main"
                                    )}
                                    initial={{ strokeDasharray: "100 100", strokeDashoffset: 100 }}
                                    animate={{ strokeDashoffset: progress }}
                                    style={{
                                        strokeDasharray: "100 100",
                                        pathLength: progress / 100
                                    }}
                                />
                            </svg>

                            <div className="text-center relative z-10">
                                <span className="text-6xl lg:text-9xl font-black italic tracking-tighter text-text-main tabular-nums">
                                    {formatTime(timeLeft)}
                                </span>
                                <div className="text-[10px] font-bold opacity-30 uppercase tracking-[4px] mt-4">
                                    {isBreak ? 'Olhe para longe' : 'Foco na Tela'}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-16 flex items-center gap-6 relative z-20">
                            <button
                                onClick={toggleTimer}
                                className={cn(
                                    "w-24 h-24 rounded-[36px] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 group relative",
                                    isActive ? (isBreak ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-text-main text-bg-main"
                                )}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[36px]" />
                                {isActive ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
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

                {/* Sidebar Controls */}
                <div className="flex flex-col gap-6">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Settings2 size={14} /> Configuração 20-20-20
                    </label>
                    <div className="bg-text-main/5 border border-border-main p-8 rounded-[40px] space-y-8 shadow-inner">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[9px] font-black uppercase opacity-40">Tempo de Trabalho (min)</label>
                                    <span className="text-sm font-black italic">{workInterval}m</span>
                                </div>
                                <input
                                    type="range" min="5" max="60" step="5" value={workInterval}
                                    onChange={(e) => setWorkInterval(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[9px] font-black uppercase opacity-40">Tempo de Pausa (seg)</label>
                                    <span className="text-sm font-black italic">{breakDuration}s</span>
                                </div>
                                <input
                                    type="range" min="10" max="60" step="5" value={breakDuration}
                                    onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border-main/10 grid grid-cols-1 gap-4">
                            {[
                                { icon: <Monitor className="text-blue-500" />, title: "Distância", text: "Mantenha o monitor a um braço de distância." },
                                { icon: <Sun className="text-orange-500" />, title: "Iluminação", text: "Evite reflexos na tela e luz direta nos olhos." },
                                { icon: <ShieldCheck className="text-emerald-500" />, title: "Pisque", text: "Lembre-se de piscar para lubrificar as córneas." }
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-text-main/5 rounded-2xl">
                                    <div className="shrink-0 pt-1">{tip.icon}</div>
                                    <div className="space-y-1">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest opacity-80">{tip.title}</h5>
                                        <p className="text-[9px] font-medium opacity-40 leading-relaxed uppercase tracking-wider">{tip.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Informativo */}
            {/* Banner Informativo */}
            <div className="mt-20 mb-4 p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                        <Eye size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight uppercase tracking-tight italic">Regra 20-20-20</h4>
                        <p className="text-xs opacity-60 italic leading-snug tracking-tighter max-w-md">
                            A cada 20 minutos, olhe para algo a 20 pés (6 metros) por pelo menos 20 segundos. Isso previne o CVS (Computer Vision Syndrome).
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Proteção contra</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase whitespace-nowrap">FADIGA DIGITAL</p>
                </div>
            </div>
        </div>
    );
}

const Settings2 = ({ size, className }: { size?: number, className?: string }) => (
    <Monitor size={size} className={className} />
);
