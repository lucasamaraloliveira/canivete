'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Save, Trash2, Copy, Check, History, Layers, Volume2, RotateCcw, Brain, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SttNotebook() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [history, setHistory] = useState<{ id: string, text: string, time: string }[]>([]);
    const [copied, setCopied] = useState(false);
    const recognitionRef = useRef<any>(null);

    const isListeningRef = useRef(false);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition && !recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'pt-BR';

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onend = () => {
                if (isListeningRef.current) {
                    try {
                        recognitionRef.current.start();
                    } catch (e) {
                        console.error('Failed to restart recognition:', e);
                    }
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                if (event.error === 'no-speech') return;
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                isListeningRef.current = false;
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            isListeningRef.current = false;
            setIsListening(false);
            recognitionRef.current?.stop();
        } else {
            isListeningRef.current = true;
            setIsListening(true);
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error('Start error:', e);
            }
        }
    };

    const saveNote = () => {
        if (!transcript.trim()) return;
        const newNote = {
            id: Math.random().toString(36).substr(2, 9),
            text: transcript,
            time: new Date().toLocaleTimeString()
        };
        setHistory([newNote, ...history]);
        setTranscript('');
        isListeningRef.current = false;
        setIsListening(false);
        recognitionRef.current?.stop();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Transcrição ao Vivo</label>
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-full border transition-all",
                            isListening ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "bg-text-main/5 border-border-main/10 opacity-30"
                        )}>
                            <div className={cn("w-2 h-2 rounded-full", isListening ? "bg-red-500" : "bg-text-main")} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{isListening ? 'Gravando Áudio' : 'Microfone Inativo'}</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-card-main border border-border-main rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative">
                        <div className="flex-1 p-12 text-2xl font-black italic tracking-tight leading-relaxed placeholder:opacity-5 overflow-auto custom-scrollbar">
                            {transcript || <span className="opacity-10">O que você disser será exibido aqui em tempo real...</span>}
                        </div>

                        <div className="p-12 pt-0 flex justify-center gap-6">
                            <button
                                onClick={toggleListening}
                                className={cn(
                                    "w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 relative group",
                                    isListening ? "bg-red-500 text-white" : "bg-text-main text-bg-main"
                                )}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                                {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                            </button>

                            {transcript && (
                                <button
                                    onClick={saveNote}
                                    className="w-24 h-24 bg-card-main border-2 border-text-main text-text-main rounded-[32px] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Save size={32} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <label className="text-sm font-bold text-text-main/60 uppercase tracking-wider">Histórico de Notas</label>
                    <div className="flex-1 bg-card-main border border-border-main rounded-[40px] shadow-sm flex flex-col overflow-hidden">
                        <div className="p-8 flex-1 overflow-auto custom-scrollbar space-y-6">
                            {history.length > 0 ? history.map((note) => (
                                <div key={note.id} className="group p-6 bg-text-main/5 rounded-3xl border border-border-main/5 hover:border-text-main/20 transition-all space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black opacity-30 uppercase tracking-widest">
                                        <span>{note.time}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => copyToClipboard(note.text)} className="hover:text-text-main transition-colors">
                                                <Copy size={12} />
                                            </button>
                                            <button onClick={() => setHistory(history.filter(h => h.id !== note.id))} className="hover:text-red-500 transition-colors">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed">{note.text}</p>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <History size={48} className="mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs">Sem histórico</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-text-main/5 border border-border-main/10 p-8 rounded-[40px] flex gap-4">
                        <div className="w-10 h-10 bg-text-main text-bg-main rounded-2xl flex items-center justify-center shrink-0">
                            <Brain size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Privacidade</h4>
                            <p className="text-[10px] font-medium opacity-40 uppercase leading-relaxed tracking-wider">
                                O áudio é processado localmente pelo navegador (Web Speech API). Nada é gravado em servidores externos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
