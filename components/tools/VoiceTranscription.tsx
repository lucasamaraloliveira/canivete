"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, RotateCcw, Copy, Check, Info, ArrowRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VoiceTranscription() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isSupported, setIsSupported] = useState<boolean | null>(null);
    const [copied, setCopied] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'pt-BR';

            recognitionRef.current.onresult = (event: any) => {
                let interim = '';
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                if (final) setTranscript(prev => prev + ' ' + final);
                setInterimTranscript(interim);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setIsSupported(false);
        }
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    }, [isListening]);

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
    };

    if (isSupported === false) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                    <MicOff size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Navegador Não Suportado</h3>
                <p className="opacity-60 max-w-sm">
                    Desculpe, a Web Speech API não é suportada neste navegador. Tente usar o Google Chrome ou Microsoft Edge.
                </p>
            </div>
        );
    }

    if (isSupported === null) return null; // Wait for client-side check

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-text-main/5 border border-border-main rounded-[40px] shadow-2xl overflow-hidden relative">
                <div className={cn(
                    "absolute inset-0 bg-blue-500/5 transition-opacity duration-1000",
                    isListening ? "opacity-100 animate-pulse" : "opacity-0"
                )} />

                <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                        "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-xl",
                        isListening ? "bg-red-500 text-white animate-bounce-slow" : "bg-text-main text-bg-main"
                    )}>
                        {isListening ? <Mic size={32} /> : <MicOff size={32} />}
                    </div>
                    <div>
                        <h3 className="font-black text-2xl leading-tight">Gravador de Notas</h3>
                        <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 italic">
                            {isListening ? "Escutando agora..." : "Clique para começar a gravar"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={toggleListening}
                        className={cn(
                            "px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95 shadow-lg",
                            isListening ? "bg-red-500 text-white hover:bg-red-600" : "bg-text-main text-bg-main"
                        )}
                    >
                        {isListening ? <><Pause size={18} /> Parar</> : <><Play size={18} /> Começar</>}
                    </button>
                    <button
                        onClick={clearTranscript}
                        className="p-4 bg-text-main/5 hover:bg-text-main/10 rounded-2xl transition-all"
                        title="Limpar tudo"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Transcrição em Tempo Real</label>
                    {transcript && (
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-1.5 bg-text-main text-bg-main rounded-xl text-xs font-bold transition-all"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copiar Tudo' : 'Copiar'}
                        </button>
                    )}
                </div>
                <div className="flex-1 bg-text-main/[0.02] border border-border-main border-dashed rounded-[40px] overflow-hidden relative">
                    <div className="h-full overflow-y-auto custom-scrollbar p-8">
                        <div className="space-y-4 max-w-4xl mx-auto">
                            <p className="text-lg font-medium leading-relaxed opacity-90 whitespace-pre-wrap">
                                {transcript}
                                <span className="opacity-40">{interimTranscript}</span>
                                {!transcript && !interimTranscript && (
                                    <span className="opacity-20 italic">A sua fala aparecerá aqui conforme você fala...</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/5 p-6 rounded-[32px] border border-blue-500/10 flex items-center gap-4">
                <Info size={20} className="text-blue-500" />
                <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed italic opacity-80">
                    Dica: Você pode usar esta ferramenta para transcrever reuniões, aulas ou apenas ditar pensamentos rápidos.
                    A privacidade é garantida pois o processamento ocorre no próprio navegador (usando Google Speech Services).
                </p>
            </div>
        </div>
    );
}
