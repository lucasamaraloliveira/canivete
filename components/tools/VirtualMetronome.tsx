import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Plus, Minus, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function VirtualMetronome() {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
    const [currentBeat, setCurrentBeat] = useState(0);

    const audioContext = useRef<AudioContext | null>(null);
    const timerID = useRef<number | null>(null);
    const nextNoteTime = useRef<number>(0);
    const lookahead = 25.0; // Em milissegundos
    const scheduleAheadTime = 0.1; // Em segundos

    const playClick = useCallback((time: number, isFirstBeat: boolean) => {
        if (!audioContext.current) return;

        const osc = audioContext.current.createOscillator();
        const envelope = audioContext.current.createGain();

        osc.frequency.value = isFirstBeat ? 1000 : 800;
        envelope.gain.setValueAtTime(1, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        osc.connect(envelope);
        envelope.connect(audioContext.current.destination);

        osc.start(time);
        osc.stop(time + 0.1);
    }, []);

    const scheduler = useCallback(() => {
        if (!audioContext.current) return;

        while (nextNoteTime.current < audioContext.current.currentTime + scheduleAheadTime) {
            const beat = currentBeat % beatsPerMeasure;
            playClick(nextNoteTime.current, beat === 0);

            const secondsPerBeat = 60.0 / bpm;
            nextNoteTime.current += secondsPerBeat;
            setCurrentBeat(prev => (prev + 1) % beatsPerMeasure);
        }
        timerID.current = window.setTimeout(scheduler, lookahead);
    }, [bpm, beatsPerMeasure, currentBeat, playClick]);

    const toggleMetronome = () => {
        if (!isPlaying) {
            if (!audioContext.current) {
                audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            setIsPlaying(true);
            setCurrentBeat(0);
            nextNoteTime.current = audioContext.current.currentTime + 0.05;
            scheduler();
        } else {
            setIsPlaying(false);
            if (timerID.current) clearTimeout(timerID.current);
        }
    };

    useEffect(() => {
        return () => {
            if (timerID.current) clearTimeout(timerID.current);
            if (audioContext.current && audioContext.current.state !== 'closed') {
                audioContext.current.close();
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-12 p-8 max-w-2xl mx-auto h-full">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-text-main/5 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-text-main shadow-xl">
                    <Music size={40} className={cn(isPlaying && "animate-bounce")} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-text-main">Metrônomo Virtual</h2>
                <p className="text-sm opacity-50 font-medium">Ajuste o tempo ideal para sua música</p>
            </div>

            <div className="w-full bg-card-main dark:bg-[#0D0D0D]/40 border border-border-main rounded-[40px] p-10 shadow-2xl backdrop-blur-xl space-y-12">
                {/* BPM Display */}
                <div className="text-center">
                    <motion.h1
                        key={bpm}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-8xl font-black tracking-tighter text-text-main"
                    >
                        {bpm}
                    </motion.h1>
                    <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30 mt-2">Batidas por Minuto</p>
                </div>

                {/* Visual Beats */}
                <div className="flex justify-center gap-3">
                    {[...Array(beatsPerMeasure)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: isPlaying && (currentBeat - 1 + beatsPerMeasure) % beatsPerMeasure === i ? 1.2 : 1,
                                backgroundColor: isPlaying && (currentBeat - 1 + beatsPerMeasure) % beatsPerMeasure === i
                                    ? "var(--text-main)"
                                    : "rgba(var(--text-main-rgb), 0.1)"
                            }}
                            className={cn(
                                "w-4 h-4 rounded-full border border-border-main transition-colors duration-100",
                                i === 0 && "w-6 h-6 border-2"
                            )}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setBpm(prev => Math.max(prev - 5, 20))}
                            className="p-4 bg-text-main/5 hover:bg-text-main/10 rounded-2xl border border-border-main transition-all active:scale-90"
                        >
                            <Minus size={24} />
                        </button>
                        <input
                            type="range"
                            min="20"
                            max="280"
                            value={bpm}
                            onChange={(e) => setBpm(parseInt(e.target.value))}
                            className="flex-1 accent-text-main h-2 bg-text-main/10 rounded-full appearance-none cursor-pointer"
                        />
                        <button
                            onClick={() => setBpm(prev => Math.min(prev + 5, 280))}
                            className="p-4 bg-text-main/5 hover:bg-text-main/10 rounded-2xl border border-border-main transition-all active:scale-90"
                        >
                            <Plus size={24} />
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={toggleMetronome}
                            className={cn(
                                "flex-1 py-6 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95",
                                isPlaying
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-text-main text-bg-main hover:opacity-90"
                            )}
                        >
                            {isPlaying ? <Square size={24} /> : <Play size={24} />}
                            {isPlaying ? "PARAR" : "INICIAR"}
                        </button>

                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-black opacity-30 uppercase text-center">Compasso</p>
                            <div className="flex gap-2">
                                {[2, 3, 4, 6].map(b => (
                                    <button
                                        key={b}
                                        onClick={() => setBeatsPerMeasure(b)}
                                        className={cn(
                                            "w-12 h-12 rounded-xl border font-bold transition-all",
                                            beatsPerMeasure === b
                                                ? "bg-text-main text-bg-main border-text-main"
                                                : "bg-text-main/5 border-border-main hover:bg-text-main/10"
                                        )}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
