'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Radio, Play, Pause, Square, Trash2, Volume2, Lightbulb, Zap, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const MORSE_MAP: Record<string, string> = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
    'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
    'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
    'y': '-.--', 'z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

export function MorseCodeFlasher() {
    const [text, setText] = useState('');
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [isLightOn, setIsLightOn] = useState(false);
    const [useSound, setUseSound] = useState(true);
    const [speed, setSpeed] = useState(100); // 100ms unit
    const audioCtx = useRef<AudioContext | null>(null);
    const multiplierRef = useRef<number>(1);
    const transRef = useRef<boolean>(false);

    const morse = text.toLowerCase().split('').map(char => MORSE_MAP[char] || '').join(' ');

    const transmit = async () => {
        if (!text || isTransmitting) return;
        setIsTransmitting(true);
        transRef.current = true;

        const units = morse.split('');

        for (const unit of units) {
            if (!transRef.current) break;

            if (unit === '.') {
                await flashToggle(1);
            } else if (unit === '-') {
                await flashToggle(3);
            } else if (unit === ' ') {
                await wait(2);
            } else if (unit === '/') {
                await wait(6);
            }
            await wait(1); // Gap between units
        }

        setIsTransmitting(false);
        transRef.current = false;
        setIsLightOn(false);
    };

    const flashToggle = async (multiplier: number) => {
        multiplierRef.current = multiplier;
        if (useSound) playTone(true);
        setIsLightOn(true);
        await wait(multiplier);
        setIsLightOn(false);
    };

    const wait = (multiplier: number) => new Promise(resolve => setTimeout(resolve, multiplier * speed));

    const playTone = (on: boolean) => {
        if (!on) {
            // No action needed for 'off' if we handle duration via multiplier in flashToggle
            return;
        }

        try {
            if (!audioCtx.current) {
                audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const ctx = audioCtx.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);

            // Envelope to avoid popping sounds
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);

            const duration = (multiplierRef.current || 1) * speed / 1000;
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error("Audio error:", e);
        }
    };

    const stopTransmission = () => {
        setIsTransmitting(false);
        transRef.current = false;
        setIsLightOn(false);
        if (audioCtx.current) {
            audioCtx.current.close().catch(() => { });
            audioCtx.current = null;
        }
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[3px] opacity-30 flex items-center gap-2">
                            <Radio size={12} /> Mensagem p/ Transmissão
                        </label>
                        <div className="relative">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="SOS..."
                                className="w-full h-32 bg-text-main/5 border border-border-main p-6 rounded-[32px] shadow-inner outline-none focus:ring-4 focus:ring-text-main/5 transition-all resize-none text-xl font-medium placeholder:opacity-20 custom-scrollbar uppercase"
                            />
                            <div className="absolute bottom-4 right-4 text-[10px] font-mono opacity-20 bg-text-main text-bg-main px-2 py-1 rounded">
                                {morse.length} SIMBOLOS
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "flex-1 rounded-[48px] border-4 transition-all duration-75 flex flex-col items-center justify-center gap-8 shadow-2xl relative overflow-hidden",
                        isLightOn ? "bg-yellow-400 border-yellow-500 shadow-yellow-500/20" : "bg-text-main border-transparent"
                    )}>
                        {isLightOn && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                        <Lightbulb size={120} className={cn("transition-all duration-75", isLightOn ? "text-white scale-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" : "text-bg-main opacity-20")} />
                        <div className={cn("px-8 py-4 rounded-full font-black text-2xl tracking-[10px] transition-all", isLightOn ? "bg-white/20 text-white" : "bg-bg-main/10 text-bg-main opacity-20")}>
                            {isLightOn ? "ON" : "OFF"}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Centro de Sinalização</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Velocidade (Unidade)</label>
                                    <span className="text-sm font-black italic">{speed}ms</span>
                                </div>
                                <input
                                    type="range" min="50" max="500" step="10" value={speed}
                                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-text-main/5 rounded-2xl border border-border-main/5">
                                <div className="flex items-center gap-3">
                                    <Volume2 size={16} className="opacity-40" />
                                    <span className="text-xs font-bold opacity-60 uppercase tracking-wider">Som de Sinal</span>
                                </div>
                                <button
                                    onClick={() => setUseSound(!useSound)}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-all duration-300",
                                        useSound ? "bg-blue-500" : "bg-text-main/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full transition-all duration-300",
                                        useSound ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                disabled={!text || isTransmitting}
                                onClick={transmit}
                                className="w-full py-5 bg-text-main text-bg-main rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                            >
                                <Send size={20} /> Iniciar Transmissão
                            </button>
                            {isTransmitting && (
                                <button
                                    onClick={stopTransmission}
                                    className="w-full py-5 bg-red-500 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Square size={20} /> Abortar
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-yellow-500/5 border border-yellow-500/10 p-8 rounded-[40px] flex flex-col gap-4">
                        <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-yellow-600/60">
                            <Zap size={14} /> Flash de Emergência
                        </div>
                        <p className="text-xs font-medium opacity-40 leading-relaxed uppercase tracking-wider leading-relaxed">
                            O Morse é universal. Esta ferramenta transforma seu monitor em uma lanterna de sinalização de alta intensidade.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
