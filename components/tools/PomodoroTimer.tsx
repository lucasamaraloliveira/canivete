'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee, Zap, Bell, Volume2, VolumeX, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface Config {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
}

export function PomodoroTimer() {
    const [mode, setMode] = useState<Mode>('pomodoro');
    const [config, setConfig] = useState<Config>({
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    });
    const [timeLeft, setTimeLeft] = useState(config.pomodoro * 60);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [sessions, setSessions] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const switchMode = useCallback((newMode: Mode) => {
        setMode(newMode);
        setTimeLeft(config[newMode] * 60);
        setIsActive(false);
    }, [config]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (!isMuted) {
                playAlarm();
            }
            if (mode === 'pomodoro') {
                setSessions(prev => prev + 1);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, isMuted]);

    const playAlarm = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio disabled by browser policy'));
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(config[mode] * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = 1 - (timeLeft / (config[mode] * 60));

    return (
        <div className="flex flex-col items-center justify-center gap-12 h-full py-8">
            <div className="flex bg-text-main/5 p-1.5 rounded-[24px] border border-border-main backdrop-blur-sm">
                {(['pomodoro', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={cn(
                            "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500",
                            mode === m
                                ? "bg-text-main text-bg-main shadow-xl scale-105"
                                : "text-text-main/40 hover:text-text-main hover:bg-text-main/5"
                        )}
                    >
                        {m === 'pomodoro' ? 'Foco' : m === 'shortBreak' ? 'Curto' : 'Longo'}
                    </button>
                ))}
            </div>

            <div className="relative w-80 h-80 flex items-center justify-center group">
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl">
                    <circle
                        cx="160" cy="160" r="150"
                        className="stroke-text-main/5"
                        strokeWidth="12" fill="none"
                    />
                    <circle
                        cx="160" cy="160" r="150"
                        className={cn(
                            "stroke-text-main transition-all duration-1000 ease-linear",
                            mode === 'shortBreak' && "stroke-green-500",
                            mode === 'longBreak' && "stroke-blue-500"
                        )}
                        strokeWidth="12" fill="none"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: '942',
                            strokeDashoffset: (942 - (942 * progress)).toString()
                        }}
                    />
                </svg>

                <div className="text-center z-10">
                    <h2 className="text-7xl font-black tabular-nums tracking-tighter text-text-main drop-shadow-sm mb-2">
                        {formatTime(timeLeft)}
                    </h2>
                    <div className="flex flex-col items-center gap-1">
                        <div className="px-3 py-1 bg-text-main/5 rounded-full flex items-center gap-2">
                            {mode === 'pomodoro' ? <Zap size={12} className="text-yellow-500 fill-yellow-500" /> : <Coffee size={12} className="text-blue-500" />}
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                {mode === 'pomodoro' ? 'Sessão de Foco' : 'Descanso'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-4 bg-text-main/5 rounded-2xl border border-border-main text-text-main/40 hover:text-text-main transition-all hover:scale-110"
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>

                    <button
                        onClick={toggleTimer}
                        className={cn(
                            "w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 group relative overflow-hidden",
                            isActive ? "bg-red-500 text-white" : "bg-text-main text-bg-main"
                        )}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {isActive ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="p-4 bg-text-main/5 rounded-2xl border border-border-main text-text-main/40 hover:text-text-main transition-all hover:scale-110"
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-8 py-4 px-8 bg-text-main/5 rounded-[32px] border border-border-main/10 shadow-inner">
                    <div className="text-center">
                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">Ciclos</p>
                        <p className="text-xl font-black">{sessions}</p>
                    </div>
                    <div className="w-px h-8 bg-text-main/10" />
                    <div className="text-center">
                        <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl font-black">{sessions * config.pomodoro}m</p>
                    </div>
                </div>
            </div>

            <div className="max-w-md text-center">
                <p className="text-[10px] font-bold text-text-main/20 uppercase tracking-[4px] leading-relaxed">
                    Mantenha o foco por sessões curtas para maximizar sua produtividade cerebral.
                </p>
            </div>
        </div>
    );
}
