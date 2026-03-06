"use client";

import React, { useState, useEffect } from 'react';
import { Droplets, Plus, RotateCcw, CupSoda, Beer, GlassWater, Trophy, Info, Settings2, Trash2, Calendar, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface LogEntry {
    id: string;
    amount: number;
    time: string;
}

export function WaterReminder() {
    const [weight, setWeight] = useState(70);
    const [goal, setGoal] = useState(2450); // 70 * 35ml
    const [intake, setIntake] = useState(0);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const savedWeight = localStorage.getItem('water_weight');
        const savedLogs = localStorage.getItem('water_logs_today');
        const lastDate = localStorage.getItem('water_last_date');
        const currentDate = new Date().toLocaleDateString();

        if (savedWeight) {
            const w = parseInt(savedWeight);
            setWeight(w);
            setGoal(w * 35);
        }

        if (lastDate === currentDate && savedLogs) {
            const parsedLogs = JSON.parse(savedLogs);
            setLogs(parsedLogs);
            const total = parsedLogs.reduce((acc: number, log: LogEntry) => acc + log.amount, 0);
            setIntake(total);
        } else {
            // New day, reset logs
            localStorage.setItem('water_last_date', currentDate);
            localStorage.setItem('water_logs_today', JSON.stringify([]));
        }
    }, []);

    // Save logs whenever they change
    useEffect(() => {
        localStorage.setItem('water_logs_today', JSON.stringify(logs));
        const total = logs.reduce((acc, log) => acc + log.amount, 0);
        setIntake(total);
    }, [logs]);

    const addWater = (amount: number) => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            amount,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setLogs([newLog, ...logs]);

        // Visual effect or sound could go here
    };

    const removeLog = (id: string) => {
        setLogs(logs.filter(log => log.id !== id));
    };

    const resetDay = () => {
        if (confirm('Deseja zerar o registro de hoje?')) {
            setLogs([]);
        }
    };

    const updateWeight = (w: number) => {
        setWeight(w);
        setGoal(w * 35);
        localStorage.setItem('water_weight', w.toString());
    };

    const progress = Math.min((intake / goal) * 100, 100);

    return (
        <div className="flex flex-col gap-4 min-h-screen max-w-6xl mx-auto pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Visual Tracker Area */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Target size={14} /> Nível de Hidratação
                        </label>
                        <div className="flex gap-4">
                            <div className="bg-text-main/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
                                Meta: {goal}ml
                            </div>
                            <button
                                onClick={resetDay}
                                className="p-2 bg-text-main/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[56px] shadow-2xl overflow-hidden relative flex flex-col p-12 lg:p-16">
                        {/* Background Water Fill Animation */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/20 to-blue-400/5 transition-all duration-1000 ease-out"
                            style={{ height: `${progress}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${progress}%` }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-4 bg-blue-400/10 animate-pulse" />
                        </motion.div>

                        <div className="relative z-10 flex flex-col items-center justify-between h-full">
                            <div className="text-center">
                                <h2 className="text-8xl lg:text-[140px] font-black italic tracking-tighter text-text-main leading-none tabular-nums">
                                    {intake}<span className="text-2xl lg:text-4xl opacity-20 ml-2">ml</span>
                                </h2>
                                <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] opacity-30 mt-4">
                                    Consumidos do seu objetivo diário
                                </p>
                            </div>

                            <div className="w-full max-w-md space-y-8">
                                <div className="flex justify-between gap-4">
                                    {[
                                        { amount: 200, label: 'Copo', icon: <GlassWater size={24} /> },
                                        { amount: 350, label: 'Extra', icon: <CupSoda size={24} /> },
                                        { amount: 500, label: 'Garrafa', icon: <Droplets size={24} /> }
                                    ].map((btn, i) => (
                                        <button
                                            key={i}
                                            onClick={() => addWater(btn.amount)}
                                            className="flex-1 bg-text-main/5 border border-border-main/10 hover:border-text-main/40 hover:bg-text-main/10 p-6 rounded-[32px] transition-all group active:scale-95"
                                        >
                                            <div className="text-text-main opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all mb-3 flex justify-center">
                                                {btn.icon}
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-text-main opacity-60">+{btn.amount}ml</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="relative h-4 bg-text-main/5 rounded-full overflow-hidden border border-border-main/5">
                                    <motion.div
                                        className="absolute inset-0 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History/Settings Sidebar */}
                <div className="flex flex-col gap-6">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Calendar size={14} /> Histórico de Hoje
                    </label>
                    <div className="flex-1 bg-text-main/5 border border-border-main rounded-[40px] flex flex-col overflow-hidden shadow-inner">
                        <div className="p-8 flex-1 overflow-auto custom-scrollbar space-y-4">
                            <AnimatePresence mode="popLayout">
                                {logs.length > 0 ? logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="group p-4 bg-card-main border border-border-main/5 rounded-2xl flex items-center justify-between hover:border-text-main/10 transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                                                <Plus size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-text-main">{log.amount}ml</div>
                                                <div className="text-[8px] font-black opacity-30 uppercase tracking-widest">{log.time}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeLog(log.id)}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </motion.div>
                                )) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-10 gap-4 mt-12">
                                        <GlassWater size={48} />
                                        <p className="font-black uppercase tracking-widest text-[10px]">Tome seu primeiro copo d'água!</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-8 pt-0 border-t border-border-main/10 mt-auto bg-card-main/30 backdrop-blur-sm">
                            <div className="space-y-6 pt-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="text-[9px] font-black uppercase opacity-40">Seu Peso (kg)</label>
                                        <span className="text-sm font-black italic">{weight}kg</span>
                                    </div>
                                    <input
                                        type="range" min="30" max="150" value={weight}
                                        onChange={(e) => updateWeight(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-text-main/10 rounded-lg appearance-none cursor-pointer accent-text-main"
                                    />
                                </div>
                                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                    <p className="text-[9px] font-medium opacity-50 uppercase leading-relaxed tracking-wider italic">
                                        Cálculo base: 35ml por kg. Ajuste seu peso para recalcular sua meta personalizada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Alert */}
            {/* Footer Alert */}
            <div className="mt-20 mb-4 p-8 bg-text-main text-bg-main rounded-[40px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-bg-main text-text-main rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                        <Trophy size={28} className="text-yellow-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight uppercase tracking-tight italic">Performance Cognitiva</h4>
                        <p className="text-xs opacity-60 italic leading-snug tracking-tighter">
                            Apenas 2% de desidratação já afeta sua memória de curto prazo e poder de concentração. Mantenha os neurônios hidratados.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 leading-tight">Hidrate-se para</p>
                    <p className="text-3xl font-black leading-tight italic tracking-tighter uppercase whitespace-nowrap">ALTA PERFORMANCE</p>
                </div>
            </div>
        </div>
    );
}

const Settings2Comp = ({ size, className }: { size?: number, className?: string }) => (
    <Target size={size} className={className} />
);
