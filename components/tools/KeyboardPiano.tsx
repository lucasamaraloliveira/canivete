import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Volume2, Info, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const WHITE_KEYS = [
    { note: 'C4', key: 'a', freq: 261.63 },
    { note: 'D4', key: 's', freq: 293.66 },
    { note: 'E4', key: 'd', freq: 329.63 },
    { note: 'F4', key: 'f', freq: 349.23 },
    { note: 'G4', key: 'g', freq: 392.00 },
    { note: 'A4', key: 'h', freq: 440.00 },
    { note: 'B4', key: 'j', freq: 493.88 },
    { note: 'C5', key: 'k', freq: 523.25 },
];

const BLACK_KEYS = [
    { note: 'C#4', key: 'w', freq: 277.18, gapIndex: 1 },
    { note: 'D#4', key: 'e', freq: 311.13, gapIndex: 2 },
    { note: 'F#4', key: 't', freq: 369.99, gapIndex: 4 },
    { note: 'G#4', key: 'y', freq: 415.30, gapIndex: 5 },
    { note: 'A#4', key: 'u', freq: 466.16, gapIndex: 6 },
];

const ALL_KEYS = [...WHITE_KEYS, ...BLACK_KEYS];

export function KeyboardPiano() {
    const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
    const audioContext = useRef<AudioContext | null>(null);
    const oscillators = useRef<Map<string, { osc: OscillatorNode; gain: GainNode }>>(new Map());

    const playNote = useCallback((freq: number, note: string) => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (oscillators.current.has(note)) return;

        const osc = audioContext.current.createOscillator();
        const gain = audioContext.current.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);

        gain.gain.setValueAtTime(0, audioContext.current.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, audioContext.current.currentTime + 0.02);

        osc.connect(gain);
        gain.connect(audioContext.current.destination);

        osc.start();
        oscillators.current.set(note, { osc, gain });
        setActiveNotes(prev => new Set(prev).add(note));
    }, []);

    const stopNote = useCallback((note: string) => {
        const node = oscillators.current.get(note);
        if (node && audioContext.current) {
            const now = audioContext.current.currentTime;
            node.gain.gain.setValueAtTime(node.gain.gain.value, now);
            node.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            node.osc.stop(now + 0.4);
            oscillators.current.delete(note);
            setActiveNotes(prev => {
                const next = new Set(prev);
                next.delete(note);
                return next;
            });
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            const keyMap = ALL_KEYS.find(k => k.key === e.key.toLowerCase());
            if (keyMap) playNote(keyMap.freq, keyMap.note);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const keyMap = ALL_KEYS.find(k => k.key === e.key.toLowerCase());
            if (keyMap) stopNote(keyMap.note);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (audioContext.current && audioContext.current.state !== 'closed') {
                audioContext.current.close();
            }
        };
    }, [playNote, stopNote]);

    return (
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto gap-8 p-8 h-full">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-text-main/5 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-text-main shadow-inner">
                    <Music size={40} />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-text-main leading-none">Concert Piano</h2>
                <p className="text-sm opacity-50 font-medium tracking-tight">Síntese de áudio em tempo real de 44.1kHz</p>
            </div>

            <div className="w-full bg-card-main dark:bg-[#0D0D0D]/60 p-12 py-16 rounded-[48px] border border-border-main shadow-2xl backdrop-blur-2xl space-y-12 overflow-hidden flex flex-col items-center relative">

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-text-main/20 blur-2xl rounded-full" />

                <div className="relative w-full max-w-4xl h-80 bg-text-main/5 rounded-b-[32px] border-x-8 border-b-8 border-text-main/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-start p-4">

                    <div className="relative w-full h-[95%] flex gap-1 items-start bg-black/10 rounded-b-2xl overflow-hidden p-1">

                        {WHITE_KEYS.map((key, i) => (
                            <motion.div
                                key={key.note}
                                onMouseDown={() => playNote(key.freq, key.note)}
                                onMouseUp={() => stopNote(key.note)}
                                onMouseLeave={() => stopNote(key.note)}
                                animate={{
                                    backgroundColor: activeNotes.has(key.note) ? "var(--text-main)" : "rgba(255, 255, 255, 0.95)",
                                    y: activeNotes.has(key.note) ? 8 : 0,
                                    boxShadow: activeNotes.has(key.note)
                                        ? "inset 0 4px 10px rgba(0,0,0,0.3)"
                                        : "0 10px 15px rgba(0,0,0,0.1), inset 0 -4px 0 rgba(0,0,0,0.05)"
                                }}
                                className={cn(
                                    "relative z-10 flex-1 h-full rounded-b-xl transition-colors cursor-pointer flex flex-col items-center justify-end pb-8",
                                    i === 0 && "rounded-tl-lg",
                                    i === WHITE_KEYS.length - 1 && "rounded-tr-lg"
                                )}
                            >
                                <span className={cn(
                                    "font-black text-sm tracking-tighter opacity-20 transition-colors uppercase",
                                    activeNotes.has(key.note) ? "text-bg-main opacity-60" : "text-black"
                                )}>
                                    {key.key}
                                </span>
                            </motion.div>
                        ))}

                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="relative w-full h-full flex px-1">
                                {BLACK_KEYS.map((key) => {
                                    const leftPosition = (key.gapIndex / WHITE_KEYS.length) * 100;
                                    return (
                                        <motion.div
                                            key={key.note}
                                            onMouseDown={(e) => { e.stopPropagation(); playNote(key.freq, key.note); }}
                                            onMouseUp={() => stopNote(key.note)}
                                            onMouseLeave={() => stopNote(key.note)}
                                            style={{
                                                left: `calc(${leftPosition}% - 20px)`,
                                                width: '40px'
                                            }}
                                            animate={{
                                                y: activeNotes.has(key.note) ? 4 : 0,
                                                backgroundColor: activeNotes.has(key.note) ? "var(--text-main)" : "#1a1a1a",
                                                boxShadow: activeNotes.has(key.note)
                                                    ? "0 4px 5px rgba(0,0,0,0.5)"
                                                    : "0 10px 20px rgba(0,0,0,0.4), inset 0 -4px 0 rgba(255,255,255,0.05)"
                                            }}
                                            className={cn(
                                                "absolute h-[60%] rounded-b-lg pointer-events-auto cursor-pointer border border-white/5 flex items-end justify-center pb-4 transition-colors",
                                                activeNotes.has(key.note) ? "border-text-main/20" : "hover:bg-neutral-800"
                                            )}
                                        >
                                            <span className={cn(
                                                "font-black text-[10px] uppercase",
                                                activeNotes.has(key.note) ? "text-bg-main" : "text-white opacity-20"
                                            )}>
                                                {key.key}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="bg-text-main/5 px-8 py-3 rounded-full border border-border-main flex items-center gap-8 shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white border border-black/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">A S D F G H J K</span>
                        </div>
                        <div className="w-px h-4 bg-border-main" />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-black border border-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">W E T Y U</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-text-main/30 group">
                        <Keyboard size={20} className="group-hover:text-text-main transition-colors" />
                        <p className="text-xs font-black italic tracking-tight uppercase">Tocar no teclado para melhor experiência</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
