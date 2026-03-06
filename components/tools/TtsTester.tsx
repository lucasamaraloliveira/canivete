'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Square, Settings2, Sliders, RefreshCw, Layers, Mic, VolumeX, MessageSquare, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

import { CustomSelect } from '../CustomSelect';

export function TtsTester() {
    const [text, setText] = useState('Olá! Este é um teste do sistema de sintetização de voz do seu navegador. Como posso ajudar hoje?');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [pitch, setPitch] = useState(1);
    const [rate, setRate] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;
        const loadVoices = () => {
            const availableVoices = synthRef.current?.getVoices() || [];
            setVoices(availableVoices);
            // Default to first local voice if nothing selected
            if (availableVoices.length > 0 && !selectedVoice) {
                const preferred = availableVoices.find(v => v.lang.startsWith('pt')) || availableVoices[0];
                setSelectedVoice(preferred.name);
            }
        };

        loadVoices();
        if (synthRef.current?.onvoiceschanged !== undefined) {
            synthRef.current.onvoiceschanged = loadVoices;
        }

        return () => {
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    const speak = () => {
        if (!synthRef.current || !text) return;

        synthRef.current.cancel(); // Stop any current speech

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;

        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = volume;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const stop = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Texto para Voz (TTS)</label>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-[2px]">Speech Synthesis API</span>
                        </div>
                    </div>

                    <div className="bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden min-h-[400px] flex flex-col relative group">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Digite algo para ser lido..."
                            className="flex-1 bg-transparent p-12 text-2xl font-black italic tracking-tight placeholder:opacity-10 outline-none resize-none leading-relaxed custom-scrollbar"
                        />
                        <div className="absolute bottom-12 right-12 flex gap-4">
                            <button
                                onClick={isSpeaking ? stop : speak}
                                className={cn(
                                    "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 group/btn relative",
                                    isSpeaking ? "bg-red-500 text-white" : "bg-text-main text-bg-main"
                                )}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-[28px]" />
                                {isSpeaking ? <Square size={32} /> : <Play size={32} className="ml-1" />}
                            </button>
                        </div>
                        {isSpeaking && (
                            <div className="absolute top-12 right-12 flex gap-1 items-center">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-1 h-8 bg-text-main/20 rounded-full animate-voice-bar-${i}`} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Ajustes da Voz</label>
                    <div className="bg-card-main border border-border-main p-8 rounded-[40px] flex flex-col gap-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Voz do Sistema</label>
                                <CustomSelect
                                    value={selectedVoice}
                                    onChange={setSelectedVoice}
                                    options={voices.map(v => ({ label: `${v.name} (${v.lang})`, value: v.name }))}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Velocidade (Rate)</label>
                                    <span className="text-sm font-black italic">{rate.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range" min="0.5" max="2" step="0.1" value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Tom (Pitch)</label>
                                    <span className="text-sm font-black italic">{pitch.toFixed(1)}</span>
                                </div>
                                <input
                                    type="range" min="0" max="2" step="0.1" value={pitch}
                                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-1">
                                    <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">Volume</label>
                                    <span className="text-sm font-black italic">{Math.round(volume * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.1" value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-full accent-text-main h-2 bg-text-main/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => { setPitch(1); setRate(1); setVolume(1); }}
                            className="w-full py-4 border-2 border-text-main/10 hover:bg-text-main/5 text-text-main rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} /> Resetar Padrões
                        </button>
                    </div>

                    <div className="p-8 bg-blue-500/5 rounded-[40px] border border-blue-500/10 flex items-start gap-4">
                        <div className="w-10 h-10 bg-card-main rounded-2xl flex items-center justify-center shadow-sm text-blue-500 shrink-0">
                            <MessageSquare size={20} />
                        </div>
                        <p className="text-[10px] font-medium text-blue-600/60 leading-relaxed uppercase tracking-wider">
                            As vozes disponíveis variam conforme seu sistema operacional (Windows, macOS ou Mobile).
                        </p>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes voice-bar {
                    0%, 100% { height: 10px; opacity: 0.3; }
                    50% { height: 32px; opacity: 1; }
                }
                .animate-voice-bar-1 { animation: voice-bar 0.5s ease-in-out infinite; }
                .animate-voice-bar-2 { animation: voice-bar 0.7s ease-in-out infinite; }
                .animate-voice-bar-3 { animation: voice-bar 0.4s ease-in-out infinite; }
                .animate-voice-bar-4 { animation: voice-bar 0.6s ease-in-out infinite; }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15);
                }
            `}} />
        </div>
    );
}
