'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Play, Pause, RotateCcw, Plus, Trash2, ArrowRight, Timer, Volume2, VolumeX, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Participant {
    id: string;
    name: string;
    completed: boolean;
}

export function StandupTimer() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [nameInput, setNameInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(60); // 60s per person
    const [isActive, setIsActive] = useState(false);
    const [perPersonTime, setPerPersonTime] = useState(60);
    const [isMuted, setIsMuted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const addParticipant = () => {
        if (!nameInput.trim()) return;
        setParticipants([...participants, {
            id: Math.random().toString(36).substr(2, 9),
            name: nameInput.trim(),
            completed: false
        }]);
        setNameInput('');
    };

    const startStandup = () => {
        const first = participants.findIndex(p => !p.completed);
        if (first !== -1) {
            setCurrentIndex(first);
            setTimeLeft(perPersonTime);
            setIsActive(true);
        }
    };

    const nextParticipant = () => {
        if (currentIndex === null) return;

        const newParticipants = [...participants];
        newParticipants[currentIndex].completed = true;
        setParticipants(newParticipants);

        const next = newParticipants.findIndex((p, i) => !p.completed && i > currentIndex);
        const firstUncompleted = newParticipants.findIndex(p => !p.completed);

        if (next !== -1) {
            setCurrentIndex(next);
            setTimeLeft(perPersonTime);
        } else if (firstUncompleted !== -1) {
            setCurrentIndex(firstUncompleted);
            setTimeLeft(perPersonTime);
        } else {
            setCurrentIndex(null);
            setIsActive(false);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            if (!isMuted) playChime();
            nextParticipant();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const playChime = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio disabled'));
    };

    const currentParticipant = currentIndex !== null ? participants[currentIndex] : null;

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Main Timer Display */}
                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden flex flex-col items-center justify-center p-12 relative">
                        <div className="absolute top-8 left-8 flex items-center gap-3">
                            <div className="w-10 h-10 bg-text-main text-bg-main rounded-xl flex items-center justify-center shadow-lg">
                                <History size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Time Remaining</p>
                                <p className="text-sm font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                            </div>
                        </div>

                        <div className="text-center space-y-8 flex flex-col items-center">
                            {currentParticipant ? (
                                <>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black opacity-30 uppercase tracking-[4px]">Agora Falando</p>
                                        <h2 className="text-6xl font-black text-text-main tracking-tighter uppercase">{currentParticipant.name}</h2>
                                    </div>
                                    <div className="relative w-64 h-64 flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="128" cy="128" r="120" className="stroke-text-main/5" strokeWidth="8" fill="none" />
                                            <circle
                                                cx="128" cy="128" r="120"
                                                className={cn("stroke-text-main transition-all duration-1000 ease-linear", timeLeft < 10 && "stroke-red-500")}
                                                strokeWidth="8" fill="none" strokeLinecap="round"
                                                style={{ strokeDasharray: '754', strokeDashoffset: (754 - (754 * (timeLeft / perPersonTime))).toString() }}
                                            />
                                        </svg>
                                        <span className={cn("text-6xl font-black tabular-nums", timeLeft < 10 && "text-red-500 animate-pulse")}>
                                            {timeLeft}
                                        </span>
                                    </div>
                                    <button
                                        onClick={nextParticipant}
                                        className="px-12 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                                    >
                                        Finalizar & Próximo <ArrowRight size={20} />
                                    </button>
                                </>
                            ) : (
                                <div className="opacity-40 space-y-6 flex flex-col items-center">
                                    <Users size={80} strokeWidth={1} />
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black uppercase">Ready to start?</h3>
                                        <p className="text-[10px] font-bold tracking-[2px]">Prepare sua sprint diária</p>
                                    </div>
                                    <button
                                        onClick={startStandup}
                                        disabled={participants.length < 1}
                                        className="px-12 py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100 disabled:grayscale"
                                    >
                                        Iniciar Standup
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings bar */}
                    <div className="bg-card-main border border-border-main p-6 rounded-[32px] flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Tempo p/ Pessoa</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range" min="15" max="300" step="15" value={perPersonTime}
                                        onChange={(e) => setPerPersonTime(parseInt(e.target.value))}
                                        className="w-32 accent-text-main"
                                    />
                                    <span className="text-sm font-black w-10">{perPersonTime}s</span>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-text-main/10" />
                            <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-text-main/5 rounded-xl hover:bg-text-main/10 transition-all">
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setIsActive(false);
                                setCurrentIndex(null);
                                setParticipants(participants.map(p => ({ ...p, completed: false })));
                            }}
                            className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest flex items-center gap-2"
                        >
                            <RotateCcw size={14} /> Resetar Ciclo
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Time de Hoje</label>
                    <div className="bg-card-main border border-border-main rounded-[40px] flex flex-col shadow-sm min-h-[500px] overflow-hidden">
                        <div className="p-6 border-b border-border-main/10 flex gap-3 bg-text-main/[0.02]">
                            <input
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                                placeholder="Nome do participante..."
                                className="flex-1 bg-text-main/5 border border-border-main/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-text-main/5 transition-all text-text-main placeholder:text-text-main/20"
                            />
                            <button
                                onClick={addParticipant}
                                className="p-3 bg-text-main text-bg-main rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-6 custom-scrollbar space-y-2">
                            {participants.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                        p.completed ? "bg-green-500/5 border-green-500/10 opacity-40" :
                                            currentIndex === i ? "bg-text-main text-bg-main border-transparent scale-102 shadow-lg" : "bg-text-main/5 border-border-main/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black", p.completed ? "bg-green-500 text-white" : currentIndex === i ? "bg-bg-main text-text-main" : "bg-text-main/10 text-text-main/40")}>
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-tight">{p.name}</span>
                                    </div>
                                    {!isActive && (
                                        <button onClick={() => setParticipants(participants.filter(pt => pt.id !== p.id))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {participants.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                                    <User size={32} className="mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Ninguém adicionado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
